"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteExpertiseItem, updateExpertiseItem } from "./actions";
import {
  Trash2,
  Briefcase,
  GraduationCap,
  Wrench,
  Loader2,
  Pencil,
  X,
  Check,
  ExternalLink,
  GitBranch,
  PlusCircle,
} from "lucide-react";
import ExpertiseForm from "./ExpertiseForm";

export default function ExpertiseList({ items = [] }: { items?: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "skills" | "education" | "experience">("all");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editStatus, setEditStatus] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from GitHub repository?`)) return;
    setDeletingId(id);
    await deleteExpertiseItem(id);
    setDeletingId(null);
    router.refresh();
  };

  const handleStartEdit = (item: any) => {
    setEditingItem({
      ...item,
      desc: item.desc || (item.bullets && item.bullets.length > 0 ? item.bullets.join("\n") : ""),
    });
    setEditStatus(null);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    setSavingEdit(true);
    setEditStatus(null);

    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const title = (formData.get("title") as string).trim();
    const year = (formData.get("year") as string)?.trim() || "";
    const subtitle = (formData.get("subtitle") as string)?.trim() || "";
    const desc = (formData.get("desc") as string)?.trim() || "";
    const bullets = desc
      ? desc
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

    const res = await updateExpertiseItem(editingItem.id, {
      category,
      title,
      subtitle,
      year,
      desc,
      bullets,
      percentage: editingItem.percentage || "100%",
    });

    setSavingEdit(false);

    if (res.success) {
      setEditStatus("Updated successfully!");
      setTimeout(() => {
        setEditingItem(null);
        setEditStatus(null);
        router.refresh();
      }, 600);
    } else {
      setEditStatus(res.error || "Failed to update item on GitHub.");
    }
  };

  const skills = items.filter((i) => i.category === "skills");
  const education = items.filter((i) => i.category === "education");
  const experience = items.filter((i) => i.category === "experience");

  const renderSection = (title: string, data: any[], icon: React.ReactNode, isSkills: boolean = false) => (
    <div className="flex flex-col gap-3 font-mono">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="text-[var(--color-primary)]">{icon}</div>
          <h4 className="font-stencil text-lg uppercase tracking-wider text-white">
            {title} <span className="text-gray-500 font-mono text-xs">({data.length})</span>
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {data.length === 0 ? (
          <div className="col-span-full text-[11px] text-gray-500 italic py-3 bg-black/30 px-4 rounded-xl border border-dashed border-white/10">
            No active records in this category.
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 bg-[#0e0e12]/90 p-4 rounded-xl flex flex-col justify-between gap-2.5 group hover:border-[var(--color-primary)]/40 hover:bg-[#121217] transition-all relative shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="font-stencil text-lg uppercase tracking-wide text-white group-hover:text-[var(--color-primary)] transition-colors">
                        {item.title}
                      </span>
                      {!isSkills && item.year && (
                        <span className="text-[9px] text-[var(--color-primary)] font-mono font-bold bg-[var(--color-primary)]/10 px-2 py-0.5 rounded border border-[var(--color-primary)]/20 shrink-0">
                          {item.year}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <span className="text-[11px] text-gray-400 font-mono">{item.subtitle}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                      title="Edit Item"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                      title="Delete Item"
                    >
                      {deletingId === item.id ? (
                        <Loader2 size={13} className="animate-spin text-red-400" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bullets / Description */}
                {item.bullets && item.bullets.length > 0 ? (
                  <ul className="text-[10px] text-gray-400 pl-4 border-l border-[var(--color-primary)]/30 flex flex-col gap-0.5 mt-2 font-mono">
                    {item.bullets.map((b: string, idx: number) => (
                      <li key={idx} className="list-disc list-inside">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : item.desc ? (
                  <p className="text-[10px] text-gray-400 pl-3 border-l border-[var(--color-primary)]/30 mt-2 font-mono italic line-clamp-2">
                    {item.desc}
                  </p>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 relative font-mono">
      {/* Top Controls Bar */}
      <div className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-xl overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === "all"
                ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ALL SECTORS ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === "skills"
                ? "bg-white/15 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            SKILLS ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === "education"
                ? "bg-white/15 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            EDUCATION ({education.length})
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
              activeTab === "experience"
                ? "bg-white/15 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            EXPERIENCE ({experience.length})
          </button>
        </div>

        {/* Action Toggle Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <a
            href="https://github.com/ZAndrie/portfolio-contents/tree/main/expertise"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-gray-400 hover:text-white text-[10px] uppercase font-bold tracking-wider transition-colors"
          >
            <GitBranch size={13} className="text-[var(--color-primary)]" />
            <span>GitHub Datastore</span>
            <ExternalLink size={11} />
          </a>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[1.5px] transition-all cursor-pointer ${
              showForm
                ? "bg-white/10 text-white border border-white/20"
                : "bg-[var(--color-primary)] hover:bg-[#d0350e] text-white shadow-lg shadow-[var(--color-primary)]/20"
            }`}
          >
            {showForm ? (
              <>
                <X size={13} />
                <span>CLOSE</span>
              </>
            ) : (
              <>
                <PlusCircle size={13} />
                <span>+ ADD ENTRY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Form */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ExpertiseForm
            onClose={() => setShowForm(false)}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Render Active Category Sections in Compact Layout */}
      <div className="flex flex-col gap-6">
        {(activeTab === "all" || activeTab === "skills") &&
          renderSection("Skills & Pillars", skills, <Wrench size={16} />, true)}

        {(activeTab === "all" || activeTab === "education") &&
          renderSection("Education & Academic Path", education, <GraduationCap size={16} />)}

        {(activeTab === "all" || activeTab === "experience") &&
          renderSection("Work Experience & Operations", experience, <Briefcase size={16} />)}
      </div>

      {/* Edit Modal Dialog */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 flex flex-col gap-5 border border-white/15 animate-in fade-in zoom-in-95 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-[2px] text-gray-500 block mb-0.5">MODIFICATION_GATE</span>
                <h3 className="font-stencil text-2xl text-white uppercase tracking-wider">
                  EDIT RESUME ENTRY
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {editStatus && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  editStatus.includes("success")
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/10 text-red-300 border border-red-500/30"
                }`}
              >
                {editStatus.includes("success") && <Check size={14} className="text-emerald-400" />}
                <span>{editStatus}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">Category</label>
                <select
                  name="category"
                  defaultValue={editingItem.category}
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="skills" className="bg-[#0e0e12]">Skills</option>
                  <option value="education" className="bg-[#0e0e12]">Education &amp; Training</option>
                  <option value="experience" className="bg-[#0e0e12]">Experience</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">Title / Designation</label>
                <input
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
                  Date Range / Years (Optional)
                </label>
                <input
                  name="year"
                  defaultValue={editingItem.year || ""}
                  placeholder="e.g. 2021-2023 or 2023-Present"
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
                  School / Company / Subtitle (Optional)
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingItem.subtitle || ""}
                  placeholder="e.g. Cor Jesu College"
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
                    Key Accomplishments / Bullets (Optional)
                  </label>
                  <span className="text-[9px] text-gray-500 font-mono">OPTIONAL</span>
                </div>
                <p className="text-[10px] text-gray-500 font-light">
                  Separate each bullet point onto a new line. Leave blank for no bullets.
                </p>
                <textarea
                  name="desc"
                  rows={4}
                  defaultValue={editingItem.desc}
                  placeholder="Enter accomplishments one per line..."
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[#d0350e] text-white text-[11px] font-bold uppercase tracking-[2px] rounded-lg shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>COMMITTING...</span>
                    </>
                  ) : (
                    "COMMIT TO GITHUB"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
