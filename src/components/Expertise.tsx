"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ResumeCategory = "education" | "skills" | "experience";

type ResumeItem = {
  id: string;
  year: string;
  title: string;
  subtitle?: string;
  percentage: string;
  category?: string;
};

export default function Expertise({ initialItems = [] }: { initialItems?: any[] }) {
  const [activeTab, setActiveTab] = useState<ResumeCategory>("skills");

  const dbEducation = initialItems?.filter((i) => i.category === "education") || [];
  const dbSkills = initialItems?.filter((i) => i.category === "skills") || [];
  const dbExperience = initialItems?.filter((i) => i.category === "experience") || [];

  const resumeData: Record<ResumeCategory, ResumeItem[]> = {
    education: dbEducation,
    skills: dbSkills,
    experience: dbExperience,
  };

  const tabs: { label: string; value: ResumeCategory }[] = [
    { label: "Skills", value: "skills" },
    { label: "Education & Training", value: "education" },
    { label: "Experience", value: "experience" },
  ];

  const features = [
    {
      title: "USER-CENTERED DESIGN",
      description: "Focus on creating seamless and meaningful user experiences.",
      icon: "fas fa-desktop",
    },
    {
      title: "CLEAN & MODERN CODE",
      description: "High-quality, scalable, and performant development.",
      icon: "fas fa-code",
    },
    {
      title: "FULLY RESPONSIVE",
      description: "Websites that look and work perfectly on any device.",
      icon: "fas fa-mobile-alt",
    },
    {
      title: "PERFORMANCE DRIVEN",
      description: "Speed, SEO, and best practices built into every project.",
      icon: "fas fa-bolt",
    },
  ];

  return (
    <section id="expertise" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden min-h-screen">
      
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[60px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <div>
          <h2 className="text-[36px] md:text-[48px] text-[var(--color-text-dark)] font-serif uppercase leading-[1.1]">
            Skills &amp;<br />
            <span className="text-[var(--color-primary)]">Expertise</span>
          </h2>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <a 
            href="https://github.com/ZAndrie/portfolio-contents/tree/main/expertise" 
            target="_blank" 
            rel="noreferrer"
            className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-[10px]"
          >
            VIEW REPOSITORY <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
          </a>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px] md:gap-[50px] lg:gap-[40px]">
        
        {/* Left Column: Tabs & Progress Bars */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Tabs */}
          <div className="flex gap-[20px] mb-[40px] border-b border-[var(--color-border)] pb-[15px]">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`text-[12px] uppercase tracking-[1.5px] font-bold cursor-pointer transition-colors relative
                  ${activeTab === tab.value 
                    ? "text-[var(--color-text-dark)]" 
                    : "text-[var(--color-text-light)] hover:text-[var(--color-text-dark)]"
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.div 
                    layoutId="activeExpertiseTab"
                    className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[var(--color-primary)]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex flex-col gap-[25px]">
            <AnimatePresence mode="popLayout">
              {resumeData[activeTab].length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 px-6 bg-white/40 border border-dashed border-[var(--color-border)] rounded-xl text-center"
                >
                  <p className="text-[13px] text-[var(--color-text-light)] font-light italic">
                    Official entries under {tabs.find((t) => t.value === activeTab)?.label} are currently being updated and cataloged.
                  </p>
                </motion.div>
              ) : (
                resumeData[activeTab].map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-[15px]"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-[8px]">
                        <h3 className="text-[12px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px]">
                          {item.title}
                        </h3>
                        <span className="text-[11px] text-[var(--color-primary)] font-bold">
                          {item.year}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-[var(--color-text-light)] mb-[8px] italic">
                          {item.subtitle}
                        </p>
                      )}
                      {/* Divider / Progress Line */}
                      <div className="w-full h-[1px] bg-[var(--color-border)] relative overflow-hidden">
                        <motion.div 
                          initial={{ x: "-100%" }}
                          whileInView={{ x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                          className="absolute top-0 left-0 h-[2px] -mt-[0.5px] bg-[var(--color-primary)]"
                          style={{ 
                            width: !item.percentage 
                              ? "100%" 
                              : String(item.percentage).trim().endsWith("%") 
                              ? item.percentage 
                              : `${String(item.percentage).trim()}%` 
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Center Column: Blockquote */}
        <motion.div 
          className="flex flex-col justify-center px-[0] lg:px-[20px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-[80px] font-serif text-[var(--color-primary)] opacity-30 leading-none h-[60px]">
            “
          </div>
          <p className="text-[20px] md:text-[24px] font-serif leading-[1.6] text-[var(--color-text-dark)]">
            I design and build digital experiences that are not only beautiful but also functional, intuitive, and impactful.
          </p>
        </motion.div>

        {/* Right Column: Features */}
        <div className="flex flex-col gap-[35px]">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex gap-[20px] items-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
            >
              <div className="w-[45px] h-[45px] flex-shrink-0 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-[16px] shadow-sm">
                <i className={feature.icon}></i>
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px] mb-[5px]">
                  {feature.title}
                </h4>
                <p className="text-[13px] text-[var(--color-text-light)] leading-[1.6]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
