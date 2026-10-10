// One-off pipeline that turns the raw Blender export into a web-optimised GLB.
//
//   node scripts/optimize-model.mjs <input.glb> <output.glb>
//   npx gltf-transform meshopt <output.glb> <output.glb>
//
// The first step drops every non-skinned mesh (rig-control helpers, the far-away
// "Cute chicken" prop and its huge Fabric-37 textures, the eyeglasses), keeping
// only the skinned character. The second step compresses the geometry with
// Meshopt, which @react-three/drei decodes automatically.
//
// Requires the tool (not saved to package.json): npm i --no-save @gltf-transform/cli
import { NodeIO } from "@gltf-transform/core";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";
import { prune, dedup } from "@gltf-transform/functions";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("usage: node scripts/optimize-model.mjs <input.glb> <output.glb>");
  process.exit(1);
}

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
const doc = await io.read(input);
const root = doc.getRoot();

let removed = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const skinned = mesh.listPrimitives().some((p) => p.getAttribute("JOINTS_0"));
  if (!skinned) {
    node.dispose();
    removed++;
  }
}

await doc.transform(prune(), dedup());
await io.write(output, doc);
console.log(`removed ${removed} non-skinned mesh nodes -> ${output}`);
