import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * "How I work", a clear 4-step process plus the entry point (a free 20-minute
 * call). Reduces friction for potential clients: they always know what happens
 * next and how to start. Relies on the page's scroll-reveal observer (`.reveal`).
 */
export function ProcessSection() {
  const { t, lang } = useI18n();

  return (
    <section id="process" className="border-t border-ink/10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-16 flex flex-col gap-6 border-b border-ink/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {t.process.label}
            </span>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-ink md:text-5xl">
              {t.process.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
            {t.process.subtitle}
          </p>
        </div>

        {/* Steps, thin dividers via a gap-px grid on a tinted background */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.steps.map((step, idx) => {
            const isEntry = idx === 0;
            return (
              <div
                key={step.number}
                className={`reveal group relative flex flex-col gap-4 p-8 transition-colors duration-500 ${
                  isEntry ? "bg-accent/10 hover:bg-accent/15" : "bg-canvas hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm font-bold tracking-widest text-accent">
                    {step.number}
                  </span>
                  {isEntry && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-canvas shadow-sm">
                      <Sparkles className="size-3" />
                      {t.process.freeBadge}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl tracking-tight text-ink">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{step.description}</p>
                {isEntry && (
                  <Link
                    to="/$lang/contact"
                    params={{ lang }}
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-canvas shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    {t.process.ctaButton}
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Entry point CTA */}
        <div className="reveal mt-14 flex flex-col items-center gap-6 rounded-3xl border border-ink/10 bg-surface/60 px-8 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-serif text-3xl tracking-tight text-ink md:text-4xl">
              {t.process.ctaTitle}
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
              {t.process.ctaSubtitle}
            </p>
          </div>
          <Link
            to="/$lang/contact"
            params={{ lang }}
            className="group relative inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-full bg-ink px-8 py-4 text-sm font-medium text-canvas ring-1 ring-ink/10 transition-transform duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-accent transition-colors group-hover:text-canvas" />
              {t.process.ctaButton}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
