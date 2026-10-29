"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteExpertiseItem, updateExpertiseItem } from "./actions";
import { Trash2, Briefcase, GraduationCap, Wrench, Loader2, Pencil, X, Check } from "lucide-react";

export default function ExpertiseList({ items = [] }: { items?: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editStatus, setEditStatus] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from GitHub Portfolio-Content?`)) return;
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
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
        <div className="flex items-center gap-2">
          <div className="text-[var(--color-primary)]">{icon}</div>
          <h4 className="font-bold uppercase tracking-widest text-[12px] text-[var(--color-text-dark)]">
            {title} ({data.length})
          </h4>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <div className="text-[12px] text-gray-400 italic py-2 bg-gray-50/50 px-4 rounded border border-dashed border-gray-200">
            No entries in this category yet.
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="border border-[var(--color-border)] bg-white p-4 rounded-lg flex flex-col gap-2 group hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-bold text-[14px] uppercase text-[var(--color-text-dark)]">
                      {item.title}
                    </span>
                    {!isSkills && item.year && (
                      <span className="text-[11px] text-[var(--color-primary)] font-bold">
                        {item.year}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <span className="text-[12px] text-gray-500 italic font-light">{item.subtitle}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors rounded hover:bg-orange-50"
                    title="Edit Item & Accomplishments"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 disabled:opacity-50"
                    title="Delete Item"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={15} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Optional Description / Accomplishments Display */}
              {item.bullets && item.bullets.length > 0 ? (
                <ul className="text-[12px] text-gray-600 pl-4 border-l-2 border-gray-100 flex flex-col gap-1 mt-1">
                  {item.bullets.map((b: string, idx: number) => (
                    <li key={idx} className="list-disc list-inside">
                      {b}
                    </li>
                  ))}
                </ul>
              ) : item.desc ? (
                <p className="text-[12px] text-gray-600 pl-3 border-l-2 border-gray-100 mt-1 italic">
                  {item.desc}
                </p>
              ) : (
                <span className="text-[11px] text-gray-300 font-mono italic">
                  No description provided (optional)
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col relative">
      {/* GitHub Repository Status Banner */}
      <div className="mb-8 p-5 bg-white border border-[var(--color-border)] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-[var(--color-text-dark)] text-xs uppercase tracking-wider">
              Connected to GitHub
            </h4>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Synced with <strong className="text-[var(--color-primary)] font-medium">ZAndrie/portfolio-contents (expertise/)</strong>
            </p>
          </div>
        </div>
        <a
          href="https://github.com/ZAndrie/portfolio-contents/tree/main/expertise"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-black transition-colors"
        >
          Open Repo ↗
        </a>
      </div>

      {renderSection("Skills", skills, <Wrench size={16} />, true)}
      {renderSection("Education & Training", education, <GraduationCap size={16} />)}
      {renderSection("Work Experience", experience, <Briefcase size={16} />)}

      {/* Edit Modal Dialog */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col gap-4 border border-[var(--color-border)] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h3 className="font-serif text-lg text-[var(--color-text-dark)] uppercase">
                Edit Resume Item
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X size={18} />
              </button>
            </div>

            {editStatus && (
              <div
                className={`p-3 rounded text-xs flex items-center gap-2 ${
                  editStatus.includes("success")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {editStatus.includes("success") && <Check size={14} className="text-green-600" />}
                <span>{editStatus}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Category</label>
                <select
                  name="category"
                  defaultValue={editingItem.category}
                  className="border border-[var(--color-border)] rounded p-2.5 text-sm bg-white"
                >
                  <option value="skills">Skills</option>
                  <option value="education">Education &amp; Training</option>
                  <option value="experience">Experience</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Title / Name</label>
                <input
                  name="title"
                  required
                  defaultValue={editingItem.title}
                  className="border border-[var(--color-border)] rounded p-2.5 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  Date Range / Years (Optional)
                </label>
                <input
                  name="year"
                  defaultValue={editingItem.year || ""}
                  placeholder="e.g. 2021-2023 or 2023-Present"
                  className="border border-[var(--color-border)] rounded p-2.5 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  School / Company / Subtitle (Optional)
                </label>
                <input
                  name="subtitle"
                  defaultValue={editingItem.subtitle || ""}
                  placeholder="e.g. Cor Jesu College"
                  className="border border-[var(--color-border)] rounded p-2.5 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                    Description / Key Accomplishments (Optional)
                  </label>
                  <span className="text-[10px] text-gray-400 font-mono">Optional</span>
                </div>
                <p className="text-[11px] text-gray-400 font-light">
                  Separate each accomplishment onto a new line to render as bullet points. If left empty, no bullet points will appear.
                </p>
                <textarea
                  name="desc"
                  rows={4}
                  defaultValue={editingItem.desc}
                  placeholder="Leave blank for no bullet points, or enter accomplishments one per line."
                  className="border border-[var(--color-border)] rounded p-2.5 text-sm font-sans resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)] mt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving to GitHub...</span>
                    </>
                  ) : (
                    "Save Changes"
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
