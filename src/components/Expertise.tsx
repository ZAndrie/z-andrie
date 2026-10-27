"use client";

import { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { scrollToTarget } from "@/lib/smoothScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ResumeItem = {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  category?: "skills" | "education" | "experience" | string;
  institution?: string;
  roleType?: string;
  bullets?: string[];
  spotlightWord?: string;
};

// ── 1. CORE ARCHITECTURAL PILLARS (SKILLS SECTION) ──
const ARCHITECTURAL_PILLARS = [
  {
    code: "01",
    title: "User-Centered Interaction",
    discipline: "UI/UX DESIGN & PROTOTYPING",
    desc: "Crafting purposeful digital spaces in Figma with seamless navigation, accessibility, and high-fidelity user flows.",
    tags: ["Figma", "Design Systems", "Wireframing", "User Flows"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    code: "02",
    title: "Clean Code Architecture",
    discipline: "REACT 19 & NEXT.js 16 (APP ROUTER)",
    desc: "Scalable server components, strict TypeScript typing, Turbopack bundling, and robust component hierarchies.",
    tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    code: "03",
    title: "Modern Full-Stack",
    discipline: "PHP & LARAVEL WEB FRAMEWORK",
    desc: "MVC architecture, Blade templates, relational MySQL databases, and secure RESTful API endpoints.",
    tags: ["PHP", "Laravel", "Blade", "MySQL", "REST APIs"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7" />
        <path d="M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4" />
        <path d="M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  {
    code: "04",
    title: "Performance & Defense",
    discipline: "GSAP MOTION & CISCO CYBERSECURITY",
    desc: "60fps ScrollTrigger timeline scrubbing, WebGL particle physics, regression QA auditing, and Cisco security practices.",
    tags: ["GSAP ScrollTrigger", "Three.js", "QA Auditing", "Cisco Defense"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

// ── 2. EDUCATION MILESTONES (ACADEMIC TRAJECTORY) ──
const EDUCATION_MILESTONES: ResumeItem[] = [
  {
    id: "edu-1",
    category: "education",
    year: "2023 — 2027",
    title: "BS INFORMATION TECH",
    roleType: "SOFTWARE & WEB SYSTEMS SPECIALIZATION",
    institution: "at Cor Jesu College",
    subtitle: "Specializing in modern full-stack development, distributed architecture, and software design.",
    spotlightWord: "BSIT",
    bullets: [
      "Rigorous academic curriculum covering advanced database architecture, software engineering, algorithms, and cybersecurity fundamentals.",
      "Focusing on high-performance full-stack web engineering, Next.js server components, React 19, and interactive WebGL experiences.",
      "Maintaining consistent high-standing performance across specialized computer science and IT laboratory courses.",
      "Collaborating on full-lifecycle software prototypes solving campus-wide operational challenges.",
    ],
  },
  {
    id: "edu-2",
    category: "education",
    year: "2021 — 2023",
    title: "TVL / ICT SPECIALIST",
    roleType: "TECHNICAL-VOCATIONAL-LIVELIHOOD",
    institution: "at Cor Jesu College (SHS)",
    subtitle: "Information and Communications Technology specialization with foundational networking and systems training.",
    spotlightWord: "TVL ICT",
    bullets: [
      "Comprehensive foundational training in computer programming, database administration, and hardware servicing.",
      "Developed first-principles mastery of networking topologies, computer hardware assembly, and digital media design.",
      "Graduated with specialized competency in software troubleshooting and technical workplace preparation.",
    ],
  },
  {
    id: "edu-3",
    category: "education",
    year: "2017 — 2021",
    title: "FOUNDATIONAL EDUCATION",
    roleType: "SECONDARY EDUCATION & SCIENCE",
    institution: "at Digos City National High School",
    subtitle: "Early academic foundation fostering a passion for software development and computer technologies.",
    spotlightWord: "DCNHS",
    bullets: [
      "Built a strong mathematical, analytical, and logical foundation that seeded interest in computer science.",
      "Participated in technology and science exhibitions, exploring computer software fundamentals.",
    ],
  },
];

// ── 3. WORK EXPERIENCE MILESTONES (PROFESSIONAL APPOINTMENTS) ──
const EXPERIENCE_MILESTONES: ResumeItem[] = [
  {
    id: "exp-1",
    category: "experience",
    year: "2023 — Present",
    title: "STUDENT ASSISTANT",
    roleType: "IT FACILITIES & LAB OPERATIONS",
    institution: "at Cor Jesu College • IT Department",
    subtitle: "Hardware diagnostics, workstation maintenance, and digital laboratory management.",
    spotlightWord: "COR JESU",
    bullets: [
      "Facilitating campus computing operations, workstation deployment, and hardware diagnostics across college computer laboratories.",
      "Managing institutional digital inventory and hardware asset tracking for campus computing infrastructure.",
      "Engineered automated reservation web prototypes (Library Booking, Laptop Borrowing) with role-based auth and automated cataloging.",
      "Applied structured quality assurance testing, user feedback verification, and regression audits across academic systems.",
    ],
  },
  {
    id: "exp-2",
    category: "experience",
    year: "2023 — Present",
    title: "FULL-STACK DEVELOPER",
    roleType: "WEB APPLICATIONS & INTERACTIVE SYSTEMS",
    institution: "at Freelance / Academic Projects",
    subtitle: "Engineering production web applications and responsive full-stack solutions.",
    spotlightWord: "FULL STACK",
    bullets: [
      "Designed and deployed modern full-stack web applications, custom interactive portfolios, and production-ready system prototypes.",
      "Integrated high-performance GSAP ScrollTrigger timeline choreographies, responsive Tailwind CSS layouts, and Three.js scenes with React 19.",
      "Architected relational MySQL databases, Blade templates, and RESTful API endpoints using Laravel and PHP.",
    ],
  },
];

const COMPANION_MILESTONE_TIPS = [
  "BIT  BSIT degree track specializing in full-stack software architecture.",
  "BIT  technical-vocational ICT training in networking and system design.",
  "BIT  foundational science & mathematics milestones shaping early logic.",
  "BIT  student assistant post at CJC. active hardware support & systems QA.",
  "BIT  freelance full-stack projects combining React 19, Next.js & Laravel.",
];

export default function Expertise({ initialItems = [] }: { initialItems?: ResumeItem[] }) {
  // ── STRICT SEQUENTIAL ORDER: (1) SKILLS (above) -> (2) EDUCATION -> (3) WORK EXPERIENCE ──
  // Filter out any skills from the trajectory timeline (skills belong exclusively in the Skills section!)
  // And sanitize any percentage values so arbitrary percentages (like "70%") never appear.
  const customEdu = (initialItems || []).filter(
    (i) => i.category === "education" && !i.year?.includes("%")
  );
  const customExp = (initialItems || []).filter(
    (i) => i.category === "experience" && !i.year?.includes("%")
  );

  const eduItems = customEdu.length >= 2 ? customEdu : EDUCATION_MILESTONES;
  const expItems = customExp.length >= 1 ? customExp : EXPERIENCE_MILESTONES;

  // Strict order: Education first, then Work Experience
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

  const scrollDistance = Math.max(1, totalMilestones - 1) * 540;

  // Jump smoothly to a specific milestone
  const goToMilestone = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalMilestones - 1, index));
      setActiveMilestoneIndex(clamped);

      const trig = triggerRef.current;
      if (trig) {
        const start = trig.start;
        const end = trig.end;
        const targetProgress = clamped / Math.max(1, totalMilestones - 1);
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
        scrub: 0.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          setTimelineProgress(p);
          const idx = Math.min(totalMilestones - 1, Math.floor(p * totalMilestones));
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

  const companionTip =
    COMPANION_MILESTONE_TIPS[activeMilestoneIndex % COMPANION_MILESTONE_TIPS.length];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          ORDER 1: SKILLS & ARCHITECTURAL STACK SHOWCASE
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="skills"
        ref={skillsContainerRef}
        className="relative w-full pt-16 pb-12 px-6 md:px-12 bg-[#070707]/65 backdrop-blur-[1px] text-[#e7e5df] border-t border-[#232220]/50 select-none z-10"
      >
        <div className="max-w-[1500px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[3px] font-mono text-[#d36b54] font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d36b54] animate-pulse" />
                [ 01 // SKILLS &amp; TECHNICAL DISCIPLINES ]
              </p>
              <h2 className="text-[34px] sm:text-[44px] md:text-[54px] font-stencil uppercase text-[#e7e5df] leading-[0.98] tracking-tight">
                Skills &amp; <span className="text-[#f4ddb8]">Architectural Stack</span>
              </h2>
            </div>

            <p className="text-[13px] md:text-[14px] text-[#a8a59d] max-w-[500px] leading-relaxed font-sans">
              A comprehensive breakdown of engineering disciplines, practical competencies, and specialized technologies shaping my development workflow.
            </p>
          </div>

          {/* 4 Architectural Discipline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-8">
            {ARCHITECTURAL_PILLARS.map((pillar) => (
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
                  <p className="text-[13px] text-[#a8a59d] leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
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
              {[
                "Next.js 16",
                "React 19",
                "TypeScript",
                "GSAP 3",
                "Tailwind v4",
                "Three.js",
                "PHP",
                "Laravel",
                "MySQL",
                "Blade",
                "Figma",
                "Cisco Defense",
                "REST APIs",
                "Git & GitHub",
                "System Auditing",
              ].map((tech) => (
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
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[75px] md:pt-[90px] pb-5 px-6 md:px-12 bg-[#070707]/60 backdrop-blur-[1px] z-20"
        >
          {/* Subtle theatrical background atmosphere */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 35%, rgba(244, 221, 184, 0.08) 0%, rgba(7, 7, 7, 0.95) 75%)",
            }}
          />

          {/* ── MAIN 3-COLUMN THEATRICAL TRAJECTORY GRID ── */}
          <div className="relative z-10 w-full max-w-[1550px] mx-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center min-h-0">
            
            {/* ── LEFT COLUMN: ROLE, CREDENTIALS & ACCOMPLISHMENTS ── */}
            <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between h-full py-2 max-w-[620px]">
              {/* Top: Section Eyebrow (Education vs Work Experience) & Date */}
              <div>
                <span className="block text-[11px] font-mono tracking-[3px] uppercase text-[#888] mb-1">
                  {isEducation ? "Education & Academic Path" : "Work Experience & Appointment"}
                </span>
                <span className="text-[12px] font-mono text-[#f4ddb8] tracking-wider block font-bold">
                  {activeMilestone.year}
                </span>
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
                  {activeMilestone.roleType || (isEducation ? "ACADEMIC PROGRAM" : "PROFESSIONAL ROLE")}
                </div>

                <div className="text-[13px] md:text-[14px] font-sans text-[#e7e5df] italic mt-1 mb-5">
                  {activeMilestone.institution}
                </div>

                {/* Accomplishment Bullet Points */}
                <ul className="flex flex-col gap-2.5 text-[12px] sm:text-[13px] text-[#a8a59d] font-sans leading-relaxed pl-1">
                  {(activeMilestone.bullets && activeMilestone.bullets.length > 0
                    ? activeMilestone.bullets
                    : [
                        activeMilestone.subtitle ||
                          "Directly contributing to technical systems, software architecture, and practical operational engineering.",
                      ]
                  ).map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3">
                      <span className="text-[#d36b54] text-[14px] leading-none shrink-0 mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
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
                      "radial-gradient(circle at 50% 50%, rgba(244, 221, 184, 0.42) 0%, rgba(244, 221, 184, 0.18) 45%, rgba(244, 221, 184, 0.04) 70%, transparent 80%)",
                  }}
                />

                {/* Floating Volumetric Dust Motes Simulation */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(244, 221, 184, 0.9) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Milestone Particle Shadow Word (NO PERCENTAGES) */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                  <span
                    key={`word-${activeMilestone.id}`}
                    className="font-stencil text-[44px] sm:text-[56px] md:text-[68px] font-black uppercase text-[#1a1714] tracking-wider leading-none drop-shadow-[0_2px_8px_rgba(244,221,184,0.4)] select-none transition-all duration-500 animate-in fade-in"
                  >
                    {activeMilestone.spotlightWord || "COR JESU"}
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
                </div>

                {/* Dynamic Speech Bubble from BIT */}
                <div className="max-w-[210px] sm:max-w-[230px] p-2.5 bg-[#121110]/95 border border-[#2b2a28] rounded-sm font-mono text-[10px] text-[#e7e5df] leading-snug shadow-lg relative">
                  <div className="text-[9px] font-bold text-[#f4ddb8] tracking-wider mb-0.5">
                    BIT
                  </div>
                  <p className="line-clamp-2 text-[#a8a59d]">
                    {companionTip}
                  </p>
                  <div className="absolute -left-1.5 bottom-3 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-[#2b2a28]" />
                </div>

              </div>
            </div>

            {/* ── RIGHT COLUMN: VERTICAL TIMELINE ORDERED BY EDUCATION THEN WORK EXPERIENCE ── */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-between h-full py-2 pl-4 border-l border-[#1f1e1c]/80 hidden md:flex">
              
              <div className="overflow-y-auto max-h-[62vh] pr-1 scrollbar-none">
                <span className="block text-[11px] font-mono tracking-[3px] uppercase text-[#888] mb-4">
                  Timeline
                </span>

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
                    const displayYear = m.year.split("—")[0].trim();
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
                    const displayYear = m.year.split("—")[0].trim();
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

              {/* Bottom Telemetry HUD */}
              <div className="pt-3 border-t border-[#1f1e1c] font-mono text-[10px] text-[#666] flex flex-col gap-1 select-none">
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
                Scroll down to traverse milestones
              </span>
              <span>
                {Math.round(((activeMilestoneIndex + 1) / totalMilestones) * 100)}% History
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