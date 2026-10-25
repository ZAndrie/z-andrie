"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ResumeCategory = "skills" | "education" | "experience";

export type ResumeItem = {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  percentage: string;
  category?: string;
};

// Curated architectural skills data to ensure a balanced, full-featured showcase
const enrichedSkills: ResumeItem[] = [
  {
    id: "sk-1",
    category: "skills",
    title: "UI/UX Design & Prototyping",
    subtitle: "Figma, High-Fidelity Wireframes, User Flows & Design Systems",
    year: "Specialized",
    percentage: "100%",
  },
  {
    id: "sk-2",
    category: "skills",
    title: "Quality Assurance & System Auditing",
    subtitle: "Test Case Design, Usability Verification & Regression QA",
    year: "Proficient",
    percentage: "95%",
  },
  {
    id: "sk-3",
    category: "skills",
    title: "React 19 & Next.js 16 (App Router)",
    subtitle: "Server Components, Client Hooks, Multi-Page Routing & SSR",
    year: "Current Focus",
    percentage: "95%",
  },
  {
    id: "sk-4",
    category: "skills",
    title: "Tailwind CSS v4 & GSAP Motion",
    subtitle: "ScrollTrigger Pinning, 60fps Choreography & Micro-Interactions",
    year: "Core Stack",
    percentage: "90%",
  },
  {
    id: "sk-5",
    category: "skills",
    title: "PHP & Laravel Web Framework",
    subtitle: "MVC Architecture, Blade Templates, Migrations & REST APIs",
    year: "Backend",
    percentage: "85%",
  },
  {
    id: "sk-6",
    category: "skills",
    title: "Cybersecurity & Cisco Defense",
    subtitle: "Endpoint Security, Network Protection & Device Configuration",
    year: "Certified",
    percentage: "90%",
  },
];

export default function Expertise({ initialItems = [] }: { initialItems?: ResumeItem[] }) {
  const [activeTab, setActiveTab] = useState<ResumeCategory>("skills");

  // Fallback to enriched items if GitHub list is sparse
  const dbEducation = initialItems?.filter((i) => i.category === "education") || [];
  const dbSkills = initialItems?.filter((i) => i.category === "skills") || [];
  const dbExperience = initialItems?.filter((i) => i.category === "experience") || [];

  const displaySkills = dbSkills.length >= 4 ? dbSkills : enrichedSkills;

  const resumeData: Record<ResumeCategory, ResumeItem[]> = {
    skills: displaySkills,
    education: dbEducation.length > 0 ? dbEducation : [
      {
        id: "ed-1",
        category: "education",
        title: "BS Information Technology",
        subtitle: "Cor Jesu College • Specializing in Software & Full-Stack Systems",
        year: "2023 — 2027",
        percentage: "100%",
      },
      {
        id: "ed-2",
        category: "education",
        title: "Senior High School (TVL / ICT)",
        subtitle: "Cor Jesu College • Information and Communications Technology",
        year: "2021 — 2023",
        percentage: "100%",
      },
      {
        id: "ed-3",
        category: "education",
        title: "Junior High School",
        subtitle: "Digos City National High School",
        year: "2017 — 2021",
        percentage: "100%",
      },
    ],
    experience: dbExperience.length > 0 ? dbExperience : [
      {
        id: "ex-1",
        category: "experience",
        title: "Student Assistant",
        subtitle: "Cor Jesu College • IT Facilities, Lab Support & Digital Inventory Management",
        year: "2023 — 2027",
        percentage: "100%",
      },
    ],
  };

  const tabs: { label: string; value: ResumeCategory; tag: string }[] = [
    { label: "Skills & Stack", value: "skills", tag: "TECH CORE" },
    { label: "Education & Training", value: "education", tag: "ACADEMIC" },
    { label: "Experience", value: "experience", tag: "APPOINTMENTS" },
  ];

  const pillars = [
    {
      code: "01",
      title: "User-Centered Interaction",
      desc: "Creating purposeful digital spaces with seamless navigation and empathy for user workflows.",
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
      desc: "Scalable Next.js and React components built on clean design patterns and strict type safety.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      code: "03",
      title: "Mobile-First & Adaptive",
      desc: "Responsive fluid grids designed to preserve clarity and functionality across every screen.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      code: "04",
      title: "Performance & GSAP Motion",
      desc: "Smooth 60fps timeline animations, SEO optimization, and hardware-accelerated interactions.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="expertise"
      className="py-[90px] md:py-[120px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-[50px] md:mb-[70px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <p className="text-[11px] uppercase tracking-[3px] font-mono text-[var(--color-primary)] font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
              CAPABILITIES &amp; TRAJECTORY
            </p>
            <h2 className="text-[36px] sm:text-[46px] md:text-[56px] font-serif uppercase text-[var(--color-text-dark)] leading-[1.05]">
              Skills &amp; <span className="text-[var(--color-primary)] italic">Expertise</span>
            </h2>
          </div>

          <p className="text-[13px] md:text-[14px] text-[var(--color-text-light)] max-w-[460px] leading-relaxed">
            A comprehensive breakdown of engineering disciplines, practical competencies, and academic milestones shaping my development journey.
          </p>
        </motion.div>

        {/* Main Content Grid: 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN (7 cols): Interactive Tabbed Trajectory ── */}
          <motion.div
            className="lg:col-span-7 flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Architectural Tab Switcher */}
            <div className="flex gap-2 sm:gap-3 p-1.5 bg-white/70 backdrop-blur-sm border border-[var(--color-border)] rounded-sm">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex-1 py-3 px-3 sm:px-4 rounded-sm text-[11px] uppercase font-mono tracking-[1.5px] font-bold transition-all duration-300 relative text-center
                      ${isActive
                        ? "text-white bg-[var(--color-text-dark)] shadow-md"
                        : "text-[var(--color-text-light)] hover:text-[var(--color-text-dark)] hover:bg-white/50"
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className="min-h-[420px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-3.5"
                >
                  {/* Category Header Label */}
                  <div className="flex justify-between items-center pb-2 border-b border-[var(--color-border)] text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-text-light)]">
                    <span>RECORD / COMPETENCY</span>
                    <span>STATUS</span>
                  </div>

                  {resumeData[activeTab].map((item, index) => (
                    <div
                      key={item.id || index}
                      className="group bg-white/80 hover:bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 p-4 sm:p-5 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 relative"
                    >
                      {/* Corner Accents on Hover */}
                      <span className="absolute -top-1 -left-1 text-[11px] font-mono text-[var(--color-primary)] font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                      <span className="absolute -top-1 -right-1 text-[11px] font-mono text-[var(--color-primary)] font-bold opacity-0 group-hover:opacity-100 transition-opacity">+</span>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-serif font-bold text-[var(--color-primary)] tabular-nums">
                            {String(index + 1).padStart(2, "0")}.
                          </span>
                          <h3 className="text-[13px] sm:text-[14px] font-bold text-[var(--color-text-dark)] uppercase tracking-[0.8px] group-hover:text-[var(--color-primary)] transition-colors">
                            {item.title}
                          </h3>
                        </div>

                        {item.year && (
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[var(--color-light-bg)] border border-[var(--color-border)] text-[var(--color-primary)] self-start sm:self-auto">
                            {item.year}
                          </span>
                        )}
                      </div>

                      {item.subtitle && (
                        <p className="text-[12px] text-[var(--color-text-light)] leading-relaxed pl-5">
                          {item.subtitle}
                        </p>
                      )}

                      {/* Subtle architectural bottom progress accent */}
                      <div className="w-full h-[1.5px] bg-[var(--color-border)]/50 mt-3 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                          className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[var(--color-primary)]/40 to-[var(--color-primary)]"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN (5 cols): Engineering Pillars & Studio Quote ── */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {/* Top Eyebrow */}
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)] text-[10px] font-mono uppercase tracking-[2px] text-[var(--color-text-light)]">
              <span>CORE ARCHITECTURAL PILLARS</span>
              <span>[ 04 ]</span>
            </div>

            {/* 4 Architectural Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {pillars.map((pillar) => (
                <div
                  key={pillar.code}
                  className="group bg-white/70 hover:bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] p-4 sm:p-5 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-sm bg-[var(--color-light-bg)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                    {pillar.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-[var(--color-primary)] font-bold">
                        [{pillar.code}]
                      </span>
                      <h4 className="text-[12px] font-bold text-[var(--color-text-dark)] uppercase tracking-[0.8px]">
                        {pillar.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-light)] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Studio Philosophy Quotation Card with Dashed Offset Frame */}
            <div className="relative mt-2 p-6 sm:p-7 bg-white/95 border border-[var(--color-border)] rounded-sm shadow-sm overflow-hidden group">
              {/* Corner crosshairs */}
              <span className="absolute -top-1 -left-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>
              <span className="absolute -top-1 -right-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>
              <span className="absolute -bottom-1 -left-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>
              <span className="absolute -bottom-1 -right-1 text-[12px] font-mono text-[var(--color-primary)] font-bold">+</span>

              <div className="text-[50px] font-serif text-[var(--color-primary)] opacity-25 leading-none h-[30px] select-none">
                “
              </div>
              <p className="text-[15px] sm:text-[16px] font-serif italic text-[var(--color-text-dark)] leading-[1.7] relative z-10 mb-4">
                I design and build digital experiences that are not only beautiful but also functional, intuitive, and impactful.
              </p>
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono uppercase tracking-[1.5px] text-[var(--color-text-light)]">
                <span>PHILOSOPHY</span>
                <span className="text-[var(--color-primary)] font-semibold">Z ANDRIE BARRABA</span>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
