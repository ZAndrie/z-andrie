"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { PRELOADER_DONE_EVENT, PRELOADER_SESSION_KEY } from "@/lib/preloader";

const MIN_MS = 1400; // minimum duration to appreciate boot sequence
const MAX_MS = 2800; // maximum cap for slower devices

/**
 * Procedural Web Audio API: 
 * 1. Retro 8-bit game start rising arpeggio chime (C5 -> E5 -> G5 -> C6).
 * 2. CRT monitor degauss power-on surge.
 * Zero external audio files, zero network delay.
 */
function playGamerStartAudio() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Retro 8-bit game start fanfare (classic rising triad arpeggio: C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square"; // authentic 8-bit chiptune sound
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);

      gain.gain.setValueAtTime(0.08, now + idx * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.18);
    });

    // 2. CRT degauss low-frequency power surge
    const degauss = ctx.createOscillator();
    const dGain = ctx.createGain();
    degauss.type = "sawtooth";
    degauss.frequency.setValueAtTime(140, now);
    degauss.frequency.exponentialRampToValueAtTime(45, now + 0.45);

    dGain.gain.setValueAtTime(0.14, now);
    dGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    // Warm analog low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, now);

    degauss.connect(filter);
    filter.connect(dGain);
    dGain.connect(ctx.destination);
    degauss.start(now);
    degauss.stop(now + 0.45);
  } catch {}
}

export default function SitePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const botSpriteRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const [gone, setGone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isRevealedRef = useRef(false);

  // Trigger game start / system launch
  const triggerGameStart = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;

    try {
      sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    } catch {}

    const html = document.documentElement;
    const root = rootRef.current;
    const content = contentRef.current;
    const flash = flashRef.current;

    playGamerStartAudio();

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
      // 1. CRT Flash & Degauss pulse
      if (flash) {
        tl.to(flash, { opacity: 0.9, duration: 0.08, ease: "power2.out" })
          .to(flash, { opacity: 0, duration: 0.45, ease: "power3.inOut" }, "+=0.02");
      }

      // 2. HUD Content scales outward with digital CRT scanline collapse
      tl.to(content, {
        scale: 1.06,
        opacity: 0,
        filter: "blur(4px)",
        duration: 0.4,
        ease: "power2.in",
      }, 0.05);

      // 3. Preloader overlay dissolves completely to seamlessly reveal the 3D room
      tl.to(root, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }, 0.15)
      .add(() => {
        html.dataset.preloader = "done";
        window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      }, "<+=0.25");
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
          // Allow spacebar to trigger game start
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

  // Keyboard accessibility: Spacebar or Enter launches the game when ready
  useEffect(() => {
    if (!isReady || isRevealedRef.current) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        triggerGameStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, triggerGameStart]);

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
      if (numRef.current) numRef.current.textContent = String(rounded).padStart(3, "0");
      if (progressBarRef.current) progressBarRef.current.style.width = `${v}%`;
      if (botSpriteRef.current) botSpriteRef.current.style.left = `${Math.min(96, Math.max(4, v))}%`;

      // Dynamic indie game loading status
      if (statusRef.current) {
        if (rounded < 25) {
          statusRef.current.textContent = "BREWING PIXEL COFFEE...";
        } else if (rounded < 50) {
          statusRef.current.textContent = "WAKING UP COMPANION BOT...";
        } else if (rounded < 75) {
          statusRef.current.textContent = "TUNING CRT TERMINAL...";
        } else if (rounded < 98) {
          statusRef.current.textContent = "RENDERING ISOMETRIC WORLD...";
        } else {
          statusRef.current.textContent = "► READY TO PLAY! ◄";
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
        // Strictly manual gate: waits for user to press START or SPACE
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
      className={`site-preloader fixed inset-0 z-[100000] overflow-hidden select-none text-[#e7e5df] flex flex-col items-center justify-center p-6 ${
        isReady ? "cursor-default" : "cursor-wait"
      }`}
      role="status"
      aria-label="Indie Gamer System Loading"
    >
      {/* ── RETRO CRT SCANLINES & SCREEN VIGNETTE ── */}
      <div className="gamer-scanlines" />
      <div className="gamer-crt-vignette" />

      {/* ── AMBIENT SPOTLIGHT GLOW MATCHING 3D ROOM LAMP ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 221, 184, 0.12) 0%, rgba(211, 107, 84, 0.04) 45%, transparent 70%)",
        }}
      />

      {/* ── CENTER STAGE: CLEAN & MINIMALIST INDIE GAME INTRO ── */}
      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-[540px] mx-auto flex flex-col items-center text-center"
      >
        {/* Indie Title */}
        <h1 className="font-stencil text-[56px] sm:text-[84px] md:text-[104px] font-black uppercase text-[#e7e5df] tracking-tight leading-[0.88] drop-shadow-[0_0_30px_rgba(244,221,184,0.22)]">
          Z <span className="text-[#d36b54]">ANDRIE</span>
        </h1>

        <p className="font-['Silkscreen'] text-[11px] sm:text-[13px] tracking-[3px] uppercase text-[#a8a59d] mt-3">
          Creative Developer
        </p>

        {/* ── THE INDIE GAME COMPANION BOT RUNNER & PIXEL LOADING BAR ── */}
        <div className="relative w-full max-w-[420px] mx-auto mt-8 mb-4">
          {/* Top Labels */}
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-['Silkscreen'] uppercase tracking-[2px] text-[#888] mb-2 px-1">
            <span className="text-[#f4ddb8] flex items-center gap-2">
              <span className="text-[#d36b54] text-[12px] animate-pulse">💾</span>
              <span>LOADING...</span>
            </span>
            <span className="text-[#f4ddb8] font-bold">
              [ <span ref={numRef}>000</span>% ]
            </span>
          </div>

          {/* The Outer Chunky Pixel Bezel Track */}
          <div className="relative p-1 bg-[#0e0c0a] border-2 border-[#52412e] rounded shadow-[0_0_20px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(0,0,0,0.8)]">
            {/* Inner Recessed Channel with Pixel Ticks */}
            <div className="relative w-full h-4 sm:h-5 bg-[#14110e] rounded-xs overflow-hidden border border-[#2a2016]">
              {/* Background Pixel Grid Ticks */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25 z-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #52412e 0px, #52412e 1px, transparent 1px, transparent 16px)",
                }}
              />

              {/* Progress Fill Bar */}
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-[#8c2e1b] via-[#d36b54] to-[#f4ddb8] relative transition-all duration-75 ease-out shadow-[0_0_14px_#d36b54]"
                style={{
                  width: "0%",
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 3px, transparent 3px, transparent 6px)",
                }}
              >
                {/* Leading Edge Spark Flare */}
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#ffffff] shadow-[0_0_12px_#ffffff,0_0_20px_#f4ddb8] animate-pulse" />
              </div>
            </div>

            {/* Moving Companion Bot Sprite */}
            <div
              ref={botSpriteRef}
              className="absolute -top-11 -translate-x-1/2 pointer-events-none transition-all duration-75 ease-out z-20 flex flex-col items-center"
              style={{ left: "4%" }}
            >
              {/* Speech Bubble */}
              {isReady ? (
                <div className="px-2 py-0.5 rounded bg-[#f4ddb8] text-[#0a0806] font-['Silkscreen'] text-[8px] font-bold tracking-wider mb-1 animate-bounce shadow-[0_0_10px_#f4ddb8]">
                  READY!
                </div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-ping mb-1" />
              )}

              {/* Bot Body (Matches 3D Room Companion Robot) */}
              <div className="relative w-8 h-6 bg-[#25201a] border-2 border-[#b88c4b] rounded-xs shadow-[0_0_12px_rgba(244,221,184,0.4)] flex items-center justify-center">
                {/* Antenna */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-[#8c6534]">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-pulse" />
                </div>

                {/* Screen Face */}
                <div className="w-6 h-4 bg-[#0a0907] border border-[#4a3922] rounded-[1px] flex items-center justify-around px-0.5">
                  {isReady ? (
                    <>
                      <span className="text-[#f4ddb8] text-[8px] font-bold">★</span>
                      <span className="text-[#f4ddb8] text-[8px] font-bold">★</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_#4ade80] animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_#4ade80] animate-pulse" />
                    </>
                  )}
                </div>
              </div>

              {/* Thruster Flame */}
              <div className="w-3 h-1 bg-gradient-to-b from-[#d36b54] to-transparent rounded-full animate-pulse" />
            </div>
          </div>

          {/* Bottom Sub-Label: Loading Ticker */}
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-['Silkscreen'] uppercase tracking-[2px] text-[#888] mt-2 px-1">
            <span className="text-[#777] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span ref={statusRef}>BREWING PIXEL COFFEE...</span>
            </span>
            <span className="text-[#d36b54] hidden sm:inline-block">
              [ BOT-01 ]
            </span>
          </div>
        </div>

        {/* ── INTERACTIVE START ACTION CUE ── */}
        <div className="mt-4 flex flex-col items-center gap-2">
          {isReady ? (
            <>
              <button
                type="button"
                onClick={triggerGameStart}
                className="group relative px-9 sm:px-11 py-3.5 rounded border-2 border-[#f4ddb8] bg-[#161311] hover:bg-[#d36b54] text-[#f4ddb8] hover:text-white hover:border-[#d36b54] active:scale-95 transition-all duration-200 font-['Silkscreen'] text-[13px] sm:text-[14px] uppercase tracking-[3px] font-bold shadow-[0_0_25px_rgba(244,221,184,0.35)] hover:shadow-[0_0_35px_rgba(211,107,84,0.7)] cursor-pointer flex items-center gap-2.5 animate-pulse hover:animate-none"
              >
                <span className="text-[#4ade80] animate-bounce">►</span>
                <span>START GAME</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4ddb8]/20 group-hover:bg-white/20 text-[#f4ddb8] group-hover:text-white border border-[#f4ddb8]/40 font-mono">
                  SPACE
                </span>
              </button>

              <div className="text-[9px] sm:text-[10px] font-['Silkscreen'] tracking-[2px] uppercase text-[#7a756f] mt-1">
                [ PRESS SPACEBAR OR CLICK TO START ]
              </div>
            </>
          ) : (
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-['Silkscreen'] uppercase tracking-[2px] text-[#777] mt-2">
              <span className="w-2 h-2 rounded-full bg-[#d36b54] animate-ping" />
              <span>LOADING DEV WORLD...</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CRT IGNITION FLASH OVERLAY ── */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-[100010] bg-[#fff6e6] opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
