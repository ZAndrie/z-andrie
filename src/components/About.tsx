"use client";

import { useRef } from "react";
import Link from "next/link";
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

  useGSAP(() => {
    // 1. Staggered Entrance Animation on Scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(".gsap-about-header", {
      opacity: 0,
      y: 35,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(".gsap-about-bio", {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.4")
    .from(".gsap-about-card", {
      opacity: 0,
      x: 30,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.6");

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
          duration: 2,
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
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-[90px] md:py-[120px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="gsap-about-header mb-[50px] md:mb-[70px]">
          <p className="text-[var(--color-primary)] text-[12px] uppercase tracking-[3px] font-bold mb-[12px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
            BIOGRAPHY &amp; PHILOSOPHY
          </p>
          <h2 className="text-[36px] sm:text-[46px] md:text-[60px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
            About <span className="text-[var(--color-primary)] italic">Me</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[50px] lg:gap-[80px] items-start">
          
          {/* Left Column: 1-2 Paragraph Bio */}
          <div className="gsap-about-bio lg:col-span-7 flex flex-col gap-6">
            <p className="text-[17px] md:text-[19px] text-[var(--color-text-dark)] leading-[1.8] font-serif font-normal">
              I am <span className="font-semibold text-[var(--color-primary)]">Z Andrie</span>, a creative web designer and an aspiring full-stack developer based in the <strong className="font-semibold">Philippines</strong>. I specialize in designing and engineering digital experiences that are not only aesthetically striking, but intuitive, accessible, and grounded in clean design principles.
            </p>

            <p className="text-[15px] md:text-[16px] text-[var(--color-text-light)] leading-[1.8]">
              Currently, I am deepening my expertise in <strong className="text-[var(--color-text-dark)]">modern tech architecture</strong>, <strong className="text-[var(--color-text-dark)]">interactive animations</strong>, server components, and responsive design systems. My focus is centered on mastering high-performance full-stack engineering to build seamless web applications that solve real user needs.
            </p>

            {/* GSAP Dynamic Counter Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-[var(--color-border)]">
              <div>
                <p
                  ref={counter1Ref}
                  className="text-[28px] sm:text-[36px] font-serif font-bold text-[var(--color-primary)] leading-none tabular-nums"
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
                  className="text-[28px] sm:text-[36px] font-serif font-bold text-[var(--color-primary)] leading-none tabular-nums"
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
                  className="text-[28px] sm:text-[36px] font-serif font-bold text-[var(--color-primary)] leading-none tabular-nums"
                >
                  100%
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[1.5px] text-[var(--color-text-light)] mt-1.5">
                  Passion
                </p>
              </div>
            </div>

            {/* Magnetic Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                ref={btn1Ref}
                href="/#works"
                data-magnetic
                className="group text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2"
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
                className="group text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2"
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

          {/* Right Column: Architectural Badges Card */}
          <div className="gsap-about-card lg:col-span-5 bg-[#100f0d]/80 backdrop-blur-sm border border-[var(--color-border)] p-8 sm:p-10 rounded-sm shadow-sm flex flex-col gap-6 relative group">
            {/* Viewfinder crosshairs */}
            <span className="absolute -top-1 -left-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>
            <span className="absolute -top-1 -right-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>
            <span className="absolute -bottom-1 -left-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>
            <span className="absolute -bottom-1 -right-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>

            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-primary)] font-bold mb-2">
                LOCATION
              </p>
              <h3 className="text-[20px] font-serif text-[var(--color-text-dark)] flex items-center gap-2">
                <span>📍</span> Philippines
              </h3>
            </div>

            <div className="h-[1px] bg-[var(--color-border)]" />

            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-primary)] font-bold mb-2">
                CURRENT FOCUS &amp; LEARNING
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["React & Next.js", "PHP", "Tailwind CSS", "TypeScript", "UI/UX Design", "Laravel", "Cybersecurity"].map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-3 py-1 rounded-sm bg-[var(--color-light-bg)] border border-[var(--color-border)] text-[var(--color-text-dark)] font-medium hover:border-[var(--color-primary)] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-[var(--color-border)]" />

            <div>
              <p className="text-[11px] uppercase tracking-[2px] text-[var(--color-primary)] font-bold mb-2">
                CORE DISCIPLINES
              </p>
              <p className="text-[13px] text-[var(--color-text-light)] leading-relaxed">
                Frontend Engineering • Interactive Web Animations • Responsive UI/UX Systems • Clean Architecture
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
