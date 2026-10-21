---
name: blend-to-portfolio
description: >-
  Automates exporting 3D models from Blender .blend files into the portfolio.
  Use this skill whenever the user asks to export or upload a 3D model from a .blend file,
  generate multi-angle studio renders, and catalog it as 'en progreso' (WIP) or 'completado' in the 3D gallery.
---

# Blend to Portfolio Skill

This skill teaches the agent how to process Blender 3D models (`.blend` files) and publish them to the portfolio with interactive 3D viewers and multi-angle studio renders.

## When to Use
Activate this skill when the user:
- Asks to export an object or collection from a `.blend` file into the web portfolio.
- Asks to generate 3D renders from a Blender file and add them to the 3D gallery or project page.
- Asks to catalog a 3D piece as **"en progreso" (WIP)** or **"completado"**.

---

## Workflow Steps

### Step 1: Identify Parameters
From the user's prompt, extract:
1. **Blend File Path**: E.g. `G:\Mi unidad\Modelos\Casco.blend`.
2. **Model/Object Name**: Specific object, collection (e.g. `casco`, `character1`), or all meshes.
3. **Project Slug (ID)**: E.g. `cyber-helmet`, `art-toy-robot`.
4. **Project Title**: E.g. "Cyber Helmet · Escultura 3D".
5. **Status**:
   - `"wip"`: if user mentions "en progreso", "wip", "en desarrollo", "boceto".
   - `"completed"`: if user mentions "completado", "terminado", "finalizado" (or default).
6. **Category**: `art-toy`, `personaje`, `producto-escena`, or `aforeaventura`.

If the user did not specify the object name in a complex `.blend` file, run:
```powershell
python scripts/blend_pipeline.py --blend "<path-to-blend>" --inspect
```
to examine available collections and meshes.

---

### Step 2: Run the Automated Pipeline
Execute the Python pipeline:
```powershell
python scripts/blend_pipeline.py --blend "<path-to-blend>" --id "<model-id>" --status "<wip|completed>" --title "<title>" --category "<category>"
```
*(Optionally pass `--object "<name>"` if target is a specific object or collection).*
*Advanced flags:*
- `--rest-pose`: Sets all armatures to REST pose (T-Pose / default bind pose) before evaluation and export. Essential for rigged characters.
- `--include-prefix "Prefix1,Prefix2"`: Only includes meshes whose names start with the specified prefixes (e.g. `--include-prefix "Cube"` to isolate character parts and ignore background `Plane` or 3D `Text`).
- `--exclude-prefix "Prefix1,Prefix2"`: Excludes meshes matching prefixes.
- `--samples <int>`: Cycles render samples (default 32).

This will automatically:
1. Export the cleaned, evaluated geometry to `public/models/<id>.glb`.
2. Setup studio 3-point lighting (Key, Fill, Rim) and render 4 angles:
   - `public/uploads/<id>-perspective.webp` (3/4 Hero perspective)
   - `public/uploads/<id>-front.webp` (Front view)
   - `public/uploads/<id>-side.webp` (Side profile)
   - `public/uploads/<id>-detail.webp` (Close-up detail)

---

### Step 3: Register in Portfolio Codebase

1. **`src/data/projectsData.ts`**:
   Add the project entry with:
   - `id`: `<model-id>`
   - `title`: `{ es: "...", en: "..." }`
   - `category`: `"3d"`
   - `status`: `"wip"` or `"completed"`
   - `has3DViewer`: `true`
   - `coverImage`: `"/uploads/<model-id>-perspective.webp"`
   - `gallery`: Array with `perspective`, `front`, `side`, and `detail` WebP images.

2. **`src/routes/$lang/3d.tsx`**:
   Add the item to `THREE_D_MODELS` array:
   - `id`: `<model-id>`
   - `projectId`: `<model-id>`
   - `modelId`: `<model-id>`
   - `status`: `"wip"` or `"completed"`
   - `coverImage`: `"/uploads/<model-id>-perspective.webp"`
   - `previewImages`: 4 angles for the interactive thumbnail strip.

3. **`src/components/ModelViewer3D.tsx`**:
   If the project uses its own dedicated model, add the entry to the dynamic list or `AFORE_MODELS` / dedicated model options.

---

### Step 4: Verification & Build
Always run:
```powershell
npm run prebuild
npx tsc --noEmit
```
To verify that:
1. `sitemap.xml` and `imageSizes.json` are regenerated with the new renders.
2. TypeScript compiles with 0 errors.

Report completion to the user with clickable links to the new images and the preview URL.
