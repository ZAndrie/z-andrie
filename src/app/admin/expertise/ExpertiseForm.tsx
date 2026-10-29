"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExpertiseItem } from "./actions";
import { CheckCircle2, AlertCircle, Loader2, PlusCircle, X } from "lucide-react";

export default function ExpertiseForm({
  onClose,
  onSuccess,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
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
    const year = (formData.get("year") as string)?.trim() || "";
    const subtitle = (formData.get("subtitle") as string)?.trim() || undefined;
    const desc = (formData.get("desc") as string)?.trim() || "";
    const bullets = desc
      ? desc
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

    const res = await createExpertiseItem({
      category,
      title,
      subtitle,
      year,
      desc,
      bullets,
      percentage: "100%",
      order: 0,
    });

    setLoading(false);

    if (res.success) {
      setStatusMessage({
        type: "success",
        text: `Committed "${title}" to GitHub Portfolio-Content!`,
      });
      form.reset();
      router.refresh();
      onSuccess?.();
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Failed to commit item to GitHub.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-4 font-mono relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-primary)]/10 rounded-bl-3xl pointer-events-none" />

      <div className="flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[2px] text-gray-500 mb-1">
            <PlusCircle size={13} className="text-[var(--color-primary)]" />
            <span>DISPATCH // NEW_MILESTONE</span>
          </div>
          <h3 className="font-stencil text-2xl text-white uppercase tracking-wider">
            ADD RESUME ENTRY
          </h3>
          <p className="text-[11px] text-gray-400 font-light mt-0.5">
            Direct sync with <code className="text-white bg-black/40 px-1 py-0.5 rounded">expertise/expertise.json</code>.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            title="Close Form"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-[11px] leading-relaxed flex items-start gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/10 text-red-300 border border-red-500/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          )}
          <div>{statusMessage.text}</div>
        </div>
      )}

      {/* Grid: 2 columns to stay compact and eliminate vertical height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
              Category
            </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono"
            >
              <option value="skills" className="bg-[#0e0e12]">Skills (Stage 04 Architectural Pillars)</option>
              <option value="education" className="bg-[#0e0e12]">Education &amp; Training (Stage 04 Timeline)</option>
              <option value="experience" className="bg-[#0e0e12]">Experience (Stage 04 Timeline)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
              Title / Designation *
            </label>
            <input
              name="title"
              required
              placeholder={category === "skills" ? "e.g. QUALITY ASSURANCE" : category === "education" ? "e.g. Senior High School" : "e.g. Student Assistant"}
              className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {category !== "skills" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
                Timeline / Years *
              </label>
              <input
                name="year"
                required={category !== "skills"}
                placeholder="e.g. 2021-2023 or 2023-2027"
                className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
              {category === "skills" ? "Tools / Subtitle (Optional)" : category === "education" ? "Institution (Optional)" : "Organization (Optional)"}
            </label>
            <input
              name="subtitle"
              placeholder={category === "skills" ? "e.g. Manual Testing, Automation, Cypress" : "e.g. Cor Jesu College"}
              className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
              Accomplishments / Bullets (Optional)
            </label>
            <span className="text-[9px] text-gray-500 font-mono">OPTIONAL</span>
          </div>
          <p className="text-[10px] text-gray-500 font-light">
            Optional bullets (1 per line). If blank, no accomplishment bullets appear on the milestone.
          </p>
          <textarea
            name="desc"
            rows={5}
            placeholder={
              category === "skills"
                ? "Focus on unit testing, usability, and end-to-end verification."
                : "Specialized in computer systems diagnostics.\nAssisted students and faculty with lab machines."
            }
            className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] resize-none flex-1"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 mt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
        )}
        <button
          disabled={loading}
          type="submit"
          className="bg-[var(--color-primary)] hover:bg-[#d0350e] text-white px-6 py-3 font-bold uppercase tracking-[2px] text-[11px] rounded-lg shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>COMMITTING...</span>
            </>
          ) : (
            "COMMIT TO GITHUB"
          )}
        </button>
      </div>
    </form>
  );
}
