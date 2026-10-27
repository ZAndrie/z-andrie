"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { whenRevealed } from "@/lib/preloader";
import { subscribeTelemetry, TelemetryData } from "@/lib/telemetry";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Real-time telemetry state from 3D stage
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    x: 0,
    y: 0,
    focus: 0,
    target: "ISOMETRIC OVERVIEW",
  });

  // Subscribe to live telemetry broadcast
  useEffect(() => {
    return subscribeTelemetry(setTelemetry);
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
      className="relative w-full min-h-[100vh] flex flex-col justify-between bg-transparent text-[#e7e5df] overflow-hidden pt-[90px] md:pt-[110px] pb-8 select-none z-10"
    >
      {/* Main Diallo-Style Layout Container */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 md:px-12 flex-1 flex flex-col justify-between pointer-events-none">
        
        {/* Middle Stage: Left & Right Flanking Editorial Elements */}
        <div className="w-full flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 pt-8 pb-16">
          
          {/* Left Column: Role & Massive Editorial Heading */}
          <div className="gsap-hero-left max-w-[460px] text-left pointer-events-auto">
            <span className="block text-[11px] md:text-[12px] font-mono tracking-[2px] text-[#a8a59d] mb-4 uppercase">
              Creative developer, freelance
            </span>
            <h1 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[46px] font-normal leading-[1.12] tracking-[-0.01em] text-[#e7e5df] font-sans">
              Crafting digital spaces that are intuitive, modern &amp; impactful.
            </h1>
          </div>

          {/* Right Column: CTA & Project Status */}
          <div className="gsap-hero-right max-w-[280px] text-left md:text-right flex flex-col items-start md:items-end gap-3 pointer-events-auto ml-auto">
            <span className="text-[11px] font-mono tracking-[1.5px] text-[#a8a59d] uppercase">
              Taking new projects
            </span>
            <Link
              href="/#contact"
              data-magnetic
              className="px-6 py-3 border border-[#e7e5df]/30 text-[#e7e5df] text-[12px] font-mono tracking-[2px] uppercase hover:border-[#d36b54] hover:text-[#d36b54] transition-all duration-300 rounded-[2px] bg-[#0c0c0c]/60 backdrop-blur-sm shadow-lg inline-block"
            >
              Start a project
            </Link>
          </div>

        </div>

        {/* Center Bottom: Interaction Prompts & Telemetry */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 text-[11px] font-mono tracking-[1.5px] text-[#a8a59d] uppercase border-t border-[#1a1816]/70">
          
          {/* Left: Device / Location */}
          <div className="text-[10px] md:text-[11px] tracking-[2px] text-[#a8a59d]/70">
            <span>Philippines · 2026</span>
          </div>

          {/* Center: Theatrical Prompts */}
          <div className="gsap-hero-center-prompt flex flex-col items-center text-center gap-1.5 pointer-events-auto">
            <span className="text-[#e7e5df] tracking-[1.5px]">
              Point the lamp at the wall
            </span>
            <span className="text-[10px] text-[#a8a59d]/60 tracking-[1.2px]">
              Hold the mouse for UV
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#a8a59d]/50 mt-1">
              <span>Scroll to explore</span>
              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Right: Diallo Telemetry Coordinates & Focus */}
          <div className="text-right flex items-center gap-4 text-[10px] md:text-[11px]">
            <span>FOCUS {telemetry.focus}%</span>
            <span className="text-[#e7e5df]">
              x {telemetry.x >= 0 ? `+${telemetry.x.toFixed(2)}` : telemetry.x.toFixed(2)} y {telemetry.y >= 0 ? `+${telemetry.y.toFixed(2)}` : telemetry.y.toFixed(2)} 2700K
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
