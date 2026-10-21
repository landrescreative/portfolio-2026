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
out_glb = cfg["out_glb"]
render_dir = cfg["render_dir"]
status = cfg.get("status", "completed")
render_samples = cfg.get("samples", 32)
res_x = cfg.get("res_x", 800)
res_y = cfg.get("res_y", 800)

os.makedirs(os.path.dirname(out_glb), exist_ok=True)
os.makedirs(render_dir, exist_ok=True)

# 1. Select target objects
bpy.ops.object.select_all(action='DESELECT')
target_meshes = []

if target_object and target_object.lower() != "all":
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
    # Fallback to all visible meshes (excluding rigify widget shapes like cs_*)
    target_meshes = [
        obj for obj in bpy.data.objects 
        if obj.type == 'MESH' and obj.visible_get() and not obj.name.startswith("cs_") and not obj.name.startswith("WGT-")
    ]

if not target_meshes:
    print("ERROR: No mesh objects found to process.")
    sys.exit(1)

for obj in target_meshes:
    obj.select_set(True)
bpy.context.view_layer.objects.active = target_meshes[0]

# 2. Normalize transforms and calculate bounding box
bbox_corners = []
for obj in target_meshes:
    for corner in obj.bound_box:
        bbox_corners.append(obj.matrix_world @ mathutils.Vector(corner))

min_x, max_x = min(c.x for c in bbox_corners), max(c.x for c in bbox_corners)
min_y, max_y = min(c.y for c in bbox_corners), max(c.y for c in bbox_corners)
min_z, max_z = min(c.z for c in bbox_corners), max(c.z for c in bbox_corners)

center_x = (min_x + max_x) / 2
center_y = (min_y + max_y) / 2
height = max_z - min_z
max_dim = max(max_x - min_x, max_y - min_y, max_z - min_z)
scale_factor = 2.0 / max_dim if max_dim > 0 else 1.0

# Create root turntable pivot at origin on floor
turntable = bpy.data.objects.new(name="TurntablePivot", object_data=None)
bpy.context.scene.collection.objects.link(turntable)
turntable.location = (0, 0, 0)

for obj in target_meshes:
    if obj.parent is None:
        obj.location.x -= center_x
        obj.location.y -= center_y
        obj.location.z -= min_z # rest on ground z=0
        obj.scale *= scale_factor
        obj.parent = turntable

bpy.context.view_layer.update()

# 3. Export GLB
# Temporarily select only target meshes for export
bpy.ops.object.select_all(action='DESELECT')
for obj in target_meshes:
    obj.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_yup=True
)
print(f"Exported GLB: {out_glb}")

# 4. Configure Studio Lighting & Camera for Renders
scene = bpy.context.scene
scene.render.resolution_x = res_x
scene.render.resolution_y = res_y
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'

# Use Cycles or Eevee
if hasattr(scene, 'cycles'):
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = render_samples
    scene.cycles.use_denoising = True

# Add studio lights
key_data = bpy.data.lights.new(name="StudioKey", type='AREA')
key_data.energy = 160
key_data.size = 2.5
key_data.color = (1.0, 0.98, 0.94)
key_obj = bpy.data.objects.new(name="StudioKey", object_data=key_data)
scene.collection.objects.link(key_obj)
key_obj.location = (2.2, -2.5, 2.5)

fill_data = bpy.data.lights.new(name="StudioFill", type='AREA')
fill_data.energy = 75
fill_data.size = 3.2
fill_data.color = (0.8, 0.88, 1.0)
fill_obj = bpy.data.objects.new(name="StudioFill", object_data=fill_data)
scene.collection.objects.link(fill_obj)
fill_obj.location = (-2.5, -2.0, 1.6)

rim_data = bpy.data.lights.new(name="StudioRim", type='AREA')
rim_data.energy = 140
rim_data.size = 2.0
rim_data.color = (1.0, 0.88, 0.75) if status == "wip" else (0.9, 0.95, 1.0)
rim_obj = bpy.data.objects.new(name="StudioRim", object_data=rim_data)
scene.collection.objects.link(rim_obj)
rim_obj.location = (0.0, 2.8, 2.2)

# Camera
cam_data = bpy.data.cameras.new(name="StudioCamera")
cam_data.lens = 52
cam_obj = bpy.data.objects.new(name="StudioCamera", object_data=cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj

def point_camera(cam, loc, target=(0, 0, 1.0)):
    cam.location = loc
    direction = mathutils.Vector(target) - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

# Render Angles
angles = [
    ("perspective", (1.9, -2.8, 1.5), (0, 0, 0.95)),
    ("front", (0.0, -3.2, 1.1), (0, 0, 0.95)),
    ("side", (3.2, 0.0, 1.1), (0, 0, 0.95)),
    ("detail", (0.9, -1.6, 1.55), (0, 0, 1.45)),
]

for angle_name, cam_loc, target_loc in angles:
    point_camera(cam_obj, cam_loc, target_loc)
    out_png = os.path.join(render_dir, f"{model_id}-{angle_name}.png")
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

def process_blend(blend_file, model_id, target_object=None, status="completed", category="personaje", title=None, samples=32):
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
        "res_y": 800
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

    print(f"[✓] Modelo 3D exportado exitosamente a: {out_glb}")

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
        samples=args.samples
    )

if __name__ == "__main__":
    main()
