// Builds the augmented-reality assets (GLB + USDZ) from the web-optimised GLB.
//
//   node scripts/build-ar-assets.mjs [--only <id>]
//
// Why a separate build: the site's GLB are compressed with EXT_meshopt_compression
// + KHR_mesh_quantization, which the native AR viewers reject. Google's Scene
// Viewer (Android) only accepts KHR_materials_unlit and KHR_texture_transform,
// caps the file at 15 MB and rejects vertex colours; Apple's Quick Look (iOS)
// needs a .usdz. So we decode the geometry, re-scale each piece to its real
// world size (glTF: 1 unit = 1 metre), ground it on the floor and export a clean
// GLB plus a USDZ.
//
// Output goes to public/models/ar/. These files are never loaded with the page:
// the native viewer downloads them only when the visitor taps "View in AR".
//
// Uses only `three` (already a dependency): its GLTFLoader decodes Meshopt via
// the bundled decoder, and GLTFExporter / USDZExporter write plain glTF and USDZ.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { SimplifyModifier } from "three/examples/jsm/modifiers/SimplifyModifier.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "models", "ar");

// three's GLTFExporter packages the binary chunk with FileReader, which Node
// does not provide. This minimal shim covers the readAsArrayBuffer path it uses
// (no images are involved here, so the canvas paths never run).
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((result) => {
        this.result = result;
        if (typeof this.onloadend === "function") this.onloadend();
      });
    }
  };
}

// The exporter logs these on every primitive of a quantized source mesh. They
// are expected and harmless, so they are muted to keep the build output useful.
const EXPORTER_NOISE = [
  "THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.",
  "THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.",
];

function withQuietExporter(run) {
  const original = console.warn;
  console.warn = (...args) => {
    const message = String(args[0] ?? "");
    if (EXPORTER_NOISE.some((noise) => message.includes(noise))) return;
    original(...args);
  };
  return Promise.resolve()
    .then(run)
    .finally(() => {
      console.warn = original;
    });
}

/** Extensions the native AR viewers accept. Anything else would be rejected. */
const ALLOWED_EXTENSIONS = new Set(["KHR_materials_unlit", "KHR_texture_transform"]);

/**
 * One entry per model that gets an AR version.
 * `metres` is the real-world size of the model's longest side.
 * `decimate` is the share of (welded) vertices to remove, 0 to keep full detail.
 * The USDZ format is verbose, so a model with a very heavy mesh can be
 * simplified here without a visible difference at viewing distance.
 */
const MODELS = [
  {
    id: "art-toy-conejo",
    src: "public/models/conejomodelo.glb",
    out: "art-toy-conejo",
    metres: 0.18, // collectible art toy, ~18 cm
    decimate: 0.6,
  },
];

const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;

/** Reads the JSON chunk of a GLB and returns the glTF document. */
function readGlbJson(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const jsonLength = view.getUint32(12, true);
  const jsonBytes = buffer.subarray(20, 20 + jsonLength);
  return JSON.parse(new TextDecoder().decode(jsonBytes));
}

/** Loads a Meshopt-compressed GLB into a fully decoded three.js scene. */
async function loadScene(file) {
  const buffer = fs.readFileSync(file);
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  return new Promise((resolve, reject) => loader.parse(arrayBuffer, "", resolve, reject)).then(
    (gltf) => gltf.scene,
  );
}

/** Attributes that only matter with textures, which the AR copies do not have. */
const UNUSED_WITHOUT_TEXTURES = new Set(["uv", "uv1", "uv2", "uv3"]);

/**
 * Rebuilds a geometry with plain, non-interleaved float attributes. The source
 * GLB stores quantized, interleaved buffers (KHR_mesh_quantization), which the
 * simplifier and the exporters cannot handle directly. `getX` and friends
 * already return the dequantized value, so the components are copied as-is.
 * UV sets are dropped because the AR copies carry no textures.
 */
function toPlainGeometry(geometry) {
  const out = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    if (UNUSED_WITHOUT_TEXTURES.has(name)) continue;
    const { itemSize, count } = attribute;
    const array = new Float32Array(count * itemSize);
    for (let i = 0; i < count; i++) {
      array[i * itemSize] = attribute.getX(i);
      if (itemSize > 1) array[i * itemSize + 1] = attribute.getY(i);
      if (itemSize > 2) array[i * itemSize + 2] = attribute.getZ(i);
      if (itemSize > 3) array[i * itemSize + 3] = attribute.getW(i);
    }
    out.setAttribute(name, new THREE.Float32BufferAttribute(array, itemSize));
  }
  if (geometry.index) out.setIndex(geometry.index.clone());
  return out;
}

/**
 * Flattens the loaded hierarchy into a single group of meshes with their world
 * transform baked into the geometry. This removes the node scales the quantizer
 * left behind (some are negative, which USDZ cannot express) and gives the AR
 * viewers a plain, predictable asset.
 */
function bakeMeshes(scene) {
  scene.updateMatrixWorld(true);
  const group = new THREE.Group();
  scene.traverse((child) => {
    if (!child.isMesh) return;
    const geometry = toPlainGeometry(child.geometry);
    geometry.applyMatrix4(child.matrixWorld);
    const mesh = new THREE.Mesh(geometry, child.material);
    mesh.name = child.name;
    group.add(mesh);
  });
  return group;
}

/**
 * Welds duplicated vertices (the source meshes ship ~3x the needed vertices)
 * and, when asked, simplifies each mesh. Both keep the exported files small.
 */
function reduceMeshes(scene, removeRatio) {
  const modifier = new SimplifyModifier();
  let before = 0;
  let after = 0;
  scene.traverse((child) => {
    if (!child.isMesh) return;
    let geometry = mergeVertices(child.geometry, 1e-4);
    before += geometry.attributes.position.count;
    if (removeRatio > 0) {
      const remove = Math.floor(geometry.attributes.position.count * removeRatio);
      geometry = mergeVertices(modifier.modify(geometry, remove), 1e-4);
    }
    if (!geometry.attributes.normal) geometry.computeVertexNormals();
    after += geometry.attributes.position.count;
    child.geometry = geometry;
  });
  return { before, after };
}

/**
 * Scales the model to its real-world size and grounds it: centred on X/Z with
 * its base sitting on the floor (y = 0), which is how AR viewers expect a model
 * to be placed on a detected surface.
 */
function normalise(scene, metres) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? metres / maxDim : 1;
  scene.scale.setScalar(scale);

  scene.updateMatrixWorld(true);
  const scaled = new THREE.Box3().setFromObject(scene);
  const center = scaled.getCenter(new THREE.Vector3());
  scene.position.set(-center.x, -scaled.min.y, -center.z);
  scene.updateMatrixWorld(true);

  const finalSize = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
  return { scale, finalSize };
}

function describeMaterials(scene) {
  const seen = new Set();
  const out = [];
  scene.traverse((child) => {
    if (!child.isMesh) return;
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      if (!material || seen.has(material.uuid)) continue;
      seen.add(material.uuid);
      out.push({
        name: material.name || "(sin nombre)",
        color: "#" + new THREE.Color(material.color ?? 0xffffff).getHexString(),
        metalness: material.metalness ?? 0,
        roughness: material.roughness ?? 1,
        transparent: !!material.transparent,
        textures: material.map ? 1 : 0,
      });
    }
  });
  return out;
}

const mb = (bytes) => (bytes / 1048576).toFixed(2) + " MB";

fs.mkdirSync(OUT_DIR, { recursive: true });

const targets = MODELS.filter((m) => !only || m.id === only);
if (targets.length === 0) {
  console.error(`No model matches --only ${only}`);
  process.exit(1);
}

let failed = false;

for (const model of targets) {
  const srcPath = path.join(ROOT, model.src);
  if (!fs.existsSync(srcPath)) {
    console.error(`✗ ${model.id}: no existe ${model.src}`);
    failed = true;
    continue;
  }

  console.log(`\n▸ ${model.id}  (${model.src})`);
  const loaded = await loadScene(srcPath);
  const scene = bakeMeshes(loaded);

  const { before, after } = reduceMeshes(scene, model.decimate);
  console.log(
    `  vértices ${before.toLocaleString()} → ${after.toLocaleString()}` +
      (before === after ? " (soldados)" : ` (-${((1 - after / before) * 100).toFixed(0)}%)`),
  );

  const { scale, finalSize } = normalise(scene, model.metres);
  console.log(
    `  escala ×${scale.toFixed(4)} → ${finalSize.x.toFixed(3)} × ${finalSize.y.toFixed(3)} × ${finalSize.z.toFixed(3)} m`,
  );

  const materials = describeMaterials(scene);
  console.log(`  materiales: ${materials.length}`);
  for (const m of materials) {
    console.log(
      `    · ${m.name}  ${m.color}  metal ${m.metalness.toFixed(2)}  rough ${m.roughness.toFixed(2)}` +
        (m.transparent ? "  [alpha]" : "") +
        (m.textures ? "  [textura]" : ""),
    );
  }

  // ---- Clean GLB (Android / Scene Viewer) ----
  const glbExporter = new GLTFExporter();
  const glbBuffer = await withQuietExporter(() => glbExporter.parseAsync(scene, { binary: true }));
  const glbBytes = Buffer.from(glbBuffer);
  fs.writeFileSync(path.join(OUT_DIR, `${model.out}.glb`), glbBytes);

  const gltf = readGlbJson(glbBytes);
  const used = gltf.extensionsUsed || [];
  const unsupported = used.filter((e) => !ALLOWED_EXTENSIONS.has(e));
  const vertexColors = (gltf.meshes || []).some((mesh) =>
    (mesh.primitives || []).some((p) => p.attributes && p.attributes.COLOR_0 !== undefined),
  );
  const negativeScale = (gltf.nodes || []).some((node) =>
    (node.scale || [1, 1, 1]).some((s) => s < 0),
  );
  console.log(`  GLB  ${mb(glbBytes.length)}  extensiones: ${used.join(", ") || "ninguna"}`);
  if (unsupported.length) {
    console.error(`  ✗ extensiones no soportadas por AR: ${unsupported.join(", ")}`);
    failed = true;
  }
  if (vertexColors) {
    console.error("  ✗ el GLB usa COLOR_0 (vertex colors), Scene Viewer lo rechaza");
    failed = true;
  }
  if (negativeScale) {
    console.error("  ✗ el GLB conserva escalas negativas");
    failed = true;
  }
  if (glbBytes.length > 15 * 1048576) {
    console.error("  ✗ el GLB supera los 15 MB que admite Scene Viewer");
    failed = true;
  }

  // ---- USDZ (iOS / Quick Look) ----
  // Quick Look cannot render double-sided materials, so the USDZ is exported
  // single-sided to match. The GLB keeps double-sided for Scene Viewer.
  const restoreSides = [];
  scene.traverse((child) => {
    if (!child.isMesh) return;
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
      if (material && material.side !== THREE.FrontSide) {
        restoreSides.push([material, material.side]);
        material.side = THREE.FrontSide;
      }
    }
  });
  const usdzExporter = new USDZExporter();
  const usdzBuffer = await withQuietExporter(() => usdzExporter.parseAsync(scene));
  for (const [material, side] of restoreSides) material.side = side;
  const usdzBytes = Buffer.from(usdzBuffer);
  fs.writeFileSync(path.join(OUT_DIR, `${model.out}.usdz`), usdzBytes);
  const magic = usdzBytes.subarray(0, 2).toString();
  console.log(`  USDZ ${mb(usdzBytes.length)}  magic: ${JSON.stringify(magic)}`);
  if (magic !== "PK") {
    console.error("  ✗ el USDZ no parece válido (debería empezar por PK)");
    failed = true;
  }
}

if (failed) {
  console.error("\n✗ Build AR falló");
  process.exit(1);
}
console.log(`\n✓ Assets AR listos en public/models/ar/`);
