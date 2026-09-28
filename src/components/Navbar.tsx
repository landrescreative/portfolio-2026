import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, FileText } from "lucide-react";

export function Navbar() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { name: t.nav.projects, to: "/projects" },
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.about, to: "/about" },
    { name: t.nav.contact, href: "/#contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-ink/10 bg-canvas/80 text-ink backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:py-6">
          {/* Logo / Name */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label="Luis Andrés — Inicio"
          >
            <img
              src="/uploads/logo-black-and-orange.png"
              alt="LANDRES Logo"
              className="h-9 w-auto md:h-10 object-contain"
            />
          </Link>

          {/* Nav Items & Controls */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Desktop Links */}
            <div className="hidden items-center gap-8 md:flex">
              {links.map((link) =>
                link.to ? (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="story-link text-xs font-medium uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-ink"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="story-link text-xs font-medium uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-ink"
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>

            {/* Direct CV Download Link */}
            <a
              href="/uploads/cv-luis-andres.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="CV_Luis_Andres_Creative_Developer.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface/80 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-canvas hover:scale-105 active:scale-95"
              title="Descargar Curriculum Vitae en PDF"
            >
              <FileText className="size-3.5 text-accent group-hover:text-canvas" />
              <span>{t.nav.cv || "CV"}</span>
            </a>

            {/* Language Pill Switcher */}
            <LanguageSwitcher />

            {/* Mobile Hamburger Button with Smooth Icon Swap */}
            <button
              className="relative z-50 flex size-9 items-center justify-center text-ink transition-transform duration-300 hover:scale-110 active:scale-95 md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative size-6">
                <Menu
                  className={`absolute inset-0 size-6 transition-all duration-300 ease-out ${
                    isOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"
                  }`}
                />
                <X
                  className={`absolute inset-0 size-6 transition-all duration-300 ease-out ${
                    isOpen ? "rotate-0 opacity-100 scale-100 text-canvas" : "-rotate-90 opacity-0 scale-75"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Animated Mobile Menu Fullscreen Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-12 pt-28 text-canvas transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Decorative Grid Background Lines */}
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Staggered Navigation Links */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 text-center">
          {/* Home Link */}
          <div
            className={`transition-all duration-500 ease-out ${
              isOpen
                ? "translate-y-0 opacity-100 delay-100"
                : "translate-y-8 opacity-0 delay-0"
            }`}
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="group font-serif text-4xl tracking-tight text-canvas/90 transition-colors hover:text-accent sm:text-5xl"
            >
              <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                {t.nav.work === "Trabajo" ? "Inicio" : "Home"}
              </span>
            </Link>
          </div>

          {links.map((link, idx) => {
            const delayClasses = [
              "delay-[150ms]",
              "delay-[200ms]",
              "delay-[250ms]",
              "delay-[300ms]",
            ];
            const delayClass = delayClasses[idx] || "delay-200";

            return (
              <div
                key={link.name}
                className={`transition-all duration-500 ease-out ${
                  isOpen
                    ? `translate-y-0 opacity-100 ${delayClass}`
                    : "translate-y-8 opacity-0 delay-0"
                }`}
              >
                {link.to ? (
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="group font-serif text-4xl tracking-tight text-canvas/90 transition-colors hover:text-accent sm:text-5xl"
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                      {link.name}
                    </span>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group font-serif text-4xl tracking-tight text-canvas/90 transition-colors hover:text-accent sm:text-5xl"
                  >
                    <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                      {link.name}
                    </span>
                  </a>
                )}
              </div>
            );
          })}
          {/* Mobile Direct CV Download Button & Language Switcher */}
          <div
            className={`flex items-center gap-4 transition-all duration-500 ease-out ${
              isOpen
                ? "translate-y-0 opacity-100 delay-[320ms]"
                : "translate-y-8 opacity-0 delay-0"
            }`}
          >
            <a
              href="/uploads/cv-luis-andres.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="CV_Luis_Andres_Creative_Developer.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-canvas/20 bg-canvas/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-canvas transition-colors hover:bg-accent hover:text-canvas"
            >
              <FileText className="size-4 text-accent" />
              <span>{t.hero.downloadCv || "Descargar CV"}</span>
            </a>
            <div className="scale-110">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Footer Contact Info */}
        <div
          className={`relative z-10 flex flex-col items-center gap-2 border-t border-canvas/10 pt-6 text-center transition-all duration-500 ease-out ${
            isOpen
              ? "translate-y-0 opacity-100 delay-[350ms]"
              : "translate-y-8 opacity-0 delay-0"
          }`}
        >
          <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            {t.contact.tagline}
          </span>
          <a
            href="mailto:landres.creative@gmail.com"
            className="font-serif text-base italic text-canvas/80 transition-colors hover:text-accent"
          >
            landres.creative@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
