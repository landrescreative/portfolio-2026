import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { projectsData, ProjectDetail } from "@/data/projectsData";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ContactForm } from "@/components/ContactForm";
import { ServicesSection } from "@/components/ServicesSection";
import { ShowreelSection } from "@/components/ShowreelSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { HeroCanvas } from "@/components/HeroCanvas";

export const Route = createFileRoute("/")({
  component: Index,
});


const archive = [
  { title: "Halcyon Type Specimen", discipline: "Web · Editorial", year: "2024" },
  { title: "Meridian Icon Set", discipline: "UI · Iconography", year: "2024" },
  { title: "Terrazzo Material Study", discipline: "3D · Shader R&D", year: "2023" },
  { title: "Field Notes App", discipline: "Product · Mobile", year: "2023" },
  { title: "Objet Volumetric Series", discipline: "3D · Print", year: "2023" },
  { title: "Kestrel Brand System", discipline: "Identity · Web", year: "2022" },
  { title: "Prism Portfolio Engine", discipline: "Open Source · Dev", year: "2022" },
  { title: "Ondas Generative Poster", discipline: "Motion · WebGL", year: "2021" },
  { title: "Lumen Analytics Suite", discipline: "UI · Data Viz", year: "2020" },
  { title: "Studio Reel v01", discipline: "3D · Motion", year: "2019" },
];

const tickerItems = [
  { label: "WebGL", italic: true },
  { label: "Visual Identity", italic: false },
  { label: "React.js", italic: true },
  { label: "Motion Design", italic: false },
  { label: "Cinema 4D", italic: true },
  { label: "Interactive UX", italic: false },
  { label: "Three.js", italic: true },
  { label: "Design Systems", italic: false },
];

function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function HeroSection() {
  const { t, lang } = useI18n();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="top"
      className="relative px-6 pb-16 pt-24 md:pb-24 md:pt-40"
    >
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        {/* Interactive Radial Spotlight Follower */}
        <div
          className="pointer-events-none absolute -top-44 -bottom-24 left-0 right-0 hidden md:block transition-opacity duration-700 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y + 160}px, rgba(255, 77, 0, 0.12), transparent 80%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="animate-reveal flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {t.hero.available}
              </span>
            </div>

            <h1 className="font-serif leading-[0.88] tracking-tighter text-balance text-6xl sm:text-7xl md:text-[clamp(6rem,12vw,12rem)]">
              {t.hero.titleLine1}
              <br />
              <span className="italic text-accent transition-colors duration-300 hover:text-ink">
                {t.hero.titleLine2}
              </span>
            </h1>

            <div className="mt-12 flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
              <p className="max-w-[42ch] text-lg font-light leading-relaxed text-ink/80 md:text-xl text-pretty">
                {t.hero.bioPart1}
                <span className="border-b border-accent/60 transition-colors hover:border-accent hover:text-accent">
                  {t.hero.bioHighlight}
                </span>
                {t.hero.bioPart2}
              </p>
              <div className="flex flex-wrap items-center gap-8 md:gap-12">
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted">
                    {t.hero.experienceLabel}
                  </span>
                  <span className="text-sm font-medium">{t.hero.experienceValue}</span>
                </div>

                <div className="flex flex-col gap-1 md:items-end">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted">
                    {t.hero.locationLabel}
                  </span>
                  <span className="text-sm font-medium">{t.hero.locationValue}</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#work"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-canvas shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
                <span className="relative flex items-center gap-2">
                  <Sparkles className="size-3.5 text-accent group-hover:text-canvas" />
                  {t.hero.exploreProjects || "Explorar Proyectos"}
                </span>
              </a>

              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-ink/20 bg-surface/80 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent hover:scale-105 active:scale-95"
              >
                <span>{lang === "es" ? "Contactar" : "Get in Touch"}</span>
                <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectPreviewCard({
  project,
  isSingle,
}: {
  project: ProjectDetail;
  isSingle?: boolean;
}) {
  const { lang } = useI18n();

  const titleStr =
    typeof project.title === "object"
      ? project.title[lang] || project.title.es
      : project.title;
  const subtitleStr =
    typeof project.subtitle === "object"
      ? project.subtitle[lang] || project.subtitle.es
      : project.subtitle;
  const tagStr =
    typeof project.tag === "object"
      ? project.tag[lang] || project.tag.es
      : project.tag;
  const catLabelStr =
    typeof project.categoryLabel === "object"
      ? project.categoryLabel[lang] || project.categoryLabel.es
      : project.categoryLabel;

  // Contextual highlight badge for flagship features
  const specialBadge =
    project.id === "aforeaventura-3d"
      ? lang === "es"
        ? "3D Interactivo · STL"
        : "Interactive 3D · STL"
      : project.id === "the-old-man-and-the-sea"
      ? lang === "es"
        ? "Cortometraje 3D"
        : "3D Short Film"
      : project.id === "reflejos-vfx"
      ? "VFX & Compositing"
      : project.id === "naxine"
      ? lang === "es"
        ? "Plataforma Destacada"
        : "Featured Platform"
      : undefined;

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      data-cursor="project"
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-surface/50 p-4 transition-all duration-500 hover:border-accent/40 hover:bg-surface/90 hover:shadow-xl hover:-translate-y-1 ${
        isSingle ? "md:col-span-2 max-w-3xl mx-auto w-full" : ""
      }`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink/5 ring-1 ring-ink/5">
        <img
          src={project.coverImage}
          alt={titleStr}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category Pill Badge */}
        <div className="absolute left-3 top-3 rounded-full bg-canvas/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink backdrop-blur-md shadow-sm">
          {catLabelStr}
        </div>

        {/* Feature / Milestone Badge */}
        {specialBadge && (
          <div className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-canvas shadow-sm">
            {specialBadge}
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="flex flex-col gap-2.5 pt-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-semibold uppercase tracking-[0.2em] text-accent">
            {tagStr}
          </span>
          <span className="font-mono text-[11px] text-muted">{project.year}</span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-tight text-ink transition-colors duration-300 group-hover:text-accent font-medium">
          {titleStr}
        </h3>

        <p className="line-clamp-2 text-base font-light leading-relaxed text-ink/80 md:text-lg">
          {subtitleStr}
        </p>

        {/* Footer: Tech Stack Chips & Arrow Link */}
        <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3.5">
          <div className="flex flex-wrap gap-1.5">
            {project.techStack?.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink/80"
              >
                {tech}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
            <span>{lang === "es" ? "Ver caso" : "View case"}</span>
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Index() {
  const mainRef = useScrollReveal();
  const { lang, t } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  const categories = [
    { key: "all", keys: ["all"], label: t.projectsPage.tabs.all },
    { key: "web", keys: ["web", "ui"], label: t.projectsPage.tabs.web },
    { key: "3d", keys: ["3d"], label: t.projectsPage.tabs["3d"] },
    { key: "animation", keys: ["animation"], label: t.projectsPage.tabs.animation },
    { key: "photo", keys: ["photo"], label: t.projectsPage.tabs.photo },
    { key: "devops", keys: ["devops"], label: t.projectsPage.tabs.devops },
  ];

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = tabRefs.current[selectedCategory];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    const frame = requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [selectedCategory, lang]);

  const allProjects = useMemo(() => Object.values(projectsData), []);

  const displayedProjects = useMemo(() => {
    if (selectedCategory === "all") {
      const flagshipIds = [
        "next-era",
        "veravetalize",
        "dra-neus-munoz",
        "art-toy-conejo",
        "casa-tonala",
        "scoop-doggy",
      ];
      const flagships = flagshipIds
        .map((id) => projectsData[id])
        .filter((p): p is ProjectDetail => Boolean(p));

      if (flagships.length < 6) {
        const remaining = allProjects.filter((p) => !flagshipIds.includes(p.id));
        return [...flagships, ...remaining].slice(0, 6);
      }
      return flagships.slice(0, 6);
    }

    const currentCat = categories.find((c) => c.key === selectedCategory);
    return allProjects
      .filter((p) => currentCat?.keys.includes(p.category) || p.category === selectedCategory)
      .slice(0, 6);
  }, [selectedCategory, allProjects]);

  const tickerLabels = [
    { label: t.ticker.webgl, italic: true },
    { label: t.ticker.visualIdentity, italic: false },
    { label: t.ticker.reactjs, italic: true },
    { label: t.ticker.motionDesign, italic: false },
    { label: t.ticker.cinema4d, italic: true },
    { label: t.ticker.interactiveUX, italic: false },
    { label: t.ticker.threejs, italic: true },
    { label: t.ticker.designSystems, italic: false },
  ];

  return (
    <>
      <HeroCanvas />
      <main ref={mainRef} className="grain bg-transparent text-ink relative z-10">
      {/* Hero */}
      <HeroSection />

      {/* Diagonal Ticker Tape Ribbon */}
      <div className="relative z-20 my-8 w-full overflow-hidden py-4">
        <div className="w-full -rotate-1 overflow-hidden whitespace-nowrap bg-ink py-7 text-canvas">
          <div className="animate-marquee flex w-max items-center gap-12 px-6">
            {[...tickerLabels, ...tickerLabels, ...tickerLabels].map((item, i) => (
              <div key={i} className="flex items-center gap-12">
                <span className="font-sans text-2xl font-black uppercase tracking-[0.2em] text-canvas md:text-3xl">
                  {item.label}
                </span>
                <span className="text-lg font-bold text-accent">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Work — Curated Project Showcase with Category Filter */}
      <section id="work" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="reveal mb-12 flex flex-col justify-between gap-6 border-b border-ink/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                {lang === "es" ? "Portafolio Seleccionado" : "Selected Portfolio"}
              </span>
              <h2 className="mt-2 font-serif text-4xl tracking-tight text-ink md:text-5xl">
                {t.work.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                {lang === "es"
                  ? "Un vistazo rápido a proyectos destacados. Filtra por categoría para ver tarjetas seleccionadas o visita el portafolio completo."
                  : "A quick preview of featured projects. Filter by category to preview selected cards or visit the full portfolio gallery."}
              </p>
            </div>

            {/* Category Filter Tabs with Sliding Animated Pill */}
            <div className="relative flex max-w-full overflow-x-auto no-scrollbar md:overflow-visible md:flex-wrap items-center gap-1.5 rounded-xl md:rounded-full border border-ink/10 bg-surface/70 p-1.5 backdrop-blur-md shadow-sm">
              {/* Sliding Pill Indicator */}
              <div
                className="pointer-events-none absolute left-0 top-0 rounded-lg md:rounded-full bg-ink transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-md"
                style={{
                  transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
                  width: `${indicatorStyle.width}px`,
                  height: `${indicatorStyle.height}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {categories.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    ref={(el) => {
                      tabRefs.current[cat.key] = el;
                    }}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`relative z-10 flex shrink-0 items-center gap-1.5 rounded-lg md:rounded-full px-3.5 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                      isActive
                        ? "text-canvas font-semibold"
                        : "text-muted hover:text-ink hover:bg-ink/5"
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

          {/* Projects Grid: Balanced 2x2 layout (up to 4 items) with Animated Stagger */}
          <div
            className={`grid grid-cols-1 ${
              displayedProjects.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"
            } gap-8 lg:gap-10`}
          >
            {displayedProjects.map((project, idx) => (
              <div
                key={`${selectedCategory}-${project.id}`}
                className="animate-filter-card"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <ProjectPreviewCard
                  project={project}
                  isSingle={displayedProjects.length === 1}
                />
              </div>
            ))}
          </div>

          {/* CTA to full project gallery */}
          <div className="reveal mt-16 flex flex-col items-center justify-center gap-4 text-center">
            <Link
              to="/projects"
              search={selectedCategory !== "all" ? { category: selectedCategory } : undefined}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-medium text-canvas ring-1 ring-ink/10 transition-transform duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
              <span className="relative flex items-center gap-2 font-medium">
                {selectedCategory === "all"
                  ? t.work.viewAllProjects
                  : lang === "es"
                  ? `Ver todos los proyectos de ${categories.find((c) => c.key === selectedCategory)?.label || ""} en el portafolio`
                  : `View all ${categories.find((c) => c.key === selectedCategory)?.label || ""} projects in portfolio`}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Showreel / Video de Introducción */}
      <ShowreelSection />

      {/* Services Sticky Showcase */}
      <ServicesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Studio / About */}
      <section id="about" className="border-t border-ink/10 px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="reveal flex flex-col items-start gap-4 md:col-span-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                {t.studio.label}
              </h2>
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                ✦ {t.studio.experienceYears}
              </span>
            </div>
            <div className="md:col-span-8">
              <p className="reveal mb-16 font-serif text-3xl leading-tight text-pretty md:text-5xl">
                {t.studio.statementPart1}
                <span className="italic text-accent">{t.studio.statementHighlight}</span>
              </p>
              {/* Work Experience Timeline Preview */}
              <div className="reveal flex flex-col gap-6 border-t border-ink/10 pt-10">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  {t.aboutPage.experienceTitle}
                </span>

                <div className="flex flex-col gap-6">
                  {t.aboutPage.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col justify-between gap-2 border-b border-ink/10 pb-6 last:border-none md:flex-row md:items-baseline"
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="font-serif text-2xl tracking-tight text-ink transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span className="font-semibold uppercase tracking-wider text-ink">{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="text-muted">·</span>
                              <span className="text-xs font-semibold uppercase tracking-widest text-accent">{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                        {exp.period}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Link to /about subpage */}
              <div className="reveal mt-16 flex justify-start">
                <Link
                  to="/about"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-medium text-canvas ring-1 ring-ink/10 transition-transform duration-300 hover:scale-105"
                >
                  <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
                  <span className="relative font-medium">{t.studio.moreAboutMe}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section — Dark Centered */}
      <footer
        id="contact"
        className="rounded-t-[min(2.5vw,36px)] bg-ink px-6 pb-12 pt-32 text-canvas shadow-2xl"
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-16 text-center">
            {/* Headline Callout */}
            <div className="reveal flex flex-col items-center gap-6">
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

            {/* Interactive Form Component */}
            <div className="reveal w-full">
              <ContactForm />
            </div>

            {/* Bottom Links & Copyright */}
            <div className="reveal flex w-full flex-col items-center justify-between gap-8 border-t border-canvas/10 pt-12 text-center md:flex-row md:text-left">
              <div className="flex flex-col items-center gap-4 md:items-start">
                <a
                  href="mailto:landres.creative@gmail.com"
                  className="story-link font-serif text-2xl tracking-tight text-canvas md:text-4xl"
                >
                  landres.creative@gmail.com
                </a>
                <div className="flex flex-wrap gap-6">
                  {[
                    { name: "Behance", href: "https://behance.net/luishernandez303" },
                    { name: "Instagram", href: "https://instagram.com/landrescreative" },
                    { name: "LinkedIn", href: "https://linkedin.com/in/landrescreative" },
                    { name: "GitHub", href: "https://github.com/landrescreative" },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-[0.25em] text-canvas/60 transition-colors hover:text-accent"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-canvas/50">
                {t.contact.copyright}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}