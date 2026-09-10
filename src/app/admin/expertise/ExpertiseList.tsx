"use client";

import { useState } from "react";
import { deleteExpertiseItem } from "./actions";
import { Trash2, Briefcase, GraduationCap, Wrench, Loader2 } from "lucide-react";

export default function ExpertiseList({ items = [] }: { items?: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from GitHub Portfolio-Content?`)) return;
    setDeletingId(id);
    await deleteExpertiseItem(id);
    setDeletingId(null);
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
              className="border border-[var(--color-border)] bg-white p-4 rounded-lg flex justify-between items-center group hover:shadow-sm transition-all"
            >
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
                {!isSkills && (
                  <div className="w-48 h-[3px] bg-gray-100 mt-2 rounded overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)]"
                      style={{ width: item.percentage || "100%" }}
                    />
                  </div>
                )}
              </div>

              <div>
                <button
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 disabled:opacity-50"
                  title="Delete Item"
                >
                  {deletingId === item.id ? (
                    <Loader2 size={16} className="animate-spin text-red-500" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
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
    </div>
  );
}
