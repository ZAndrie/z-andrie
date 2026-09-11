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
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, language, category..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[var(--color-border)] rounded-md text-xs focus:outline-none focus:border-[var(--color-primary)] transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="text-[11px] text-gray-400 uppercase tracking-wider whitespace-nowrap font-medium self-end sm:self-center">
          Showing <strong className="text-[var(--color-text-dark)]">{filteredProjects.length}</strong> of {projects.length}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="border border-[var(--color-border)] bg-white rounded-lg p-5 flex flex-col gap-4 group hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Image Preview */}
            <div className="relative w-full h-44 bg-gray-100 rounded overflow-hidden border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLElement).setAttribute(
                    "src",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"
                  );
                }}
              />
              {p.language && (
                <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {p.language}
                </span>
              )}
            </div>

            {/* Project Content */}
            <div className="flex flex-col flex-1">
              <div className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">
                {p.category}
              </div>
              <h4 className="font-serif text-lg leading-tight mb-2 text-[var(--color-text-dark)]">
                {p.title}
              </h4>
              <p className="text-gray-500 text-[12px] leading-relaxed mb-4 flex-1 line-clamp-3">
                {p.subtitle}
              </p>
            </div>

            {/* Bottom Actions - Edit, View Live, GitHub (NO DELETE) */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-3">
                {p.projectUrl && (
                  <a
                    href={p.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--color-text-dark)] hover:text-[var(--color-primary)] font-bold transition-colors"
                  >
                    Live <ExternalLink size={11} />
                  </a>
                )}
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400 hover:text-[var(--color-text-dark)] transition-colors"
                  >
                    <Code2 size={11} /> Repo
                  </a>
                )}
              </div>

              <Link
                href={`/admin/projects/${p.id}`}
                className="inline-flex items-center gap-1.5 bg-[var(--color-light-bg)] hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-white px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-colors"
              >
                <Edit3 size={12} /> Edit
              </Link>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
            <Search size={28} className="text-gray-400 mb-1" />
            <p className="text-sm font-medium text-gray-600">No projects match &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-gray-400">Try searching for a different title, category, or programming language.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs text-[var(--color-primary)] underline hover:text-[var(--color-text-dark)]"
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

