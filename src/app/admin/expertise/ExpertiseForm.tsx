"use client";

import { useState } from "react";
import { createExpertiseItem } from "./actions";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ExpertiseForm() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("skills");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string).trim();
    const year = (formData.get("year") as string).trim();
    const percentage = (formData.get("percentage") as string).trim();
    const subtitle = (formData.get("subtitle") as string)?.trim() || undefined;

    const res = await createExpertiseItem({
      category,
      title,
      subtitle,
      year,
      percentage,
      order: 0,
    });

    setLoading(false);

    if (res.success) {
      setStatusMessage({
        type: "success",
        text: `Committed "${title}" to GitHub Expertise-Repository!`,
      });
      form.reset();
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Failed to commit item to GitHub.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--color-border)] shadow-sm flex flex-col gap-4 rounded-lg">
      <div>
        <h3 className="font-serif text-lg text-[var(--color-text-dark)] uppercase">Add New Resume Item</h3>
        <p className="text-xs text-gray-500 font-light mt-0.5">
          Commits directly to <strong className="text-[var(--color-primary)]">Expertise-Repository</strong> on GitHub.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-md text-xs leading-relaxed flex items-start gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <div>{statusMessage.text}</div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Category</label>
        <select 
          name="category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white font-sans"
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
          placeholder={category === "skills" ? "e.g. UI / UX DESIGN" : category === "education" ? "e.g. BS Information Technology" : "e.g. Freelance Web Developer"} 
          className="border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          {category === "skills" ? "Proficiency Display (e.g. 95%)" : "Date Range / Years (e.g. 2023 - 2027 or Nov 2025)"}
        </label>
        <input 
          name="year" 
          required 
          placeholder={category === "skills" ? "95%" : "2023 - 2027"} 
          className="border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Progress Bar Width (%)</label>
        <input 
          name="percentage" 
          required 
          defaultValue={category === "skills" ? "90%" : "100%"} 
          placeholder="e.g. 95% or 100%" 
          className="border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
        <span className="text-[10px] text-gray-400">Controls the accent line width under the item.</span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          Subtitle / Institution (Optional)
        </label>
        <input 
          name="subtitle" 
          placeholder={category === "education" ? "e.g. Cor Jesu College" : category === "experience" ? "e.g. Tech Startup or Self-Employed" : "Optional notes"} 
          className="border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
      </div>

      <button
        disabled={loading}
        type="submit"
        className="mt-2 bg-[var(--color-primary)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] rounded hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Committing to GitHub...</span>
          </>
        ) : (
          "Save & Commit to GitHub"
        )}
      </button>
    </form>
  );
}
