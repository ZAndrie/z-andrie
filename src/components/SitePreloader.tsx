"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PRELOADER_DONE_EVENT, PRELOADER_SESSION_KEY } from "@/lib/preloader";

const MIN_MS = 1300; // minimum time on screen (first visit of a session)
const MAX_MS = 2600; // hard cap: never block the site longer than this

/**
 * Progress-based intro. Progress reflects real readiness (fonts + window load)
 * but is paced so it never finishes before MIN_MS and never exceeds MAX_MS.
 * Shown once per browser session; skipped entirely afterwards (see the inline
 * script in layout.tsx, which sets data-preloader before first paint).
 */
export default function SitePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    // Returning visitor: CSS (html[data-preloader="skip"]) already hides the overlay.
    if (html.dataset.preloader !== "loading") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 400 : MIN_MS;
    const start = performance.now();

    let fontsReady = false;
    let loaded = document.readyState === "complete";
    document.fonts?.ready.then(() => (fontsReady = true)).catch(() => (fontsReady = true));
    if (!document.fonts) fontsReady = true;
    const onLoad = () => (loaded = true);
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    let p = 0;
    let finishing = false;
    let tl: gsap.core.Timeline | null = null;

    const paint = (v: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      if (numRef.current) numRef.current.textContent = String(Math.round(v)).padStart(3, "0");
    };

    const reveal = () => {
      finishing = true;
      try {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
      } catch {}
      const root = rootRef.current;
      const content = contentRef.current;
      if (!root || !content) {
        html.dataset.preloader = "done";
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
        setGone(true);
        return;
      }
      tl = gsap.timeline({ onComplete: () => setGone(true) });
      if (!window.location.hash || window.location.hash === "#home") {
        window.scrollTo(0, 0);
      }
      if (reduce) {
        tl.to(root, { opacity: 0, duration: 0.3, ease: "none" });
        tl.add(() => {
          html.dataset.preloader = "done";
          window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
        }, 0);
      } else {
        tl.to(content, { opacity: 0, y: -16, duration: 0.35, ease: "power2.in" })
          // Curtain lifts; hero entrance is released halfway through the lift.
          .to(root, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "-=0.05")
          .add(() => {
            html.dataset.preloader = "done";
            window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
          }, "<+=0.35");
      }
    };

    const tick = () => {
      if (finishing) return;
      const elapsed = performance.now() - start;
      const readiness = 12 + (fontsReady ? 48 : 0) + (loaded ? 40 : 0);
      const paced = (elapsed / minMs) * 100;
      const goal = elapsed >= MAX_MS ? 100 : Math.min(readiness, paced);
      p += (goal - p) * 0.14;
      if (goal >= 100 && p > 99.4) p = 100;
      paint(p);
      if (p >= 100) {
        gsap.ticker.remove(tick);
        reveal();
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      tl?.kill();
      // If we unmount mid-intro, never leave the page locked.
      if (html.dataset.preloader === "loading") html.dataset.preloader = "done";
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="site-preloader" role="status" aria-label="Loading">
      <div ref={contentRef} className="site-preloader__content">
        <div className="site-preloader__top">
          <span>Z Andrie</span>
          <span>Portfolio</span>
        </div>
        <div className="site-preloader__center">
          <div className="site-preloader__name font-serif">
            Z<span>.</span>Andrie
          </div>
          <div className="site-preloader__role">Information Technology &amp; Full-Stack Developer</div>
        </div>
        <div className="site-preloader__bottom">
          <div className="site-preloader__track" aria-hidden="true">
            <div ref={barRef} className="site-preloader__bar" />
          </div>
          <div className="site-preloader__meta">
            <span>Philippines</span>
            <span>
              <span ref={numRef}>000</span>%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
