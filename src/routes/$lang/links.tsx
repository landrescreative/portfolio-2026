import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Globe,
  Mail,
  Send,
  Instagram,
  Linkedin,
  Github,
  Check,
  Copy,
  Sparkles,
  ArrowUpRight,
  Code,
  Layers,
  Box,
} from "lucide-react";
import { useI18n, tx } from "@/lib/i18n";
import { imageSize } from "@/lib/image";
import { CALENDLY_URL } from "@/lib/links";
import { buildSeo, type Locale } from "@/lib/seo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HeroAvatarCanvas } from "@/components/HeroCanvas";

const LINKS_SEO = {
  es: {
    title: "Luis Andrés (LANDRES) · Links & Bio",
    description:
      "Enlaces oficiales, portafolio de proyectos, contacto y redes de Luis Andrés, Creative Developer & UI/UX Designer.",
  },
  en: {
    title: "Luis Andrés (LANDRES) · Links & Bio",
    description:
      "Official links, project portfolio, contact and social profiles of Luis Andrés, Creative Developer & UI/UX Designer.",
  },
} as const;

export const Route = createFileRoute("/$lang/links")({
  head: ({ params }) => {
    const lang = params.lang as Locale;
    // Link-in-bio page: keep it crawlable for link discovery but out of the index.
    return buildSeo({ lang, path: "/links", noindex: true, ...LINKS_SEO[lang] });
  },
  component: LinkBioPage,
});

/** Small uppercase eyebrow with an accent dot, used to group the link blocks. */
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex shrink-0 items-center gap-2">
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink">{label}</span>
      </span>
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-ink/15 to-transparent" />
    </div>
  );
}

function LinkBioPage() {
  const { lang, t } = useI18n();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = "landres.creative@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Dedicated portfolios for each discipline
  const portfolios: Array<{
    eyebrow: string;
    title: string;
    subtitle: string;
    to: "/$lang/3d" | "/$lang/design" | "/$lang/web";
    icon: typeof Box;
  }> = [
    {
      eyebrow: tx(lang, "01 · 3D", "01 · 3D"),
      title: tx(lang, "Portafolio 3D", "3D Portfolio"),
      subtitle: tx(
        lang,
        "Modelado 3D, esculturas, miniaturas STL y renders.",
        "3D modeling, sculptures, STL miniatures & renders.",
      ),
      to: "/$lang/3d",
      icon: Box,
    },
    {
      eyebrow: tx(lang, "02 · Diseño & Motion", "02 · Design & Motion"),
      title: tx(lang, "Diseño & Motion Graphics", "Design & Motion Graphics"),
      subtitle: tx(
        lang,
        "Motion graphics, VFX, animación y redes sociales.",
        "Motion graphics, VFX, animation & social media.",
      ),
      to: "/$lang/design",
      icon: Layers,
    },
    {
      eyebrow: tx(lang, "03 · Web & UI", "03 · Web & UI"),
      title: tx(lang, "Desarrollo Web & UI/UX", "Web Development & UI/UX"),
      subtitle: tx(
        lang,
        "React, Next.js, Webflow, Astro y DevOps Linux.",
        "React, Next.js, Webflow, Astro & DevOps Linux.",
      ),
      to: "/$lang/web",
      icon: Code,
    },
  ];

  // Each network keeps its own brand color on the icon tile and on the hover
  // border, so the row reads as a set of recognizable badges.
  const socials = [
    {
      name: "Behance",
      label: "behance.net/luishernandez303",
      href: "https://behance.net/luishernandez303",
      icon: Layers,
      tile: "bg-[#1769FF]",
      ring: "hover:border-[#1769FF]",
    },
    {
      name: "Instagram",
      label: "@landrescreative",
      href: "https://instagram.com/landrescreative",
      icon: Instagram,
      tile: "bg-[linear-gradient(45deg,#F58529,#DD2B7F,#8134AF)]",
      ring: "hover:border-[#DD2B7F]",
    },
    {
      name: "LinkedIn",
      label: "in/landrescreative",
      href: "https://linkedin.com/in/landrescreative",
      icon: Linkedin,
      tile: "bg-[#0A66C2]",
      ring: "hover:border-[#0A66C2]",
    },
    {
      name: "GitHub",
      label: "github.com/landrescreative",
      href: "https://github.com/landrescreative",
      icon: Github,
      tile: "bg-[#181717]",
      ring: "hover:border-[#181717]",
    },
  ];

  const quickHighlights = [
    { label: "Frontend / React / Astro", icon: Code },
    { label: "3D Motion / Blender / VFX", icon: Box },
    { label: "UI/UX & Branding", icon: Sparkles },
  ];

  return (
    <main className="grain relative min-h-screen overflow-hidden bg-canvas text-ink selection:bg-accent selection:text-canvas">
      {/* Background: fine grid plus three slowly drifting accent glows. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,13,13,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,13,13,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="animate-aurora absolute inset-x-0 -top-40 mx-auto size-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.26),transparent_62%)] blur-3xl" />
        <div className="animate-aurora absolute -left-40 top-1/4 size-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,120,40,0.22),transparent_65%)] blur-3xl [animation-delay:-8s] [animation-duration:28s]" />
        <div className="animate-aurora absolute -right-40 top-2/3 size-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(13,13,13,0.08),transparent_68%)] blur-3xl [animation-delay:-15s] [animation-duration:32s]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 pb-12 pt-9 sm:px-6 sm:pt-12">
        {/* Self-contained top bar: the site navbar is deliberately hidden here */}
        <div className="mb-9 flex items-center justify-between">
          <Link
            to="/$lang"
            params={{ lang }}
            aria-label="LANDRES · Luis Andrés"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src="/uploads/logo-black-and-orange.webp"
              alt="LANDRES"
              decoding="async"
              {...imageSize("/uploads/logo-black-and-orange.webp")}
              className="h-7 w-auto object-contain sm:h-8"
            />
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Profile header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.28),transparent_70%)] blur-2xl"
            />
            <div className="relative">
              {/* The profile picture is now the 3D character: drag to spin it. */}
              <div className="relative size-40 overflow-hidden rounded-[2rem] border-2 border-ink/10 bg-surface p-1.5 shadow-2xl backdrop-blur-md sm:size-48">
                <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_50%_38%,#fff6ee,#eee8df)]">
                  <HeroAvatarCanvas
                    className="h-full w-full cursor-grab active:cursor-grabbing"
                    label={tx(
                      lang,
                      "Luis Andrés · arrastra para girar",
                      "Luis Andrés · drag to spin",
                    )}
                  />
                </div>
              </div>
              <div className="absolute -bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/15 bg-surface px-3 py-1 shadow-lg backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink">
                  {t.ui.available}
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
              {tx(lang, "Arrastra para girar", "Drag to spin")}
            </p>
          </div>

          <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Luis Andrés
          </h1>

          <p className="mt-2 font-serif text-lg italic text-ink/85">
            Creative Developer & UI/UX Designer
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {quickHighlights.map((skill) => (
              <span
                key={skill.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface/70 px-3 py-1 text-[11px] font-medium text-ink/90 backdrop-blur-sm"
              >
                <skill.icon className="size-3 text-accent" />
                <span>{skill.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Portfolios: the main experience first, then the two dedicated tracks */}
        <div className="mt-8">
          <SectionLabel label={tx(lang, "Portafolios", "Portfolios")} />

          {/* Primary: the full portfolio experience on landrescreative.com */}
          <Link
            to="/$lang"
            params={{ lang }}
            className="group animate-reveal relative mt-4 flex items-center gap-4 overflow-hidden rounded-2xl bg-accent p-6 text-ink shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] sm:p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-700 group-hover:translate-x-full"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-ink/10 blur-2xl"
            />
            <span className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-ink text-accent shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
              <Globe className="size-6" />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink">
                {tx(lang, "Portafolio principal", "Main portfolio")}
              </span>
              <span className="mt-1 block font-serif text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {tx(lang, "Explora el portafolio completo", "Explore the full portfolio")}
              </span>
            </span>
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ink transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-accent">
              <ArrowUpRight className="size-5" />
            </span>
          </Link>

          <div className="mt-3 flex flex-col gap-3">
            {portfolios.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  params={{ lang }}
                  style={{ animationDelay: `${(idx + 1) * 90}ms` }}
                  className="group animate-reveal relative block overflow-hidden rounded-2xl border border-ink/10 bg-ink p-5 text-canvas shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl active:scale-[0.99]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-14 -top-14 size-40 rounded-full bg-accent/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="relative flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-canvas shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                        {item.eyebrow}
                      </span>
                      <span className="mt-1 block font-serif text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                        {item.title}
                      </span>
                      <span className="mt-1.5 block text-xs leading-snug text-canvas/75">
                        {item.subtitle}
                      </span>
                    </span>
                    <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-canvas/20 bg-canvas/5 text-canvas/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent group-hover:bg-accent group-hover:text-canvas">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact: direct email with an explicit copy action */}
        <div className="mt-9">
          <SectionLabel label={tx(lang, "Contacto", "Contact")} />
          <div className="mt-4">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group flex w-full items-center gap-4 rounded-xl border border-ink/10 bg-surface/70 p-3.5 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface hover:shadow-md active:scale-[0.99]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-ink/5 bg-ink/5 text-accent transition-transform duration-300 group-hover:scale-110">
                <Mail className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-sm font-semibold leading-tight text-ink">
                  {tx(lang, "Correo directo", "Direct email")}
                </span>
                <span className="block truncate font-mono text-[11px] text-muted">{email}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-canvas transition-colors group-hover:bg-accent group-hover:text-ink">
                {copiedEmail ? (
                  <>
                    <Check className="size-3" />
                    {t.ui.copied}
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    {t.ui.copy}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Social profiles, each in its own brand color */}
        <div className="mt-9">
          <SectionLabel label={t.ui.socialsTitle} />
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} · ${social.label}`}
                  className={`group flex items-center gap-3 rounded-xl border border-ink/10 bg-surface/70 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface hover:shadow-md active:scale-95 ${social.ring}`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${social.tile}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-sm font-semibold leading-tight text-ink">
                      {social.name}
                    </span>
                    <span className="block truncate text-[10px] text-muted">{social.label}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Closing call to action: booking */}
        <div className="mt-9">
          <SectionLabel label={tx(lang, "Agenda", "Book")} />
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-4 flex items-center gap-4 overflow-hidden rounded-2xl bg-accent p-5 text-ink shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full"
            />
            <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-ink text-accent shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Send className="size-5" />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-ink">
                {tx(lang, "Videollamada gratuita", "Free video call")}
              </span>
              <span className="mt-1 block font-serif text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {tx(lang, "Agendar llamada (30 min)", "Book a call (30 min)")}
              </span>
              <span className="mt-1.5 block text-xs font-medium leading-snug text-ink">
                {tx(
                  lang,
                  "Elige día y hora en el calendario. Sin compromiso.",
                  "Pick a day and time on the calendar. No commitment.",
                )}
              </span>
            </span>
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-ink group-hover:bg-ink group-hover:text-accent">
              <ArrowUpRight className="size-4" />
            </span>
          </a>
        </div>

        <footer className="mt-auto pt-14 pb-2 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
            © {new Date().getFullYear()} Luis Andrés · LANDRES™
          </p>
        </footer>
      </div>
    </main>
  );
}
