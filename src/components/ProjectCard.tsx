"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ProjectCardProps {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
  language?: string;
  imageUrl: string;
  githubUrl: string;
  projectUrl?: string;
  stars?: number;
  topics?: string[];
  index: number;
  className?: string;
}

export default function ProjectCard({
  id,
  title,
  subtitle,
  category,
  language,
  imageUrl,
  githubUrl,
  projectUrl,
  stars = 0,
  topics = [],
  index,
  className,
}: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);

  // Fallback graphic if remote image fails
  const getFallbackImage = () => {
    const text = `${title} ${category || ""} ${language || ""}`.toLowerCase();
    if (text.includes("gsap") || text.includes("landing")) return "/download/Landing page.jpg";
    if (text.includes("ai") || text.includes("python")) return "/download/Apps.jpg";
    if (text.includes("design") || text.includes("ui")) return "/download/Figma.jpg";
    return "/download/Webdesign.jpg";
  };

  const finalImage = imgError ? getFallbackImage() : imageUrl;
  const isExternalImage = finalImage.startsWith("http");

  // Determine tech tags
  const techTags = topics.length > 0
    ? topics.slice(0, 3)
    : [language || category || "React", "GSAP"].filter(Boolean);

  const liveDemoLink = projectUrl || githubUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={
        className
          ? className
          : "group flex flex-col justify-between bg-white/70 hover:bg-white border border-[var(--color-border)] p-5 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300"
      }
    >
      <div>
        {/* Screenshot / GIF */}
        <div className="w-full aspect-video overflow-hidden mb-[18px] bg-[var(--color-dark-bg)] border border-[var(--color-border)] relative">
          <Image
            src={finalImage}
            alt={title}
            fill
            unoptimized={isExternalImage}
            onError={() => setImgError(true)}
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        </div>

        {/* Header: Index number + Title */}
        <div className="flex items-start gap-[12px] mb-2">
          <span className="text-[20px] font-serif text-[var(--color-primary)] leading-none pt-0.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[var(--color-text-dark)] uppercase tracking-[1px] group-hover:text-[var(--color-primary)] transition-colors">
              {title}
            </h3>
          </div>
        </div>

        {/* Tech Used Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 pl-[28px]">
          {techTags.map((tech, i) => (
            <span
              key={i}
              className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--color-light-bg)] border border-[var(--color-border)] text-[var(--color-text-dark)] font-medium"
            >
              {tech}
            </span>
          ))}
          {stars > 0 && (
            <span className="text-[11px] text-amber-500 font-bold flex items-center gap-1 ml-auto">
              ★ {stars}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-[var(--color-text-light)] text-[12px] line-clamp-3 leading-relaxed mb-4 pl-[28px]">
          {subtitle}
        </p>
      </div>

      {/* Action Links: GitHub Repo + Live Demo with Driezie Roll & Arrow-Swap */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]/70 text-[11px] uppercase font-bold tracking-[1.5px]">
        <a
          href={liveDemoLink}
          target="_blank"
          rel="noreferrer"
          className="group/btn text-[var(--color-primary)] hover:opacity-80 inline-flex items-center gap-1.5 transition-all"
        >
          <span className="roll">
            <span className="roll__inner">
              <span>Live Demo</span>
              <span className="roll__ghost" aria-hidden="true">Live Demo</span>
            </span>
          </span>
          <span className="arrow-swap w-[10px] h-[10px]" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="group/btn text-[var(--color-text-dark)] hover:text-[var(--color-primary)] inline-flex items-center gap-1.5 transition-colors"
        >
          <span className="roll">
            <span className="roll__inner">
              <span>GitHub Repo</span>
              <span className="roll__ghost" aria-hidden="true">GitHub Repo</span>
            </span>
          </span>
          <span className="arrow-swap w-[10px] h-[10px]" aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </a>
      </div>
    </motion.div>
  );
}
