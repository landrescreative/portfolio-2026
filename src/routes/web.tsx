import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { projectsData, ProjectDetail } from "@/data/projectsData";
import { Code2, ArrowRight, Sparkles, Server, Layout, ExternalLink, Box, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const Route = createFileRoute("/web")({
  head: () => ({
    meta: [
      { title: "Desarrollo Web & UI/UX — Luis Andrés (LANDRES)" },
      {
        name: "description",
        content:
          "Portafolio especializado en Desarrollo Web Full-Stack, React, Next.js, Webflow, Astro, UI/UX y DevOps Linux por Luis Andrés.",
      },
      { property: "og:title", content: "Desarrollo Web & UI/UX — Luis Andrés" },
      {
        property: "og:description",
        content:
          "Explora plataformas web modernas, tiendas online, interfaces UI/UX en Figma y aplicaciones cloud de alto rendimiento.",
      },
      { property: "og:image", content: "/uploads/art-of-flavors-mockup.webp" },
    ],
  }),
  component: WebPortfolioPage,
});

export function WebPortfolioPage() {
  const { lang, t } = useI18n();

  const [activeTab, setActiveTab] = useState<string>("all");

  const webProjects: ProjectDetail[] = Object.values(projectsData).filter(
    (p) => ["web", "ui", "devops"].includes(p.category)
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
      label: lang === "es" ? "Todo en Web & UI" : "All Web & UI",
      count: webProjects.length,
    },
    {
      key: "web",
      label: lang === "es" ? "Desarrollo Web & Apps" : "Web Dev & Apps",
      count: webProjects.filter((p) => p.category === "web").length,
    },
    {
      key: "ui",
      label: lang === "es" ? "Diseño UI/UX (Figma)" : "UI/UX Design (Figma)",
      count: webProjects.filter((p) => p.category === "ui").length,
    },
    {
      key: "devops",
      label: lang === "es" ? "DevOps & Cloud" : "DevOps & Cloud",
      count: webProjects.filter((p) => p.category === "devops").length,
    },
  ];

  const filteredProjects =
    activeTab === "all"
      ? webProjects
      : webProjects.filter((p) => p.category === activeTab);

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

              {/* Premium Switch Button */}
              <Link
                to="/design"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-ink/15 bg-surface/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-surface hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-canvas">
                  <Box className="size-3" />
                </span>
                <span>{lang === "es" ? "Portafolio 3D & Diseño" : "3D & Design Portfolio"}</span>
                <ArrowUpRight className="size-3 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </Link>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                  <Code2 className="size-3.5" />
                  <span>{lang === "es" ? "Creative Developer · UI/UX · DevOps" : "Creative Developer · UI/UX · DevOps"}</span>
                </div>
                <h1 className="font-serif text-5xl tracking-tight text-ink md:text-7xl lg:text-8xl">
                  {lang === "es" ? "Desarrollo Web & UI/UX" : "Web Dev & UI/UX"}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                  {lang === "es"
                    ? "Plataformas digitales de alto rendimiento creadas con React, Next.js, Webflow, Astro, sistemas de diseño en Figma e infraestructura en servidores Linux."
                    : "High-performance digital platforms crafted with React, Next.js, Webflow, Astro, Figma design systems and Linux server infrastructure."}
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

                      {item.liveUrl && (
                        <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-canvas shadow-sm">
                          {lang === "es" ? "En Vivo" : "Live Site"}
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
                {lang === "es" ? "Disponible para Proyectos · 2026" : "Available for Projects · 2026"}
              </span>
            </div>
            <h2 className="font-serif text-5xl leading-[0.88] tracking-tighter text-balance text-canvas md:text-7xl lg:text-8xl">
              {lang === "es" ? "¿Planeando un sitio web?" : "Planning a web platform?"}
              <br />
              <span className="italic text-accent">
                {lang === "es" ? "Construyámoslo juntos." : "Let's build it together."}
              </span>
            </h2>
            <p className="max-w-2xl text-base font-light leading-relaxed text-pretty text-canvas/70 md:text-lg">
              {lang === "es"
                ? "Escríbeme para cotizar tu sitio web, rediseño UI/UX, plataforma en React/Next.js o infraestructura en la nube."
                : "Message me to discuss your website, UI/UX redesign, React/Next.js platform or cloud infrastructure."}
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
