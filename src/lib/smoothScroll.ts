import type Lenis from "lenis";

/**
 * Shared handle to the single Lenis instance created by <SmoothScroll />.
 * Other components (BackToTop, nav, pinned sections) use scrollToTarget()
 * so they work whether or not Lenis is active (reduced motion, SSR, etc.).
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(
  target: number | string | HTMLElement,
  options: { offset?: number; duration?: number; immediate?: boolean } = {}
) {
  if (instance) {
    instance.scrollTo(target, options);
    return;
  }
  // Fallback: native scrolling
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: options.immediate ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + (options.offset ?? 0);
  window.scrollTo({ top, behavior: options.immediate ? "auto" : "smooth" });
}
