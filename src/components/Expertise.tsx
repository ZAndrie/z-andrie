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
};

export default function Expertise() {
  const [activeTab, setActiveTab] = useState<ResumeCategory>("skills");

  const resumeData: Record<ResumeCategory, ResumeItem[]> = {
    education: [
      {
        id: "edu1",
        year: "2023 - 2027",
        title: "BS Information Technology",
        subtitle: "Cor Jesu College",
        percentage: "100%",
      },
      {
        id: "edu2",
        year: "2019 - 2021",
        title: "Senior High School (ICT)",
        subtitle: "Specialized in Tech",
        percentage: "100%",
      },
    ],
    skills: [
      {
        id: "skill1",
        year: "95%",
        title: "UI / UX DESIGN",
        percentage: "95%",
      },
      {
        id: "skill2",
        year: "90%",
        title: "WEB DEVELOPMENT",
        percentage: "90%",
      },
      {
        id: "skill3",
        year: "85%",
        title: "BRANDING",
        percentage: "85%",
      },
      {
        id: "skill4",
        year: "90%",
        title: "RESPONSIVE DESIGN",
        percentage: "90%",
      },
      {
        id: "skill5",
        year: "80%",
        title: "INTERACTION DESIGN",
        percentage: "80%",
      },
    ],
    experience: [
      {
        id: "exp1",
        year: "2024 - Present",
        title: "Freelance Web Developer",
        subtitle: "Self-Employed",
        percentage: "100%",
      },
      {
        id: "exp2",
        year: "Summer 2023",
        title: "Web Development Intern",
        subtitle: "Tech Startup",
        percentage: "100%",
      },
    ],
  };

  const tabs: { label: string; value: ResumeCategory }[] = [
    { label: "Skills", value: "skills" },
    { label: "Education", value: "education" },
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
    <section id="expertise" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden">
      
      {/* Header */}
      <motion.div 
        className="mb-[60px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-[36px] md:text-[48px] text-[var(--color-text-dark)] font-serif uppercase leading-[1.1]">
          Skills &<br />
          <span className="text-[var(--color-primary)]">Expertise</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[60px] lg:gap-[40px]">
        
        {/* Left Column: Tabs & Progress Bars */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
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
              {resumeData[activeTab].map((item, index) => (
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
                      <span className="text-[11px] text-[var(--color-text-light)]">
                        {item.year}
                      </span>
                    </div>
                    {item.subtitle && (
                      <p className="text-[11px] text-[var(--color-text-light)] mb-[8px] italic">
                        {item.subtitle}
                      </p>
                    )}
                    {/* Progress Line */}
                    <div className="w-full h-[1px] bg-[var(--color-border)] relative overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        whileInView={{ x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                        className="absolute top-0 left-0 h-[2px] -mt-[0.5px] bg-[var(--color-primary)]"
                        style={{ width: item.percentage }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Center Column: Blockquote */}
        <motion.div 
          className="flex flex-col justify-center px-[0] lg:px-[20px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
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
              viewport={{ once: false, amount: 0.2 }}
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
