import { Github, Instagram, Layers, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ContactForm } from "@/components/ContactForm";

const SOCIAL_LINKS = [
  { name: "Behance", href: "https://behance.net/luishernandez303", icon: Layers },
  { name: "Instagram", href: "https://instagram.com/landrescreative", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/in/landrescreative", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/landrescreative", icon: Github },
];

export type ContactSectionProps = {
  /** Anchor id (defaults to "contact"). */
  id?: string;
  /** Optional override for the small badge above the headline. */
  badge?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  /** Render the contact form. */
  showForm?: boolean;
  /** Render the email + social links + copyright block. */
  showContactInfo?: boolean;
  /** Wrapper classes around the form (e.g. to constrain width). */
  formContainerClassName?: string;
  /** Enable the scroll-reveal animation (only if the page runs an observer). */
  reveal?: boolean;
};

/**
 * Shared contact / CTA footer used across the site. Extracted so the home page
 * and the dedicated `/contact` page render identical markup.
 */
export function ContactSection({
  id = "contact",
  badge,
  titleLine1,
  titleLine2,
  subtitle,
  showForm = true,
  showContactInfo = true,
  formContainerClassName = "w-full",
  reveal = false,
}: ContactSectionProps) {
  const { t } = useI18n();
  const r = reveal ? "reveal " : "";

  return (
    <footer
      id={id}
      className="rounded-t-[min(2.5vw,36px)] bg-ink px-6 pb-12 pt-32 text-canvas shadow-2xl"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-16 text-center">
          {/* Headline Callout */}
          <div className={`${r}flex flex-col items-center gap-6`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-canvas/15 bg-canvas/5 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-canvas/70">
                {badge ?? t.contact.badge}
              </span>
            </div>
            <h2 className="font-serif text-5xl leading-[0.88] tracking-tighter text-balance text-canvas md:text-7xl lg:text-8xl">
              {titleLine1 ?? t.contact.titleLine1}
              <br />
              <span className="italic text-accent">{titleLine2 ?? t.contact.titleLine2}</span>
            </h2>
            <p className="max-w-2xl text-base font-light leading-relaxed text-pretty text-canvas/70 md:text-lg">
              {subtitle ?? t.contact.subtitle}
            </p>
          </div>

          {/* What happens next, sets expectations and reduces friction */}
          <div className={`${r}flex w-full max-w-4xl flex-col gap-6`}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-canvas/60">
              {t.contact.next.title}
            </span>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-canvas/10 bg-canvas/10 sm:grid-cols-3">
              {t.contact.next.steps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 bg-ink px-6 py-6 text-left">
                  <span className="font-mono text-[11px] font-bold tracking-widest text-accent">
                    0{idx + 1}
                  </span>
                  <span className="text-base font-semibold tracking-tight text-canvas sm:text-lg">
                    {step.title}
                  </span>
                  <span className="text-xs leading-relaxed text-canvas/60">{step.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Form Component */}
          {showForm && (
            <div className={`${r}${formContainerClassName}`}>
              <ContactForm />
            </div>
          )}

          {/* Bottom Links & Copyright */}
          {showContactInfo && (
            <div
              className={`${r}flex w-full flex-col items-center justify-between gap-8 border-t border-canvas/10 pt-12 text-center md:flex-row md:text-left`}
            >
              <div className="flex flex-col items-center gap-4 md:items-start">
                <a
                  href="mailto:landres.creative@gmail.com"
                  className="story-link font-serif text-2xl tracking-tight text-canvas md:text-4xl"
                >
                  landres.creative@gmail.com
                </a>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {SOCIAL_LINKS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-canvas/60 transition-colors hover:text-accent"
                      >
                        <Icon className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
                        {s.name}
                      </a>
                    );
                  })}
                </div>
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-canvas/50">
                {t.contact.copyright}
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
