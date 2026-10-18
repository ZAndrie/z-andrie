"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TechParticles from "./TechParticles";

export default function Hero() {
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Entrance Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".gsap-hero-bg-text", {
      opacity: 0,
      y: -40,
      duration: 1.2,
    })
    .from(".gsap-hero-greeting", {
      opacity: 0,
      x: -30,
      duration: 0.7,
    }, "-=0.8")
    .from(".gsap-hero-title", {
      opacity: 0,
      x: -40,
      duration: 0.9,
    }, "-=0.5")
    .from(".gsap-hero-badge", {
      opacity: 0,
      y: 20,
      duration: 0.7,
    }, "-=0.6")
    .from(".gsap-hero-desc", {
      opacity: 0,
      y: 20,
      duration: 0.7,
    }, "-=0.5")
    .from(".gsap-hero-cta", {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.15,
    }, "-=0.4")
    .from(".gsap-hero-image", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "back.out(1.2)",
    }, "-=0.9");
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative flex flex-1 w-full items-center justify-center bg-[var(--color-light-bg)] overflow-hidden pt-[80px] pb-[50px]"
    >
      {/* Floating Tech Particles */}
      <TechParticles />

      {/* Giant Background Typography - Outlined so it doesn't clash */}
      <div 
        className="gsap-hero-bg-text absolute top-[15%] left-0 w-full text-center select-none pointer-events-none z-0 flex justify-center"
        style={{ transform: `translateY(${offset * 0.2}px)` }}
      >
        <h1 
          className="text-[18vw] leading-none font-bold tracking-[-0.04em] font-serif uppercase text-transparent"
          style={{ WebkitTextStroke: "2px rgba(28, 28, 28, 0.1)" }}
        >
          Portfolio
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] flex flex-col md:flex-row items-center justify-between gap-[50px] lg:gap-[100px]">
        
        {/* Left Content */}
        <div className="flex-1 max-w-[520px] mt-[40px] md:mt-0 relative z-20 bg-[var(--color-light-bg)]/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none p-4 md:p-0 rounded-xl">
          <p className="gsap-hero-greeting text-[var(--color-text-dark)] text-[14px] mb-[15px] uppercase tracking-[2px] font-bold">
            HELLO, I'M
          </p>
          <h2 className="gsap-hero-title text-[38px] sm:text-[48px] md:text-[72px] lg:text-[100px] leading-[0.9] font-serif text-[var(--color-text-dark)] mb-[20px] uppercase">
            Z<br />Andrie
          </h2>
          <p className="gsap-hero-badge text-[var(--color-primary)] font-bold text-[13px] uppercase tracking-[2px] mb-[25px]">
            WEB DESIGNER & DIGITAL CREATIVE
          </p>
          <p className="gsap-hero-desc text-[var(--color-text-light)] mb-[30px] leading-[1.8] text-[15px] sm:text-[16px] max-w-full md:max-w-[440px]">
            I craft clean, modern, and user-focused websites that help brands stand out and connect with the right audience.
          </p>
          
          {/* CTA Buttons with Driezie Roll & Arrow-Swap */}
          <div className="gsap-hero-cta flex flex-wrap items-center gap-4 mb-[35px]">
            <Link
              href="/works"
              className="group px-6 py-3.5 bg-[var(--color-primary)] text-white text-[12px] uppercase font-bold tracking-[2px] hover:bg-[var(--color-secondary)] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2.5 rounded-sm"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>View My Work</span>
                  <span className="roll__ghost" aria-hidden="true">View My Work</span>
                </span>
              </span>
              <span className="arrow-swap w-[11px] h-[11px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
            <Link
              href="/contact"
              className="group px-6 py-3.5 border-2 border-[var(--color-text-dark)] text-[var(--color-text-dark)] text-[12px] uppercase font-bold tracking-[2px] hover:bg-[var(--color-text-dark)] hover:text-white transition-all duration-300 inline-flex items-center gap-2.5 rounded-sm"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>Contact Me</span>
                  <span className="roll__ghost" aria-hidden="true">Contact Me</span>
                </span>
              </span>
              <span className="arrow-swap w-[11px] h-[11px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>
          </div>

          {/* Faux Signature */}
          <div className="font-serif italic text-[36px] text-[var(--color-text-dark)] opacity-70">
            Andrei
          </div>
        </div>
        
        {/* Right Content - Image with Floating Driezie-Style 3D Cards */}
        <div className="gsap-hero-image flex-1 relative flex justify-center items-center w-full max-w-[500px] mt-[40px] md:mt-0">
          
          {/* Floating Top-Right Showcase Card */}
          <div className="absolute -top-3 -right-2 md:-top-4 md:-right-6 z-20 bg-white/95 backdrop-blur-md border border-[var(--color-border)] p-2.5 rounded-sm shadow-xl hidden sm:flex items-center gap-3 animate-float-slow">
            <div className="w-12 h-12 relative rounded-sm overflow-hidden border border-[var(--color-border)] shrink-0 bg-[var(--color-dark-bg)]">
              <Image
                src="/download/Landing page.jpg"
                alt="GSAP Showcase preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--color-primary)] font-bold">Featured Q1</span>
              </div>
              <p className="text-[11px] font-bold text-[var(--color-text-dark)] leading-tight uppercase font-sans">GSAP Showcase</p>
            </div>
          </div>

          {/* Profile Image - Circular with Orange Border */}
          <div className="relative z-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] overflow-hidden rounded-full shadow-2xl border-[15px] border-[var(--color-primary)]">
            <Image
              src="/profile.png"
              alt="Z Andrie"
              fill
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover object-center scale-[1.05]"
              priority
            />
          </div>

          {/* Floating Bottom-Left Studio Stack Badge */}
          <div className="absolute -bottom-4 -left-2 md:-bottom-5 md:-left-6 z-20 bg-[var(--color-dark-bg)] text-white p-3 md:px-4 md:py-3 rounded-sm shadow-2xl flex items-center gap-3 border border-[#333] animate-float-slow" style={{ animationDelay: "1.5s" }}>
            <span className="text-[var(--color-primary)] text-base">✦</span>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[1.5px] text-[#888]">TECH STACK</p>
              <p className="text-[11px] font-bold text-white tracking-wide font-sans">React 19 • GSAP • Next.js</p>
            </div>
          </div>

        </div>
      </div>

      {/* Infinite Driezie-Style Marquee Ticker */}
      <div className="w-full mt-14 pt-4 border-t border-[var(--color-border)] overflow-hidden whitespace-nowrap bg-[var(--color-light-bg)]/80 relative z-10">
        <div className="animate-marquee flex gap-10 items-center text-[10px] md:text-[11px] uppercase tracking-[3px] text-[var(--color-text-light)] font-mono select-none">
          <span>✦ CREATIVE FRONTEND ENGINEERING</span>
          <span>✦ GSAP INTERACTIVE PHYSICS</span>
          <span>✦ MODERN REACT ARCHITECTURE</span>
          <span>✦ ACCESSIBLE &amp; PERFORMANCE DRIVEN</span>
          <span>✦ SCALABLE DESIGN SYSTEMS</span>
          <span>✦ CREATIVE FRONTEND ENGINEERING</span>
          <span>✦ GSAP INTERACTIVE PHYSICS</span>
          <span>✦ MODERN REACT ARCHITECTURE</span>
          <span>✦ ACCESSIBLE &amp; PERFORMANCE DRIVEN</span>
          <span>✦ SCALABLE DESIGN SYSTEMS</span>
        </div>
      </div>
    </section>
  );
}
