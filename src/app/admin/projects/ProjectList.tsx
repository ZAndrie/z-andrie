"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ExternalLink, Code2, Edit3 } from "lucide-react";
import { GitHubProject } from "@/lib/github";

export default function ProjectList({ projects }: { projects: GitHubProject[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(q);
      const categoryMatch = p.category?.toLowerCase().includes(q);
      const subtitleMatch = p.subtitle?.toLowerCase().includes(q);
      const languageMatch = p.language?.toLowerCase().includes(q);
      return titleMatch || categoryMatch || subtitleMatch || languageMatch;
    });
  }, [projects, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by title, language, discipline..."
            className="w-full pl-10 pr-10 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="font-mono text-[11px] text-gray-500 uppercase tracking-widest whitespace-nowrap self-end sm:self-center">
          INDEXED: <strong className="text-[var(--color-primary)]">{filteredProjects.length}</strong> / {projects.length}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="border border-white/10 bg-[#0e0e12]/90 rounded-xl p-5 flex flex-col gap-4 group hover:border-[var(--color-primary)]/40 hover:bg-[#121217] transition-all relative overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
          >
            {/* Image Preview */}
            <div className="relative w-full h-44 bg-black rounded-lg overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute(
                    "src",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"
                  );
                }}
              />
              {p.language && (
                <span className="absolute top-2 right-2 bg-black/85 backdrop-blur-md text-[var(--color-primary)] border border-white/10 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {p.language}
                </span>
              )}
            </div>

            {/* Project Details */}
            <div className="flex flex-col flex-1">
              <div className="font-mono text-[9px] text-[var(--color-primary)] uppercase tracking-[2px] font-bold mb-1">
                {p.category}
              </div>
              <h4 className="font-stencil text-xl uppercase tracking-wide mb-2 text-white group-hover:text-[var(--color-primary)] transition-colors">
                {p.title}
              </h4>
              <p className="text-gray-400 font-mono text-[11px] leading-relaxed mb-4 flex-1 line-clamp-3 font-light">
                {p.subtitle}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto font-mono">
              <div className="flex items-center gap-3">
                {p.projectUrl && (
                  <a
                    href={p.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-300 hover:text-[var(--color-primary)] font-bold transition-colors"
                  >
                    Live <ExternalLink size={10} />
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
                  >
                    <Code2 size={11} /> Repo
                  </a>
                )}
              </div>

              <Link
                href={`/admin/projects/${p.id}`}
                className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-[var(--color-primary)] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors border border-white/10 hover:border-transparent"
              >
                <Edit3 size={11} /> Edit Entry
              </Link>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 bg-[#0e0e12]/40 font-mono">
            <Search size={24} className="text-gray-500 mb-1" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-300">No project records match &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-[11px] text-gray-500">Check query keywords or register a new project entry using the dispatch form.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-[var(--color-primary)] underline hover:text-white uppercase tracking-wider"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
