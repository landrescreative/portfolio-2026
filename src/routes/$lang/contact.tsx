import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Clock, Sparkles } from "lucide-react";

import { useI18n, tx } from "@/lib/i18n";
import { ContactSection } from "@/components/ContactSection";
import { buildSeo, absoluteUrl, type Locale } from "@/lib/seo";

const CONTACT_SEO = {
  es: {
    title: "Contacto · Hablemos de tu proyecto | Luis Andrés (LANDRES)",
    description:
      "¿Tienes un proyecto de desarrollo web, UI/UX, 3D o motion graphics? Escríbeme y te responderé en menos de 24 horas. La primera consulta o videollamada es gratuita.",
  },
  en: {
    title: "Contact · Let's talk about your project | Luis Andrés (LANDRES)",
    description:
      "Got a web development, UI/UX, 3D or motion graphics project? Send me a message and I'll reply within 24 hours. The first consultation or video call is free.",
  },
} as const;

export const Route = createFileRoute("/$lang/contact")({
  head: ({ params }) => {
    const lang = params.lang as Locale;
    return buildSeo({
      lang,
      path: "/contact",
      type: "website",
      ...CONTACT_SEO[lang],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl(`/${lang}/contact`),
          inLanguage: lang,
          mainEntity: { "@id": "https://www.landrescreative.com/#person" },
        },
      ],
    });
  },
  component: ContactPage,
});

function ContactPage() {
  const { lang, t } = useI18n();

  const details = [
    {
      icon: Mail,
      label: tx(lang, "Email directo", "Direct email"),
      value: "landres.creative@gmail.com",
      href: "mailto:landres.creative@gmail.com",
    },
    {
      icon: Clock,
      label: tx(lang, "Tiempo de respuesta", "Response time"),
      value: tx(lang, "Menos de 24 horas", "Under 24 hours"),
    },
    {
      icon: MapPin,
      label: tx(lang, "Ubicación", "Location"),
      value: tx(lang, "Remoto · Todo el mundo", "Remote · Worldwide"),
    },
    {
      icon: Sparkles,
      label: tx(lang, "Disponibilidad", "Availability"),
      value: tx(lang, "Comisiones abiertas · 2026", "Open for commissions · 2026"),
    },
  ];

  return (
    <main className="grain min-h-screen bg-transparent text-ink">
      {/* Header + quick contact details */}
      <section className="px-6 pb-16 pt-36 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 border-b border-ink/10 pb-16">
            <Link
              to="/$lang"
              params={{ lang }}
              className="story-link w-fit text-xs font-semibold uppercase tracking-[0.25em] text-muted"
            >
              ← {t.ui.home}
            </Link>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {t.ui.availableForWork}
            </div>

            <h1 className="font-serif text-5xl leading-[0.92] tracking-tighter text-balance md:text-7xl lg:text-8xl">
              {tx(lang, "Hablemos de tu", "Let's talk about your")}{" "}
              <span className="italic text-accent">{tx(lang, "proyecto.", "project.")}</span>
            </h1>

            <p className="max-w-2xl text-lg font-light leading-relaxed text-ink/80 md:text-xl text-pretty">
              {tx(
                lang,
                "Cuéntame qué tienes en mente: una plataforma web, una interfaz UI/UX, una pieza 3D o motion graphics. Te ayudo a convertirlo en un producto que funcione y se vea increíble.",
                "Tell me what you have in mind: a web platform, a UI/UX interface, a 3D asset or motion graphics. I'll help you turn it into a product that works and looks incredible.",
              )}
            </p>

            {/* Quick contact details grid */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {details.map((detail) => {
                const Icon = detail.icon;
                const content = (
                  <div className="flex h-full flex-col gap-2 rounded-[min(1vw,14px)] border border-ink/10 bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md">
                    <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {detail.label}
                    </span>
                    <span className="font-serif text-lg tracking-tight text-ink">
                      {detail.value}
                    </span>
                  </div>
                );

                return detail.href ? (
                  <a key={detail.label} href={detail.href} className="block h-full">
                    {content}
                  </a>
                ) : (
                  <div key={detail.label}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Reused contact + form section */}
      <ContactSection />
    </main>
  );
}
