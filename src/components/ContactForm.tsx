import React, { useRef, useState } from "react";
import { CalendarClock, Video } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CALENDLY_URL } from "@/lib/links";

export function ContactForm() {
  const { t, lang } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(["web"]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  // Spam mitigation without a third-party captcha: an off-screen honeypot field
  // plus a minimum time-on-form check (bots submit almost instantly).
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef(Date.now());

  const directEmail = "landres.creative@gmail.com";

  // Auto-reply sent to the person who writes. Keeps the conversation warm even
  // if the reply from Luis takes a few hours.
  const autoReply =
    lang === "en"
      ? "Thanks for reaching out! I received your message and will get back to you within 24 hours. In the meantime, feel free to browse my work at https://www.landrescreative.com\n\nLuis Andrés · LANDRES"
      : "¡Gracias por escribirme! Recibí tu mensaje y te responderé en menos de 24 horas. Mientras tanto, puedes ver mi trabajo en https://www.landrescreative.com\n\nLuis Andrés · LANDRES";

  const serviceOptions: { key: "web" | "ui" | "devops" | "other"; label: string }[] = [
    { key: "web", label: t.contact.services.web },
    { key: "ui", label: t.contact.services.ui },
    { key: "devops", label: t.contact.services.devops },
    { key: "other", label: t.contact.services.other },
  ];

  const toggleService = (key: string) => {
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Silently accept (and drop) obvious bot submissions.
    if (honeypot.trim() !== "" || Date.now() - mountedAt.current < 2500) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    const servicesText =
      selectedServices.map((k) => serviceOptions.find((s) => s.key === k)?.label || k).join(", ") ||
      "General";

    try {
      const response = await fetch("https://formsubmit.co/ajax/landres.creative@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Nuevo mensaje de ${name} · Portafolio`,
          _template: "table",
          _captcha: "false",
          _autoresponse: autoReply,
          Nombre: name,
          Email: email,
          Servicios: servicesText,
          Mensaje: message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback: abrir cliente de correo directamente si el endpoint falla
        const mailtoLink = `mailto:landres.creative@gmail.com?subject=${encodeURIComponent(
          `Nuevo Proyecto / Consulta - ${name}`,
        )}&body=${encodeURIComponent(
          `Nombre: ${name}\nEmail: ${email}\nServicios: ${servicesText}\n\nMensaje:\n${message}`,
        )}`;
        window.location.href = mailtoLink;
        setIsSubmitted(true);
      }
    } catch {
      const mailtoLink = `mailto:landres.creative@gmail.com?subject=${encodeURIComponent(
        `Nuevo Proyecto / Consulta - ${name}`,
      )}&body=${encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\nServicios: ${servicesText}\n\nMensaje:\n${message}`,
      )}`;
      window.location.href = mailtoLink;
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center rounded-[min(1vw,20px)] border border-canvas/10 bg-canvas/5 p-10 text-center backdrop-blur-md md:p-16">
          <div className="mb-4 grid size-14 place-items-center rounded-full bg-accent/20 text-accent">
            <svg
              className="size-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="font-serif text-3xl tracking-tight text-canvas md:text-4xl">
            {t.contact.tagline}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-canvas/70">
            {t.contact.successMessage}
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-8 rounded-full border border-canvas/20 px-6 py-2 text-xs uppercase tracking-widest text-canvas transition-colors hover:bg-canvas hover:text-ink"
          >
            ← {t.contact.titleLine1}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-left">
          {/* Honeypot: invisible to humans, tempting to bots. */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="company-website">Company</label>
            <input
              id="company-website"
              type="text"
              name="company-website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Free 1st Consultation Banner + direct booking */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-3 text-xs font-medium tracking-wide text-canvas shadow-sm backdrop-blur-md">
              <Video className="size-4 shrink-0 text-accent" />
              <span>{t.contact.freeCallBadge}</span>
            </div>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-canvas/70 transition-colors hover:text-accent"
            >
              <CalendarClock className="size-4 shrink-0" />
              {t.process.ctaButton}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Service Selector Pills */}
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-canvas/60">
              {t.contact.serviceLabel}
            </label>
            <div className="flex flex-wrap justify-center gap-2.5 sm:justify-start">
              {serviceOptions.map((s) => {
                const isSelected = selectedServices.includes(s.key);
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggleService(s.key)}
                    className={`rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                      isSelected
                        ? "bg-accent text-canvas shadow-md"
                        : "border border-canvas/15 bg-canvas/5 text-canvas/70 hover:bg-canvas/10 hover:text-canvas"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Email inputs */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-canvas/60">
                {t.contact.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.namePlaceholder}
                className="w-full rounded-2xl border border-canvas/15 bg-canvas/5 px-5 py-4 text-sm text-canvas placeholder:text-canvas/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-canvas/60">
                {t.contact.emailLabel} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                className="w-full rounded-2xl border border-canvas/15 bg-canvas/5 px-5 py-4 text-sm text-canvas placeholder:text-canvas/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Message textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-canvas/60">
              {t.contact.messageLabel} *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.contact.messagePlaceholder}
              className="w-full rounded-2xl border border-canvas/15 bg-canvas/5 px-5 py-4 text-sm text-canvas placeholder:text-canvas/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Submit Button & Direct Email Copy */}
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-accent px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-canvas shadow-lg transition-all duration-300 hover:bg-canvas hover:text-ink sm:w-auto"
            >
              {isSubmitting ? t.contact.submittingBtn : t.contact.submitBtn}
            </button>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-canvas/20 px-6 py-3.5 text-xs uppercase tracking-widest text-canvas/70 transition-colors hover:border-canvas hover:text-canvas"
            >
              <span>{copiedEmail ? "✓ " + t.contact.emailCopied : directEmail}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
