---
name: blend-to-portfolio
description: >-
  Automates exporting 3D models from Blender .blend files into the portfolio.
  Use this skill whenever the user asks to export or upload a 3D model from a .blend file,
  generate multi-angle studio renders, catalog it as 'en progreso' (WIP) or 'completado' in the 3D gallery,
  and archive timestamped render snapshots to the Visual Evolution Log on Google Drive / Documents.
---

# Blend to Portfolio Skill

This skill teaches the agent how to process Blender 3D models (`.blend` files), publish them to the web portfolio with interactive 3D viewers and multi-angle studio renders, and **automatically archive each iteration's renders to the Visual Evolution History on Google Drive and Documents**.

## When to Use
Activate this skill when the user:
- Asks to export an object or collection from a `.blend` file into the web portfolio.
- Asks to update an existing 3D model with new iterations, poses, materials, or details.
- Asks to generate 3D renders from a Blender file and add them to the 3D gallery or project page.
- Asks to catalog a 3D piece as **"en progreso" (WIP)** or **"completado"**.
- Asks to review or save the visual evolution history of a 3D project.

---

## Evolution History Archive (Google Drive & Documents)

Every time a 3D model is processed or updated, the pipeline automatically archives the high-resolution renders and metadata into:

- **Primary Google Drive Path**:
  `G:\Mi unidad\Proyectos\01_3D & Modelado\Portfolio_Evolution\<model-id>\`
- **Synchronized Local Path**:
  `C:\Users\snipe\Documents\Portfolio_Evolution\<model-id>\` (Windows Directory Junction synced to GDrive)

### Directory Structure per Project:
```
Portfolio_Evolution/
└── <model-id>/
    ├── evolution_history.md        <- Chronological markdown log of all iterations with dates & notes
    └── <YYYY-MM-DD_HHmm>_<status>/ <- Snapshot folder for this specific update
        ├── <model-id>-perspective.webp
        ├── <model-id>-front.webp
        ├── <model-id>-side.webp
        ├── <model-id>-detail.webp
        └── version_meta.json       <- Technical metadata (timestamp, source .blend, status, polycount)
```

---

## Unified 3D Projects Architecture (Google Drive)

All 3D models and their associated social, interactive, and portfolio assets must be organized exclusively inside the root folder **`G:\Mi unidad\Proyectos 3D\`**.

### Directory Structure per 3D Project:
```
G:\Mi unidad\Proyectos 3D\
└── <Nombre del Proyecto 3D>/              (e.g., "Dark Souls Personaje", "Personaje Eli", "El Vacio")
    ├── 01_Instagram_Post/                 <- 5 slides (1080x1350 4:5 PNG/WebP) + caption_instagram.txt
    ├── 02_Video_Turntable/                <- Vertical 360° video (1080x1920 9:16 MP4 @ 24fps)
    ├── 03_Portadas_Banners/               <- ArtStation (1920x1080) & LinkedIn (1584x396) covers
    └── 04_Evolution_Snapshots/            <- Visual milestone history & evolution_history.md
```

---

## Strict Rendering & Studio Specifications (GPU Only & No Clipping)

1. **Strict GPU Acceleration & Low CPU Footprint:**
   - Cycles backend must be explicitly configured to **`OPTIX`** (preferred on NVIDIA RTX GPUs) or **`CUDA`**.
   - **Crucial 1:** The CPU device (`AMD Ryzen / Intel`) must be **explicitly disabled** (`device.use = False`) and the GPU device explicitly enabled (`device.use = True`).
   - **Crucial 2 (Prevent 100% CPU lockup):** By default, Blender spawns threads for all CPU cores (`AUTO`) during BVH building, ray-tracing prep, and PNG compression. Set `scene.render.threads_mode = 'FIXED'` and `scene.render.threads = 2`. This guarantees the CPU stays relaxed (low usage and cool temperatures) while the GPU RTX handles 100% of the heavy raytracing load.

2. **Adaptive Framing (Zero Clipping on 360° Rotation):**
   - Before placing the camera, calculate the object's **bounding sphere radius** from all vertices.
   - At 75mm focal length (vertical 1080 × 1920 / 9:16), distance must be calculated dynamically so the entire bounding sphere occupies only ~55% to 60% of vertical height.
   - **Rule:** The mesh must NEVER clip the frame edges at any point of its 360-degree rotation.

3. **Cinematic Cadence & Rotation Speed:**
   - **Framerate:** Strictly **24 fps** (cinematic motion blur / film standard, eliminating harsh 60fps jitter).
   - **Duration:** Exactly **120 frames = 5.0 seconds** per complete 360° turn.
   - Creates a majestic, slow, elegant turntable where every detail, muscle fold, and shader nuance can be examined comfortably.

---

## Instagram Social Carousel Automation (Cyber Tech Grid Standard)

When the user asks to create, update, or generate social media publications, turntables, or covers for any 3D model, use the skill's internal automation engine:
- **Engine Scripts (Self-Contained inside Skill):**
  - Carousel: `.agents/skills/blend-to-portfolio/scripts/carousel_generator.py`
  - Turntable Video (Reels/Shorts): `.agents/skills/blend-to-portfolio/scripts/compile_turntable_video.py`
  - Portfolio Covers (Behance / ArtStation / LinkedIn): `.agents/skills/blend-to-portfolio/scripts/generate_portfolio_covers.py`
- **Output Destination:**
  - `G:\Mi unidad\Proyectos 3D\<Nombre del Proyecto 3D>\` (Organized neatly across `01_Instagram_Post`, `02_Video_Turntable`, `03_Portadas_Banners`, `04_Evolution_Snapshots`).

### Deliverables included in Social Production:
1. **Carrusel de 5 Diapositivas (1080 × 1350 px · 4:5):**
   - Slide 01: Apertura con titular monumental (Bebas Neue en Naranja `#ff7319`), subtítulo y modelo anclado.
   - Slides 02-04: Exhibición pura a pantalla completa sobre Cyber Tech Grid.
   - Slide 05: Cierre simétrico con enlace a `landrescreative.com`.
2. **Turntable 360° en Video Vertical (1080 × 1920 px · 9:16):**
   - Animación orbital en Blender Cycles GPU a 30fps compilada con FFmpeg en MP4 con el fondo oficial y branding.
3. **Archivo de Copy y Hashtags (`caption_instagram.txt`):**
   - Texto de post con storytelling, llamada a la acción y bloques de hashtags especializados de arte 3D.
4. **Portadas Multi-plataforma:**
   - **ArtStation / Behance:** `1920 × 1080 px` (16:9 apaisado).
   - **LinkedIn / Twitter Header:** `1584 × 396 px` (banner horizontal).
- **Official Brand Style (Pre-Approved Standard):**
  - **Dimensions:** 1080 × 1350 px (Instagram portrait 4:5 vertical)
  - **Background:** Studio Obsidian Dark with Cyber Tech Grid (`TOKENS["grid"]` step=80, radial fade mask)
  - **Colors:** Deep Charcoal (`#08090c`), Official Warm Orange Accent (`#ff7319`), Crisp White (`#ffffff`), Muted Slate (`#a5aab9`)
  - **Typography:**
    - Mega Headline: `Bebas Neue` (condensed monumental font in Orange Warm `#ff7319`)
    - Subtitle / Technical: `Space Grotesk` (crisp white)
    - Body / Details / Footers: `Inter`
  - **Structure:**
    1. **Slide 1 (Cover):** Micro pill tag ("● 3D CREATURE STUDY" / "● 3D PROJECT"), Monumental title, Subtitle, concise description, grounded 3D model.
    2. **Slides 2, 3, 4 (Showcases):** Pure 3D art on Cyber Tech Grid without text clutter.
    3. **Slide 5 (Outro):** Micro pill ("● INTERACTIVE 3D WEB"), CTA headline, live official URL `landrescreative.com`, project tag, creator signature `LANDRES` · `@landrescreative`.


---

## Workflow Steps

### Step 1: Identify Parameters
From the user's prompt, extract:
1. **Blend File Path**: E.g. `G:\Mi unidad\Modelos\Casco.blend` or `C:\Users\snipe\Desktop\model.blend`.
2. **Model/Object Name**: Specific object, collection, or all meshes.
3. **Project Slug (ID)**: E.g. `cyber-helmet`, `dark-souls-personaje`, `personaje-eli`.
4. **Project Title**: E.g. "Cyber Helmet · Escultura 3D".
5. **Status**:
   - `"wip"`: if user mentions "en progreso", "wip", "en desarrollo", "boceto", "estudio".
   - `"completed"`: if user mentions "completado", "terminado", "finalizado" (or default).
6. **Category**: `art-toy`, `personaje`, `producto-escena`, or `aforeaventura`.
7. **Notes (optional)**: Brief summary of what was changed/improved in this revision (e.g. "Ajuste de pose T y corrección de shader de piel").

If the user did not specify the object name in a complex `.blend` file, run:
```powershell
python scripts/blend_pipeline.py --blend "<path-to-blend>" --inspect
```
to examine available collections and meshes.

---

### Step 2: Run the Automated Pipeline
Execute the Python pipeline:
```powershell
python scripts/blend_pipeline.py --blend "<path-to-blend>" --id "<model-id>" --status "<wip|completed>" --title "<title>" --category "<category>" --notes "<change-notes>"
```
*(Optionally pass `--object "<name>"` if target is a specific object or collection).*

*Advanced flags:*
- `--rest-pose`: Sets all armatures to REST pose (T-Pose / default bind pose) before evaluation and export. Essential for rigged characters.
- `--include-prefix "Prefix1,Prefix2"`: Only includes meshes whose names start with the specified prefixes (e.g. `--include-prefix "Cube"` to isolate character parts and ignore background `Plane` or 3D `Text`).
- `--exclude-prefix "Prefix1,Prefix2"`: Excludes meshes matching prefixes.
- `--samples <int>`: Cycles render samples (default 32).
- `--notes "<description>"`: Records descriptive notes in `evolution_history.md`.

**What this automatically executes:**
1. Exports the cleaned, evaluated geometry to `public/models/<id>.glb`.
2. Sets up studio 3-point lighting (Key, Fill, Rim) and renders 4 high-definition angles:
   - `public/uploads/<id>-perspective.webp` (3/4 Hero perspective)
   - `public/uploads/<id>-front.webp` (Front view)
   - `public/uploads/<id>-side.webp` (Side profile)
   - `public/uploads/<id>-detail.webp` (Close-up detail)
3. **Archives the snapshot** to `G:\Mi unidad\Proyectos\01_3D & Modelado\Portfolio_Evolution/<id>/<YYYY-MM-DD_HHmm>_<status>/` and updates `evolution_history.md`.

---

### Step 3: Register in Portfolio Codebase

1. **`src/data/projectsData.ts`**:
   Add or update the project entry:
   - `id`: `<model-id>`
   - `title`: `{ es: "...", en: "..." }`
   - `category`: `"3d"`
   - `status`: `"wip"` or `"completed"`
   - `has3DViewer`: `true`
   - `coverImage`: `"/uploads/<model-id>-perspective.webp"`
   - `gallery`: Array with `perspective`, `front`, `side`, and `detail` WebP images.

2. **`src/routes/$lang/3d.tsx`**:
   Add or update the item in `THREE_D_MODELS` array:
   - `id`: `<model-id>`
   - `projectId`: `<model-id>`
   - `modelId`: `<model-id>`
   - `status`: `"wip"` or `"completed"`
   - `coverImage`: `"/uploads/<model-id>-perspective.webp"`
   - `previewImages`: 4 angles for the interactive thumbnail strip.

3. **`src/routes/$lang/projects.index.tsx`**:
   Ensure `<model-id>` is listed in `THREE_D_ORDER` so it appears in the desired sort position on the projects gallery.

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

Report completion to the user with:
- Clickable links to the updated Web preview.
- Path to the newly archived evolution snapshot folder in Google Drive / Documents.
