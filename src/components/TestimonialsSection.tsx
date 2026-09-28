import { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const countryFlags: Record<string, string> = {
  US: "🇺🇸",
  ES: "🇪🇸",
  AR: "🇦🇷",
  GB: "🇬🇧",
  MX: "🇲🇽",
};

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function TestimonialsSection() {
  const { t, lang } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);

  const items = t.testimonials.items || [];

  // Responsive cardsPerView detection
  useEffect(() => {
    const updateCards = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  const maxIndex = Math.max(0, items.length - cardsPerView);

  // Keep currentIndex bounded if resize happens
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [cardsPerView, maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-slide rotation for carousel
  useEffect(() => {
    if (isPaused || items.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length, isPaused, maxIndex]);

  // Touch Swipe for Mobile UX
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section id="testimonials" className="border-t border-ink/10 px-6 py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="reveal mb-14 flex flex-col justify-between gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-1.5 backdrop-blur-md w-fit">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                {t.testimonials.subheader}
              </span>
            </div>
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink md:text-6xl max-w-2xl">
              {t.testimonials.title}
            </h2>
          </div>

          {/* Controls & Overall Rating */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-center gap-2 text-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 sm:size-5 fill-current" />
              ))}
              <span className="ml-2 font-serif text-base sm:text-lg italic text-ink font-semibold">
                5.0 / 5.0 {lang === "es" ? "Excelencia Verificada" : "Verified Rating"}
              </span>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                className="flex size-11 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-canvas active:scale-95 shadow-sm"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex size-11 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink transition-all duration-300 hover:scale-105 hover:bg-ink hover:text-canvas active:scale-95 shadow-sm"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider Container */}
        <div
          className="relative overflow-hidden py-4 -mx-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {items.map((item, idx) => {
              const quoteText = item.content || (item as any).quote || "";
              const flag = item.country ? countryFlags[item.country] : null;
              const initials = getInitials(item.name);

              return (
                <div
                  key={idx}
                  style={{ width: `${100 / cardsPerView}%` }}
                  className="shrink-0 px-3 flex"
                >
                  <div className="group relative flex w-full flex-col justify-between rounded-3xl border border-ink/15 bg-surface/70 p-7 sm:p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:bg-canvas">
                    <Quote className="absolute right-6 top-6 size-12 text-accent/15 transition-colors duration-500 group-hover:text-accent/30" />

                    <div className="relative z-10 flex flex-col gap-5">
                      {/* Rating Stars & Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-3.5 fill-current" />
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {flag && <span className="text-sm">{flag}</span>}
                          {item.tag && (
                            <span className="rounded-full border border-ink/10 bg-canvas/90 px-2.5 py-0.5 text-[9px] uppercase tracking-wider text-muted font-bold">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Quote */}
                      <blockquote className="font-serif text-base sm:text-lg leading-relaxed tracking-tight text-ink/90 italic">
                        "{quoteText}"
                      </blockquote>
                    </div>

                    {/* Author Meta */}
                    <div className="flex items-center gap-3.5 border-t border-ink/10 pt-5 mt-6">
                      <div className="flex size-11 items-center justify-center rounded-full bg-ink text-canvas font-serif text-sm font-bold shadow-md shrink-0">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif text-base font-bold tracking-tight text-ink truncate">
                            {item.name}
                          </span>
                          <CheckCircle2 className="size-3.5 text-accent shrink-0" aria-label="Verified Client" />
                        </div>
                        <span className="text-[11px] uppercase tracking-wider text-muted font-medium truncate">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots & Position Counter */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-accent"
                    : "w-2 bg-ink/20 hover:bg-ink/40"
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            {currentIndex + 1} / {maxIndex + 1} · {items.length} {lang === "es" ? "Reseñas Verificadas" : "Verified Reviews"}
          </span>
        </div>
      </div>
    </section>
  );
}
