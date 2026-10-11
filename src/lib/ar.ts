import { useEffect, useState } from "react";

export interface ArAssets {
  /** Clean, uncompressed GLB for Android's Scene Viewer. */
  glb: string;
  /** USDZ for iOS Quick Look. */
  usdz: string;
}

export type ArMode = "quick-look" | "scene-viewer" | "unsupported";

/** iOS Safari advertises AR Quick Look by supporting `rel="ar"`. */
function supportsQuickLook() {
  const link = document.createElement("a");
  return !!link.relList?.supports?.("ar");
}

/**
 * Android can only do AR when ARCore (Google Play Services for AR) is present,
 * and `isSessionSupported("immersive-ar")` is the reliable probe for that. If
 * the WebXR API is missing entirely we keep the button: Scene Viewer degrades to
 * a native 3D view on its own, so the tap still lands somewhere sensible.
 */
async function androidHasAr(): Promise<boolean> {
  const xr = navigator.xr;
  if (!xr?.isSessionSupported) return true;
  try {
    return await xr.isSessionSupported("immersive-ar");
  } catch {
    return true;
  }
}

/**
 * iOS exposes AR Quick Look through `rel="ar"`; Android hands the model to the
 * native Scene Viewer. Anything else (desktop, or a phone with no AR at all)
 * reports "unsupported" so the AR entry point never shows where it cannot work.
 */
async function detectArMode(): Promise<ArMode> {
  if (typeof navigator === "undefined" || typeof document === "undefined") return "unsupported";

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) return supportsQuickLook() ? "quick-look" : "unsupported";
  if (/android/i.test(ua)) return (await androidHasAr()) ? "scene-viewer" : "unsupported";
  return "unsupported";
}

/**
 * Resolves on the client only, so server rendering never has to guess. Reports
 * "unsupported" until the probe finishes.
 */
export function useArMode(): ArMode {
  const [mode, setMode] = useState<ArMode>("unsupported");

  useEffect(() => {
    let cancelled = false;
    detectArMode().then((detected) => {
      if (!cancelled) setMode(detected);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return mode;
}
