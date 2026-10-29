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

const COMPANION_TIPS = [
  "BIT  quarter 1 interactive showcase. check the motion physics.",
  "BIT  scroll vertically or use ↑ and ↓ keys to flip through projects.",
  "BIT  high-performance telemetry feed with real-time state sync.",
  "BIT  full-stack reservation system with role-based auth.",
  "BIT  device asset inventory built for high-throughput lab workflows.",
  "BIT  secure patient scheduling with cryptographic verification.",
  "BIT  latent diffusion neural network experiment for visual identity.",
];

// Odometer digit column with vertical strip 0..9
function OdometerDigit({ value }: { value: number }) {
  return (
    <div className="h-[48px] sm:h-[60px] md:h-[72px] overflow-hidden leading-none select-none inline-block">
      <div
        className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center"
        style={{ transform: `translateY(-${value * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span
            key={n}
            className="h-[48px] sm:h-[60px] md:h-[72px] flex items-center justify-center font-stencil font-black text-[46px] sm:text-[58px] md:text-[70px] text-[#e7e5df]"
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function Odometer({ current }: { current: number }) {
  const tens = Math.floor(current / 10);
  const ones = current % 10;
  return (
    <div className="inline-flex items-center">
      <OdometerDigit value={tens} />
      <OdometerDigit value={ones} />
    </div>
  );
}

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

  // Native CSS Sticky + GSAP ScrollTrigger Scrub (No DOM pin-spacer warping)
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const trig = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
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

  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Keyboard Navigation: ArrowUp / ArrowDown / ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      // Pinned works stage is active while container occupies the viewport
      const isActive = rect.top <= 120 && rect.bottom >= 120;
      if (!isActive) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const current = activeIndexRef.current;
        if (current < total - 1) {
          e.preventDefault();
          goToProject(current + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const current = activeIndexRef.current;
        if (current > 0) {
          e.preventDefault();
          goToProject(current - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, goToProject]);

  // Keep active item scrolled into view in directory list (ONLY inside list container, NEVER scroll window on load)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const container = directoryListRef.current;
    if (!container) return;
    const activeEl = container.children[activeIndex] as HTMLElement | undefined;
    if (activeEl) {
      const elTop = activeEl.offsetTop;
      const elHeight = activeEl.offsetHeight;
      const cTop = container.scrollTop;
      const cHeight = container.clientHeight;

      if (elTop < cTop) {
        container.scrollTo({ top: elTop, behavior: "smooth" });
      } else if (elTop + elHeight > cTop + cHeight) {
        container.scrollTo({ top: elTop + elHeight - cHeight, behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -50) {
      goToProject(activeIndex + 1);
    } else if (diff > 50) {
      goToProject(activeIndex - 1);
    }
  };

  const currentDisplayNumber = activeIndex + 1;
  const companionTip = COMPANION_TIPS[activeIndex % COMPANION_TIPS.length];

  // Safe image resolution
  const hasImage = Boolean(activeProject.imageUrl) && !imgErrorMap[activeProject.id];
  const techTags =
    activeProject.topics && activeProject.topics.length > 0
      ? activeProject.topics.slice(0, 4)
      : [activeProject.language || "TypeScript", "Tailwind", "GSAP"].filter(Boolean);

  return (
    <section
      id="works"
      ref={containerRef}
      style={{
        height: `calc(100vh + ${scrollDistance}px)`,
      }}
      className="relative w-full bg-transparent text-[#e7e5df] border-t border-[#232220]/50 select-none"
    >
      {/* ── THEATRICAL VIEWPORT STAGE (STICKY TOP-0 FOR NATIVE 60FPS COMPOSITING) ── */}
      <div
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[75px] md:pt-[90px] pb-5 px-6 md:px-12 bg-[#070707]/60 backdrop-blur-[1px] z-20"
      >
        {/* Theatrical background atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 25%, rgba(244, 221, 184, 0.1) 0%, rgba(7, 7, 7, 0.98) 75%)`,
          }}
        />

        {/* ── MAIN 3-COLUMN THEATRICAL SHOWCASE ── */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center min-h-0">
          
          {/* ── LEFT COLUMN: ODOMETER & PROJECT BRIEF ── */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col justify-between h-full py-2 max-w-[480px]">
            {/* Top: Section Tag, Odometer & Controls */}
            <div>
              <span className="block text-[11px] font-mono tracking-[3px] uppercase text-[#d36b54] mb-1 font-bold">
                [ 02 // SELECTED WORKS ]
              </span>

              <div className="flex items-baseline gap-3">
                <Odometer current={currentDisplayNumber} />
                <span className="text-[13px] md:text-[14px] font-mono text-[#666]">
                  / {String(total).padStart(2, "0")}
                </span>

                {/* Diallo-style Navigation Arrow Buttons */}
                <div className="inline-flex items-center gap-1.5 ml-3">
                  <button
                    type="button"
                    onClick={() => goToProject(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    aria-label="Previous project"
                    className="w-7 h-7 rounded-sm border border-[#2a2a2a] bg-[#111] text-[#999] hover:text-[#f4ddb8] hover:border-[#f4ddb8] disabled:opacity-30 disabled:hover:border-[#2a2a2a] disabled:hover:text-[#999] transition-colors flex items-center justify-center text-[12px] font-mono cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => goToProject(activeIndex + 1)}
                    disabled={activeIndex === total - 1}
                    aria-label="Next project"
                    className="w-7 h-7 rounded-sm border border-[#2a2a2a] bg-[#111] text-[#999] hover:text-[#f4ddb8] hover:border-[#f4ddb8] disabled:opacity-30 disabled:hover:border-[#2a2a2a] disabled:hover:text-[#999] transition-colors flex items-center justify-center text-[12px] font-mono cursor-pointer"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>

            {/* Middle: Category, Big Stencil Title, Description, Tags */}
            <div className="my-auto py-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-[2px] text-[#888]">
                  {activeProject.category?.toLowerCase() || "website"}
                </span>
                <span className="px-2 py-0.5 rounded-sm border border-[#2e2e2e] bg-[#141414] text-[#f4ddb8] text-[9px] font-mono uppercase tracking-widest">
                  Live Showcase
                </span>
              </div>

              {/* Massive Stencil Title with animated transition */}
              <h2
                key={`title-${activeProject.id}`}
                className="font-stencil text-[36px] sm:text-[48px] md:text-[56px] lg:text-[68px] font-black uppercase text-[#e7e5df] leading-[0.92] tracking-tight transition-all duration-300"
              >
                {activeProject.title}
              </h2>

              <p
                key={`desc-${activeProject.id}`}
                className="text-[13px] sm:text-[14px] text-[#a8a59d] font-sans leading-relaxed mt-4 line-clamp-3 sm:line-clamp-4 max-w-[420px] transition-all duration-300"
              >
                {activeProject.subtitle}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2.5 mt-5 font-mono text-[11px] md:text-[12px] text-[#d36b54]">
                {techTags.map((tag) => (
                  <span key={tag} className="hover:text-[#f4ddb8] transition-colors">
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Action Links */}
            <div className="flex items-center gap-6 pt-2">
              {activeProject.projectUrl && (
                <a
                  href={activeProject.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-[12px] md:text-[13px] font-mono uppercase tracking-[2px] text-[#e7e5df] hover:text-[#f4ddb8] transition-colors"
                >
                  <span className="border-b border-[#444] group-hover:border-[#f4ddb8] pb-0.5 transition-colors">
                    Visit site
                  </span>
                  <span className="text-[11px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </a>
              )}

              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-[12px] md:text-[13px] font-mono uppercase tracking-[2px] text-[#888] hover:text-[#e7e5df] transition-colors"
                >
                  <span className="border-b border-transparent group-hover:border-[#888] pb-0.5 transition-colors">
                    Source
                  </span>
                  <span className="text-[11px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* ── CENTER COLUMN: HANGING PROJECTOR SCREEN & BIT COMPANION ── */}
          <div className="md:col-span-5 lg:col-span-5 flex flex-col items-center justify-center relative h-full py-2">
            
            {/* Top Projector Mounting Cable & Bar */}
            <div className="w-[180px] sm:w-[220px] h-[18px] relative flex flex-col items-center -mb-1 z-10">
              <div className="w-[2px] h-[10px] bg-[#2a2a2a]" />
              <div className="w-full h-[3px] bg-[#232220] rounded-full border-t border-[#3a3937]" />
            </div>

            {/* Theatrical Projector Screen Canvas */}
            <div className="relative w-full max-w-[500px] lg:max-w-[540px] aspect-[16/10] bg-[#0c0c0c] border border-[#242321] rounded-sm overflow-hidden shadow-[0_0_50px_rgba(244,221,184,0.06)] group">
              
              {/* Incandescent Overhead Beam Wash */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% -10%, rgba(244, 221, 184, 0.25) 0%, rgba(244, 221, 184, 0.05) 55%, transparent 80%)",
                }}
              />

              {/* Screen Fine Scanline Overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-20 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 3px, rgba(0, 0, 0, 0.4) 4px)",
                }}
              />

              {/* Screen Projector Content: Project Visual */}
              {hasImage ? (
                <div className="relative w-full h-full">
                  <Image
                    key={`img-${activeProject.id}`}
                    src={activeProject.imageUrl || "/download/Webdesign.jpg"}
                    alt={activeProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 540px"
                    className="object-cover filter contrast-[1.05] brightness-[0.9] saturate-[0.85] transition-all duration-500 group-hover:scale-105"
                    onError={() =>
                      setImgErrorMap((prev) => ({ ...prev, [activeProject.id]: true }))
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-[#070707]/20 to-transparent" />
                </div>
              ) : null}

              {/* Luminous Stencil Projection Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center pointer-events-none">
                <span
                  key={`proj-title-${activeProject.id}`}
                  className="font-stencil text-[36px] sm:text-[46px] md:text-[54px] lg:text-[62px] font-black uppercase text-[#f4ddb8] drop-shadow-[0_0_25px_rgba(244,221,184,0.55)] tracking-wide leading-tight transition-all duration-300"
                >
                  {activeProject.title}
                </span>
                <span className="text-[11px] font-mono tracking-[3px] text-[#e7e5df]/70 uppercase mt-2">
                  [ {activeProject.category || "Interactive System"} ]
                </span>
              </div>

              {/* Screen Bezel Telemetry Stamp */}
              <div className="absolute bottom-2 left-3 z-30 font-mono text-[9px] text-[#777] uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ddb8] animate-pulse" />
                PROJECTION ACTIVE
              </div>
            </div>

            {/* ── UNDER SCREEN: RETRO DESK, CRT TERMINAL & BIT COMPANION ── */}
            <div className="w-full max-w-[500px] lg:max-w-[540px] flex items-end justify-between mt-3 px-2">
              
              {/* Retro CRT Monitor with phosphor green text */}
              <div className="w-[120px] sm:w-[140px] p-2 bg-[#101010] border border-[#232220] rounded-sm font-mono text-[9px] text-[#4af626] leading-snug select-none hidden sm:block">
                <div className="text-[#888] text-[8px] mb-1">TERMINAL // BIT</div>
                <div className="truncate">&gt; PROJECT: #{String(currentDisplayNumber).padStart(2, "0")}</div>
                <div className="truncate">&gt; STATE: MOUNTED</div>
              </div>

              {/* Robot Companion BIT with glowing LED eyes */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-12 h-9 bg-[#1a1917] border border-[#333] rounded-t-md flex items-center justify-center gap-2 shadow-inner">
                  {/* Glowing LED Eyes */}
                  <span className="w-2 h-2 rounded-full bg-[#52ff40] shadow-[0_0_8px_#52ff40] animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-[#52ff40] shadow-[0_0_8px_#52ff40] animate-pulse" />
                </div>
                <div className="w-14 h-2 bg-[#121110] border-t border-[#262523]" />
              </div>

              {/* Dynamic Speech Bubble from BIT */}
              <div className="max-w-[210px] sm:max-w-[240px] p-2.5 bg-[#121110]/95 border border-[#2b2a28] rounded-sm font-mono text-[10px] text-[#e7e5df] leading-snug shadow-lg relative">
                <div className="text-[9px] font-bold text-[#f4ddb8] tracking-wider mb-0.5">
                  BIT
                </div>
                <p className="line-clamp-2 text-[#a8a59d]">
                  {companionTip}
                </p>
                {/* Speech arrow */}
                <div className="absolute -left-1.5 bottom-3 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-[#2b2a28]" />
              </div>

            </div>
          </div>

          {/* ── RIGHT COLUMN: NUMBERED PROJECT DIRECTORY ── */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between h-full py-2 pl-2 lg:pl-6 border-l border-[#1f1e1c]/80 hidden md:flex">
            
            {/* Header */}
            <div>
              <span className="block text-[11px] font-mono tracking-[3px] uppercase text-[#888] mb-4">
                Directory
              </span>

              {/* Vertical Scrollable Numbered List */}
              <ul
                ref={directoryListRef}
                className="flex flex-col gap-2 max-h-[58vh] overflow-y-auto scrollbar-none pr-2"
              >
                {items.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => goToProject(idx)}
                        className={`w-full text-left font-mono text-[12px] lg:text-[13px] py-1.5 px-2 rounded-sm transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? "text-[#e7e5df] font-bold bg-[#141414] border-l-2 border-[#d36b54]"
                            : "text-[#555] hover:text-[#bbb] hover:bg-[#0e0e0e]"
                        }`}
                      >
                        <span className="truncate pr-2">
                          <span
                            className={`inline-block w-6 text-[11px] ${
                              isActive ? "text-[#d36b54]" : "text-[#444] group-hover:text-[#777]"
                            }`}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          {item.title}
                        </span>

                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54] shadow-[0_0_6px_#d36b54] shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Bottom Status & Coordinates */}
            <div className="pt-4 border-t border-[#1f1e1c] font-mono text-[10px] text-[#666] flex flex-col gap-1 select-none">
              <div className="flex items-center justify-between text-[#888]">
                <span>PROJECTING</span>
                <span className="text-[#d36b54]">
                  {String(currentDisplayNumber).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>
              <div className="text-[9px] tracking-wider text-[#555]">
                x {((scrollProgress * 1.8) - 0.9).toFixed(2)} y {(1.21 - scrollProgress * 0.45).toFixed(2)} 2700K
              </div>
            </div>

          </div>

        </div>

        {/* ── BOTTOM STAGE PROGRESS BAR & CONTROLS HINT ── */}
        <div className="relative z-10 w-full max-w-[1550px] mx-auto pt-3">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#666] uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4ddb8]" />
              Vertical Scrub Mode
            </span>
            <span className="hidden sm:inline-block">
              [↑ / ↓] Scroll or Arrow Keys to Navigate
            </span>
            <span>
              {Math.round(((activeIndex + 1) / total) * 100)}% Curated
            </span>
          </div>

          {/* GSAP Progress Line */}
          <div className="w-full h-[2px] bg-[#1a1918] relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 bottom-0 bg-[#d36b54] transition-all duration-150 ease-out"
              style={{
                width: `${Math.max(4, Math.round(scrollProgress * 100))}%`,
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
