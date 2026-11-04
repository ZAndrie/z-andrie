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

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // 1. Staggered Entrance Animation on Scroll
      gsap.fromTo(
        ".gsap-about-header",
        { opacity: 0, y: 20 },
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
        { opacity: 0, y: 20 },
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

      // 2. Count-up tween for metrics
      const c1 = counter1Ref.current;
      const c2 = counter2Ref.current;
      const c3 = counter3Ref.current;

      if (c1 && c2 && c3) {
        ScrollTrigger.create({
          trigger: c1,
          start: "top 90%",
          once: true,
          onEnter: () => {
            const obj = { val1: 0, val2: 0, val3: 0 };
            gsap.to(obj, {
              val1: 2,
              val2: 15,
              val3: 100,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                c1.innerText = `${Math.floor(obj.val1)}+`;
                c2.innerText = `${Math.floor(obj.val2)}+`;
                c3.innerText = `${Math.floor(obj.val3)}%`;
              },
            });
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-20 md:py-28 px-6 md:px-12 bg-[#070707]/90 text-[#e7e5df] border-t border-white/[0.08] relative overflow-hidden select-none z-10"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ── SECTION HEADER ── */}
        <div className="gsap-about-header flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
              <span>01 / Profile &amp; Ethos</span>
            </div>
            <h2 className="text-[34px] sm:text-[44px] md:text-[52px] font-heading font-bold uppercase text-[#ffffff] leading-[0.98] tracking-tight">
              About <span className="text-[#d36b54]">Z Andrie</span>
            </h2>
          </div>

          <div className="font-mono text-[11px] text-[#9ca3af] hidden md:flex items-center gap-3">
            <span>FULL-STACK TECHNOLOGIST</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AVAILABLE FOR HIRE
            </span>
          </div>
        </div>

        {/* ── MODERN BENTO GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Bio & Key Metrics */}
          <div className="gsap-about-bio lg:col-span-7 flex flex-col justify-between gap-6 h-full">
            <div className="flex flex-col gap-5">
              <p className="text-[17px] sm:text-[19px] md:text-[20px] text-[#ffffff] leading-[1.65] font-sans font-light">
                I am <span className="font-semibold text-[#d36b54]">Z Andrie</span>, a creative developer and software engineer based in the <strong className="font-semibold text-white">Philippines</strong>. I specialize in bridging the gap between imaginative design and robust engineering—building web experiences that are aesthetically striking, fast, and accessible.
              </p>

              <p className="text-[14px] sm:text-[15px] text-[#9ca3af] leading-[1.75] font-sans">
                My focus centers on <strong className="text-white font-medium">modern web architecture</strong>, <strong className="text-white font-medium">interactive 3D graphics</strong>, server-driven applications, and scalable design systems. Whether crafting spatial WebGL scenes or architecting full-stack web applications, I prioritize performance, maintainability, and exceptional user experience.
              </p>
            </div>

            {/* Metrics Bento Deck */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
                <p
                  ref={counter1Ref}
                  className="text-[28px] sm:text-[36px] font-heading font-bold text-[#d36b54] leading-none tabular-nums"
                >
                  2+
                </p>
                <p className="text-[11px] font-mono uppercase tracking-[1.5px] text-[#9ca3af] mt-2">
                  Years Dev
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
                <p
                  ref={counter2Ref}
                  className="text-[28px] sm:text-[36px] font-heading font-bold text-[#ffffff] leading-none tabular-nums"
                >
                  15+
                </p>
                <p className="text-[11px] font-mono uppercase tracking-[1.5px] text-[#9ca3af] mt-2">
                  Shipped Projects
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
                <p
                  ref={counter3Ref}
                  className="text-[28px] sm:text-[36px] font-heading font-bold text-[#f4ddb8] leading-none tabular-nums"
                >
                  100%
                </p>
                <p className="text-[11px] font-mono uppercase tracking-[1.5px] text-[#9ca3af] mt-2">
                  Code Dedication
                </p>
              </div>
            </div>

            {/* Magnetic Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                href="/#works"
                data-magnetic
                className="group px-6 py-3 rounded-full bg-white/[0.06] hover:bg-[#d36b54] border border-white/[0.12] hover:border-[#d36b54] text-white text-[12px] font-mono uppercase tracking-[2px] font-medium transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-md hover:shadow-[0_0_25px_rgba(211,107,84,0.4)]"
              >
                <span>Explore All Projects</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <Link
                href="/#contact"
                data-magnetic
                className="text-[12px] font-mono font-medium uppercase tracking-[2px] text-[#9ca3af] hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <span>Get In Touch</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Sleek Bento Cards */}
          <div className="gsap-about-card lg:col-span-5 flex flex-col gap-4 h-full">
            
            {/* Bento Card 1: Crisp Portrait Card */}
            <div className="p-5 rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col gap-4">
              <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-[#111] border border-white/[0.08]">
                <Image
                  src="/profile.png"
                  alt="Z Andrie - Creative Developer"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover object-center filter contrast-[1.04] brightness-[0.98] hover:scale-105 transition-transform duration-700"
                />
                
                {/* Modern subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/85 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Card Identity */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                  <div>
                    <span className="block font-heading text-[18px] font-bold uppercase text-white leading-tight">
                      Z ANDRIE
                    </span>
                    <span className="text-[11px] font-mono tracking-wider text-[#d36b54] uppercase">
                      Creative Developer &amp; Engineer
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm">
                    PH • UTC+8
                  </span>
                </div>
              </div>

              {/* Status & Location Pill Deck */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#9ca3af] pt-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-white">Active in Philippines</span>
                </span>
                <span className="text-[#a8a59d]">Specializing in Full-Stack</span>
              </div>
            </div>

            {/* Bento Card 2: Technical Arsenal Pills */}
            <div className="p-5 rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex-1 flex flex-col justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#9ca3af] font-semibold">
                CORE TECHNICAL ARSENAL
              </span>

              <div className="flex flex-wrap gap-2">
                {[
                  "React 19",
                  "Next.js App Router",
                  "TypeScript",
                  "Three.js / WebGL",
                  "Tailwind CSS",
                  "GSAP Animations",
                  "Node.js & Express",
                  "PHP & Laravel",
                  "PostgreSQL / MySQL",
                  "REST & GraphQL",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-[#e7e5df] text-[11px] font-mono transition-all duration-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono text-[#888] flex justify-between items-center">
                <span>FOCUS: WEBGL &amp; HIGH-SCALE WEB</span>
                <span className="text-[#d36b54]">2026 EDITION</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
