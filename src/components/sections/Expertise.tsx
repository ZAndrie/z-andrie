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
  if (m.spotlightWord) return m.spotlightWord;
  const t = (m.title || "").toLowerCase();
  if (t.includes("bs") || t.includes("information technology") || t.includes("bachelor")) return "BSIT";
  if (t.includes("senior high") || t.includes("shs") || t.includes("tvl") || t.includes("ict")) return "SHS";
  if (t.includes("junior high") || t.includes("jhs") || t.includes("high school")) return "JHS";
  if (t.includes("student assistant") || t.includes("assistant") || t.includes("cor jesu")) return "IT LAB";
  if (t.includes("engineer") || t.includes("developer")) return "DEV";
  const words = (m.title || "").trim().split(/\s+/);
  return words.length > 0 ? words[0].toUpperCase() : "CJC";
}

const DEFAULT_EXPERTISE_ITEMS: ResumeItem[] = [
  {
    id: "exp-1",
    category: "skills",
    title: "UI/UX Design & Prototyping",
    subtitle: "Figma, User Flows, Design Systems & High-Fidelity Wireframes",
    year: "Specialized",
    order: 1,
    discipline: "Design Systems",
    desc: "Translating complex requirements into intuitive user journeys, interactive Figma prototypes, and modular component systems.",
    tags: ["Figma", "Design Systems", "Prototyping", "User Flows"],
  },
  {
    id: "exp-2",
    category: "skills",
    title: "Quality Assurance & Systems Testing",
    subtitle: "Manual Testing, Test Matrix Development, Bug Lifecycle Tracking",
    year: "Specialized",
    order: 2,
    discipline: "Verification",
    desc: "Executing rigorous functional, responsive, and performance verification to ensure defect-free deployments.",
    tags: ["QA Testing", "Test Matrices", "Bug Tracking", "Cross-Browser"],
  },
  {
    id: "exp-3",
    category: "skills",
    title: "React & Next.js Full-Stack Architecture",
    subtitle: "Next.js App Router, React 19, TypeScript, Server Components",
    year: "Specialized",
    order: 3,
    discipline: "Full-Stack Web",
    desc: "Building high-performance SSR and dynamic web applications with React 19, TypeScript, and modern state workflows.",
    tags: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "exp-4",
    category: "skills",
    title: "Tailwind CSS & Spatial Interfaces",
    subtitle: "Responsive Layouts, Micro-Interactions, Three.js & GLSL",
    year: "Specialized",
    order: 4,
    discipline: "Interactive UI",
    desc: "Composing clean modern interfaces, custom utility animations, and immersive WebGL 3D canvas environments.",
    tags: ["Tailwind", "GSAP", "Three.js", "Spatial UI"],
  },
  {
    id: "exp-7",
    category: "education",
    title: "BS Information Technology",
    subtitle: "Cor Jesu College • Specializing in Software & Full-Stack Systems",
    year: "2023 — 2027",
    order: 7,
    roleType: "Degree Program",
    bullets: [
      "Software engineering foundations, full-stack development, and database architecture.",
      "Hands-on coursework in systems integration, modern JavaScript frameworks, and enterprise software design.",
    ],
    spotlightWord: "BSIT",
  },
  {
    id: "exp-8",
    category: "education",
    title: "Senior High School (TVL / ICT)",
    subtitle: "Cor Jesu College • Information and Communications Technology",
    year: "2021 — 2023",
    order: 8,
    roleType: "Academic Track",
    bullets: [
      "Completed Technical-Vocational-Livelihood track in ICT with focus on computer programming.",
      "Graduated with honors and foundational knowledge in web technologies and systems servicing.",
    ],
    spotlightWord: "SHS",
  },
  {
    id: "exp-9",
    category: "education",
    title: "Junior High School",
    subtitle: "Digos City National High School",
    year: "2017 — 2021",
    order: 9,
    roleType: "Secondary Education",
    bullets: [
      "Completed junior secondary education with active participation in computer science electives.",
    ],
    spotlightWord: "JHS",
  },
  {
    id: "exp-10",
    category: "experience",
    title: "Student Assistant",
    subtitle: "Cor Jesu College • IT Facilities, Lab Support & Digital Inventory",
    year: "2023 — 2027",
    order: 10,
    roleType: "Work Appointment",
    bullets: [
      "Maintained laboratory computing facilities, workstation networks, and software licenses for student labs.",
      "Tracked hardware inventory, diagnosed system anomalies, and assisted students with technical tooling.",
    ],
    spotlightWord: "IT LAB",
  },
];

export default function Expertise({ initialItems = [] }: { initialItems?: ResumeItem[] }) {
  const allItems = initialItems && initialItems.length > 0 ? initialItems : DEFAULT_EXPERTISE_ITEMS;

  const skillItems = allItems.filter((i) => !i.category || i.category === "skills");
  const eduItems = allItems.filter((i) => i.category === "education");
  const expItems = allItems.filter((i) => i.category === "experience");

  const orderedMilestones = [...eduItems, ...expItems];
  const totalMilestones = Math.max(1, orderedMilestones.length);

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  const skillsContainerRef = useRef<HTMLElement>(null);
  const pathContainerRef = useRef<HTMLElement>(null);
  const pathStageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const activeMilestoneIndexRef = useRef(0);

  const activeMilestone = orderedMilestones[activeMilestoneIndex] || orderedMilestones[0];
  const isEducation = activeMilestone?.category === "education";

  const scrollDistance = Math.max(1, totalMilestones - 1) * 520;

  const goToMilestone = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalMilestones - 1, index));
      activeMilestoneIndexRef.current = clamped;
      setActiveMilestoneIndex(clamped);

      const trig = triggerRef.current;
      if (trig) {
        const start = trig.start;
        const end = trig.end;
        const targetProgress = clamped / Math.max(1, totalMilestones - 1);
        const targetScroll = start + targetProgress * (end - start);
        scrollToTarget(targetScroll, { duration: 0.7 });
      }
    },
    [totalMilestones]
  );

  useGSAP(
    () => {
      const container = pathContainerRef.current;
      if (!container) return;

      const trig = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (timelineProgressRef.current) {
            timelineProgressRef.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
          }
          const idx = Math.min(totalMilestones - 1, Math.floor(p * totalMilestones));
          if (idx !== activeMilestoneIndexRef.current) {
            activeMilestoneIndexRef.current = idx;
            setActiveMilestoneIndex(idx);
          }
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

  useEffect(() => {
    activeMilestoneIndexRef.current = activeMilestoneIndex;
  }, [activeMilestoneIndex]);

  const displayPillars = skillItems.map((item, idx) => ({
    code: `0${idx + 1}`,
    discipline: item.discipline || "Discipline Core",
    title: item.title,
    desc: item.desc || item.subtitle || "",
    tags: getSkillTags(item.title, item.subtitle, item.tags),
    icon: getSkillIcon(item.title),
  }));

  const dynamicTechMatrix = Array.from(
    new Set([
      "React 19",
      "Next.js App Router",
      "TypeScript",
      "Tailwind CSS",
      "Three.js / WebGL",
      "GSAP Timelines",
      "Node.js & Express",
      "PHP & Laravel",
      "PostgreSQL",
      "REST & GraphQL",
      "Figma",
      "Git & GitHub",
    ])
  );

  const milestoneBullets: string[] =
    (activeMilestone as any).achievements && (activeMilestone as any).achievements.length > 0
      ? (activeMilestone as any).achievements
      : activeMilestone.bullets && activeMilestone.bullets.length > 0
      ? activeMilestone.bullets
      : activeMilestone.desc
      ? activeMilestone.desc.includes("\n")
        ? activeMilestone.desc.split("\n").map((s) => s.trim()).filter(Boolean)
        : [activeMilestone.desc]
      : [];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          ORDER 1: CORE ARCHITECTURAL PILLARS (SKILLS & TECHNICAL DISCIPLINES)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="skills"
        ref={skillsContainerRef}
        className="py-20 md:py-28 px-6 md:px-12 bg-[#070709]/90 text-[#e7e5df] border-t border-white/[0.08] relative z-10 select-none"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                <span>03 / Skills &amp; Stack</span>
              </div>
              <h2 className="text-[34px] sm:text-[44px] md:text-[52px] font-heading font-bold uppercase text-[#ffffff] leading-none tracking-tight">
                Architectural <span className="text-[#d36b54]">Stack</span>
              </h2>
            </div>
            <p className="text-[13px] font-sans text-[#9ca3af] max-w-[420px] leading-relaxed">
              Synchronized live from GitHub portfolio repository. Technical specializations, design systems, and verified software paradigms.
            </p>
          </div>

          {/* Dynamic Architectural Discipline Cards from GitHub */}
          <div
            className={`grid grid-cols-1 ${
              displayPillars.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
            } gap-6 mb-10`}
          >
            {displayPillars.map((pillar) => (
              <div
                key={pillar.code}
                className="group p-7 rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono text-[#d36b54] font-semibold tracking-wider">
                      DISCIPLINE // {pillar.code}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#f4ddb8] group-hover:text-[#d36b54] group-hover:bg-[#d36b54]/10 transition-colors">
                      {pillar.icon}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#9ca3af] block mb-1">
                    {pillar.discipline}
                  </span>
                  <h3 className="text-[20px] sm:text-[22px] font-heading font-bold uppercase text-[#ffffff] tracking-tight mb-3">
                    {pillar.title}
                  </h3>
                  {pillar.desc && (
                    <p className="text-[14px] text-[#9ca3af] leading-relaxed font-sans font-light">
                      {pillar.desc}
                    </p>
                  )}
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 pt-5 mt-6 border-t border-white/[0.06]">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[#e7e5df] group-hover:border-white/[0.15] transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Technology Matrix */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#9ca3af] block mb-1">
                TECHNOLOGY MATRIX
              </span>
              <h4 className="text-[15px] font-heading font-semibold text-[#ffffff] uppercase tracking-wider">
                Active Production &amp; Development Tools
              </h4>
            </div>

            <div className="flex flex-wrap gap-2 sm:max-w-[700px]">
              {dynamicTechMatrix.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-[11px] font-mono text-[#e7e5df] rounded-full transition-colors cursor-default"
                >
                  #{tech.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ORDER 2: CAREER & ACADEMIC TRAJECTORY
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="expertise"
        ref={pathContainerRef}
        style={{
          height: `calc(100vh + ${scrollDistance}px)`,
        }}
        className="relative w-full bg-transparent text-[#e7e5df] border-t border-white/[0.08] select-none"
      >
        {/* ── STICKY SHOWCASE VIEWPORT ── */}
        <div
          ref={pathStageRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[85px] md:pt-[95px] pb-6 px-6 md:px-12 bg-[#070707]/80 z-20 will-change-transform"
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 30%, rgba(244, 221, 184, 0.08) 0%, rgba(7, 7, 7, 0.98) 75%)`,
            }}
          />

          {/* ── TOP SECTION HEADER HUD ── */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto">
            <div className="flex justify-between items-end pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[2px] uppercase text-[#a8a59d]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                  <span>04 / Trajectory Timeline</span>
                </span>
                <span className="text-white/[0.2] hidden sm:inline-block">/</span>
                <span className="text-[12px] font-mono text-[#9ca3af] hidden sm:inline-block">
                  Academic Milestones &amp; Work Appointments
                </span>
              </div>

              <div className="font-mono text-[11px] text-[#9ca3af] flex items-center gap-4">
                <span>
                  RECORD <strong className="text-white">{String(activeMilestoneIndex + 1).padStart(2, "0")}</strong> / {String(totalMilestones).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* ── MAIN 3-COLUMN SHOWCASE ── */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-0 py-4">
            
            {/* ── LEFT COLUMN: ROLE, CREDENTIALS & ACCOMPLISHMENTS ── */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between h-full py-2">
              
              {/* Top: Section Eyebrow & Navigation Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-[#d36b54] font-semibold">
                    {isEducation ? "Academic Program" : "Work Appointment"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#f4ddb8] text-[10px] font-mono font-medium">
                    {activeMilestone.year}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => goToMilestone(activeMilestoneIndex - 1)}
                    disabled={activeMilestoneIndex === 0}
                    aria-label="Previous milestone"
                    className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-[#d36b54] hover:border-[#d36b54] text-white disabled:opacity-25 transition-all flex items-center justify-center text-xs font-mono cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => goToMilestone(activeMilestoneIndex + 1)}
                    disabled={activeMilestoneIndex === totalMilestones - 1}
                    aria-label="Next milestone"
                    className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.03] hover:bg-[#d36b54] hover:border-[#d36b54] text-white disabled:opacity-25 transition-all flex items-center justify-center text-xs font-mono cursor-pointer"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Middle: Title, Subtitle, Bullets */}
              <div className="my-auto py-4">
                <h2
                  key={`title-${activeMilestone.id}`}
                  className="font-heading text-[32px] sm:text-[44px] md:text-[50px] font-bold text-[#ffffff] leading-[1.04] tracking-tight transition-opacity duration-300"
                >
                  {activeMilestone.title}
                </h2>

                <div className="text-[12px] font-mono uppercase tracking-[2px] text-[#d36b54] font-medium mt-2">
                  {activeMilestone.roleType || (isEducation ? "ACADEMIC DEGREE" : "WORK EXPERIENCE")}
                </div>

                {activeMilestone.subtitle && (
                  <div className="text-[14px] font-sans text-[#d1d5db] mt-2 mb-4">
                    {activeMilestone.subtitle}
                  </div>
                )}

                {/* Tenure Credentials & Key Achievements */}
                {milestoneBullets.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[2px] text-[#f4ddb8] mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                      <span>Tenure Credentials &amp; Achievements</span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {milestoneBullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-colors"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#d36b54]/15 border border-[#d36b54]/30 flex items-center justify-center text-[9px] text-[#d36b54] shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="text-[12px] sm:text-[13px] text-[#e7e5df] font-sans leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom: Milestone ID Tag */}
              <div className="pt-2 text-[11px] font-mono uppercase tracking-[2px] text-[#666]">
                <span>
                  {isEducation ? "EDUCATION RECORD" : "EXPERIENCE APPOINTMENT"} • {String(activeMilestoneIndex + 1).padStart(2, "0")} / {String(totalMilestones).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* ── CENTER COLUMN: MODERN SPOTLIGHT DISK ── */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col items-center justify-center relative h-full py-2">
              <div className="relative w-[240px] sm:w-[280px] aspect-square rounded-3xl flex items-center justify-center overflow-hidden bg-[#0c0c0f]/80 backdrop-blur-xl border border-white/[0.1] shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
                {/* Subtle Amber Glow Pool */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(244,221,184,0.3) 0%, rgba(211,107,84,0.1) 50%, transparent 80%)",
                  }}
                />

                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                  <span
                    key={`word-${activeMilestone.id}`}
                    className="font-heading text-[48px] sm:text-[58px] font-bold uppercase text-[#ffffff] tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] select-none transition-all duration-500 animate-in fade-in"
                  >
                    {getMilestoneSpotlightWord(activeMilestone)}
                  </span>
                  <span className="text-[12px] font-mono tracking-[2px] text-[#d36b54] mt-2 font-semibold">
                    {activeMilestone.year}
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: DUAL-CATEGORY DIRECTORY ── */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between h-full py-2 pl-4 lg:pl-6 border-l border-white/[0.08] hidden md:flex">
              <div>
                <span className="block text-[11px] font-mono tracking-[2px] uppercase text-[#9ca3af] mb-4 font-semibold">
                  Trajectory Road
                </span>

                <div className="relative flex flex-col gap-4 pl-2">
                  <div className="absolute left-[7px] top-3 bottom-3 w-[1px] bg-white/[0.08]" />

                  {/* Education Label */}
                  <div className="text-[10px] font-mono uppercase tracking-[2px] text-[#d36b54] font-semibold pl-5">
                    • Education
                  </div>

                  {eduItems.map((m, eduIdx) => {
                    const globalIdx = eduIdx;
                    const isActive = globalIdx === activeMilestoneIndex;
                    const displayYear = m.year ? (m.year.includes("—") ? m.year.split("—")[0].trim() : m.year) : "";

                    return (
                      <button
                        key={m.id || eduIdx}
                        type="button"
                        onClick={() => goToMilestone(globalIdx)}
                        className={`group flex items-start gap-3 text-left transition-all cursor-pointer relative z-10 p-1.5 rounded-lg ${
                          isActive ? "bg-white/[0.06] text-white" : "opacity-50 hover:opacity-100 text-[#888]"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? "bg-[#d36b54] ring-2 ring-[#d36b54]/30" : "bg-[#222] border border-white/20"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="font-heading text-sm font-semibold text-white">
                            {displayYear}
                          </span>
                          <span className="text-[11px] font-mono text-[#9ca3af] truncate max-w-[150px]">
                            {m.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Work Experience Label */}
                  <div className="text-[10px] font-mono uppercase tracking-[2px] text-[#f4ddb8] font-semibold pl-5 pt-2 border-t border-white/[0.06]">
                    • Work Experience
                  </div>

                  {expItems.map((m, expIdx) => {
                    const globalIdx = eduItems.length + expIdx;
                    const isActive = globalIdx === activeMilestoneIndex;
                    const displayYear = m.year ? (m.year.includes("—") ? m.year.split("—")[0].trim() : m.year) : "";

                    return (
                      <button
                        key={m.id || expIdx}
                        type="button"
                        onClick={() => goToMilestone(globalIdx)}
                        className={`group flex items-start gap-3 text-left transition-all cursor-pointer relative z-10 p-1.5 rounded-lg ${
                          isActive ? "bg-white/[0.06] text-white" : "opacity-50 hover:opacity-100 text-[#888]"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full mt-1 flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? "bg-[#d36b54] ring-2 ring-[#d36b54]/30" : "bg-[#222] border border-white/20"
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="font-heading text-sm font-semibold text-white">
                            {displayYear}
                          </span>
                          <span className="text-[11px] font-mono text-[#9ca3af] truncate max-w-[150px]">
                            {m.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Status */}
              <div className="pt-4 border-t border-white/[0.08] font-mono text-[10px] text-[#666] flex flex-col gap-1 select-none">
                <div className="flex items-center justify-between text-[#888]">
                  <span>CATEGORY</span>
                  <span className="text-[#f4ddb8] font-semibold">
                    {isEducation ? "ACADEMIC" : "EXPERIENCE"}
                  </span>
                </div>
                <div className="text-[10px] tracking-wider text-[#9ca3af]">
                  SCROLL TO TRAVERSE TIMELINE
                </div>
              </div>

            </div>

          </div>

          {/* ── BOTTOM PROGRESS LINE ── */}
          <div className="relative z-10 w-full max-w-[1400px] mx-auto pt-3">
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#888] uppercase tracking-[2px] mb-2">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d36b54]" />
                {isEducation ? "Education Trajectory" : "Experience Trajectory"}
              </span>
              <span className="hidden sm:inline-block">
                Scroll or Arrow Keys to Advance
              </span>
              <span>
                {Math.round(((activeMilestoneIndex + 1) / totalMilestones) * 100)}% Milestone
              </span>
            </div>

            {/* GSAP Progress Line (GPU accelerated scaleX) */}
            <div className="w-full h-[2px] bg-white/[0.08] relative overflow-hidden rounded-full">
              <div
                ref={timelineProgressRef}
                className="h-full w-full bg-gradient-to-r from-[#d36b54] to-[#f4ddb8] will-change-transform origin-left rounded-full"
                style={{
                  transform: "scaleX(0.04)",
                }}
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
