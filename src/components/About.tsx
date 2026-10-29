"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const counter1Ref = useRef<HTMLParagraphElement>(null);
  const counter2Ref = useRef<HTMLParagraphElement>(null);
  const counter3Ref = useRef<HTMLParagraphElement>(null);

  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Staggered Entrance Animation on Scroll
      gsap.fromTo(
        ".gsap-about-header",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".gsap-about-bio",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".gsap-about-card",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            once: true,
          },
        }
      );

      // 2. Animated Stats Counter (GSAP Tweening)
      const statsObj = { c1: 0, c2: 0, c3: 0 };

      ScrollTrigger.create({
        trigger: counter1Ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(statsObj, {
            c1: 1,
            c2: 10,
            c3: 100,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (counter1Ref.current) counter1Ref.current.innerText = Math.round(statsObj.c1).toString();
              if (counter2Ref.current) counter2Ref.current.innerText = `${Math.round(statsObj.c2)}+`;
              if (counter3Ref.current) counter3Ref.current.innerText = `${Math.round(statsObj.c3)}%`;
            },
          });
        },
      });

      // 3. Magnetic Hover Physics on Action Buttons (Desktop pointer only)
      [btn1Ref.current, btn2Ref.current].forEach((btn) => {
        if (!btn || !window.matchMedia("(hover: hover)").matches) return;

        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power2.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power2.out" });

        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          xTo(relX * 0.35);
          yTo(relY * 0.35);
        };

        const onMouseLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener("mousemove", onMouseMove);
        btn.addEventListener("mouseleave", onMouseLeave);
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-[90px] md:py-[120px] px-[5%] md:px-[8%] bg-[#070707]/60 backdrop-blur-[1px] text-[#e7e5df] border-t border-[#232220]/50 relative overflow-hidden select-none z-10"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="gsap-about-header mb-[45px] md:mb-[60px]">
          <p className="text-[var(--color-primary)] text-[12px] uppercase tracking-[3px] font-mono font-bold mb-[12px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            [ 00 // BIOGRAPHY &amp; OPERATIVE PROFILE ]
          </p>
          <h2 className="text-[36px] sm:text-[46px] md:text-[60px] font-stencil uppercase text-[var(--color-text-dark)] leading-[1.02] tracking-tight">
            About <span className="text-[var(--color-primary)]">Me</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] lg:gap-[65px] items-start">
          
          {/* Left Column: 1-2 Paragraph Bio & Metrics */}
          <div className="gsap-about-bio lg:col-span-7 flex flex-col gap-6">
            <p className="text-[17px] md:text-[19px] text-[var(--color-text-dark)] leading-[1.8] font-sans font-normal">
              I am <span className="font-semibold text-[var(--color-primary)]">Z Andrie</span>, a creative web designer and aspiring full-stack developer based in the <strong className="font-semibold text-[#e7e5df]">Philippines</strong>. I specialize in designing and engineering digital experiences that are not only aesthetically striking, but intuitive, accessible, and grounded in clean design principles.
            </p>

            <p className="text-[15px] md:text-[16px] text-[var(--color-text-light)] leading-[1.8]">
              Currently, I am deepening my expertise in <strong className="text-[var(--color-text-dark)]">modern tech architecture</strong>, <strong className="text-[var(--color-text-dark)]">interactive animations</strong>, server components, and responsive design systems. My focus is centered on mastering high-performance full-stack engineering to build seamless web applications that solve real user needs.
            </p>

            {/* GSAP Dynamic Counter Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-[#232220]">
              <div>
                <p
                  ref={counter1Ref}
                  className="text-[28px] sm:text-[36px] font-stencil font-bold text-[var(--color-primary)] leading-none tabular-nums"
                >
                  1
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[1.5px] text-[var(--color-text-light)] mt-1.5">
                  Year Dev
                </p>
              </div>
              <div>
                <p
                  ref={counter2Ref}
                  className="text-[28px] sm:text-[36px] font-stencil font-bold text-[var(--color-primary)] leading-none tabular-nums"
                >
                  10+
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[1.5px] text-[var(--color-text-light)] mt-1.5">
                  Projects
                </p>
              </div>
              <div>
                <p
                  ref={counter3Ref}
                  className="text-[28px] sm:text-[36px] font-stencil font-bold text-[var(--color-primary)] leading-none tabular-nums"
                >
                  100%
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[1.5px] text-[var(--color-text-light)] mt-1.5">
                  Passion
                </p>
              </div>
            </div>

            {/* Core Disciplines Summary */}
            <div className="pt-2 text-[13px] text-[var(--color-text-light)] leading-relaxed font-sans border-t border-[#232220]/60">
              <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#888] block mb-1">
                DISCIPLINE CORE:
              </span>
              Frontend Engineering • Interactive Web Animations • Responsive UI/UX Systems • Clean Architecture
            </div>

            {/* Magnetic Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-6">
              <Link
                ref={btn1Ref}
                href="/#works"
                data-magnetic
                className="group text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 font-mono"
              >
                <span className="roll">
                  <span className="roll__inner">
                    <span>EXPLORE ALL PROJECTS</span>
                    <span className="roll__ghost text-[var(--color-primary)]" aria-hidden="true">EXPLORE ALL PROJECTS</span>
                  </span>
                </span>
                <span className="arrow-swap text-[var(--color-primary)] w-[11px] h-[11px]" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
              <span className="text-[var(--color-border)]">•</span>
              <Link
                ref={btn2Ref}
                href="/#contact"
                data-magnetic
                className="group text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 font-mono"
              >
                <span className="roll">
                  <span className="roll__inner">
                    <span>GET IN TOUCH</span>
                    <span className="roll__ghost text-[var(--color-primary)]" aria-hidden="true">GET IN TOUCH</span>
                  </span>
                </span>
                <span className="arrow-swap text-[var(--color-primary)] w-[11px] h-[11px]" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Indie Game Character Dossier & Portrait Card */}
          <div className="gsap-about-card lg:col-span-5 bg-[#0e0d0b]/90 backdrop-blur-md border border-[#262523] hover:border-[#d36b54]/60 p-5 sm:p-6 rounded-sm shadow-xl flex flex-col gap-4 relative group transition-all duration-300">
            {/* Precision Viewfinder Crosshairs at 4 corners */}
            <span className="absolute -top-1 -left-1 text-[12px] font-mono text-[#d36b54] font-bold opacity-70 group-hover:opacity-100 transition-opacity">+</span>
            <span className="absolute -top-1 -right-1 text-[12px] font-mono text-[#d36b54] font-bold opacity-70 group-hover:opacity-100 transition-opacity">+</span>
            <span className="absolute -bottom-1 -left-1 text-[12px] font-mono text-[#d36b54] font-bold opacity-70 group-hover:opacity-100 transition-opacity">+</span>
            <span className="absolute -bottom-1 -right-1 text-[12px] font-mono text-[#d36b54] font-bold opacity-70 group-hover:opacity-100 transition-opacity">+</span>

            {/* Terminal Chassis Header Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#1f1e1c] pb-2.5 text-[#777]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#52ff40] shadow-[0_0_8px_#52ff40] animate-pulse" />
                <span className="text-[#e7e5df] font-bold tracking-wider">PLAYER 01 // OPERATIVE</span>
              </div>
              <span className="text-[#d36b54] tracking-widest font-bold">[ SYS.ID // ZA-2026 ]</span>
            </div>

            {/* ── RETRO CRT CHARACTER PORTRAIT MONITOR ── */}
            <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[#070707] border border-[#232220] group-hover:border-[#d36b54]/50 shadow-inner transition-colors">
              {/* Profile Image */}
              <Image
                src="/profile.png"
                alt="Z Andrie - Creative Developer"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover object-center filter contrast-[1.06] brightness-[0.96] group-hover:scale-105 group-hover:brightness-105 transition-all duration-500"
              />

              {/* Incandescent Overhead Beam Wash */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% -10%, rgba(244, 221, 184, 0.22) 0%, rgba(244, 221, 184, 0.04) 55%, transparent 80%)",
                }}
              />

              {/* CRT Fine Scanline Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 3px, rgba(0, 0, 0, 0.4) 4px)",
                }}
              />

              {/* CRT Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/85 via-transparent to-[#070707]/30 pointer-events-none z-10" />

              {/* Top Left: Character Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-[1px] bg-[#d36b54]/90 text-white font-mono text-[9px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-sm">
                  ✦ HERO
                </span>
                <span className="px-2 py-0.5 rounded-[1px] bg-[#141414]/80 text-[#f4ddb8] border border-[#333] font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  LVL 24
                </span>
              </div>

              {/* Top Right: REC status */}
              <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-0.5 rounded-[1px] bg-[#070707]/80 border border-[#2a2a2a] text-[9px] font-mono text-[#ff4d4d] tracking-widest backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4d] animate-pulse" />
                <span>LIVE</span>
              </div>

              {/* Bottom Bezel HUD Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-end justify-between pointer-events-none">
                <div>
                  <span className="block font-stencil text-[18px] sm:text-[20px] font-black uppercase text-[#e7e5df] leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    Z ANDRIE
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#f4ddb8] font-bold drop-shadow-md">
                    CREATIVE DEVELOPER
                  </span>
                </div>

                <div className="text-right font-mono text-[9px] text-[#888] tracking-wider hidden sm:block">
                  <div>PHL // 1024×1024</div>
                  <div className="text-[#52ff40]">STATE: READY</div>
                </div>
              </div>
            </div>

            {/* ── INDIE RPG CHARACTER STAT METERS ── */}
            <div className="flex flex-col gap-2.5 pt-1 font-mono text-[10px] select-none">
              {/* HP Bar */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[#888]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#52ff40] font-bold">HP</span>
                    <span className="text-[9px] text-[#555]">// LOGIC &amp; ARCHITECTURE</span>
                  </span>
                  <span className="text-[#52ff40] font-bold">100 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-[#171615] rounded-[1px] overflow-hidden border border-[#242321]">
                  <div className="h-full bg-gradient-to-r from-[#52ff40] to-[#36c026] w-full" />
                </div>
              </div>

              {/* MP Bar */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[#888]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#f4ddb8] font-bold">MP</span>
                    <span className="text-[9px] text-[#555]">// UI &amp; INTERACTION</span>
                  </span>
                  <span className="text-[#f4ddb8] font-bold">100 / 100</span>
                </div>
                <div className="w-full h-1.5 bg-[#171615] rounded-[1px] overflow-hidden border border-[#242321]">
                  <div className="h-full bg-gradient-to-r from-[#d36b54] to-[#f4ddb8] w-full" />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[#1f1e1c]" />

            {/* Deployed Base & Location */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#888] uppercase tracking-[2px]">DEPLOYED BASE:</span>
              <span className="text-[#e7e5df] font-bold flex items-center gap-1.5">
                <span>📍</span> Philippines (PST+8)
              </span>
            </div>

            <div className="h-[1px] bg-[#1f1e1c]" />

            {/* Current Focus & Tech Arsenal */}
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-[#d36b54] font-mono font-bold mb-2">
                CURRENT FOCUS &amp; TECH ARSENAL
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "React 19",
                  "Next.js 16",
                  "TypeScript",
                  "Tailwind CSS",
                  "PHP / Laravel",
                  "UI/UX Design",
                  "Cybersecurity",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-[#141312] border border-[#262523] text-[#c5c2ba] font-medium hover:border-[#d36b54] hover:text-[#f4ddb8] transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
