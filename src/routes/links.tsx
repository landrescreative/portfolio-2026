import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe,
  Briefcase,
  Mail,
  Send,
  FileText,
  Instagram,
  Linkedin,
  Github,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Code,
  Layers,
  Box,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Luis Andrés (LANDRES) — Links & Bio" },
      {
        name: "description",
        content:
          "Enlaces oficiales, portafolio de proyectos, contacto y redes de Luis Andrés — Creative Developer & UI/UX Designer.",
      },
      { property: "og:title", content: "Luis Andrés (LANDRES) — Links & Bio" },
      {
        property: "og:description",
        content: "Explora mis proyectos destacados, descarga mi CV o contáctame para nuevas colaboraciones.",
      },
      { property: "og:image", content: "/uploads/landres-banner.jpg" },
    ],
  }),
  component: LinkBioPage,
});

function LinkBioPage() {
  const { lang } = useI18n();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = "landres.creative@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const featuredLinks = [
    {
      title: { es: "Portafolio de Diseño, 3D & Motion", en: "Design, 3D & Motion Portfolio" },
      subtitle: { es: "Modelado 3D, Motion Graphics, VFX y Social Media", en: "3D Modeling, Motion Graphics, VFX & Social Media" },
      href: "/design",
      isInternal: true,
      badge: { es: "3D & Motion", en: "3D & Motion" },
      icon: Box,
      highlight: true,
    },
    {
      title: { es: "Portafolio Web & UI/UX", en: "Web Dev & UI/UX Portfolio" },
      subtitle: { es: "React, Next.js, Webflow, Astro, UI/UX y DevOps", en: "React, Next.js, Webflow, Astro, UI/UX & DevOps" },
      href: "/web",
      isInternal: true,
      badge: { es: "Web & UI", en: "Web & UI" },
      icon: Code,
      highlight: true,
    },
    {
      title: { es: "Portafolio Principal (Todo)", en: "Full Portfolio (All Works)" },
      subtitle: { es: "Explora la experiencia interactiva completa 2026", en: "Explore the full interactive 2026 experience" },
      href: "/",
      isInternal: true,
      badge: { es: "Oficial", en: "Official" },
      icon: Globe,
    },
    {
      title: { es: "Galería de Proyectos", en: "All Projects Showcase" },
      subtitle: { es: "Explora todos los casos de estudio documentados", en: "Explore all documented case studies" },
      href: "/projects",
      isInternal: true,
      badge: { es: "Casos de Estudio", en: "Case Studies" },
      icon: Briefcase,
    },
    {
      title: { es: "Descargar Curriculum Vitae (PDF)", en: "Download Curriculum Vitae (PDF)" },
      subtitle: { es: "Perfil profesional actualizado 2026", en: "Updated 2026 professional resume" },
      href: "/uploads/cv-luis-andres.pdf",
      isDownload: true,
      badge: "PDF",
      icon: FileText,
    },
    {
      title: { es: "Agendar Llamada / Contacto Directo", en: "Book a Call / Get in Touch" },
      subtitle: { es: "1ª Consulta de asesoría 100% gratuita", en: "1st consultation call 100% free" },
      href: "/#contact",
      isInternal: true,
      badge: { es: "Disponible", en: "Available" },
      icon: Send,
    },
  ];

  const socialLinks = [
    {
      name: "Behance",
      label: "behance.net/luishernandez303",
      href: "https://behance.net/luishernandez303",
      icon: Layers,
    },
    {
      name: "Instagram",
      label: "@landrescreative",
      href: "https://instagram.com/landrescreative",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      label: "in/landrescreative",
      href: "https://linkedin.com/in/landrescreative",
      icon: Linkedin,
    },
    {
      name: "GitHub",
      label: "github.com/landrescreative",
      href: "https://github.com/landrescreative",
      icon: Github,
    },
  ];

  const quickHighlights = [
    { label: "Frontend / React / Astro", icon: Code },
    { label: "3D Motion / Blender / VFX", icon: Box },
    { label: "UI/UX & Branding", icon: Sparkles },
  ];

  return (
    <main className="grain min-h-screen bg-canvas text-ink flex flex-col justify-between py-12 px-4 sm:px-6 relative selection:bg-accent selection:text-canvas">
      {/* Top Floating Controls */}
      <div className="mx-auto w-full max-w-lg flex items-center justify-between pb-6">
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
          title="Ir al inicio"
        >
          <img
            src="/uploads/logo-black-and-orange.png"
            alt="LANDRES Logo"
            className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
          />
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Center Bio Content Box */}
      <div className="mx-auto w-full max-w-lg flex flex-col items-center">
        {/* Profile Card Header */}
        <div className="relative flex flex-col items-center text-center">
          {/* Avatar Ring */}
          <div className="relative group mb-5">
            <div className="relative size-28 sm:size-32 rounded-3xl overflow-hidden border-2 border-ink/10 bg-surface shadow-2xl p-1.5 backdrop-blur-md transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
              <img
                src="/favicon.png"
                alt="Luis Andrés"
                className="h-full w-full object-cover rounded-2xl bg-ink"
              />
            </div>
            {/* Live Indicator */}
            <div
              className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1.5 rounded-full bg-surface border border-ink/15 px-3 py-1 shadow-lg backdrop-blur-md"
              title="Disponible para proyectos"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink">
                {lang === "es" ? "Disponible" : "Available"}
              </span>
            </div>
          </div>

          {/* Name & Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Luis Andrés
          </h1>

          <p className="mt-1 font-serif text-lg italic text-ink/75">
            Creative Developer & UI/UX Designer
          </p>

          <p className="mt-2 text-xs sm:text-sm text-muted max-w-sm leading-relaxed">
            {lang === "es"
              ? "Diseño experiencias digitales de alto impacto, desarrollo web frontend y render 3D interactivo."
              : "Crafting high-impact digital experiences, frontend engineering and interactive 3D motion."}
          </p>

          {/* Quick Skill Tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quickHighlights.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface/70 px-3 py-1 text-[11px] font-medium text-ink/80 backdrop-blur-sm"
              >
                <skill.icon className="size-3 text-accent" />
                <span>{skill.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Links Stack */}
        <div className="mt-8 flex flex-col gap-3.5 w-full">
          {featuredLinks.map((link, idx) => {
            const titleText = typeof link.title === "object" ? (link.title[lang] || link.title.es) : link.title;
            const subtitleText = typeof link.subtitle === "object" ? (link.subtitle[lang] || link.subtitle.es) : link.subtitle;
            const badgeText = typeof link.badge === "object" ? (link.badge[lang] || link.badge.es) : link.badge;
            const Icon = link.icon;

            const content = (
              <div
                className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 active:scale-[0.98] ${
                  link.highlight
                    ? "border-accent bg-ink text-canvas shadow-xl hover:shadow-accent/20 hover:-translate-y-0.5"
                    : "border-ink/10 bg-surface/80 hover:bg-surface text-ink hover:border-accent/40 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`size-11 sm:size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      link.highlight
                        ? "bg-accent text-canvas"
                        : "bg-ink/5 text-accent border border-ink/5"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-serif text-lg sm:text-xl font-semibold tracking-tight ${
                          link.highlight ? "text-canvas" : "text-ink"
                        }`}
                      >
                        {titleText}
                      </span>
                      {badgeText && (
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            link.highlight
                              ? "bg-accent/30 text-accent border border-accent/40"
                              : "bg-accent text-canvas"
                          }`}
                        >
                          {badgeText}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs leading-snug ${
                        link.highlight ? "text-canvas/70" : "text-muted"
                      }`}
                    >
                      {subtitleText}
                    </span>
                  </div>
                </div>

                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    link.highlight
                      ? "text-canvas/60 group-hover:text-canvas"
                      : "text-muted group-hover:text-accent"
                  }`}
                >
                  <ArrowUpRight className="size-5" />
                </div>
              </div>
            );

            if (link.isInternal) {
              return (
                <Link key={idx} to={link.href} className="w-full block">
                  {content}
                </Link>
              );
            }

            return (
              <a
                key={idx}
                href={link.href}
                target={link.isDownload ? undefined : "_blank"}
                rel={link.isDownload ? undefined : "noopener noreferrer"}
                download={link.isDownload ? "CV_Luis_Andres_2026.pdf" : undefined}
                className="w-full block"
              >
                {content}
              </a>
            );
          })}
        </div>

        {/* Quick Email Copy Pill */}
        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="w-full flex items-center justify-between p-3.5 px-5 rounded-2xl border border-ink/10 bg-canvas text-ink hover:border-accent/40 hover:bg-surface/50 transition-all active:scale-[0.99] group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-accent group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs font-semibold text-ink/90 truncate">
                {email}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted group-hover:text-accent">
              {copiedEmail ? (
                <>
                  <Check className="size-3.5 text-accent" />
                  <span className="text-accent">{lang === "es" ? "Copiado" : "Copied"}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>{lang === "es" ? "Copiar" : "Copy"}</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* Social Grid */}
        <div className="mt-8 w-full border-t border-ink/10 pt-6">
          <span className="block text-center text-[10px] uppercase tracking-[0.25em] text-muted font-semibold mb-4">
            {lang === "es" ? "Redes & Presencia Digital" : "Socials & Digital Presence"}
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-ink/10 bg-surface/60 hover:bg-surface hover:border-accent/40 text-ink transition-all group active:scale-95 shadow-sm"
                >
                  <Icon className="size-4 text-accent transition-transform group-hover:scale-110" />
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="font-serif text-sm font-semibold leading-tight text-ink group-hover:text-accent transition-colors">
                      {s.name}
                    </span>
                    <span className="text-[10px] text-muted truncate">
                      {s.label}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-lg pt-12 pb-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted font-medium">
          © {new Date().getFullYear()} Luis Andrés · LANDRES™
        </p>
      </footer>
    </main>
  );
}
