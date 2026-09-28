import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ServiceProjectPreview {
  projectId: string;
  projectTitle: { es: string; en: string };
  projectTag: { es: string; en: string };
  image: string;
}

const serviceProjects: ServiceProjectPreview[] = [
  {
    projectId: "art-of-flavors",
    projectTitle: { es: "Art of Flavors — Luxury Dining", en: "Art of Flavors — Luxury Dining" },
    projectTag: { es: "Diseño UI/UX & Dirección de Arte", en: "UI/UX Design & Art Direction" },
    image: "/uploads/art-of-flavors-mockup.webp",
  },
  {
    projectId: "naxine",
    projectTitle: { es: "NAXINE — Marketplace & SaaS", en: "NAXINE — Marketplace & SaaS" },
    projectTag: { es: "Desarrollo Full Stack Next.js", en: "Full Stack Next.js Development" },
    image: "/uploads/entregable01desarrollo.jpg",
  },
  {
    projectId: "remedy-pain-spine",
    projectTitle: { es: "Remedy Pain & Spine — Salud & SEO", en: "Remedy Pain & Spine — Health & SEO" },
    projectTag: { es: "Arquitectura UX & Optimización CRO", en: "UX Architecture & CRO Optimization" },
    image: "/uploads/remedy-pain-spine.png",
  },
  {
    projectId: "casa-tonala",
    projectTitle: { es: "Casa Tonalá — Animación 3D", en: "Casa Tonalá — 3D Animation" },
    projectTag: { es: "Blender 3D & Motion Graphics", en: "Blender 3D & Motion Graphics" },
    image: "/uploads/casa-tonala-cover.jpg",
  },
];

export function ServicesSection() {
  const { t, lang } = useI18n();
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Desktop & Tablet scroll intersection observer to auto-sync sticky visual
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIdx(idx);
            }
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -25% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section
      id="services"
      className="my-24 rounded-[min(3vw,40px)] border border-canvas/10 bg-ink px-6 py-20 text-canvas shadow-2xl md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Brutalist Section Header */}
        <div className="reveal mb-16 flex flex-col gap-4 border-b border-canvas/15 pb-12">
          <h2 className="font-sans text-5xl font-black uppercase tracking-tighter text-canvas sm:text-7xl md:text-8xl lg:text-9xl">
            {t.services.title}
          </h2>
          <p className="max-w-2xl text-base font-light text-canvas/70 md:text-xl">
            {t.services.subtitle}
          </p>
        </div>

        {/* Main Brutalist Grid Layout: Interactive List + Sticky Visual Preview */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Stacked Brutalist Service Rows */}
          <div className="flex flex-col divide-y divide-canvas/15 lg:col-span-7">
            {t.services.items.map((item, idx) => {
              const isSelected = activeIdx === idx;

              return (
                <div
                  key={item.number}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative flex flex-col gap-6 py-14 transition-all duration-500 cursor-pointer ${
                    isSelected ? "opacity-100" : "opacity-55 hover:opacity-90"
                  }`}
                >
                  {/* Top Row: Huge Index + Bold Title + Arrow */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline gap-4">
                        <span
                          className={`font-mono text-sm font-bold tracking-widest transition-colors duration-300 ${
                            isSelected ? "text-accent" : "text-canvas/40"
                          }`}
                        >
                          [{item.number}]
                        </span>
                        <h3
                          className={`font-sans text-3xl font-black uppercase tracking-tight transition-all duration-300 sm:text-4xl md:text-5xl ${
                            isSelected
                              ? "text-canvas translate-x-2"
                              : "text-canvas/80 group-hover:text-canvas"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <span className="text-sm font-serif italic text-accent/90 sm:text-base pl-9">
                        {item.tagline}
                      </span>
                    </div>

                    {/* Brutalist Action Arrow */}
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isSelected
                          ? "border-accent bg-accent text-canvas rotate-45 scale-110 shadow-[0_0_20px_rgba(255,77,0,0.3)]"
                          : "border-canvas/20 bg-canvas/5 text-canvas/60 group-hover:border-canvas/40"
                      }`}
                    >
                      <span className="font-mono text-lg font-bold">↗</span>
                    </div>
                  </div>

                  {/* Expanded Content: Description & Deliverables */}
                  <div className="pl-0 sm:pl-9 flex flex-col gap-6 pt-2">
                    <p className="text-sm font-light leading-relaxed text-canvas/75 md:text-base">
                      {item.description}
                    </p>

                    {/* Matrix Deliverables Tags */}
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.deliverables.map((deliv, i) => (
                          <span
                            key={i}
                            className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all duration-300 ${
                              isSelected
                                ? "border-accent/40 bg-accent/10 text-canvas font-medium shadow-[0_0_15px_rgba(255,77,0,0.15)]"
                                : "border-canvas/10 bg-canvas/5 text-canvas/60"
                            }`}
                          >
                            &gt; {deliv}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Brutalist Monolithic Media Frame */}
          <div className="sticky top-28 z-20 self-start hidden lg:block lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-2 border-canvas/20 bg-ink p-3 shadow-2xl">
              {/* Corner Frame Markers */}
              <span className="absolute top-2 left-2 z-30 font-mono text-[9px] text-canvas/40">[SPEC_IMG_0{activeIdx + 1}]</span>
              <span className="absolute bottom-2 right-2 z-30 font-mono text-[9px] text-canvas/40">[DISCIPLINE_CORE]</span>

              {serviceProjects.map((preview, idx) => {
                const isActive = activeIdx === idx;
                const projectTitle = preview.projectTitle[lang] || preview.projectTitle.es;
                const projectTag = preview.projectTag[lang] || preview.projectTag.es;

                return (
                  <div
                    key={preview.projectId}
                    className={`absolute inset-3 overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "opacity-100 scale-100 z-10 pointer-events-auto"
                        : "opacity-0 scale-105 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={preview.image}
                      alt={projectTitle}
                      className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                    {/* Bottom Floating Tag Card with Case Study Link */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-xl border border-canvas/20 bg-ink/90 p-5 backdrop-blur-md text-canvas shadow-2xl">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
                          // {lang === "es" ? "SERVICIO" : "SERVICE"} 0{idx + 1}
                        </span>
                        <span className="font-mono text-[10px] text-canvas/50">
                          {projectTag}
                        </span>
                      </div>
                      <span className="font-sans text-xl font-black uppercase tracking-tight">
                        {t.services.items[idx]?.title}
                      </span>
                      <span className="text-xs font-serif italic text-canvas/80">
                        {t.services.items[idx]?.tagline}
                      </span>

                      <Link
                        to="/projects/$projectId"
                        params={{ projectId: preview.projectId }}
                        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-canvas shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-canvas hover:text-ink w-fit"
                      >
                        <span>{lang === "es" ? "Explorar Proyecto" : "Explore Project"}</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}