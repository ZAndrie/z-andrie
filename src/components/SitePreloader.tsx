"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { PRELOADER_DONE_EVENT, PRELOADER_SESSION_KEY } from "@/lib/preloader";

const MIN_MS = 1400; // time on screen to appreciate the theatrical ambiance
const MAX_MS = 2800; // hard cap: never block slower devices

/**
 * Procedural Web Audio API: tactile mechanical switch click & resonant 2700K lamp hum.
 * Zero external audio files required, 100% zero latency, unlocks audio for the whole session.
 */
function playTheatricalClick() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Mechanical switch click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);

    // 2. Warm resonant hum of incandescent filament powering on
    const hum = ctx.createOscillator();
    const humGain = ctx.createGain();
    hum.type = "sine";
    hum.frequency.setValueAtTime(95, ctx.currentTime);
    hum.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);
    humGain.gain.setValueAtTime(0.16, ctx.currentTime + 0.02);
    humGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    hum.connect(humGain);
    humGain.connect(ctx.destination);
    hum.start(ctx.currentTime + 0.02);
    hum.stop(ctx.currentTime + 0.5);
  } catch {}
}

export default function SitePreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const valanceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const filamentPathRef = useRef<SVGPathElement>(null);
  const bulbHaloRef = useRef<HTMLDivElement>(null);

  // Cord dragging & tactile physics
  const cordRef = useRef<HTMLDivElement>(null);
  const beadRef = useRef<HTMLButtonElement>(null);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const currentPullYRef = useRef(0);
  const isTriggeredRef = useRef(false);

  const BASE_CORD_HEIGHT = 44;
  const MAX_PULL = 60;
  const PULL_THRESHOLD = 22;

  const [gone, setGone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isRevealedRef = useRef(false);

  // Theatrical curtain call reveal
  const triggerCurtainCall = useCallback(() => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;

    try {
      sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
    } catch {}

    const html = document.documentElement;
    const root = rootRef.current;
    const cLeft = curtainLeftRef.current;
    const cRight = curtainRightRef.current;
    const valance = valanceRef.current;
    const content = contentRef.current;
    const flash = flashRef.current;

    playTheatricalClick();

    if (!root || !cLeft || !cRight || !content) {
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
      // 1. Incandescent Bulb Ignition Flash
      if (flash) {
        tl.to(flash, { opacity: 0.95, duration: 0.12, ease: "power2.out" })
          .to(flash, { opacity: 0, duration: 0.65, ease: "power3.inOut" }, "+=0.03");
      }

      // 2. Center Stage Content Dissolve
      tl.to(content, { opacity: 0, scale: 1.05, y: -20, duration: 0.45, ease: "power2.in" }, 0.05);

      // 3. Heavy Velvet Stage Curtains Sweep Open to the Wings!
      tl.to(cLeft, { xPercent: -105, duration: 1.25, ease: "power4.inOut" }, 0.1)
        .to(cRight, { xPercent: 105, duration: 1.25, ease: "power4.inOut" }, 0.1)
        .to(valance, { yPercent: -100, duration: 0.95, ease: "power3.inOut" }, 0.15)
        .add(() => {
          html.dataset.preloader = "done";
          window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
        }, "<+=0.45");
    }
  }, []);

  // Snap cord back up with mechanical recoil and trigger the theatrical reveal
  const snapAndReveal = useCallback(() => {
    if (isRevealedRef.current) return;
    gsap.timeline()
      .to(beadRef.current, {
        y: 0,
        duration: 0.16,
        ease: "back.out(2)",
      })
      .to(
        cordRef.current,
        {
          height: BASE_CORD_HEIGHT,
          duration: 0.16,
          ease: "back.out(2)",
        },
        0
      )
      .add(() => {
        triggerCurtainCall();
      });
  }, [BASE_CORD_HEIGHT, triggerCurtainCall]);

  const handleCordPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isReady || isRevealedRef.current || isTriggeredRef.current) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    currentPullYRef.current = 0;
  };

  const handleCordPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current || isTriggeredRef.current) return;
    const dy = e.clientY - startYRef.current;
    const pull = Math.max(0, Math.min(MAX_PULL, dy));
    currentPullYRef.current = pull;

    if (cordRef.current) {
      cordRef.current.style.height = `${BASE_CORD_HEIGHT + pull}px`;
    }
    if (beadRef.current) {
      beadRef.current.style.transform = `translateY(${pull}px)`;
    }
    if (filamentPathRef.current) {
      const extra = Math.min(1, pull / PULL_THRESHOLD);
      filamentPathRef.current.style.filter = `drop-shadow(0 0 ${16 + extra * 14}px #ffffff) drop-shadow(0 0 ${30 + extra * 25}px #f4ddb8)`;
    }

    if (pull >= 45) {
      isDraggingRef.current = false;
      isTriggeredRef.current = true;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      snapAndReveal();
    }
  };

  const handleCordPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (currentPullYRef.current >= PULL_THRESHOLD) {
      isTriggeredRef.current = true;
      snapAndReveal();
    } else {
      // Released without pulling past threshold: spring back to rest position
      gsap.to(beadRef.current, {
        y: 0,
        duration: 0.35,
        ease: "elastic.out(1.2, 0.4)",
      });
      gsap.to(cordRef.current, {
        height: BASE_CORD_HEIGHT,
        duration: 0.35,
        ease: "elastic.out(1.2, 0.4)",
      });
    }
  };

  const handleCordClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isReady || isRevealedRef.current || isTriggeredRef.current) return;
    isTriggeredRef.current = true;

    // Animate a crisp physical pull and recoil
    gsap.timeline()
      .to(beadRef.current, { y: 26, duration: 0.09, ease: "power2.in" })
      .to(cordRef.current, { height: BASE_CORD_HEIGHT + 26, duration: 0.09, ease: "power2.in" }, 0)
      .to(beadRef.current, { y: 0, duration: 0.15, ease: "back.out(2)" })
      .to(cordRef.current, { height: BASE_CORD_HEIGHT, duration: 0.15, ease: "back.out(2)" }, "<")
      .add(() => {
        triggerCurtainCall();
      });
  };

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
      if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      if (numRef.current) numRef.current.textContent = String(rounded).padStart(3, "0");

      // Dynamic stage status ticker
      if (statusRef.current) {
        if (rounded < 28) {
          statusRef.current.textContent = "RIGGING OVERHEAD STAGE SPOTLIGHTS...";
        } else if (rounded < 60) {
          statusRef.current.textContent = "FOCUSING 2700K TUNGSTEN FILAMENT...";
        } else if (rounded < 95) {
          statusRef.current.textContent = "PARTING HEAVY VELVET THEATER DRAPES...";
        } else {
          statusRef.current.textContent = "STAGE READY • PULL CORD TO ENTER";
        }
      }

      // Heating up the tungsten filament in real-time
      if (filamentPathRef.current) {
        if (rounded < 30) {
          filamentPathRef.current.style.stroke = "#682312";
          filamentPathRef.current.style.filter = "none";
        } else if (rounded < 70) {
          filamentPathRef.current.style.stroke = "#e6602e";
          filamentPathRef.current.style.filter = "drop-shadow(0 0 6px #e6602e)";
        } else if (rounded < 95) {
          filamentPathRef.current.style.stroke = "#f4ddb8";
          filamentPathRef.current.style.filter = "drop-shadow(0 0 12px #f4ddb8) drop-shadow(0 0 20px #e6602e)";
        } else {
          filamentPathRef.current.style.stroke = "#ffffff";
          filamentPathRef.current.style.filter = "drop-shadow(0 0 16px #ffffff) drop-shadow(0 0 30px #f4ddb8)";
        }
      }

      // Bulb ambient halo
      if (bulbHaloRef.current) {
        const haloScale = 0.4 + (v / 100) * 0.9;
        const haloOpacity = 0.1 + (v / 100) * 0.45;
        bulbHaloRef.current.style.transform = `scale(${haloScale})`;
        bulbHaloRef.current.style.opacity = String(haloOpacity);
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
        // Deliberate gate: NO automatic timer! Waits for the user to pull cord or click.
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      if (html.dataset.preloader === "loading") html.dataset.preloader = "done";
    };
  }, [triggerCurtainCall]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={`site-preloader fixed inset-0 z-[100000] overflow-hidden select-none bg-[#070707] text-[#e7e5df] ${
        isReady ? "cursor-default" : "cursor-wait"
      }`}
      role="status"
      aria-label="Theatrical Stage Loading"
    >
      {/* ── THEATRICAL STAGE CURTAINS (LEFT & RIGHT MAIN PANELS) ── */}
      <div ref={curtainLeftRef} className="theatre-curtain theatre-curtain--left">
        <div className="theatre-curtain__folds" />
        <div className="theatre-curtain__fringe" />
      </div>

      <div ref={curtainRightRef} className="theatre-curtain theatre-curtain--right">
        <div className="theatre-curtain__folds" />
        <div className="theatre-curtain__fringe" />
      </div>

      {/* ── TOP STAGE VALANCE / PROSCENIUM PELMET ── */}
      <div ref={valanceRef} className="theatre-valance">
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[2px] uppercase text-[#a8a59d]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-pulse" />
          <span>STAGE 01 // PROSCENIUM ARCH</span>
        </div>
        <div className="hidden sm:block text-[10px] font-mono tracking-[3px] uppercase text-[#f4ddb8]/80">
          NOW STAGING: Z ANDRIE PORTFOLIO
        </div>
        <div className="text-[10px] sm:text-[11px] font-mono tracking-[2px] uppercase text-[#a8a59d]">
          2700K SPOTLIGHT RIG
        </div>
        <div className="theatre-valance__fringe" />
      </div>

      {/* ── CENTER STAGE THEATRICAL PRESENTATION ── */}
      <div
        ref={contentRef}
        className="relative z-20 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 sm:py-20 flex flex-col justify-between"
      >
        {/* Top Header Marquee */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-[2.5px] text-[#888] pt-4">
          <span className="border-b border-[#333] pb-0.5">THEATRICAL PRODUCTION</span>
          <span className="text-[#d36b54]">● LIVE PRESENTATION</span>
          <span className="border-b border-[#333] pb-0.5">PHILIPPINES • 2026</span>
        </div>

        {/* Centerpiece: Hanging Pendant Lamp, Pull Cord & Stencil Title */}
        <div className="flex flex-col items-center text-center my-auto py-4">
          
          {/* Hanging Brass Pendant Lamp Assembly */}
          <div className="relative flex flex-col items-center mb-6">
            
            {/* Ceiling Brass Mount & Twisted Cord */}
            <div className="w-6 h-2 bg-[#8c6534] rounded-t-sm shadow-md" />
            <div className="w-[2px] h-12 sm:h-16 bg-[#3d3832]" />

            {/* Edison Bulb Halo Glow */}
            <div
              ref={bulbHaloRef}
              className="absolute top-10 w-44 h-44 rounded-full pointer-events-none transition-all duration-300"
              style={{
                background: "radial-gradient(circle, rgba(244, 221, 184, 0.45) 0%, rgba(211, 107, 84, 0.15) 50%, transparent 75%)",
              }}
            />

            {/* Bulb Glass Envelope & Brass Socket */}
            <div className="relative w-14 h-20 bg-gradient-to-b from-[#1b1917]/90 to-[#12100e]/70 border border-[#3e3933] rounded-t-md rounded-b-[24px] shadow-2xl flex flex-col items-center justify-center p-1.5 backdrop-blur-sm">
              <div className="w-7 h-2 bg-[#a37943] rounded-xs mb-1" />
              
              {/* Glowing Tungsten Wire Filament (SVG) */}
              <svg viewBox="0 0 40 50" fill="none" className="w-8 h-12">
                <path
                  ref={filamentPathRef}
                  d="M14 42 V22 C14 16 17 12 20 12 C23 12 26 16 26 22 V42 M16 26 L20 16 L24 26 M18 36 L20 28 L22 36"
                  stroke="#682312"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="theatre-filament transition-all duration-300"
                />
              </svg>
            </div>

            {/* Hanging Pull-Cord / Chain Assembly */}
            <div className="relative flex flex-col items-center mt-0.5 select-none z-30">
              {/* Stretchable Brass Ball-Chain */}
              <div
                ref={cordRef}
                className="w-[2.5px] rounded-full shadow-sm origin-top transition-none"
                style={{
                  height: `${BASE_CORD_HEIGHT}px`,
                  backgroundImage:
                    "radial-gradient(circle, #e2b46c 1.2px, #6e481f 1.3px, #4a371e 2.5px)",
                  backgroundSize: "2.5px 5.5px",
                  backgroundRepeat: "repeat-y",
                }}
              />

              {/* Brass Toggle Pull-Bead Handle */}
              <div className="relative flex items-center justify-center">
                <button
                  ref={beadRef}
                  type="button"
                  onPointerDown={handleCordPointerDown}
                  onPointerMove={handleCordPointerMove}
                  onPointerUp={handleCordPointerUp}
                  onPointerCancel={handleCordPointerUp}
                  onClick={handleCordClick}
                  disabled={!isReady}
                  style={{ touchAction: "none" }}
                  className={`relative w-6 h-9 rounded-full border-2 border-[#f4ddb8] bg-gradient-to-b from-[#f4ddb8] via-[#a37943] to-[#4a371e] shadow-[0_0_15px_rgba(244,221,184,0.4)] flex flex-col items-center justify-center select-none transition-shadow duration-200 ${
                    isReady
                      ? "cursor-grab active:cursor-grabbing hover:shadow-[0_0_25px_rgba(244,221,184,0.85)] animate-bounce"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  title={
                    isReady
                      ? "Pull down or click to turn on light and raise curtains"
                      : "Rigging stage..."
                  }
                  aria-label="Theatrical lamp pull cord"
                >
                  {/* Decorative brass ridges */}
                  <span className="w-3.5 h-[2px] bg-[#fff4db] rounded-full mb-1 shadow-[0_0_4px_#fff4db]" />
                  <span className="w-2.5 h-[2px] bg-[#ffe4a0] rounded-full shadow-[0_0_3px_#ffe4a0]" />
                </button>

                {/* Animated PULL Indicator Flag (shows when ready) */}
                {isReady && (
                  <div className="absolute left-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171411]/95 border border-[#d36b54]/60 text-[10px] font-mono tracking-widest text-[#f4ddb8] shadow-[0_0_15px_rgba(211,107,84,0.35)] whitespace-nowrap animate-pulse">
                    <span>PULL CORD</span>
                    <span className="text-[12px] font-bold text-[#d36b54] animate-bounce">↓</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Marquee Stencil Name */}
          <span className="text-[11px] font-mono tracking-[4px] uppercase text-[#a8a59d] mb-2 block">
            [ ACT I // DIGITAL EXHIBITION ]
          </span>

          <h1 className="font-stencil text-[48px] sm:text-[76px] md:text-[104px] lg:text-[124px] font-black uppercase text-[#e7e5df] tracking-tight leading-[0.9] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            Z <span className="text-[#d36b54]">ANDRIE</span>
          </h1>

          <p className="text-[12px] sm:text-[14px] md:text-[16px] font-mono tracking-[2.5px] uppercase text-[#a8a59d] mt-4 max-w-[650px]">
            Creative Developer • Full-Stack Technologist
          </p>

          {/* Interactive Call-To-Action Cue */}
          <div className="mt-8 flex flex-col items-center gap-2.5">
            {isReady ? (
              <>
                <button
                  type="button"
                  onClick={() => handleCordClick()}
                  className="group relative px-7 sm:px-9 py-3 rounded-sm border-2 border-[#f4ddb8] bg-[#161412] text-[#f4ddb8] hover:bg-[#d36b54] hover:text-white hover:border-[#d36b54] active:scale-95 transition-all duration-300 font-mono text-[11px] sm:text-[13px] uppercase tracking-[3px] font-bold shadow-[0_0_25px_rgba(244,221,184,0.3)] hover:shadow-[0_0_35px_rgba(211,107,84,0.6)] cursor-pointer flex items-center gap-2.5 mx-auto"
                >
                  <span className="text-[#f4ddb8] group-hover:text-white transition-colors">⚡</span>
                  <span>PULL CORD OR CLICK TO ENTER</span>
                  <span className="text-[#f4ddb8] group-hover:text-white transition-colors">⚡</span>
                </button>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[2px] text-[#8a857e]">
                  [ PULL CORD DOWNWARD OR CLICK TO RAISE CURTAINS ]
                </span>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[2px] text-[#666]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] animate-ping" />
                <span ref={statusRef}>RIGGING OVERHEAD STAGE SPOTLIGHTS...</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Theatrical Telemetry & Progress Bar */}
        <div className="w-full pt-4">
          <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono uppercase tracking-[2px] text-[#888] mb-2">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ddb8]" />
              STAGE READINESS
            </span>
            <span className="hidden sm:inline-block text-[#555]">
              [ 2700K INCANDESCENT BEAM ]
            </span>
            <span className="text-[#f4ddb8] font-bold">
              [ <span ref={numRef}>000</span>% ]
            </span>
          </div>

          {/* Brass Trimmed Theatrical Progress Track */}
          <div className="w-full h-[3px] bg-[#1a1715] border border-[#2b2520] relative overflow-hidden rounded-full">
            <div
              ref={barRef}
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#d36b54] via-[#f4ddb8] to-[#fff4db] transition-all duration-100 ease-out shadow-[0_0_12px_#d36b54]"
              style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
            />
          </div>
        </div>
      </div>

      {/* ── THEATRICAL IGNITION FLASH OVERLAY ── */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-[100010] bg-[#fff2db] opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
