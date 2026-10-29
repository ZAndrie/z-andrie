"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, getLenis } from "@/lib/smoothScroll";
import { PRELOADER_DONE_EVENT } from "@/lib/preloader";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis
 * share one requestAnimationFrame loop (no double RAF, no scrub jitter).
 * Disabled for prefers-reduced-motion users (native scrolling is kept).
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable automatic browser scroll restoration so visitors always start at the top
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices keep native momentum scrolling (smoother and cheaper).
      syncTouch: false,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // If opening the portfolio root without a specific non-home hash, ensure we start at the top
    const hash = window.location.hash;
    if (!hash || hash === "#home" || hash === "#") {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true, force: true });
    }

    // Pause the loop while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) lenis.stop();
      else lenis.start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Recompute scroll coordinates on preloader completion and viewport resize
    const onPreloaderDone = () => {
      if (!window.location.hash || window.location.hash === "#home") {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      ScrollTrigger.refresh();
    };
    window.addEventListener(PRELOADER_DONE_EVENT, onPreloaderDone);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener(PRELOADER_DONE_EVENT, onPreloaderDone);
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Reset scroll to top on route change (Lenis keeps its own target position).
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
