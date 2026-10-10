import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { imageSize } from "@/lib/image";

/**
 * Profile photo presented as a physical access badge. Pure CSS 3D transforms
 * (no three.js) keep the About page lightweight. Drop your photo at
 * `public/uploads/luis-andres-portrait.webp`; if it is missing, a monogram
 * fallback is shown instead.
 */
const PORTRAIT_SRC = "/uploads/luis-andres-portrait.webp";
const SERIAL = "LA-2026-001";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

// Stylized QR-like mark (9x9) with finder squares in three corners.
const QR = [
  "111010111",
  "101010101",
  "111010111",
  "000101000",
  "110101011",
  "010010110",
  "111010011",
  "101101010",
  "111011001",
];

const BARCODE = [3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 3, 1, 2, 1];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function IdCard3D() {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, o: 0 });
  const [failed, setFailed] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: (0.5 - py) * 14, ry: (px - 0.5) * 18 });
    setSheen({ x: px * 100, y: py * 100, o: 1 });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setSheen((s) => ({ ...s, o: 0 }));
  };

  return (
    <div className="animate-reveal relative mx-auto w-full max-w-[440px]">
      {/* Ambient accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(255,77,0,0.18), transparent 72%)",
        }}
      />

      <div className="animate-float relative z-10 flex flex-col items-center">
        {/* Lanyard strap (fades into the page so it reads as going off-frame) */}
        <div
          aria-hidden="true"
          className="relative h-24 w-5 overflow-hidden rounded-t-sm"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #151519 0 5px, #24242b 5px 10px)",
          }}
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-accent/50" />
          <span
            className="absolute inset-x-0 top-0 h-16"
            style={{
              background: "linear-gradient(to bottom, rgba(245,243,238,1), rgba(245,243,238,0))",
            }}
          />
        </div>

        {/* Metal clip */}
        <div
          aria-hidden="true"
          className="relative -mt-px h-5 w-14 rounded-[6px] bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-md ring-1 ring-black/25"
        >
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40" />
        </div>

        {/* The badge */}
        <div className="relative -mt-1 w-full" style={{ perspective: "1400px" }}>
          <div
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
            className="group relative w-full rounded-[30px] border border-canvas/10 bg-ink p-3 shadow-[0_45px_90px_-35px_rgba(13,13,13,0.7)] transition-transform duration-200 ease-out will-change-transform"
          >
            {/* Lanyard slot */}
            <div className="absolute left-1/2 top-1.5 z-30 h-2.5 w-20 -translate-x-1/2 rounded-full bg-black/60 ring-1 ring-canvas/10" />

            <div className="relative flex flex-col overflow-hidden rounded-[22px] bg-[#0b0c0f]">
              {/* ---- Photo ---- */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {!failed ? (
                  <img
                    src={PORTRAIT_SRC}
                    alt={t.hero.name}
                    loading="lazy"
                    decoding="async"
                    {...imageSize(PORTRAIT_SRC)}
                    onError={() => setFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-8xl italic text-accent/80">LA</span>
                  </div>
                )}

                {/* Legibility gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/50" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(130% 85% at 50% 0%, transparent 42%, rgba(0,0,0,0.6) 100%)",
                  }}
                />

                {/* Film grain */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
                  style={{ backgroundImage: NOISE }}
                />

                {/* Cursor-tracking holographic sheen */}
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-300"
                  style={{
                    opacity: sheen.o * 0.7,
                    background: `radial-gradient(260px circle at ${sheen.x}% ${sheen.y}%, rgba(255,77,0,0.5), transparent 60%)`,
                  }}
                />

                {/* Diagonal foil highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-y-8 -left-16 w-20 rotate-[18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70 mix-blend-overlay"
                />

                {/* Viewfinder corner brackets */}
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-3 size-5 border-l border-t border-accent/80"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 size-5 border-r border-t border-accent/80"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 left-3 size-5 border-b border-l border-accent/80"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 right-3 size-5 border-b border-r border-accent/80"
                />

                {/* Top row: brand + live status */}
                <div className="absolute inset-x-5 top-5 z-20 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-canvas/90">
                    LANDRES*
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-canvas shadow-[0_0_20px_rgba(255,77,0,0.55)]">
                    <span className="size-1.5 animate-pulse rounded-full bg-canvas" />
                    {t.idCard.status}
                  </span>
                </div>

                {/* Smart chip */}
                <div
                  aria-hidden="true"
                  className="absolute left-5 top-16 z-20 h-7 w-9 overflow-hidden rounded-[5px] bg-gradient-to-br from-[#f0d27a] via-[#d4a017] to-[#a9760a] shadow-sm ring-1 ring-black/30"
                >
                  <span className="absolute inset-x-1 top-[6px] h-px bg-black/25" />
                  <span className="absolute inset-x-1 top-[13px] h-px bg-black/25" />
                  <span className="absolute inset-x-1 top-[20px] h-px bg-black/25" />
                  <span className="absolute inset-y-1 left-1/2 w-px bg-black/25" />
                </div>

                {/* Holographic patch */}
                <div
                  aria-hidden="true"
                  className="absolute right-5 top-16 z-20 size-9 rounded-[7px] opacity-90 shadow-sm ring-1 ring-canvas/20"
                  style={{
                    backgroundImage:
                      "conic-gradient(from 210deg at 50% 50%, #ff4d00, #ffd166, #06d6a0, #4cc9f0, #b388ff, #ff4d00)",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-[7px]"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 60%)",
                    }}
                  />
                </div>

                {/* Bottom overlay: identity */}
                <div className="absolute inset-x-5 bottom-5 z-20 flex flex-col gap-1.5 text-canvas">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-canvas/60">
                    {t.idCard.idLabel}
                  </span>
                  <span className="font-serif text-4xl leading-none tracking-tight">
                    {t.hero.name}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {t.idCard.role}
                  </span>
                </div>
              </div>

              {/* ---- Data band ---- */}
              <div className="relative flex flex-col gap-4 px-5 py-5">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #ffffff 0 1px, transparent 1px 9px)",
                  }}
                />

                <div className="relative flex flex-col gap-2.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-canvas/45">
                      {t.idCard.basedIn}
                    </span>
                    <span className="text-right text-[11px] font-medium uppercase tracking-wider text-canvas/85">
                      {t.idCard.basedInValue}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-canvas/45">
                      {t.idCard.focus}
                    </span>
                    <span className="text-right text-[11px] font-medium uppercase tracking-wider text-canvas/85">
                      {t.idCard.focusValue}
                    </span>
                  </div>
                </div>

                <div className="relative flex items-end justify-between gap-4 border-t border-canvas/10 pt-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex h-6 items-end gap-[2px]" aria-hidden="true">
                      {BARCODE.map((h, i) => (
                        <span
                          key={i}
                          className="w-[2px] bg-canvas/80"
                          style={{ height: `${h * 6}px` }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-canvas/50">
                      {SERIAL}
                    </span>
                  </div>

                  <div aria-hidden="true" className="grid size-12 grid-cols-9 gap-px">
                    {QR.flatMap((row, y) =>
                      row
                        .split("")
                        .map((cell, x) => (
                          <span
                            key={`${x}-${y}`}
                            className={cell === "1" ? "bg-canvas/85" : "bg-transparent"}
                          />
                        )),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
