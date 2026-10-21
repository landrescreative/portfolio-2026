#!/usr/bin/env python3
"""
blend_pipeline.py - Antigravity 3D Pipeline
Automates exporting 3D models from Blender .blend files to Web GLB,
generating studio multi-angle renders, converting to WebP,
and integrating them into the portfolio with status (WIP vs Completed).
"""

import os
import sys
import json
import argparse
import subprocess
import shutil
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
PUBLIC_MODELS = BASE_DIR / "public" / "models"
PUBLIC_UPLOADS = BASE_DIR / "public" / "uploads"
TEMP_DIR = BASE_DIR / "temp_pipeline_renders"

DEFAULT_BLENDER_PATHS = [
    r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe",
    "/usr/bin/blender",
    "/Applications/Blender.app/Contents/MacOS/Blender",
]

def find_blender():
    env_path = os.environ.get("BLENDER_BIN")
    if env_path and os.path.exists(env_path):
        return env_path
    which_blender = shutil.which("blender")
    if which_blender:
        return which_blender
    for p in DEFAULT_BLENDER_PATHS:
        if os.path.exists(p):
            return p
    raise FileNotFoundError("Blender executable not found. Set BLENDER_BIN environment variable or install Blender.")

BLENDER_INSPECT_CODE = '''
import bpy
import json
import sys

def run_inspect():
    result = {
        "collections": [c.name for c in bpy.data.collections],
        "objects": []
    }
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            verts = len(obj.data.vertices) if obj.data else 0
            faces = len(obj.data.polygons) if obj.data else 0
            materials = [m.name for m in obj.data.materials if m] if obj.data else []
            result["objects"].append({
                "name": obj.name,
                "type": obj.type,
                "vertices": verts,
                "faces": faces,
                "materials": materials,
                "visible": obj.visible_get()
            })
    print("BLENDER_PIPELINE_RESULT_START")
    print(json.dumps(result))
    print("BLENDER_PIPELINE_RESULT_END")

run_inspect()
'''

BLENDER_PROCESS_CODE = '''
import bpy
import math
import os
import sys
import json
import mathutils

argv = sys.argv
args_idx = argv.index("--") + 1 if "--" in argv else len(argv)
cfg = json.loads(argv[args_idx])

model_id = cfg["id"]
target_object = cfg.get("object")
out_glb = os.path.abspath(cfg["out_glb"])
render_dir = os.path.abspath(cfg["render_dir"])
status = cfg.get("status", "completed")
render_samples = cfg.get("samples", 32)
res_x = cfg.get("res_x", 800)
res_y = cfg.get("res_y", 800)
rest_pose = cfg.get("rest_pose", False)
include_prefix = cfg.get("include_prefix")
exclude_prefix = cfg.get("exclude_prefix")

os.makedirs(os.path.dirname(out_glb), exist_ok=True)
os.makedirs(render_dir, exist_ok=True)

# 0. Ensure Object Mode
try:
    if bpy.context.view_layer.objects.active and bpy.context.view_layer.objects.active.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
except Exception:
    pass

# Force Armatures to Rest Pose (T-Pose / Default Bind Pose) if requested
if rest_pose:
    print("[*] Setting armatures to REST pose (T-pose)...")
    for arm in bpy.data.armatures:
        arm.pose_position = 'REST'
    for obj in bpy.data.objects:
        if obj.type == 'ARMATURE' and obj.pose:
            for pb in obj.pose.bones:
                pb.location = (0, 0, 0)
                pb.rotation_quaternion = (1, 0, 0, 0)
                pb.rotation_euler = (0, 0, 0)
                pb.scale = (1, 1, 1)
    bpy.context.view_layer.update()

# 1. Select target objects without relying on context-sensitive operators
for obj in bpy.data.objects:
    obj.select_set(False)

target_meshes = []

if include_prefix:
    prefixes = [p.strip().lower() for p in include_prefix.split(',')]
    target_meshes = [
        obj for obj in bpy.data.objects
        if obj.type == 'MESH' and any(obj.name.lower().startswith(p) for p in prefixes)
    ]
elif target_object and target_object.lower() != "all":
    found = False
    # Check collection
    if target_object in bpy.data.collections:
        col = bpy.data.collections[target_object]
        for obj in col.all_objects:
            if obj.type == 'MESH':
                target_meshes.append(obj)
        found = True
    # Check single object
    elif target_object in bpy.data.objects:
        obj = bpy.data.objects[target_object]
        if obj.type == 'MESH':
            target_meshes.append(obj)
            found = True
    if not found:
        # Partial match
        for obj in bpy.data.objects:
            if obj.type == 'MESH' and target_object.lower() in obj.name.lower():
                target_meshes.append(obj)

if not target_meshes:
    # Fallback to all visible meshes (excluding rigify widget shapes like cs_*, WGT-*)
    target_meshes = [
        obj for obj in bpy.data.objects 
        if obj.type == 'MESH' and obj.visible_get() and not obj.name.startswith("cs_") and not obj.name.startswith("WGT-")
    ]

# Apply exclude_prefix if provided
if exclude_prefix:
    ex_prefixes = [p.strip().lower() for p in exclude_prefix.split(',')]
    target_meshes = [
        obj for obj in target_meshes
        if not any(obj.name.lower().startswith(p) for p in ex_prefixes)
    ]

if not target_meshes:
    print("ERROR: No mesh objects found to process.")
    sys.exit(1)

# Hide any non-target objects from viewport and render so they don't block camera or appear in renders
for obj in list(bpy.data.objects):
    if obj not in target_meshes and obj.type in ('MESH', 'CURVE', 'FONT', 'SURFACE'):
        obj.hide_render = True
        obj.hide_viewport = True

for obj in target_meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = target_meshes[0]

# Ensure all materials on target meshes have a valid Principled BSDF for GLTF export
for obj in target_meshes:
    # If mesh has no material, assign a clean neutral one
    if len(obj.data.materials) == 0:
        def_mat = bpy.data.materials.get("DefaultMeshMaterial")
        if not def_mat:
            def_mat = bpy.data.materials.new(name="DefaultMeshMaterial")
            def_mat.use_nodes = True
            p = def_mat.node_tree.nodes.get("Principled BSDF")
            if p:
                p.inputs['Base Color'].default_value = (0.9, 0.9, 0.9, 1.0)
                p.inputs['Metallic'].default_value = 0.0
                p.inputs['Roughness'].default_value = 0.4
        obj.data.materials.append(def_mat)

    for slot in obj.material_slots:
        m = slot.material
        if not m:
            continue
        if not m.use_nodes:
            continue
        tree = m.node_tree
        has_principled = any(n.type == 'BSDF_PRINCIPLED' for n in tree.nodes)
        if not has_principled:
            print(f"[*] Creating Principled BSDF fallback for material {m.name}...")
            out_node = next((n for n in tree.nodes if n.type == 'OUTPUT_MATERIAL'), None)
            if out_node:
                p_node = tree.nodes.new(type='ShaderNodeBsdfPrincipled')
                p_node.location = (out_node.location.x - 300, out_node.location.y)
                color = (0.854, 0.460, 0.365, 1.0) if 'skin' in m.name.lower() else (0.8, 0.8, 0.8, 1.0)
                for n in tree.nodes:
                    if n.type == 'GROUP' and hasattr(n, 'inputs'):
                        for inp in n.inputs:
                            if 'diffuse' in inp.name.lower() and hasattr(inp, 'default_value') and hasattr(inp.default_value, '__len__') and len(inp.default_value) >= 3:
                                color = tuple(inp.default_value)
                                break
                p_node.inputs['Base Color'].default_value = color
                p_node.inputs['Metallic'].default_value = 0.0
                p_node.inputs['Roughness'].default_value = 0.55
                tree.links.new(p_node.outputs['BSDF'], out_node.inputs['Surface'])

# 2. Export GLB directly
# Blender glTF exporter with export_apply=True bakes modifiers (rest pose) into exported geometry
bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_draco_mesh_compression_enable=True,
    export_yup=True
)
print(f"Exported GLB: {out_glb}")

# 3. Calculate evaluated bounding box in rest pose
depsgraph = bpy.context.evaluated_depsgraph_get()
pts = []
for o in target_meshes:
    eval_obj = o.evaluated_get(depsgraph)
    mesh = eval_obj.to_mesh()
    for v in mesh.vertices:
        pts.append(eval_obj.matrix_world @ v.co)
    eval_obj.to_mesh_clear()

min_co = mathutils.Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
max_co = mathutils.Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
target = (min_co + max_co) / 2
dims = max_co - min_co
dim = max(dims.x, dims.y, dims.z)

# 4. Determine facing direction
if dims.y > dims.x:
    # Outstretched width is along Y, facing direction is along X
    head_pts = [p.x for p in pts if p.z > (min_co.z + dims.z * 0.7)]
    avg_head_x = sum(head_pts) / len(head_pts) if head_pts else target.x
    if avg_head_x >= target.x:
        fwd = mathutils.Vector((1.0, 0.0, 0.0))
        right = mathutils.Vector((0.0, -1.0, 0.0))
    else:
        fwd = mathutils.Vector((-1.0, 0.0, 0.0))
        right = mathutils.Vector((0.0, 1.0, 0.0))
else:
    # Standard Blender orientation (width along X, facing along Y)
    head_pts = [p.y for p in pts if p.z > (min_co.z + dims.z * 0.7)]
    avg_head_y = sum(head_pts) / len(head_pts) if head_pts else target.y
    if avg_head_y <= target.y:
        fwd = mathutils.Vector((0.0, -1.0, 0.0))
        right = mathutils.Vector((1.0, 0.0, 0.0))
    else:
        fwd = mathutils.Vector((0.0, 1.0, 0.0))
        right = mathutils.Vector((-1.0, 0.0, 0.0))

up = mathutils.Vector((0.0, 0.0, 1.0))

# 5. Configure Studio Lighting & Camera for Renders
scene = bpy.context.scene
scene.render.resolution_x = res_x
scene.render.resolution_y = res_y
scene.render.film_transparent = True
if hasattr(scene.render.image_settings, 'media_type'):
    try:
        scene.render.image_settings.media_type = 'IMAGE'
    except Exception:
        pass
scene.render.image_settings.file_format = 'PNG'

# Use Cycles or Eevee
if hasattr(scene, 'cycles'):
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = render_samples
    scene.cycles.use_denoising = True

energy_scale = max(1.0, (dim / 2.0) ** 2)

# Key Light
key_data = bpy.data.lights.new(name="StudioKey", type='AREA')
key_data.energy = 320 * energy_scale
key_data.size = dim * 1.0
key_data.color = (1.0, 0.98, 0.94)
key_obj = bpy.data.objects.new(name="StudioKey", object_data=key_data)
scene.collection.objects.link(key_obj)
key_obj.location = target + fwd * (dim * 1.8) + right * (dim * 1.4) + up * (dim * 1.2)

# Fill Light
fill_data = bpy.data.lights.new(name="StudioFill", type='AREA')
fill_data.energy = 140 * energy_scale
fill_data.size = dim * 1.2
fill_data.color = (0.8, 0.88, 1.0)
fill_obj = bpy.data.objects.new(name="StudioFill", object_data=fill_data)
scene.collection.objects.link(fill_obj)
fill_obj.location = target + fwd * (dim * 1.2) - right * (dim * 1.8) + up * (dim * 0.6)

# Rim Light
rim_data = bpy.data.lights.new(name="StudioRim", type='AREA')
rim_data.energy = 260 * energy_scale
rim_data.size = dim * 0.9
rim_data.color = (1.0, 0.88, 0.75) if status == "wip" else (0.9, 0.95, 1.0)
rim_obj = bpy.data.objects.new(name="StudioRim", object_data=rim_data)
scene.collection.objects.link(rim_obj)
rim_obj.location = target - fwd * (dim * 1.8) + up * (dim * 0.9)

# Camera
cam_data = bpy.data.cameras.new(name="StudioCamera")
cam_data.lens = 50
cam_obj = bpy.data.objects.new(name="StudioCamera", object_data=cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

def point_camera(cam, loc, cam_target):
    cam.location = loc
    direction = cam_target - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

# Render Angles with comfortable portfolio margins (never cropped or suffocated)
detail_target = target + up * (dim * 0.22)
angles = [
    ("perspective", target + fwd * (dim * 1.85) + right * (dim * 1.45) + up * (dim * 0.6), target),
    ("front", target + fwd * (dim * 2.3) + up * (dim * 0.05), target),
    ("side", target + right * (dim * 2.3) + up * (dim * 0.05), target),
    ("detail", detail_target + fwd * (dim * 0.95) + right * (dim * 0.65) + up * (dim * 0.22), detail_target),
]

for angle_name, cam_loc, cam_target in angles:
    point_camera(cam_obj, cam_loc, cam_target)
    out_png = os.path.abspath(os.path.join(render_dir, f"{model_id}-{angle_name}.png"))
    scene.render.filepath = out_png
    bpy.ops.render.render(write_still=True)
    print(f"Rendered: {out_png}")

print("BLENDER_PIPELINE_SUCCESS")
'''

def inspect_blend(blend_file):
    blender_bin = find_blender()
    print(f"[*] Inspecting {blend_file} with {blender_bin}...")
    temp_script = TEMP_DIR / "_inspect_script.py"
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    temp_script.write_text(BLENDER_INSPECT_CODE, encoding="utf-8")
    
    cmd = [blender_bin, "-b", str(blend_file), "-P", str(temp_script)]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    
    output = res.stdout
    if "BLENDER_PIPELINE_RESULT_START" in output:
        json_str = output.split("BLENDER_PIPELINE_RESULT_START")[1].split("BLENDER_PIPELINE_RESULT_END")[0].strip()
        data = json.loads(json_str)
        print("\n=== OBJETOS Y MALLAS DETECTADOS ===")
        print(f"Colecciones: {data['collections']}")
        print(f"Mallas encontradas ({len(data['objects'])}):")
        for obj in data["objects"]:
            print(f"  - [{obj['name']}] Vértices: {obj['vertices']}, Caras: {obj['faces']}, Materiales: {obj['materials']}")
        return data
    else:
        print("Error en inspección:", res.stderr)
        return None

def process_blend(blend_file, model_id, target_object=None, status="completed", category="personaje", title=None, samples=32, rest_pose=False, include_prefix=None, exclude_prefix=None):
    blender_bin = find_blender()
    PUBLIC_MODELS.mkdir(parents=True, exist_ok=True)
    PUBLIC_UPLOADS.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    out_glb = PUBLIC_MODELS / f"{model_id}.glb"
    render_temp = TEMP_DIR / model_id
    render_temp.mkdir(parents=True, exist_ok=True)

    config = {
        "id": model_id,
        "object": target_object,
        "out_glb": str(out_glb),
        "render_dir": str(render_temp),
        "status": status,
        "samples": samples,
        "res_x": 800,
        "res_y": 800,
        "rest_pose": rest_pose,
        "include_prefix": include_prefix,
        "exclude_prefix": exclude_prefix
    }

    temp_script = TEMP_DIR / "_process_script.py"
    temp_script.write_text(BLENDER_PROCESS_CODE, encoding="utf-8")

    cmd = [blender_bin, "-b", str(blend_file), "-P", str(temp_script), "--", json.dumps(config)]
    print(f"[*] Ejecutando exportación y renderizado en Blender 5.2...")
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")

    if "BLENDER_PIPELINE_SUCCESS" not in res.stdout:
        print("Error durante el procesamiento de Blender:")
        print(res.stderr or res.stdout)
        return False

    print(f"[OK] Modelo 3D exportado exitosamente a: {out_glb}")

    # Convert renders to WebP
    print("[*] Optimizando renders a formato WebP...")
    rendered_files = []
    for angle in ["perspective", "front", "side", "detail"]:
        png_path = render_temp / f"{model_id}-{angle}.png"
        webp_path = PUBLIC_UPLOADS / f"{model_id}-{angle}.webp"
        if png_path.exists():
            img = Image.open(png_path)
            img.save(webp_path, format="WEBP", quality=88, method=6)
            rendered_files.append(webp_path)
            print(f"  [+] Generado: {webp_path.name} ({os.path.getsize(webp_path)} bytes)")

    # Clean up temp
    try:
        shutil.rmtree(render_temp)
    except Exception:
        pass

    # Print code snippets for integration
    display_title = title or model_id.replace("-", " ").title()
    print_integration_code(model_id, display_title, status, category)
    return True

def print_integration_code(model_id, title, status, category):
    status_label = "En Progreso (WIP)" if status == "wip" else "Completado"
    print("\n" + "="*60)
    print(f"PIPELINE COMPLETADO CON ÉXITO · MODELO: {model_id} ({status_label})")
    print("="*60)
    print("\nAssets listos:")
    print(f"  - GLB 3D:   /models/{model_id}.glb")
    print(f"  - Portada:  /uploads/{model_id}-perspective.webp")
    print(f"  - Galería:  /uploads/{model_id}-front.webp, side.webp, detail.webp")
    print("\nEjecuta a continuación:")
    print("  npm run prebuild")
    print("  npx tsc --noEmit")
    print("="*60 + "\n")

def main():
    parser = argparse.ArgumentParser(description="Antigravity Blender 3D Pipeline")
    parser.add_argument("--blend", required=True, help="Ruta al archivo .blend")
    parser.add_argument("--inspect", action="store_true", help="Inspecciona objetos dentro del .blend")
    parser.add_argument("--id", help="Identificador único (slug) del proyecto")
    parser.add_argument("--object", help="Nombre del objeto o colección a procesar")
    parser.add_argument("--title", help="Título del modelo")
    parser.add_argument("--status", choices=["wip", "completed"], default="completed", help="Estado del modelo")
    parser.add_argument("--category", choices=["art-toy", "personaje", "producto-escena", "aforeaventura"], default="personaje", help="Categoría 3D")
    parser.add_argument("--samples", type=int, default=32, help="Muestras de render en Cycles")
    parser.add_argument("--rest-pose", action="store_true", help="Fuerza armaduras a Rest Pose (T-Pose / pose default)")
    parser.add_argument("--include-prefix", help="Prefijo(s) de objetos a incluir separados por comas (ej. Cube)")
    parser.add_argument("--exclude-prefix", help="Prefijo(s) de objetos a excluir separados por comas (ej. Plane,Text)")

    args = parser.parse_args()

    if args.inspect:
        inspect_blend(args.blend)
        return

    if not args.id:
        print("Error: Se requiere el argumento --id para procesar el modelo.")
        sys.exit(1)

    process_blend(
        blend_file=args.blend,
        model_id=args.id,
        target_object=args.object,
        status=args.status,
        category=args.category,
        title=args.title,
        samples=args.samples,
        rest_pose=args.rest_pose,
        include_prefix=args.include_prefix,
        exclude_prefix=args.exclude_prefix
    )

if __name__ == "__main__":
    main()
