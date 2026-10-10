import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n, tx } from "@/lib/i18n";
import { projectsData, ProjectDetail } from "@/data/projectsData";
import { ArrowRight, Sparkles, Code2, Box, ArrowUpRight } from "lucide-react";
import { ContactSection } from "@/components/ContactSection";
import { buildSeo, type Locale } from "@/lib/seo";

type ProjectsSearch = {
  category?: string;
};

const PROJECTS_SEO = {
  es: {
    title: "Galería de Proyectos · Luis Andrés (LANDRES)",
    description:
      "Explora la colección completa de proyectos: desarrollo web, diseño de interfaces UI/UX, modelado 3D, animación y infraestructura Linux en la nube.",
  },
  en: {
    title: "Project Gallery · Luis Andrés (LANDRES)",
    description:
      "Explore the full collection of projects: web development, UI/UX interface design, 3D modeling, animation and Linux cloud infrastructure.",
  },
} as const;

export const Route = createFileRoute("/$lang/projects/")({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    return {
      category: typeof search.category === "string" ? search.category : undefined,
    };
  },
  head: ({ params }) => {
    const lang = params.lang as Locale;
    return buildSeo({ lang, path: "/projects", type: "website", ...PROJECTS_SEO[lang] });
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [activeTab, setActiveTab] = useState<string>(
    search.category === "ui" ? "web" : search.category || "all",
  );

  const [allProjects, setAllProjects] = useState<ProjectDetail[]>(Object.values(projectsData));

  useEffect(() => {
    if (search.category) {
      setActiveTab(search.category === "ui" ? "web" : search.category);
    }
  }, [search.category]);

  useEffect(() => {
    setAllProjects(Object.values(projectsData));
  }, []);

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
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeTab, allProjects]);

  const categories = [
    {
      key: "web",
      keys: ["web", "ui"],
      label: tx(lang, "Diseño UI/UX & Desarrollo Web", "UI/UX Design & Web Development"),
    },
    { key: "3d", keys: ["3d"], label: t.projectsPage.tabs["3d"] },
    { key: "animation", keys: ["animation"], label: t.projectsPage.tabs.animation },
    { key: "photo", keys: ["photo"], label: t.projectsPage.tabs.photo },
    { key: "devops", keys: ["devops"], label: t.projectsPage.tabs.devops },
  ];
  return (
    <main className="grain bg-canvas text-ink min-h-screen">
      {/* Header Section */}
      <section className="px-6 pb-12 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-ink/10 pb-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/$lang"
                params={{ lang }}
                className="story-link text-xs font-semibold uppercase tracking-[0.25em] text-muted w-fit"
              >
                {t.projectsPage.backToHome}
              </Link>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/$lang/web"
                  params={{ lang }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-ink/15 bg-surface/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-surface hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-canvas">
                    <Code2 className="size-3" />
                  </span>
                  <span>{t.ui.webPortfolio}</span>
                  <ArrowUpRight className="size-3 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>

                <Link
                  to="/$lang/design"
                  params={{ lang }}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-ink/15 bg-surface/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink shadow-sm backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-surface hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-canvas">
                    <Box className="size-3" />
                  </span>
                  <span>{t.ui.designPortfolio}</span>
                  <ArrowUpRight className="size-3 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="font-serif text-5xl tracking-tight text-ink md:text-7xl">
                  {t.projectsPage.title}
                </h1>
              </div>

              {/* Filter Tabs - Modern Brutalist Segmented Filter */}
              <div className="w-full lg:w-auto">
                <div className="flex max-w-full items-center gap-2 overflow-x-auto no-scrollbar lg:flex-wrap lg:overflow-visible">
                  {[{ key: "all", label: t.projectsPage.tabs.all }, ...categories].map((cat) => {
                    const isActive = activeTab === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setActiveTab(cat.key);
                          navigate({
                            to: "/$lang/projects",
                            params: { lang },
                            search: { category: cat.key === "all" ? undefined : cat.key },
                          });
                        }}
                        className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                          isActive
                            ? "border-ink bg-ink font-semibold text-canvas shadow-md"
                            : "border-ink/10 bg-surface/70 text-muted backdrop-blur-md hover:border-ink/25 hover:bg-surface hover:text-ink"
                        }`}
                      >
                        {isActive && (
                          <span className="relative flex size-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                          </span>
                        )}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grouped Category Sections / Filtered Grid */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl">
          {categories.map((cat, index) => {
            if (activeTab !== "all" && activeTab !== cat.key && !cat.keys.includes(activeTab))
              return null;

            const items = allProjects.filter((item) => cat.keys.includes(item.category));

            if (items.length === 0) return null;

            return (
              <div key={cat.key} className="mb-24 last:mb-0">
                {/* Category Header */}
                <div className="mb-10 flex items-baseline justify-between border-b border-ink/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl italic font-medium text-accent">
                      0{index + 1}
                    </span>
                    <h2 className="font-serif text-2xl tracking-tight text-ink md:text-3xl">
                      {cat.label}
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted">
                    {items.length} {items.length === 1 ? t.ui.project : t.ui.projects}
                  </span>
                </div>

                {/* Projects Grid for this Category - 2 Columns for Large Visual Impact */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
                  {items.map((item) => {
                    const titleStr =
                      typeof item.title === "object"
                        ? item.title[lang] || item.title.es
                        : item.title;
                    const subtitleStr =
                      typeof item.subtitle === "object"
                        ? item.subtitle[lang] || item.subtitle.es
                        : item.subtitle;
                    const catLabelStr =
                      typeof item.categoryLabel === "object"
                        ? item.categoryLabel[lang] || item.categoryLabel.es
                        : item.categoryLabel;

                    return (
                      <Link
                        key={item.id}
                        to="/$lang/projects/$projectId"
                        params={{ lang, projectId: item.id }}
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
                          </div>

                          <div className="flex flex-col gap-2.5 pt-5">
                            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-1 font-medium">
                              {titleStr}
                            </h3>
                            <p className="line-clamp-2 text-base font-light leading-relaxed text-ink/80 md:text-lg">
                              {subtitleStr}
                            </p>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <ContactSection
        badge={t.ui.availableForProjects2026}
        titleLine1={tx(lang, "¿Te gustó algún proyecto?", "Liked a project?")}
        titleLine2={tx(lang, "Hagamos el tuyo.", "Let's build yours.")}
        subtitle={tx(
          lang,
          "Cuéntame tu idea y te propongo el mejor camino: diseño UI/UX, desarrollo web, 3D y motion o infraestructura en la nube.",
          "Tell me your idea and I'll suggest the best path: UI/UX design, web development, 3D and motion, or cloud infrastructure.",
        )}
        formContainerClassName="w-full max-w-2xl text-left"
      />
    </main>
  );
}
