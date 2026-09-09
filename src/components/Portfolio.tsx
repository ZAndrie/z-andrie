"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Portfolio({ projects = [] }: { projects?: any[] }) {
  const [filter, setFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getFallbackImage = (item: any) => {
    const text = `${item.title} ${item.category || ""} ${item.language || ""}`.toLowerCase();
    if (text.includes("ai") || text.includes("python") || text.includes("machine")) return "/download/Apps.jpg";
    if (text.includes("android") || text.includes("mobile") || text.includes("ardino") || text.includes("iot")) return "/download/AndroidApp.jpg";
    if (text.includes("cloud") || text.includes("server") || text.includes("api")) return "/download/Cloud.jpg";
    if (text.includes("figma") || text.includes("design") || text.includes("ui")) return "/download/Figma.jpg";
    if (text.includes("landing") || text.includes("portfolio")) return "/download/Landing page.jpg";
    if (text.includes("library") || text.includes("php") || text.includes("blade") || text.includes("system")) return "/download/Webdesign.jpg";
    return "/download/Development.jpg";
  };

  return (
    <section id="portfolio" className="pt-[100px] pb-[40px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)] flex-1 flex flex-col justify-center overflow-hidden min-h-screen">
      
      {/* Header section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2, margin: "-100px" }}
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
        viewport={{ once: false, amount: 0.2 }}
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
            filteredItems.map((item, index) => {
              const imageSrc = imageErrors[item.id] ? getFallbackImage(item) : item.imageUrl;
              const isExternalImage = imageSrc.startsWith("http");

              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full aspect-video md:aspect-square overflow-hidden mb-[20px] bg-white border border-[var(--color-border)] p-[8px] shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="relative w-full h-full overflow-hidden bg-[var(--color-dark-bg)]">
                        <Image
                          src={imageSrc}
                          alt={item.title}
                          fill
                          unoptimized={isExternalImage}
                          onError={() => handleImageError(item.id)}
                          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-[15px]">
                      <span className="text-[24px] font-serif text-[var(--color-primary)] leading-[1]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-[15px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px]">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--color-border)] text-[var(--color-text-dark)]">
                            {item.language || item.category}
                          </span>
                          {item.stars > 0 && (
                            <span className="text-[11px] text-amber-500 font-bold flex items-center gap-1">
                              ★ {item.stars}
                            </span>
                          )}
                        </div>

                        <p className="text-[var(--color-text-light)] text-[12px] line-clamp-3 mb-3 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 pl-[35px] pt-2 border-t border-[var(--color-border)]/50">
                    {item.projectUrl && item.projectUrl !== item.githubUrl && (
                      <a 
                        href={item.projectUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] uppercase font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 transition-all"
                      >
                        Live Demo ↗
                      </a>
                    )}
                    {(item.githubUrl || item.projectUrl) && (
                      <a 
                        href={item.githubUrl || item.projectUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] uppercase font-bold text-[var(--color-text-dark)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
