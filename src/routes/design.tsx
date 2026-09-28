import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { projectsData, ProjectDetail } from "@/data/projectsData";
import { ArrowRight, Sparkles, Layers, Box, Film, Camera, ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/design")({
  head: () => ({
    meta: [
      { title: "Diseño, 3D & Motion Graphics — Luis Andrés (LANDRES)" },
      {
        name: "description",
        content:
          "Portafolio especializado en Modelado 3D, Motion Graphics, Dirección de Arte, VFX, Edición y Social Media por Luis Andrés.",
      },
      { property: "og:title", content: "Diseño, 3D & Motion Graphics — Luis Andrés" },
      {
        property: "og:description",
        content:
          "Explora proyectos de animación 3D, Cinema 4D, Blender, gráficos en movimiento y piezas visuales para marcas globales.",
      },
      { property: "og:image", content: "/uploads/art-toy-conejo-cover.jpg" },
    ],
  }),
  component: DesignPortfolioPage,
});

export function DesignPortfolioPage() {
  const { lang, t } = useI18n();

  const [activeTab, setActiveTab] = useState<string>("all");

  const designProjects: ProjectDetail[] = Object.values(projectsData).filter(
    (p) => ["3d", "animation", "photo"].includes(p.category)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    const timer = setTimeout(() => {
      elements.forEach((el) => el.classList.add("is-visible"));
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeTab]);

  const categories = [
    {
      key: "all",
      label: lang === "es" ? "Todo en Diseño & 3D" : "All Design & 3D",
      count: designProjects.length,
    },
    {
      key: "3d",
      label: lang === "es" ? "Modelado 3D & Renders" : "3D Modeling & Renders",
      count: designProjects.filter((p) => p.category === "3d").length,
    },
    {
      key: "animation",
      label: lang === "es" ? "Motion Graphics & VFX" : "Motion Graphics & VFX",
      count: designProjects.filter((p) => p.category === "animation").length,
    },
    {
      key: "photo",
      label: lang === "es" ? "Social Media & Foto" : "Social Media & Photo",
      count: designProjects.filter((p) => p.category === "photo").length,
    },
  ];

  const filteredProjects =
    activeTab === "all"
      ? designProjects
      : designProjects.filter((p) => p.category === activeTab);

  return (
    <main className="grain bg-canvas text-ink min-h-screen">
      {/* Header Section */}
      <section className="px-6 pb-12 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-ink/10 pb-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/"
                className="story-link text-xs font-semibold uppercase tracking-[0.25em] text-muted w-fit"
              >
                {lang === "es" ? "← Inicio" : "← Home"}
              </Link>

              {/* Quick switch badge */}
              <Link
                to="/web"
                className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/80 px-4 py-1.5 text-xs font-medium text-muted hover:border-accent hover:text-ink transition-all"
              >
                <span>{lang === "es" ? "¿Buscas desarrollo web?" : "Looking for Web Dev?"}</span>
                <span className="text-accent font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {lang === "es" ? "Ver portafolio Web & UI" : "View Web & UI portfolio"} →
                </span>
              </Link>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                  <Box className="size-3.5" />
                  <span>{lang === "es" ? "3D Artist · Motion · Visual Arts" : "3D Artist · Motion · Visual Arts"}</span>
                </div>
                <h1 className="font-serif text-5xl tracking-tight text-ink md:text-7xl lg:text-8xl">
                  {lang === "es" ? "Diseño, 3D & Motion" : "Design, 3D & Motion"}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  {lang === "es"
                    ? "Selección curada de modelado 3D, animación, postproducción audiovisual, VFX y contenido para redes sociales con alto estándar estético."
                    : "Curated selection of 3D modeling, animation, video post-production, VFX and social media assets with high aesthetic standards."}
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="w-full lg:w-auto">
                <div className="flex max-w-full items-center gap-1.5 overflow-x-auto p-1 no-scrollbar rounded-xl border border-ink/10 bg-surface/80 shadow-sm backdrop-blur-md">
                  {categories.map((cat) => {
                    const isActive = activeTab === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setActiveTab(cat.key)}
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

      {/* Projects Grid - 2 Columns */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
            {filteredProjects.map((item) => {
              const titleStr = typeof item.title === "object" ? (item.title[lang] || item.title.es) : item.title;
              const subtitleStr = typeof item.subtitle === "object" ? (item.subtitle[lang] || item.subtitle.es) : item.subtitle;
              const catLabelStr = typeof item.categoryLabel === "object" ? (item.categoryLabel[lang] || item.categoryLabel.es) : item.categoryLabel;

              return (
                <Link
                  key={item.id}
                  to="/projects/$projectId"
                  params={{ projectId: item.id }}
                  data-cursor="project"
                  className="group flex flex-col justify-between cursor-pointer"
                >
                  <article className="flex flex-col justify-between h-full">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/5 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                      <img
                        src={item.coverImage}
                        alt={titleStr}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-canvas/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-ink backdrop-blur-md shadow-sm">
                        {catLabelStr}
                      </div>

                      {item.has3DViewer && (
                        <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-canvas shadow-sm">
                          {lang === "es" ? "3D Interactivo" : "Interactive 3D"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5 pt-5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted">{item.year}</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted group-hover:text-accent transition-colors">
                          {item.client}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-1 font-medium">
                        {titleStr}
                      </h3>
                      <p className="line-clamp-2 text-base font-light leading-relaxed text-ink/80 md:text-lg">
                        {subtitleStr}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.techStack?.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs text-ink/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <footer id="contact" className="rounded-t-[min(2.5vw,36px)] bg-ink px-6 pb-12 pt-32 text-canvas shadow-2xl">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-canvas/15 bg-canvas/5 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-canvas/70">
                {lang === "es" ? "Comisiones Abiertas · 2026" : "Open for Commissions · 2026"}
              </span>
            </div>
            <h2 className="font-serif text-5xl leading-[0.88] tracking-tighter text-balance text-canvas md:text-7xl lg:text-8xl">
              {lang === "es" ? "¿Tienes una idea visual?" : "Have a visual idea?"}
              <br />
              <span className="italic text-accent">
                {lang === "es" ? "Hagámosla realidad." : "Let's make it real."}
              </span>
            </h2>
            <p className="max-w-2xl text-base font-light leading-relaxed text-pretty text-canvas/70 md:text-lg">
              {lang === "es"
                ? "Contáctame para proyectos de modelado 3D, animación de marca, motion graphics o postproducción audiovisual."
                : "Get in touch for 3D modeling, brand animations, motion graphics, or video post-production."}
            </p>

            <div className="w-full max-w-2xl text-left">
              <ContactForm />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
