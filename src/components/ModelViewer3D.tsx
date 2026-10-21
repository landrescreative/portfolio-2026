import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import type { ComponentRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, useGLTF, ContactShadows } from "@react-three/drei";
import { RotateCw, Box, RefreshCw, ZoomIn, Palette } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projectsData } from "@/data/projectsData";
import { ArButton } from "@/components/ArButton";
import { useArMode, type ArAssets } from "@/lib/ar";

export interface ModelOption {
  id: string;
  name: { es: string; en: string };
  role: { es: string; en: string };
  url: string;
  originalSize: string;
  optimizedSize: string;
  isColored?: boolean;
  /** Native AR assets (GLB for Android, USDZ for iOS). Only when available. */
  ar?: ArAssets;
}

export const AFORE_MODELS: ModelOption[] = [
  {
    id: "personaje-1",
    name: { es: "Personaje 1 · Juventud", en: "Character 1 · Youth" },
    role: { es: "Peón Miniatura con Sudadera", en: "Hoodie Miniature Token" },
    url: "/models/personaje-1.glb",
    originalSize: "71.4 MB (STL)",
    optimizedSize: "43.5 MB (GLB)",
    isColored: true,
    ar: {
      glb: "/models/personaje-1.glb",
      usdz: "/models/ar/afore-personaje-1.usdz",
    },
  },
  {
    id: "personaje-2",
    name: { es: "Personaje 2 · Ejecutiva", en: "Character 2 · Executive" },
    role: { es: "Peón Miniatura con Abrigo Verde", en: "Green Overcoat Miniature Token" },
    url: "/models/personaje-2.glb",
    originalSize: "138.2 MB (STL)",
    optimizedSize: "57.0 MB (GLB)",
    isColored: true,
    ar: {
      glb: "/models/personaje-2.glb",
      usdz: "/models/ar/afore-personaje-2.usdz",
    },
  },
  {
    id: "personaje-3",
    name: { es: "Personaje 3 · Explorador", en: "Character 3 · Explorer" },
    role: { es: "Peón Miniatura con Lentes & Túnica", en: "Glasses & Tunic Miniature Token" },
    url: "/models/personaje-3.glb",
    originalSize: "145.0 MB (STL)",
    optimizedSize: "61.6 MB (GLB)",
    isColored: true,
    ar: {
      glb: "/models/personaje-3.glb",
      usdz: "/models/ar/afore-personaje-3.usdz",
    },
  },
  {
    id: "personaje-4",
    name: { es: "Personaje 4 · Silla de Ruedas", en: "Character 4 · Wheelchair" },
    role: { es: "Peón Miniatura Inclusivo STL", en: "Inclusive Wheelchair Miniature Token STL" },
    url: "/models/personaje-4.glb",
    originalSize: "49.7 MB (STL)",
    optimizedSize: "36.6 MB (GLB)",
    isColored: true,
    ar: {
      glb: "/models/personaje-4.glb",
      usdz: "/models/ar/afore-personaje-4.usdz",
    },
  },
];

export const CONEJO_MODELS: ModelOption[] = [
  {
    id: "conejo-art-toy",
    name: { es: "Conejo Jardinero · Art Toy", en: "Gardener Rabbit · Art Toy" },
    role: { es: "Escultura 3D Coleccionable", en: "Collectible 3D Sculpture" },
    url: "/models/conejomodelo.glb",
    originalSize: "40.8 MB (Blend)",
    optimizedSize: "3.8 MB (GLB)",
    isColored: true,
    ar: {
      glb: "/models/conejomodelo.glb",
      usdz: "/models/ar/art-toy-conejo.usdz",
    },
  },
  {
    id: "conejo-caja",
    name: { es: "Conejo Jardinero · Con Caja de Empaque", en: "Gardener Rabbit · In Packaging Box" },
    role: { es: "Edición Coleccionista con Empaque Translúcido", en: "Collector Edition with Packaging Box" },
    url: "/models/conejomodelo-caja.glb",
    originalSize: "40.8 MB (Blend)",
    optimizedSize: "8.8 MB (GLB)",
    isColored: true,
  },
];

export const SKINCARE_MODELS: ModelOption[] = [
  {
    id: "skincare-crema",
    name: { es: "VeraVitalize · Envase Cosmético 3D", en: "VeraVitalize · 3D Cosmetic Jar" },
    role: {
      es: "Envase Translúcido & Crema Interior",
      en: "Translucent Jar & Internal Cream",
    },
    url: "/models/skincare-crema.glb",
    originalSize: "5.8 MB",
    optimizedSize: "1.8 MB (GLB)",
    isColored: true,
  },
];

export const HOUSE_TOON_MODELS: ModelOption[] = [
  {
    id: "house-toon",
    name: { es: "Muelle Costero · Maqueta Toon", en: "Coastal Dock · Toon Diorama" },
    role: {
      es: "El Viejo y el Mar · Diorama 3D Estilizado",
      en: "The Old Man and the Sea · Stylized 3D Diorama",
    },
    url: "/models/maqueta-house-toon.glb",
    originalSize: "4.2 MB",
    optimizedSize: "1.0 MB (GLB)",
    isColored: true,
  },
];

export const INARTIVA_MODELS: ModelOption[] = [
  {
    id: "inartiva-chibi",
    name: { es: "Inartiva Chibi · Explorador Digital", en: "Inartiva Chibi · Digital Explorer" },
    role: {
      es: "Personaje 3D Estilizado & Shading Toon",
      en: "Stylized 3D Character & Toon Shading",
    },
    url: "/models/personaje-inartiva-solo.glb",
    originalSize: "2.5 MB",
    optimizedSize: "0.74 MB (GLB)",
    isColored: true,
  },
];

export type MatcapStyle = "default" | "clay" | "wax" | "ceramic" | "metallic" | "neon_dark";

export function createDynamicMatcapTexture(
  primaryColor: string,
  accentColor: string,
  style: MatcapStyle = "default",
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Parse hex colors to normalized [0, 1] RGB
  const parseHex = (hex: string): [number, number, number] => {
    const c = new THREE.Color(hex);
    return [c.r, c.g, c.b];
  };

  const [pr, pg, pb] = parseHex(primaryColor);
  const [ar, ag, ab] = parseHex(accentColor);

  // Key light direction (upper-right front)
  const L1x = 0.42,
    L1y = 0.62,
    L1z = 0.66;
  const len1 = Math.sqrt(L1x * L1x + L1y * L1y + L1z * L1z);
  const l1x = L1x / len1,
    l1y = L1y / len1,
    l1z = L1z / len1;

  // Fill light direction (lower-left front)
  const L2x = -0.52,
    L2y = -0.32,
    L2z = 0.5;
  const len2 = Math.sqrt(L2x * L2x + L2y * L2y + L2z * L2z);
  const l2x = L2x / len2,
    l2y = L2y / len2,
    l2z = L2z / len2;

  // Specular halfway vector (V = 0, 0, 1)
  const H1x = l1x,
    H1y = l1y,
    H1z = l1z + 1.0;
  const lenH = Math.sqrt(H1x * H1x + H1y * H1y + H1z * H1z);
  const h1x = H1x / lenH,
    h1y = H1y / lenH,
    h1z = H1z / lenH;

  const radius = size * 0.485;
  const center = size * 0.5;

  for (let y = 0; y < size; y++) {
    const py = (center - y) / radius;
    for (let x = 0; x < size; x++) {
      const px = (x - center) / radius;
      const r2 = px * px + py * py;
      const idx = (y * size + x) * 4;

      if (r2 > 1.0) {
        // Outside the sphere: soft anti-aliased edge or zero alpha
        const dist = Math.sqrt(r2);
        if (dist <= 1.03) {
          const edgeAlpha = Math.max(0, 1 - (dist - 1.0) / 0.03);
          data[idx] = Math.round(ar * 255 * 0.4);
          data[idx + 1] = Math.round(ag * 255 * 0.4);
          data[idx + 2] = Math.round(ab * 255 * 0.4);
          data[idx + 3] = Math.round(edgeAlpha * 255);
        } else {
          data[idx + 3] = 0;
        }
        continue;
      }

      const pz = Math.sqrt(1.0 - r2);

      // Diffuse terms
      let dotL1 = Math.max(0, px * l1x + py * l1y + pz * l1z);
      let dotL2 = Math.max(0, px * l2x + py * l2y + pz * l2z);

      // Specular parameters customized per material
      const dotH = Math.max(0, px * h1x + py * h1y + pz * h1z);
      let specTight = 0;
      let specSoft = 0;
      let rim = 0;
      let specR = 1.0,
        specG = 1.0,
        specB = 1.0;

      if (style === "clay") {
        dotL1 = dotL1 * 0.88 + 0.12;
        specTight = Math.pow(dotH, 18) * 0.42;
        specSoft = Math.pow(dotH, 6) * 0.22;
        rim = Math.pow(1.0 - pz, 2.6) * 0.72;
        specR = 1.0;
        specG = 0.94;
        specB = 0.86;
      } else if (style === "wax") {
        specTight = Math.pow(dotH, 34) * 1.15;
        specSoft = Math.pow(dotH, 10) * 0.38;
        rim = Math.pow(1.0 - pz, 1.85) * 1.35;
      } else if (style === "ceramic") {
        specTight = Math.pow(dotH, 54) * 1.45;
        specSoft = Math.pow(dotH, 14) * 0.32;
        rim = Math.pow(1.0 - pz, 2.2) * 1.18;
      } else if (style === "metallic") {
        specTight = Math.pow(dotH, 60) * 1.55;
        specSoft = Math.pow(dotH, 12) * 0.4;
        rim = Math.pow(1.0 - pz, 2.0) * 1.4;
        specR = 1.0;
        specG = 0.92;
        specB = 0.75;
      } else if (style === "neon_dark") {
        // Dark Obsidian Toon Shader with High-Intensity Neon Rim Glow
        dotL1 = Math.pow(dotL1, 2.2) * 0.4;
        dotL2 = dotL2 * 0.2;
        specTight = Math.pow(dotH, 50) * 1.6;
        specSoft = Math.pow(dotH, 12) * 0.35;
        rim = Math.pow(1.0 - pz, 1.7) * 2.6 + Math.pow(1.0 - pz, 4.0) * 1.8;
        specR = ar;
        specG = ag;
        specB = ab; // Specular shines with accent neon color
      } else {
        specTight = Math.pow(dotH, 42) * 1.3;
        specSoft = Math.pow(dotH, 12) * 0.35;
        rim = Math.pow(1.0 - pz, 2.2) * 1.25;
      }

      const fresnel = Math.pow(1.0 - pz, 2.2);
      const iridShift = Math.sin(fresnel * Math.PI * 1.5 + py * 0.8) * 0.5 + 0.5;
      const mixRatio = Math.min(1, fresnel * 0.65 + iridShift * 0.35);

      const cr = pr * (1 - mixRatio) + ar * mixRatio;
      const cg = pg * (1 - mixRatio) + ag * mixRatio;
      const cb = pb * (1 - mixRatio) + ab * mixRatio;

      const aoMult = style === "clay" ? 0.82 : 0.78;
      const aoBase = style === "clay" ? 0.26 : 0.22;
      const ao = aoBase + aoMult * Math.sqrt(Math.max(0, py * 0.5 + 0.5));

      let r = 0,
        g = 0,
        b = 0;
      if (style === "neon_dark") {
        const neonFresnel = Math.min(1.0, Math.pow(1.0 - pz, 1.8) * 1.6);
        r =
          pr * (1.0 - neonFresnel) * 0.4 +
          dotL1 * pr * 0.3 +
          ar * neonFresnel * 1.6 +
          (specTight + specSoft) * specR * 1.5;
        g =
          pg * (1.0 - neonFresnel) * 0.4 +
          dotL1 * pg * 0.3 +
          ag * neonFresnel * 1.6 +
          (specTight + specSoft) * specG * 1.5;
        b =
          pb * (1.0 - neonFresnel) * 0.4 +
          dotL1 * pb * 0.3 +
          ab * neonFresnel * 1.6 +
          (specTight + specSoft) * specB * 1.5;
      } else {
        r =
          (0.12 * pr +
            dotL1 * cr * 1.15 +
            dotL2 * ar * 0.35 +
            rim * ar * 0.95 +
            (specTight + specSoft) * specR * 1.4) *
          ao;
        g =
          (0.12 * pg +
            dotL1 * cg * 1.15 +
            dotL2 * ag * 0.35 +
            rim * ag * 0.95 +
            (specTight + specSoft) * specG * 1.4) *
          ao;
        b =
          (0.12 * pb +
            dotL1 * cb * 1.15 +
            dotL2 * ab * 0.35 +
            rim * ab * 0.95 +
            (specTight + specSoft) * specB * 1.4) *
          ao;
      }

      let alpha = 1.0;
      if (r2 > 0.96) {
        alpha = Math.max(0, Math.min(1, (1.0 - r2) / 0.04));
      }

      data[idx] = Math.min(255, Math.max(0, Math.round(r * 255)));
      data[idx + 1] = Math.min(255, Math.max(0, Math.round(g * 255)));
      data[idx + 2] = Math.min(255, Math.max(0, Math.round(b * 255)));
      data[idx + 3] = Math.round(alpha * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const matcapCache = new Map<string, THREE.CanvasTexture>();
export function getOrCreateDynamicMatcap(
  primaryColor: string,
  accentColor: string,
  style: MatcapStyle = "default",
): THREE.CanvasTexture {
  const key = `${primaryColor}_${accentColor}_${style}`;
  let tex = matcapCache.get(key);
  if (!tex) {
    tex = createDynamicMatcapTexture(primaryColor, accentColor, style);
    matcapCache.set(key, tex);
  }
  return tex;
}

interface FinishConfig {
  id: string;
  name: { es: string; en: string };
  color: string;
  accentColor?: string;
  matcapStyle?: MatcapStyle;
  roughness: number;
  metalness: number;
  badgeColor: string;
  isNativeOriginal?: boolean;
  isDynamicMatcap?: boolean;
}

export const INARTIVA_FINISHES: FinishConfig[] = [
  {
    id: "neon-cyan",
    name: { es: "Neón Cyan · Glow Eléctrico", en: "Cyan Neon · Electric Glow" },
    color: "#030712",
    accentColor: "#00e5ff",
    matcapStyle: "neon_dark",
    roughness: 0.1,
    metalness: 0.1,
    badgeColor: "bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]",
    isDynamicMatcap: true,
  },
  {
    id: "neon-pink",
    name: { es: "Neón Rosa · Synthwave", en: "Pink Neon · Synthwave" },
    color: "#06010a",
    accentColor: "#f43f5e",
    matcapStyle: "neon_dark",
    roughness: 0.1,
    metalness: 0.1,
    badgeColor: "bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]",
    isDynamicMatcap: true,
  },
  {
    id: "neon-gold",
    name: { es: "Neón Oro · Solar Core", en: "Gold Neon · Solar Core" },
    color: "#080602",
    accentColor: "#fbbf24",
    matcapStyle: "neon_dark",
    roughness: 0.1,
    metalness: 0.1,
    badgeColor: "bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]",
    isDynamicMatcap: true,
  },
  {
    id: "neon-emerald",
    name: { es: "Neón Esmeralda · Matrix", en: "Emerald Neon · Matrix" },
    color: "#020803",
    accentColor: "#10b981",
    matcapStyle: "neon_dark",
    roughness: 0.1,
    metalness: 0.1,
    badgeColor: "bg-[#10b981] shadow-[0_0_8px_#10b981]",
    isDynamicMatcap: true,
  },
  {
    id: "resin",
    name: { es: "Resina Estudio", en: "Studio Resin" },
    color: "#e8e3dc",
    roughness: 0.35,
    metalness: 0.05,
    badgeColor: "bg-[#e8e3dc]",
  },
];

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
  modelId,
  finish,
  autoRotate,
}: {
  url: string;
  modelId: string;
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

    const isInartiva = modelId === "inartiva-chibi" || url.includes("inartiva");

    let dynamicMatcap: THREE.CanvasTexture | null = null;
    if (finish.isDynamicMatcap && finish.accentColor) {
      dynamicMatcap = getOrCreateDynamicMatcap(
        finish.color || "#030712",
        finish.accentColor,
        finish.matcapStyle || "neon_dark",
      );
    }

    // Apply material adjustments
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (isInartiva) {
          const meshName = mesh.name.toLowerCase();
          const matName = Array.isArray(mesh.material)
            ? mesh.material.map((m) => m.name.toLowerCase()).join(" ")
            : mesh.material?.name?.toLowerCase() || "";

          // Inverted hull / black outline mesh check
          const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          if (origMat?.name === "Material.002" || meshName.includes("outline")) {
            mesh.visible = false;
            return;
          }

          // Node: 'anime chibi Base.001', Mesh: 'Object_0.001', Material: 'Material.013'
          const isEyes =
            meshName.includes(".001") || meshName.includes("eye") || matName.includes("013");
          const isChibiBody =
            (meshName.includes("chibi") ||
              meshName.includes("object_0") ||
              meshName.includes("base")) &&
            !isEyes;

          if (isEyes) {
            // Pure crisp white glowing anime eyes
            mesh.material = new THREE.MeshBasicMaterial({
              color: "#ffffff",
              side: THREE.DoubleSide,
            });
          } else if (isChibiBody && dynamicMatcap) {
            // Stylized obsidian toon shader with high-intensity neon rim glow
            mesh.material = new THREE.MeshMatcapMaterial({
              matcap: dynamicMatcap,
              side: THREE.DoubleSide,
            });
          } else if (finish.isNativeOriginal) {
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
            // Studio resin or monochrome finish
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(finish.color),
              roughness: finish.roughness,
              metalness: finish.metalness,
              side: THREE.DoubleSide,
            });
          }
        } else if (finish.isNativeOriginal) {
          // Keep embedded mesh materials with double-side rendering enabled and PBR safety
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (!mat) return;
            mat.side = THREE.DoubleSide;
            if (mat instanceof THREE.MeshStandardMaterial) {
              const nameLower = (mat.name || "").toLowerCase();
              const meshNameLower = mesh.name.toLowerCase();
              const isSkin =
                nameLower.includes("skin") ||
                meshNameLower.includes("head") ||
                meshNameLower.includes("face");

              if (isSkin) {
                mat.metalness = 0.0;
                mat.roughness = 0.55;
                // If skin color was unassigned / white fallback, assign natural warm skin tone
                if (mat.color.r > 0.92 && mat.color.g > 0.92 && mat.color.b > 0.92) {
                  mat.color.setRGB(0.854, 0.46, 0.365);
                }
              } else if (mat.metalness >= 0.95 && !mat.metalnessMap) {
                // Prevent missing glTF PBR default from causing pitch-black metallic voids
                mat.metalness = 0.05;
              }
            }
            mat.needsUpdate = true;
          });
        } else if (dynamicMatcap) {
          mesh.material = new THREE.MeshMatcapMaterial({
            matcap: dynamicMatcap,
            side: THREE.DoubleSide,
          });
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
  }, [scene, finish, modelId, url]);

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
      <span className="text-xs uppercase tracking-widest text-white/70">
        Cargando malla 3D optimizada...
      </span>
    </div>
  );
}

export function ModelViewer3D({ projectId }: { projectId?: string }) {
  const { lang, t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const arMode = useArMode();

  const modelList = useMemo(() => {
    if (projectId === "art-toy-conejo") return CONEJO_MODELS;
    if (projectId === "veravetalize") return SKINCARE_MODELS;
    if (projectId === "the-old-man-and-the-sea") return HOUSE_TOON_MODELS;
    if (projectId === "inartiva-studio") return INARTIVA_MODELS;
    if (projectId === "afore-personaje-1") return [AFORE_MODELS[0]];
    if (projectId === "afore-personaje-2") return [AFORE_MODELS[1]];
    if (projectId === "afore-personaje-3") return [AFORE_MODELS[2]];
    if (projectId === "afore-personaje-4") return [AFORE_MODELS[3]];
    if (projectId && projectsData[projectId]) {
      const proj = projectsData[projectId];
      return [
        {
          id: projectId,
          name: proj.title,
          role: proj.role,
          url: `/models/${projectId}.glb`,
          originalSize: "Malla 3D Optimizada",
          optimizedSize: "GLB PBR",
          isColored: true,
          ar: {
            glb: `/models/${projectId}.glb`,
            usdz: `/models/ar/${projectId}.usdz`,
          },
        },
      ];
    }
    return AFORE_MODELS;
  }, [projectId]);

  const hasColoredModel = useMemo(() => {
    return modelList.some((m) => m.isColored);
  }, [modelList]);

  const [selectedModelIdx, setSelectedModelIdx] = useState(0);

  const activeModel = modelList[selectedModelIdx] || modelList[0];

  // Available finishes: if Inartiva chibi, provide neon toon glow presets
  const availableFinishes = useMemo(() => {
    if (activeModel?.id === "inartiva-chibi") {
      return INARTIVA_FINISHES;
    }
    if (hasColoredModel) {
      return FINISHES; // includes "original"
    }
    // For AFORE models (pure STL scans), skip "original" since they don't have vertex/material colors
    return FINISHES.filter((f) => !f.isNativeOriginal);
  }, [activeModel?.id, hasColoredModel]);

  const [selectedFinish, setSelectedFinish] = useState<FinishConfig>(() => {
    const firstModel = modelList[0];
    if (firstModel?.id === "inartiva-chibi") return INARTIVA_FINISHES[0];
    return hasColoredModel ? FINISHES[0] : FINISHES[1];
  });
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let initialIdx = 0;
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryModel = params.get("model");
        const hashMatch = window.location.hash.match(/model=([a-zA-Z0-9_-]+)/);
        const targetModelId = queryModel || (hashMatch ? hashMatch[1] : null);

        if (targetModelId) {
          const foundIdx = modelList.findIndex((m) => m.id === targetModelId);
          if (foundIdx !== -1) {
            initialIdx = foundIdx;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    setSelectedModelIdx(initialIdx);
    const targetModel = modelList[initialIdx] || modelList[0];
    if (targetModel?.id === "inartiva-chibi") {
      setSelectedFinish(INARTIVA_FINISHES[0]);
    } else {
      setSelectedFinish(hasColoredModel ? FINISHES[0] : FINISHES[1]);
    }
  }, [projectId, hasColoredModel, modelList]);

  const handleModelChange = (idx: number) => {
    setSelectedModelIdx(idx);
    const targetModel = modelList[idx];
    if (targetModel?.id === "inartiva-chibi") {
      setSelectedFinish(INARTIVA_FINISHES[0]);
    } else if (selectedFinish.isDynamicMatcap) {
      setSelectedFinish(targetModel?.isColored ? FINISHES[0] : FINISHES[1]);
    }
  };

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
            title={t.ui.toggleAutoRotate}
          >
            <RotateCw
              className={`size-3.5 ${autoRotate ? "animate-spin" : ""}`}
              style={{ animationDuration: "8s" }}
            />
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="flex size-8 items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
            title={t.ui.resetCamera}
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
          <span className="sm:hidden">{t.ui.dragToOrbitTouch}</span>
          <span className="hidden sm:inline">{t.ui.dragToOrbit}</span>
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
              {/* Studio Lighting Setup with 360° Balanced Fill */}
              <ambientLight intensity={1.1} />
              <hemisphereLight intensity={0.75} groundColor="#2a221e" color="#ffffff" />
              {/* Main key light with soft shadow */}
              <directionalLight
                position={[5, 8, 5]}
                intensity={2.1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
              />
              {/* Front-left fill light so face/chest are always clearly visible when rotating */}
              <directionalLight position={[-4, 4, 5]} intensity={1.1} color="#f5f7fa" />
              {/* Subtle blue-ish fill light from side */}
              <directionalLight position={[-5, 3, -4]} intensity={0.8} color="#9ec0ff" />
              {/* Warm rim light from back */}
              <directionalLight position={[0, 4, -6]} intensity={1.4} color="#ffbe98" />

              <SingleModel
                key={`${activeModel.id}-${selectedFinish.id}`}
                url={activeModel.url}
                modelId={activeModel.id}
                finish={selectedFinish}
                autoRotate={autoRotate}
              />

              {/* Soft Contact Shadows on Floor */}
              <ContactShadows position={[0, -1.15, 0]} opacity={0.7} scale={4} blur={2} far={3} />

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

      {/* View in AR. Sits below the canvas so it never covers the model, and
          only renders on devices with a native AR viewer. */}
      {activeModel.ar && arMode !== "unsupported" && (
        <div className="flex justify-center">
          <ArButton
            assets={activeModel.ar}
            title={activeModel.name[lang] || activeModel.name.es}
            mode={arMode}
          />
        </div>
      )}

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
                  onClick={() => handleModelChange(idx)}
                  className={`group flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent text-canvas shadow-md scale-[1.02]"
                      : "border-ink/10 bg-surface text-ink hover:border-ink/30"
                  }`}
                >
                  <Box
                    className={`size-3.5 transition-transform group-hover:scale-110 ${isSelected ? "text-canvas" : "text-accent"}`}
                  />
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
              <span className="font-semibold text-ink">
                {activeModel.name[lang] || activeModel.name.es}
              </span>
              <span className="text-[10px] text-muted">({activeModel.optimizedSize})</span>
            </div>
          )}
        </div>

        {/* Finish Selector Pills (Col 9-12) */}
        <div className="flex items-center justify-start md:justify-end gap-2 md:col-span-4">
          <span className="text-[11px] uppercase tracking-wider text-muted font-medium mr-1">
            {t.ui.finishMaterial}
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
