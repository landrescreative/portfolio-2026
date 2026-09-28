export interface ProjectMediaImage {
  src: string;
  alt: string;
  caption?: { es: string; en: string };
  span?: "full" | "half" | "third";
}

export interface ProjectDetail {
  id: string;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  category: "web" | "ui" | "3d" | "animation" | "devops" | "photo";
  categoryLabel: { es: string; en: string };
  tag: { es: string; en: string };
  client: string;
  year: string;
  role: { es: string; en: string };
  liveUrl?: string;
  coverImage: string;
  techStack: string[];
  
  // Case Study Story Sections
  overview: { es: string; en: string };
  challenge: { es: string; en: string };
  solution: { es: string; en: string };
  
  // Optional Deliverables Checklist
  deliverables?: { es: string[]; en: string[] };

  // Optional Key Metrics / Stats
  metrics?: {
    label: { es: string; en: string };
    value: string;
  }[];

  // Optional Testimonial / Client Review
  testimonial?: {
    quote: { es: string; en: string };
    client?: string;
    role?: { es: string; en: string };
  };

  // Optional Project Context & Engagement
  duration?: { es: string; en: string };
  priceRange?: string;
  industry?: { es: string; en: string };

  // Optional Video Embed
  video?: {
    youtubeId?: string;
    vimeoId?: string;
    mp4Url?: string;
    poster?: string;
    title: { es: string; en: string };
    aspectRatio?: "video" | "vertical";
  };

  // Optional Interactive 3D Model Viewer
  has3DViewer?: boolean;

  // Flexible Image Gallery
  gallery: ProjectMediaImage[];
}

export const projectsData: Record<string, ProjectDetail> = {
  "art-of-flavors": {
    id: "art-of-flavors",
    title: {
      es: "Art of Flavors — Luxury Culinary & Catering",
      en: "Art of Flavors — Luxury Culinary & Catering"
    },
    subtitle: {
      es: "Diseño web editorial y experiencia digital de alta cocina para firma gastronómica en Atlanta.",
      en: "Editorial web design and digital fine dining experience for an Atlanta culinary catering house."
    },
    category: "web",
    categoryLabel: { es: "Diseño Web & UI/UX", en: "Web Design & UI/UX" },
    tag: { es: "Diseño Web · Gastronomía & Lujo", en: "Web Design · Luxury Culinary" },
    client: "Art of Flavors Catering (Atlanta, GA)",
    year: "2026",
    role: { es: "Diseñador UI/UX & Dirección de Arte Digital", en: "UI/UX Designer & Digital Art Director" },
    coverImage: "/uploads/art-of-flavors-mockup.webp",
    techStack: ["Figma", "UI/UX Design", "Diseño Editorial", "Design System", "Dark Mode UI", "Prototipado"],
    overview: {
      es: "Art of Flavors es una prestigiosa firma de catering gastronómico de alta gama en Atlanta, especializada en cocina fusión del sur de Asia para eventos exclusivos y bodas de lujo. Diseñamos una experiencia web editorial inmersiva en modo oscuro que combina tipografía refinada, acentos dorados y una arquitectura visual enfocada en la reserva de catas y banquetes privados.",
      en: "Art of Flavors is a premier high-end culinary catering house in Atlanta, fusing South Asian culinary mastery with contemporary fine dining. We designed an immersive editorial dark-mode web experience pairing sophisticated typography with subtle gold accents, focused on private tasting and luxury event bookings."
    },
    challenge: {
      es: "El desafío radicaba en transmitir la opulencia y el detalle sensorial de la alta cocina tradicional india en un entorno digital, alejándose de los sitios convencionales de restaurantes para posicionar la firma como una marca de alta hospitalidad.",
      en: "The core challenge was translating the tactile richness and sensory heritage of South Asian gastronomy into a digital interface, breaking away from standard restaurant templates to establish a luxury hospitality brand."
    },
    solution: {
      es: "Desarrollo de una dirección de arte editorial en Figma con fondos carbón oscuro y contrastes dorados cálidos. Creamos un sistema de cuadrícula modular para resaltar la fotografía de platos de autor, jerarquía tipográfica con fuentes serif elegantes y puntos de conversión intuitivos para reservas privadas.",
      en: "Crafted an editorial visual direction in Figma featuring deep charcoal slate backgrounds and warm gold contrasts. Engineered a modular grid showcasing signature dishes, paired classical serif typography with clean modern copy, and streamlined inquiry touchpoints."
    },
    deliverables: {
      es: [
        "Diseño de interfaz UI/UX completo (Desktop & Mobile)",
        "Sistema de diseño y guía de estilos de alta gama",
        "Arquitectura de información y flujo de reservas",
        "Tratamiento visual y dirección de arte fotográfica"
      ],
      en: [
        "Complete UI/UX interface design (Desktop & Mobile)",
        "High-end design system and style guide",
        "Information architecture and booking user flow",
        "Visual curation and photographic art direction"
      ]
    },
    metrics: [
      { label: { es: "Invitados / Evento", en: "Guests / Event" }, value: "500+" },
      { label: { es: "Eventos / Fin de Semana", en: "Events / Weekend" }, value: "10+" },
      { label: { es: "Menús Personalizados", en: "Custom Menus" }, value: "100%" }
    ],
    gallery: [
      {
        src: "/uploads/art-of-flavors-mockup.webp",
        alt: "Art of Flavors Luxury Website Mockup",
        caption: { es: "Mockup editorial de la plataforma web Art of Flavors", en: "Editorial website mockup for Art of Flavors" },
        span: "full"
      }
    ]
  },

  "next-era": {
    id: "next-era",
    title: {
      es: "Next Era Developments",
      en: "Next Era Developments"
    },
    subtitle: {
      es: "Plataforma web de arquitectura inmobiliaria y bienes raíces de alto nivel.",
      en: "High-end real estate and architectural web platform."
    },
    category: "web",
    categoryLabel: { es: "Desarrollo Web & UI", en: "Web Dev & UI" },
    tag: { es: "Diseño UI/UX · Desarrollo Web", en: "UI/UX Design · Web Dev" },
    client: "Next Era Group",
    year: "2026",
    role: { es: "Diseñador UI/UX & Lead Developer", en: "UI/UX Designer & Lead Developer" },
    liveUrl: "https://nexteradevelopments.com",
    coverImage: "/uploads/next-era-cover.jpg",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Webflow", "NGINX"],
    overview: {
      es: "Next Era Developments es una firma líder en desarrollos inmobiliarios sostenibles. El objetivo principal del proyecto fue crear una experiencia digital refinada que refleje la sofisticación arquitectónica de sus propiedades y maximice la captación de prospectos de alto valor.",
      en: "Next Era Developments is a leading firm in sustainable real estate developments. The main objective was to craft a refined digital experience reflecting the architectural sophistication of their properties and driving high-value lead acquisition."
    },
    challenge: {
      es: "El sitio web anterior presentaba tiempos de carga lentos, navegación confusa en dispositivos móviles y una tasa de rebote superior al 60%. Se necesitaba una reconstrucción técnica completa capaz de renderizar galerías de alta resolución sin sacrificar velocidad.",
      en: "The previous website suffered from slow load times, confusing mobile navigation, and a bounce rate exceeding 60%. A complete technical overhaul was required to render high-resolution property galleries without sacrificing speed."
    },
    solution: {
      es: "Diseñamos un sistema de interfaz modular en Figma y desarrollamos una arquitectura frontend ultrarrápida con Next.js y Webflow. Implementamos optimización de imágenes WPO, animaciones de desplazamiento fluidas y formularios de contacto integrados con CRM.",
      en: "We designed a modular UI system in Figma and developed an ultra-fast frontend architecture with Next.js and Webflow. We implemented WPO image optimization, smooth scroll animations, and CRM-integrated inquiry forms."
    },
    deliverables: {
      es: [
        "Diseño completo en Figma (Desktop & Mobile)",
        "Desarrollo Frontend en Next.js & TypeScript",
        "Optimización WPO & SEO Técnico de velocidad",
        "Integración con Servidores Linux NGINX"
      ],
      en: [
        "Full Figma Design System (Desktop & Mobile)",
        "Frontend Development in Next.js & TypeScript",
        "WPO Speed & Technical SEO Optimization",
        "Linux NGINX Server Deployment"
      ]
    },
    metrics: [
      { label: { es: "Velocidad de Carga", en: "Page Load Speed" }, value: "0.8s" },
      { label: { es: "Aumento de Leads", en: "Lead Growth" }, value: "+145%" },
      { label: { es: "Tasa de Retención", en: "Retention Rate" }, value: "88%" }
    ],
    gallery: [
      {
        src: "/uploads/next-era-module_0.jpg",
        alt: "Next Era Real Estate Website Showcase",
        caption: { es: "Presentación general de Next Era Developments", en: "Next Era Developments showcase presentation" },
        span: "full"
      },
      {
        src: "/uploads/next-era-module_2.jpg",
        alt: "Next Era UI/UX Interface Detail",
        caption: { es: "Diseño de interfaz y arquitectura web", en: "UI layout and web architecture" },
        span: "half"
      },
      {
        src: "/uploads/next-era-module_3.jpg",
        alt: "Next Era Responsive View",
        caption: { es: "Experiencia responsiva adaptada", en: "Responsive experience showcase" },
        span: "half"
      },
      {
        src: "/uploads/next-era-module_5.jpg",
        alt: "Next Era Property Catalog",
        caption: { es: "Catálogo de propiedades y especificaciones", en: "Property catalog and specs" },
        span: "full"
      }
    ]
  },

  "vivavia": {
    id: "vivavia",
    title: {
      es: "Agencia de Viajes VIVAVIA",
      en: "VIVAVIA Travel Agency"
    },
    subtitle: {
      es: "Plataforma interactiva de reservaciones e identidad visual para viajes internacionales.",
      en: "Interactive booking platform and visual identity for international travel."
    },
    category: "ui",
    categoryLabel: { es: "Diseño UI/UX", en: "UI/UX Design" },
    tag: { es: "UI/UX · Plataforma de Viajes", en: "UI/UX · Travel Platform" },
    client: "VIVAVIA Travel",
    year: "2025",
    role: { es: "Diseñador UI/UX & Prototipado", en: "UI/UX Designer & Prototyping" },
    liveUrl: "https://vivavia.com",
    coverImage: "/uploads/vivavia website.png",
    techStack: ["Figma", "Design Systems", "Framer", "React"],
    overview: {
      es: "VIVAVIA conecta a viajeros exigentes con experiencias turísticas exclusivas alrededor del mundo. Diseñamos una interfaz visual inspiradora que simplifica el proceso de búsqueda, selección y cotización de itinerarios personalizados.",
      en: "VIVAVIA connects discerning travelers with exclusive tourism experiences worldwide. We designed an inspiring visual interface simplifying the search, selection, and booking of custom travel itineraries."
    },
    challenge: {
      es: "La complejidad de mostrar múltiples destinos, precios dinámicos y paquetes combinados generaba sobrecarga cognitiva en los usuarios. El reto consistió en estructurar una arquitectura de información clara e intuitiva.",
      en: "The complexity of displaying multiple destinations, dynamic pricing, and package bundles created cognitive overload. The challenge was structuring a clear, intuitive information architecture."
    },
    solution: {
      es: "Creamos un sistema de componentes interactivos en Figma centrado en tarjetas de destino visuales, filtros rápidos y un flujo de cotización en tres sencillos pasos.",
      en: "We created an interactive component system in Figma centered on visual destination cards, quick filters, and a streamlined 3-step quote flow."
    },
    deliverables: {
      es: [
        "Investigación de Usuarios & Wireframing",
        "Sistema de Diseño Visual en Figma",
        "Prototipo Interactivo de Alta Fidelidad",
        "Kit de Componentes Reutilizables"
      ],
      en: [
        "User Research & Wireframing",
        "Visual Design System in Figma",
        "High-Fidelity Interactive Prototype",
        "Reusable Component Library"
      ]
    },
    metrics: [
      { label: { es: "Conversión de Cotización", en: "Quote Conversion" }, value: "+92%" },
      { label: { es: "Tiempo en Sitio", en: "Time on Site" }, value: "4m 20s" }
    ],
    gallery: [
      {
        src: "/uploads/vivavia website.png",
        alt: "VIVAVIA Destination Showcase",
        caption: { es: "Pantalla principal y plataforma web de VIVAVIA", en: "Main VIVAVIA web platform and destination screen" },
        span: "full"
      },
      {
        src: "/uploads/render vivavia.jpg",
        alt: "VIVAVIA 3D Render & Brand Assets",
        caption: { es: "Render 3D y aplicaciones visuales de marca", en: "3D render and brand visual applications" },
        span: "half"
      },
      {
        src: "/uploads/vivavia-mockup.png",
        alt: "VIVAVIA Brand Mockup",
        caption: { es: "Mockup de identidad de marca", en: "Brand identity mockup" },
        span: "half"
      }
    ]
  },

  "veravetalize": {
    id: "veravetalize",
    title: {
      es: "VeraVitalize Cosmética",
      en: "VeraVitalize Cosmetics"
    },
    subtitle: {
      es: "Sección hero editorial, identidad visual y experiencia digital para marca premium de cuidado de la piel.",
      en: "Editorial hero section, visual identity, and digital experience for premium skincare brand."
    },
    category: "ui",
    categoryLabel: {
      es: "Diseño UI/UX & Web",
      en: "UI/UX & Web Design"
    },
    tag: {
      es: "Diseño Web · UI/UX & Branding",
      en: "Web Design · UI/UX & Branding"
    },
    client: "VeraVitalize Skincare",
    year: "2025",
    role: {
      es: "Diseñador UI/UX & Dirección de Arte",
      en: "UI/UX Designer & Art Director"
    },
    liveUrl: "https://veravitalize.vercel.app/",
    coverImage: "/uploads/veravitalize-portada.jpg",
    techStack: [
      "Figma",
      "UI/UX Design",
      "Three.js",
      "Blender",
      "After Effects",
      "Photoshop",
      "Diseño Editorial",
      "E-Commerce"
    ],
    overview: {
      es: "VeraVitalize es una línea de cosmética botánica y productos orgánicos para el cuidado de la piel. Desarrollamos una experiencia de marca y diseño web editorial elegante que combina tipografía refinada, paleta de tonos naturales y una presentación visual inmersiva para destacar la pureza e ingredientes botánicos del producto.",
      en: "VeraVitalize is an organic skincare and botanical cosmetics brand. We developed an elegant editorial brand experience and web design pairing refined typography, natural tone palettes, and immersive visual storytelling highlighting product purity."
    },
    challenge: {
      es: "Crear una presencia digital sofisticada que comunique el balance entre ciencia botánica y lujo orgánico, optimizando cada interacción y elemento visual para inspirar confianza y deseo de compra.",
      en: "Craft a sophisticated digital presence balancing botanical science and organic luxury, optimizing every interaction and visual asset to build consumer trust and desire."
    },
    solution: {
      es: "Estructuramos un diseño web editorial minimalista en Figma, complementado con renderizados y animaciones de producto para showcases dinámicos, junto con aplicaciones de packaging y branding de alta fidelidad.",
      en: "We structured a minimalist editorial web design in Figma, complemented by product renders and motion showcases alongside high-fidelity packaging and brand applications."
    },
    deliverables: {
      es: [
        "Diseño UI/UX y Sistema Web en Figma",
        "Renderizado y Composición Visual de Producto",
        "Identidad Visual Editorial y Mockups de Marca",
        "Animación y Video Showcase Promocional"
      ],
      en: [
        "UI/UX Design & Web System in Figma",
        "3D Product Rendering & Visual Composition",
        "Editorial Visual Identity & Brand Mockups",
        "Promotional Animation & Video Showcase"
      ]
    },
    metrics: [
      { label: { es: "Diseño UI/UX", en: "UI/UX Design" }, value: "Figma" },
      { label: { es: "Motion & Video", en: "Motion & Video" }, value: "After Effects" },
      { label: { es: "Enfoque", en: "Focus" }, value: "E-Commerce" }
    ],
    video: {
      mp4Url: "/uploads/veravitalize-video.mp4",
      poster: "/uploads/veravitalize-portada.jpg",
      title: {
        es: "Video Showcase & Motion de Producto",
        en: "Product Motion & Video Showcase"
      },
      aspectRatio: "video"
    },
    gallery: [
      {
        src: "/uploads/veravitalize-behance-full.jpg",
        alt: "VeraVitalize Full Behance Presentation",
        caption: {
          es: "Presentación integral del proyecto VeraVitalize Cosmética",
          en: "Comprehensive project showcase for VeraVitalize Cosmetics"
        },
        span: "full"
      },
      {
        src: "/uploads/veravitalize-mockup-editorial.jpg",
        alt: "VeraVitalize Packaging Mockup",
        caption: {
          es: "Mockup editorial y composición de packaging",
          en: "Editorial packaging mockup and composition"
        },
        span: "half"
      },
      {
        src: "/uploads/veravitalize-ui-detail.png",
        alt: "VeraVitalize UI Detail",
        caption: {
          es: "Detalle de interfaz de usuario y arquitectura visual",
          en: "User interface detail and visual architecture"
        },
        span: "half"
      },
      {
        src: "/uploads/veravitalize-tape.jpg",
        alt: "VeraVitalize Branding Tape",
        caption: {
          es: "Detalle de cinta y texturas de marca VeraVitalize",
          en: "Brand tape detail and textures for VeraVitalize"
        },
        span: "full"
      }
    ]
  },

  "scoop-doggy": {
    id: "scoop-doggy",
    title: {
      es: "Scoop Doggy Dog",
      en: "Scoop Doggy Dog"
    },
    subtitle: {
      es: "Identidad de marca moderna y plataforma de servicios de limpieza de mascotas.",
      en: "Modern brand identity and pet service booking platform."
    },
    category: "ui",
    categoryLabel: { es: "Diseño UI/UX & Branding", en: "UI/UX & Branding" },
    tag: { es: "Branding · UI/UX", en: "Branding · UI/UX" },
    client: "Scoop Doggy Dog Inc.",
    year: "2025",
    role: { es: "Diseñador de Marca & UI/UX", en: "Brand & UI/UX Designer" },
    coverImage: "/uploads/scoop-doggy-cover.jpg",
    techStack: ["Figma", "Illustrator", "React", "Webflow"],
    overview: {
      es: "Scoop Doggy Dog ofrece servicios profesionales de mantenimiento y limpieza para dueños de mascotas. Diseñamos una identidad de marca vibrante, amigable y confiable.",
      en: "Scoop Doggy Dog provides professional pet waste management services. We crafted a vibrant, friendly, and trustworthy brand identity."
    },
    challenge: {
      es: "Transformar un servicio convencional en una experiencia digital atractiva con suscripciones automatizadas y reservas agendadas.",
      en: "Transform a conventional service into an engaging digital experience featuring automated subscriptions and scheduled bookings."
    },
    solution: {
      es: "Desarrollamos una paleta de colores audaz, ilustraciones personalizadas y un flujo de contratación de servicios en menos de un minuto.",
      en: "We created a bold color palette, custom illustrations, and a seamless 1-minute service subscription flow."
    },
    gallery: [
      {
        src: "/uploads/scoop-doggy-module_0.jpg",
        alt: "Scoop Doggy Dog Branding and Web UI",
        caption: { es: "Diseño visual de marca y web UI para Scoop Doggy Dog", en: "Visual brand design and web UI for Scoop Doggy Dog" },
        span: "full"
      },
      {
        src: "/uploads/scoop-doggy-module_1.png",
        alt: "Scoop Doggy Dog Interface & Component Overview",
        caption: { es: "Flujo de reservas y componentes interactivos", en: "Booking flow and interactive components overview" },
        span: "full"
      }
    ]
  },

  "casa-tonala": {
    id: "casa-tonala",
    title: {
      es: "Casa Tonalá",
      en: "Casa Tonalá"
    },
    subtitle: {
      es: "Animación 3D en Blender, diseño de personajes y motion graphics para video institucional.",
      en: "3D animation in Blender, character design, and motion graphics for institutional video."
    },
    category: "animation",
    categoryLabel: { es: "Animación / VFX / Postproducción", en: "Animation / VFX / Post-Production" },
    tag: { es: "Animación 3D (Blender) · Motion Graphics", en: "3D Animation (Blender) · Motion Graphics" },
    client: "Casa Tonalá",
    year: "2025",
    role: { es: "Animador 3D & Diseñador de Motion Graphics", en: "3D Animator & Motion Graphics Designer" },
    liveUrl: "https://youtu.be/oBXY-uGg7O4",
    coverImage: "/uploads/casa-tonala-cover.jpg",
    techStack: ["Blender", "After Effects", "Adobe Illustrator", "Animación 3D", "Motion Graphics", "Premiere Pro"],
    overview: {
      es: "Producción audiovisual y animación para Casa Tonalá. El proyecto combinó modelado y animación 3D en Blender con ilustración vectorial y motion design en After Effects, logrando una estética dinámica y humana para comunicar la labor comunitaria.",
      en: "Audiovisual production and animation for Casa Tonalá. The project combined 3D modeling and animation in Blender with vector illustration and motion design in After Effects, delivering a dynamic, human-centered message."
    },
    challenge: {
      es: "Integrar de forma armónica elementos y animaciones 3D de Blender con gráficos 2D estilizados manteniendo coherencia visual y fluidez.",
      en: "Seamlessly integrating Blender 3D elements and animation with stylized 2D graphics while maintaining visual rhythm and warmth."
    },
    solution: {
      es: "Pipeline híbrido que combina animación de cámaras y objetos en Blender, diseño vectorial de personajes en Illustrator y composición multicapa en After Effects.",
      en: "Hybrid pipeline combining camera and object animation in Blender, vector character design in Illustrator, and multi-layer compositing in After Effects."
    },
    deliverables: {
      es: [
        "Animación y modelado 3D en Blender",
        "Diseño e ilustración de personajes vectoriales",
        "Composición y motion graphics en After Effects",
        "Edición audiovisual y sincronización de sonido"
      ],
      en: [
        "3D animation and modeling in Blender",
        "Vector character design and illustration",
        "Compositing and motion graphics in After Effects",
        "Audiovisual editing and audio synchronization"
      ]
    },
    metrics: [
      { label: { es: "Pipeline 3D / 2D", en: "3D / 2D Pipeline" }, value: "Blender + AE" },
      { label: { es: "Resolución", en: "Resolution" }, value: "1080p HD" }
    ],
    video: {
      youtubeId: "oBXY-uGg7O4",
      poster: "/uploads/casa-tonala-cover.jpg",
      title: { es: "Video Completo — Casa Tonalá Presentación", en: "Full Video — Casa Tonalá Presentation" }
    },
    gallery: [
      {
        src: "/uploads/casa-tonala-cover.jpg",
        alt: "Casa Tonalá Diseño de Personajes",
        caption: { es: "Ilustración y diseño de personajes animados para Casa Tonalá", en: "Animated character illustration and design for Casa Tonalá" },
        span: "full"
      }
    ]
  },

  "casa-tonala-reel": {
    id: "casa-tonala-reel",
    title: {
      es: "Casa Tonalá — Reel Animado 9:16",
      en: "Casa Tonalá — 9:16 Animated Reel"
    },
    subtitle: {
      es: "Animación híbrida 2D/3D con Blender y After Effects en formato vertical optimizado para redes sociales.",
      en: "Hybrid 2D/3D animation in Blender and After Effects in vertical format optimized for social media."
    },
    category: "animation",
    categoryLabel: { es: "Animación / VFX / Postproducción", en: "Animation / VFX / Post-Production" },
    tag: { es: "Blender 3D · Reel Vertical 9:16", en: "Blender 3D · 9:16 Vertical Reel" },
    client: "Casa Tonalá",
    year: "2025",
    role: { es: "Animador 3D & Motion Designer", en: "3D Animator & Motion Designer" },
    liveUrl: "https://youtube.com/shorts/LUrhtxzV4gY",
    coverImage: "/uploads/casa-tonala-reel-cover.jpg",
    techStack: ["Blender", "After Effects", "Adobe Illustrator", "Formato Vertical 9:16", "Animación 3D", "Motion Design"],
    overview: {
      es: "Campaña audiovisual en formato vertical (Reel / YouTube Shorts) para Casa Tonalá. Se modelaron escenarios y mobiliario 3D en Blender que interactúan con personajes animados en 2D, optimizado para retención y dinamismo en dispositivos móviles.",
      en: "Vertical video campaign (Reel / YouTube Shorts) for Casa Tonalá. 3D environments and props were modeled in Blender to interact with 2D animated characters, optimized for mobile engagement."
    },
    challenge: {
      es: "Aprovechar la composición vertical 9:16 para guiar la atención del espectador en planos dinámicos manteniendo profundidad y calidez escénica.",
      en: "Maximizing the 9:16 vertical canvas to guide viewer attention in dynamic framings while maintaining spatial depth and warmth."
    },
    solution: {
      es: "Composición de cámaras verticales en Blender, iluminación escénica cálida e integración de personajes vectoriales con efectos de partículas en After Effects.",
      en: "Vertical camera framing in Blender, warm interior prop lighting, and vector character integration with subtle particle effects in After Effects."
    },
    deliverables: {
      es: [
        "Modelado de props y entorno 3D en Blender",
        "Animación y acting de personajes 2D",
        "Composición vertical 9:16 para Reels y Shorts",
        "Diseño de sonido y mezcla de audio"
      ],
      en: [
        "3D prop and environment modeling in Blender",
        "2D character animation and acting",
        "9:16 vertical compositing for Reels & Shorts",
        "Sound design and audio mastering"
      ]
    },
    metrics: [
      { label: { es: "Formato", en: "Format" }, value: "Vertical 9:16" },
      { label: { es: "Herramientas", en: "Tools" }, value: "Blender + AE" }
    ],
    video: {
      youtubeId: "LUrhtxzV4gY",
      poster: "/uploads/casa-tonala-reel-cover.jpg",
      title: { es: "Reel Oficial — Casa Tonalá (Formato Vertical)", en: "Official Reel — Casa Tonalá (Vertical Format)" },
      aspectRatio: "vertical"
    },
    gallery: [
      {
        src: "/uploads/casa-tonala-reel-cover.jpg",
        alt: "Casa Tonalá Reel Frame",
        caption: { es: "Fotograma del Reel vertical con integración 2D/3D", en: "Still frame of the vertical reel with 2D/3D integration" },
        span: "full"
      }
    ]
  },

  "inartiva-studio": {
    id: "inartiva-studio",
    title: {
      es: "Inartiva Studio — Video Manifiesto 2D",
      en: "Inartiva Studio — 2D Brand Video"
    },
    subtitle: {
      es: "Animación 2D, tipografía cinética y motion graphics para video promocional de agencia creativa.",
      en: "2D animation, kinetic typography, and motion graphics for creative agency brand video."
    },
    category: "animation",
    categoryLabel: { es: "Animación / VFX / Postproducción", en: "Animation / VFX / Post-Production" },
    tag: { es: "Motion Graphics · Animación 2D", en: "Motion Graphics · 2D Animation" },
    client: "Inartiva Studio",
    year: "2024",
    role: { es: "Animador 2D & Motion Designer", en: "2D Animator & Motion Designer" },
    liveUrl: "https://youtu.be/l_4e3H2Ni5w",
    coverImage: "/uploads/inartiva-studio-cover.jpg",
    techStack: ["After Effects", "Adobe Illustrator", "Motion Design", "Animación 2D", "Tipografía Cinética", "Sound Design"],
    overview: {
      es: "Video manifiesto y presentación animada 2D para Inartiva Studio. El proyecto articuló la identidad y propuesta de valor de la agencia a través de transiciones vectoriales continuas, tipografía cinética y un ritmo visual dinámico y magnético.",
      en: "Brand manifesto and 2D animated showreel for Inartiva Studio. The piece articulates the agency's creative identity through seamless vector transitions, kinetic typography, and high-energy motion design."
    },
    challenge: {
      es: "Construir una narrativa audiovisual ágil con transiciones orgánicas 'seamless' que mantenga al espectador conectado de principio a fin.",
      en: "Crafting a fluid audiovisual narrative with seamless scene-to-scene transitions that sustains viewer retention from beginning to end."
    },
    solution: {
      es: "Animación vectorial en After Effects con curvas de aceleración personalizadas, ilustración minimalista en Illustrator y diseño de sonido sincronizado con cada cambio visual.",
      en: "Vector animation in After Effects using custom speed graphs, minimalist illustrations in Illustrator, and beat-matched sound design."
    },
    deliverables: {
      es: [
        "Guion visual y diseño de estilo gráfico",
        "Ilustración vectorial y tipografía en movimiento",
        "Animación 2D y motion graphics en After Effects",
        "Sincronización de sonido y mezcla final"
      ],
      en: [
        "Visual style frames and graphic design",
        "Vector illustration and kinetic typography",
        "2D keyframing and motion graphics in After Effects",
        "Sound design synchronization and final mix"
      ]
    },
    metrics: [
      { label: { es: "Estilo Visual", en: "Visual Style" }, value: "Motion 2D" },
      { label: { es: "Resolución", en: "Resolution" }, value: "1080p Full HD" }
    ],
    video: {
      youtubeId: "l_4e3H2Ni5w",
      poster: "/uploads/inartiva-studio-cover.jpg",
      title: { es: "Video Promocional — Conoce Inartiva Studio", en: "Promotional Video — Meet Inartiva Studio" }
    },
    gallery: [
      {
        src: "/uploads/inartiva-studio-cover.jpg",
        alt: "Inartiva Studio Frame",
        caption: { es: "Fotograma principal de la animación 2D y tipografía", en: "Hero still frame of 2D animation and typography" },
        span: "full"
      }
    ]
  },

  "linux-sysadmin": {
    id: "linux-sysadmin",
    title: {
      es: "Infraestructura Linux & SysAdmin",
      en: "Linux Infrastructure & SysAdmin"
    },
    subtitle: {
      es: "Despliegue de servidores Linux, seguridad SSL, proxy NGINX y monitoreo en la nube.",
      en: "Linux server deployment, SSL security, NGINX reverse proxy, and cloud monitoring."
    },
    category: "devops",
    categoryLabel: { es: "DevOps & SysAdmin", en: "DevOps & SysAdmin" },
    tag: { es: "SysAdmin · NGINX / Docker", en: "SysAdmin · NGINX / Docker" },
    client: "Proyectos Varios & Clientes Corporativos",
    year: "2026",
    role: { es: "Especialista DevOps & Linux SysAdmin", en: "DevOps Specialist & Linux SysAdmin" },
    coverImage: "/uploads/linux-sysadmin-cover.svg",
    techStack: ["Linux Ubuntu Server", "NGINX", "Docker", "SSL / Cloudflare", "Bash Scripting"],
    overview: {
      es: "Configuración, optimización e infraestructura de servidores VPS Linux para alojar aplicaciones web modernas con máxima velocidad y disponibilidad.",
      en: "Deployment, optimization, and infrastructure setup on Linux VPS servers hosting modern web applications with maximum speed and uptime."
    },
    challenge: {
      es: "Garantizar alta disponibilidad, tiempos de respuesta ultra rápidos y protección contra ataques cibernéticos en servidores con alto tráfico.",
      en: "Ensuring high availability, ultra-fast response times, and cyber-threat protection on high-traffic web servers."
    },
    solution: {
      es: "Implementación de proxies inversos NGINX con caché Gzip/Brotli, aislamiento de contenedores Docker, certificados SSL automatizados y scripts de backup diario.",
      en: "Implementation of NGINX reverse proxies with Gzip/Brotli caching, Docker container isolation, automated SSL certificates, and daily backup scripts."
    },
    metrics: [
      { label: { es: "Uptime Garantizado", en: "Guaranteed Uptime" }, value: "99.99%" },
      { label: { es: "Tiempo de Respuesta", en: "Server Response Time" }, value: "< 45ms" }
    ],
    gallery: [
      {
        src: "/uploads/linux-sysadmin-cover.svg",
        alt: "Linux Server Architecture & Terminal",
        caption: { es: "Terminal de producción y monitoreo de servidor NGINX", en: "Production terminal and NGINX server monitoring" },
        span: "full"
      },
      {
        src: "/uploads/linux-architecture.svg",
        alt: "Docker & NGINX Cluster Architecture",
        caption: { es: "Diagrama de arquitectura en clúster y proxy inverso", en: "Cluster architecture diagram & reverse proxy setup" },
        span: "full"
      }
    ]
  },

  "naxine": {
    id: "naxine",
    title: {
      es: "Plataforma & Marketplace NAXINE",
      en: "NAXINE Platform & Marketplace"
    },
    subtitle: {
      es: "E-commerce y plataforma integral de contratación para servicios profesionales.",
      en: "E-commerce and comprehensive hiring platform for professional services."
    },
    category: "web",
    categoryLabel: { es: "Plataforma Web & SaaS", en: "Web Platform & SaaS" },
    tag: { es: "Full Stack · Marketplace de Servicios", en: "Full Stack · Service Marketplace" },
    client: "NAXINE",
    year: "2026",
    role: { es: "Full Stack Developer & UI/UX Designer", en: "Full Stack Developer & UI/UX Designer" },
    coverImage: "/uploads/naxine_browser_mockup_clean.png",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Supabase"],
    overview: {
      es: "NAXINE es una plataforma digital de servicios profesionales que conecta clientes con especialistas verificados. Desarrollamos la arquitectura completa del backend, la plataforma de agendamiento y el marketplace interactivo.",
      en: "NAXINE is a digital professional services platform connecting clients with verified specialists. We engineered the complete backend architecture, booking engine, and interactive marketplace."
    },
    challenge: {
      es: "Crear un sistema de checkout de servicios fluido con gestión de disponibilidad de citas en tiempo real, perfiles de prestadores y pasarela de pago segura.",
      en: "Creating a seamless service checkout system with real-time appointment availability, provider profiles, and secure payment processing."
    },
    solution: {
      es: "Diseñamos un flujo de usuario intuitivo en Figma y construimos una arquitectura frontend moderna con Next.js sincronizada mediante APIs REST y PostgreSQL.",
      en: "We designed an intuitive user journey in Figma and built a modern frontend architecture in Next.js synchronized via REST APIs and PostgreSQL."
    },
    deliverables: {
      es: [
        "Arquitectura Frontend & Marketplace en Next.js",
        "Diseño UI/UX integral y catálogo de servicios",
        "Integración de APIs y autenticación de usuarios",
        "Panel de control para prestadores de servicios"
      ],
      en: [
        "Frontend & Marketplace Architecture in Next.js",
        "Comprehensive UI/UX Design & Service Catalog",
        "API Integration & User Authentication",
        "Service Provider Management Dashboard"
      ]
    },
    metrics: [
      { label: { es: "Servicios Publicados", en: "Listed Services" }, value: "+50" },
      { label: { es: "Tiempo de Respuesta API", en: "API Response Time" }, value: "< 120ms" }
    ],
    gallery: [
      {
        src: "/uploads/entregable01desarrollo.jpg",
        alt: "NAXINE Marketplace Plataforma Principal",
        caption: { es: "Vista principal de la plataforma y desarrollo NAXINE", en: "Main platform overview and NAXINE development" },
        span: "full"
      },
      {
        src: "/uploads/naxinewebsite.png",
        alt: "NAXINE Marketplace Homepage",
        caption: { es: "Página principal del marketplace NAXINE", en: "NAXINE marketplace homepage" },
        span: "full"
      }
    ]
  },

  "romero-motor": {
    id: "romero-motor",
    title: {
      es: "Romero Motor",
      en: "Romero Motor"
    },
    subtitle: {
      es: "Diseño y desarrollo web automotriz con catálogo digital interactivo.",
      en: "Automotive web design and development with interactive digital catalog."
    },
    category: "web",
    categoryLabel: { es: "Desarrollo Web & UI", en: "Web Dev & UI" },
    tag: { es: "Diseño Web · Automotriz", en: "Web Design · Automotive" },
    client: "Romero Motor",
    year: "2026",
    role: { es: "Diseñador UI/UX & Desarrollador Web", en: "UI/UX Designer & Web Developer" },
    coverImage: "/uploads/Mockup RomeroMotor.png",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Figma", "UI/UX Design"],
    overview: {
      es: "Romero Motor es un concesionario automotriz enfocado en vehículos de ocasión y nuevos. Desarrollamos una presencia web moderna con buscador avanzado de vehículos, fichas técnicas interactivas y contacto directo por WhatsApp.",
      en: "Romero Motor is an automotive dealership specializing in pre-owned and new vehicles. We developed a modern web presence with advanced vehicle search, interactive technical specs, and direct WhatsApp inquiries."
    },
    challenge: {
      es: "Presentar un inventario cambiante con filtros por marca, modelo, precio y año de forma rápida y accesible en cualquier dispositivo.",
      en: "Presenting a dynamic vehicle inventory with fast brand, model, price, and year filters accessible on any device."
    },
    solution: {
      es: "Interfaz limpia con tarjetas de vehículos de alto impacto visual, tiempos de carga mínimos y llamada a la acción clara para agendar visitas.",
      en: "Clean UI featuring high-impact vehicle cards, minimal loading times, and clear call-to-actions to schedule dealer test drives."
    },
    deliverables: {
      es: [
        "Mockup y prototipo interactivo en Figma",
        "Buscador y catálogo de vehículos responsivo",
        "Optimización móvil y contacto directo"
      ],
      en: [
        "Figma Mockup and interactive prototype",
        "Responsive vehicle search and catalog",
        "Mobile optimization and direct inquiry routing"
      ]
    },
    gallery: [
      {
        src: "/uploads/Mockup RomeroMotor.png",
        alt: "Romero Motor Web Mockup",
        caption: { es: "Presentación y mockup responsivo de Romero Motor", en: "Romero Motor responsive presentation mockup" },
        span: "full"
      }
    ]
  },

  "analista-seo": {
    id: "analista-seo",
    title: {
      es: "Estrategia & Auditoría SEO",
      en: "SEO Strategy & Technical Audit"
    },
    subtitle: {
      es: "Optimización técnica de motores de búsqueda, rendimiento WPO y arquitectura web.",
      en: "Technical search engine optimization, WPO performance, and web architecture."
    },
    category: "web",
    categoryLabel: { es: "SEO & Estrategia Digital", en: "SEO & Digital Strategy" },
    tag: { es: "Auditoría SEO · WPO & Performance", en: "SEO Audit · WPO & Performance" },
    client: "Auditorías de Clientes & Proyectos Propios",
    year: "2026",
    role: { es: "Especialista SEO Técnico & WPO", en: "Technical SEO & WPO Specialist" },
    coverImage: "/uploads/Mockup Analista SEO.png",
    techStack: ["Technical SEO", "Screaming Frog", "Google Search Console", "Core Web Vitals", "WPO"],
    overview: {
      es: "Auditoría integral técnica y de contenido para sitios web, orientada a mejorar la indexación, resolver errores de rastreo y potenciar el posicionamiento orgánico en Google.",
      en: "Comprehensive technical and content audit for web platforms aimed at improving indexing, resolving crawl errors, and boosting organic Google ranking."
    },
    challenge: {
      es: "Identificar cuellos de botella en la arquitectura web, contenido duplicado y caídas de rendimiento en métricas Core Web Vitals.",
      en: "Identifying web architecture bottlenecks, duplicate content, and Core Web Vitals performance regressions."
    },
    solution: {
      es: "Informes exhaustivos con planes de acción priorizados: reestructuración de enlaces internos, optimización de meta-etiquetas y aceleración de carga.",
      en: "In-depth audit reports with prioritized action plans: internal linking overhaul, meta tag optimization, and page speed acceleration."
    },
    metrics: [
      { label: { es: "Puntuación Core Web Vitals", en: "Core Web Vitals Score" }, value: "98/100" },
      { label: { es: "Aumento Tráfico Orgánico", en: "Organic Traffic Growth" }, value: "+120%" }
    ],
    gallery: [
      {
        src: "/uploads/Mockup Analista SEO.png",
        alt: "Mockup de Auditoría SEO",
        caption: { es: "Presentación de resultados de auditoría SEO", en: "SEO audit results presentation mockup" },
        span: "full"
      }
    ]
  },

  "the-old-man-and-the-sea": {
    id: "the-old-man-and-the-sea",
    title: {
      es: "The Old Man and the Sea — Cortometraje 3D",
      en: "The Old Man and the Sea — 3D Short Film"
    },
    subtitle: {
      es: "Dirección audiovisual, modelado de personajes, rigging y animación cinematográfica 3D.",
      en: "Audiovisual directing, character modeling, rigging, and cinematic 3D animation."
    },
    category: "animation",
    categoryLabel: { es: "Animación / VFX / Postproducción", en: "Animation / VFX / Post-Production" },
    tag: { es: "Animación 3D · Cortometraje", en: "3D Animation · Short Film" },
    client: "Proyecto de Cortometraje Independiente",
    year: "2025",
    role: { es: "Director de Animación 3D & Modelado", en: "3D Animation Director & Modeler" },
    liveUrl: "https://youtu.be/yHKBqA1yWz0?si=4jEYG1yJx0ZbyhfT",
    coverImage: "/uploads/the-old-man-cover.jpg",
    techStack: ["Blender", "Maya", "After Effects", "Premiere Pro", "3D Rigging", "Cycles"],
    overview: {
      es: "Adaptación cinematográfica en animación 3D inspirada en la clásica obra. El proyecto abarcó desde el diseño conceptual, modelado y rigging de personajes hasta la iluminación volumétrica, animación cuadro a cuadro y post-producción sonora.",
      en: "Cinematic 3D animation adaptation inspired by the classic story. The production covered conceptual character design, modeling, custom rigging, volumetric lighting, frame-by-frame character animation, and audio post-production."
    },
    challenge: {
      es: "Transmitir la atmósfera solitaria del océano y la expresividad del personaje principal mediante simulaciones de tela, iluminación ambiental y sincronización narrativa fluida.",
      en: "Conveying the lonely ocean atmosphere and the emotional nuance of the main character through cloth simulation, ambient ocean lighting, and seamless narrative timing."
    },
    solution: {
      es: "Pipeline integral con modelado y rigging facial en Maya/Blender, shaders de piel estilizados, renderizado en Cycles y composición final de color en After Effects.",
      en: "Comprehensive animation pipeline utilizing custom facial rigging in Maya/Blender, stylized skin shaders, multi-pass rendering in Cycles, and color compositing in After Effects."
    },
    deliverables: {
      es: [
        "Modelado, texturizado y rigging de personajes",
        "Animación de cámaras y acting de personajes",
        "Renderizado por pases e iluminación de escenas",
        "Edición cinematográfica y composición final"
      ],
      en: [
        "Character modeling, texturing, and rigging",
        "Cinematic camera work and character acting animation",
        "Multi-pass scene rendering and volumetric lighting",
        "Cinematic film editing and final color compositing"
      ]
    },
    metrics: [
      { label: { es: "Duración Cortometraje", en: "Short Film Runtime" }, value: "3m 45s" },
      { label: { es: "Resolución Master", en: "Master Render" }, value: "4K UHD" }
    ],
    video: {
      youtubeId: "yHKBqA1yWz0",
      poster: "/uploads/the-old-man-cover.jpg",
      title: { es: "Cortometraje Completo — The Old Man and the Sea", en: "Full Animation — The Old Man and the Sea" }
    },
    gallery: [
      {
        src: "/uploads/the-old-man-cover.jpg",
        alt: "The Old Man and the Sea Hero Frame",
        caption: { es: "Fotograma principal del personaje en alta mar", en: "Hero still frame of the old man at sea" },
        span: "full"
      },
      {
        src: "/uploads/the-old-man-shot1.png",
        alt: "Close-up Character Lighting",
        caption: { es: "Iluminación de planos cercanos y detalle facial", en: "Close-up character lighting and facial detail" },
        span: "half"
      },
      {
        src: "/uploads/the-old-man-shot2.png",
        alt: "Ocean Setting Composition",
        caption: { es: "Composición de escena marítima y atmósfera", en: "Ocean environment and atmospheric lighting" },
        span: "half"
      },
      {
        src: "/uploads/the-old-man-shot3.png",
        alt: "Character Action Frame",
        caption: { es: "Animación de acción y dinámica de cámara", en: "Action acting and dynamic camera motion" },
        span: "half"
      },
      {
        src: "/uploads/the-old-man-shot5.png",
        alt: "Atmospheric Lighting Breakdown",
        caption: { es: "Desglose de iluminación volumétrica", en: "Volumetric lighting breakdown" },
        span: "half"
      },
      {
        src: "/uploads/the-old-man-santiago-sheet.png",
        alt: "Santiago Character Model Sheet",
        caption: { es: "Model Sheet y proporciones de Santiago", en: "Santiago character model sheet and turnarounds" },
        span: "half"
      },
      {
        src: "/uploads/the-old-man-manolin-sheet.png",
        alt: "Manolín Character Model Sheet",
        caption: { es: "Diseño conceptual y Model Sheet de Manolín", en: "Manolín conceptual design and model sheet" },
        span: "half"
      }
    ]
  },

  "reflejos-vfx": {
    id: "reflejos-vfx",
    title: {
      es: "Reflejos — Cortometraje & VFX",
      en: "Reflejos — Short Film & VFX"
    },
    subtitle: {
      es: "Cortometraje cinematográfico de suspenso con integración de VFX, pases de render 3D y post-producción audiovisual.",
      en: "Cinematic suspense short film featuring VFX compositing, 3D multi-pass render integration, and audiovisual post-production."
    },
    category: "animation",
    categoryLabel: { es: "Animación / VFX / Postproducción", en: "Animation / VFX / Post-Production" },
    tag: { es: "Cortometraje · VFX & Postproducción", en: "Short Film · VFX & Post-Production" },
    client: "Cortometraje Independiente / landrescreative",
    year: "2025",
    role: { es: "Director, Artista VFX & Editor de Post-Producción", en: "Director, VFX Artist & Post-Production Editor" },
    coverImage: "/uploads/reflejos-youtube-thumb.jpg",
    techStack: ["After Effects", "Blender Cycles", "VFX Compositing", "Multi-pass EXR", "Color Grading", "Diseño Sonoro", "Edición Audiovisual"],
    industry: { es: "Cine & Cortometrajes VFX", en: "Cinema & VFX Short Films" },
    liveUrl: "https://youtu.be/J7mlYXV974w",
    video: {
      youtubeId: "J7mlYXV974w",
      poster: "/uploads/reflejos-youtube-thumb.jpg",
      title: { es: "Ver Cortometraje 'Reflejos' Completo", en: "Watch Full 'Reflejos' Short Film" },
      aspectRatio: "video"
    },
    overview: {
      es: "Reflejos es un cortometraje cinematográfico de suspense y tensión psicológica que explora la interacción entre iluminación realista, refracciones y texturizado procedural. El proyecto abarcó desde la dirección y estructuración de la narrativa audiovisual hasta la composición de efectos visuales por capas, integración de pases de render en EXR y gradación de color cinematográfica para generar atmósferas opresivas de alto impacto.",
      en: "Reflejos is a psychological suspense short film exploring realistic light interplay, mirrors, refractions, and procedural texturing. The project encompassed complete audiovisual directing, multi-layer VFX compositing, multi-pass EXR integration, and cinematic color grading to build an immersive, high-tension atmosphere."
    },
    challenge: {
      es: "Lograr transiciones luminosas creíbles y gestionar secuencias de render de alta complejidad con pases de oclusión ambiental, profundidad Z y desenfoque de movimiento sin perder el grano cinematográfico ni la legibilidad de las sombras.",
      en: "Achieving believable lighting transitions and handling high-complexity image sequences with ambient occlusion, Z-depth passes, and motion blur while preserving film grain and deep shadow detail."
    },
    solution: {
      es: "Composición por capas en After Effects integrando secuencias de frames en EXR, corrección de color cinemática y adición de efectos atmosféricos con diseño sonoro espacial sincronizado.",
      en: "Layered compositing workflow in After Effects integrating multi-pass EXR sequences, cinematic color grading, atmospheric haze overlays, and synchronized spatial sound design."
    },
    deliverables: {
      es: [
        "Cortometraje cinematográfico completo disponible en YouTube",
        "Pipeline de composición VFX por capas en After Effects",
        "Secuencias de render por pases de iluminación (Beauty, Depth, Diffuse, Glossy)",
        "Tratamiento y gradación de color cinemática",
        "Diseño sonoro, mezcla y masterización audiovisual"
      ],
      en: [
        "Complete cinematic short film hosted on YouTube",
        "Multi-layered VFX compositing pipeline in After Effects",
        "Multi-pass lighting render sequences (Beauty, Depth, Diffuse, Glossy)",
        "Cinematic color grading and treatment",
        "Sound design, mixing, and final audiovisual mastering"
      ]
    },
    metrics: [
      { label: { es: "Pases de Render", en: "Render Passes" }, value: "6+ Pases" },
      { label: { es: "Formato", en: "Format" }, value: "4K Cinema" },
      { label: { es: "Frames Compuestos", en: "Frames Composited" }, value: "+300" },
      { label: { es: "Plataforma", en: "Platform" }, value: "YouTube" }
    ],
    gallery: [
      {
        src: "/uploads/reflejos-cortometraje-poster.jpg",
        alt: "Reflejos — Fotograma Oficial del Cortometraje",
        caption: { es: "Fotograma oficial y carátula del cortometraje cinematográfico Reflejos", en: "Official key frame and poster for the cinematic short film Reflejos" },
        span: "full"
      },
      {
        src: "/uploads/vfx-render-escena-final.png",
        alt: "Reflejos VFX Final Render",
        caption: { es: "Fotograma compuesto con iluminación dramática y refracción especular", en: "Final composited frame with dramatic lighting and specular refraction" },
        span: "half"
      },
      {
        src: "/uploads/vfx-render-escena-shot1.png",
        alt: "Reflejos VFX Sequence Shot",
        caption: { es: "Toma de la secuencia de renderizado y pruebas de cámara", en: "3D render sequence camera and lighting test preview" },
        span: "half"
      }
    ]
  },

  "remedy-pain-spine": {
    id: "remedy-pain-spine",
    title: {
      es: "Remedy Pain & Spine — Rediseño Web & SEO Clínico",
      en: "Remedy Pain & Spine — Website Redesign & SEO Overhaul"
    },
    subtitle: {
      es: "Transformación integral de clínica médica: de sitio estático lento a centro de alta conversión adaptado a HIPAA, GDPR y SEO local.",
      en: "Complete clinical overhaul: turning a slow pain-clinic site into a high-converting, HIPAA/GDPR-compliant hub with top Google rankings."
    },
    category: "web",
    categoryLabel: { es: "Diseño Web & SEO Clínico", en: "Web Design & Medical SEO" },
    tag: { es: "WordPress · Elementor · SEO Clínico", en: "WordPress · Elementor · Healthcare SEO" },
    client: "Remedy Pain & Spine (Conroe, TX)",
    year: "2024",
    role: { es: "Diseñador UI/UX & Especialista Web / SEO", en: "UI/UX Designer & Web / SEO Specialist" },
    coverImage: "/uploads/remedy-pain-spine.png",
    techStack: ["WordPress", "Elementor", "Figma", "Local SEO", "Schema Markup", "Semantic HTML", "HIPAA / GDPR Compliance", "UI/UX Design"],
    duration: { es: "1-3 meses", en: "1-3 months" },
    priceRange: "$400 - $600",
    industry: { es: "Servicios Médicos / Salud", en: "Healthcare & Pain Management" },
    overview: {
      es: "Remedy Pain & Spine es una clínica especializada en el tratamiento del dolor crónico y columna en Texas. El objetivo fue transformar un sitio web desactualizado y lento en una plataforma médica rápida, empática y de alta conversión, cumpliendo estrictamente con las normativas HIPAA y GDPR para salvaguardar la privacidad de los pacientes.",
      en: "Remedy Pain & Spine is a specialized chronic pain and spine clinic in Texas. The goal was to transform an outdated, slow site into a fast, empathetic, and conversion-ready medical hub fully compliant with HIPAA and GDPR regulations to protect patient confidentiality."
    },
    challenge: {
      es: "El sitio original sufría de un tiempo de carga crítico de 6 segundos, pésima experiencia de usuario móvil, nula presencia de datos estructurados (Schema), ausencia total de posicionamiento SEO local y riesgos de privacidad en formularios de contacto clínico.",
      en: "The original site suffered from a critical 6-second load time, poor mobile UX, zero structured data (Schema), no local SEO footprint, and privacy vulnerabilities in clinical inquiry forms."
    },
    solution: {
      es: "Lideramos talleres de descubrimiento definiendo arquetipos de pacientes con dolor crónico y aseguradoras, entregando wireframes validados en solo 2 días. Diseñamos una interfaz accesible y tranquilizadora en Figma desarrollada con WordPress y Elementor, incorporando HTML semántico, slugs limpios, marcado Schema para MedicalClinic y LocalBusiness, formularios cifrados y un botón fijo de reserva de citas en dispositivos móviles.",
      en: "Led discovery workshops defining chronic-pain and insurer personas, delivering validated wireframes in just 2 days. Designed a calming, accessible UI in Figma implemented via WordPress + Elementor with semantic HTML, clean slugs, MedicalClinic & LocalBusiness schema markup, encrypted forms, and a sticky mobile 'Book Appointment' conversion driver."
    },
    deliverables: {
      es: [
        "Talleres de descubrimiento y definición de personas (pacientes y aseguradoras)",
        "Wireframes y arquitectura de información validados en 2 días",
        "Diseño de interfaz UI/UX tranquilizador y accesible en Figma",
        "Desarrollo completo en WordPress + Elementor optimizado para velocidad",
        "Implementación de datos estructurados Schema (Medical Clinic & LocalBusiness)",
        "Estrategia de SEO local y optimización de contenido para 'back pain treatment Conroe, TX'",
        "Cumplimiento normativo HIPAA y GDPR con formularios cifrados y consentimiento de cookies",
        "Botón flotante persistente de agendamiento móvil ('Book Appointment')"
      ],
      en: [
        "Discovery workshops & persona definition (chronic-pain patients & insurers)",
        "Validated wireframes and information architecture delivered in 2 days",
        "Calming, accessible UI/UX design crafted in Figma",
        "Complete WordPress + Elementor build engineered for speed",
        "Schema.org structured data implementation (Medical Clinic & LocalBusiness)",
        "Local SEO and targeted copywriting for 'back pain treatment Conroe, TX'",
        "HIPAA & GDPR compliance with encrypted forms and cookie consent",
        "Patient-centric sticky mobile 'Book Appointment' conversion driver"
      ]
    },
    metrics: [
      { label: { es: "Crecimiento en Sesiones Orgánicas", en: "Organic Sessions Growth" }, value: "+212%" },
      { label: { es: "Tiempo de Carga (LCP 1.2s)", en: "Load Time (LCP 1.2s)" }, value: "1.1s" },
      { label: { es: "Tasa de Conversión de Citas", en: "Appointment Conversion Rate" }, value: "3.9%" },
      { label: { es: "Posicionamiento Local en Google", en: "Top 3 Google Rankings" }, value: "Top 3" }
    ],
    testimonial: {
      quote: {
        es: "Las consultas de nuevos pacientes se dispararon y el sitio web abre al instante. La comunicación fue clara y la entrega se completó antes del plazo establecido.",
        en: "New patient enquiries soared and the site opens instantly. Communication was clear and delivery beat the deadline."
      },
      client: "Remedy Pain & Spine",
      role: { es: "Cliente Verificado en Fiverr", en: "Verified Client on Fiverr" }
    },
    gallery: [
      {
        src: "/uploads/remedy-pain-spine.png",
        alt: "Remedy Pain & Spine - Mockup y Rediseño de Sitio Web",
        caption: { es: "Rediseño completo de interfaz, experiencia móvil y optimización de conversión médica", en: "Comprehensive interface redesign, mobile UX, and healthcare conversion optimization" },
        span: "full"
      }
    ]
  },

  "lifescozul-biotech": {
    id: "lifescozul-biotech",
    title: {
      es: "Grupo LifEscozul® — Plataforma Biomédica & Biotecnología",
      en: "Grupo LifEscozul® — Biomedical & Biotech Platform"
    },
    subtitle: {
      es: "Diseño web editorial y arquitectura de credibilidad científica para protocolo terapéutico derivado del escorpión azul con registro FDA NDC y patentes internacionales.",
      en: "High-impact editorial web design and scientific authority platform for blue scorpion biological protocol with U.S. FDA NDC registration and WIPO patents."
    },
    category: "web",
    categoryLabel: { es: "Diseño Web & Biotecnología", en: "Web Design & Biotech" },
    tag: { es: "UI/UX · Biotecnología & Salud", en: "UI/UX · Biotech & Healthcare" },
    client: "Blue Scorpion Group Inc. / Grupo LifEscozul®",
    year: "2025",
    role: { es: "Diseñador UI/UX & Dirección de Arte Digital", en: "UI/UX Designer & Digital Art Director" },
    coverImage: "/uploads/grupo-lifescozul.png",
    techStack: ["Figma", "UI/UX Design", "Design System", "Dark Mode UI", "Typography Design", "Biotech Branding", "Responsive Web"],
    industry: { es: "Biotecnología & Ciencias de la Salud", en: "Biotechnology & Life Sciences" },
    overview: {
      es: "Grupo LifEscozul® (Blue Scorpion Group Inc.) es una firma biotecnológica y de investigación biomédica especializada en el estudio de principios activos del veneno de escorpión azul (Rhopalurus junceus), liderada por el Dr. Alexis Díaz. Diseñamos una presencia web sofisticada y de alta autoridad científica para respaldar más de 18 años de trayectoria investigativa, acuerdos internacionales y registro oficial en la FDA.",
      en: "Grupo LifEscozul® (Blue Scorpion Group Inc.) is a biotechnology and biomedical research firm specializing in natural bioactive compounds from the blue scorpion (Rhopalurus junceus), led by Dr. Alexis Díaz. We designed a sophisticated, high-authority digital presence highlighting 18 years of clinical investigation, international agreements, and official U.S. FDA registration."
    },
    challenge: {
      es: "El reto primordial radicaba en proyectar rigurosidad científica incuestionable, validación clínica y transparencia regulatoria, desmarcándose de los convencionalismos de sitios farmacéuticos anticuados y transmitiendo confianza inmediata tanto a pacientes como a la comunidad médica internacional.",
      en: "The primary challenge was projecting indisputable scientific rigor, clinical validation, and regulatory compliance while breaking free from outdated pharmaceutical aesthetic tropes, establishing instant trust for both patients and the international scientific community."
    },
    solution: {
      es: "Diseñamos un sistema de interfaz en Figma basado en un esquema cromático oscuro azul medianoche con contrastes cian bioluminiscentes. Implementamos jerarquía tipográfica editorial con serifas clásicas para transmitir prestigio académico, un panel visual de métricas de credibilidad (artículos publicados, código NDC de la FDA, casos documentados) y flujos directos para consulta del protocolo y pedidos.",
      en: "Created an editorial dark-mode interface in Figma using deep midnight blues and vibrant bioluminescent cyan accents. Implemented classical serif typography for academic prestige, a prominent scientific credibility metrics bar (peer-reviewed articles, FDA NDC registration, documented cases), and direct conversion pathways for protocol inquiries."
    },
    deliverables: {
      es: [
        "Diseño de interfaz UI/UX completo (Desktop & Mobile) en Figma",
        "Sistema de diseño en modo oscuro con tokens de biotecnología",
        "Estructura y arquitectura de información centrada en evidencia clínica",
        "Panel de métricas de credibilidad (FDA NDC, publicaciones, patentes)",
        "Dirección de arte visual y tratamiento fotográfico de laboratorio",
        "Embudos de adquisición y solicitud del protocolo optimizados"
      ],
      en: [
        "Complete UI/UX design (Desktop & Mobile) in Figma",
        "Biotech dark-mode design system and visual token library",
        "Evidence-based clinical information architecture",
        "Scientific credibility dashboard (FDA NDC, publications, patents)",
        "Visual art direction and laboratory photography curation",
        "Optimized protocol inquiry and patient conversion funnels"
      ]
    },
    metrics: [
      { label: { es: "Años de Investigación", en: "Years of Research" }, value: "18" },
      { label: { es: "Artículos Publicados", en: "Published Articles" }, value: "28" },
      { label: { es: "Casos Documentados", en: "Documented Cases" }, value: "+600" },
      { label: { es: "Registro U.S. FDA", en: "U.S. FDA Registered" }, value: "NDC" }
    ],
    gallery: [
      {
        src: "/uploads/grupo-lifescozul.png",
        alt: "Grupo LifEscozul® — Mockup Web & Hero Section",
        caption: { es: "Hero section con tipografía serif, acentos cian y métricas científicas", en: "Hero section featuring serif typography, cyan accents, and scientific metrics" },
        span: "full"
      }
    ]
  },

  "autoimport-de": {
    id: "autoimport-de",
    title: {
      es: "AutoImport DE — Vehículos Premium Por Encargo",
      en: "AutoImport DE — Premium German Vehicles On Demand"
    },
    subtitle: {
      es: "Plataforma web y catálogo interactivo de importación directa de vehículos alemanes con cotizador y gestión de pedidos.",
      en: "Interactive web platform and catalog for direct custom German vehicle imports with real-time inquiries."
    },
    category: "web",
    categoryLabel: { es: "Desarrollo Web & Automotriz", en: "Web Development & Automotive" },
    tag: { es: "Web · Automoción Premium & Catálogo", en: "Web · Luxury Automotive & Catalog" },
    client: "AutoImport DE (Alemania / España)",
    year: "2026",
    role: { es: "Desarrollador Web Full Stack & Diseñador UI/UX", en: "Full Stack Web Developer & UI/UX Designer" },
    coverImage: "/uploads/autoimport-de-thumb.png",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "UI/UX Design", "Figma", "Filtros Dinámicos", "Lead Funnel"],
    industry: { es: "Automotriz & Comercio Internacional", en: "Automotive & International Trade" },
    overview: {
      es: "AutoImport DE es un servicio especializado en la importación directa y personalizada de vehículos alemanes de gama alta hacia España y Europa. Desarrollamos una plataforma web moderna, rápida y orientada a la conversión, equipada con catálogo interactivo por encargo, calculadora de importación y un embudo de solicitud guiado para conectar a compradores con concesionarios certificados en Alemania.",
      en: "AutoImport DE specializes in the direct custom importation of high-end German automobiles across Spain and Europe. We engineered a sleek, conversion-focused web platform featuring an interactive on-demand catalog, import cost calculators, and a guided inquiry funnel connecting discerning buyers with certified German dealerships."
    },
    challenge: {
      es: "La compra de vehículos de importación suele generar fricción y desconfianza debido a trámites aduaneros, homologaciones y costes ocultos. El objetivo fue diseñar una interfaz que transmita transparencia absoluta, seguridad jurídica y facilite la cotización y encargo en pocos pasos.",
      en: "Importing luxury cars often suffers from buyer friction and trust barriers related to customs, roadworthiness homologation, and hidden costs. The challenge was building an interface projecting total transparency, legal confidence, and frictionless quotation flows."
    },
    solution: {
      es: "Diseñamos una experiencia en modo oscuro cinemático con acentos en amarillo ámbar automotriz, tipografía de alta legibilidad y un hero interactivo con métricas de credibilidad (500+ vehículos, 98% satisfacción, 15+ años). Integramos un flujo de solicitud paso a paso ('Solicita tu Vehículo') y catálogo filtrable por marca (Audi, BMW, Mercedes-Benz, Porsche), año, kilometraje y presupuesto.",
      en: "Created a cinematic dark-themed experience with bold automotive amber accents, clean typography, and a hero section showcasing verified trust metrics (500+ imported vehicles, 98% satisfaction, 15+ years). Integrated a multi-step vehicle request wizard ('Solicita tu Vehículo') and searchable catalog filtered by marque, year, mileage, and budget."
    },
    deliverables: {
      es: [
        "Diseño de interfaz UI/UX completo para web y dispositivos móviles",
        "Catálogo dinámico de vehículos con filtros avanzados",
        "Embudo de solicitud paso a paso para vehículos por encargo",
        "Diseño de identidad visual para web con paleta automotriz premium",
        "Optimización de velocidad de carga y SEO técnico local",
        "Integración de canales directos de contacto (WhatsApp, teléfono y formulario)"
      ],
      en: [
        "Full responsive UI/UX interface design across desktop & mobile",
        "Dynamic vehicle catalog with advanced attribute filtering",
        "Multi-step custom order inquiry funnel ('Vehículos Por Encargo')",
        "Automotive visual identity and design system",
        "Technical SEO & performance optimization",
        "Direct conversion touchpoints (instant messaging, phone, lead capture)"
      ]
    },
    metrics: [
      { label: { es: "Vehículos Importados", en: "Vehicles Imported" }, value: "500+" },
      { label: { es: "Clientes Satisfechos", en: "Satisfied Clients" }, value: "98%" },
      { label: { es: "Años de Experiencia", en: "Years of Experience" }, value: "15+" },
      { label: { es: "Tiempo de Respuesta", en: "Inquiry Response Time" }, value: "< 2h" }
    ],
    gallery: [
      {
        src: "/uploads/autoimport-de.png",
        alt: "AutoImport DE — Vehículos Premium Por Encargo",
        caption: { es: "Página principal con métricas de confianza y llamado a la acción para solicitud de vehículo", en: "Homepage hero with trust metrics and vehicle request conversion action" },
        span: "full"
      }
    ]
  },

  "dra-neus-munoz": {
    id: "dra-neus-munoz",
    title: {
      es: "Dra. Neus Muñoz Gost — The Clinical Curator",
      en: "Dr. Neus Muñoz Gost — The Clinical Curator"
    },
    subtitle: {
      es: "Diseño web editorial y arquitectura digital para médica internista PhD especializada en salud hormonal, longevidad femenina y medicina integrativa.",
      en: "High-end editorial web design and digital ecosystem for an internal medicine PhD specialist in female hormones, longevity, and metabolic health."
    },
    category: "web",
    categoryLabel: { es: "Diseño Web & Salud Femenina", en: "Web Design & Women's Health" },
    tag: { es: "Diseño Editorial · Salud Hormonal & Longevidad", en: "Editorial Design · Hormonal Health & Longevity" },
    client: "Dra. Neus Muñoz Gost, PhD (The Clinical Curator)",
    year: "2026",
    role: { es: "Diseñador UI/UX & Dirección de Arte Digital", en: "UI/UX Designer & Digital Art Director" },
    coverImage: "/uploads/dr-neus-munoz-thumb.png",
    techStack: ["Figma", "UI/UX Design", "Diseño Editorial", "Embudo de Conversión Médica", "Design System", "Salud Hormonal", "Lead Generation"],
    industry: { es: "Medicina Interna, Longevidad & Salud Femenina", en: "Internal Medicine, Longevity & Women's Health" },
    overview: {
      es: "Dra. Neus Muñoz Gost (The Clinical Curator) es médico internista con más de 15 años de trayectoria clínica y Doctorado (PhD), especializada en salud hormonal femenina, metabolismo, longevidad y transición menopáusica. Diseñamos una plataforma web completa de estilo editorial médico premium que combina rigurosidad científica estricta con calidez humana, estructurando su práctica privada de consultas online, su programa insignia 'La Excelencia de tu Biología', recursos formativos sobre análogos GLP-1 (Ozempic & Mounjaro) y lead magnets especializados.",
      en: "Dr. Neus Muñoz Gost (The Clinical Curator) is an internal medicine specialist and PhD with over 15 years of clinical practice, dedicated to female hormonal balance, metabolic health, and longevity. We designed an authoritative, editorial medical web platform bridging cutting-edge scientific evidence with empathetic patient care, structuring her private telehealth consultations, signature 12-month program 'La Excelencia de tu Biología', dedicated masterclass on GLP-1 analogs (Ozempic & Mounjaro), and educational lead magnets."
    },
    challenge: {
      es: "El ecosistema digital médico a menudo oscila entre la frialdad aséptica de clínicas tradicionales o el sensacionalismo no verificado de la pseudociencia de bienestar. El desafío fue articular una propuesta de valor de alta gama para una médica internista con credenciales académicas PhD, posicionando sus servicios clínicos privados, cursos formativos y membresías anuales con un tono de autoridad científica impecable y estética editorial accesible.",
      en: "Digital healthcare interfaces frequently alternate between cold, sterile clinic portals or unverified wellness pseudoscience. The challenge was crafting a luxury editorial platform for an accredited MD PhD, effectively structuring private telehealth visits, intensive 12-month clinical memberships, and evidence-based education while preserving uncompromising scientific authority and warmth."
    },
    solution: {
      es: "Creamos una dirección de arte editorial distinguida con fondos crema suave y contrastes en verde azulado profundo (petróleo/slate), acentuados con toques lima/chartreuse para puntos de conversión estratégicos. Implementamos una arquitectura en cascada: consultas médicas con tarifas transparentes, storytelling de transformación personal (pérdida de 30kg), desglose modular del programa insignia de 12 meses, prueba social cuantificada (+4k pacientes, 15+ años, PhD), biblioteca descargable de recursos de salud hormonal y lanzamiento del curso médico sobre GLP-1.",
      en: "Architected a sophisticated editorial layout utilizing soft warm cream backgrounds paired with deep petrol teal contrast and lime/chartreuse accents for high-intent call-to-actions. Structured a comprehensive modular funnel: transparent telehealth consultation booking, physician transformation narrative, 12-month signature biological protocol breakdown, quantified credibility metrics (+4,000 patients, 15+ years, PhD), downloadable hormone guides, and GLP-1 masterclass enrollment."
    },
    deliverables: {
      es: [
        "Diseño de interfaz UI/UX completo para Homepage y landing pages en Figma",
        "Arquitectura de funnel médico con reserva directa de consultas online",
        "Estructura visual del programa anual 'La Excelencia de tu Biología'",
        "Módulo de infoproducto médico ('La Verdad sobre Ozempic & Mounjaro')",
        "Biblioteca de recursos descargables (Guía Post-40, Checklist Metabólico)",
        "Sistema tipográfico editorial refinado y paleta cromática clínica de lujo"
      ],
      en: [
        "Complete high-fidelity UI/UX design for homepage & landing funnels in Figma",
        "Telehealth appointment booking workflow with transparent pricing",
        "12-month biological protocol architecture ('La Excelencia de tu Biología')",
        "Medical masterclass section ('The Truth about Ozempic & Mounjaro')",
        "Downloadable lead magnet library (Post-40 Hormone Guide, Metabolic Checklist)",
        "Refined editorial typography system and clinical luxury color palette"
      ]
    },
    metrics: [
      { label: { es: "Años de Práctica Médica", en: "Years of Practice" }, value: "15+" },
      { label: { es: "Pacientes Atendidos", en: "Patients Treated" }, value: "4k+" },
      { label: { es: "Grado Académico", en: "Academic Degree" }, value: "PhD" },
      { label: { es: "Evidencia Científica", en: "Scientific Evidence" }, value: "100%" }
    ],
    gallery: [
      {
        src: "/uploads/dr-neus-munoz.png",
        alt: "Dra. Neus Muñoz Gost — Homepage Web Design Completo",
        caption: { es: "Página principal completa con consultas, programa anual, recursos y curso GLP-1", en: "Full-length homepage showcasing telehealth consultations, signature program, resources, and GLP-1 masterclass" },
        span: "full"
      }
    ]
  },

  "asustar-esta-canon": {
    id: "asustar-esta-canon",
    title: {
      es: "Asustar Está Cañón — Episodio Piloto",
      en: "Asustar Está Cañón — Animated Pilot Episode"
    },
    subtitle: {
      es: "VFX, composición cinematográfica, etalonaje y post-producción integral para episodio piloto de serie animada.",
      en: "VFX, multi-pass compositing, color grading, and comprehensive post-production for an animated series pilot."
    },
    category: "animation",
    categoryLabel: { es: "Animación / VFX / Postproducción", en: "Animation / VFX / Post-Production" },
    tag: { es: "VFX · Animación & Post-Producción", en: "VFX · Animation & Post-Production" },
    client: "Ximena García Lima / Asustar Está Cañón",
    year: "2025",
    role: { es: "Artista VFX, Compositor & Editor de Post-Producción", en: "VFX Artist, Compositor & Post-Production Editor" },
    coverImage: "/uploads/asustar-esta-canon.jpg",
    techStack: ["After Effects", "VFX Compositing", "Animación 2D/3D", "DaVinci Resolve", "Color Grading", "Diseño Sonoro", "Edición Audiovisual"],
    industry: { es: "Cine & Series de Animación", en: "Animation & Film Production" },
    video: {
      youtubeId: "1tEtMgeD91k",
      poster: "/uploads/asustar-esta-canon.jpg",
      title: { es: "Ver Episodio Piloto Completo", en: "Watch Full Pilot Episode" },
      aspectRatio: "video"
    },
    overview: {
      es: "Asustar Está Cañón es una serie animada de terror cómico y aventura. Para el episodio piloto ('Prepárate para el susto'), lideramos la etapa de post-producción integral: composición de efectos visuales (VFX), integración de pases de iluminación volumétrica, corrección de color cinematográfica y sincronización de ritmo audiovisual para maximizar la calidad narrativa y visual.",
      en: "Asustar Está Cañón is an animated comedy and spooky adventure series. For the pilot episode ('Prepárate para el susto'), we spearheaded complete post-production: visual effects (VFX) compositing, volumetric lighting passes, cinematic color grading, and audiovisual pacing to maximize comedic timing and storytelling punch."
    },
    challenge: {
      es: "El desafío principal radicaba en integrar los fondos nocturnos con el timing cómico de los personajes, manteniendo el misterio y la atmósfera de suspense sin oscurecer los detalles faciales ni ralentizar las gags humorísticas de la animación.",
      en: "The primary challenge was balancing spooky nocturnal backdrops with high-energy comedic character movement, preserving atmospheric suspense without dimming expressive character subtleties or hurting comedic slapstick pacing."
    },
    solution: {
      es: "Construimos un pipeline de composición por capas en After Effects con resplandores en ojos y luces de fondo, viñetas de enfoque, partículas ambientales y gradación de color personalizada en DaVinci Resolve para unificar visualmente todos los cortes del episodio piloto.",
      en: "Engineered a multi-layer compositing workflow in After Effects with custom character rim lighting, atmospheric particle effects, and tailored color grading in DaVinci Resolve to achieve a cohesive, broadcast-ready visual tone across all scenes."
    },
    deliverables: {
      es: [
        "Composición digital de planos animados (VFX Compositing)",
        "Pases de iluminación atmosférica y efectos de terror cómico",
        "Corrección de color y etalonaje cinematográfico unificado",
        "Sincronización rítmica audiovisual y micro-animaciones",
        "Masterización final y renderizado para distribución digital en YouTube"
      ],
      en: [
        "Multi-layered animated scene compositing (VFX Compositing)",
        "Atmospheric rim lighting and spooky visual effects",
        "Unified cinematic color grading across all sequences",
        "Rhythmic audiovisual pacing and micro-motion enhancements",
        "Final mastering and delivery optimized for YouTube"
      ]
    },
    metrics: [
      { label: { es: "Formato de Entrega", en: "Delivery Format" }, value: "4K / HD" },
      { label: { es: "Planos Compuestos", en: "Composited Shots" }, value: "+45" },
      { label: { es: "Duración Episodio", en: "Episode Duration" }, value: "Piloto" },
      { label: { es: "Acabado de Producción", en: "Production Polish" }, value: "100%" }
    ],
    gallery: [
      {
        src: "/uploads/asustar-esta-canon.jpg",
        alt: "Asustar Está Cañón — Key Art y Fotograma Oficial",
        caption: { es: "Key art oficial y alineación de personajes del episodio piloto", en: "Official key art and character lineup from the pilot episode" },
        span: "full"
      }
    ]
  },

  "aforeaventura-3d": {
    id: "aforeaventura-3d",
    title: {
      es: "AforeAventura — Juego de Mesa & Modelado 3D STL",
      en: "AforeAventura — Board Game & 3D STL Miniatures"
    },
    subtitle: {
      es: "Diseño integral de juego de mesa educativo, modelado 3D de personajes inclusivos para impresión 3D (STL) y arte vectorial del tablero hexagonal.",
      en: "Comprehensive educational board game design, 3D inclusive character modeling for 3D printing (STL), and hexagonal board vector layout."
    },
    category: "3d",
    categoryLabel: { es: "3D & Modelado", en: "3D & Modeling" },
    tag: { es: "Impresión 3D STL · Diseño de Juegos & Modelado", en: "3D Printing STL · Tabletop & 3D Modeling" },
    client: "AforeAventura / Educación Financiera Lúdica",
    year: "2024",
    role: { es: "Modelador 3D, Diseñador de Juego & Especialista STL", en: "3D Modeler, Tabletop Game Designer & STL Specialist" },
    coverImage: "/uploads/aforeaventura-personaje-4.png",
    techStack: ["Blender", "Modelado 3D", "Impresión 3D (STL)", "Adobe Illustrator", "Diseño Editorial", "Diseño de Juego de Mesa", "Malla Estanca (Manifold)"],
    industry: { es: "Juegos de Mesa, Diseño Editorial & Educación Financiera", en: "Tabletop Games, Editorial Design & Financial Education" },
    overview: {
      es: "AforeAventura es un proyecto integral de diseño lúdico y educativo concebido para transformar el aprendizaje sobre el ahorro para el retiro (AFORE) en una experiencia dinámica, inclusiva y visualmente atractiva. El proyecto abarcó desde el diseño de manuales de instrucciones y reglas de juego impresas en formato editorial, el diseño de tarjetas temáticas y tablas comparativas de comisiones/rendimientos, hasta la diagramación vectorial del tablero concéntrico de 75 casillas y el modelado 3D en Blender de 4 personajes con identidades diversas optimizados para impresión 3D (STL).",
      en: "AforeAventura is an all-inclusive tabletop and educational design project built to gamify financial literacy and retirement planning (AFORE). The project encompassed full editorial layout for the game manual and rulebook, thematic card decks and return/commission comparison tables, alongside the vector artwork of the 75-space hexagonal board and the custom 3D modeling of 4 diverse character tokens optimized for 3D printing (STL)."
    },
    challenge: {
      es: "Sintetizar conceptos financieros complejos (SIEFORES, comisiones, rendimientos, cotización temprana y cálculo de jubilación) en mecánicas de juego ágiles, redactando y diagramando manuales impresos legibles con jerarquía gráfica limpia, a la vez que se diseñaban miniaturas 3D con topología estanca (manifold/watertight) preparadas para fabricación aditiva.",
      en: "Synthesizing complex financial retirement principles into engaging tabletop game mechanics, formatting readable print-ready rule manuals and comparison charts, while engineering 3D character miniatures with watertight topology ready for additive manufacturing."
    },
    solution: {
      es: "Desarrollamos un kit de juego completo: manual de instrucciones paso a paso, folleto de reglas con guía de selección del cajero y flujo por turnos, tabla comparativa de rendimientos ('AdmiFácil', 'GranAhorro', 'Futuros en Concreto'), glosario de términos financieros, y el modelado 3D de personajes estilizados con base circular para impresión STL.",
      en: "Delivered a complete board game kit: step-by-step instruction booklet, official rulebook with turn flow and banker guidelines, yield comparison charts, financial glossary, and 3D character miniatures with stable bases for STL printing."
    },
    deliverables: {
      es: [
        "Modelado 3D de 4 personajes en Blender con base circular (.blend / .stl)",
        "Diseño gráfico editorial del manual de instrucciones y componentes",
        "Diseño y maquetación de folleto de reglas y fases de juego",
        "Tabla comparativa de rendimientos y comisiones para el retiro",
        "Glosario financiero y sistema de tarjetas por categorías",
        "Arte vectorial del tablero hexagonal concéntrico de 75 casillas"
      ],
      en: [
        "3D character token modeling in Blender with circular stability bases (.blend / .stl)",
        "Editorial graphic design for instruction booklet and game components",
        "Complete rulebook layout and gameplay phase guide",
        "Yield and commission comparative tables for retirement savings",
        "Financial glossary and color-coded card system",
        "Vector artwork for the 75-space concentric hexagonal board"
      ]
    },
    metrics: [
      { label: { es: "Personajes 3D", en: "3D Characters" }, value: "4 Miniaturas" },
      { label: { es: "Manual Editorial", en: "Manual Pages" }, value: "6 Páginas" },
      { label: { es: "Casillas de Tablero", en: "Board Spaces" }, value: "75 Casillas" },
      { label: { es: "Tarjetas de Juego", en: "Game Cards" }, value: "114 Tarjetas" }
    ],
    has3DViewer: true,
    gallery: [
      {
        src: "/uploads/aforeaventura-personaje-4.png",
        alt: "AforeAventura — Personaje 4 Render 3D Miniatura",
        caption: { es: "Render 3D de miniatura inclusiva con silla de ruedas y base circular lista para impresión 3D STL", en: "3D render of inclusive wheelchair miniature with circular base ready for STL 3D printing" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-tablero.png",
        alt: "AforeAventura — Tablero Hexagonal de Juego",
        caption: { es: "Diseño gráfico y diagramación vectorial del tablero hexagonal con 75 casillas y sistema de dados", en: "Vector layout of the 75-space hexagonal game board with dice and card mechanics" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-manual-intro.jpg",
        alt: "AforeAventura — Portada e Introducción del Manual",
        caption: { es: "Diseño editorial de la introducción del manual: jugadores (3-5), duración (30-60 min) y público objetivo (18+)", en: "Editorial layout of manual intro: player count (3-5), duration (30-60 min), and target age (18+)" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-manual-componentes.jpg",
        alt: "AforeAventura — Componentes del Juego",
        caption: { es: "Desglose de componentes: 4 personajes 3D, tablero, 150 monedas Jubipesos, alcancías, temporizadores y 114 tarjetas", en: "Game component breakdown: 4 3D character pawns, board, 150 Jubipesos coins, piggy banks, timers, and 114 cards" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-manual-rendimientos.jpg",
        alt: "AforeAventura — Tabla Comparativa de Rendimientos",
        caption: { es: "Diseño de tabla comparativa de rendimientos y comisiones entre administradoras financieras", en: "Yield and commission comparative table across financial administrators" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-manual-glosario.jpg",
        alt: "AforeAventura — Glosario de Términos Financieros",
        caption: { es: "Glosario interactivo para el cajero con términos clave: AFORE, Retiro, Jubilación, Cotización y Rendimiento", en: "Interactive banker glossary with key financial terms: AFORE, Retirement, Pension, and Yield" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-personaje-1.png",
        alt: "AforeAventura — Personaje 1 Render 3D",
        caption: { es: "Modelado 3D del personaje juvenil estilizado integrado como peón y arte del tablero", en: "Stylized young character 3D model used as game pawn and board artwork" },
        span: "half"
      },
      {
        src: "/uploads/aforeaventura-personaje-2.jpg",
        alt: "AforeAventura — Personaje 2 Render 3D",
        caption: { es: "Modelado 3D de personaje femenino estilizado con base de apoyo para tablero", en: "Stylized female character 3D model with stable tabletop base" },
        span: "half"
      }
    ]
  },

  "art-toy-conejo": {
    id: "art-toy-conejo",
    title: {
      es: "Art Toy Conejo — Escultura & Personaje 3D",
      en: "Rabbit Art Toy — 3D Character Sculpture"
    },
    subtitle: {
      es: "Diseño de personaje, modelado 3D en Blender y renders de estudio para un Art Toy coleccionable primaveral.",
      en: "Character design, 3D modeling in Blender, and studio rendering for a collectible spring gardener art toy."
    },
    category: "3d",
    categoryLabel: { es: "3D & Modelado", en: "3D & Modeling" },
    tag: { es: "Modelado 3D · Art Toy & Escultura Digital", en: "3D Modeling · Art Toy & Character Design" },
    client: "Proyecto de Autor / Arte Digital",
    year: "2025",
    role: { es: "Diseñador de Personaje & Artista 3D", en: "3D Character Artist & Modeler" },
    has3DViewer: true,
    coverImage: "/uploads/art-toy-conejo-cover.jpg",
    techStack: ["Blender", "Modelado 3D", "Character Design", "Art Toy", "Iluminación de Estudio", "Cycles / Eevee", "Shading & Texturizado", "Adobe Illustrator"],
    industry: { es: "Arte Digital & Juguete Coleccionable", en: "Digital Art & Designer Toys" },
    overview: {
      es: "Exploración integral de diseño y modelado de un Art Toy coleccionable estilizado inspirado en la primavera y la jardinería. El proyecto abarcó desde el desarrollo del concept art y character sheet ortogonal en Illustrator hasta el modelado poligonal completo, esculpido de proporciones jugueteras, diseño de accesorios (overol, props botánicos y herramientas) y renderizado de estudio con iluminación controlada en Blender.",
      en: "Comprehensive character design and 3D modeling exploration for a stylized collectible Art Toy inspired by spring and botanical gardening. The project spanned concept development and orthogonal turnaround character sheets in Illustrator through to complete polygonal modeling in Blender, stylized vinyl-toy proportions, custom props (gardener overalls, flowers, and watering tools), and studio lighting rendering."
    },
    challenge: {
      es: "El desafío central consistió en lograr una silueta limpia, carismática y equilibrada con proporciones de juguete de vinilo / art toy de colección, cuidando la topología y el loop de aristas en extremidades, orejas y accesorios para garantizar superficies continuas, libres de artefactos de sombreado y preparadas para renderizado y potencial fabricación física.",
      en: "The core challenge was crafting a clean, expressive silhouette with collectible vinyl toy proportions, maintaining clean edge loops and quad topology across limbs, ears, and props to ensure smooth shading surfaces ready for both high-fidelity rendering and physical fabrication or 3D prototyping."
    },
    solution: {
      es: "Se desarrolló una malla base optimizada con subdivisión controlada en Blender, combinando formas orgánicas suaves con accesorios duros (hard surface) para los props de jardinería. Se aplicaron shaders con acabados tipo vinilo mate y plástico satinado, recreando la textura táctil de los art toys contemporáneos, y se configuró un setup de tres puntos de luz de estudio con fondos neutros para resaltar la volumetría del personaje.",
      en: "We sculpted an optimized base mesh with controlled subdivision surface modeling in Blender, merging soft organic curves with hard-surface garden props. Bespoke matte vinyl and satin plastic shaders were tuned to capture the tactile feel of contemporary designer toys, paired with a studio three-point lighting setup on neutral seamless cycloramas to accentuate form and volume."
    },
    deliverables: {
      es: [
        "Modelado 3D completo del personaje y accesorios en Blender (.blend)",
        "Character Sheet y vistas ortogonales (Turnaround Front, 3/4, Side, Back)",
        "Topología limpia con bucles de aristas optimizados para subdivisión",
        "Setup de iluminación de estudio y materiales tipo vinilo / Art Toy",
        "Renders de alta resolución en múltiples ángulos de presentación",
        "Estudio de wireframe y topología poligonal"
      ],
      en: [
        "Complete 3D character and prop modeling in Blender (.blend)",
        "Character turnaround sheets (Front, 3/4, Side, and Back views)",
        "Clean quad topology with edge loops optimized for subdivision",
        "Studio three-point lighting rig and custom vinyl material shaders",
        "High-resolution presentation showcase renders",
        "Wireframe and polygonal topology study"
      ]
    },
    metrics: [
      { label: { es: "Disciplina", en: "Discipline" }, value: "Art Toy 3D" },
      { label: { es: "Vistas de Estudio", en: "Studio Views" }, value: "360° Renders" },
      { label: { es: "Topología", en: "Topology" }, value: "Quad-Clean Mesh" },
      { label: { es: "Entregables", en: "Deliverables" }, value: "Character Sheet & .blend" }
    ],
    gallery: [
      {
        src: "/uploads/art-toy-conejo-sheet.jpg",
        alt: "Art Toy Conejo — Character Sheet & Turnaround Final",
        caption: { es: "Character Sheet final con vistas ortogonales, paleta cromática y especificaciones de diseño", en: "Final Character Sheet with orthogonal turnaround views, color palette, and design specs" },
        span: "full"
      },
      {
        src: "/uploads/art-toy-conejo-render-1.jpg",
        alt: "Art Toy Conejo — Render Frontal de Estudio",
        caption: { es: "Render frontal de estudio con iluminación cálida y material tipo vinilo mate", en: "Front studio render with warm lighting and matte vinyl material finish" },
        span: "half"
      },
      {
        src: "/uploads/art-toy-conejo-render-2.jpg",
        alt: "Art Toy Conejo — Render Perspectiva 3/4",
        caption: { es: "Perspectiva en tres cuartos destacando la silueta curva y proporciones de art toy", en: "Three-quarters perspective showcasing stylized toy silhouette and curved proportions" },
        span: "half"
      },
      {
        src: "/uploads/art-toy-conejo-render-3.jpg",
        alt: "Art Toy Conejo — Vista Lateral",
        caption: { es: "Vista lateral mostrando el perfil del personaje y la postura juguetona", en: "Side view showing character profile and playful toy stance" },
        span: "half"
      },
      {
        src: "/uploads/art-toy-conejo-render-4.jpg",
        alt: "Art Toy Conejo — Vista Posterior & Detalles",
        caption: { es: "Vista posterior resaltando los tirantes del overol y el volumen de la cola", en: "Back view highlighting overall straps, pocket detailing, and tail volume" },
        span: "half"
      },
      {
        src: "/uploads/art-toy-conejo-wireframe-1.jpg",
        alt: "Art Toy Conejo — Wireframe & Topología Frontal",
        caption: { es: "Inspección de malla poligonal (wireframe) frontal con flujo de aristas limpio", en: "Front polygonal wireframe inspection showing clean edge loop flow" },
        span: "half"
      },
      {
        src: "/uploads/art-toy-conejo-wireframe-2.jpg",
        alt: "Art Toy Conejo — Wireframe & Topología Posterior",
        caption: { es: "Estructura de malla wireframe posterior para verificar distribución homogénea", en: "Back wireframe mesh structure verifying even quad distribution" },
        span: "half"
      }
    ]
  },

  "edicion-foto-matriciales": {
    id: "edicion-foto-matriciales",
    title: {
      es: "Composición & Retoque Fotográfico Fantástico",
      en: "Fantasy Photo Retouching & Composite Art"
    },
    subtitle: {
      es: "Fotocomposición matricial avanzada, fotomontaje de alta precisión, retoque de piel e iluminación mágica.",
      en: "Advanced matrix photo composition, high-precision photomontage, skin retouching, and magic fantasy lighting."
    },
    category: "photo",
    categoryLabel: { es: "Edición de Foto", en: "Photo Editing" },
    tag: { es: "Edición de Foto · Fotocomposición Matricial", en: "Photo Editing · Matrix Composite" },
    client: "Proyecto de Autor / Ilustración Matricial",
    year: "2025",
    role: { es: "Artista Digital, Retocador & Fotocompositor", en: "Digital Artist, Retoucher & Composite Artist" },
    coverImage: "/uploads/composicion-matriciales-parcial.jpg",
    techStack: ["Adobe Photoshop", "Fotocomposición", "Color Grading", "Retoque Digital", "Máscaras de Precisión", "Fusión de Modos", "Iluminación Dramática"],
    industry: { es: "Arte Digital & Retoque Fotográfico", en: "Digital Art & Photo Retouching" },
    overview: {
      es: "Proyecto integral de fotocomposición y arte matricial digital donde se combinan técnicas complejas de recorte fino, integración de elementos de fantasía, diseño de círculos rúnicos vectoriales y balance de luz ambiental para crear un retrato conceptual medieval de alta atmósfera y dramatismo.",
      en: "Comprehensive digital matrix photomontage and photo editing exploration blending complex hair and edge masking, fantasy element integration, custom vector runic halo design, and meticulous ambient lighting balance to produce a dramatic, atmospheric medieval fantasy portrait."
    },
    challenge: {
      es: "Integrar el sujeto fotográfico (cota de malla, cabello rojizo y espada) con un fondo forestal profundo y elementos gráficos luminosos, asegurando bordes naturales sin halos de recorte, rebote de luz volumétrica coherente y una paleta de color armónica que preserve el grano y nitidez de la toma original.",
      en: "Integrating the photographic subject (chainmail, red hair, and sword) against a deep forest cyclorama and luminous graphic glyphs while eliminating extraction fringing, matching volumetric rim lighting, and harmonizing the color grade without degrading sharpness or natural texture."
    },
    solution: {
      es: "Se emplearon técnicas de máscaras por canales para un recorte milimétrico de cabello y texturas metálicas, sobreexposición y subexposición digital (Dodge & Burn) no destructivo para esculpir volúmenes de luz, degradados radiales para el resplandor místico y capas de ajuste de color selectivo para unificar temperatura e intensidad lumínica.",
      en: "Employed channel-based masking for pixel-perfect separation of fine hair and metallic chainmail, non-destructive dodge-and-burn micro-contrast sculpting, radial gradient glows for mystical runic backlighting, and selective curve color grading to tie temperature and luminance together seamlessly."
    },
    deliverables: {
      es: [
        "Fotocomposición final en alta resolución lista para impresión (CMYK / RGB)",
        "Archivo maestro multicapa organizado (.PSD)",
        "Máscaras de recorte avanzadas por canales y trazados",
        "Tratamiento tonal, corrección de color y esquemas de luz ambiental",
        "Diseño e integración de halo rúnico y efectos mágicos"
      ],
      en: [
        "High-resolution master composite artwork ready for print & digital showcase",
        "Organized multi-layer master source file (.PSD)",
        "Advanced hair and metal channel-based isolation masks",
        "Selective color grading, luminance tone mapping, and ambient lighting",
        "Custom runic halo vector design and ethereal atmospheric FX"
      ]
    },
    metrics: [
      { label: { es: "Resolución", en: "Resolution" }, value: "300 DPI" },
      { label: { es: "Capas de Composición", en: "Composite Layers" }, value: "+50 Capas" },
      { label: { es: "Técnica", en: "Technique" }, value: "Dodge & Burn" },
      { label: { es: "Software", en: "Software" }, value: "Photoshop CC" }
    ],
    gallery: [
      {
        src: "/uploads/composicion-matriciales-parcial.jpg",
        alt: "Composición & Retoque Fotográfico Fantástico — Final",
        caption: { es: "Fotocomposición matricial final con iluminación mística, halo rúnico y corrección de color", en: "Final matrix photocomposite with mystical runic backlight, dodge & burn sculpting, and color grade" },
        span: "full"
      },
      {
        src: "/uploads/composicion-matriciales-extra.jpg",
        alt: "Fotocomposición Castillo y Fuego Azul",
        caption: { es: "Fotocomposición conceptual adicional: Castillo en noche de luna con llamas etéreas y personaje místico", en: "Additional concept photocomposite: Castle by moonlight with ethereal blue fire and mystic figure" },
        span: "half"
      },
      {
        src: "/uploads/composicion-matriciales-recorte.jpg",
        alt: "Fotografía y Recorte Original del Sujeto",
        caption: { es: "Toma fotográfica de estudio y proceso de aislamiento de silueta", en: "Studio source photograph and subject isolation process" },
        span: "half"
      },
      {
        src: "/uploads/composicion-matriciales-fondo.jpg",
        alt: "Placas de Fondo Forestal",
        caption: { es: "Textura y placa fotográfica de fondo boscoso antes de la integración y desenfoque dinámico", en: "Forest background plate texture prior to lighting integration and motion blur" },
        span: "full"
      }
    ]
  },

  "collage-bauhaus": {
    id: "collage-bauhaus",
    title: {
      es: "Collage Bauhaus — Deconstrucción Tipográfica & Arquitectura",
      en: "Bauhaus Collage — Typographic Deconstruction & Architecture"
    },
    subtitle: {
      es: "Homenaje al movimiento Bauhaus combinando geometría moderna, tipografía deconstructiva y color puro sobre arquitectura icónica.",
      en: "Tribute to the Bauhaus movement fusing modernist geometry, deconstructive typography, and primary color blocks over iconic architecture."
    },
    category: "photo",
    categoryLabel: { es: "Edición de Foto", en: "Photo Editing" },
    tag: { es: "Edición de Foto · Collage Modernista", en: "Photo Editing · Modernist Collage" },
    client: "Proyecto Editorial & Arte Gráfico / Universidad",
    year: "2024",
    role: { es: "Diseñador Gráfico & Artista de Collage", en: "Graphic Designer & Collage Artist" },
    coverImage: "/uploads/collage-bauhaus.jpg",
    techStack: ["Adobe Photoshop", "Collage Digital", "Composición Tipográfica", "Geometría Vectorial", "Tratamiento de Imagen"],
    industry: { es: "Diseño Editorial & Arte Gráfico", en: "Editorial Design & Graphic Arts" },
    overview: {
      es: "Pieza de collage digital y fotomontaje vanguardista inspirada en la emblemática escuela Bauhaus de Dessau. Se integran formas geométricas primarias (círculo, triángulo, rectángulo) en colores fundamentales (azul cobalto, rojo bermellón y amarillo cadmio) directamente sobre la fachada de vidrio y concreto, dialogando con un juego tipográfico modular repetitivo de alto impacto visual.",
      en: "Avant-garde digital collage and photomontage piece inspired by the seminal Bauhaus school in Dessau. Primary geometric forms (circle, triangle, rectangle) in core tones (cobalt blue, vermillion red, and cadmium yellow) are mapped onto glass and concrete façades, creating a rhythmic dialogue with repetitive modular typography."
    },
    challenge: {
      es: "Mantener el equilibrio compositivo entre la rigidez arquitectónica de la fotografía del edificio de Dessau y los bloques de color planos, asegurando que las transparencias, sombras y la textura original del edificio permanezcan visibles y no se conviertan en parches desvinculados.",
      en: "Balancing the architectural rigidity of the Dessau building photography with flat color planes, ensuring transparencies, building textures, and shadows interact organically rather than feeling like disconnected overlays."
    },
    solution: {
      es: "Se mapearon máscaras vectoriales siguiendo las líneas de fuga y ventanas de la estructura, aplicando modos de fusión (Multiplicar y Luz Suave) con gradaciones sutiles que abrazan la volumetría de la arquitectura, combinadas con una jerarquía tipográfica limpia y contundente en el encabezado.",
      en: "Mapped vector masks along architectural vanishing points and structural windows, applying blending modes with subtle tone gradations that wrap the building's volume while anchoring bold modernist typography up top."
    },
    deliverables: {
      es: [
        "Póster de collage artístico en formato editorial de alta resolución",
        "Tratamiento cromático con paleta primaria Bauhaus",
        "Integración de texturas arquitectónicas y elementos geométricos vectoriales",
        "Archivo maestro digital para impresión y reproducción gráfica"
      ],
      en: [
        "High-resolution artistic editorial poster print artwork",
        "Primary Bauhaus palette color harmonies and tonal mapping",
        "Architectural texture integration and vector geometry overlays",
        "Master print-ready digital artwork files"
      ]
    },
    metrics: [
      { label: { es: "Estilo", en: "Style" }, value: "Bauhaus Modern" },
      { label: { es: "Formato", en: "Format" }, value: "Cartel / Poster" },
      { label: { es: "Paleta", en: "Palette" }, value: "Colores Primarios" },
      { label: { es: "Herramienta", en: "Tool" }, value: "Photoshop CC" }
    ],
    gallery: [
      {
        src: "/uploads/collage-bauhaus.jpg",
        alt: "Collage Bauhaus — Deconstrucción Tipográfica & Arquitectura",
        caption: { es: "Póster de collage final combinando fotografía de Dessau, paleta primaria y juego tipográfico modular", en: "Final collage poster combining Dessau photography, primary palette, and modular typography" },
        span: "full"
      }
    ]
  },

  "portada-disco-weezer": {
    id: "portada-disco-weezer",
    title: {
      es: "Portada Disco Weezer — OK Human",
      en: "Weezer Album Cover — OK Human"
    },
    subtitle: {
      es: "Concepto visual y fotomontaje metafórico que conecta el calor humano y las mascotas con la frialdad hospitalaria.",
      en: "Metaphorical photo manipulation concept bridging human warmth and pet companionship with clinical hospital vulnerability."
    },
    category: "photo",
    categoryLabel: { es: "Edición de Foto", en: "Photo Editing" },
    tag: { es: "Edición de Foto · Portada Musical", en: "Photo Editing · Album Cover Art" },
    client: "Proyecto de Autor / Ilustración Musical",
    year: "2023",
    role: { es: "Diseñador de Arte & Retocador Digital", en: "Cover Art Designer & Digital Retoucher" },
    coverImage: "/uploads/portada-disco.jpg",
    techStack: ["Adobe Photoshop", "Fotomontaje Conceptual", "Retoque Fotográfico", "Texturizado", "Diseño de Portadas"],
    industry: { es: "Música & Diseño Discográfico", en: "Music & Album Art Design" },
    overview: {
      es: "Reinterpretación conceptual de la portada para el aclamado álbum 'OK Human' de Weezer. La composición articula un puente emocional: desde una mano en recuperación clínica con catéter y apósitos, surge una franja de césped vivo por la que caminan pequeños perros y gatos guiados hacia un símbolo sonriente de esperanza y bienestar.",
      en: "Conceptual cover art reinterpretation for Weezer's orchestral album 'OK Human'. The composition conveys an emotional pilgrimage: from a hospitalized hand with catheter bandages emerges a path of vibrant grass where miniature companion animals journey toward a radiant, warm smiley face."
    },
    challenge: {
      es: "Armonizar elementos visualmente contrastantes: la crudeza aséptica de la fotografía hospitalaria con la textura orgánica del césped y figuras en miniatura, logrando sombras de contacto convincentes y una iluminación cálida envolvente que otorgue credibilidad al mensaje.",
      en: "Harmonizing visually disparate elements: the stark vulnerability of a clinical hospital photograph with organic turf texture and miniature animals, crafting convincing contact shadows and directional warm lighting that reinforces the concept."
    },
    solution: {
      es: "Se ejecutó un calado de textura de hierba con bordes deshilachados orgánicos integrados a la piel, pintura digital de sombras proyectadas para cada uno de los animales y una fuente de resplandor suave dorada emanando del emoticono que baña sutilmente la palma y los dedos.",
      en: "Created feathered grass contours naturally fading into skin texture, hand-painted perspective contact shadows beneath each miniature pet, and dialed a warm radial luminescence centered on the smiley face to cast gentle highlights across the palm and fingers."
    },
    deliverables: {
      es: [
        "Arte de portada en formato cuadrado estándar para vinilo y streaming (3000x3000px)",
        "Fotomontaje conceptual de alta precisión con sombras direccionales",
        "Diseño tipográfico con logotipo oficial de Weezer",
        "Archivo maestro multicapa .PSD para adaptaciones de singles y merchandising"
      ],
      en: [
        "Standard square album artwork for vinyl packaging and streaming (3000x3000px)",
        "High-precision conceptual photomontage with directional contact shadows",
        "Typography layout incorporating official Weezer identity",
        "Master layered .PSD file for single variants and promotional merch"
      ]
    },
    metrics: [
      { label: { es: "Formato", en: "Format" }, value: "Vinilo / LP Cover" },
      { label: { es: "Género", en: "Genre" }, value: "Indie Rock / Pop" },
      { label: { es: "Técnica", en: "Technique" }, value: "Fotomontaje" },
      { label: { es: "Software", en: "Software" }, value: "Photoshop" }
    ],
    gallery: [
      {
        src: "/uploads/portada-disco.jpg",
        alt: "Portada Disco Weezer — OK Human Final",
        caption: { es: "Arte final de la portada con integración de textura de césped, figuras y tipografía oficial", en: "Final album cover artwork featuring grass pathway integration, miniature animals, and official branding" },
        span: "full"
      }
    ]
  },

  "pringles-publicidad": {
    id: "pringles-publicidad",
    title: {
      es: "Pringles Crema & Cebolla — Publicidad & Dinamismo",
      en: "Pringles Sour Cream & Onion — Dynamic Ad Composition"
    },
    subtitle: {
      es: "Composición fotográfica publicitaria de producto con papas en suspensión dinámica, ingredientes frescos y destellos de sal.",
      en: "Dynamic product advertising photo composite featuring floating potato chips, fresh ingredients, and floating seasoning."
    },
    category: "photo",
    categoryLabel: { es: "Edición de Foto", en: "Photo Editing" },
    tag: { es: "Edición de Foto · Fotografía Publicitaria", en: "Photo Editing · Product Advertising" },
    client: "Proyecto de Publicidad / Universidad",
    year: "2024",
    role: { es: "Retocador de Producto & Diseñador Publicitario", en: "Product Retoucher & Commercial Designer" },
    coverImage: "/uploads/pringles-composicion.png",
    techStack: ["Adobe Photoshop", "Fotocomposición Publicitaria", "Retoque de Producto", "Dodge & Burn", "Profundidad de Campo"],
    industry: { es: "Publicidad & Fotografía Comercial", en: "Advertising & Commercial Photography" },
    overview: {
      es: "Diseño publicitario comercial para la icónica lata de Pringles Crema y Cebolla. La pieza transmite frescura, crujido y sabor instantáneo mediante una composición en 'levitación' donde las papas fritas sobrevuelan el envase con destellos de sal y profundidad de campo simulada sobre un fondo cálido degradado.",
      en: "Commercial advertising design for Pringles Sour Cream & Onion. The piece conveys freshness, crunch, and bold flavor through a dynamic 'levitation' layout where crisp potato chips float around the iconic canister with seasoning specks and optical depth on an appetizing warm backdrop."
    },
    challenge: {
      es: "Lograr una interacción creíble entre la lata de aluminio con textura semibrillante, las papas fritas transparentes al contraluz y la dispersión de micropartículas de sal, conservando bordes nítidos y volumen volumétrico publicitario de primer nivel.",
      en: "Achieving convincing spatial relationship between the reflective cylindrical canister, translucent back-lit potato chips, and salt seasoning micro-particles while preserving ultra-crisp edges and commercial volumetric lighting."
    },
    solution: {
      es: "Aislamiento milimétrico del empaque y snacks, realce de brillos especulares en la curvatura de las papas con curvas y sobreexposición puntual, junto con un desenfoque de lente progresivo en los elementos cercanos a la cámara para generar inmersión tridimensional.",
      en: "Sub-pixel masking of canister and chips, specular rim highlight enhancement along crispy potato curvatures using custom curves, and progressive lens blur on foreground chips to establish 3D immersion."
    },
    deliverables: {
      es: [
        "Composición publicitaria vertical para cartelería digital y redes sociales",
        "Retoque de producto y realce de textura crujiente de papas",
        "Integración de logotipo oficial y elementos de marca Pringles",
        "Archivo de alta resolución con capas de ajuste no destructivas"
      ],
      en: [
        "Vertical commercial layout optimized for digital out-of-home and social campaigns",
        "Product packaging retouching and crisp snack texture enhancement",
        "Official Pringles branding and lockup integration",
        "High-resolution layered master with non-destructive adjustments"
      ]
    },
    metrics: [
      { label: { es: "Tipo", en: "Type" }, value: "Publicidad de Producto" },
      { label: { es: "Formato", en: "Format" }, value: "Vertical Key Visual" },
      { label: { es: "Efecto", en: "Effect" }, value: "Levitación Dinámica" },
      { label: { es: "Software", en: "Software" }, value: "Photoshop" }
    ],
    gallery: [
      {
        src: "/uploads/pringles-composicion.png",
        alt: "Pringles Crema & Cebolla — Publicidad Final",
        caption: { es: "Arte publicitario final de Pringles Crema y Cebolla con papas flotantes y atmósfera comercial", en: "Final commercial key visual for Pringles Sour Cream & Onion with floating chips and brand aesthetics" },
        span: "full"
      }
    ]
  },

  "powerkick": {
    id: "powerkick",
    title: {
      es: "Powerkick — E-commerce & Configurador 3D WebGL",
      en: "Powerkick — E-commerce & 3D WebGL Configurator"
    },
    subtitle: {
      es: "Plataforma de calzado deportivo de vanguardia con personalización 3D interactiva en tiempo real y estética cyber-streetwear.",
      en: "Cutting-edge sneaker platform featuring real-time interactive 3D WebGL customization and high-energy cyber-streetwear design."
    },
    category: "web",
    categoryLabel: { es: "Desarrollo Web & UI/UX", en: "Web Dev & UI/UX Design" },
    tag: { es: "Desarrollo Web · UI/UX & WebGL 3D", en: "Web Dev · UI/UX & 3D WebGL" },
    client: "Powerkick Sneakers / Proyecto de Autor",
    year: "2025",
    role: { es: "Diseñador UI/UX & Desarrollador WebGL 3D", en: "UI/UX Designer & 3D WebGL Developer" },
    coverImage: "/uploads/powerkick-cover.png",
    techStack: ["React", "Three.js", "React Three Fiber", "GSAP", "Tailwind CSS", "Blender", "Modelado 3D", "WebGL Post-Processing"],
    industry: { es: "E-Commerce, Moda & Tecnología 3D", en: "E-Commerce, Fashion & 3D Tech" },
    overview: {
      es: "Powerkick es una experiencia digital inmersiva para el lanzamiento de sneakers de edición limitada. Fusiona una interfaz de usuario minimalista y audaz con un visor 3D interactivo en WebGL potenciado por React Three Fiber, permitiendo a los compradores explorar el modelo en 360°, inspeccionar detalles de fabricación y alternar paletas de color en tiempo real con transiciones cinematográficas y efectos de postprocesado.",
      en: "Powerkick is an immersive digital sneaker release showcase. It fuses high-energy streetwear UI with a real-time WebGL 3D configurator powered by React Three Fiber, allowing buyers to inspect footwear geometry in 360 degrees, toggle colorways instantaneously, and enjoy cinematic post-processing effects."
    },
    challenge: {
      es: "Diseñar una experiencia de compra fluida que combine el rendimiento ágil de un sitio web e-commerce con la carga de modelos poligonales 3D detallados, texturas y shaders de estudio sin ralentizar la tasa de frames ni comprometer la usabilidad en dispositivos de distintas gamas.",
      en: "Designing a seamless shopping experience balancing fast e-commerce load times with detailed 3D sneaker meshes, studio shaders, and real-time interaction without frame drops or usability hurdles across devices."
    },
    solution: {
      es: "Se optimizó la topología y malla del calzado en Blender, reduciendo el archivo a un formato GLB ultra liviano. Se implementó una arquitectura de componentes modulares en React Three Fiber con Drei, orquestación de animaciones de cámara con GSAP y una interfaz de diseño limpia con controles táctiles y feedback visual instantáneo.",
      en: "Optimized sneaker mesh topology in Blender into an ultra-lean GLB format. Built a modular React Three Fiber scene with Drei, GSAP camera choreographies, and a bold high-contrast UI delivering instant tactile feedback upon colorway switching."
    },
    deliverables: {
      es: [
        "Diseño completo de interfaz de usuario UI/UX en desktop y tablet",
        "Configurador 3D interactivo WebGL con rotación 360° y zoom dinámico",
        "Modelado, texturizado y optimización de malla de sneaker en Blender (.blend / .glb)",
        "Pipeline de shaders personalizados y cambio de combinaciones de color",
        "Integración de animaciones y microinteracciones de interfaz con GSAP"
      ],
      en: [
        "Complete responsive UI/UX interface design for desktop and tablet screens",
        "Interactive 3D WebGL shoe configurator with 360° orbit and dynamic zoom",
        "Sneaker 3D modeling, texturing, and mesh optimization in Blender (.blend / .glb)",
        "Custom shader material pipeline with instant colorway toggling",
        "GSAP interface interaction orchestration and micro-animations"
      ]
    },
    metrics: [
      { label: { es: "Tasa de Refresco", en: "Frame Rate" }, value: "60 FPS" },
      { label: { es: "Malla 3D", en: "3D Mesh" }, value: "3.6 MB GLB" },
      { label: { es: "Interacción", en: "Interaction" }, value: "360° Orbit" },
      { label: { es: "Frontend", en: "Frontend" }, value: "React + R3F" }
    ],
    gallery: [
      {
        src: "/uploads/powerkick-cover.png",
        alt: "Powerkick — E-commerce & Configurador 3D WebGL",
        caption: { es: "Mockup de interfaz en tablet mostrando la experiencia del configurador 3D", en: "Tablet UI mockup highlighting interactive 3D configurator experience" },
        span: "full"
      },
      {
        src: "/uploads/powerkick-ui-1.png",
        alt: "Powerkick UI Modo Dark — Sneaker Air Force 2",
        caption: { es: "Diseño de interfaz principal con selector de combinaciones de color y composición hero", en: "Main hero interface layout featuring style/colorway selectors" },
        span: "half"
      },
      {
        src: "/uploads/powerkick-ui-2.png",
        alt: "Powerkick UI Variante Warm",
        caption: { es: "Variante cromática con fondo dinámico cálido e iluminación de producto", en: "Warm background palette variant with dynamic product studio lighting" },
        span: "half"
      },
      {
        src: "/uploads/powerkick-render-lateral.png",
        alt: "Render Vista Lateral Sneaker",
        caption: { es: "Render de estudio lateral mostrando la geometría de la suela y panelado del calzado", en: "Lateral studio render showcasing sole geometry and layered paneling" },
        span: "half"
      },
      {
        src: "/uploads/powerkick-render-test.png",
        alt: "Render Test & Iluminación",
        caption: { es: "Prueba de iluminación volumétrica y materiales en Blender", en: "Volumetric lighting and material studio test in Blender" },
        span: "half"
      }
    ]
  },

  "feed-febrero-2026": {
    id: "feed-febrero-2026",
    title: {
      es: "Social Media Feed — Estrategia & Diseño de Posts Febrero 2026",
      en: "Social Media Feed — Strategy & Post Design February 2026"
    },
    subtitle: {
      es: "Diseño gráfico editorial, carruseles educativos, composición visual y dirección de arte para feed de Instagram y redes sociales.",
      en: "Editorial graphic design, educational carousels, visual composition, and art direction for Instagram and social media feed."
    },
    category: "photo",
    categoryLabel: { es: "Edición de Foto & Redes Sociales", en: "Photo Editing & Social Media" },
    tag: { es: "Redes Sociales · Social Media & Feed Design", en: "Social Media · Feed & Carousel Design" },
    client: "Estrategia de Contenido Digital & Social Media",
    year: "2026",
    role: { es: "Diseñador Gráfico, Dirección de Arte & Content Creator", en: "Graphic Designer, Art Director & Content Creator" },
    coverImage: "/uploads/feed-febrero-2026/Feed.jpg",
    techStack: ["Adobe Photoshop", "Adobe Illustrator", "Social Media Design", "Dirección de Arte", "Diseño de Carruseles", "Estrategia Visual", "Composición Tipográfica"],
    industry: { es: "Marketing Digital & Redes Sociales", en: "Digital Marketing & Social Media" },
    overview: {
      es: "Desarrollo integral de la parrilla de contenidos visuales y diseño de publicaciones para redes sociales (Febrero 2026). El proyecto abarca la conceptualización temática, diseño de posts individuales de alto impacto, estructuras de carruseles informativos con jerarquía clara y la armonización cromática global para mantener un feed estético, coherente y orientado a la retención de audiencia.",
      en: "Comprehensive social media visual content plan and post design system (February 2026). The project spans theme conceptualization, high-impact single image posts, structured educational carousel flows with strong visual hierarchy, and cohesive color palette balancing across the entire grid for maximum audience engagement."
    },
    challenge: {
      es: "Mantener una coherencia estética rigurosa a lo largo de 9 módulos temáticos diferentes sin que las publicaciones se sientan monótonas, optimizando los contrastes para lectura rápida en dispositivos móviles y diseñando carruseles que fomenten el deslizamiento continuo y el guardado.",
      en: "Maintaining strict brand consistency and visual balance across 9 distinct content modules while preventing layout fatigue, optimizing text contrast for mobile legibility, and designing engaging carousel progressions that drive saves and shares."
    },
    solution: {
      es: "Se estableció un sistema de retícula flexible con tipografía legible, combinando fotografías tratadas con acentos gráficos y paletas tonales controladas. Se diseñaron 9 bloques de contenido que incluyen piezas únicas y secuencias de carruseles (como 'Tips', casos prácticos y guías paso a paso), integrando un grid panorámico ('Feed.jpg') para verificar el ritmo visual del perfil completo.",
      en: "Formulated a modular grid system with punchy editorial typography, pairing color-graded photography with clean geometric accents. Designed 9 distinct post sets comprising single key visuals and multi-slide carousel sequences, verified through an all-inclusive feed overview to ensure harmonious balance on the profile grid."
    },
    deliverables: {
      es: [
        "Vista panorámica completa del feed del mes (Feed Grid Overview)",
        "9 bloques de publicaciones individuales y carruseles temáticos",
        "Tratamiento de color y retoque fotográfico para Instagram / LinkedIn",
        "Diseño de portadas, diapositivas intermedias y llamadas a la acción (CTAs)",
        "Archivos optimizados en formato 1080x1350px (4:5 vertical) y 1080x1080px"
      ],
      en: [
        "Full monthly feed grid panoramic layout (Feed Grid Overview)",
        "9 distinct post sets including standalone visuals and multi-slide carousels",
        "Selective color grading and photographic retouching for social media",
        "Engaging cover hooks, slide progressions, and call-to-action cards",
        "Optimized master exports in 1080x1350px (4:5 vertical) and 1080x1080px formats"
      ]
    },
    metrics: [
      { label: { es: "Publicaciones / Sets", en: "Post Sets" }, value: "9 Sets" },
      { label: { es: "Piezas Diseñadas", en: "Designed Assets" }, value: "+18 Slides" },
      { label: { es: "Formato", en: "Aspect Ratio" }, value: "Vertical & Cuadrado" },
      { label: { es: "Software", en: "Software" }, value: "Photoshop & Illustrator" }
    ],
    gallery: [
      {
        src: "/uploads/feed-febrero-2026/Feed.jpg",
        alt: "Feed Febrero 2026 — Panorámica del Feed Completo",
        caption: { es: "Vista panorámica del feed completo mostrando la armonía visual de las 9 publicaciones", en: "Panoramic full feed grid view showcasing visual rhythm across all 9 monthly posts" },
        span: "full"
      },
      {
        src: "/uploads/feed-febrero-2026/1/1.jpg",
        alt: "Post Set 1 — Visual Principal",
        caption: { es: "Publicación Set 1: Composición visual y llamada de atención", en: "Post Set 1: High-contrast hook visual composition" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/2/2.jpg",
        alt: "Post Set 2 — Visual Tipográfico",
        caption: { es: "Publicación Set 2: Tipografía de impacto y dirección de arte", en: "Post Set 2: Impact typography and art direction" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/3/3.jpg",
        alt: "Post Set 3 — Slide 1",
        caption: { es: "Publicación Set 3: Portada de carrusel", en: "Post Set 3: Carousel cover slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/3/4.jpg",
        alt: "Post Set 3 — Slide 2",
        caption: { es: "Publicación Set 3: Diapositiva complementaria de carrusel", en: "Post Set 3: Carousel interior slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/4/5.jpg",
        alt: "Post Set 4 — Visual Conceptual",
        caption: { es: "Publicación Set 4: Diseño gráfico conceptual", en: "Post Set 4: Conceptual graphic layout" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/5/6.jpg",
        alt: "Post Set 5 — Carrusel Slide 1",
        caption: { es: "Publicación Set 5: Portada de carrusel educativo", en: "Post Set 5: Educational carousel cover" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/5/7.jpg",
        alt: "Post Set 5 — Carrusel Slide 2",
        caption: { es: "Publicación Set 5: Desarrollo de punto clave", en: "Post Set 5: Key insight carousel slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/5/8.jpg",
        alt: "Post Set 5 — Carrusel Slide 3",
        caption: { es: "Publicación Set 5: Detalle explicativo", en: "Post Set 5: Explanatory carousel slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/5/9.jpg",
        alt: "Post Set 5 — Carrusel Slide 4",
        caption: { es: "Publicación Set 5: Gráfico informativo", en: "Post Set 5: Informative graphic layout" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/5/10.jpg",
        alt: "Post Set 5 — Carrusel Slide 5 (Cierre)",
        caption: { es: "Publicación Set 5: Conclusión y llamada a interactuar", en: "Post Set 5: Carousel takeaway & CTA" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/6/11.jpg",
        alt: "Post Set 6 — Carrusel Guía 1",
        caption: { es: "Publicación Set 6: Portada de secuencia", en: "Post Set 6: Guide sequence cover" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/6/12.jpg",
        alt: "Post Set 6 — Carrusel Guía 2",
        caption: { es: "Publicación Set 6: Paso 1 de secuencia", en: "Post Set 6: Step 1 slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/6/13.jpg",
        alt: "Post Set 6 — Carrusel Guía 3",
        caption: { es: "Publicación Set 6: Paso 2 de secuencia", en: "Post Set 6: Step 2 slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/6/14.jpg",
        alt: "Post Set 6 — Carrusel Guía 4",
        caption: { es: "Publicación Set 6: Paso 3 de secuencia", en: "Post Set 6: Step 3 slide" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/6/15.jpg",
        alt: "Post Set 6 — Carrusel Guía 5",
        caption: { es: "Publicación Set 6: Resumen y cierre", en: "Post Set 6: Summary and action takeaway" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/7/16.jpg",
        alt: "Post Set 7 — Visual Destacado",
        caption: { es: "Publicación Set 7: Composición vertical destacada", en: "Post Set 7: Featured vertical visual" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/8/17.jpg",
        alt: "Post Set 8 — Arte Editorial",
        caption: { es: "Publicación Set 8: Composición artística y contraste", en: "Post Set 8: Artistic composition & high contrast" },
        span: "half"
      },
      {
        src: "/uploads/feed-febrero-2026/9/18.jpg",
        alt: "Post Set 9 — Cierre de Mes",
        caption: { es: "Publicación Set 9: Pieza visual de cierre de mes", en: "Post Set 9: Month wrap-up visual feature" },
        span: "half"
      }
    ]
  },

  "inartiva-social-media": {
    id: "inartiva-social-media",
    title: {
      es: "Inartiva Studio — Social Media & Campañas Landscape",
      en: "Inartiva Studio — Social Media & Landscape Campaigns"
    },
    subtitle: {
      es: "Dirección de arte, diseño de publicaciones en formato panorámico landscape y piezas de captación para estudio creativo.",
      en: "Art direction, landscape panoramic post design, and high-conversion social media assets for creative studio."
    },
    category: "photo",
    categoryLabel: { es: "Edición de Foto & Redes Sociales", en: "Photo Editing & Social Media" },
    tag: { es: "Redes Sociales · Campañas & Landscape Posts", en: "Social Media · Campaigns & Landscape Layouts" },
    client: "Inartiva Studio",
    year: "2025",
    role: { es: "Director de Arte & Diseñador de Redes Sociales", en: "Art Director & Social Media Designer" },
    coverImage: "/uploads/inartiva-social/Post 1.jpg",
    techStack: ["Adobe Photoshop", "Adobe Illustrator", "Social Media Design", "Layout Landscape", "Dirección de Arte", "Branding Digital"],
    industry: { es: "Estudio Creativo, Branding & Redes Sociales", en: "Creative Studio, Branding & Social Media" },
    overview: {
      es: "Serie de publicaciones y piezas promocionales diseñadas para Inartiva Studio en redes sociales. El proyecto explora el formato landscape y composiciones multipanel con un enfoque visual minimalista y contundente, destacando la propuesta de valor del estudio, servicios de diseño web y branding de alto impacto.",
      en: "A focused series of social media campaigns and promotional layouts designed for Inartiva Studio. The project explores panoramic landscape compositions and multi-panel storytelling with a minimalist, high-contrast aesthetic highlighting creative studio services and high-impact brand identity."
    },
    challenge: {
      es: "Transmitir profesionalismo, sofisticación visual y claridad de oferta en formatos horizontales panorámicos y promocionales, manteniendo una jerarquía tipográfica impecable que capture la atención de forma instantánea en feeds saturados.",
      en: "Communicating professionalism, visual sophistication, and distinct service offerings across horizontal panoramic layouts, maintaining tight typographic hierarchy designed for immediate thumb-stopping impact."
    },
    solution: {
      es: "Implementamos una paleta cromática sobria en blanco y negro con acentos tipográficos selectos, cuadrículas asimétricas y uso intencional del espacio negativo para dar protagonismo a los mensajes clave y llamados a la acción.",
      en: "Implemented a refined black-and-white aesthetic with selective typographic accents, asymmetric grid systems, and generous negative space to emphasize key brand messaging and direct response call-to-actions."
    },
    deliverables: {
      es: [
        "Serie completa de publicaciones en formato Landscape panorámico",
        "Piezas promocionales y de lanzamiento de servicios ('Promo 01')",
        "Estructura tipográfica y jerarquía para lectura ágil en mobile",
        "Archivos maestros optimizados para distribución en Instagram y LinkedIn"
      ],
      en: [
        "Full panoramic landscape post series",
        "Promotional service campaign key visuals ('Promo 01')",
        "Typographic hierarchy system optimized for mobile feeds",
        "Master digital assets formatted for Instagram and LinkedIn"
      ]
    },
    metrics: [
      { label: { es: "Formato", en: "Format" }, value: "Landscape & Feed" },
      { label: { es: "Estilo", en: "Style" }, value: "Minimal & Editorial" },
      { label: { es: "Canales", en: "Channels" }, value: "Instagram / LinkedIn" },
      { label: { es: "Software", en: "Software" }, value: "Photoshop & Illustrator" }
    ],
    gallery: [
      {
        src: "/uploads/inartiva-social/Post 1.jpg",
        alt: "Inartiva Landscape Post 1 — Key Visual",
        caption: { es: "Post Landscape 1: Composición de impacto visual y apertura de campaña", en: "Landscape Post 1: High-impact opening campaign visual" },
        span: "full"
      },
      {
        src: "/uploads/inartiva-social/Post 2.jpg",
        alt: "Inartiva Landscape Post 2 — Presentación de Servicios",
        caption: { es: "Post Landscape 2: Arquitectura de servicios y propuesta creativa", en: "Landscape Post 2: Studio services and creative proposition layout" },
        span: "half"
      },
      {
        src: "/uploads/inartiva-social/Post 2 (2).jpg",
        alt: "Inartiva Landscape Post 2 Variante 2",
        caption: { es: "Variante de composición tipográfica y balance de bloques", en: "Typographic composition variant with balanced text blocks" },
        span: "half"
      },
      {
        src: "/uploads/inartiva-social/Post 2 (3).jpg",
        alt: "Inartiva Landscape Post 2 Variante 3",
        caption: { es: "Variante de detalle visual y estructura de llamada a la acción", en: "Detail visual variant with structured call-to-action layout" },
        span: "half"
      },
      {
        src: "/uploads/inartiva-social/Promo-01.jpg",
        alt: "Inartiva Promo 01 — Campaña de Servicios Web",
        caption: { es: "Pieza promocional 'Promo 01' para captación de clientes de desarrollo web", en: "'Promo 01' promotional asset for web development client acquisition" },
        span: "half"
      }
    ]
  }
};

export function getProjectById(id: string): ProjectDetail | undefined {
  return projectsData[id];
}

export function getAdjacentProjects(currentId: string) {
  const keys = Object.keys(projectsData);
  const currentIndex = keys.indexOf(currentId);
  if (currentIndex === -1) return { prev: null, next: null };

  const prevKey = keys[(currentIndex - 1 + keys.length) % keys.length];
  const nextKey = keys[(currentIndex + 1) % keys.length];

  return {
    prev: projectsData[prevKey],
    next: projectsData[nextKey]
  };
}
