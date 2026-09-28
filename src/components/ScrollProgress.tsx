import { useState, useEffect } from "react";

export function ScrollProgress() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setScrollWidth(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-accent transition-all duration-150 ease-out"
        style={{ width: `${scrollWidth}%` }}
      />
    </div>
  );
}
