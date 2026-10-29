"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToTarget } from "@/lib/smoothScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ResumeItem = {
  id: string;
  year?: string;
  title: string;
  subtitle?: string;
  category?: "skills" | "education" | "experience" | string;
  institution?: string;
  roleType?: string;
  bullets?: string[];
  spotlightWord?: string;
  percentage?: string;
  discipline?: string;
  desc?: string;
  tags?: string[];
  order?: number;
};

// ── DYNAMIC ICON RESOLVER FOR GITHUB SKILLS ──
function getSkillIcon(title: string) {
  const t = (title || "").toLowerCase();
  if (t.includes("qa") || t.includes("quality") || t.includes("test") || t.includes("audit")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (t.includes("ui") || t.includes("ux") || t.includes("design") || t.includes("figma") || t.includes("prototype")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  if (t.includes("react") || t.includes("next") || t.includes("frontend") || t.includes("script") || t.includes("code")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (t.includes("full") || t.includes("back") || t.includes("laravel") || t.includes("php") || t.includes("sql") || t.includes("db") || t.includes("api")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7" />
        <path d="M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4" />
        <path d="M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4" />
      </svg>
    );
  }
  if (t.includes("defense") || t.includes("cisco") || t.includes("cyber") || t.includes("security") || t.includes("network")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

// ── TAGS RESOLVER (STRICTLY FROM USER INPUT) ──
function getSkillTags(title: string, subtitle?: string, tags?: string[]): string[] {
  if (tags && tags.length > 0) return tags;
  if (subtitle && subtitle.includes(",")) {
    return subtitle.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [title];
}

// ── DYNAMIC SPOTLIGHT ACRONYM ──
function getMilestoneSpotlightWord(m: ResumeItem): string {
  const t = `${m.title || ""} ${m.roleType || ""} ${m.subtitle || ""}`.toLowerCase();
  if (t.includes("senior high") || t.includes("shs")) return "SHS";
  if (t.includes("junior high") || t.includes("jhs") || t.includes("digos")) return "JHS";
  if (t.includes("bs") || t.includes("information tech") || t.includes("college")) return "BSIT";
  if (t.includes("assistant")) return "ASSISTANT";
  if (t.includes("developer") || t.includes("engineer")) return "DEV";
  if (m.spotlightWord) return m.spotlightWord;
  return (m.title || "").split(" ")[0].toUpperCase() || "RECORD";
}

// ── SAFETY NET FALLBACKS (ONLY USED IF GITHUB REPO IS COMPLETELY EMPTY) ──
const ARCHITECTURAL_PILLARS = [
  {
    code: "01",
    title: "User-Centered Interaction",
    discipline: "UI/UX DESIGN & PROTOTYPING",
    desc: "",
    tags: ["UI/UX Design", "Prototyping"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const EDUCATION_MILESTONES: ResumeItem[] = [
  {
    id: "edu-1",
    category: "education",
    year: "2023 — 2027",
    title: "BS INFORMATION TECH",
    roleType: "SOFTWARE & WEB SYSTEMS SPECIALIZATION",
    institution: "at Cor Jesu College",
    spotlightWord: "BSIT",
  },
];

const EXPERIENCE_MILESTONES: ResumeItem[] = [
  {
    id: "exp-1",
    category: "experience",
    year: "2023 — Present",
    title: "STUDENT ASSISTANT",
    roleType: "IT FACILITIES & LAB OPERATIONS",
    institution: "at Cor Jesu College • IT Department",
    spotlightWord: "COR JESU",
  },
];

export default function Expertise({ initialItems = [] }: { initialItems?: ResumeItem[] }) {
  // ── 1. DYNAMIC SKILLS FROM GITHUB REPOSITORY ──
  const customSkills = (initialItems || []).filter((i) => i.category === "skills");

  const displayPillars =
    customSkills.length > 0
      ? customSkills.map((skill, idx) => ({
          code: String(idx + 1).padStart(2, "0"),
          title: skill.title,
          discipline:
            skill.discipline ||
            skill.roleType ||
            (skill.subtitle && skill.subtitle.length < 35
              ? skill.subtitle.toUpperCase()
              : "TECHNICAL SPECIALIZATION"),
          // Strictly from user: only show description if user entered desc or long subtitle
          desc: skill.desc || (skill.subtitle && skill.subtitle.length >= 20 ? skill.subtitle : ""),
          tags: getSkillTags(skill.title, skill.subtitle, skill.tags),
          icon: getSkillIcon(skill.title),
        }))
      : ARCHITECTURAL_PILLARS;

  // ── 2. DYNAMIC TECHNOLOGY MATRIX (FROM LIVE SKILLS & CORE STACK) ──
  const dynamicTechMatrix = Array.from(
    new Set([
      ...displayPillars.flatMap((p) => p.tags),
      "Next.js 16",
      "React 19",
      "TypeScript",
      "GSAP 3",
      "Tailwind v4",
      "Blade",
      "MySQL",
      "Figma",
      "Git & GitHub",
    ])
  ).slice(0, 16);

  // ── 3. DYNAMIC EDUCATION & WORK EXPERIENCE TRAJECTORY ──
  const customEdu = (initialItems || []).filter(
    (i) => i.category === "education" && !i.year?.includes("%")
  );
  const customExp = (initialItems || []).filter(
    (i) => i.category === "experience" && !i.year?.includes("%")
  );

  const eduItems = customEdu.length > 0 ? customEdu : EDUCATION_MILESTONES;
  const expItems = customExp.length > 0 ? customExp : EXPERIENCE_MILESTONES;

  // Strict sequential order: Education first, then Work Experience
  const milestones: ResumeItem[] = [...eduItems, ...expItems];
  const totalMilestones = milestones.length;

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);

  const skillsContainerRef = useRef<HTMLElement>(null);
  const pathContainerRef = useRef<HTMLDivElement>(null);
  const pathStageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const activeMilestone = milestones[activeMilestoneIndex] || milestones[0];
  const isEducation = activeMilestone.category === "education";

  // STRICTLY USER SUPPLIED: Only show bullet points or description if the user entered them!
  const milestoneBullets: string[] =
    activeMilestone.bullets && activeMilestone.bullets.length > 0
      ? activeMilestone.bullets
      : activeMilestone.desc
      ? activeMilestone.desc.split("\n").map((l) => l.trim()).filter(Boolean)
      : [];

  // Dynamic scrub distance: expanded scroll runway so fast scrolling does not bypass milestones
  const scrollDistance = Math.max(1, totalMilestones - 1) * 1150 + 750;

  // Jump smoothly to a specific milestone
  const goToMilestone = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalMilestones - 1, index));
      setActiveMilestoneIndex(clamped);

      const trig = triggerRef.current;
      if (trig) {
        const start = trig.start;
        const end = trig.end;
        const leadIn = 0.05;
        const leadOut = 0.05;
        const usableRange = 1 - leadIn - leadOut;
        const targetProgress =
          leadIn + ((clamped + 0.5) / Math.max(1, totalMilestones)) * usableRange;
        const targetScroll = start + targetProgress * (end - start);
        scrollToTarget(targetScroll, { duration: 0.8 });
      }
    },
    [totalMilestones]
  );

  // Native CSS Sticky + GSAP ScrollTrigger Scrub for Trajectory Showcase
  useGSAP(
    () => {
      const container = pathContainerRef.current;
      if (!container) return;

      const trig = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setTimelineProgress(p);
          const leadIn = 0.05;
          const leadOut = 0.05;
          const effectiveP = Math.max(0, Math.min(1, (p - leadIn) / (1 - leadIn - leadOut)));
          const idx = Math.min(totalMilestones - 1, Math.floor(effectiveP * totalMilestones));
          setActiveMilestoneIndex(idx);
        },
      });

      triggerRef.current = trig;
      ScrollTrigger.refresh();

      return () => {
        trig.kill();
        triggerRef.current = null;
      };
    },
    { scope: pathContainerRef, dependencies: [totalMilestones] }
  );

  // Touch swipe support for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff < -50) {
      goToMilestone(activeMilestoneIndex + 1);
    } else if (diff > 50) {
      goToMilestone(activeMilestoneIndex - 1);
    }
  };

  const activeMilestoneIndexRef = useRef(activeMilestoneIndex);
  useEffect(() => {
    activeMilestoneIndexRef.current = activeMilestoneIndex;
  }, [activeMilestoneIndex]);

  // Keyboard Navigation: ArrowUp / ArrowDown / ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = pathContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isActive = rect.top <= 120 && rect.bottom >= 120;
      if (!isActive) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const current = activeMilestoneIndexRef.current;
        if (current < totalMilestones - 1) {
          e.preventDefault();
          goToMilestone(current + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const current = activeMilestoneIndexRef.current;
        if (current > 0) {
          e.preventDefault();
          goToMilestone(current - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalMilestones, goToMilestone]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          ORDER 1: CORE ARCHITECTURAL PILLARS (SKILLS & TECHNICAL DISCIPLINES)
          (DYNAMIC FROM GITHUB PORTFOLIO-CONTENTS/EXPERTISE)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="skills"
        ref={skillsContainerRef}
        className="py-20 md:py-24 px-[5%] md:px-[8%] bg-[#080807] text-[#e7e5df] border-t border-[#232220]/50 relative z-10 select-none"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#232220]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[3px] text-[#d36b54] font-bold block mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d36b54]" />
                [ 01 // SKILLS &amp; TECHNICAL DISCIPLINES ]
              </span>
              <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-stencil uppercase text-[#e7e5df] leading-none">
                Skills &amp; Architectural Stack
              </h2>
            </div>
            <p className="text-[12px] font-mono text-[#888] max-w-[420px] leading-relaxed">
              Synchronized live from GitHub portfolio repository. Technical specializations, design systems, and verified software paradigms.
            </p>
          </div>

          {/* Dynamic Architectural Discipline Cards from GitHub */}
          <div
            className={`grid grid-cols-1 ${
              displayPillars.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
            } gap-5 lg:gap-6 mb-8`}
          >
            {displayPillars.map((pillar) => (
              <div
                key={pillar.code}
                className="group bg-[#0e0d0c] hover:bg-[#12110f] border border-[#232220] hover:border-[#d36b54]/60 p-6 md:p-7 rounded-sm transition-all duration-300 relative flex flex-col justify-between"
              >
                {/* Viewfinder crosshairs */}
                <span className="absolute -top-1 -left-1 text-[11px] font-mono text-[#d36b54] font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                <span className="absolute -top-1 -right-1 text-[11px] font-mono text-[#d36b54] font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-[#d36b54] font-bold tracking-widest">
                      [{pillar.code}]
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-[#161513] border border-[#262523] flex items-center justify-center text-[#f4ddb8] group-hover:text-[#d36b54] transition-colors">
                      {pillar.icon}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#888] block mb-1">
                    {pillar.discipline}
                  </span>
                  <h3 className="text-[18px] sm:text-[20px] font-stencil uppercase text-[#e7e5df] tracking-wide mb-2.5">
                    {pillar.title}
                  </h3>
                  {pillar.desc && (
                    <p className="text-[13px] text-[#a8a59d] leading-relaxed font-sans">
                      {pillar.desc}
                    </p>
                  )}
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 pt-5 mt-5 border-t border-[#1c1b19]">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-sm bg-[#141312] border border-[#242321] text-[#e7e5df]/80 group-hover:border-[#d36b54]/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technology Matrix */}
          <div className="p-6 md:p-8 bg-[#0c0c0b] border border-[#232220] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[2.5px] text-[#888] block mb-1">
                TECHNOLOGY MATRIX
              </span>
              <h4 className="text-[14px] font-mono text-[#e7e5df] uppercase tracking-[1.5px]">
                Active Production &amp; Research Stack
              </h4>
            </div>

            <div className="flex flex-wrap gap-2 sm:max-w-[700px]">
              {dynamicTechMatrix.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-[#141413] hover:bg-[#1a1917] border border-[#262523] hover:border-[#f4ddb8] text-[11px] font-mono text-[#e7e5df] rounded-sm transition-colors cursor-default"
                >
                  #{tech.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ORDER 2 & 3: THEATRICAL TRAJECTORY SHOWCASE
          (STRICTLY ORDERED: EDUCATION FIRST, THEN WORK EXPERIENCE)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="expertise"
        ref={pathContainerRef}
        style={{
          height: `calc(100vh + ${scrollDistance}px)`,
        }}
        className="relative w-full bg-transparent text-[#e7e5df] border-t border-[#232220]/50 select-none"
      >
        {/* ── THEATRICAL STAGE (STICKY TOP-0) ── */}
        <div
          ref={pathStageRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[75px] md:pt-[90px] pb-5 px-6 md:px-12 bg-[#070707]/60 backdrop-blur-[1px] z-20"
        >
          {/* Subtle theatrical background atmosphere */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 30%, rgba(244, 221, 184, 0.08) 0%, rgba(7, 7, 7, 0.98) 75%)`,
            }}
          />

          {/* ── MAIN 3-COLUMN THEATRICAL SHOWCASE ── */}
          <div className="relative z-10 w-full max-w-[1550px] mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center min-h-0">
            
            {/* ── LEFT COLUMN: ROLE, CREDENTIALS & ACCOMPLISHMENTS ── */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between h-full py-2 max-w-[620px]">
              {/* Top: Section Eyebrow (Education vs Work Experience), Date & Controls */}
              <div>
                <span className="block text-[11px] font-mono tracking-[3px] uppercase text-[#d36b54] mb-1 font-bold">
                  {isEducation ? "[ EDUCATION & ACADEMIC PATH ]" : "[ WORK EXPERIENCE & APPOINTMENT ]"}
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-mono text-[#f4ddb8] tracking-wider font-bold">
                      {activeMilestone.year}
                    </span>
                    <span className="text-[11px] font-mono text-[#666]">
                      / MILESTONE {String(activeMilestoneIndex + 1).padStart(2, "0")} OF {String(totalMilestones).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Diallo-style Navigation Arrow Buttons */}
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goToMilestone(activeMilestoneIndex - 1)}
                      disabled={activeMilestoneIndex === 0}
                      aria-label="Previous milestone"
                      className="w-7 h-7 rounded-sm border border-[#2a2a2a] bg-[#111] text-[#999] hover:text-[#f4ddb8] hover:border-[#f4ddb8] disabled:opacity-30 disabled:hover:border-[#2a2a2a] disabled:hover:text-[#999] transition-colors flex items-center justify-center text-[12px] font-mono cursor-pointer"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => goToMilestone(activeMilestoneIndex + 1)}
                      disabled={activeMilestoneIndex === totalMilestones - 1}
                      aria-label="Next milestone"
                      className="w-7 h-7 rounded-sm border border-[#2a2a2a] bg-[#111] text-[#999] hover:text-[#f4ddb8] hover:border-[#f4ddb8] disabled:opacity-30 disabled:hover:border-[#2a2a2a] disabled:hover:text-[#999] transition-colors flex items-center justify-center text-[12px] font-mono cursor-pointer"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle: Giant Stencil Title & Bullets */}
              <div className="my-auto py-3">
                <h2
                  key={`title-${activeMilestone.id}`}
                  className="font-stencil text-[36px] sm:text-[48px] md:text-[56px] lg:text-[68px] font-black uppercase text-[#e7e5df] leading-[0.92] tracking-tight transition-opacity duration-300"
                >
                  {activeMilestone.title}
                </h2>

                <div className="text-[12px] md:text-[13px] font-mono uppercase tracking-[2px] text-[#d36b54] font-bold mt-2">
                  {activeMilestone.roleType || (isEducation ? "ACADEMIC PROGRAM" : "WORK EXPERIENCE")}
                </div>

                {activeMilestone.subtitle && (
                  <div className="text-[13px] md:text-[14px] font-sans text-[#e7e5df] italic mt-1 mb-4">
                    {activeMilestone.subtitle}
                  </div>
                )}

                {/* Accomplishment Bullet Points (Strictly from user input) */}
                {milestoneBullets.length > 0 && (
                  <ul className="flex flex-col gap-2.5 text-[12px] sm:text-[13px] text-[#a8a59d] font-sans leading-relaxed pl-1 mt-2">
                    {milestoneBullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <span className="text-[#d36b54] text-[14px] leading-none shrink-0 mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Bottom: Milestone ID Tag */}
              <div className="pt-2 text-[11px] font-mono uppercase tracking-[2px] text-[#666]">
                <span>
                  {isEducation ? "[ EDUCATION ]" : "[ WORK EXPERIENCE ]"} • MILESTONE {String(activeMilestoneIndex + 1).padStart(2, "0")} / {String(totalMilestones).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* ── CENTER COLUMN: SPOTLIGHT CIRCLE ON WALL WITH SHADOW PARTICLES ── */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center justify-center relative h-full py-2">
              
              {/* Overhead Pendant Lamp Mount */}
              <div className="w-[140px] sm:w-[180px] h-[16px] relative flex flex-col items-center -mb-1 z-10">
                <div className="w-[2px] h-[10px] bg-[#2a2a2a]" />
                <div className="w-full h-[3px] bg-[#232220] rounded-full border-t border-[#3a3937]" />
              </div>

              {/* Theatrical Spotlight Puddle on Wall */}
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] aspect-square rounded-full flex items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(244,221,184,0.12)]">
                {/* Concentrated Warm Incandescent Light Pool */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(244,221,184,0.95) 0%, rgba(220,185,135,0.75) 45%, rgba(160,110,65,0.25) 75%, transparent 100%)",
                  }}
                />

                {/* Film grain / Halftone texture overlay */}
                <div
                  className="absolute inset-0 rounded-full opacity-15 pointer-events-none mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(244, 221, 184, 0.9) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Milestone Particle Shadow Word */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                  <span
                    key={`word-${activeMilestone.id}`}
                    className="font-stencil text-[44px] sm:text-[56px] md:text-[68px] font-black uppercase text-[#1a1714] tracking-wider leading-none drop-shadow-[0_2px_8px_rgba(244,221,184,0.4)] select-none transition-all duration-500 animate-in fade-in"
                  >
                    {getMilestoneSpotlightWord(activeMilestone)}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[3px] text-[#42392f] mt-1 font-bold">
                    {activeMilestone.year}
                  </span>
                </div>
              </div>

              {/* Beneath Spotlight: Retro Desk, CRT Terminal & BIT Companion */}
              <div className="w-full max-w-[420px] flex items-end justify-between mt-3 px-2">
                
                {/* CRT Terminal */}
                <div className="w-[120px] p-2 bg-[#101010] border border-[#232220] rounded-sm font-mono text-[9px] text-[#4af626] leading-snug select-none hidden sm:block">
                  <div className="text-[#888] text-[8px] mb-1">TERMINAL // PATH</div>
                  <div className="truncate">&gt; {isEducation ? "TYPE: EDUCATION" : "TYPE: EXPERIENCE"}</div>
                  <div className="truncate">&gt; VERIFIED: CJC</div>
                </div>

                {/* Robot Companion BIT */}
                <div className="relative flex flex-col items-center">
                  <div className="relative w-12 h-9 bg-[#1a1917] border border-[#333] rounded-t-md flex items-center justify-center gap-2 shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-[#52ff40] shadow-[0_0_8px_#52ff40] animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-[#52ff40] shadow-[0_0_8px_#52ff40] animate-pulse" />
                  </div>
                  <div className="w-14 h-2 bg-[#121110] border-t border-[#262523]" />
                  <div className="text-[9px] font-mono text-[#d36b54] tracking-widest uppercase font-bold mt-1">
                    BIT v2.4
                  </div>
                </div>

                {/* Indie Game Retro Console */}
                <div className="w-[120px] p-2 bg-[#101010] border border-[#232220] rounded-sm font-mono text-[9px] text-[#888] leading-snug select-none text-right hidden sm:block">
                  <div className="text-[8px] mb-1">STATUS // SYNC</div>
                  <div className="text-[#f4ddb8]">ACTIVE RECORD</div>
                  <div className="text-[#666]">{activeMilestone.year}</div>
                </div>

              </div>

            </div>

            {/* ── RIGHT COLUMN: DUAL-CATEGORY DIRECTORY (EDUCATION + WORK EXPERIENCE) ── */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-between h-full py-2 pl-2 lg:pl-6 border-l border-[#1f1e1c]/80 hidden md:flex">
              
              {/* Header */}
              <div>
                <span className="block text-[11px] font-mono tracking-[3px] uppercase text-[#888] mb-4">
                  Trajectory
                </span>

                {/* Chronological Trajectory Directory */}
                <div className="relative flex flex-col gap-5 pl-2">
                  {/* Vertical Connector Line */}
                  <div className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-[#232220]" />

                  {/* ── SECTION A: EDUCATION ── */}
                  <div className="text-[9px] font-mono uppercase tracking-[2px] text-[#d36b54] font-bold pl-5">
                    • Education
                  </div>

                  {eduItems.map((m, eduIdx) => {
                    const globalIdx = eduIdx;
                    const isActive = globalIdx === activeMilestoneIndex;
                    const displayYear = m.year ? (m.year.includes("—") ? m.year.split("—")[0].trim() : m.year.includes("-") ? m.year.split("-")[0].trim() : m.year) : "";
                    const shortName = m.title.replace(/SPECIALIST|FOUNDATIONAL/i, "").trim();

                    return (
                      <button
                        key={m.id || eduIdx}
                        type="button"
                        onClick={() => goToMilestone(globalIdx)}
                        className={`group flex items-start gap-3 text-left transition-colors cursor-pointer relative z-10 ${
                          isActive ? "opacity-100" : "opacity-45 hover:opacity-80"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-[1px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-[#d36b54] shadow-[0_0_8px_#d36b54]"
                              : "border border-[#444] bg-[#0c0c0c] group-hover:border-[#777]"
                          }`}
                        >
                          {isActive && <div className="w-1.5 h-1.5 bg-[#070707] rounded-[1px]" />}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className={`font-stencil text-[20px] sm:text-[22px] font-black leading-none transition-colors ${
                              isActive ? "text-[#e7e5df]" : "text-[#777] group-hover:text-[#aaa]"
                            }`}
                          >
                            {displayYear}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#888] line-clamp-1 mt-0.5">
                            {shortName}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* ── SECTION B: WORK EXPERIENCE ── */}
                  <div className="text-[9px] font-mono uppercase tracking-[2px] text-[#f4ddb8] font-bold pl-5 pt-2 border-t border-[#1a1917]">
                    • Work Experience
                  </div>

                  {expItems.map((m, expIdx) => {
                    const globalIdx = eduItems.length + expIdx;
                    const isActive = globalIdx === activeMilestoneIndex;
                    const displayYear = m.year ? (m.year.includes("—") ? m.year.split("—")[0].trim() : m.year.includes("-") ? m.year.split("-")[0].trim() : m.year) : "";
                    const shortName = m.title;

                    return (
                      <button
                        key={m.id || expIdx}
                        type="button"
                        onClick={() => goToMilestone(globalIdx)}
                        className={`group flex items-start gap-3 text-left transition-colors cursor-pointer relative z-10 ${
                          isActive ? "opacity-100" : "opacity-45 hover:opacity-80"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-[1px] mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-[#d36b54] shadow-[0_0_8px_#d36b54]"
                              : "border border-[#444] bg-[#0c0c0c] group-hover:border-[#777]"
                          }`}
                        >
                          {isActive && <div className="w-1.5 h-1.5 bg-[#070707] rounded-[1px]" />}
                        </div>

                        <div className="flex flex-col">
                          <span
                            className={`font-stencil text-[20px] sm:text-[22px] font-black leading-none transition-colors ${
                              isActive ? "text-[#e7e5df]" : "text-[#777] group-hover:text-[#aaa]"
                            }`}
                          >
                            {displayYear}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#888] line-clamp-1 mt-0.5">
                            {shortName}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Status Tag */}
              <div className="pt-4 border-t border-[#1f1e1c] font-mono text-[10px] text-[#666] flex flex-col gap-1 select-none">
                <div className="flex items-center justify-between text-[#888]">
                  <span>RECORD</span>
                  <span className="text-[#f4ddb8]">
                    {isEducation ? "ACADEMIC" : "EXPERIENCE"}
                  </span>
                </div>
                <div className="text-[9px] tracking-wider text-[#555]">
                  x -0.03 y 1.56 2700K
                </div>
              </div>

            </div>

          </div>

          {/* ── BOTTOM PROGRESS BAR & CUE ── */}
          <div className="relative z-10 w-full max-w-[1550px] mx-auto pt-3">
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#666] uppercase tracking-[2px] mb-2">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                {isEducation ? "Education Sequence" : "Experience Sequence"}
              </span>
              <span className="hidden sm:inline-block">
                [↑ / ↓] Scroll or Arrow Keys to Traverse Milestones
              </span>
              <span>
                {Math.round(((activeMilestoneIndex + 1) / totalMilestones) * 100)}% Trajectory
              </span>
            </div>

            {/* GSAP Progress Line */}
            <div className="w-full h-[2px] bg-[#1a1918] relative overflow-hidden rounded-full">
              <div
                className="absolute top-0 left-0 bottom-0 bg-[#d36b54] transition-all duration-150 ease-out"
                style={{
                  width: `${Math.max(4, Math.round(timelineProgress * 100))}%`,
                }}
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
