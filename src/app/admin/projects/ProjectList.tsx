"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ExternalLink,
  Code2,
  Edit3,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  PlusCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  GitBranch,
} from "lucide-react";
import { GitHubProject } from "@/lib/github";
import { toggleProjectVisibility } from "./actions";
import ProjectForm from "./ProjectForm";

export default function ProjectList({ projects: initialProjects }: { projects: GitHubProject[] }) {
  const [projects, setProjects] = useState<GitHubProject[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Quick stats
  const totalCount = projects.length;
  const hiddenCount = projects.filter((p) => p.hidden).length;
  const visibleCount = totalCount - hiddenCount;

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Status filter
      if (statusFilter === "visible" && p.hidden) return false;
      if (statusFilter === "hidden" && !p.hidden) return false;

      // Search query
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const titleMatch = p.title?.toLowerCase().includes(q);
      const categoryMatch = p.category?.toLowerCase().includes(q);
      const subtitleMatch = p.subtitle?.toLowerCase().includes(q);
      const languageMatch = p.language?.toLowerCase().includes(q);
      return titleMatch || categoryMatch || subtitleMatch || languageMatch;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleToggleHide = async (project: GitHubProject) => {
    const nextHidden = !project.hidden;
    setTogglingId(project.id);
    setFeedbackMessage(null);

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, hidden: nextHidden } : p))
    );

    const res = await toggleProjectVisibility(project.id, nextHidden, {
      title: project.title,
      category: project.category,
      subtitle: project.subtitle,
      imageUrl: project.imageUrl,
      githubUrl: project.githubUrl,
      projectUrl: project.projectUrl,
    });

    setTogglingId(null);

    if (res.success) {
      if (res.syncedToGitHub) {
        setFeedbackMessage({
          type: "success",
          text: res.message || `Project "${project.title}" is now ${nextHidden ? "HIDDEN from" : "VISIBLE in"} public portfolio and committed to GitHub!`,
        });
      } else if (res.warning) {
        setFeedbackMessage({
          type: "info",
          text: `Project "${project.title}" is now ${nextHidden ? "HIDDEN" : "VISIBLE"} locally! (${res.warning})`,
        });
      } else {
        setFeedbackMessage({
          type: "info",
          text: res.message || `Project "${project.title}" is now ${nextHidden ? "HIDDEN from" : "VISIBLE in"} public portfolio locally. (Add GITHUB_TOKEN to .env.local to also push live to GitHub)`,
        });
      }
      setTimeout(() => setFeedbackMessage(null), 6000);
    } else {
      // Revert optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, hidden: !nextHidden } : p))
      );
      setFeedbackMessage({
        type: "error",
        text: res.error || "Failed to update project visibility.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Top Action & Control Deck */}
      <div className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl p-4 md:p-5 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl overflow-x-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                statusFilter === "all"
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ALL ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("visible")}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                statusFilter === "visible"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              VISIBLE ({visibleCount})
            </button>
            <button
              onClick={() => setStatusFilter("hidden")}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                statusFilter === "hidden"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <EyeOff size={11} className="text-amber-400" />
              HIDDEN ({hiddenCount})
            </button>
          </div>

          {/* Search, View Mode & Dispatch Toggle */}
          <div className="flex items-center gap-3 self-stretch lg:self-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repository..."
                className="w-full pl-9 pr-8 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-black/60 border border-white/10 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
                }`}
                title="Dense Table View (No Scrolling)"
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Toggle Dispatch Form Button */}
            <button
              onClick={() => setShowDispatchForm(!showDispatchForm)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[1.5px] transition-all shrink-0 cursor-pointer ${
                showDispatchForm
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-[var(--color-primary)] hover:bg-[#d0350e] text-white shadow-lg shadow-[var(--color-primary)]/20"
              }`}
            >
              {showDispatchForm ? (
                <>
                  <X size={13} />
                  <span>CLOSE</span>
                </>
              ) : (
                <>
                  <PlusCircle size={13} />
                  <span>+ NEW PROJECT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in ${
              feedbackMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                : feedbackMessage.type === "info"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "bg-red-500/10 text-red-300 border border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMessage.type === "success" ? (
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              ) : feedbackMessage.type === "info" ? (
                <Info size={15} className="text-cyan-400 shrink-0" />
              ) : (
                <AlertCircle size={15} className="text-red-400 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="text-gray-400 hover:text-white">
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Dispatch Form Drawer */}
      {showDispatchForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ProjectForm
            onClose={() => setShowDispatchForm(false)}
            onSuccess={() => {
              setShowDispatchForm(false);
              setFeedbackMessage({
                type: "success",
                text: "Project successfully registered in GitHub datastore!",
              });
            }}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. DENSE TABLE / COMPACT LIST VIEW (NO ENDLESS SCROLLING) */}
      {/* ======================================================== */}
      {viewMode === "table" ? (
        <div className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10 text-[9px] font-bold uppercase tracking-[2px] text-gray-500">
                  <th className="p-3.5 pl-5">Cover</th>
                  <th className="p-3.5">Title &amp; Category</th>
                  <th className="p-3.5">Tech / Branch</th>
                  <th className="p-3.5">Visibility Status</th>
                  <th className="p-3.5 text-center">Hide / Show</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredProjects.map((p) => {
                  const isHidden = Boolean(p.hidden);
                  const isToggling = togglingId === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isHidden ? "opacity-60 bg-black/20" : ""
                      }`}
                    >
                      {/* Mini Thumbnail */}
                      <td className="p-3 pl-5">
                        <div className="w-20 h-11 bg-black/80 rounded-lg overflow-hidden border border-white/15 shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute(
                                "src",
                                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200"
                              );
                            }}
                          />
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-stencil text-base text-white tracking-wide uppercase line-clamp-1">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-[var(--color-primary)] uppercase tracking-wider font-bold">
                            {p.category}
                          </span>
                        </div>
                      </td>

                      {/* Tech / Stars */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {p.language ? (
                            <span className="bg-black/40 border border-white/10 text-[9px] px-2 py-0.5 rounded text-gray-300 uppercase">
                              {p.language}
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-600">General</span>
                          )}
                        </div>
                      </td>

                      {/* Visibility Status Badge */}
                      <td className="p-3">
                        {isHidden ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-bold uppercase tracking-wider">
                            <EyeOff size={10} /> HIDDEN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> VISIBLE
                          </span>
                        )}
                      </td>

                      {/* Hide / Show Fast Toggle */}
                      <td className="p-3 text-center">
                        <button
                          disabled={isToggling}
                          onClick={() => handleToggleHide(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer ${
                            isHidden
                              ? "bg-amber-500/15 hover:bg-emerald-500/20 text-amber-300 hover:text-emerald-300 border border-amber-500/30"
                              : "bg-white/5 hover:bg-amber-500/15 text-gray-400 hover:text-amber-300 border border-white/10 hover:border-amber-500/30"
                          }`}
                          title={isHidden ? "Unhide and display in public portfolio" : "Hide from public portfolio"}
                        >
                          {isToggling ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : isHidden ? (
                            <Eye size={12} />
                          ) : (
                            <EyeOff size={12} />
                          )}
                          <span>{isHidden ? "UNHIDE" : "HIDE"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3 pr-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.projectUrl && (
                            <a
                              href={p.projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                              title="Open Live URL"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                              title="Open GitHub Repo"
                            >
                              <Code2 size={13} />
                            </a>
                          )}
                          <Link
                            href={`/admin/projects/${p.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[var(--color-primary)] text-gray-300 hover:text-white text-[10px] uppercase font-bold tracking-wider transition-colors border border-white/10 hover:border-transparent"
                          >
                            <Edit3 size={11} /> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. FULL-WIDTH TACTICAL GRID VIEW (3/4 COLUMNS COMPACT) */
        /* ======================================================== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const isHidden = Boolean(p.hidden);
            const isToggling = togglingId === p.id;
            return (
              <div
                key={p.id}
                className={`border rounded-xl p-5 flex flex-col gap-3 group transition-all relative overflow-hidden shadow-xl ${
                  isHidden
                    ? "bg-[#0b0b0e] border-amber-500/20 opacity-75"
                    : "bg-[#0e0e12]/90 border-white/10 hover:border-[var(--color-primary)]/40 hover:bg-[#121217]"
                }`}
              >
                {/* Image Container with Badges */}
                <div className="relative w-full h-40 bg-black rounded-lg overflow-hidden border border-white/10">
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
                  {/* Visibility Badge Overlay */}
                  <div className="absolute top-2 left-2">
                    {isHidden ? (
                      <span className="bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <EyeOff size={10} /> HIDDEN
                      </span>
                    ) : (
                      <span className="bg-black/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> VISIBLE
                      </span>
                    )}
                  </div>

                  {p.language && (
                    <span className="absolute top-2 right-2 bg-black/85 backdrop-blur-md text-[var(--color-primary)] border border-white/10 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {p.language}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1">
                  <div className="text-[9px] text-[var(--color-primary)] uppercase tracking-[2px] font-bold mb-1">
                    {p.category}
                  </div>
                  <h4 className="font-stencil text-xl uppercase tracking-wide mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {p.title}
                  </h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed mb-3 flex-1 line-clamp-2 font-light">
                    {p.subtitle}
                  </p>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
                  {/* Hide/Show Button */}
                  <button
                    disabled={isToggling}
                    onClick={() => handleToggleHide(p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer ${
                      isHidden
                        ? "bg-amber-500/15 hover:bg-emerald-500/20 text-amber-300 hover:text-emerald-300 border border-amber-500/30"
                        : "bg-white/5 hover:bg-amber-500/15 text-gray-400 hover:text-amber-300 border border-white/10 hover:border-amber-500/30"
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : isHidden ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )}
                    <span>{isHidden ? "Unhide" : "Hide"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {p.projectUrl && (
                      <a
                        href={p.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        title="Live Preview"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="inline-flex items-center gap-1 bg-white/5 hover:bg-[var(--color-primary)] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors border border-white/10 hover:border-transparent"
                    >
                      <Edit3 size={11} /> Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#0e0e12]/40">
          <Search size={24} className="text-gray-500 mb-1" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-300">
            No projects match current filter criteria
          </p>
          <p className="text-[11px] text-gray-500">
            Try switching filter tabs or clearing search keywords.
          </p>
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
  );
}
