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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 221, 184, 0.12) 0%, rgba(211, 107, 84, 0.04) 45%, transparent 70%)",
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
        className="relative z-20 w-full h-full max-w-[1200px] mx-auto px-6 md:px-12 py-8 sm:py-12 flex flex-col justify-between"
      >
        {/* Top Gamer Header Marquee */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-['Silkscreen'] uppercase tracking-[2px] text-[#888] pt-2">
          <div className="flex items-center gap-2 border-b border-[#2b2520] pb-1">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[#e7e5df]">WORLD 1-1: DEV LAB</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#f4ddb8]/80">
            <span>[ Z-ANDRIE // INDIE ODYSSEY ]</span>
          </div>
          <div className="flex items-center gap-3 border-b border-[#2b2520] pb-1">
            <span className="text-[#d36b54]">COINS: 99</span>
            <span>•</span>
            <span className="text-[#888]">60 FPS</span>
          </div>
        </div>

        {/* Centerpiece: Indie Game Title, Character/Quest Box & Start Deck */}
        <div className="flex flex-col items-center text-center my-auto py-2">
          
          {/* Indie Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#161311]/80 border border-[#d36b54]/50 text-[10px] sm:text-[11px] font-['Silkscreen'] tracking-[3px] uppercase text-[#f4ddb8] mb-3 shadow-lg backdrop-blur-sm">
            <span className="text-[#d36b54] animate-bounce">★</span>
            <span>AN INDIE DEV ODYSSEY</span>
            <span className="text-[#d36b54] animate-bounce">★</span>
          </div>

          {/* Stencil / Pixel Hero Title */}
          <h1 className="font-stencil text-[48px] sm:text-[72px] md:text-[96px] lg:text-[114px] font-black uppercase text-[#e7e5df] tracking-tight leading-[0.88] drop-shadow-[0_0_25px_rgba(244,221,184,0.25)]">
            Z <span className="text-[#d36b54]">ANDRIE</span>
          </h1>

          <p className="font-['Silkscreen'] text-[10px] sm:text-[11px] md:text-[12px] tracking-[2.5px] uppercase text-[#a8a59d] mt-3 max-w-[650px]">
            [ CREATIVE FULL-STACK DEVELOPER • WORLD BUILDER ]
          </p>

          {/* Authentic Indie RPG Character & Quest Card (Matching 3D Dev Room!) */}
          <div className="w-full max-w-[480px] mx-auto mt-5 p-3.5 sm:p-4 rounded bg-[#0c0b0a]/80 border-2 border-[#382f25] shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-md text-left">
            
            {/* Header: Player Profile */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#28221b] text-[10px] sm:text-[11px] font-['Silkscreen'] uppercase tracking-[2px]">
              <span className="text-[#4ade80] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                PLAYER: Z ANDRIE
              </span>
              <span className="text-[#f4ddb8]">LVL 26</span>
            </div>

            {/* RPG Stats Bars (HP / MP) */}
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-mono text-[#a8a59d] mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[#d36b54] font-bold">HP</span>
                <div className="flex-1 h-2 bg-[#1e1914] rounded-xs overflow-hidden border border-[#382f25]">
                  <div className="h-full bg-gradient-to-r from-[#8b2b18] to-[#d36b54] w-full" />
                </div>
                <span className="text-[9px] text-[#f4ddb8] font-mono">100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#5eead4] font-bold">MP</span>
                <div className="flex-1 h-2 bg-[#1e1914] rounded-xs overflow-hidden border border-[#382f25]">
                  <div className="h-full bg-gradient-to-r from-[#115e59] to-[#5eead4] w-full" />
                </div>
                <span className="text-[9px] text-[#f4ddb8] font-mono">100%</span>
              </div>
            </div>

            {/* Room Connections (Companion Bot & Quest) */}
            <div className="space-y-1 text-[11px] font-mono text-[#a8a59d]">
              <div className="flex justify-between">
                <span>COMPANION:</span>
                <span className="text-[#f4ddb8]">BOT-01 [AWAKE]</span>
              </div>
              <div className="flex justify-between">
                <span>LOCATION:</span>
                <span className="text-[#e7e5df]">ISOMETRIC DEV LAB (PH)</span>
              </div>
            </div>
          </div>

          {/* ── THE INDIE GAME COMPANION BOT RUNNER & PIXEL LOADING BAR ── */}
          <div className="relative w-full max-w-[480px] mx-auto mt-6 mb-3">
            {/* Top Labels */}
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-['Silkscreen'] uppercase tracking-[2px] text-[#888] mb-2 px-1">
              <span className="text-[#f4ddb8] flex items-center gap-2">
                <span className="text-[#d36b54] text-[12px] animate-pulse">💾</span>
                <span>LOADING DEV WORLD</span>
              </span>
              <span className="text-[#f4ddb8] font-bold">
                [ <span ref={numRef}>000</span>% ]
              </span>
            </div>

            {/* The Outer Chunky Pixel Bezel Track */}
            <div className="relative p-1 sm:p-1.5 bg-[#0e0c0a] border-2 border-[#52412e] rounded shadow-[0_0_20px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(0,0,0,0.8)]">
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

            {/* Bottom Sub-Label: Loading Ticker & Room Connection */}
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-['Silkscreen'] uppercase tracking-[2px] text-[#888] mt-2 px-1">
              <span className="text-[#777] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                <span ref={statusRef}>BREWING PIXEL COFFEE...</span>
              </span>
              <span className="text-[#d36b54] hidden sm:inline-block">
                [ BOT-01 COMPANION ]
              </span>
            </div>
          </div>

          {/* Interactive Start Menu Cue */}
          <div className="mt-5 flex flex-col items-center gap-2.5">
            {isReady ? (
              <>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {/* Glowing Arcade Press Start Button */}
                  <button
                    type="button"
                    onClick={triggerGameStart}
                    className="group relative px-8 sm:px-10 py-3 rounded border-2 border-[#f4ddb8] bg-[#161311] hover:bg-[#d36b54] text-[#f4ddb8] hover:text-white hover:border-[#d36b54] active:scale-95 transition-all duration-200 font-['Silkscreen'] text-[12px] sm:text-[14px] uppercase tracking-[3px] font-bold shadow-[0_0_25px_rgba(244,221,184,0.35)] hover:shadow-[0_0_35px_rgba(211,107,84,0.7)] cursor-pointer flex items-center gap-2.5 animate-pulse hover:animate-none"
                  >
                    <span className="text-[#4ade80] animate-bounce">►</span>
                    <span>START GAME</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4ddb8]/20 group-hover:bg-white/20 text-[#f4ddb8] group-hover:text-white border border-[#f4ddb8]/40 font-mono">
                      SPACE
                    </span>
                  </button>

                  {/* Interactive Arcade Coin Slot */}
                  <button
                    type="button"
                    onClick={triggerGameStart}
                    className="group px-4 py-3 rounded border border-[#382f25] hover:border-[#f4ddb8] bg-[#12100e]/80 text-[#a8a59d] hover:text-[#f4ddb8] transition-all duration-200 font-['Silkscreen'] text-[10px] sm:text-[11px] uppercase tracking-[2px] flex items-center gap-2 cursor-pointer"
                    title="Click to insert coin"
                  >
                    <span>🪙</span>
                    <span>INSERT COIN</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-['Silkscreen'] tracking-[2px] uppercase text-[#7a756f]">
                  <span>[ PRESS SPACEBAR OR CLICK TO START ]</span>
                </div>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-['Silkscreen'] uppercase tracking-[2px] text-[#777]">
                <span className="w-2 h-2 rounded-full bg-[#d36b54] animate-ping" />
                <span>LOADING DEV WORLD...</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Game Specs & Telemetry */}
        <div className="w-full pt-2 flex flex-col sm:flex-row justify-between items-center text-[9px] sm:text-[10px] font-['Silkscreen'] uppercase tracking-[2px] text-[#888] border-t border-[#1e1b18]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f4ddb8]" />
            INDIE DEVELOPER RIG • 2026
          </span>
          <span className="hidden sm:inline-block text-[#555]">
            [ COZY ISOMETRIC LAB // CRT PHOSPHOR ]
          </span>
          <span className="text-[#f4ddb8]">
            CONTROLS: [ MOUSE • KEYBOARD • TOUCH ]
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
