"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToTarget } from "@/lib/smoothScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioItem {
  id: string;
  title: string;
  category?: string;
  subtitle: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  stars?: number;
  language?: string;
  topics?: string[];
  order?: number;
}

const DEFAULT_FALLBACK_PROJECTS: PortfolioItem[] = [
  {
    id: "q1-proj-1",
    title: "GSAP Interactive Showcase",
    category: "React / GSAP",
    subtitle: "A modern React web portfolio featuring custom GSAP timeline entrance animations, hover transforms, and dynamic particle effects.",
    imageUrl: "/download/Landing page.jpg",
    projectUrl: "https://website-portfolio-murex-eight.vercel.app",
    githubUrl: "https://github.com/ZAndrie/z-andrie",
    language: "React",
    topics: ["React", "GSAP", "Tailwind CSS"],
  },
  {
    id: "q1-proj-2",
    title: "ScrollTrigger Product Experience",
    category: "React / GSAP",
    subtitle: "Interactive modern web showcase utilizing GSAP ScrollTrigger for pinned animations, scrub effects, and smooth card transitions.",
    imageUrl: "/download/Webdesign.jpg",
    projectUrl: "https://website-portfolio-murex-eight.vercel.app/works",
    githubUrl: "https://github.com/ZAndrie",
    language: "React",
    topics: ["React", "GSAP ScrollTrigger", "CSS Modules"],
  },
  {
    id: "q1-proj-3",
    title: "Interactive Dashboard",
    category: "Next.js / TypeScript",
    subtitle: "High-performance data visualization interface with responsive charts, telemetry feeds, and real-time state synchronization.",
    imageUrl: "/download/Development.jpg",
    projectUrl: "https://github.com/ZAndrie",
    githubUrl: "https://github.com/ZAndrie",
    language: "TypeScript",
    topics: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "gh-fallback-1",
    title: "Library Booking System",
    category: "PHP / Blade",
    subtitle: "Full-stack reservation and booking system built with Blade and PHP, featuring role-based authentication and catalog indexing.",
    imageUrl: "/download/AndroidApp.jpg",
    projectUrl: "https://github.com/ZAndrie/Library-BookingSystem",
    githubUrl: "https://github.com/ZAndrie/Library-BookingSystem",
    language: "Blade",
    topics: ["PHP", "Blade", "MySQL", "Bootstrap"],
  },
  {
    id: "gh-fallback-2",
    title: "Laptop Borrowing System",
    category: "JavaScript",
    subtitle: "Hardware asset inventory management and reservation platform designed for university laboratory operations.",
    imageUrl: "/download/Apps.jpg",
    projectUrl: "https://github.com/ZAndrie/Laptop-Borrowing-System",
    githubUrl: "https://github.com/ZAndrie/Laptop-Borrowing-System",
    language: "JavaScript",
    topics: ["JavaScript", "Node.js", "Express", "MongoDB"],
  },
  {
    id: "gh-fallback-3",
    title: "VaxCare Healthcare",
    category: "TypeScript",
    subtitle: "Public health clinic immunization tracking and patient scheduling system with secure verification workflows.",
    imageUrl: "/download/Cloud.jpg",
    projectUrl: "https://github.com/ZAndrie/VaxCare",
    githubUrl: "https://github.com/ZAndrie/VaxCare",
    language: "TypeScript",
    topics: ["TypeScript", "React", "Tailwind", "Supabase"],
  },
  {
    id: "gh-fallback-4",
    title: "Emblemize AI",
    category: "Python / AI",
    subtitle: "Generative brand identity and logo synthesis experiment powered by deep learning latent diffusion pipelines.",
    imageUrl: "/download/LogoDesign.jpg",
    projectUrl: "https://github.com/ZAndrie/EmblemizeAI",
    githubUrl: "https://github.com/ZAndrie/EmblemizeAI",
    language: "Python",
    topics: ["Python", "PyTorch", "FastAPI", "Next.js"],
  },
];

export default function Portfolio({ projects = [] }: { projects?: PortfolioItem[] }) {
  const items: PortfolioItem[] = projects && projects.length > 0 ? projects : DEFAULT_FALLBACK_PROJECTS;
  const total = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const directoryListRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const activeProject = items[activeIndex] || items[0];

  // Dynamic scrub distance: smooth scroll distance per project
  const scrollDistance = Math.max(1, total - 1) * 580;

  // Programmatic jump to a specific project
  const goToProject = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(total - 1, index));
      setActiveIndex(clamped);

      const trig = triggerRef.current;
      if (trig) {
        const start = trig.start;
        const end = trig.end;
        const targetProgress = clamped / Math.max(1, total - 1);
        const targetScroll = start + targetProgress * (end - start);
        scrollToTarget(targetScroll, { duration: 0.8 });
      }
    },
    [total]
  );

  // Native CSS Sticky + GSAP ScrollTrigger Scrub
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const trig = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollProgress(p);
          const idx = Math.min(total - 1, Math.floor(p * total));
          setActiveIndex(idx);
        },
      });

      triggerRef.current = trig;
      ScrollTrigger.refresh();

      return () => {
        trig.kill();
        triggerRef.current = null;
      };
    },
    { scope: containerRef, dependencies: [total] }
  );

  // Auto-scroll the right directory list to keep active project in view
  useEffect(() => {
    const list = directoryListRef.current;
    if (!list) return;
    const activeItem = list.children[activeIndex] as HTMLElement | undefined;
    if (activeItem) {
      const top = activeItem.offsetTop - list.offsetTop;
      list.scrollTo({ top: top - 40, behavior: "smooth" });
    }
  }, [activeIndex]);

  const hasImage = Boolean(activeProject.imageUrl) && !imgErrorMap[activeProject.id];
  const techTags = activeProject.topics && activeProject.topics.length > 0
    ? activeProject.topics.slice(0, 4)
    : [activeProject.language || "TypeScript", "React", "Next.js", "Tailwind"].filter(Boolean);

  return (
    <div
      ref={containerRef}
      id="works"
      className="relative w-full z-10"
      style={{ height: `calc(100vh + ${scrollDistance}px)` }}
    >
      {/* ── STICKY VIEWPORT CONTAINER ── */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[85px] md:pt-[95px] pb-6 px-6 md:px-12 bg-[#070707]/65 backdrop-blur-[2px] z-20"
      >
        {/* Subtle Ambient Spotlight Matching 3D Room */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 25%, rgba(244, 221, 184, 0.09) 0%, rgba(7, 7, 7, 0.95) 75%)",
          }}
        />

        {/* ── TOP SECTION HEADER HUD ── */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                <span>02 / Production Works</span>
              </span>
              <span className="text-white/[0.2] hidden sm:inline-block">/</span>
              <span className="text-[12px] font-mono text-[#9ca3af] hidden sm:inline-block">
                Selected Case Studies &amp; Software Artifacts
              </span>
            </div>

            <div className="font-mono text-[11px] text-[#9ca3af] flex items-center gap-4">
              <span>
                INDEX <strong className="text-white">{String(activeIndex + 1).padStart(2, "0")}</strong> / {String(total).padStart(2, "0")}
              </span>
              <div className="w-24 h-[2px] bg-white/[0.1] rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-gradient-to-r from-[#d36b54] to-[#f4ddb8] transition-all duration-150"
                  style={{ width: `${Math.round(((activeIndex + 1) / total) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN SHOWCASE STAGE (3 COLUMNS) ── */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-0 py-4">
          
          {/* ── LEFT COLUMN: PROJECT DETAILS & ACTIONS ── */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col justify-between h-full py-2">
            
            {/* Top Indicator & Nav Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-[#d36b54] font-semibold">
                  {activeProject.category || "Full-Stack System"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase">
                  Verified
                </span>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goToProject(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous project"
                  className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-[#d36b54] hover:border-[#d36b54] text-white disabled:opacity-25 transition-all flex items-center justify-center text-xs font-mono cursor-pointer"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => goToProject(activeIndex + 1)}
                  disabled={activeIndex === total - 1}
                  aria-label="Next project"
                  className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-[#d36b54] hover:border-[#d36b54] text-white disabled:opacity-25 transition-all flex items-center justify-center text-xs font-mono cursor-pointer"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* Middle: Big Clean Title, Description, Tags */}
            <div className="my-auto py-4">
              <h2
                key={`title-${activeProject.id}`}
                className="font-heading text-[34px] sm:text-[44px] md:text-[50px] lg:text-[58px] font-bold text-[#ffffff] leading-[1.04] tracking-tight transition-all duration-300"
              >
                {activeProject.title}
              </h2>

              <p
                key={`desc-${activeProject.id}`}
                className="text-[14px] sm:text-[15px] text-[#9ca3af] font-sans leading-relaxed mt-4 line-clamp-3 sm:line-clamp-4 max-w-[440px] transition-all duration-300"
              >
                {activeProject.subtitle}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mt-5 font-mono text-[11px] text-[#d36b54]">
                {techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#e7e5df] hover:border-[#d36b54] transition-colors"
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Action Links */}
            <div className="flex items-center gap-4 pt-2">
              {activeProject.projectUrl && (
                <a
                  href={activeProject.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#d36b54] hover:bg-[#b5543f] text-white text-[11px] font-mono uppercase tracking-wider font-semibold transition-all duration-200 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(211,107,84,0.3)] hover:shadow-[0_0_25px_rgba(211,107,84,0.5)]"
                >
                  <span>Live Preview</span>
                  <span>↗</span>
                </a>
              )}

              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] text-white text-[11px] font-mono uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-2"
                >
                  <span>Source Code</span>
                  <span>↗</span>
                </a>
              )}
            </div>

          </div>

          {/* ── CENTER COLUMN: FLOATING SLEEK BROWSER SHOWCASE ── */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center justify-center relative h-full py-2">
            
            <div className="relative w-full max-w-[480px] lg:max-w-[500px] aspect-[16/10] bg-[#0c0c0f] border border-white/[0.1] rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)] group transition-all duration-500 hover:border-white/[0.2]">
              
              {/* Minimalist Browser Frame Top Bar */}
              <div className="w-full h-8 bg-black/60 backdrop-blur-md border-b border-white/[0.06] px-3.5 flex items-center justify-between z-20 relative">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
                </div>

                <div className="font-mono text-[9px] text-[#666] tracking-wider truncate max-w-[200px]">
                  {activeProject.title.toLowerCase().replace(/\s+/g, "-")}.dev
                </div>

                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Showcase Image */}
              {hasImage ? (
                <div className="relative w-full h-[calc(100%-2rem)]">
                  <Image
                    key={`img-${activeProject.id}`}
                    src={activeProject.imageUrl || "/download/Webdesign.jpg"}
                    alt={activeProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 540px"
                    className="object-cover filter contrast-[1.04] brightness-[0.95] transition-all duration-700 group-hover:scale-105"
                    onError={() =>
                      setImgErrorMap((prev) => ({ ...prev, [activeProject.id]: true }))
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-[calc(100%-2rem)] flex items-center justify-center bg-black/40 text-gray-500 font-mono text-xs">
                  <span>Interactive System Preview</span>
                </div>
              )}

              {/* Bottom Subtle Overlay Ribbon */}
              <div className="absolute bottom-2.5 left-3 right-3 z-30 flex items-center justify-between font-mono text-[9px] text-[#9ca3af] pointer-events-none">
                <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/[0.08] text-white">
                  CASE STUDY #{String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-[#a8a59d] hidden sm:inline-block">
                  {activeProject.language || "Web Architecture"}
                </span>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: NUMBERED PROJECT DIRECTORY ── */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between h-full py-2 pl-4 lg:pl-6 border-l border-white/[0.08] hidden md:flex">
            
            <div>
              <span className="block text-[11px] font-mono tracking-[2px] uppercase text-[#9ca3af] mb-4 font-semibold">
                Project Directory
              </span>

              {/* Vertical Scrollable List */}
              <ul
                ref={directoryListRef}
                className="flex flex-col gap-1.5 max-h-[58vh] overflow-y-auto scrollbar-none pr-2"
              >
                {items.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => goToProject(idx)}
                        className={`w-full text-left font-mono text-[12px] py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? "text-[#ffffff] font-semibold bg-white/[0.08] border border-white/[0.1] shadow-sm"
                            : "text-[#666] hover:text-[#ddd] hover:bg-white/[0.03]"
                        }`}
                      >
                        <span className="truncate pr-2 flex items-center gap-2">
                          <span className={`text-[10px] ${isActive ? "text-[#d36b54]" : "text-[#555]"}`}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{item.title}</span>
                        </span>

                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Bottom Status */}
            <div className="pt-4 border-t border-white/[0.08] font-mono text-[10px] text-[#666] flex flex-col gap-1 select-none">
              <div className="flex items-center justify-between text-[#888]">
                <span>VIEWING</span>
                <span className="text-[#d36b54] font-semibold">
                  {String(activeIndex + 1).padStart(2, "0")} OF {String(total).padStart(2, "0")}
                </span>
              </div>
              <div className="text-[10px] tracking-wider text-[#9ca3af]">
                SCROLL TO ADVANCE SHOWCASE
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
