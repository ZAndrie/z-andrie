"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { whenRevealed } from "@/lib/preloader";
import { subscribeTelemetry } from "@/lib/telemetry";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const focusTextRef = useRef<HTMLSpanElement>(null);
  const targetTextRef = useRef<HTMLSpanElement>(null);

  // Subscribe to live telemetry broadcast with direct DOM updates (zero React re-renders)
  useEffect(() => {
    return subscribeTelemetry((data) => {
      if (focusTextRef.current) {
        focusTextRef.current.textContent = `FOCUS ${data.focus}%`;
      }
      if (targetTextRef.current) {
        targetTextRef.current.textContent = data.target;
      }
    });
  }, []);

  // GSAP Entrance Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
    const offReveal = whenRevealed(() => tl.play());

    tl.from(".gsap-hero-left", {
      opacity: 0,
      x: -30,
      duration: 1.1,
    })
    .from(".gsap-hero-right", {
      opacity: 0,
      x: 30,
      duration: 1.1,
    }, "-=0.9")
    .from(".gsap-hero-center-prompt", {
      opacity: 0,
      y: 20,
      duration: 1.0,
    }, "-=0.7");

    return () => offReveal();
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-[100vh] flex flex-col justify-between bg-transparent text-[#e7e5df] overflow-hidden pt-[100px] md:pt-[120px] pb-8 select-none z-10"
    >
      {/* Main Layout Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex-1 flex flex-col justify-between pointer-events-none">
        
        {/* Middle Stage: Left & Right Flanking Editorial Elements */}
        <div className="w-full flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 pt-8 pb-16">
          
          {/* Left Column: Role & Massive Editorial Heading */}
          <div className="gsap-hero-left max-w-[540px] text-left pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-[2px] text-[#a8a59d] mb-5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
              <span>Creative Developer &amp; Technologist</span>
            </div>
            
            <h1 className="text-[32px] sm:text-[42px] md:text-[50px] lg:text-[58px] font-heading font-bold leading-[1.06] tracking-[-0.03em] text-[#ffffff]">
              Crafting intuitive, high-velocity digital experiences &amp; 3D spaces.
            </h1>
          </div>

          {/* Right Column: CTA & Project Status */}
          <div className="gsap-hero-right max-w-[300px] text-left md:text-right flex flex-col items-start md:items-end gap-3 pointer-events-auto ml-auto">
            <span className="text-[11px] font-mono tracking-[1.5px] text-[#9ca3af] uppercase">
              Open to Opportunities
            </span>
            <Link
              href="/#contact"
              data-magnetic
              className="px-6 py-3 rounded-full border border-white/[0.15] bg-white/[0.05] hover:bg-[#d36b54] text-[#ffffff] hover:border-[#d36b54] text-[12px] font-mono tracking-[2px] uppercase transition-all duration-300 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(211,107,84,0.4)] inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Start a Project</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

        </div>

        {/* Center Bottom: Interaction Prompts & Telemetry */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 text-[11px] font-mono tracking-[1.5px] text-[#9ca3af] uppercase border-t border-white/[0.08]">
          
          {/* Left: Device / Location */}
          <div className="text-[10px] md:text-[11px] tracking-[2px] text-[#9ca3af]/80">
            <span>PHILIPPINES • 2026</span>
          </div>

          {/* Center: 3D Scene Interaction Cue */}
          <div className="gsap-hero-center-prompt flex flex-col items-center text-center gap-1.5 pointer-events-auto">
            <span className="text-[#ffffff] tracking-[1.5px] font-medium text-[11px]">
              INTERACTIVE 3D WORKSPACE
            </span>
            <span className="text-[10px] text-[#9ca3af]/70 tracking-[1.2px]">
              Direct cursor to aim spotlight • Drag to inspect room
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#d36b54] mt-1">
              <span>Scroll to explore</span>
              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Right: Telemetry Coordinates */}
          <div className="text-right flex items-center gap-4 text-[10px] md:text-[11px]">
            <span ref={focusTextRef}>FOCUS 100%</span>
            <span ref={targetTextRef} className="text-[#ffffff]">
              ISOMETRIC OVERVIEW
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
