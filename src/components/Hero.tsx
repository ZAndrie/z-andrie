"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TechParticles from "./TechParticles";
import { whenRevealed } from "@/lib/preloader";

// Lazy-load WebGL scene to optimize initial bundle and Lighthouse score
const WebGLHeroScene = dynamic(() => import("./hero/WebGLHeroScene"), {
  ssr: false,
  loading: () => null,
});

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardMainRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);

  // Real-time telemetry state from 3D stage
  const [telemetry, setTelemetry] = useState({
    x: 0,
    y: 0,
    focus: 100,
    target: "Z ANDRIE",
  });

  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // GSAP Entrance & Physics Animations
  useGSAP(() => {
    // Entrance waits for the preloader reveal (plays immediately if it's skipped).
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
    const offReveal = whenRevealed(() => tl.play());

    tl.from(".gsap-hero-eyebrow", {
      opacity: 0,
      y: -20,
      duration: 0.8,
    })
    .from(".gsap-hero-headline", {
      opacity: 0,
      y: 40,
      duration: 1.1,
    }, "-=0.5")
    .from(".gsap-hero-lead", {
      opacity: 0,
      y: 25,
      duration: 0.8,
    }, "-=0.6")
    .from(".gsap-hero-ctas", {
      opacity: 0,
      y: 20,
      duration: 0.8,
    }, "-=0.5")
    .from(cardBackRef.current, {
      opacity: 0,
      scale: 0.88,
      rotation: -8,
      duration: 1.2,
      ease: "power3.out",
    }, "-=0.9")
    .from(cardMainRef.current, {
      opacity: 0,
      scale: 0.92,
      y: 35,
      duration: 1.2,
      ease: "power3.out",
    }, "-=1.0")
    .from(".gsap-hero-ticker", {
      opacity: 0,
      y: 15,
      duration: 0.8,
    }, "-=0.6")
    .from(".gsap-hero-telemetry", {
      opacity: 0,
      duration: 0.8,
    }, "-=0.4");

    // Interactive 3D Parallax Tilt for Viewfinder Portrait
    const container = cardContainerRef.current;
    const mainCard = cardMainRef.current;
    const backCard = cardBackRef.current;

    if (container && mainCard && window.matchMedia("(hover: hover)").matches) {
      const rotX = gsap.quickTo(mainCard, "rotationX", { duration: 0.6, ease: "power2.out" });
      const rotY = gsap.quickTo(mainCard, "rotationY", { duration: 0.6, ease: "power2.out" });
      const backX = backCard ? gsap.quickTo(backCard, "x", { duration: 0.7, ease: "power2.out" }) : null;
      const backY = backCard ? gsap.quickTo(backCard, "y", { duration: 0.7, ease: "power2.out" }) : null;

      const onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        rotY(relX * 14);
        rotX(-relY * 14);

        if (backX && backY) {
          backX(-relX * 18);
          backY(-relY * 18);
        }
      };

      const onMouseLeave = () => {
        rotX(0);
        rotY(0);
        if (backX && backY) {
          backX(0);
          backY(0);
        }
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);

      return () => {
        offReveal();
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return () => offReveal();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative flex flex-col justify-between bg-[#070707] text-[#e7e5df] overflow-hidden pt-[110px] md:pt-[130px] pb-[30px] min-h-[92vh]"
    >
      {/* 3D WebGL Particle & Spotlight Hero with Graceful Fallback */}
      {!isReducedMotion ? (
        <WebGLHeroScene onTelemetryUpdate={setTelemetry} />
      ) : (
        <TechParticles />
      )}

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] flex flex-col lg:flex-row items-center justify-between gap-[50px] lg:gap-[80px]">
        
        {/* Left Column: Editorial Statement */}
        <div className="flex-1 max-w-[700px] text-left">
          
          {/* Eyebrow Studio Tag */}
          <div className="gsap-hero-eyebrow flex items-center gap-2.5 mb-6 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"></span>
            <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-[2px] text-[#e7e5df] font-semibold">
              Information Technology &amp; Full-Stack Developer
            </span>
            <span className="text-[#a8a59d] opacity-50">·</span>
            <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-[1.5px] text-[#a8a59d]">
              Philippines
            </span>
          </div>

          {/* Driezie / Diallo Giant Headline */}
          <h1 className="gsap-hero-headline text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] font-serif uppercase text-[#e7e5df] leading-[1.04] tracking-[-0.01em] mb-7 drop-shadow-sm">
            Crafting digital spaces that are{" "}
            <span className="italic text-[var(--color-primary)] font-serif font-normal lowercase">
              intuitive
            </span>
            , modern &amp; impactful.
          </h1>

          {/* Subtitle / Lead Paragraph */}
          <p className="gsap-hero-lead text-[15px] sm:text-[16px] md:text-[17px] text-[#a8a59d] max-w-[560px] leading-[1.8] mb-9 font-normal">
            Hello, I am <strong className="font-semibold text-[#e7e5df]">Z Andrie</strong>. An information technology student and aspiring full-stack developer focused on modern web architecture, clean code principles, and engineering high-performance interactive experiences built for users.
          </p>

          {/* Action Buttons: Roll & Arrow-Swap */}
          <div className="gsap-hero-ctas flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/#works"
              className="group px-7 py-4 bg-[var(--color-primary)] text-white text-[11px] uppercase font-bold tracking-[2px] hover:bg-[var(--color-secondary)] transition-all duration-300 shadow-[0_4px_20px_rgba(211,107,84,0.35)] hover:shadow-[0_6px_25px_rgba(211,107,84,0.55)] inline-flex items-center gap-3 rounded-sm"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>View Selected Works</span>
                  <span className="roll__ghost" aria-hidden="true">View Selected Works</span>
                </span>
              </span>
              <span className="arrow-swap w-[11px] h-[11px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>

            <Link
              href="/#contact"
              className="group px-7 py-4 border border-[#e7e5df]/25 text-[#e7e5df] text-[11px] uppercase font-bold tracking-[2px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 inline-flex items-center gap-3 rounded-sm bg-[#0e0d0c]/70 backdrop-blur-md"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>Contact Me</span>
                  <span className="roll__ghost text-[var(--color-primary)]" aria-hidden="true">Contact Me</span>
                </span>
              </span>
              <span className="arrow-swap text-[var(--color-primary)] w-[11px] h-[11px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
          </div>

        </div>

        {/* Right Column: Architectural Layered Portrait with GSAP 3D Physics */}
        <div
          ref={cardContainerRef}
          className="relative flex justify-center items-center w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] py-6 select-none"
          style={{ perspective: 1000 }}
        >
          {/* Architectural Offset Backing Card */}
          <div
            ref={cardBackRef}
            className="absolute inset-0 w-full h-[95%] my-auto -rotate-3 rounded-sm bg-gradient-to-br from-[#d36b54]/15 via-[#d36b54]/5 to-transparent border border-[#d36b54]/30 pointer-events-none transition-transform duration-300"
            style={{ transformOrigin: "center center" }}
          >
            {/* Dashed Inset Framing */}
            <div className="absolute inset-7 border border-dashed border-[#d36b54]/25 pointer-events-none" />
          </div>

          {/* Foreground Master Canvas Card */}
          <div
            ref={cardMainRef}
            className="relative z-10 w-full aspect-[3/4] rounded-sm bg-[#121110]/90 backdrop-blur-md border border-[#262422] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-3 sm:p-3.5 transition-transform duration-200"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Precision Viewfinder Corner Crosshairs */}
            <span className="absolute -top-1.5 -left-1.5 text-[14px] font-mono text-[var(--color-primary)] leading-none select-none font-bold">+</span>
            <span className="absolute -top-1.5 -right-1.5 text-[14px] font-mono text-[var(--color-primary)] leading-none select-none font-bold">+</span>
            <span className="absolute -bottom-1.5 -left-1.5 text-[14px] font-mono text-[var(--color-primary)] leading-none select-none font-bold">+</span>
            <span className="absolute -bottom-1.5 -right-1.5 text-[14px] font-mono text-[var(--color-primary)] leading-none select-none font-bold">+</span>

            {/* Inner Image Frame */}
            <div className="relative w-full h-full overflow-hidden rounded-[2px] bg-[#070707]">
              <Image
                src="/profile.png"
                alt="Z Andrie – Information Technology Student & Frontend Developer"
                fill
                sizes="(max-width: 768px) 340px, 440px"
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 scale-[1.02] hover:scale-105"
                priority
              />
              {/* Subtle dark vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* Theatrical Telemetry HUD Footer (Diallo-style) */}
      <div className="gsap-hero-telemetry relative z-10 w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#232220] select-none">
        
        {/* Left: Interaction hint */}
        <div className="flex items-center gap-2.5 text-[10px] md:text-[11px] font-mono tracking-[2px] text-[#a8a59d]/80 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
          <span>AIM POINTER · SPACEBAR TO MORPH</span>
        </div>

        {/* Center: Scroll indicator */}
        <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-mono tracking-[2px] text-[#a8a59d]/60 uppercase">
          <span>SCROLL</span>
          <span className="w-3 h-[1px] bg-[var(--color-primary)]"></span>
          <span>EXPLORE</span>
        </div>

        {/* Right: Real-time Telemetry Coordinates */}
        <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-mono tracking-[1.5px] text-[#a8a59d]/80 uppercase">
          <span>FOCUS {telemetry.focus}%</span>
          <span className="text-[#e7e5df]">
            X {telemetry.x >= 0 ? `+${telemetry.x.toFixed(2)}` : telemetry.x.toFixed(2)} Y {telemetry.y >= 0 ? `+${telemetry.y.toFixed(2)}` : telemetry.y.toFixed(2)} 2800K
          </span>
          <span className="text-[var(--color-primary)] font-semibold hidden lg:inline">
            [{telemetry.target}]
          </span>
        </div>

      </div>

      {/* Infinite Architectural Marquee Ticker */}
      <div className="gsap-hero-ticker w-full mt-4 pt-3 border-t border-[#1a1918] overflow-hidden whitespace-nowrap bg-[#0a0a0a]/90 relative z-10">
        <div className="animate-marquee flex gap-10 items-center text-[10px] md:text-[11px] uppercase tracking-[3px] text-[#a8a59d]/70 font-mono select-none">
          <span>❖ CREATIVE FRONTEND ENGINEERING</span>
          <span>❖ INTERACTIVE MOTION DESIGN</span>
          <span>❖ MODERN REACT &amp; THREE.JS ARCHITECTURE</span>
          <span>❖ ACCESSIBLE &amp; PERFORMANCE DRIVEN</span>
          <span>❖ SCALABLE DESIGN SYSTEMS</span>
          <span>❖ CREATIVE FRONTEND ENGINEERING</span>
          <span>❖ INTERACTIVE MOTION DESIGN</span>
          <span>❖ MODERN REACT &amp; THREE.JS ARCHITECTURE</span>
          <span>❖ ACCESSIBLE &amp; PERFORMANCE DRIVEN</span>
          <span>❖ SCALABLE DESIGN SYSTEMS</span>
        </div>
      </div>
    </section>
  );
}
