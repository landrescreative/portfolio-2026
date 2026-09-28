import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, useGLTF, ContactShadows } from "@react-three/drei";
import { RotateCw, Box, RefreshCw, ZoomIn, Palette } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface ModelOption {
  id: string;
  name: { es: string; en: string };
  role: { es: string; en: string };
  url: string;
  originalSize: string;
  optimizedSize: string;
  isColored?: boolean;
}

export const AFORE_MODELS: ModelOption[] = [
  {
    id: "personaje-4",
    name: { es: "Personaje 4 — Inclusivo", en: "Character 4 — Inclusive" },
    role: { es: "Peón Miniatura en Silla de Ruedas", en: "Wheelchair Miniature Token" },
    url: "/models/personaje-4.glb",
    originalSize: "49.7 MB (STL)",
    optimizedSize: "1.13 MB (GLB)",
  },
  {
    id: "personaje-1",
    name: { es: "Personaje 1 — Juventud", en: "Character 1 — Youth" },
    role: { es: "Peón Miniatura con Sudadera", en: "Hoodie Miniature Token" },
    url: "/models/personaje-1.glb",
    originalSize: "71.4 MB (STL)",
    optimizedSize: "1.12 MB (GLB)",
  },
  {
    id: "personaje-2",
    name: { es: "Personaje 2 — Ejecutiva", en: "Character 2 — Professional" },
    role: { es: "Peón Miniatura con Abrigo", en: "Overcoat Miniature Token" },
    url: "/models/personaje-2.glb",
    originalSize: "145.0 MB (STL)",
    optimizedSize: "1.13 MB (GLB)",
  },
  {
    id: "personaje-3",
    name: { es: "Personaje 3 — Explorador", en: "Character 3 — Explorer" },
    role: { es: "Peón Miniatura de Aventura", en: "Adventure Miniature Token" },
    url: "/models/personaje-3.glb",
    originalSize: "133.5 MB (STL)",
    optimizedSize: "1.12 MB (GLB)",
  },
];

export const CONEJO_MODELS: ModelOption[] = [
  {
    id: "conejo-art-toy",
    name: { es: "Conejo Jardinero — Art Toy", en: "Gardener Rabbit — Art Toy" },
    role: { es: "Escultura 3D Coleccionable", en: "Collectible 3D Sculpture" },
    url: "/models/conejomodelo.glb",
    originalSize: "9.9 MB",
    optimizedSize: "9.9 MB (GLB)",
    isColored: true,
  },
];

export const POWERKICK_MODELS: ModelOption[] = [
  {
    id: "sneaker-airforce-2",
    name: { es: "Powerkick Sneaker Air Force 2", en: "Powerkick Sneaker Air Force 2" },
    role: { es: "Sneaker 3D Interactivo", en: "Interactive 3D Sneaker" },
    url: "/models/sneaker.glb",
    originalSize: "3.6 MB",
    optimizedSize: "3.6 MB (GLB)",
    isColored: true,
  },
];

interface FinishConfig {
  id: string;
  name: { es: string; en: string };
  color: string;
  roughness: number;
  metalness: number;
  badgeColor: string;
  isNativeOriginal?: boolean;
}

const FINISHES: FinishConfig[] = [
  {
    id: "original",
    name: { es: "Colores Originales", en: "Original Colors" },
    color: "#ffffff",
    roughness: 0.4,
    metalness: 0.05,
    badgeColor: "bg-gradient-to-tr from-emerald-400 via-amber-300 to-rose-400",
    isNativeOriginal: true,
  },
  {
    id: "resin",
    name: { es: "Resina Estudio", en: "Studio Resin" },
    color: "#e8e3dc",
    roughness: 0.35,
    metalness: 0.05,
    badgeColor: "bg-[#e8e3dc]",
  },
  {
    id: "slate",
    name: { es: "Filamento Grafito", en: "Graphite Filament" },
    color: "#282a30",
    roughness: 0.45,
    metalness: 0.15,
    badgeColor: "bg-[#282a30]",
  },
  {
    id: "terracotta",
    name: { es: "Terracota AFORE", en: "AFORE Terracotta" },
    color: "#e25c38",
    roughness: 0.4,
    metalness: 0.08,
    badgeColor: "bg-[#e25c38]",
  },
  {
    id: "bronze",
    name: { es: "Bronce Escultura", en: "Sculptural Bronze" },
    color: "#8a7560",
    roughness: 0.28,
    metalness: 0.65,
    badgeColor: "bg-[#8a7560]",
  },
];

function SingleModel({
  url,
  finish,
  autoRotate,
}: {
  url: string;
  finish: FinishConfig;
  autoRotate: boolean;
}) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    // Measure bounding box and normalize scale to 2.2 units
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = 2.2 / maxDim;
      clone.scale.set(scale, scale, scale);
    }

    // Apply material adjustments
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (finish.isNativeOriginal) {
          // Keep embedded mesh materials with double-side rendering enabled
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => {
              mat.side = THREE.DoubleSide;
              mat.needsUpdate = true;
            });
          } else if (mesh.material) {
            mesh.material.side = THREE.DoubleSide;
            mesh.material.needsUpdate = true;
          }
        } else {
          // Override with chosen monochrome finish
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(finish.color),
            roughness: finish.roughness,
            metalness: finish.metalness,
            side: THREE.DoubleSide,
          });
        }
      }
    });

    return clone;
  }, [scene, finish]);

  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={modelRef}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function LoaderIndicator() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#121316] z-20">
      <RefreshCw className="size-8 animate-spin text-accent" />
      <span className="text-xs uppercase tracking-widest text-white/70">Cargando malla 3D optimizada...</span>
    </div>
  );
}

export function ModelViewer3D({ projectId }: { projectId?: string }) {
  const { lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  
  const isRabbitProject = projectId === "art-toy-conejo";
  const isPowerkickProject = projectId === "powerkick";
  const hasColoredModel = isRabbitProject || isPowerkickProject;

  const modelList = useMemo(() => {
    if (isRabbitProject) return CONEJO_MODELS;
    if (isPowerkickProject) return POWERKICK_MODELS;
    return AFORE_MODELS;
  }, [isRabbitProject, isPowerkickProject]);

  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  // Available finishes: if model has native colors, allow Original Colors first
  const availableFinishes = useMemo(() => {
    if (hasColoredModel) {
      return FINISHES; // includes "original"
    }
    // For AFORE models (pure STL scans), skip "original" since they don't have vertex/material colors
    return FINISHES.filter((f) => !f.isNativeOriginal);
  }, [hasColoredModel]);

  const [selectedFinish, setSelectedFinish] = useState<FinishConfig>(
    hasColoredModel ? FINISHES[0] : FINISHES[1]
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedModelIdx(0);
    setSelectedFinish(hasColoredModel ? FINISHES[0] : FINISHES[1]);
  }, [projectId, hasColoredModel]);

  const activeModel = modelList[selectedModelIdx] || modelList[0];

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <section className="mb-24 flex flex-col gap-6 opacity-100">
      {/* Main 3D Canvas Box */}
      <div className="relative h-[560px] w-full overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-b from-[#18191c] to-[#0e0f11] shadow-2xl">
        {/* Floating Quick Controls (Top-Right) */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex size-8 items-center justify-center rounded-full text-xs transition-colors ${
              autoRotate ? "bg-accent text-white" : "text-white/60 hover:text-white"
            }`}
            title={lang === "es" ? "Alternar auto-rotación" : "Toggle auto-rotation"}
          >
            <RotateCw className={`size-3.5 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "8s" }} />
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="flex size-8 items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
            title={lang === "es" ? "Centrar vista" : "Reset camera"}
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>

        {/* Floating Model Info (Top-Left) */}
        <div className="absolute left-5 top-5 z-10 flex flex-col pointer-events-none">
          <span className="font-serif text-lg font-medium text-white tracking-wide">
            {activeModel.name[lang] || activeModel.name.es}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-accent">
            {activeModel.role[lang] || activeModel.role.es}
          </span>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-white/60">
            <span className="size-1.5 rounded-full bg-accent" />
            <span>{selectedFinish.name[lang] || selectedFinish.name.es}</span>
          </div>
        </div>

        {/* Orbit Instructions Cue (Bottom-Center) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none rounded-full border border-white/10 bg-black/40 px-4 py-1 text-[10px] font-medium tracking-wider text-white/60 backdrop-blur-md uppercase">
          {lang === "es" ? "Arrastra para rotar · Rueda para zoom" : "Drag to orbit · Scroll to zoom"}
        </div>

        {/* Three.js Canvas */}
        {mounted ? (
          <Suspense fallback={<LoaderIndicator />}>
            <Canvas
              shadows
              camera={{ position: [0, 0.3, 3.6], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
              className="h-full w-full cursor-grab active:cursor-grabbing"
            >
              {/* Studio Lighting Setup */}
              <ambientLight intensity={0.95} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={2.3}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              />
              {/* Subtle blue-ish fill light */}
              <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#9ec0ff" />
              {/* Warm rim light from back */}
              <directionalLight position={[0, 4, -6]} intensity={1.5} color="#ffbe98" />

              <SingleModel
                key={`${activeModel.id}-${selectedFinish.id}`}
                url={activeModel.url}
                finish={selectedFinish}
                autoRotate={autoRotate}
              />

              {/* Soft Contact Shadows on Floor */}
              <ContactShadows
                position={[0, -1.15, 0]}
                opacity={0.7}
                scale={4}
                blur={2}
                far={3}
              />

              <OrbitControls
                ref={controlsRef}
                enablePan={false}
                minDistance={1.4}
                maxDistance={6.0}
                target={[0, 0, 0]}
                dampingFactor={0.06}
              />
            </Canvas>
          </Suspense>
        ) : (
          <LoaderIndicator />
        )}
      </div>

      {/* Bottom Controls Bar: Model Selectors & Material Finishes */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Model Tabs (Col 1-8) */}
        <div className="flex flex-wrap gap-2 md:col-span-8">
          {modelList.length > 1 ? (
            modelList.map((model, idx) => {
              const isSelected = selectedModelIdx === idx;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModelIdx(idx)}
                  className={`group flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent text-canvas shadow-md scale-[1.02]"
                      : "border-ink/10 bg-surface text-ink hover:border-ink/30"
                  }`}
                >
                  <Box className={`size-3.5 transition-transform group-hover:scale-110 ${isSelected ? "text-canvas" : "text-accent"}`} />
                  <span className="font-semibold">{model.name[lang] || model.name.es}</span>
                  <span className={`text-[10px] ${isSelected ? "text-canvas/80" : "text-muted"}`}>
                    ({model.optimizedSize})
                  </span>
                </button>
              );
            })
          ) : (
            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-ink/10 bg-surface px-4 py-2.5 text-xs">
              <Box className="size-3.5 text-accent" />
              <span className="font-semibold text-ink">{activeModel.name[lang] || activeModel.name.es}</span>
              <span className="text-[10px] text-muted">({activeModel.optimizedSize})</span>
            </div>
          )}
        </div>

        {/* Finish Selector Pills (Col 9-12) */}
        <div className="flex items-center justify-start md:justify-end gap-2 md:col-span-4">
          <span className="text-[11px] uppercase tracking-wider text-muted font-medium mr-1">
            {lang === "es" ? "Acabado / Material:" : "Finish / Material:"}
          </span>
          {availableFinishes.map((finish) => {
            const isSelected = selectedFinish.id === finish.id;
            return (
              <button
                key={finish.id}
                type="button"
                onClick={() => setSelectedFinish(finish)}
                className={`group relative flex size-7 items-center justify-center rounded-full border transition-all ${
                  isSelected
                    ? "border-accent ring-2 ring-accent ring-offset-2 ring-offset-canvas scale-110"
                    : "border-ink/20 hover:scale-105"
                }`}
                title={finish.name[lang] || finish.name.es}
              >
                <span className={`size-5 rounded-full ${finish.badgeColor} shadow-inner`} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ModelViewer3D;

