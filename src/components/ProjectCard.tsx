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
  compact?: boolean;
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
  compact,
}: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);

  const getFallbackImage = () => {
    const text = `${title} ${category || ""} ${language || ""}`.toLowerCase();
    if (text.includes("gsap") || text.includes("landing")) return "/download/Landing page.jpg";
    if (text.includes("ai") || text.includes("python")) return "/download/Apps.jpg";
    if (text.includes("design") || text.includes("ui")) return "/download/Figma.jpg";
    return "/download/Webdesign.jpg";
  };

  const finalImage = imgError ? getFallbackImage() : imageUrl;
  const isExternalImage = finalImage.startsWith("http");

  const techTags = topics.length > 0
    ? topics.slice(0, 3)
    : [language || category || "React", "CSS"].filter(Boolean);

  const liveDemoLink = projectUrl || githubUrl;

  // Detect compact mode: explicit prop OR className contains small/medium height
  const isCompact =
    compact ||
    className?.includes("h-[220px]") ||
    className?.includes("h-[240px]") ||
    className?.includes("h-[260px]") ||
    className?.includes("h-[280px]");

  // ── COMPACT LAYOUT ──────────────────────────────────────────────────────────
  // Small top banner image (~88px) + title + tags + truncated desc + links
  // Designed to fit inside a 220–240px fixed-height flex-col card
  // ────────────────────────────────────────────────────────────────────────────
  if (isCompact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        className={
          className
            ? className
            : "group flex flex-col justify-between bg-white/90 hover:bg-white border border-[var(--color-border)] rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
        }
        style={{ padding: 0 }} // override any padding from className so image bleeds edge-to-edge
      >
        {/* ── Top image banner (fixed 88px) ── */}
        <div className="relative w-full h-[88px] shrink-0 overflow-hidden bg-[var(--color-dark-bg)]">
          <Image
            src={finalImage}
            alt={title}
            fill
            unoptimized={isExternalImage}
            onError={() => setImgError(true)}
            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          {/* Gradient fade into card body */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 pointer-events-none" />
          {/* Index badge */}
          <span className="absolute top-2 left-2 text-[11px] font-serif font-bold text-white leading-none bg-[var(--color-primary)]/90 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Stars badge (if any) */}
          {stars > 0 && (
            <span className="absolute top-2 right-2 text-[10px] text-amber-400 font-bold bg-black/50 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
              ★ {stars}
            </span>
          )}
        </div>

        {/* ── Content body ── */}
        <div className="flex flex-col justify-between flex-1 px-3.5 pt-2 pb-3 overflow-hidden">
          <div>
            {/* Title */}
            <h3 className="text-[12px] sm:text-[13px] font-bold text-[var(--color-text-dark)] uppercase tracking-[0.8px] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-1.5 line-clamp-1">
              {title}
            </h3>

            {/* Tech pills */}
            <div className="flex flex-wrap items-center gap-1 mb-1.5">
              {techTags.map((tech, i) => (
                <span
                  key={i}
                  className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-sm bg-[var(--color-light-bg)] border border-[var(--color-border)] text-[var(--color-text-dark)] font-medium leading-none"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Short description */}
            <p className="text-[var(--color-text-light)] text-[11px] line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Action links */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/60 text-[10px] uppercase font-bold tracking-[1px] mt-2">
            <a
              href={liveDemoLink}
              target="_blank"
              rel="noreferrer"
              className="group/btn text-[var(--color-primary)] hover:opacity-75 inline-flex items-center gap-1 transition-all"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>Live Demo</span>
                  <span className="roll__ghost" aria-hidden="true">Live Demo</span>
                </span>
              </span>
              <span className="arrow-swap w-[9px] h-[9px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="group/btn text-[var(--color-text-dark)] hover:text-[var(--color-primary)] inline-flex items-center gap-1 transition-colors"
            >
              <span className="roll">
                <span className="roll__inner">
                  <span>GitHub Repo</span>
                  <span className="roll__ghost" aria-hidden="true">GitHub Repo</span>
                </span>
              </span>
              <span className="arrow-swap w-[9px] h-[9px]" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg viewBox="0 0 12 12" fill="none" className="w-full h-full"><path d="M2.5 9.5 9.5 2.5M4.5 2.5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── STANDARD LAYOUT (vertical, full-height cards) ───────────────────────────
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

      {/* Action Links */}
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
