import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export function CustomCursor() {
  const { t } = useI18n();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const viewProjectText = t.ui.viewProject;

  useEffect(() => {
    // Strictly enable ONLY on desktop devices with a fine pointer (mouse), and
    // never for visitors who asked for reduced motion.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => setIsDesktop(finePointer.matches && !reducedMotion.matches);

    syncEnabled();
    finePointer.addEventListener("change", syncEnabled);
    reducedMotion.addEventListener("change", syncEnabled);

    if (!(finePointer.matches && !reducedMotion.matches)) {
      return () => {
        finePointer.removeEventListener("change", syncEnabled);
        reducedMotion.removeEventListener("change", syncEnabled);
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if mouse is over a project tile or interactive element
      const target = e.target as HTMLElement | null;
      const projectCard = target?.closest("[data-cursor='project']");
      const hoverElement = target?.closest("button, a, [data-cursor='hover']");

      if (projectCard) {
        setIsHovered(true);
        setCursorText(viewProjectText);
      } else if (hoverElement) {
        setIsHovered(true);
        setCursorText(null);
      } else {
        setIsHovered(false);
        setCursorText(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      finePointer.removeEventListener("change", syncEnabled);
      reducedMotion.removeEventListener("change", syncEnabled);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [viewProjectText]);

  // Do NOT render anything on touch/mobile devices to protect mobile UX
  useEffect(() => {
    const root = document.documentElement;
    if (isDesktop) root.classList.add("has-custom-cursor");
    else root.classList.remove("has-custom-cursor");
    return () => root.classList.remove("has-custom-cursor");
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[999999] transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        opacity: pos.x < 0 ? 0 : 1,
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          cursorText
            ? "h-10 px-4 bg-accent text-canvas font-sans text-[10px] font-bold tracking-widest uppercase shadow-2xl scale-100"
            : isHovered
              ? "size-10 bg-ink/30 border border-ink/40 backdrop-blur-sm scale-125"
              : "size-4 bg-accent/70 border border-canvas/80 shadow-sm"
        }`}
      >
        {cursorText ? (
          <span className="flex items-center gap-1 whitespace-nowrap">{cursorText}</span>
        ) : null}
      </div>
    </div>
  );
}
