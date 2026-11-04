"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { PRELOADER_DONE_EVENT, PRELOADER_SESSION_KEY } from "@/lib/preloader";

const MIN_MS = 1400; // refined pacing to appreciate atmosphere
const MAX_MS = 2600; // maximum cap for slower devices

/**
 * Procedural Web Audio API:
 * Modern harmonic power chime (soft sine wave harmonic interval C4 -> G4 -> C5).
 * Non-intrusive, sleek, and elegant.
 */
function playModernEnterAudio() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic warm chords (sine wave, soft attack, smooth decay)
    const freqs = [261.63, 392.0, 523.25];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.04, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.6);
    });
  } catch {}
}

export default function SitePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const [gone, setGone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isRevealedRef = useRef(false);

  // Trigger experience reveal
  const triggerExperienceStart = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;

    try {
      sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    } catch {}

    const html = document.documentElement;
    const root = rootRef.current;
    const content = contentRef.current;

    playModernEnterAudio();

    if (!root || !content) {
      html.dataset.preloader = "done";
      window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      setGone(true);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
      },
    });

    if (!window.location.hash || window.location.hash === "#home") {
      window.scrollTo(0, 0);
    }

    if (reduce) {
      tl.to(root, { opacity: 0, duration: 0.4, ease: "none" });
      tl.add(() => {
        html.dataset.preloader = "done";
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      }, 0);
    } else {
      // Sleek modern dissolve: content lifts up slightly and fades smoothly
      tl.to(content, {
        y: -15,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        root,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.25"
      )
      .add(() => {
        html.dataset.preloader = "done";
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      }, "-=0.3");
    }
  }, []);

  // Intercept and lock scroll events completely while preloader is active
  useEffect(() => {
    if (gone) return;

    window.scrollTo(0, 0);

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (scrollKeys.includes(e.key)) {
        if (e.key === " " && isReady) {
          // Allow spacebar to trigger launch
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
  }, [gone, isReady]);

  // Keyboard accessibility: Spacebar or Enter launches experience
  useEffect(() => {
    if (!isReady || isRevealedRef.current) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        triggerExperienceStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, triggerExperienceStart]);

  useEffect(() => {
    const html = document.documentElement;
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

    const paint = (v: number) => {
      const rounded = Math.round(v);
      if (numRef.current) numRef.current.textContent = String(rounded).padStart(2, "0");
      if (progressBarRef.current) progressBarRef.current.style.width = `${v}%`;

      if (statusRef.current) {
        if (rounded < 28) {
          statusRef.current.textContent = "INITIALIZING ARCHITECTURE";
        } else if (rounded < 58) {
          statusRef.current.textContent = "RENDERING 3D WORKSPACE";
        } else if (rounded < 88) {
          statusRef.current.textContent = "CALIBRATING TELEMETRY";
        } else if (rounded < 100) {
          statusRef.current.textContent = "FINALIZING ASSETS";
        } else {
          statusRef.current.textContent = "SYSTEM READY";
        }
      }
    };

    const tick = () => {
      if (isRevealedRef.current) return;
      const elapsed = performance.now() - start;
      const readiness = 14 + (fontsReady ? 46 : 0) + (loaded ? 40 : 0);
      const paced = (elapsed / minMs) * 100;
      const goal = elapsed >= MAX_MS ? 100 : Math.min(readiness, paced);
      p += (goal - p) * 0.14;

      if (goal >= 100 && p > 99.4) p = 100;
      paint(p);

      if (p >= 100) {
        gsap.ticker.remove(tick);
        setIsReady(true);
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      if (html.dataset.preloader === "loading") html.dataset.preloader = "done";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={`site-preloader fixed inset-0 z-[100000] overflow-hidden select-none text-[#e7e5df] flex flex-col items-center justify-between p-8 md:p-12 ${
        isReady ? "cursor-default" : "cursor-wait"
      }`}
      role="status"
      aria-label="Portfolio Loading"
    >
      {/* ── AMBIENT WARM SPOTLIGHT POOL MATCHING 3D ROOM LAMP ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 221, 184, 0.12) 0%, rgba(211, 107, 84, 0.04) 45%, transparent 70%)",
        }}
      />

      {/* Top Header: Telemetry & Status */}
      <div className="relative z-20 w-full max-w-[1400px] flex justify-between items-center text-[10px] md:text-[11px] font-mono tracking-[2px] text-[#888] uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-pulse" />
          <span>PORTFOLIO // 2026</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[#666]">
          <span>PHILIPPINES (GMT+8)</span>
          <span>•</span>
          <span>3D SCENE: ACTIVE</span>
        </div>
      </div>

      {/* ── CENTER STAGE: SLEEK & REFINED LUXURY INTRO ── */}
      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-[560px] mx-auto flex flex-col items-center text-center my-auto"
      >
        {/* Sleek Subtitle Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-[11px] font-mono tracking-[2.5px] uppercase text-[#a8a59d] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Creative Technologist</span>
        </div>

        {/* Clean Modern Title */}
        <h1 className="font-heading text-[48px] sm:text-[68px] md:text-[84px] font-bold uppercase text-[#ffffff] tracking-tight leading-[0.92] drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          Z <span className="text-[#d36b54]">ANDRIE</span>
        </h1>

        <p className="text-[13px] sm:text-[14px] text-[#9ca3af] max-w-[400px] mt-3 leading-relaxed font-sans font-light">
          Architecting modern digital experiences, 3D interactive interfaces, and scalable full-stack systems.
        </p>

        {/* ── SLEEK MINIMAL PROGRESS METER ── */}
        <div className="w-full max-w-[360px] mx-auto mt-8 mb-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[11px] font-mono tracking-[1.5px] text-[#888] uppercase">
            <span ref={statusRef} className="flex items-center gap-1.5 text-[#a8a59d]">
              INITIALIZING ARCHITECTURE
            </span>
            <span className="text-white font-medium">
              <span ref={numRef}>00</span>%
            </span>
          </div>

          {/* Hairline Sleek Track */}
          <div className="w-full h-[2px] bg-white/[0.08] rounded-full overflow-hidden relative">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#d36b54] to-[#f4ddb8] transition-all duration-75 ease-out rounded-full"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* ── ENTER ACTION BUTTON ── */}
        <div className="mt-4 flex flex-col items-center gap-2 min-h-[50px] justify-center">
          {isReady ? (
            <button
              type="button"
              onClick={triggerExperienceStart}
              className="group relative px-8 py-3 rounded-full bg-white/[0.06] hover:bg-[#d36b54] border border-white/[0.15] hover:border-[#d36b54] text-[#ffffff] text-[12px] font-mono uppercase tracking-[2px] font-medium transition-all duration-300 shadow-[0_0_30px_rgba(211,107,84,0.3)] hover:shadow-[0_0_40px_rgba(211,107,84,0.6)] cursor-pointer flex items-center gap-3 animate-in fade-in"
            >
              <span>ENTER EXPERIENCE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.12] text-[#f4ddb8] border border-white/[0.1] font-mono">
                SPACE
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[1.5px] uppercase text-[#666]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-ping" />
              <span>PREPARING ENVIRONMENT...</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Telemetry */}
      <div className="relative z-20 w-full max-w-[1400px] flex justify-between items-center text-[10px] font-mono tracking-[1.5px] text-[#666] uppercase">
        <span>LAMPLIGHT 2700K</span>
        <span>EXPERIENCE DESIGN © 2026</span>
      </div>
    </div>
  );
}
