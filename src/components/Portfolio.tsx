"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function Portfolio({ projects = [] }: { projects?: any[] }) {
  const [filter, setFilter] = useState("all");

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

  return (
    <section id="portfolio" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden min-h-screen">
      
      {/* Header section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-[400px]">
          <h2 className="text-[36px] md:text-[48px] text-[var(--color-text-dark)] font-serif uppercase leading-[1.1] mb-[20px]">
            Selected<br />
            <span className="text-[var(--color-primary)]">Projects</span>
          </h2>
        </div>
        
        <div className="flex-1 max-w-[400px]">
          <p className="text-[var(--color-text-light)] text-[14px] leading-[1.6]">
            Live projects synced directly from GitHub repositories showcasing design, full-stack development, and system architecture.
          </p>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <a 
            href="https://github.com/ZAndrie" 
            target="_blank" 
            rel="noreferrer"
            className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-[10px]"
          >
            VIEW ON GITHUB <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
          </a>
        </div>
      </motion.div>

      {/* Filters (Minimal Editorial Style) */}
      <motion.div 
        className="flex gap-[30px] mb-[60px] border-b border-[var(--color-border)] pb-[20px] overflow-x-auto whitespace-nowrap scrollbar-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-[12px] uppercase tracking-[1.5px] font-bold cursor-pointer transition-colors relative
              ${filter === f.value 
                ? "text-[var(--color-text-dark)]" 
                : "text-[var(--color-text-light)] hover:text-[var(--color-text-dark)]"
              }
            `}
          >
            {f.label}
            {filter === f.value && (
              <motion.div 
                layoutId="activeFilter"
                className="absolute bottom-[-21px] left-0 right-0 h-[2px] bg-[var(--color-primary)]"
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px]"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-[var(--color-text-light)] py-20">
              No projects found in this category.
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
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
