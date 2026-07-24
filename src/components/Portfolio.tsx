"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Portfolio({ projects = [] }: { projects?: any[] }) {
  const [filter, setFilter] = useState("all");

  const uniqueCategories = Array.from(new Set(projects.map(p => p.category.toLowerCase())));
  const filters = [
    { label: "All Projects", value: "all" },
    ...uniqueCategories.map(cat => ({ label: cat, value: cat }))
  ];

  const filteredItems = filter === "all" 
    ? projects 
    : projects.filter(item => item.category.toLowerCase() === filter);

  return (
    <section id="portfolio" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden">
      
      {/* Header section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
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
            A curated selection of recent work showcasing design, development, and problem-solving.
          </p>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <a href="#" className="text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-[10px]">
            VIEW ALL PROJECTS <span className="text-[var(--color-primary)] text-lg leading-none font-light">→</span>
          </a>
        </div>
      </motion.div>

      {/* Filters (Minimal Editorial Style) */}
      <motion.div 
        className="flex gap-[30px] mb-[60px] border-b border-[var(--color-border)] pb-[20px] overflow-x-auto whitespace-nowrap"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
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
          {filteredItems.map((item, index) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-square overflow-hidden mb-[20px] bg-white border border-[var(--color-border)] p-[10px]">
                <div className="relative w-full h-full overflow-hidden bg-[var(--color-dark-bg)]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-[15px]">
                <span className="text-[24px] font-serif text-[var(--color-primary)] leading-[1]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px] mb-[5px]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-light)] text-[12px] mb-2">
                    {item.subtitle}
                  </p>
                  {item.projectUrl && (
                    <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold text-[var(--color-primary)] hover:text-[var(--color-text-dark)] transition-colors">
                      View Project →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
