import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useProgress } from "@react-three/drei";
import { useI18n } from "@/lib/i18n";
import { onHeroModelReady } from "@/lib/heroModel";

/**
 * Full-screen loader shown on the very first paint of the home route while the
 * hero 3D character loads. It is strictly *progressive enhancement*: the page
 * under it is already rendered, the visitor can dismiss it at any time, and a
 * safety timeout guarantees it never becomes a wall. On any other route it does
 * not render at all.
 */
const SAFETY_TIMEOUT_MS = 4500;
const EXIT_MS = 800;
const SKIP_REVEAL_MS = 700;

const isHomePath = (pathname: string) => /^\/(es|en)?\/?$/.test(pathname);

export function Preloader() {
  const { t } = useI18n();
  const { progress } = useProgress();

  const isHome = isHomePath(useRouterState({ select: (state) => state.location.pathname }));

  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">(isHome ? "loading" : "gone");
  const [canSkip, setCanSkip] = useState(false);
  // Keep the very first client render byte-identical to the SSR output so
  // hydration can never mismatch on the progress bar.
  const [mounted, setMounted] = useState(false);

  const revealRef = useRef<() => void>(() => {});

  const reveal = useCallback(() => {
    setPhase((current) => {
      if (current !== "loading") return current;
      window.setTimeout(() => setPhase("gone"), EXIT_MS);
      return "leaving";
    });
  }, []);
  revealRef.current = reveal;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isHome) return;
    const unsubscribe = onHeroModelReady(reveal);
    const safetyTimer = window.setTimeout(reveal, SAFETY_TIMEOUT_MS);
    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_REVEAL_MS);
    return () => {
      unsubscribe();
      window.clearTimeout(safetyTimer);
      window.clearTimeout(skipTimer);
    };
  }, [isHome, reveal]);

  // Keep the page put while the preloader covers it.
  useEffect(() => {
    if (phase === "gone") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "gone") return null;

  const pct = mounted ? Math.round(progress) : 0;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink text-canvas ${
        phase === "leaving" ? "animate-preloader-out" : ""
      }`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-accent" />
        </span>

        <span className="font-serif text-4xl italic tracking-tight text-canvas md:text-6xl">
          Luis Andrés
        </span>

        <div className="h-[3px] w-44 overflow-hidden rounded-full bg-canvas/15">
          {pct > 0 ? (
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          ) : (
            <div className="h-full w-1/2 animate-pulse rounded-full bg-accent/70" />
          )}
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-canvas/60">
          {t.ui.loadingExperience}
          {pct > 0 ? ` · ${pct}%` : "…"}
        </span>

        {canSkip && (
          <button
            type="button"
            onClick={() => revealRef.current()}
            className="mt-2 rounded-full border border-canvas/25 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-canvas/80 transition-colors hover:border-accent hover:bg-accent hover:text-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t.ui.enterNow}
          </button>
        )}
      </div>
    </div>
  );
}
