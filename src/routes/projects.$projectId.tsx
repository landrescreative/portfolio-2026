import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useI18n } from "@/lib/i18n";
import { getProjectById, getAdjacentProjects, projectsData, ProjectDetail } from "@/data/projectsData";
import { ExternalLink, Play, ArrowLeft, ArrowRight, Check, Settings, X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { ProjectAdminModal } from "@/components/ProjectAdminModal";
import { ModelViewer3D } from "@/components/ModelViewer3D";

export const Route = createFileRoute("/projects/$projectId")({
  head: ({ params }) => {
    const project = getProjectById(params.projectId);
    if (!project) return {};
    const title = typeof project.title === "object" ? (project.title.es || project.title.en) : project.title;
    const desc = typeof project.overview === "object" ? (project.overview.es || project.overview.en) : project.overview;
    const img = project.coverImage.startsWith("http") ? project.coverImage : `https://landres.creative${project.coverImage}`;
    return {
      meta: [
        { title: `${title} — Caso de Estudio | Luis Andrés (LANDRES)` },
        { name: "description", content: desc },
        { property: "og:title", content: `${title} — Portafolio Luis Andrés` },
        { property: "og:description", content: desc },
        { property: "og:image", content: img },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: img },
      ],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { lang, t } = useI18n();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const initialProject = getProjectById(projectId);
  const [liveProject, setLiveProject] = useState<ProjectDetail | undefined>(initialProject);

  useEffect(() => {
    setLiveProject(getProjectById(projectId));
  }, [projectId]);

  const project = liveProject;
  const { prev, next } = getAdjacentProjects(projectId);

  // Related projects: other projects in same category or matching tech stack
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return Object.values(projectsData)
      .filter((p) => p.id !== project.id && (p.category === project.category || p.techStack.some((t) => project.techStack.includes(t))))
      .slice(0, 3);
  }, [project]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null || !project?.gallery) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < project.gallery.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : project.gallery.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, project]);

  const staticTexts = t.projectDetailPage || {
    backToGallery: lang === "es" ? "Volver a Galería de Proyectos" : "Back to Project Gallery",
    clientLabel: lang === "es" ? "Cliente" : "Client",
    roleLabel: lang === "es" ? "Rol / Servicio" : "Role / Service",
    yearLabel: lang === "es" ? "Año" : "Year",
    liveSite: lang === "es" ? "Ver Sitio Web" : "Live Website",
    privateProject: lang === "es" ? "Proyecto Privado" : "Private Showcase",
    techStackLabel: lang === "es" ? "Tecnologías & Herramientas:" : "Tech Stack & Tools:",
    overviewLabel: lang === "es" ? "Visión General" : "Overview",
    challengeLabel: lang === "es" ? "El Desafío" : "The Challenge",
    solutionLabel: lang === "es" ? "La Solución" : "The Solution",
    deliverablesLabel: lang === "es" ? "Entregables Clave" : "Key Deliverables",
    metricsLabel: lang === "es" ? "Resultados e Impacto" : "Impact & Metrics",
    galleryLabel: lang === "es" ? "Galería Visual & Detalles" : "Visual Gallery & Details",
    prevProject: lang === "es" ? "Proyecto Anterior" : "Previous Project",
    nextProject: lang === "es" ? "Siguiente Proyecto" : "Next Project",
    playVideo: lang === "es" ? "Reproducir Video del Proyecto" : "Play Project Showcase Video",
    notFoundTitle: lang === "es" ? "Proyecto No Encontrado" : "Project Not Found",
    notFoundSubtitle: lang === "es" ? "El proyecto que buscas no existe o ha sido movido." : "The project you are looking for does not exist or has been moved.",
    backToProjects: lang === "es" ? "Volver a Proyectos" : "Back to Projects",
  };

  // Trigger IntersectionObserver to add .is-visible to .reveal elements
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

    // Fallback: force reveal after short delay so no content remains hidden
    const timer = setTimeout(() => {
      elements.forEach((el) => el.classList.add("is-visible"));
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [projectId, liveProject]);

  if (!project) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="font-serif text-5xl tracking-tight text-ink">
          {staticTexts.notFoundTitle}
        </h1>
        <p className="mt-4 text-muted">
          {staticTexts.notFoundSubtitle}
        </p>
        <Link
          to="/projects"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-transform hover:scale-105"
        >
          <ArrowLeft className="size-4" />
          <span>{staticTexts.backToProjects}</span>
        </Link>
      </main>
    );
  }

  const titleText = typeof project.title === "object" ? (project.title[lang] || project.title.es) : project.title;
  const subtitleText = typeof project.subtitle === "object" ? (project.subtitle[lang] || project.subtitle.es) : project.subtitle;
  const roleText = typeof project.role === "object" ? (project.role[lang] || project.role.es) : project.role;
  const categoryText = typeof project.categoryLabel === "object" ? (project.categoryLabel[lang] || project.categoryLabel.es) : project.categoryLabel;
  const overviewText = typeof project.overview === "object" ? (project.overview[lang] || project.overview.es) : project.overview;
  const challengeText = typeof project.challenge === "object" ? (project.challenge[lang] || project.challenge.es) : project.challenge;
  const solutionText = typeof project.solution === "object" ? (project.solution[lang] || project.solution.es) : project.solution;
  const deliverables = project.deliverables ? (project.deliverables[lang] || project.deliverables.es) : [];

  return (
    <main className="grain bg-canvas text-ink pt-28 md:pt-36">
      {/* Floating Action Button for Visual Editor */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsEditorOpen(true)}
          className="group flex items-center gap-2.5 rounded-full border border-canvas/20 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-wider text-canvas shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-accent"
        >
          <Settings className="size-4 transition-transform duration-500 group-hover:rotate-90" />
          <span>Editar Proyecto</span>
        </button>
      </div>

      {/* Visual Admin Modal */}
      <ProjectAdminModal
        project={project}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onUpdate={(updated) => setLiveProject(updated)}
      />

      <article className="mx-auto max-w-7xl px-6 pb-24">
        {/* Back Link */}
        <div className="reveal mb-12 flex items-center justify-between">
          <Link
            to="/projects"
            className="story-link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            <span>{staticTexts.backToGallery}</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent transition-transform hover:scale-105"
          >
            <Settings className="size-3.5" />
            <span>⚙️ Modo Editor</span>
          </button>
        </div>

        {/* Hero Header */}
        <header className="reveal mb-16 flex flex-col gap-8 border-b border-ink/10 pb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-ink/15 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              {categoryText}
            </span>
            <span className="rounded-full border border-ink/10 bg-canvas px-3.5 py-1 text-xs font-medium text-muted">
              {project.year}
            </span>
          </div>

          <h1 className="font-serif text-5xl leading-none tracking-tight text-ink md:text-7xl lg:text-8xl">
            {titleText}
          </h1>

          <p className="max-w-4xl font-serif text-2xl leading-snug text-ink/90 md:text-3xl lg:text-4xl italic font-normal">
            {subtitleText}
          </p>

          {/* Project Metadata Grid */}
          <div className="mt-8 grid grid-cols-2 gap-8 border-t border-ink/10 pt-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {staticTexts.clientLabel}
              </span>
              <span className="font-serif text-xl font-medium text-ink">{project.client}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {staticTexts.roleLabel}
              </span>
              <span className="font-serif text-xl font-medium text-ink">{roleText}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {staticTexts.yearLabel}
              </span>
              <span className="font-serif text-xl font-medium text-ink">{project.year}</span>
            </div>

            {project.duration && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {lang === "es" ? "Duración" : "Duration"}
                </span>
                <span className="font-serif text-xl font-medium text-ink">
                  {typeof project.duration === "object" ? (project.duration[lang] || project.duration.es) : project.duration}
                </span>
              </div>
            )}

            {project.priceRange && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {lang === "es" ? "Inversión" : "Price Range"}
                </span>
                <span className="font-serif text-xl font-medium text-ink">{project.priceRange}</span>
              </div>
            )}

            <div className="flex flex-col justify-end">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-canvas transition-transform duration-300 hover:scale-105 hover:bg-accent w-fit"
                >
                  <span>{staticTexts.liveSite}</span>
                  <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <span className="text-xs uppercase tracking-widest text-muted italic">
                  {staticTexts.privateProject}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Featured Cover Media */}
        <section className="reveal mb-24 overflow-hidden rounded-3xl border border-ink/10 shadow-2xl">
          <img
            src={project.coverImage}
            alt={titleText}
            className="h-auto w-full object-cover max-h-[750px]"
          />
        </section>

        {/* Tech Stack Pills */}
        <section className="reveal mb-20 flex flex-wrap items-center gap-3 border-b border-ink/10 pb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mr-4">
            {staticTexts.techStackLabel}
          </span>
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-ink/15 bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-ink"
            >
              {tech}
            </span>
          ))}
        </section>

        {/* Interactive 3D Model Viewer for 3D Print / Mesh Projects */}
        {(project.has3DViewer || projectId === "aforeaventura-3d" || projectId === "art-toy-conejo") && (
          <ModelViewer3D projectId={projectId} />
        )}

        {/* Story Sections: Overview, Challenge, Solution */}
        <section className="reveal mb-24 max-w-5xl flex flex-col gap-14">
          <div className="flex flex-col gap-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              01 / {staticTexts.overviewLabel}
            </h2>
            <p className="font-sans text-xl font-light leading-relaxed text-ink/95 md:text-2xl text-pretty">
              {overviewText}
            </p>
          </div>

          <div className="flex flex-col gap-5 border-t border-ink/10 pt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              02 / {staticTexts.challengeLabel}
            </h2>
            <p className="font-sans text-lg font-light leading-relaxed text-ink/85 md:text-xl text-pretty">
              {challengeText}
            </p>
          </div>

          <div className="flex flex-col gap-5 border-t border-ink/10 pt-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              03 / {staticTexts.solutionLabel}
            </h2>
            <p className="font-sans text-lg font-light leading-relaxed text-ink/85 md:text-xl text-pretty">
              {solutionText}
            </p>
          </div>

          {/* Optional Deliverables Checklist */}
          {deliverables.length > 0 && (
            <div className="flex flex-col gap-6 border-t border-ink/10 pt-12">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                04 / {staticTexts.deliverablesLabel}
              </h2>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                {deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 rounded-2xl border border-ink/10 bg-surface/50 p-5 transition-colors hover:border-accent/30">
                    <span className="mt-1 text-accent text-base font-bold">✦</span>
                    <span className="font-sans text-base font-medium text-ink/95 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional Impact Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-col gap-5 border-t border-ink/10 pt-10">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                05 / {staticTexts.metricsLabel}
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
                {project.metrics.map((metric, idx) => {
                  const labelText = typeof metric.label === "object" ? (metric.label[lang] || metric.label.es) : metric.label;
                  return (
                    <div key={idx} className="flex flex-col justify-between rounded-2xl border border-ink/10 bg-surface/60 p-5 shadow-sm">
                      <span className="font-serif text-3xl font-bold tracking-tight text-ink md:text-4xl">{metric.value}</span>
                      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">{labelText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Testimonial / Client Feedback */}
          {project.testimonial && (
            <div className="flex flex-col gap-4 border-t border-ink/10 pt-10">
              <div className="rounded-3xl border border-accent/25 bg-accent/5 p-8 md:p-10 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  {lang === "es" ? "Testimonio del Cliente" : "Client Feedback"}
                </span>
                <blockquote className="mt-4 font-serif text-xl italic leading-relaxed text-ink md:text-2xl">
                  “{typeof project.testimonial.quote === "object" ? (project.testimonial.quote[lang] || project.testimonial.quote.es) : project.testimonial.quote}”
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div className="size-2 rounded-full bg-accent" />
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-ink">{project.testimonial.client || project.client}</span>
                    {project.testimonial.role && (
                      <span className="text-xs text-muted">
                        {typeof project.testimonial.role === "object" ? (project.testimonial.role[lang] || project.testimonial.role.es) : project.testimonial.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Optional Video Showcase */}
        {project.video && (
          <section className="reveal mb-24 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                {typeof project.video.title === "object" ? (project.video.title[lang] || project.video.title.es) : project.video.title}
              </h2>
            </div>

            <div className={`group relative ${project.video.aspectRatio === "vertical" ? "aspect-[9/16] max-w-[420px] mx-auto" : "aspect-video w-full"} overflow-hidden rounded-3xl bg-ink shadow-2xl ring-1 ring-ink/10`}>
              {!isPlayingVideo ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src={project.video.poster || project.coverImage}
                    alt="Video Showcase"
                    className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />

                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo(true)}
                    className="relative z-20 flex size-20 items-center justify-center rounded-full bg-accent text-canvas shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-canvas hover:text-ink md:size-24"
                    aria-label="Play video"
                  >
                    <Play className="size-8 translate-x-0.5 fill-current md:size-10" />
                  </button>

                  <span className="relative z-20 mt-6 font-serif text-lg italic text-canvas/90 md:text-xl">
                    {staticTexts.playVideo}
                  </span>
                </div>
              ) : project.video.mp4Url ? (
                <video
                  src={project.video.mp4Url}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${project.video.youtubeId}?autoplay=1&rel=0`}
                  title={titleText}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </section>
        )}

        {/* Flexible Image Gallery Showcase with Lightbox */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="reveal mb-32 flex flex-col gap-12">
            <div className="flex items-center justify-between border-b border-ink/10 pb-6">
              <h2 className="font-serif text-3xl tracking-tight md:text-4xl">
                {staticTexts.galleryLabel}
              </h2>
              <span className="text-xs uppercase tracking-widest text-muted">
                {lang === "es" ? "Haz clic para ampliar" : "Click to expand"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              {project.gallery.map((img, idx) => {
                const colSpanClass = img.span === "full" ? "md:col-span-12" : "md:col-span-6";
                const captionText = img.caption ? (typeof img.caption === "object" ? (img.caption[lang] || img.caption.es) : img.caption) : null;
                return (
                  <figure
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`group flex flex-col gap-3 overflow-hidden rounded-3xl border border-ink/10 bg-surface/40 p-4 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-accent/30 cursor-zoom-in ${colSpanClass}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-ink/5">
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute right-3 top-3 rounded-full bg-ink/70 p-2 text-canvas opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                        <Maximize2 className="size-4" />
                      </div>
                    </div>
                    {captionText && (
                      <figcaption className="px-2 pt-1.5 font-sans text-sm font-normal text-ink/80 flex items-center justify-between">
                        <span className="leading-snug">{captionText}</span>
                        <span className="text-xs text-accent font-semibold ml-4 shrink-0">{idx + 1}/{project.gallery.length}</span>
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Fullscreen Lightbox Modal */}
        {lightboxIndex !== null && project.gallery && project.gallery[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-ink/95 p-4 md:p-8 backdrop-blur-xl animate-in fade-in duration-200"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Header / Controls */}
            <div className="flex w-full items-center justify-between text-canvas z-10" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                  {lightboxIndex + 1} / {project.gallery.length}
                </span>
                <span className="text-canvas/30">|</span>
                <span className="font-serif text-sm md:text-base text-canvas/90 truncate max-w-md">
                  {titleText}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="flex size-10 items-center justify-center rounded-full bg-canvas/10 text-canvas transition-colors hover:bg-accent hover:text-canvas"
                aria-label="Close lightbox"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Main Lightbox Image View with Navigation */}
            <div className="relative flex flex-1 w-full items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
              {project.gallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : project.gallery.length - 1))}
                  className="absolute left-2 md:left-6 z-20 flex size-12 items-center justify-center rounded-full bg-canvas/10 text-canvas backdrop-blur-md transition-all hover:bg-accent hover:scale-110 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}

              <img
                src={project.gallery[lightboxIndex].src}
                alt={project.gallery[lightboxIndex].alt}
                className="max-h-[78vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-canvas/10 select-none transition-all duration-300"
              />

              {project.gallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev < project.gallery.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 md:right-6 z-20 flex size-12 items-center justify-center rounded-full bg-canvas/10 text-canvas backdrop-blur-md transition-all hover:bg-accent hover:scale-110 active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="size-6" />
                </button>
              )}
            </div>

            {/* Caption Footer */}
            {project.gallery[lightboxIndex].caption && (
              <div className="max-w-2xl text-center text-xs uppercase tracking-widest text-canvas/70 z-10" onClick={(e) => e.stopPropagation()}>
                {typeof project.gallery[lightboxIndex].caption === "object"
                  ? (project.gallery[lightboxIndex].caption[lang] || project.gallery[lightboxIndex].caption.es)
                  : project.gallery[lightboxIndex].caption}
              </div>
            )}
          </div>
        )}

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="reveal mb-24 flex flex-col gap-8 border-t border-ink/10 pt-16">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                  {staticTexts.relatedTitle || "Proyectos Relacionados"}
                </span>
                <h3 className="mt-1 font-serif text-2xl tracking-tight text-ink md:text-3xl">
                  {staticTexts.exploreMore || "Explora más casos destacados"}
                </h3>
              </div>
              <Link
                to="/projects"
                search={{ category: project.category }}
                className="story-link text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-accent"
              >
                {lang === "es" ? "Ver categoría →" : "View category →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((rel) => {
                const relTitle = typeof rel.title === "object" ? (rel.title[lang] || rel.title.es) : rel.title;
                const relTag = typeof rel.tag === "object" ? (rel.tag[lang] || rel.tag.es) : rel.tag;
                return (
                  <Link
                    key={rel.id}
                    to="/projects/$projectId"
                    params={{ projectId: rel.id }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-canvas hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink/5">
                      <img
                        src={rel.coverImage}
                        alt={relTitle}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                        {relTag}
                      </span>
                      <h4 className="font-serif text-lg tracking-tight text-ink group-hover:text-accent transition-colors">
                        {relTitle}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Next / Previous Project Navigation */}
        <nav className="reveal border-t border-ink/10 pt-16">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            {prev ? (
              <Link
                to="/projects/$projectId"
                params={{ projectId: prev.id }}
                className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface/50 p-6 transition-all duration-300 hover:border-accent/40 hover:bg-canvas hover:shadow-xl sm:w-1/2"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                  <span>{staticTexts.prevProject}</span>
                </span>
                <span className="font-serif text-2xl tracking-tight text-ink font-medium">
                  {typeof prev.title === "object" ? (prev.title[lang] || prev.title.es) : prev.title}
                </span>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                to="/projects/$projectId"
                params={{ projectId: next.id }}
                className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface/50 p-6 text-right transition-all duration-300 hover:border-accent/40 hover:bg-canvas hover:shadow-xl sm:w-1/2"
              >
                <span className="inline-flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  <span>{staticTexts.nextProject}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="font-serif text-2xl tracking-tight text-ink font-medium">
                  {typeof next.title === "object" ? (next.title[lang] || next.title.es) : next.title}
                </span>
              </Link>
            ) : <div />}
          </div>
        </nav>
      </article>

      {/* Footer Contact Section */}
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

            <div className="w-full">
              <ContactForm />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
