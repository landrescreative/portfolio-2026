import { useMemo } from "react";
import { Box } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ArAssets, ArMode } from "@/lib/ar";

/** Scene Viewer intent link. https://developers.google.com/ar/develop/scene-viewer */
function sceneViewerIntent(glbUrl: string, title: string) {
  const absolute = new URL(glbUrl, window.location.origin).href;
  const query = new URLSearchParams({ file: absolute, mode: "ar_preferred", title });
  // If the Google app is missing or too old, Chrome follows this URL. Pointing
  // it at the project page means the visitor lands back on the interactive 3D
  // viewer instead of a raw file download.
  const fallback = encodeURIComponent(window.location.href);
  return (
    `intent://arvr.google.com/scene-viewer/1.0?${query.toString()}` +
    "#Intent;scheme=https;package=com.google.android.googlequicksearchbox;" +
    `action=android.intent.action.VIEW;S.browser_fallback_url=${fallback};end;`
  );
}

const PILL = {
  height: 46,
  paddingLeft: 16,
  icon: 24,
  gap: 10,
  fontSize: 14.5,
  color: "#ff4d00",
  text: "#f5f3ee",
};

/**
 * Quick Look renders the `<img>` inside the link as the AR button, so the label
 * is baked into an inline SVG styled to match the site's pill buttons.
 */
function quickLookPoster(label: string) {
  const width = Math.round(
    PILL.paddingLeft + PILL.icon + PILL.gap + label.length * 8.6 + PILL.paddingLeft,
  );
  const textX = PILL.paddingLeft + PILL.icon + PILL.gap;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${PILL.height}" ` +
    `viewBox="0 0 ${width} ${PILL.height}">` +
    `<rect width="${width}" height="${PILL.height}" rx="${PILL.height / 2}" fill="${PILL.color}"/>` +
    `<g transform="translate(${PILL.paddingLeft} 11)" fill="none" stroke="${PILL.text}" ` +
    `stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>` +
    `<path d="m3.3 7 8.7 5 8.7-5"/>` +
    `<path d="M12 22V12"/>` +
    `</g>` +
    `<text x="${textX}" y="29" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" ` +
    `font-size="${PILL.fontSize}" font-weight="600" letter-spacing="0.8" fill="${PILL.text}">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * "View in AR" entry point for the 3D models. Uses the platform's own viewer
 * (AR Quick Look on iOS, Scene Viewer on Android) so nothing extra is bundled
 * and the visitor never leaves the portfolio for the regular 3D view.
 */
export function ArButton({
  assets,
  title,
  mode,
}: {
  assets?: ArAssets;
  title: string;
  mode: ArMode;
}) {
  const { t } = useI18n();
  const label = t.ui.viewInAr;

  const intent = useMemo(
    () => (mode === "scene-viewer" && assets ? sceneViewerIntent(assets.glb, title) : ""),
    [mode, assets, title],
  );

  if (!assets || mode === "unsupported") return null;

  if (mode === "quick-look") {
    return (
      <a
        rel="ar"
        href={assets.usdz}
        aria-label={label}
        className="inline-flex shadow-lg transition-transform duration-300 hover:scale-105"
      >
        <img
          src={quickLookPoster(label.toUpperCase())}
          alt={label}
          height={PILL.height}
          className="h-[46px] w-auto"
        />
      </a>
    );
  }

  return (
    <a
      href={intent}
      className="inline-flex items-center gap-2.5 rounded-full bg-accent px-[18px] py-[11px] text-xs font-bold uppercase tracking-wider text-canvas shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <Box className="size-4" />
      {label}
    </a>
  );
}

export default ArButton;
