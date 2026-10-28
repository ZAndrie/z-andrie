"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { PRELOADER_DONE_EVENT, PRELOADER_SESSION_KEY } from "@/lib/preloader";

const MIN_MS = 1400; // minimum duration to appreciate boot sequence
const MAX_MS = 2800; // maximum cap for slower devices
const SEGMENT_COUNT = 24; // 24-segment retro health/EXP bar

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
  const numRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const [gone, setGone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeSegments, setActiveSegments] = useState(0);
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

      const segs = Math.min(SEGMENT_COUNT, Math.floor((v / 100) * SEGMENT_COUNT));
      setActiveSegments(segs);

      // Dynamic indie game console status
      if (statusRef.current) {
        if (rounded < 25) {
          statusRef.current.textContent = "READING CARTRIDGE ROM [Z-ANDRIE.SYS]...";
        } else if (rounded < 50) {
          statusRef.current.textContent = "COMPILING 3D WORLD SHADERS [THREE.JS]...";
        } else if (rounded < 75) {
          statusRef.current.textContent = "CALIBRATING CRT PHOSPHOR TERMINAL...";
        } else if (rounded < 98) {
          statusRef.current.textContent = "SYNCING COMPANION BOT & STEREO AUDIO...";
        } else {
          statusRef.current.textContent = "SYSTEM READY // PLAYER 1 READY";
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
      className={`site-preloader fixed inset-0 z-[100000] overflow-hidden select-none text-[#e7e5df] ${
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 221, 184, 0.14) 0%, rgba(211, 107, 84, 0.04) 45%, transparent 70%)",
        }}
      />

      {/* ── CORNER HUD BRACKETS ── */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#f4ddb8]/40 pointer-events-none z-20" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#f4ddb8]/40 pointer-events-none z-20" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#f4ddb8]/40 pointer-events-none z-20" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#f4ddb8]/40 pointer-events-none z-20" />

      {/* ── CENTER STAGE INDIE GAMER HUD ── */}
      <div
        ref={contentRef}
        className="relative z-20 w-full h-full max-w-[1280px] mx-auto px-6 md:px-12 py-10 sm:py-16 flex flex-col justify-between"
      >
        {/* Top Gamer Header Marquee */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-[2.5px] text-[#888] pt-2">
          <div className="flex items-center gap-2 border-b border-[#2b2520] pb-1">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[#e7e5df]">CARTRIDGE: Z-ANDRIE.SYS</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#f4ddb8]/80">
            <span>[ INDIE LAB // PHILIPPINES 2026 ]</span>
          </div>
          <div className="flex items-center gap-2 border-b border-[#2b2520] pb-1">
            <span className="text-[#d36b54]">CREDITS: 01</span>
            <span>•</span>
            <span className="text-[#888]">60 FPS</span>
          </div>
        </div>

        {/* Centerpiece: Indie Game Title, Console Diagnostics & Start Deck */}
        <div className="flex flex-col items-center text-center my-auto py-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded bg-[#161311] border border-[#d36b54]/40 text-[10px] sm:text-[11px] font-mono tracking-[3px] uppercase text-[#f4ddb8] mb-4 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-ping" />
            <span>LEVEL 1 // DIGITAL ARCHIVE</span>
          </div>

          {/* Stencil / Pixel Hero Title */}
          <h1 className="font-stencil text-[52px] sm:text-[80px] md:text-[108px] lg:text-[124px] font-black uppercase text-[#e7e5df] tracking-tight leading-[0.88] drop-shadow-[0_0_35px_rgba(244,221,184,0.22)]">
            Z <span className="text-[#d36b54]">ANDRIE</span>
          </h1>

          <p className="text-[12px] sm:text-[14px] md:text-[15px] font-mono tracking-[2.5px] uppercase text-[#a8a59d] mt-4 max-w-[650px]">
            Creative Developer • Full-Stack Technologist
          </p>

          {/* Retro Boot Diagnostics Terminal (Matches CRT Monitor in 3D Room!) */}
          <div className="w-full max-w-[560px] mx-auto mt-6 p-4 rounded bg-[#0c0b0a]/90 border border-[#2b2520] font-mono text-left shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#201c18] text-[10px] uppercase tracking-[2px] text-[#777]">
              <span className="flex items-center gap-1.5 text-[#4ade80]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                SYSTEM BOOT CONSOLE
              </span>
              <span>MEM: 640KB // OK</span>
            </div>
            <div className="space-y-1.5 text-[11px] tracking-[1.5px] text-[#a8a59d]">
              <div className="flex justify-between">
                <span>&gt; ENVIRONMENT:</span>
                <span className="text-[#f4ddb8]">ISOMETRIC DEV ROOM</span>
              </div>
              <div className="flex justify-between">
                <span>&gt; DISPLAY_RIG:</span>
                <span className="text-[#4ade80]">CRT PHOSPHOR 60FPS</span>
              </div>
              <div className="flex justify-between">
                <span>&gt; COMPANION_BOT:</span>
                <span className="text-[#f4ddb8]">ACTIVE &amp; SYNCED</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] font-bold">
                <span className="text-[#d36b54]">&gt; STATUS:</span>
                <span ref={statusRef} className="text-[#f4ddb8] animate-pulse">
                  READING CARTRIDGE ROM...
                </span>
              </div>
            </div>
          </div>

          {/* Segmented 24-Block XP/Asset Loading Bar */}
          <div className="w-full max-w-[560px] mx-auto mt-5">
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-[2px] text-[#888] mb-1.5">
              <span className="text-[#f4ddb8] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ddb8]" />
                [ ASSET BUFFER ]
              </span>
              <span className="text-[#f4ddb8] font-bold">
                [ <span ref={numRef}>000</span>% ]
              </span>
            </div>

            {/* Segmented Blocks */}
            <div
              className="grid gap-[2px] p-1 bg-[#12100e] border border-[#2b2520] rounded-xs shadow-inner"
              style={{ gridTemplateColumns: `repeat(${SEGMENT_COUNT}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 sm:h-3 rounded-[1px] transition-colors duration-100 ${
                    i < activeSegments
                      ? "bg-gradient-to-t from-[#d36b54] to-[#f4ddb8] shadow-[0_0_8px_#d36b54]"
                      : "bg-[#1e1915]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Start Deck Cue */}
          <div className="mt-8 flex flex-col items-center gap-3">
            {isReady ? (
              <>
                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  {/* Glowing Arcade Press Start Button */}
                  <button
                    type="button"
                    onClick={triggerGameStart}
                    className="group relative px-9 sm:px-12 py-3.5 sm:py-4 rounded border-2 border-[#f4ddb8] bg-[#161311] hover:bg-[#d36b54] text-[#f4ddb8] hover:text-white hover:border-[#d36b54] active:scale-95 transition-all duration-200 font-mono text-[13px] sm:text-[15px] uppercase tracking-[4px] font-black shadow-[0_0_30px_rgba(244,221,184,0.35)] hover:shadow-[0_0_45px_rgba(211,107,84,0.7)] cursor-pointer flex items-center gap-3 animate-pulse hover:animate-none"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
                    <span>PRESS START</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#f4ddb8]/20 group-hover:bg-white/20 text-[#f4ddb8] group-hover:text-white border border-[#f4ddb8]/40">
                      SPACE
                    </span>
                  </button>

                  {/* Interactive Arcade Coin Slot */}
                  <button
                    type="button"
                    onClick={triggerGameStart}
                    className="group px-5 py-3.5 rounded border border-[#3d362e] hover:border-[#f4ddb8] bg-[#12100e] text-[#a8a59d] hover:text-[#f4ddb8] transition-all duration-200 font-mono text-[11px] uppercase tracking-[2px] flex items-center gap-2 cursor-pointer"
                    title="Click to insert coin"
                  >
                    <span className="w-1.5 h-4 bg-[#b88c4b] rounded-xs group-hover:bg-[#f4ddb8]" />
                    <span>INSERT COIN (01)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[2px] uppercase text-[#7a756f]">
                  <span>[ PRESS SPACEBAR OR ENTER TO LAUNCH ]</span>
                </div>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[2px] text-[#666]">
                <span className="w-2 h-2 rounded-full bg-[#d36b54] animate-ping" />
                <span>BOOTING UP INDIE GAME RIG...</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Game Specs & Telemetry */}
        <div className="w-full pt-2 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-[2px] text-[#888] border-t border-[#1e1b18]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f4ddb8]" />
            INDIE DEVELOPER SYSTEM • BUILD 2026
          </span>
          <span className="hidden sm:inline-block text-[#555]">
            [ COZY ISOMETRIC STUDIO // CRT PHOSPHOR ]
          </span>
          <span className="text-[#f4ddb8]">
            CONTROL: [ MOUSE • KEYBOARD • TOUCH ]
          </span>
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
