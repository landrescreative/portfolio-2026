import { useState } from "react";
import { Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import workVitreous from "@/assets/work-vitreous.jpg";

export function ShowreelSection() {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="showreel" className="border-t border-ink/10 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              {t.showreel.badge}
            </span>
          </div>
          <h2 className="font-serif text-4xl leading-tight tracking-tight text-ink md:text-6xl max-w-3xl">
            {t.showreel.title}
          </h2>
        </div>

        {/* Video Player Container */}
        <div className="reveal group relative aspect-video w-full overflow-hidden rounded-3xl bg-ink shadow-2xl ring-1 ring-ink/10">
          {!isPlaying ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
              <img
                src="https://img.youtube.com/vi/nY0MLClNavQ/maxresdefault.jpg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = workVitreous;
                }}
                alt="Intro Video Poster"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />

              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="relative z-20 flex size-20 items-center justify-center rounded-full bg-accent text-canvas shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-canvas hover:text-ink md:size-24"
                aria-label={t.showreel.playLabel}
              >
                <Play className="size-8 translate-x-0.5 fill-current md:size-10" />
              </button>

              <span className="relative z-20 mt-6 font-serif text-lg italic text-canvas/90 md:text-xl">
                {t.showreel.playLabel}
              </span>
            </div>
          ) : (
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/nY0MLClNavQ?autoplay=1&rel=0"
              title="Luis Andrés — Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}
