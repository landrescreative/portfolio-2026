import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const [animKey, setAnimKey] = useState(1);
  const [activeTitle, setActiveTitle] = useState("");
  const isInitial = useRef(true);

  const getTitle = (path: string) => {
    if (path === "/") return "PORTFOLIO 2026";
    if (path.startsWith("/projects")) return "GALERÍA DE PROYECTOS";
    if (path.startsWith("/about")) return "SOBRE MÍ & TRAYECTORIA";
    return "LUIS ANDRÉS";
  };

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      setActiveTitle(getTitle(pathname));
      return;
    }

    setActiveTitle(getTitle(pathname));
    setAnimKey((prev) => prev + 1);
  }, [pathname]);

  return (
    <>
      {/* Fullscreen Wipe Curtain */}
      <div
        key={animKey}
        className="animate-curtain fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-ink text-canvas shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="relative flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-accent" />
          </span>
          <span className="font-serif text-4xl italic tracking-tight text-canvas md:text-6xl">
            Luis Andrés
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-canvas/60">
            {activeTitle}
          </span>
        </div>
      </div>

      {children}
    </>
  );
}
