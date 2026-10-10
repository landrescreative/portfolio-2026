import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { imageSize } from "@/lib/image";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ContactSection } from "@/components/ContactSection";
import { IdCard3D } from "@/components/IdCard3D";
import { buildSeo, type Locale } from "@/lib/seo";

const ABOUT_SEO = {
  es: {
    title: "Sobre mí · Luis Andrés (LANDRES) | Creative Developer & 3D Artist",
    description:
      "Conoce a Luis Andrés (LANDRES): diseña y construye productos digitales para startups y agencias, UI/UX, desarrollo web, 3D y DevOps Linux. Más de 6 años de experiencia.",
  },
  en: {
    title: "About · Luis Andrés (LANDRES) | Creative Developer & 3D Artist",
    description:
      "Meet Luis Andrés (LANDRES): designs and builds digital products for startups and agencies, UI/UX, web development, 3D and Linux DevOps. 6+ years of experience.",
  },
} as const;

export const Route = createFileRoute("/$lang/about")({
  head: ({ params }) => {
    const lang = params.lang as Locale;
    return buildSeo({ lang, path: "/about", type: "profile", ...ABOUT_SEO[lang] });
  },
  component: AboutPage,
});

function AboutPage() {
  const { lang, t } = useI18n();

  return (
    <main className="grain min-h-screen bg-canvas text-ink">
      {/* Header & Title + profile ID card */}
      <header className="px-6 pb-12 pt-36 md:pt-44">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 border-b border-ink/10 pb-16 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
                {t.aboutPage.title}
              </h1>
              <p className="max-w-3xl text-lg font-light leading-relaxed text-ink/80 md:text-xl text-pretty">
                {t.aboutPage.subtitle}
              </p>
            </div>
            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <IdCard3D />
            </div>
          </div>
        </div>
      </header>

      {/* Brand Visual Showcase Banner */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-ink shadow-2xl transition-all duration-700 hover:shadow-accent/10">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
              <img
                src="/uploads/landres-banner.webp"
                alt="LANDRES · Brand Banner"
                decoding="async"
                {...imageSize("/uploads/landres-banner.webp")}
                className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-canvas/10 bg-ink/90 px-6 py-4 text-canvas/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent font-bold">
                  LANDRES*
                </span>
                <span className="text-canvas/30">|</span>
                <span className="text-xs uppercase tracking-wider text-canvas/70">
                  {t.ui.creativeDirectionTag}
                </span>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-canvas/50">
                {t.ui.visualIdentityBrand}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Approach */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                {t.aboutPage.storyTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-8 md:col-span-8">
              <p className="font-serif text-2xl leading-relaxed text-pretty md:text-3xl">
                {t.aboutPage.storyP1}
              </p>
              <p className="text-base font-light leading-relaxed text-muted text-pretty md:text-lg">
                {t.aboutPage.storyP2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section className="border-t border-ink/10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="flex flex-col gap-6 md:col-span-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                  {t.aboutPage.experienceTitle}
                </h2>
                <p className="mt-4 text-sm font-light leading-relaxed text-ink/70">
                  {t.aboutPage.trustedSubtitle}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="#contact"
                  className="story-link inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
                >
                  <span>{t.aboutPage.partnerCta}</span>
                  <span>→</span>
                </a>

                <a
                  href="/uploads/cv-luis-andres.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="CV_Luis_Andres_Creative_Developer.pdf"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/20 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition-all duration-300 hover:border-accent hover:bg-accent hover:text-canvas hover:scale-105 active:scale-95"
                >
                  <FileText className="size-3.5 text-accent group-hover:text-canvas" />
                  <span>{t.hero.downloadCv || "Descargar CV (PDF)"}</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-12 md:col-span-8">
              {t.aboutPage.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-4 border-b border-ink/10 pb-10 last:border-none"
                >
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <h3 className="font-serif text-2xl tracking-tight text-ink md:text-3xl">
                      {exp.role}
                    </h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
                      {exp.period}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-semibold uppercase tracking-wider text-ink">
                      {exp.company}
                    </span>
                    {exp.location && (
                      <>
                        <span className="text-muted">·</span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                          {exp.location}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-ink/80">{exp.description}</p>

                  <ul className="mt-2 flex flex-col gap-2 pt-2">
                    {exp.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-muted"
                      >
                        <span className="text-accent">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </main>
  );
}
