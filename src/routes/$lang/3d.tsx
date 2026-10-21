import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useI18n, tx } from "@/lib/i18n";
import {
  Box,
  ArrowUpRight,
  ArrowRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { ContactSection } from "@/components/ContactSection";
import { buildSeo, ogImagePath, type Locale } from "@/lib/seo";

const THREE_D_SEO = {
  es: {
    title: "Portafolio 3D & Modelado · Luis Andrés (LANDRES)",
    description:
      "Galería especializada en modelado 3D en Blender, escultura digital, Art Toys, miniaturas para impresión 3D STL, envases de producto y visualizadores 3D interactivos.",
  },
  en: {
    title: "3D Modeling & Sculpture Portfolio · Luis Andrés (LANDRES)",
    description:
      "Curated gallery of 3D modeling in Blender, digital sculpture, Art Toys, STL 3D printing miniatures, product packaging, and interactive 3D viewers.",
  },
} as const;

export const Route = createFileRoute("/$lang/3d")({
  head: ({ params }) => {
    const lang = params.lang as Locale;
    return buildSeo({
      lang,
      path: "/3d",
      image: ogImagePath("/uploads/art-toy-conejo-cover.webp"),
      ...THREE_D_SEO[lang],
    });
  },
  component: ThreeDPortfolioPage,
});

interface ThreeDModelItem {
  id: string;
  projectId: string;
  modelId: string;
  category: "art-toy" | "aforeaventura" | "personaje" | "producto-escena";
  title: { es: string; en: string };
  characterName: { es: string; en: string };
  roleBadge: { es: string; en: string };
  tag: { es: string; en: string };
  client: string;
  year: string;
  coverImage: string;
  specs: { es: string; en: string };
  previewImages: { src: string; alt: string; caption?: { es: string; en: string } }[];
  status?: "wip" | "completed";
}

const THREE_D_MODELS: ThreeDModelItem[] = [
  {
    id: "escultura-personaje-fantasia",
    projectId: "escultura-personaje-fantasia",
    modelId: "escultura-personaje-fantasia",
    category: "personaje",
    status: "wip",
    title: {
      es: "Escultura Personaje de Fantasía",
      en: "Fantasy Character Sculpture",
    },
    characterName: {
      es: "Criatura Fantástica · Escultura Digital",
      en: "Fantasy Creature · Digital Sculpt",
    },
    roleBadge: {
      es: "Escultura 3D (WIP)",
      en: "3D Sculpture (WIP)",
    },
    tag: {
      es: "Escultura Digital · Criatura Fantasía (WIP)",
      en: "Digital Sculpture · Fantasy Creature (WIP)",
    },
    client: "Proyecto Personal",
    year: "2026",
    specs: {
      es: "184k polígonos · GLB 4.75 MB (Draco) · Escultura Orgánica",
      en: "184k polygons · 4.75 MB GLB (Draco) · Organic Sculpt",
    },
    coverImage: "/uploads/escultura-personaje-fantasia-perspective.webp",
    previewImages: [
      {
        src: "/uploads/escultura-personaje-fantasia-perspective.webp",
        alt: "Escultura Fantasía Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Silueta general e iluminación",
          en: "3/4 Perspective · General silhouette & lighting",
        },
      },
      {
        src: "/uploads/escultura-personaje-fantasia-front.webp",
        alt: "Escultura Fantasía Vista Frontal",
        caption: {
          es: "Vista frontal · Expresión y dentadura",
          en: "Front view · Expression & teeth",
        },
      },
      {
        src: "/uploads/escultura-personaje-fantasia-side.webp",
        alt: "Escultura Fantasía Perfil Lateral",
        caption: {
          es: "Perfil lateral · Volumen y postura",
          en: "Side profile · Volume & posture",
        },
      },
      {
        src: "/uploads/escultura-personaje-fantasia-detail.webp",
        alt: "Escultura Fantasía Detalle Facial",
        caption: {
          es: "Detalle de rostro y cuernos",
          en: "Face & horns close-up detail",
        },
      },
    ],
  },
  {
    id: "personaje-eli",
    projectId: "personaje-eli",
    modelId: "personaje-eli",
    category: "personaje",
    status: "wip",
    title: {
      es: "Eli · Personaje 3D Estilizado",
      en: "Eli · Stylized 3D Character",
    },
    characterName: {
      es: "Eli · Personaje Toon en T-Pose",
      en: "Eli · Stylized Toon Character in T-Pose",
    },
    roleBadge: {
      es: "Personaje 3D (WIP)",
      en: "3D Character (WIP)",
    },
    tag: {
      es: "Personaje 3D · Toon & Rigging (WIP)",
      en: "3D Character · Toon & Rigging (WIP)",
    },
    client: "Proyecto Personal",
    year: "2026",
    specs: {
      es: "T-Pose · GLB 11.2 MB (Draco) · Malla Toon con Rigify",
      en: "T-Pose · 11.2 MB GLB (Draco) · Toon Mesh with Rigify",
    },
    coverImage: "/uploads/personaje-eli-perspective.webp",
    previewImages: [
      {
        src: "/uploads/personaje-eli-perspective.webp",
        alt: "Eli Personaje Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Silueta en pose de descanso",
          en: "3/4 Perspective · Rest pose silhouette",
        },
      },
      {
        src: "/uploads/personaje-eli-front.webp",
        alt: "Eli Personaje Vista Frontal",
        caption: {
          es: "Vista frontal · Expresión y simetría",
          en: "Front view · Expression & symmetry",
        },
      },
      {
        src: "/uploads/personaje-eli-side.webp",
        alt: "Eli Personaje Perfil Lateral",
        caption: {
          es: "Perfil lateral · Volumen del gorro y postura",
          en: "Side profile · Beanie volume & posture",
        },
      },
      {
        src: "/uploads/personaje-eli-detail.webp",
        alt: "Eli Personaje Detalle Facial",
        caption: {
          es: "Detalle de textura tejida del gorro y rostro",
          en: "Close-up detail of knit beanie texture and face",
        },
      },
    ],
  },
  {
    id: "dark-souls-personaje",
    projectId: "dark-souls-personaje",
    modelId: "dark-souls-personaje",
    category: "personaje",
    status: "wip",
    title: {
      es: "Dark Souls · Personaje 3D",
      en: "Dark Souls · 3D Character",
    },
    characterName: {
      es: "Escultura en Progreso · Criatura Dark Souls",
      en: "Work in Progress Sculpt · Dark Souls Creature",
    },
    roleBadge: {
      es: "Escultura Digital (WIP)",
      en: "Digital Sculpture (WIP)",
    },
    tag: {
      es: "Escultura 3D · High-Poly WIP",
      en: "3D Sculpture · High-Poly WIP",
    },
    client: "Proyecto Personal / Fan Art",
    year: "2026",
    specs: {
      es: "High-Poly 946k vértices · GLB 13.6 MB (Draco) · Estudio de Escultura",
      en: "High-Poly 946k vertices · 13.6 MB GLB (Draco) · Sculpture Study",
    },
    coverImage: "/uploads/dark-souls-personaje-perspective.webp",
    previewImages: [
      {
        src: "/uploads/dark-souls-personaje-perspective.webp",
        alt: "Dark Souls Personaje Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Iluminación de estudio",
          en: "3/4 Perspective · Studio lighting",
        },
      },
      {
        src: "/uploads/dark-souls-personaje-front.webp",
        alt: "Dark Souls Personaje Vista Frontal",
        caption: {
          es: "Vista frontal · Volumen y proporciones",
          en: "Front view · Volume & proportions",
        },
      },
      {
        src: "/uploads/dark-souls-personaje-side.webp",
        alt: "Dark Souls Personaje Perfil Lateral",
        caption: {
          es: "Perfil lateral · Curvatura anatómica",
          en: "Side profile · Anatomical curvature",
        },
      },
      {
        src: "/uploads/dark-souls-personaje-detail.webp",
        alt: "Dark Souls Personaje Detalle de Esculpido",
        caption: {
          es: "Detalle cercano de esculpido orgánico",
          en: "Close-up detail of organic sculpting",
        },
      },
    ],
  },
  {
    id: "el-vacio",
    projectId: "el-vacio",
    modelId: "el-vacio",
    category: "producto-escena",
    status: "completed",
    title: {
      es: "El Vacío · Integración Stop-Motion & 3D",
      en: "El Vacío (The Void) · Stop-Motion & 3D Integration",
    },
    characterName: {
      es: "Marioneta Stop-Motion en Entorno CGI Submarino",
      en: "Stop-Motion Puppet in Underwater CGI Scene",
    },
    roleBadge: {
      es: "VFX & Stop-Motion",
      en: "VFX & Stop-Motion",
    },
    tag: {
      es: "VFX · Stop-Motion + 3D · Colaboración con Fractal",
      en: "VFX · Stop-Motion + 3D · Collaboration with Fractal",
    },
    client: "Fractal (Productora Audiovisual)",
    year: "2025",
    specs: {
      es: "Blender 5.2 Cycles · 146 frames compuestos · Proyección 3D Cards & Cáusticas",
      en: "Blender 5.2 Cycles · 146 composited frames · 3D Card Projections & Caustics",
    },
    coverImage: "/uploads/el-vacio-hero.webp",
    previewImages: [
      {
        src: "/uploads/el-vacio-hero.webp",
        alt: "El Vacío Portada",
        caption: {
          es: "Fotograma 0215 · Despertar en el lecho submarino",
          en: "Frame 0215 · Awakening on the seabed",
        },
      },
      {
        src: "/uploads/el-vacio-still-slumber.webp",
        alt: "El Vacío Letargo",
        caption: {
          es: "Fotograma 0140 · Letargo abisal y cáusticas reflectantes",
          en: "Frame 0140 · Slumber in the deep abyss and reflective caustics",
        },
      },
      {
        src: "/uploads/el-vacio-still-lightbeam.webp",
        alt: "El Vacío Haz de Luz",
        caption: {
          es: "Fotograma 0190 · Haz de luz cenital volumétrico",
          en: "Frame 0190 · Penetrating volumetric light beam",
        },
      },
      {
        src: "/uploads/el-vacio-viewport-setup.webp",
        alt: "El Vacío Setup Blender",
        caption: {
          es: "Setup técnico en Blender 5.2 · Tarjetas de proyección, cámara cenital y geometría de escena",
          en: "Blender 5.2 technical setup · Projection cards, overhead camera, and scene geometry",
        },
      },
      {
        src: "/uploads/el-vacio-falling-scene.webp",
        alt: "El Vacío Escena Caída",
        caption: {
          es: "Render de la caída · Partículas de sedimento marino y columna oceánica profunda",
          en: "Descent render · Marine sediment particles and deep ocean column",
        },
      },
      {
        src: "/uploads/el-vacio-still-gaze.webp",
        alt: "El Vacío Mirada Marioneta",
        caption: {
          es: "Fotograma 0250 · Mirada directa de la marioneta a cámara",
          en: "Frame 0250 · Direct puppet gaze to camera",
        },
      },
    ],
  },
  {
    id: "art-toy-conejo",
    projectId: "art-toy-conejo",
    modelId: "conejo-art-toy",
    category: "art-toy",
    title: {
      es: "Art Toy Conejo · Escultura & Personaje 3D",
      en: "Art Toy Rabbit · 3D Sculpture & Character",
    },
    characterName: {
      es: "Conejo Jardinero · Coleccionable 3D",
      en: "Gardener Rabbit · 3D Collectible",
    },
    roleBadge: {
      es: "Art Toy Coleccionable",
      en: "Collectible Art Toy",
    },
    tag: {
      es: "Modelado 3D · Art Toy & Escultura Digital",
      en: "3D Modeling · Art Toy & Digital Sculpture",
    },
    client: "Proyecto de Autor / Arte Digital",
    year: "2024",
    specs: {
      es: "3.8 MB GLB (Sin caja) / 8.8 MB (Con empaque) · Malla subdividida · Shaders PBR & Accesorios",
      en: "3.8 MB GLB (No box) / 8.8 MB (In box) · Subdivided mesh · PBR shaders & Accessories",
    },
    coverImage: "/uploads/art-toy-conejo-cover.webp",
    previewImages: [
      {
        src: "/uploads/art-toy-conejo-cover.webp",
        alt: "Art Toy Conejo Vista Frontal",
        caption: { es: "Vista frontal estilizada", en: "Stylized front view" },
      },
      {
        src: "/uploads/art-toy-conejo-caja.webp",
        alt: "Art Toy Conejo en Caja de Colección",
        caption: {
          es: "Empaque de coleccionista con ventana acrílica translúcida",
          en: "Collector packaging box with translucent acrylic window",
        },
      },
      {
        src: "/uploads/art-toy-conejo-perspective.webp",
        alt: "Art Toy Conejo Perspectiva 3/4",
        caption: { es: "Perspectiva de estudio 3/4", en: "Studio 3/4 perspective" },
      },
      {
        src: "/uploads/art-toy-conejo-details.webp",
        alt: "Art Toy Conejo Detalles",
        caption: {
          es: "Detalles de modelado: overol, tijeras, regadera y herramientas",
          en: "Modeling details: overalls, shears, watering can and tools",
        },
      },
      {
        src: "/uploads/art-toy-conejo-front.webp",
        alt: "Art Toy Conejo Vista Completa",
        caption: { es: "Escultura completa con base y herramientas", en: "Full sculpture with pedestal base and tools" },
      },
    ],
  },
  {
    id: "skincare-crema",
    projectId: "veravetalize",
    modelId: "skincare-crema",
    category: "producto-escena",
    title: {
      es: "VeraVitalize · Envase Cosmético 3D Translúcido",
      en: "VeraVitalize · 3D Translucent Cosmetic Jar",
    },
    characterName: {
      es: "Envase Translúcido & Crema Regenerativa",
      en: "Translucent Jar & Regenerative Cream",
    },
    roleBadge: {
      es: "Diseño de Empaque 3D",
      en: "3D Packaging Design",
    },
    tag: {
      es: "Diseño de Empaque 3D · Branding Skincare",
      en: "3D Packaging Design · Skincare Branding",
    },
    client: "VeraVitalize Skincare",
    year: "2024",
    specs: {
      es: "1.8 MB GLB · Acrílico translúcido esmerilado · Crema interior veteada",
      en: "1.8 MB GLB · Frosted translucent acrylic · Visible internal cream",
    },
    coverImage: "/uploads/skincare-crema-perspective.webp",
    previewImages: [
      {
        src: "/uploads/skincare-crema-perspective.webp",
        alt: "VeraVitalize Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Envase y crema interior",
          en: "3/4 Perspective · Jar & interior cream",
        },
      },
      {
        src: "/uploads/skincare-crema-front.webp",
        alt: "VeraVitalize Vista Frontal",
        caption: {
          es: "Vista frontal · Shading PBR y tipografía",
          en: "Front view · PBR shading & typography",
        },
      },
      {
        src: "/uploads/skincare-crema-top.webp",
        alt: "VeraVitalize Vista Cenital",
        caption: {
          es: "Vista cenital · Remolino de crema regenerativa",
          en: "Top view · Regenerative cream swirl",
        },
      },
      {
        src: "/uploads/skincare-crema-detail.webp",
        alt: "VeraVitalize Detalle Lateral",
        caption: {
          es: "Detalle lateral · Acrílico translúcido y refracción",
          en: "Side detail · Translucent acrylic refraction",
        },
      },
    ],
  },
  {
    id: "inartiva-chibi",
    projectId: "inartiva-studio",
    modelId: "inartiva-chibi",
    category: "personaje",
    title: {
      es: "Inartiva Chibi · Explorador Digital",
      en: "Inartiva Chibi · Digital Explorer",
    },
    characterName: {
      es: "Personaje 3D Estilizado en Meditación",
      en: "Stylized 3D Character in Meditation",
    },
    roleBadge: {
      es: "Personaje 3D Toon",
      en: "3D Toon Character",
    },
    tag: {
      es: "Personaje 3D · Estilo Chibi & Shading Toon Neón",
      en: "3D Character · Chibi Style & Neon Toon Shading",
    },
    client: "Inartiva Studio",
    year: "2024",
    specs: {
      es: "0.74 MB GLB · 19.6k polígonos · Topología limpia (99.8% quads)",
      en: "0.74 MB GLB · 19.6k polygons · Clean topology (99.8% quads)",
    },
    coverImage: "/uploads/inartiva-chibi-front.webp",
    previewImages: [
      {
        src: "/uploads/inartiva-chibi-front.webp",
        alt: "Inartiva Chibi Vista Frontal",
        caption: {
          es: "Vista frontal · Shading toon neón y ojos luminosos",
          en: "Front view · Neon toon shading & glowing eyes",
        },
      },
      {
        src: "/uploads/inartiva-chibi-perspective.webp",
        alt: "Inartiva Chibi Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Contorno Fresnel neón cyan",
          en: "3/4 Perspective · Cyan neon Fresnel rim",
        },
      },
      {
        src: "/uploads/inartiva-chibi-side.webp",
        alt: "Inartiva Chibi Perfil Lateral",
        caption: {
          es: "Perfil lateral · Silueta estilizada en meditación",
          en: "Side profile · Stylized meditation silhouette",
        },
      },
      {
        src: "/uploads/inartiva-chibi-back.webp",
        alt: "Inartiva Chibi Vista Posterior",
        caption: {
          es: "Vista posterior · Resplandor de borde y pose de loto",
          en: "Back view · Rim glow & lotus pose",
        },
      },
    ],
  },
  {
    id: "house-toon",
    projectId: "the-old-man-and-the-sea",
    modelId: "house-toon",
    category: "producto-escena",
    title: {
      es: "Muelle Costero · Maqueta Toon (El Viejo y el Mar)",
      en: "Coastal Dock · Toon Diorama (The Old Man and the Sea)",
    },
    characterName: {
      es: "Muelle Pesquero & Cabaña sobre Pilotes",
      en: "Fishing Dock & Stilt Cabin",
    },
    roleBadge: {
      es: "Diorama 3D Toon",
      en: "Toon 3D Diorama",
    },
    tag: {
      es: "Diorama 3D · Toon Shading & Narrativa Visual",
      en: "3D Diorama · Toon Shading & Visual Storytelling",
    },
    client: "Proyecto de Autor / El Viejo y el Mar",
    year: "2024",
    specs: {
      es: "1.0 MB GLB · 11 objetos modulares · Toon cel-shading",
      en: "1.0 MB GLB · 11 modular objects · Toon cel-shading",
    },
    coverImage: "/uploads/house-toon-render.webp",
    previewImages: [
      {
        src: "/uploads/house-toon-render.webp",
        alt: "Muelle Costero Render Toon",
        caption: {
          es: "Vista frontal del muelle · Cabaña y barca pesquera",
          en: "Dock front view · Cabin & fishing boat",
        },
      },
      {
        src: "/uploads/the-old-man-shot3.webp",
        alt: "El Viejo y el Mar Fotograma 2",
        caption: {
          es: "Render 3D en el mar · El pescador en la barca",
          en: "3D sea render · Fisherman in the boat",
        },
      },
      {
        src: "/uploads/the-old-man-shot1.webp",
        alt: "El Viejo y el Mar Fotograma 1",
        caption: {
          es: "Render 3D interior · Animación y modelado de personajes",
          en: "3D interior render · Character animation & modeling",
        },
      },
      {
        src: "/uploads/house-toon-boat.webp",
        alt: "Muelle Costero Vista 3D",
        caption: {
          es: "Vista de maqueta 3D · Muelle y embarcación",
          en: "3D diorama view · Dock & boat",
        },
      },
    ],
  },
  {
    id: "afore-personaje-1",
    projectId: "afore-personaje-1",
    modelId: "personaje-1",
    category: "aforeaventura",
    title: {
      es: "AforeAventura · Personaje 1 (Juventud)",
      en: "AforeAventura · Character 1 (Youth)",
    },
    characterName: {
      es: "Peón Miniatura con Sudadera & Bermudas",
      en: "Hoodie & Shorts Miniature Token",
    },
    roleBadge: {
      es: "Peón STL Juventud",
      en: "Youth STL Token",
    },
    tag: {
      es: "Impresión 3D STL · Modelado de Personaje",
      en: "3D Print STL · Character Modeling",
    },
    client: "AforeAventura / Educación Lúdica",
    year: "2024",
    specs: {
      es: "Escala 10 cm · STL 71.4 MB → GLB 43.5 MB · Shaders PBR & Base",
      en: "10 cm scale · STL 71.4 MB → GLB 43.5 MB · PBR Shaders & Base",
    },
    coverImage: "/uploads/afore-p1-perspective.webp",
    previewImages: [
      {
        src: "/uploads/afore-p1-perspective.webp",
        alt: "AforeAventura Personaje 1 Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Modelado de estudio con peana de juego",
          en: "3/4 Perspective · Studio sculpt with game pedestal",
        },
      },
      {
        src: "/uploads/afore-p1-front.webp",
        alt: "AforeAventura Personaje 1 Vista Frontal",
        caption: {
          es: "Vista frontal · Silueta estilizada y sudadera blanca",
          en: "Front view · Stylized silhouette and white hoodie",
        },
      },
      {
        src: "/uploads/afore-p1-detail.webp",
        alt: "AforeAventura Personaje 1 Detalles Rostro",
        caption: {
          es: "Detalle de rostro y capucha de sudadera",
          en: "Face and hoodie close-up detail",
        },
      },
      {
        src: "/uploads/afore-p1-side.webp",
        alt: "AforeAventura Personaje 1 Perfil Lateral",
        caption: {
          es: "Perfil lateral · Proporciones de peón de mesa",
          en: "Side profile · Tabletop token proportions",
        },
      },
    ],
  },
  {
    id: "afore-personaje-2",
    projectId: "afore-personaje-2",
    modelId: "personaje-2",
    category: "aforeaventura",
    title: {
      es: "AforeAventura · Personaje 2 (Ejecutiva)",
      en: "AforeAventura · Character 2 (Executive)",
    },
    characterName: {
      es: "Peón Miniatura con Abrigo Verde",
      en: "Green Overcoat Miniature Token",
    },
    roleBadge: {
      es: "Peón STL Ejecutiva",
      en: "Executive STL Token",
    },
    tag: {
      es: "Impresión 3D STL · Escultura de Personaje",
      en: "3D Print STL · Character Sculpture",
    },
    client: "AforeAventura / Educación Lúdica",
    year: "2024",
    specs: {
      es: "Escala 10 cm · STL 138.2 MB → GLB 57.0 MB · Shaders PBR & Abrigo",
      en: "10 cm scale · STL 138.2 MB → GLB 57.0 MB · PBR Shaders & Overcoat",
    },
    coverImage: "/uploads/afore-p2-perspective.webp",
    previewImages: [
      {
        src: "/uploads/afore-p2-perspective.webp",
        alt: "AforeAventura Personaje 2 Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Abrigo verde, falda negra y botas altas",
          en: "3/4 Perspective · Green coat, black skirt and boots",
        },
      },
      {
        src: "/uploads/afore-p2-front.webp",
        alt: "AforeAventura Personaje 2 Vista Frontal",
        caption: {
          es: "Vista frontal · Silueta estilizada y peinado con flequillo",
          en: "Front view · Stylized silhouette and bangs hairstyle",
        },
      },
      {
        src: "/uploads/afore-p2-detail.webp",
        alt: "AforeAventura Personaje 2 Detalle Rostro",
        caption: {
          es: "Detalle de rostro y esculpido de cabello",
          en: "Face and hair sculpting detail",
        },
      },
      {
        src: "/uploads/afore-p2-side.webp",
        alt: "AforeAventura Personaje 2 Perfil Lateral",
        caption: {
          es: "Perfil lateral · Vuelo del abrigo y postura",
          en: "Side profile · Overcoat flow and posture",
        },
      },
    ],
  },
  {
    id: "afore-personaje-3",
    projectId: "afore-personaje-3",
    modelId: "personaje-3",
    category: "aforeaventura",
    title: {
      es: "AforeAventura · Personaje 3 (Explorador)",
      en: "AforeAventura · Character 3 (Explorer)",
    },
    characterName: {
      es: "Peón Miniatura con Lentes & Túnica",
      en: "Glasses & Tunic Miniature Token",
    },
    roleBadge: {
      es: "Peón STL Explorador",
      en: "Explorer STL Token",
    },
    tag: {
      es: "Impresión 3D STL · Modelado & Prototipado",
      en: "3D Print STL · Modeling & Prototyping",
    },
    client: "AforeAventura / Educación Lúdica",
    year: "2024",
    specs: {
      es: "Escala 10 cm · STL 145.0 MB → GLB 61.6 MB · Gafas & Peana Esculpida",
      en: "10 cm scale · STL 145.0 MB → GLB 61.6 MB · Glasses & Sculpted Pedestal",
    },
    coverImage: "/uploads/afore-p3-perspective.webp",
    previewImages: [
      {
        src: "/uploads/afore-p3-perspective.webp",
        alt: "AforeAventura Personaje 3 Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Gafas metálicas, túnica y brazo extendido",
          en: "3/4 Perspective · Metal glasses, tunic and outstretched arm",
        },
      },
      {
        src: "/uploads/afore-p3-front.webp",
        alt: "AforeAventura Personaje 3 Vista Frontal",
        caption: {
          es: "Vista frontal · Silueta estilizada y peana de mesa",
          en: "Front view · Stylized silhouette and tabletop pedestal",
        },
      },
      {
        src: "/uploads/afore-p3-detail.webp",
        alt: "AforeAventura Personaje 3 Detalle Gafas",
        caption: {
          es: "Detalle de montura de gafas y peinado rizado",
          en: "Glasses frame and curly hairstyle detail",
        },
      },
      {
        src: "/uploads/afore-p3-side.webp",
        alt: "AforeAventura Personaje 3 Perfil Lateral",
        caption: {
          es: "Perfil lateral · Proporciones de peón de mesa",
          en: "Side profile · Tabletop token proportions",
        },
      },
    ],
  },
  {
    id: "afore-personaje-4",
    projectId: "afore-personaje-4",
    modelId: "personaje-4",
    category: "aforeaventura",
    title: {
      es: "AforeAventura · Personaje 4 (Silla de Ruedas)",
      en: "AforeAventura · Character 4 (Wheelchair)",
    },
    characterName: {
      es: "Peón Miniatura Inclusivo en Silla de Ruedas",
      en: "Inclusive Wheelchair Miniature Token",
    },
    roleBadge: {
      es: "Peón STL Inclusivo",
      en: "Inclusive STL Token",
    },
    tag: {
      es: "Impresión 3D STL · Escultura Digital Inclusiva",
      en: "3D Print STL · Inclusive Digital Sculpture",
    },
    client: "AforeAventura / Educación Lúdica",
    year: "2024",
    specs: {
      es: "Escala 10 cm · STL 49.7 MB → GLB 36.6 MB · Silla de ruedas & Señal de paz",
      en: "10 cm scale · STL 49.7 MB → GLB 36.6 MB · Full wheelchair & Peace sign",
    },
    coverImage: "/uploads/afore-p4-perspective.webp",
    previewImages: [
      {
        src: "/uploads/afore-p4-perspective.webp",
        alt: "AforeAventura Personaje 4 Perspectiva 3D",
        caption: {
          es: "Perspectiva 3/4 · Posa inclusiva con señal de paz ✌️",
          en: "3/4 Perspective · Inclusive pose with peace sign ✌️",
        },
      },
      {
        src: "/uploads/afore-p4-front.webp",
        alt: "AforeAventura Personaje 4 Vista Frontal",
        caption: {
          es: "Vista frontal · Cabello coral, camisa marfil y silla de ruedas",
          en: "Front view · Coral hair, ivory shirt and wheelchair",
        },
      },
      {
        src: "/uploads/afore-p4-detail.webp",
        alt: "AforeAventura Personaje 4 Detalle Rostro",
        caption: {
          es: "Detalle de rostro expresivo y gesto de paz",
          en: "Expressive face and peace gesture detail",
        },
      },
      {
        src: "/uploads/afore-p4-side.webp",
        alt: "AforeAventura Personaje 4 Perfil Lateral",
        caption: {
          es: "Perfil lateral · Estructura mecánica de la silla de ruedas",
          en: "Side profile · Wheelchair mechanical structure",
        },
      },
    ],
  },
];

interface LightboxState {
  title: string;
  projectId: string;
  images: { src: string; alt: string; caption?: { es: string; en: string } }[];
  currentIndex: number;
}

function ThreeDPortfolioPage() {
  const { lang, t } = useI18n();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  // Filter definitions
  const categories = useMemo(
    () => [
      {
        key: "all",
        label: tx(lang, "Todos los Modelos 3D", "All 3D Models"),
        count: THREE_D_MODELS.length,
      },
      {
        key: "personajes",
        label: tx(lang, "Personajes & Art Toys", "Characters & Art Toys"),
        filter: (m: ThreeDModelItem) =>
          m.category === "art-toy" ||
          m.category === "aforeaventura" ||
          m.category === "personaje" ||
          m.id === "inartiva-chibi",
        count: THREE_D_MODELS.filter(
          (m) =>
            m.category === "art-toy" ||
            m.category === "aforeaventura" ||
            m.category === "personaje" ||
            m.id === "inartiva-chibi",
        ).length,
      },
      {
        key: "aforeaventura",
        label: tx(lang, "AforeAventura STL", "AforeAventura STL"),
        filter: (m: ThreeDModelItem) => m.category === "aforeaventura",
        count: THREE_D_MODELS.filter((m) => m.category === "aforeaventura").length,
      },
      {
        key: "producto-escena",
        label: tx(lang, "Producto & Escena 3D", "Product & 3D Scene"),
        filter: (m: ThreeDModelItem) => m.category === "producto-escena",
        count: THREE_D_MODELS.filter((m) => m.category === "producto-escena").length,
      },
      {
        key: "wip",
        label: tx(lang, "En Progreso (WIP)", "In Progress (WIP)"),
        filter: (m: ThreeDModelItem) => m.status === "wip",
        count: THREE_D_MODELS.filter((m) => m.status === "wip").length,
      },
    ],
    [lang],
  );

  const currentCategoryObj = categories.find((c) => c.key === activeCategory) || categories[0];

  const filteredModels = useMemo(() => {
    if (activeCategory === "all" || !currentCategoryObj.filter) {
      return THREE_D_MODELS;
    }
    return THREE_D_MODELS.filter(currentCategoryObj.filter);
  }, [activeCategory, currentCategoryObj]);

  // Reveal animation on change
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.05 },
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    const timer = setTimeout(() => {
      elements.forEach((el) => el.classList.add("is-visible"));
    }, 120);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeCategory]);

  // Lightbox keyboard handling
  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowRight") {
        setLightbox((prev) =>
          prev ? { ...prev, currentIndex: (prev.currentIndex + 1) % prev.images.length } : null,
        );
      } else if (e.key === "ArrowLeft") {
        setLightbox((prev) =>
          prev
            ? {
                ...prev,
                currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
              }
            : null,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const openLightbox = (item: ThreeDModelItem, imgIdx: number = 0) => {
    setLightbox({
      title: item.title[lang] || item.title.es,
      projectId: item.projectId,
      images: item.previewImages,
      currentIndex: imgIdx,
    });
  };

  return (
    <main className="grain bg-canvas text-ink min-h-screen">
      {/* Header Section */}
      <section className="px-6 pb-12 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-ink/10 pb-12">
            {/* Top Navigation */}
            <div>
              <Link
                to="/$lang"
                params={{ lang }}
                className="story-link text-xs font-semibold uppercase tracking-[0.25em] text-muted w-fit"
              >
                ← {t.ui.home}
              </Link>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                  <Box className="size-3.5" />
                  <span>3D Artist · Modeling · Realtime</span>
                </div>
                <h1 className="font-serif text-5xl tracking-tight text-ink md:text-7xl lg:text-8xl">
                  {tx(lang, "Modelado & Arte 3D", "3D Modeling & Art")}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  {tx(
                    lang,
                    "Galería de modelos 3D en tiempo real: esculturas digitales, Art Toys, figuras para impresión STL, envases de producto y dioramas arquitectónicos.",
                    "Real-time 3D gallery: digital sculptures, Art Toys, STL 3D print figures, product packaging, and architectural dioramas.",
                  )}
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="w-full lg:w-auto">
                <div className="flex max-w-full items-center gap-1.5 overflow-x-auto p-1 no-scrollbar rounded-xl border border-ink/10 bg-surface/80 shadow-sm backdrop-blur-md">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setActiveCategory(cat.key)}
                        className={`group relative flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                          isActive
                            ? "bg-ink text-canvas shadow-sm"
                            : "text-muted hover:bg-ink/5 hover:text-ink"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full transition-colors ${
                            isActive ? "bg-accent" : "bg-muted/40 group-hover:bg-accent"
                          }`}
                        />
                        <span>{cat.label}</span>
                        <span className="text-[10px] opacity-60">({cat.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Visual Gallery Grid - 2 Columns */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {filteredModels.map((item) => {
              const titleStr = item.title[lang] || item.title.es;
              const tagStr = item.tag[lang] || item.tag.es;

              const currentImgIdx = activeImageIndices[item.id] || 0;
              const currentDisplayImage = item.previewImages[currentImgIdx]?.src || item.coverImage;

              return (
                <article
                  key={item.id}
                  className="reveal group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-surface/40 p-3.5 shadow-xs transition-all duration-500 hover:border-accent/40 hover:bg-surface/80 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image Presentation Container */}
                  <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-ink/5 ring-1 ring-ink/5">
                    <img
                      src={currentDisplayImage}
                      alt={titleStr}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Top Badges */}
                    <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-canvas/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink backdrop-blur-md shadow-xs">
                        {item.year}
                      </span>
                      {item.status === "wip" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md shadow-xs">
                          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span>{tx(lang, "En Progreso", "In Progress")}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md shadow-xs">
                          <span className="size-1.5 rounded-full bg-emerald-400" />
                          <span>{tx(lang, "Completado", "Completed")}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-canvas shadow-xs">
                        <RotateCw className="size-2.5 animate-spin" />
                        <span>3D GLB / Tiempo Real</span>
                      </span>
                    </div>

                    {/* Quick Lightbox Inspection Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        openLightbox(item, currentImgIdx);
                      }}
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-canvas/85 text-ink shadow-sm backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-accent hover:text-canvas hover:scale-110 active:scale-95"
                      title={tx(
                        lang,
                        "Ampliar render en alta resolución",
                        "Enlarge high-res render",
                      )}
                      aria-label="Zoom image"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>

                    {/* Mini Thumbnails Strip / Multi-Angle Selector */}
                    {item.previewImages.length > 1 && (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 rounded-lg bg-black/45 p-1.5 backdrop-blur-md transition-opacity duration-300">
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                          {item.previewImages.map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setActiveImageIndices((prev) => ({
                                  ...prev,
                                  [item.id]: idx,
                                }));
                              }}
                              className={`relative size-8 shrink-0 overflow-hidden rounded-md border transition-all ${
                                currentImgIdx === idx
                                  ? "border-accent scale-105 ring-1 ring-accent"
                                  : "border-white/30 opacity-70 hover:opacity-100 hover:border-white"
                              }`}
                              title={tx(
                                lang,
                                `Ver ángulo/render ${idx + 1}`,
                                `View angle/render ${idx + 1}`,
                              )}
                            >
                              <img
                                src={img.src}
                                alt={`Thumbnail ${idx + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-white/80 shrink-0 pr-1">
                          {currentImgIdx + 1}/{item.previewImages.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Minimal Focused Card Body */}
                  <div className="flex flex-col gap-2 pt-4 px-1 pb-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-accent truncate">
                      {tagStr}
                    </span>

                    <Link
                      to="/$lang/projects/$projectId"
                      params={{ lang, projectId: item.projectId }}
                      className="group/title block focus:outline-hidden"
                    >
                      <h3 className="font-serif text-2xl sm:text-3xl tracking-tight text-ink transition-colors duration-200 group-hover/title:text-accent font-medium leading-snug">
                        {titleStr}
                      </h3>
                    </Link>

                    {/* Direct Action Links */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
                      <Link
                        to="/$lang/projects/$projectId"
                        params={{ lang, projectId: item.projectId }}
                        className="group/btn relative inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-canvas shadow-sm transition-all duration-300 hover:bg-accent hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>{tx(lang, "Explorar proyecto 3D", "Explore 3D Project")}</span>
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>

                      <Link
                        to="/$lang/projects/$projectId"
                        params={{ lang, projectId: item.projectId }}
                        hash="model-viewer"
                        className="group/3d inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-xs backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent hover:-translate-y-0.5 active:translate-y-0"
                        title={tx(
                          lang,
                          "Abrir modelo en el visor 3D interactivo",
                          "Open model in 3D interactive viewer",
                        )}
                      >
                        <RotateCw className="size-3.5 text-accent transition-transform duration-500 group-hover/3d:rotate-180" />
                        <span>{tx(lang, "Ver en 3D 360°", "View in 3D 360°")}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for 3D Renders */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-lg animate-page-reveal"
          onClick={() => setLightbox(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-110 hover:bg-white/20 active:scale-95"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>

          {/* Lightbox Content */}
          {(() => {
            const current = lightbox.images[lightbox.currentIndex] || lightbox.images[0];
            const captionStr = current.caption
              ? current.caption[lang] || current.caption.es
              : current.alt;

            return (
              <div
                className="relative flex flex-col items-center max-w-5xl w-full h-[90vh] justify-between p-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Information in Lightbox */}
                <div className="flex w-full items-center justify-between text-white/80 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-white">{lightbox.title}</span>
                    <span className="text-xs uppercase tracking-widest text-accent font-mono">
                      {lightbox.currentIndex + 1} / {lightbox.images.length}
                    </span>
                  </div>

                  <Link
                    to="/$lang/projects/$projectId"
                    params={{ lang, projectId: lightbox.projectId }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-canvas transition-transform hover:scale-105 active:scale-95"
                  >
                    <span>{tx(lang, "Ver caso completo", "View Full Case")}</span>
                    <ArrowUpRight className="size-3" />
                  </Link>
                </div>

                {/* Main Render Image */}
                <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden py-2">
                  <img
                    src={current.src}
                    alt={current.alt || "3D High-Res Render"}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
                  />

                  {lightbox.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setLightbox((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  currentIndex:
                                    (prev.currentIndex - 1 + prev.images.length) %
                                    prev.images.length,
                                }
                              : null,
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 hover:scale-110 active:scale-95"
                        aria-label="Render anterior"
                      >
                        <ChevronLeft className="size-6" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setLightbox((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  currentIndex: (prev.currentIndex + 1) % prev.images.length,
                                }
                              : null,
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 hover:scale-110 active:scale-95"
                        aria-label="Render siguiente"
                      >
                        <ChevronRight className="size-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Caption & Thumbnail Picker */}
                <div className="flex flex-col items-center gap-3 w-full pt-2">
                  {captionStr && (
                    <p className="text-center text-xs text-white/70 max-w-xl font-light">
                      {captionStr}
                    </p>
                  )}

                  {lightbox.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto p-1.5 no-scrollbar max-w-full">
                      {lightbox.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setLightbox((prev) => (prev ? { ...prev, currentIndex: idx } : null))
                          }
                          className={`relative size-12 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                            lightbox.currentIndex === idx
                              ? "border-accent scale-110 shadow-lg"
                              : "border-white/20 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img.src}
                            alt={`Slide ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer Contact Section */}
      <ContactSection
        badge={tx(lang, "Comisiones 3D Abiertas · 2026", "3D Commissions Open · 2026")}
        titleLine1={tx(lang, "¿Tienes una idea o personaje 3D?", "Have a 3D idea or character?")}
        titleLine2={tx(lang, "Démosle volumen y textura.", "Let's bring it to life.")}
        subtitle={tx(
          lang,
          "Escríbeme para modelado 3D de personajes, Art Toys, miniaturas para impresión STL, envases de producto o renders en Blender.",
          "Get in touch for 3D character modeling, Art Toys, STL print miniatures, product packaging, or Blender scenes.",
        )}
        formContainerClassName="w-full max-w-2xl text-left"
        showContactInfo={false}
      />
    </main>
  );
}
