"use client";

import { useState } from "react";
import Image from "next/image";

export default function Portfolio() {
  const [filter, setFilter] = useState("all");

  const portfolioItems = [
    {
      category: "development",
      categoryLabel: "DEVELOPMENT",
      title: "E-Commerce Platform",
      subtitle: "Full-Stack Development",
      image: "/download/Development.jpg",
    },
    {
      category: "application",
      categoryLabel: "APPLICATION",
      title: "Task Management App",
      subtitle: "React Native",
      image: "/download/Apps.jpg",
    },
    {
      category: "design",
      categoryLabel: "DESIGN",
      title: "Brand Identity Design",
      subtitle: "UI/UX & Branding",
      image: "/download/Landing page.jpg",
    },
    {
      category: "development",
      categoryLabel: "CLOUD",
      title: "Cloud Infrastructure",
      subtitle: "AWS Deployment",
      image: "/download/Cloud.jpg",
    },
  ];

  const filters = [
    { label: "All Projects", value: "all" },
    { label: "Development", value: "development" },
    { label: "Application", value: "application" },
    { label: "Design", value: "design" },
  ];

  const filteredItems = filter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <section id="portfolio" className="py-[100px] px-[5%] md:px-[8%] bg-[var(--color-light-bg)] border-t border-[var(--color-border)]">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-[80px] gap-8">
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
      </div>

      {/* Filters (Minimal Editorial Style) */}
      <div className="flex gap-[30px] mb-[60px] border-b border-[var(--color-border)] pb-[20px] overflow-x-auto whitespace-nowrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-[12px] uppercase tracking-[1.5px] font-bold cursor-pointer transition-colors
              ${filter === f.value 
                ? "text-[var(--color-text-dark)]" 
                : "text-[var(--color-text-light)] hover:text-[var(--color-text-dark)]"
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[40px]">
        {filteredItems.map((item, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="w-full aspect-[4/5] overflow-hidden mb-[20px] bg-white border border-[var(--color-border)] p-[10px]">
              <div className="relative w-full h-full overflow-hidden bg-[var(--color-dark-bg)]">
                <Image
                  src={item.image}
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
              <div>
                <h3 className="text-[16px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px] mb-[5px]">
                  {item.title}
                </h3>
                <p className="text-[var(--color-text-light)] text-[12px]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
