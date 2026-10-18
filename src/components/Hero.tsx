"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TechParticles from "./TechParticles";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // GSAP Entrance Reveal Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

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
    .from(".gsap-hero-portrait", {
      opacity: 0,
      scale: 0.92,
      duration: 1.2,
      ease: "power2.out",
    }, "-=0.9")
    .from(".gsap-hero-ticker", {
      opacity: 0,
      y: 15,
      duration: 0.8,
    }, "-=0.6");
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative flex flex-col justify-between bg-[var(--color-light-bg)] overflow-hidden pt-[110px] md:pt-[130px] pb-[30px]"
    >
      {/* Floating Ambient Particles */}
      <TechParticles />

      {/* Main Hero Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] flex flex-col lg:flex-row items-center justify-between gap-[50px] lg:gap-[80px]">
        
        {/* Left Column: Editorial Statement */}
        <div className="flex-1 max-w-[700px] text-left">
          
          {/* Eyebrow Studio Tag */}
          <div className="gsap-hero-eyebrow flex items-center gap-2.5 mb-6 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-[2px] text-[var(--color-text-dark)] font-semibold">
              Independent Design &amp; Frontend Studio
            </span>
            <span className="text-[var(--color-text-light)] opacity-60">•</span>
            <span className="text-[11px] md:text-[12px] uppercase font-mono tracking-[1.5px] text-[var(--color-text-light)]">
              Philippines
            </span>
          </div>

          {/* Driezie-Style Giant Statement */}
          <h1 className="gsap-hero-headline text-[38px] sm:text-[50px] md:text-[62px] lg:text-[72px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.04] tracking-[-0.01em] mb-7">
            Crafting digital experiences that are{" "}
            <span className="italic text-[var(--color-primary)] font-serif font-normal lowercase">
              intuitive
            </span>
            , modern &amp; impactful.
          </h1>

          {/* Subtitle / Lead Paragraph */}
          <p className="gsap-hero-lead text-[15px] sm:text-[16px] md:text-[17px] text-[var(--color-text-light)] max-w-[560px] leading-[1.8] mb-9 font-normal">
            Hello, I am <strong className="font-semibold text-[var(--color-text-dark)]">Z Andrie</strong>. A creative developer focused on modern React architecture, GSAP interactive physics, and high-performance design systems built for real users.
          </p>

          {/* Action Buttons: Driezie-Style Roll & Arrow-Swap */}
          <div className="gsap-hero-ctas flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/#works"
              className="group px-7 py-4 bg-[var(--color-text-dark)] text-white text-[11px] uppercase font-bold tracking-[2px] hover:bg-[var(--color-primary)] transition-all duration-300 shadow-md hover:shadow-xl inline-flex items-center gap-3 rounded-sm"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>Explore Selected Work</span>
                  <span className="roll__ghost" aria-hidden="true">Explore Selected Work</span>
                </span>
              </span>
              <span className="arrow-swap w-[11px] h-[11px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>

            <Link
              href="/#contact"
              className="group px-7 py-4 border border-[var(--color-text-dark)] text-[var(--color-text-dark)] text-[11px] uppercase font-bold tracking-[2px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300 inline-flex items-center gap-3 rounded-sm bg-white/40 backdrop-blur-sm"
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

        {/* Right Column: High-Fashion Architectural Portrait (Driezie 3:4 Frame) */}
        <div className="gsap-hero-portrait relative flex justify-center items-center w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px]">
          
          {/* Architectural Frame with Drop Shadow */}
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-dark-bg)] border border-[var(--color-border)] shadow-2xl p-2.5 bg-white/80 backdrop-blur-sm">
            <div className="relative w-full h-full overflow-hidden rounded-sm">
              <Image
                src="/profile.png"
                alt="Z Andrie — Web Designer & Creative Frontend Developer"
                fill
                sizes="(max-width: 768px) 340px, 440px"
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 scale-[1.02] hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            </div>

            {/* Bottom Floating Tag in Frame */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10 text-white">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[1.5px] font-serif">Z Andrie</p>
                <p className="text-[10px] uppercase font-mono text-white/80 tracking-wider">Designer &amp; Engineer</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>

        </div>

      </div>

      {/* Infinite Driezie Architectural Marquee Ticker */}
      <div className="gsap-hero-ticker w-full mt-14 pt-4 border-t border-[var(--color-border)] overflow-hidden whitespace-nowrap bg-[var(--color-light-bg)]/80 relative z-10">
        <div className="animate-marquee flex gap-10 items-center text-[10px] md:text-[11px] uppercase tracking-[3px] text-[var(--color-text-light)] font-mono select-none">
          <span>✦ CREATIVE FRONTEND ENGINEERING</span>
          <span>✦ GSAP MOTION &amp; PHYSICS</span>
          <span>✦ MODERN REACT ARCHITECTURE</span>
          <span>✦ ACCESSIBLE &amp; PERFORMANCE DRIVEN</span>
          <span>✦ SCALABLE DESIGN SYSTEMS</span>
          <span>✦ CREATIVE FRONTEND ENGINEERING</span>
          <span>✦ GSAP MOTION &amp; PHYSICS</span>
          <span>✦ MODERN REACT ARCHITECTURE</span>
          <span>✦ ACCESSIBLE &amp; PERFORMANCE DRIVEN</span>
          <span>✦ SCALABLE DESIGN SYSTEMS</span>
        </div>
      </div>
    </section>
  );
}
