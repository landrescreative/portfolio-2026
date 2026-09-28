import { useRef, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// 1. Define the GLSL Shader Material
const LiquidShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uDistortion: 0.45,
    uSpeed: 0.4,
    uColorMain: new THREE.Color("#ff5a00"),
    uColorSub: new THREE.Color("#121212"),
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uDistortion;
    uniform float uSpeed;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vNoise;
    varying vec3 vPosition;
    
    // Simplex 3D Noise function (Ashima Arts)
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    
    float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Generate noise based on position and time
      float noise = snoise(position * 1.5 + uTime * uSpeed);
      vNoise = noise;
      
      // Distort vertices along normals
      vec3 newPosition = position + normal * (noise * uDistortion);
      vPosition = newPosition;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorMain;
    uniform vec3 uColorSub;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vNoise;
    varying vec3 vPosition;

    void main() {
      // Fresnel effect for glowing edges
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 2.0);

      // Color mixing based on noise and fresnel
      float mixValue = smoothstep(-0.5, 0.5, vNoise) + fresnel * 0.5;
      vec3 finalColor = mix(uColorSub, uColorMain, mixValue);

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `
);

// Register it to R3F
extend({ LiquidShaderMaterial });

// Add types for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      liquidShaderMaterial: any;
    }
  }
}

const PALETTES = [
  { main: "#ff5a00", sub: "#121212" }, // Orange / Ink
  { main: "#0055ff", sub: "#000d26" }, // Deep Blue / Dark Navy
  { main: "#ff0066", sub: "#1a000a" }, // Neon Pink / Dark Red
  { main: "#555555", sub: "#0a0a0a" }, // Graphite / Black
];

function LiquidBlob() {
  const materialRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  
  // Interaction State
  const [paletteIdx, setPaletteIdx] = useState(0);
  const paletteIndexRef = useRef(0); // keep ref for useFrame sync
  const clickPulse = useRef(0);
  
  const { viewport } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    paletteIndexRef.current = paletteIdx;
  }, [paletteIdx]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleClick = () => {
      setPaletteIdx((prev) => (prev + 1) % PALETTES.length);
      clickPulse.current = 1.0;
      
      // Add a physical rotation impulse!
      // The inertia lerp in useFrame will smoothly decelerate it back to normal
      if (groupRef.current) {
        groupRef.current.rotation.x -= 0.3;
        groupRef.current.rotation.y += 0.3;
      }
    };
    
    const handleScroll = () => {
      const startScroll = 50;
      const endScroll = window.innerHeight * 0.7;
      let progress = (window.scrollY - startScroll) / (endScroll - startScroll);
      scrollRef.current = Math.max(0, Math.min(progress, 1));
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const liquidMaterial = useMemo(() => new LiquidShaderMaterial(), []);

  // Animation loop
  useFrame((state) => {
    const { clock } = state;
    const scroll = scrollRef.current;
    
    // Decay the pulse back to 0 smoothly
    clickPulse.current += (0 - clickPulse.current) * 0.05;
    
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
      
      // Interactive Shader Distortion: base + gentle puff from click
      const baseDistortion = 0.45;
      const targetDistortion = baseDistortion + (clickPulse.current * 0.3);
      
      // Removed the noise speed bump completely so it doesn't "spin" visually on click
      const targetSpeed = 0.4;
      
      materialRef.current.uDistortion += (targetDistortion - materialRef.current.uDistortion) * 0.1;
      materialRef.current.uSpeed += (targetSpeed - materialRef.current.uSpeed) * 0.1;

      // Smoothly transition to the current palette
      const currentPalette = PALETTES[paletteIndexRef.current];
      const targetColorMain = new THREE.Color(currentPalette.main);
      const targetColorSub = new THREE.Color(currentPalette.sub);
      
      materialRef.current.uColorMain.lerp(targetColorMain, 0.05);
      materialRef.current.uColorSub.lerp(targetColorSub, 0.05);
    }

    if (groupRef.current) {
      const isMobile = viewport.width < 5;
      
      // On mobile: center horizontally and float gracefully in the upper-middle area
      const heroX = isMobile ? 0 : viewport.width * 0.25;
      const heroY = isMobile 
        ? 0.8 + Math.sin(clock.getElapsedTime() * 0.6) * 0.15 
        : 0.5 + Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
      const heroScale = isMobile ? 1.0 : 1;
      const heroRotX = isMobile ? 0 : -mouse.current.y * 0.1;
      const heroRotY = isMobile ? 0 : mouse.current.x * 0.1;

      // Mouse Follow State (scroll = 1)
      // On mobile: maintain an ambient floating position rather than erratic touch-following
      const followX = isMobile ? 0 : mouse.current.x * (viewport.width / 2);
      const followY = isMobile ? 0.4 : mouse.current.y * (viewport.height / 2);
      const followScale = isMobile ? 0.85 : 0.8;
      const followRotX = isMobile ? 0 : -mouse.current.y * 0.15;
      const followRotY = isMobile ? 0 : mouse.current.x * 0.15;

      // Scale bump from click physics
      const clickScaleBump = 1.0 + (clickPulse.current * 0.2);

      const easeScroll = scroll * scroll * (3 - 2 * scroll);
      
      const targetX = THREE.MathUtils.lerp(heroX + (isMobile ? 0 : mouse.current.x * 0.3), followX, easeScroll);
      const targetY = THREE.MathUtils.lerp(heroY - (isMobile ? 0 : mouse.current.y * 0.3), followY, easeScroll);
      const targetScale = THREE.MathUtils.lerp(heroScale, followScale, easeScroll) * clickScaleBump;
      const targetRotX = THREE.MathUtils.lerp(heroRotX, followRotX, easeScroll);
      const targetRotY = THREE.MathUtils.lerp(heroRotY, followRotY, easeScroll);

      // Interpolation to current frame
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.1;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
      
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.02;
      groupRef.current.scale.setScalar(targetScale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.4, 128, 128]} />
        <primitive object={liquidMaterial} ref={materialRef} attach="material" transparent />
      </mesh>
    </group>
  );
}

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const updateVisuals = () => {
      if (!containerRef.current) return;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Constant ambient glow & blur on mobile
        containerRef.current.style.filter = "blur(32px)";
        containerRef.current.style.opacity = "0.5";
        return;
      }

      // Desktop: crisp in hero, blurs as user scrolls down
      const startScroll = 50;
      const endScroll = window.innerHeight * 0.7;
      let progress = (window.scrollY - startScroll) / (endScroll - startScroll);
      progress = Math.max(0, Math.min(progress, 1));
      
      const blur = progress * 24;
      const opacity = 1 - (progress * 0.6); 
      
      containerRef.current.style.filter = `blur(${blur}px)`;
      containerRef.current.style.opacity = `${opacity}`;
    };
    
    window.addEventListener("scroll", updateVisuals, { passive: true });
    window.addEventListener("resize", updateVisuals, { passive: true });
    updateVisuals(); 
    return () => {
      window.removeEventListener("scroll", updateVisuals);
      window.removeEventListener("resize", updateVisuals);
    };
  }, [mounted]);

  if (!mounted) return null;

  // Render via portal to escape CSS transform contexts from router layout
  // which otherwise breaks 'fixed' positioning.
  return ReactDOM.createPortal(
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 h-full w-full pointer-events-none will-change-[filter,opacity]"
      aria-hidden="true"
    >
      <Canvas 
        style={{ pointerEvents: "none" }}
        camera={{ position: [0, 0, 7], fov: 45 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }}
      >
        <LiquidBlob />
      </Canvas>
    </div>,
    document.body
  );
}