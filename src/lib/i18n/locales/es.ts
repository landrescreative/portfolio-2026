import { Translations } from "./en";

export const es: Translations = {
  nav: {
    work: "Trabajo",
    projects: "Proyectos",
    services: "Servicios",
    testimonials: "Testimonios",
    about: "Sobre Mí",
    contact: "Contacto",
    cv: "CV / Resumé",
  },
  hero: {
    name: "Luis Andrés",
    role: "Desarrollador Creativo & Diseñador UI/UX",
    available: "Disponible para trabajar",
    selectedWorks: "Proyectos Seleccionados — 2026",
    titleLine1: "Hey, soy",
    titleLine2: "Alex.",
    downloadCv: "Descargar CV",
    exploreProjects: "Explorar Proyectos",
    bioPart1:
      "Diseñador UI/UX y Desarrollador Web enfocado en React, Next.js, Webflow, Astro, WordPress y ",
    bioHighlight: "DevOps & SysAdmin Linux",
    bioPart2: " para convertir ideas en productos digitales rápidos y de alta conversión.",
    experienceLabel: "Experiencia",
    experienceValue: "6 Años",
    locationLabel: "Ubicación",
    locationValue: "Remoto · Todo el mundo",
  },
  work: {
    title: "Proyectos Destacados",
    counter: "001 — 004",
    featuredBadge: "Destacado",
    vitreousTitle: "Next Era Developments",
    vitreousTag: "Diseño UI/UX · Desarrollo Web",
    nexusTitle: "VIVAVIA",
    nexusTag: "Diseño UI/UX · Web de Agencia de Viajes",
    ecorceTitle: "VeraVetalize",
    ecorceTag: "Diseño UI/UX · Hero Section Cosmética",
    monolithTitle: "Scoop Doggy Dog",
    monolithTag: "Diseño UI/UX · Marca y Sitio Web",
    tonalaTitle: "Casa Tonalá",
    tonalaTag: "3D · Identidad & Producción de Video",
    viewAllProjects: "Ver galería completa de proyectos →",
  },
  projectsPage: {
    backToHome: "← Volver al Inicio",
    title: "Galería de Proyectos",
    subtitle:
      "Explora la colección completa de desarrollo web, diseño de interfaces UI/UX, animación 3D e infraestructura en la nube Linux.",
    searchPlaceholder: "Buscar proyectos por nombre, cliente, tecnología o disciplina...",
    filterByTech: "Filtrar por tecnología:",
    allTechs: "Todas las Tecnologías",
    noResults: "No se encontraron proyectos con ese criterio de búsqueda.",
    resetFilters: "Restablecer filtros",
    tabs: {
      all: "Todos los Proyectos",
      web: "Diseño UI/UX & Web",
      ui: "Diseño UI/UX",
      "3d": "3D & Modelado",
      animation: "Animación / VFX / Postproducción",
      photo: "Edición de Foto & Redes Sociales",
      devops: "DevOps & Nube",
    },
    items: [
      {
        id: "next-era",
        title: "Next Era Developments",
        category: "web",
        categoryLabel: "Desarrollo Web",
        tag: "Diseño UI/UX · Desarrollo Web",
        description:
          "Plataforma inmobiliaria moderna construida con Next.js y Webflow enfocada en la presentación de bienes raíces.",
        image: "workVitreous",
      },
      {
        id: "vivavia",
        title: "Agencia de Viajes VIVAVIA",
        category: "ui",
        categoryLabel: "Diseño UI/UX",
        tag: "UI/UX · Plataforma de Viajes",
        description:
          "Experiencia intuitiva de reservación e identidad visual para una agencia internacional de viajes.",
        image: "workNexus",
      },
      {
        id: "veravetalize",
        title: "VeraVetalize Cosmética",
        category: "web",
        categoryLabel: "Desarrollo Web",
        tag: "Diseño Web · Experiencia Hero",
        description:
          "Sección hero editorial de alto impacto y exhibición de productos para una marca premium de cosméticos.",
        image: "workEditorial",
      },
      {
        id: "scoop-doggy",
        title: "Scoop Doggy Dog",
        category: "ui",
        categoryLabel: "Diseño UI/UX",
        tag: "Branding · UI/UX",
        description:
          "Identidad visual completa y servicio digital de reservaciones para empresa de limpieza de mascotas.",
        image: "workBrutalist",
      },
      {
        id: "casa-tonala",
        title: "Casa Tonalá Marca y Video",
        category: "animation",
        categoryLabel: "Animación / VFX / Postproducción",
        tag: "Animación · Producción de Video",
        description:
          "Producción de video artístico y animaciones en movimiento reflejando la autenticidad de la marca.",
        image: "workVitreous",
      },
      {
        id: "linux-sysadmin",
        title: "Infraestructura de Servidores Linux",
        category: "devops",
        categoryLabel: "DevOps & Nube",
        tag: "SysAdmin · NGINX / Docker",
        description:
          "Despliegue personalizado de servidores Linux, seguridad SSL, proxy inverso NGINX y monitoreo continuo.",
        image: "workEditorial",
      },
      {
        id: "art-toy-conejo",
        title: "Art Toy Conejo — Escultura & Personaje 3D",
        category: "3d",
        categoryLabel: "3D & Modelado",
        tag: "Modelado 3D · Art Toy & Escultura Digital",
        description:
          "Diseño de personaje, modelado 3D en Blender y renders de estudio para un Art Toy coleccionable primaveral.",
        image: "/uploads/art-toy-conejo-cover.jpg",
      },
    ],
  },
  projectDetailPage: {
    backToGallery: "Volver a Galería de Proyectos",
    clientLabel: "Cliente",
    roleLabel: "Rol / Servicio",
    yearLabel: "Año",
    liveSite: "Ver Sitio Web",
    privateProject: "Proyecto Privado",
    techStackLabel: "Tecnologías & Herramientas:",
    overviewLabel: "Visión General",
    challengeLabel: "El Desafío",
    solutionLabel: "La Solución",
    deliverablesLabel: "Entregables Clave",
    metricsLabel: "Resultados e Impacto",
    galleryLabel: "Galería Visual & Detalles",
    prevProject: "Proyecto Anterior",
    nextProject: "Siguiente Proyecto",
    playVideo: "Reproducir Video del Proyecto",
    notFoundTitle: "Proyecto No Encontrado",
    notFoundSubtitle: "El proyecto que buscas no existe o ha sido movido.",
    backToProjects: "Volver a Proyectos",
  },
  ticker: {
    webgl: "React & Next.js",
    visualIdentity: "Diseño UI/UX",
    reactjs: "TypeScript",
    motionDesign: "DevOps & Linux",
    cinema4d: "Webflow & Framer",
    interactiveUX: "Astro & WordPress",
    threejs: "Figma",
    designSystems: "GoHighLevel",
  },
  services: {
    title: "Servicios",
    subtitle: "Mis Especialidades",
    items: [
      {
        number: "01",
        title: "Diseño Web | Diseño UI",
        tagline: "Diseñamos tu sitio web.",
        description:
          "Creación de interfaces estéticas, funcionales y adaptadas a la identidad de tu marca para cautivar a tus clientes.",
        deliverables: [
          "Diseño en Figma",
          "Sistemas de Diseño",
          "Prototipado Interactivo",
          "Responsive UI",
        ],
      },
      {
        number: "02",
        title: "Desarrollo Web",
        tagline: "Lanzamos y mantenemos tu sitio web.",
        description:
          "Programación frontend y backend rápida, segura y optimizada para buscadores (SEO) y alta conversión.",
        deliverables: [
          "React / Next.js / Astro",
          "Webflow & Framer",
          "SEO & Velocidad WPO",
          "Mantenimiento Nube",
        ],
      },
      {
        number: "03",
        title: "Diseño UX",
        tagline: "Te guiamos a crear un producto exitoso.",
        description:
          "Investigación, arquitectura de información y flujos de usuario optimizados para garantizar la mejor experiencia.",
        deliverables: [
          "Arquitectura de Información",
          "Mapas de Flujo de Usuario",
          "Optimización CRO",
          "Pruebas de Usabilidad",
        ],
      },
      {
        number: "04",
        title: "3D & Motion Graphics",
        tagline: "Damos vida y dimensión visual a tu marca.",
        description:
          "Animación 3D, gráficos en movimiento y postproducción de video para destacar sobre la competencia.",
        deliverables: [
          "Modelado 3D & Cinema 4D",
          "Gráficos en Movimiento",
          "Postproducción de Video",
          "WebGL & Three.js",
        ],
      },
    ],
  },
  showreel: {
    badge: "Showreel · Video de Introducción",
    title: "Mi Proceso & Trabajo en Movimiento",
    subtitle:
      "Una mirada rápida a mis proyectos de desarrollo web, diseño de interfaces UI/UX, gráficos en movimiento y producciones 3D.",
    playLabel: "Reproducir Video de Presentación",
  },
  testimonials: {
    title: "Testimonios de Clientes",
    subheader: "Opiniones & Valoraciones de Clientes",
    items: [
      {
        name: "Romina Medina",
        role: "Diseñadora & Emprendedora Digital",
        country: "AR",
        tag: "UI/UX & Migración Full-Stack",
        content:
          "Eficiencia Senior y Migración Impecable. No es fácil encontrar a alguien que conecte el diseño UI/UX con un desarrollo web full-stack tan prolijo. Luis realizó la migración de mi sitio web con una limpieza técnica admirable; todo funciona con una velocidad y fluidez asombrosas.",
      },
      {
        name: "NAXINE",
        role: "Founder & CEO en NAXINE",
        country: "ES",
        tag: "Plataforma Web SaaS & Marketplace",
        content:
          "Excelente experiencia trabajando con Luis. Ha desarrollado una plataforma compleja con un diseño impecable y una estructura técnica muy sólida. Su nivel de conocimiento, profesionalidad y compromiso han sido excepcionales desde el primer día.",
      },
      {
        name: "TekSolutionz",
        role: "Director de Tecnología @ TekSolutionz",
        country: "US",
        tag: "Desarrollo Web & Custom Builders",
        content:
          "Luis did an amazing job. His attention to detail and fluency is unsurpassed. Extremely professional customer service and exceptional quality of delivery. Looking forward to continuing to work with him. Thank you again.",
      },
      {
        name: "Hector P.",
        role: "Project Manager",
        country: "US",
        tag: "Desarrollo Web & Performance",
        content:
          "Increíble trabajo y entrega rápida. Exactamente según lo diseñado. Luis demostró gran profesionalismo, velocidad y excelente dominio técnico tanto en código como en inglés fluido.",
      },
      {
        name: "Marina González",
        role: "Fundadora de Casa Tonalá",
        country: "MX",
        tag: "3D & Motion Graphics",
        content:
          "Me encantó el video que hizo. Entendió justo lo que quería transmitir y lo convirtió en algo que se siente auténtico y profesional a la vez. Súper fácil trabajar con él, te escucha y aporta muy buenas ideas.",
      },
      {
        name: "Kati Caro",
        role: "Creative Specialist",
        country: "GB",
        tag: "Diseño Web & Branding",
        content:
          "Desde un inicio entendió lo que quería, es muy profesional en lo que hace y entrega con una calidad impecable. Lo recomiendo mucho.",
      },
      {
        name: "Beatriz Cruz",
        role: "Fundadora de Next Era Developments",
        country: "ES",
        tag: "Rediseño Web Corporativo",
        content:
          "Nuestro sitio anterior ya se sentía viejo y no nos representaba. Luis lo transformó por completo: ahora se ve moderno, claro y mucho más atractivo. Supo darle una nueva vida sin perder nuestra esencia.",
      },
      {
        name: "Slain84",
        role: "Emprendedor Digital",
        country: "ES",
        tag: "Desarrollo Web & Optimización",
        content:
          "Es un excelente profesional y se entrega al máximo a que el proyecto salga lo mejor posible. Comunicación impecable y soluciones rápidas durante todo el desarrollo.",
      },
    ],
  },
  studio: {
    label: "Sobre Mí",
    experienceYears: "6 Años de Experiencia",
    moreAboutMe: "Conoce mi trayectoria y experiencia →",
    statementPart1:
      "Soluciones digitales de alto impacto construidas con precisión técnica, interfaces intuitivas e ",
    statementHighlight: "infraestructura confiable en la nube.",
    devLabel: "Desarrollo Web & Frontend",
    devCopy:
      "React, Next.js, TypeScript, Astro, Webflow, Framer y WordPress — diseñados para velocidad, SEO y conversión.",
    interfaceLabel: "Diseño & UI/UX",
    interfaceCopy:
      "Diseño de producto e interfaz en Figma enfocados en claridad, sistemas de diseño y flujos de usuario orientados a conversión.",
    motionLabel: "DevOps & SysAdmin Linux",
    motionCopy:
      "Administración de servidores Linux, despliegue automatizado de aplicaciones, mantenimiento y monitoreo para alta disponibilidad.",
  },
  aboutPage: {
    backToHome: "← Volver al Inicio",
    title: "Sobre Mí y Mi Trayectoria",
    subtitle:
      "Diseñador UI/UX, Desarrollador Web Creativo y Especialista en DevOps Linux con más de 6 años de experiencia creando soluciones digitales de alto impacto.",
    storyTitle: "Mi Historia y Enfoque",
    storyP1:
      "Soy diseñador UI/UX y desarrollador web con experiencia en WordPress, Webflow, React, Next.js, Node.js, Expo, Astro, Framer y GHL (GoHighLevel). Trabajo tanto con sitios estáticos como con plataformas CMS y aplicaciones web modernas, adaptándome según las necesidades del proyecto.",
    storyP2:
      "Además del desarrollo frontend, me especializo en DevOps y SysAdmin con enfoque en servidores Linux, proxy NGINX, despliegue automatizado, mantenimiento y monitoreo en la nube. Esto me permite no solo diseñar y programar, sino garantizar que cada proyecto esté en línea, sea ultra rápido, seguro y funcione sin errores.",
    experienceTitle: "Experiencia Laboral",
    trustedSubtitle:
      "Estas empresas han confiado en mis servicios. Apasionados de crear conexiones con múltiples empresas.",
    partnerCta: "¡Hay que asociarnos!",
    experiences: [
      {
        role: "Programador Web Full Stack",
        company: "NEEXIS",
        location: "España",
        period: "2026 — Presente",
        description:
          "Desarrollador web full stack enfocado en la creación y optimización de aplicaciones y plataformas web escalables.",
        achievements: [
          "Desarrollo frontend y backend de soluciones digitales de alta eficiencia.",
          "Integración de sistemas y optimización de arquitectura web.",
        ],
      },
      {
        role: "Web Designer & SEO Manager",
        company: "CORNERSTONE MEDIA",
        location: "USA",
        period: "2024 — 2026",
        description:
          "Encargado de planear, diseñar y configurar sitios web para múltiples clientes, con enfoque en la experiencia del usuario, SEO, obtención de leads y conversiones.",
        achievements: [
          "Diseño de sitios web estratégicos orientados a la conversión y captación de clientes.",
          "Estrategias de optimización SEO técnica y experiencia de usuario (UX).",
        ],
      },
      {
        role: "Diseñador y Desarrollador Web",
        company: "FREELANCE",
        location: "Remoto",
        period: "2020 — Presente",
        description:
          "Durante estos años he trabajado en proyectos de diseño web, desarrollo web y diseño gráfico enfocado mayormente a social media.",
        achievements: [
          "Diseño e implementación de identidades visuales y gráficos para redes sociales.",
          "Desarrollo web a la medida para clientes y negocios independientes.",
        ],
      },
    ],
    valuesTitle: "Valores Fundamentales y Filosofía",
    values: [
      {
        title: "Claridad Centrada en el Usuario",
        description:
          "Cada decisión de diseño nace de comprender profundamente las necesidades y objetivos de los usuarios.",
      },
      {
        title: "Simplicidad y Elegancia",
        description:
          "Las mejores soluciones eliminan la complejidad, convirtiendo ideas avanzadas en interfaces intuitivas y limpias.",
      },
      {
        title: "Aprendizaje Continuo",
        description:
          "Evolución constante adaptándome a nuevos frameworks, prácticas DevOps y tecnologías emergentes.",
      },
      {
        title: "Compromiso de Inicio a Fin",
        description:
          "Desde el diseño de píxel perfecto en Figma hasta la infraestructura en servidores Linux, garantizando un producto sólido.",
      },
    ],
  },
  contact: {
    tagline: "Trabajemos juntos",
    badge: "Disponible · 2026",
    titleLine1: "Construyamos algo",
    titleLine2: "excepcional juntos.",
    subtitle:
      "¿Tienes un proyecto en mente, necesitas una aplicación web personalizada o quieres consultar sobre infraestructura DevOps Linux? Envía un mensaje a continuación o escríbeme directamente.",
    nameLabel: "Tu Nombre",
    namePlaceholder: "Juan Pérez",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "juan@empresa.com",
    serviceLabel: "Estoy interesado en...",
    services: {
      web: "Desarrollo Web",
      ui: "Diseño UI/UX",
      devops: "DevOps y Nube",
      other: "Otro / Consulta",
    },
    messageLabel: "Detalles del Proyecto",
    messagePlaceholder: "Cuéntame sobre los objetivos, plazos y requerimientos de tu proyecto...",
    submitBtn: "Enviar Mensaje →",
    submittingBtn: "Enviando Mensaje...",
    whatsappBtn: "Chatear por WhatsApp",
    successMessage: "¡Gracias! Tu mensaje ha sido enviado exitosamente. Te responderé en breve.",
    directEmailLabel: "O comunícate directamente",
    emailCopied: "¡Dirección de correo copiada al portapapeles!",
    freeCallBadge:
      "La primera consulta o videollamada es 100% gratuita para analizar tu negocio o proyecto.",
    copyright: "© 2026 Luis Andrés — Todos los derechos reservados",
  },
  projectDetailPage: {
    backToGallery: "Volver a Galería de Proyectos",
    clientLabel: "Cliente",
    roleLabel: "Rol / Servicio",
    yearLabel: "Año",
    liveSite: "Ver Sitio Web",
    privateProject: "Proyecto Privado",
    techStackLabel: "Tecnologías & Herramientas:",
    overviewLabel: "Visión General",
    challengeLabel: "El Desafío",
    solutionLabel: "La Solución",
    deliverablesLabel: "Entregables Clave",
    metricsLabel: "Resultados e Impacto",
    galleryLabel: "Galería Visual & Detalles",
    prevProject: "Proyecto Anterior",
    nextProject: "Siguiente Proyecto",
    relatedTitle: "Proyectos Relacionados",
    exploreMore: "Explora más proyectos en esta disciplina",
    playVideo: "Reproducir Video del Proyecto",
    notFoundTitle: "Proyecto No Encontrado",
    notFoundSubtitle: "El proyecto que buscas no existe o ha sido movido.",
    backToProjects: "Volver a Proyectos",
  },
};
