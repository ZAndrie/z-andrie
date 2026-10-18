"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProjectCard from "./ProjectCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Portfolio({ projects = [] }: { projects?: any[] }) {
  const [filter, setFilter] = useState("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const uniqueCategories = Array.from(
    new Set(projects.map((p) => p.category?.trim() || "Web Development"))
  );
  
  const filters = [
    { label: "All Projects", value: "all" },
    ...uniqueCategories.map((cat) => ({ label: cat, value: cat.toLowerCase() })),
  ];

  const filteredItems =
    filter === "all"
      ? projects
      : projects.filter(
          (item) =>
            (item.category || "").toLowerCase() === filter.toLowerCase()
        );

  // GSAP Horizontal Scroll Pinning
  useGSAP(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    const progressBar = progressBarRef.current;
    if (!track || !container) return;

    const mm = gsap.matchMedia();

    // Desktop & Tablet (Horizontal Pin)
    mm.add("(min-width: 768px)", () => {
      const getScrollDistance = () => track.scrollWidth - window.innerWidth + (window.innerWidth * 0.08);

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              gsap.set(progressBar, { scaleX: self.progress });
            }
          },
        },
      });

      return () => {
        tween.kill();
      };
    });

    return () => mm.revert();
  }, { scope: containerRef, dependencies: [filteredItems] });

  // Smooth click scroll for button controls
  const handleScrollClick = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const amount = direction === "left" ? -460 : 460;
    trackRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section id="works" className="relative bg-[var(--color-light-bg)] border-t border-[var(--color-border)]">
      
      {/* Pinned Container for GSAP ScrollTrigger */}
      <div 
        ref={containerRef}
        className="w-full md:h-screen flex flex-col justify-between py-10 md:py-8 overflow-hidden relative"
      >
        
        {/* Top Pinned Header: Title, Filters & Controls */}
        <div className="w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] mb-6 z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-[3px] font-mono text-[var(--color-primary)] font-bold mb-2">
                HORIZONTAL SHOWCASE • GSAP PINNED
              </p>
              <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
                Selected <span className="text-[var(--color-primary)] italic">Works</span>
              </h2>
            </div>

            {/* Hint & Navigation Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-[var(--color-text-light)] uppercase tracking-wider hidden sm:inline-block">
                Scroll down to glide sideways →
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScrollClick("left")}
                  aria-label="Scroll left"
                  className="w-9 h-9 rounded-sm border border-[var(--color-border)] bg-white/80 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all flex items-center justify-center text-sm shadow-sm"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollClick("right")}
                  aria-label="Scroll right"
                  className="w-9 h-9 rounded-sm border border-[var(--color-border)] bg-white/80 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all flex items-center justify-center text-sm shadow-sm"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Minimalist Category Filter Pills */}
          <div className="flex gap-4 md:gap-6 border-b border-[var(--color-border)] pb-3 overflow-x-auto whitespace-nowrap scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-[11px] md:text-[12px] uppercase font-mono tracking-[1.5px] font-semibold transition-colors relative pb-1
                  ${filter === f.value 
                    ? "text-[var(--color-primary)] font-bold" 
                    : "text-[var(--color-text-light)] hover:text-[var(--color-text-dark)]"
                  }
                `}
              >
                {f.label}
                {filter === f.value && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[var(--color-primary)]" />
                )}
              </button>
            ))}
          </div>

          {/* GSAP Scroll Progress Line */}
          <div className="w-full h-[2px] bg-[var(--color-border)]/40 relative overflow-hidden mt-3 hidden md:block">
            <div 
              ref={progressBarRef}
              className="absolute top-0 left-0 bottom-0 w-full bg-[var(--color-primary)] origin-left scale-x-0"
            />
          </div>
        </div>

        {/* Horizontal Moving Cards Track */}
        <div className="w-full flex-1 flex items-center overflow-x-auto md:overflow-x-visible scrollbar-none my-auto">
          <div 
            ref={trackRef}
            className="flex flex-row items-stretch gap-6 sm:gap-8 px-[5%] md:px-[8%] py-4 will-change-transform"
          >
            {/* Intro Lead Card */}
            <div className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 h-[480px] sm:h-[510px] bg-white/40 border border-dashed border-[var(--color-border)] p-8 rounded-sm flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-mono text-[var(--color-primary)] font-bold uppercase tracking-widest">
                  01 / CURATED REEL
                </span>
                <h3 className="text-[26px] sm:text-[32px] font-serif uppercase text-[var(--color-text-dark)] leading-tight mt-4 mb-4">
                  Interactive Projects &amp; <span className="italic text-[var(--color-primary)]">Experiments</span>
                </h3>
                <p className="text-[13px] text-[var(--color-text-light)] leading-relaxed font-light">
                  Explore full-stack applications, Quarter 1 React &amp; GSAP mini-projects, interactive components, and system prototypes.
                </p>
              </div>

              <div className="pt-6 border-t border-[var(--color-border)] flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--color-primary)]">
                <span>GLIDE SIDEWAYS</span>
                <span className="text-base leading-none">→</span>
              </div>
            </div>

            {/* Filtered Project Cards */}
            {filteredItems.length === 0 ? (
              <div className="w-[380px] shrink-0 h-[480px] bg-white/50 border border-[var(--color-border)] rounded-sm p-10 flex flex-col items-center justify-center text-center">
                <p className="text-[14px] text-[var(--color-text-light)] italic">
                  No projects in this category.
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <ProjectCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  category={item.category}
                  language={item.language}
                  imageUrl={item.imageUrl}
                  githubUrl={item.githubUrl}
                  projectUrl={item.projectUrl}
                  stars={item.stars}
                  topics={item.topics}
                  index={index}
                  className="w-[320px] sm:w-[390px] md:w-[440px] shrink-0 h-[480px] sm:h-[510px] flex flex-col justify-between bg-white/90 hover:bg-white border border-[var(--color-border)] p-5 sm:p-6 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
                />
              ))
            )}

            {/* Outro GitHub Explorer Card */}
            <div className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 h-[480px] sm:h-[510px] bg-[var(--color-dark-bg)] text-white p-8 rounded-sm flex flex-col justify-between border border-[#333]">
              <div>
                <span className="text-[12px] font-mono text-[var(--color-primary)] font-bold uppercase tracking-widest">
                  EXPLORE ARCHIVE
                </span>
                <h3 className="text-[26px] sm:text-[32px] font-serif uppercase text-white leading-tight mt-4 mb-4">
                  Want to see more <span className="italic text-[var(--color-primary)]">code?</span>
                </h3>
                <p className="text-[13px] text-[#aaa] leading-relaxed font-light">
                  Browse over 30+ open-source repositories, system architectures, and experiment repositories directly on my GitHub profile.
                </p>
              </div>

              <div className="pt-6 border-t border-[#333]">
                <a
                  href="https://github.com/ZAndrie"
                  target="_blank"
                  rel="noreferrer"
                  className="group text-[12px] font-bold uppercase tracking-[2px] text-white hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-3"
                >
                  <span className="roll">
                    <span className="roll__inner">
                      <span>VISIT GITHUB REPOSITORY</span>
                      <span className="roll__ghost text-[var(--color-primary)]">VISIT GITHUB REPOSITORY</span>
                    </span>
                  </span>
                  <span className="arrow-swap text-[var(--color-primary)] w-[12px] h-[12px]">
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Pinned Bottom Label */}
        <div className="w-full max-w-[1400px] mx-auto px-[5%] md:px-[8%] pt-2 text-right hidden md:block">
          <p className="text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-text-light)] opacity-70">
            [ PINNED WORK REEL — SCROLL VERTICALLY TO NAVIGATE ]
          </p>
        </div>

      </div>
    </section>
  );
}
