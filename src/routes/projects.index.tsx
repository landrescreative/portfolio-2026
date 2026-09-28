import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { projectsData, ProjectDetail } from "@/data/projectsData";
import { ArrowRight, Sparkles } from "lucide-react";

type ProjectsSearch = {
  category?: string;
};

export const Route = createFileRoute("/projects/")({
  validateSearch: (search: Record<string, unknown>): ProjectsSearch => {
    return {
      category: typeof search.category === "string" ? search.category : undefined,
    };
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [activeTab, setActiveTab] = useState<string>(
    search.category === "ui" ? "web" : search.category || "all"
  );

  const [allProjects, setAllProjects] = useState<ProjectDetail[]>(
    Object.values(projectsData)
  );

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
  }, [activeTab, allProjects]);

  const categories = [
    {
      key: "web",
      keys: ["web", "ui"],
      label: lang === "es" ? "Diseño UI/UX & Desarrollo Web" : "UI/UX Design & Web Development",
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
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="story-link text-xs font-semibold uppercase tracking-[0.25em] text-muted w-fit"
              >
                {t.projectsPage.backToHome}
              </Link>
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="font-serif text-5xl tracking-tight text-ink md:text-7xl">
                  {t.projectsPage.title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  {t.projectsPage.subtitle}
                </p>
              </div>

              {/* Filter Tabs - Modern Brutalist Segmented Filter */}
              <div className="w-full lg:w-auto">
                <div className="flex max-w-full items-center gap-1.5 overflow-x-auto p-1 no-scrollbar rounded-xl border border-ink/10 bg-surface/80 shadow-sm backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("all");
                      navigate({ search: { category: undefined } });
                    }}
                    className={`group relative flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                      activeTab === "all"
                        ? "bg-ink text-canvas shadow-sm"
                        : "text-muted hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full transition-colors ${
                        activeTab === "all" ? "bg-accent" : "bg-muted/40 group-hover:bg-accent"
                      }`}
                    />
                    <span>{t.projectsPage.tabs.all}</span>
                  </button>

                  {categories.map((cat) => {
                    const isActive = activeTab === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setActiveTab(cat.key);
                          navigate({ search: { category: cat.key } });
                        }}
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
            if (activeTab !== "all" && activeTab !== cat.key && !cat.keys.includes(activeTab)) return null;

            const items = allProjects.filter(
              (item) => cat.keys.includes(item.category)
            );

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
                    {items.length} {items.length === 1 ? (lang === "es" ? "Proyecto" : "Project") : (lang === "es" ? "Proyectos" : "Projects")}
                  </span>
                </div>

                {/* Projects Grid for this Category */}
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const titleStr = typeof item.title === "object" ? (item.title[lang] || item.title.es) : item.title;
                    const subtitleStr = typeof item.subtitle === "object" ? (item.subtitle[lang] || item.subtitle.es) : item.subtitle;
                    const tagStr = typeof item.tag === "object" ? (item.tag[lang] || item.tag.es) : item.tag;
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
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[min(1vw,14px)] bg-surface ring-1 ring-ink/5">
                            <img
                              src={item.coverImage}
                              alt={titleStr}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                            />
                            <div className="absolute left-3 top-3 rounded-full bg-canvas/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink backdrop-blur-sm">
                              {catLabelStr}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2.5 pt-4">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                              {tagStr}
                            </span>
                            <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-1">
                              {titleStr}
                            </h3>
                            <p className="line-clamp-2 text-sm font-normal leading-relaxed text-ink/75">
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

      {/* Footer Contact */}
      <footer id="contact" className="rounded-t-[min(2.5vw,36px)] bg-ink px-6 pb-12 pt-32 text-canvas shadow-2xl">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-canvas/15 bg-canvas/5 px-4 py-1.5 backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-canvas/70">
                  {t.contact.badge}
                </span>
              </div>
              <h2 className="font-serif text-5xl leading-[0.88] tracking-tighter text-balance text-canvas md:text-7xl lg:text-8xl">
                {t.contact.titleLine1}
                <br />
                <span className="italic text-accent">{t.contact.titleLine2}</span>
              </h2>
              <p className="max-w-2xl text-base font-light leading-relaxed text-pretty text-canvas/70 md:text-lg">
                {t.contact.subtitle}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
