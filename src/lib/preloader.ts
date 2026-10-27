/**
 * Preloader state lives on <html data-preloader="...">:
 *   "loading" – first visit this session, overlay is up, scroll locked
 *   "done"    – overlay is revealing/has revealed (hero may animate in)
 *   "skip"    – already seen this session, overlay never shown
 * An inline script in <head> sets "loading" | "skip" before first paint.
 */
export const PRELOADER_SESSION_KEY = "za:intro-seen";
export const PRELOADER_DONE_EVENT = "preloader:done";

/** Inline script (runs before paint, so returning visitors never see a flash). */
export const preloaderInitScript = `(function(){var r=document.documentElement;try{r.dataset.preloader=sessionStorage.getItem("${PRELOADER_SESSION_KEY}")?"skip":"loading"}catch(e){r.dataset.preloader="skip"}})();`;

/**
 * Run `cb` once the page is revealed (immediately if the preloader is not
 * active). Returns a cleanup function. Use this to defer entrance animations.
 */
export function whenRevealed(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  if (document.documentElement.dataset.preloader !== "loading") {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(PRELOADER_DONE_EVENT, handler, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE_EVENT, handler);
}
