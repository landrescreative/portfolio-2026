/**
 * Tiny module-level store that signals when the hero's 3D character is fully
 * loaded AND has rendered at least one frame. The `Preloader` listens to this
 * so the interface is only revealed once the model is actually on screen.
 *
 * Kept outside React so `HeroCanvas` (mounted deep in the hero) and `Preloader`
 * (mounted at the root) can talk without threading props/context through the
 * whole tree. Also works across remounts / StrictMode double-invocation.
 */
type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

export function markHeroModelReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function isHeroModelReady() {
  return ready;
}

/** Subscribe to the ready signal. Fires immediately if it already happened. */
export function onHeroModelReady(listener: Listener) {
  if (ready) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
