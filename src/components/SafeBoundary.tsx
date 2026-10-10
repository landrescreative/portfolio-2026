import React from "react";
import { markHeroModelReady } from "@/lib/heroModel";

type Props = { children: React.ReactNode; fallback?: React.ReactNode };
type State = { failed: boolean };

/**
 * Keeps an optional enhancement (the hero 3D character, the project 3D viewer)
 * from taking down the page when its asset fails to load. On failure it renders
 * `fallback` (or nothing) and releases the preloader so the visitor is never
 * stuck waiting for a model that will never arrive.
 */
export class SafeBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[SafeBoundary] enhancement failed to load:", error);
    markHeroModelReady();
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
