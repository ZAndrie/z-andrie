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
  Award,
  Plus,
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

  // Edit modal tenure achievements & credentials state
  const [editAchievements, setEditAchievements] = useState<string[]>([]);
  const [editAchievementInput, setEditAchievementInput] = useState("");
  const [editIsBulkMode, setEditIsBulkMode] = useState(false);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from GitHub repository?`)) return;
    setDeletingId(id);
    await deleteExpertiseItem(id);
    setDeletingId(null);
    router.refresh();
  };

  const handleStartEdit = (item: any) => {
    const initialAchievements: string[] =
      Array.isArray(item.achievements) && item.achievements.length > 0
        ? item.achievements
        : Array.isArray(item.bullets) && item.bullets.length > 0
        ? item.bullets
        : item.desc
        ? item.desc.split("\n").map((l: string) => l.trim()).filter(Boolean)
        : [];

    setEditingItem({
      ...item,
      desc: item.desc || initialAchievements.join("\n"),
    });
    setEditAchievements(initialAchievements);
    setEditAchievementInput("");
    setEditIsBulkMode(false);
    setEditStatus(null);
  };

  const handleAddEditAchievement = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();

    const trimmed = editAchievementInput.trim();
    if (!trimmed) return;

    if (!editAchievements.includes(trimmed)) {
      setEditAchievements((prev) => [...prev, trimmed]);
    }
    setEditAchievementInput("");
  };

  const handleRemoveEditAchievement = (index: number) => {
    setEditAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditBulkChange = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    setEditAchievements(lines);
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

    const finalAchievements = [...editAchievements];
    if (editAchievementInput.trim() && !finalAchievements.includes(editAchievementInput.trim())) {
      finalAchievements.push(editAchievementInput.trim());
    }
    const desc = finalAchievements.join("\n");

    const res = await updateExpertiseItem(editingItem.id, {
      category,
      title,
      subtitle,
      year,
      desc,
      bullets: finalAchievements,
      achievements: finalAchievements,
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

                {/* Tenure Credentials & Achievements Badges */}
                {(() => {
                  const itemCredentials: string[] =
                    Array.isArray(item.achievements) && item.achievements.length > 0
                      ? item.achievements
                      : Array.isArray(item.bullets) && item.bullets.length > 0
                      ? item.bullets
                      : item.desc
                      ? item.desc.split("\n").map((l: string) => l.trim()).filter(Boolean)
                      : [];

                  if (itemCredentials.length > 0) {
                    return (
                      <div className="flex flex-col gap-2 mt-2.5 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-[#f4ddb8] bg-[#f4ddb8]/10 border border-[#f4ddb8]/20 px-2 py-0.5 rounded flex items-center gap-1">
                            <Award size={10} className="text-[#f4ddb8]" />
                            {itemCredentials.length} {itemCredentials.length === 1 ? "CREDENTIAL" : "CREDENTIALS"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {itemCredentials.map((ach: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] text-gray-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded flex items-center gap-1.5 hover:border-[var(--color-primary)]/40 transition-colors"
                            >
                              <span className="text-[#d36b54] text-[9px] font-bold">✓</span>
                              <span>{ach}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 italic">No credentials recorded</span>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="text-[10px] text-[#f4ddb8] hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 cursor-pointer"
                      >
                        <Plus size={11} />
                        <span>Add Credentials</span>
                      </button>
                    </div>
                  );
                })()}
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
          <div className="bg-[#0e0e12] rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 flex flex-col gap-5 border border-white/15 animate-in fade-in zoom-in-95 font-mono max-h-[90vh] overflow-y-auto">
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
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono"
                >
                  <option value="skills" className="bg-[#0e0e12]">Skills &amp; Architectural Pillars</option>
                  <option value="education" className="bg-[#0e0e12]">Education &amp; Academic Path (Timeline)</option>
                  <option value="experience" className="bg-[#0e0e12]">Work Experience &amp; Appointments (Timeline)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">Title / Designation *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono"
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
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono"
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
                  className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono"
                />
              </div>

              {/* ── TENURE ACHIEVEMENTS & CREDENTIALS BUILDER ── */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={13} className="text-[#f4ddb8]" />
                    <label className="text-[10px] uppercase tracking-[2px] text-[#f4ddb8] font-bold">
                      Tenure Achievements &amp; Credentials
                    </label>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-400">
                      {editAchievements.length} recorded
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditIsBulkMode(!editIsBulkMode)}
                    className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    {editIsBulkMode ? "Switch to badge view" : "Switch to multiline text"}
                  </button>
                </div>

                <p className="text-[10px] text-gray-400 font-light">
                  Add honors, awards, leadership titles, certificates earned, or major accomplishments during this tenure.
                </p>

                {!editIsBulkMode ? (
                  <div className="flex flex-col gap-2.5">
                    {/* Input row */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editAchievementInput}
                        onChange={(e) => setEditAchievementInput(e.target.value)}
                        onKeyDown={handleAddEditAchievement}
                        placeholder="Type an achievement and press Enter..."
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono placeholder:text-gray-600"
                      />
                      <button
                        type="button"
                        onClick={handleAddEditAchievement}
                        disabled={!editAchievementInput.trim()}
                        className="px-3.5 py-2.5 bg-white/[0.06] hover:bg-[var(--color-primary)] text-white disabled:opacity-30 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 border border-white/10"
                      >
                        <Plus size={13} />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Badges List */}
                    {editAchievements.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 p-2.5 bg-black/40 rounded-xl border border-white/[0.08] max-h-40 overflow-y-auto">
                        {editAchievements.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/15 text-[10px] text-gray-200"
                          >
                            <span className="text-[#d36b54] text-[9px] font-bold">✓</span>
                            <span>{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEditAchievement(idx)}
                              className="text-gray-500 hover:text-red-400 p-0.5 rounded transition-colors ml-1 cursor-pointer"
                              title="Remove achievement"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-500 italic p-2.5 bg-black/30 rounded-lg border border-dashed border-white/10">
                        No credentials recorded yet. Add one above or switch to multiline text.
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    rows={4}
                    value={editAchievements.join("\n")}
                    onChange={(e) => handleEditBulkChange(e.target.value)}
                    placeholder="Type or paste achievements, one per line..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] resize-y font-mono placeholder:text-gray-600"
                  />
                )}
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
