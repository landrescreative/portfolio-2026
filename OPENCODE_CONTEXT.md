# CONTEXTO DE TRANSFERENCIA: PIPELINE 3D, SKILL & MARCA LANDRES CREATIVE

Este documento contiene el contexto completo de trabajo para continuar la sesión en OpenCode sin perder ningún detalle técnico, de diseño o de arquitectura.

---

## 1. IDENTIDAD DE MARCA & ECOSISTEMA
- **Diseñador:** LANDRES
- **Portafolio Web Oficial:** `https://landrescreative.com`
- **Instagram Oficial:** `@landrescreative`
- **Color de Acento de Marca:** Naranja Cálido / Eléctrico `#ff7319` (o `#ff4d00` en web).
- **Estilo Visual Oficial:** "Studio Cyber Tech Grid" (fondo obsidiana `#08090c` con cuadrícula técnica sutil de 80px y máscara radial).
- **Tipografías de Marca:**
  - Titulares Monumentales: `Bebas Neue`
  - Subtítulos & Fichas Técnicas: `Space Grotesk`
  - Textos de Cuerpo, UI y Pills: `Inter`
  - Web alternativa: `Poppins`

---

## 2. ESTRUCTURA UNIFICADA EN GOOGLE DRIVE
Todos los proyectos 3D y sus recursos deben guardarse exclusivamente en:
```text
G:\Mi unidad\Proyectos 3D\
└── <Nombre del Proyecto 3D>/              (ej: "Dark Souls Personaje", "Personaje Eli", "El Vacio")
    ├── 01_Instagram_Post/                 <- Carrusel 5 slides (1080x1350 4:5 PNG/WebP) + caption_instagram.txt
    ├── 02_Video_Turntable/                <- Video 360° vertical (1080x1920 9:16 MP4 @ 24fps)
    ├── 03_Portadas_Banners/               <- ArtStation (1920x1080 16:9) & LinkedIn (1584x396)
    └── 04_Evolution_Snapshots/            <- Historial visual de versiones y evolución (.md + webp)
```

---

## 3. SKILL INSTALADA: `blend-to-portfolio`
La skill está sincronizada e instalada en:
- `C:\Users\snipe\.opencode\skills\blend-to-portfolio\`
- `C:\Users\snipe\.codex\skills\blend-to-portfolio\`
- `C:\Users\snipe\.agents\skills\blend-to-portfolio\`
- `C:\Users\snipe\Coding\blend-art-code-main\.agents\skills\blend-to-portfolio\`

### Herramientas y Scripts Clave dentro de la Skill:
- `scripts/carousel_generator.py`: Genera instantáneamente el carrusel de 5 diapositivas 4:5 con simetría arquitectónica (Slide 1 y Slide 5 emparejadas con titular monumental en naranja cálido; Slides 2-4 para arte puro).
- `scripts/compile_turntable_video.py`: Compila los fotogramas orbitales en video vertical 9:16 a 24fps con FFmpeg sobre el fondo Cyber Tech Grid.
- `scripts/generate_portfolio_covers.py`: Genera portadas horizontales (16:9 y banner) en Google Drive.
- `assets/fonts/`: Contiene `BebasNeue.ttf`, `SpaceGrotesk.ttf`, `Inter.ttf`, `Poppins-*.ttf`.

---

## 4. REGLAS CRÍTICAS DE RENDERIZADO EN BLENDER
1. **GPU Estricta (Cycles OptiX) & Control de Hilos de CPU:**
   - Usar `OPTIX` (tarjeta NVIDIA GeForce RTX 2070 SUPER).
   - **IMPORTANTE 1:** Desactivar explícitamente la CPU (`AMD Ryzen 5 3600`) poniendo `device.use = False` en Cycles preferences.
   - **IMPORTANTE 2 (Evitar CPU al 100%):** Blender por defecto usa todos los núcleos para la preparación de geometría y compresión PNG (`scene.render.threads_mode = 'AUTO'`). Debe fijarse siempre a `scene.render.threads_mode = 'FIXED'` y `scene.render.threads = 2`. Con esto la CPU se mantiene fría y relajada, dejando que la GPU RTX trabaje al 100% sin ralentizar Windows.
2. **Cero Recorte de Malla (Adaptive Bounding Sphere):**
   - Calcular el radio de la esfera delimitadora de la geometría completa.
   - En encuadre vertical 9:16 (lente 75mm), posicionar la cámara para que el modelo ocupe sólo el ~55-60% del alto vertical.
   - La malla NUNCA debe cortarse en ningún ángulo de la rotación 360°.
3. **Cadencia y Velocidad:**
   - 24 fps cinematográficos.
   - 120 fotogramas = 5.0 segundos por vuelta completa (giro suave y elegante).

---

## 5. ESTADO ACTUAL DE TAREAS
- **Dark Souls (`Untitled1.blend`):**
  - Carrusel de Instagram (5 slides) generado en `01_Instagram_Post`.
  - Copy y hashtags oficial generado en `caption_instagram.txt`.
  - Portadas generadas en `03_Portadas_Banners`.
  - **Turntable terminado**: `02_Video_Turntable\turntable_360_vertical.mp4` (1080x1920, 24fps, 120 frames, 5.000 s). Renderizado con el limpiador lento; existe una segunda versión idéntica y 30x más rápida en `_benchmark_optix\turntable_360_vertical_optix.mp4`.
  - Frames crudos en `02_Video_Turntable\_frames\` (versión lenta) y `_benchmark_optix\frames\` (versión OptiX).
- **Pipeline corregido el 2026-10-22** (documentado en `SKILL.md`):
  - El `denoiser` por defecto (OpenImageDenoise) era el 96% del tiempo de render: 21,2 s por frame contra 0,6 s con OptiX. Ahora se fuerza `OPTIX`.
  - Encuadre por extents reales del bbox (58% de alto / 84% de ancho), no por la diagonal de la esfera delimitadora.
  - Los frames viven dentro del proyecto, no en el repo, y se renderizan con `render_turntable_resumable.py` (chunks de 12 con reintento).
- **Próximos proyectos listos para procesar:**
  - Personaje "Eli" (`C:\Users\snipe\Desktop\Eli Eli\*.blend`).
  - Proyecto "El Vacío".
