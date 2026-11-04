"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExpertiseItem } from "./actions";
import { CheckCircle2, AlertCircle, Loader2, PlusCircle, X, Award, Plus, Trash2 } from "lucide-react";

export default function ExpertiseForm({
  onClose,
  onSuccess,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("education");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Tenure Achievements & Credentials state
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);

  const handleAddAchievement = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();

    const trimmed = achievementInput.trim();
    if (!trimmed) return;

    if (!achievements.includes(trimmed)) {
      setAchievements((prev) => [...prev, trimmed]);
    }
    setAchievementInput("");
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkChange = (text: string) => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    setAchievements(lines);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string).trim();
    const year = (formData.get("year") as string)?.trim() || "";
    const subtitle = (formData.get("subtitle") as string)?.trim() || undefined;

    // Use current achievements list
    const finalAchievements = [...achievements];
    if (achievementInput.trim() && !finalAchievements.includes(achievementInput.trim())) {
      finalAchievements.push(achievementInput.trim());
    }

    const desc = finalAchievements.join("\n");

    const res = await createExpertiseItem({
      category,
      title,
      subtitle,
      year,
      desc,
      bullets: finalAchievements,
      achievements: finalAchievements,
      percentage: "100%",
      order: 0,
    });

    setLoading(false);

    if (res.success) {
      setStatusMessage({
        type: "success",
        text: `Committed "${title}" with ${finalAchievements.length} tenure credentials to GitHub!`,
      });
      form.reset();
      setAchievements([]);
      setAchievementInput("");
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
      className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-5 font-mono relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/10 rounded-bl-3xl pointer-events-none" />

      {/* Header Deck */}
      <div className="flex items-start justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[2px] text-gray-500 mb-1">
            <PlusCircle size={13} className="text-[var(--color-primary)]" />
            <span>DISPATCH // NEW_TRAJECTORY_ENTRY</span>
          </div>
          <h3 className="font-stencil text-2xl text-white uppercase tracking-wider">
            ADD RESUME / TENURE ENTRY
          </h3>
          <p className="text-[11px] text-gray-400 font-light mt-0.5">
            Add academic programs, career tenures, and credentials with direct sync to <code className="text-white bg-black/40 px-1 py-0.5 rounded">expertise/expertise.json</code>.
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

      {/* Primary Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
            Category *
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[var(--color-primary)] font-mono"
          >
            <option value="education" className="bg-[#0e0e12]">Education &amp; Academic Path (Timeline)</option>
            <option value="experience" className="bg-[#0e0e12]">Work Experience &amp; Appointments (Timeline)</option>
            <option value="skills" className="bg-[#0e0e12]">Skills &amp; Architectural Pillars</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
            Title / Program / Role *
          </label>
          <input
            name="title"
            required
            placeholder={
              category === "education"
                ? "e.g. Senior High School"
                : category === "experience"
                ? "e.g. Student Assistant"
                : "e.g. Quality Assurance"
            }
            className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
            Tenure Date / Years *
          </label>
          <input
            name="year"
            required={category !== "skills"}
            placeholder="e.g. 2021-2023 or 2023-Present"
            className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Subtitle / Institution */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-[2px] text-gray-400 font-bold">
          {category === "education"
            ? "Institution / School (e.g. Cor Jesu College)"
            : category === "experience"
            ? "Company / Organization / Department"
            : "Discipline Subtitle / Core Technologies"}
        </label>
        <input
          name="subtitle"
          placeholder={
            category === "education"
              ? "e.g. Cor Jesu College"
              : category === "experience"
              ? "e.g. IT Department, Cor Jesu College"
              : "e.g. Manual Testing, Cypress, Test Matrices"
          }
          className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      {/* ── TENURE CREDENTIALS & ACHIEVEMENTS BUILDER ── */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={14} className="text-[#f4ddb8]" />
            <label className="text-[11px] uppercase tracking-[2px] text-[#f4ddb8] font-bold">
              Tenure Achievements &amp; Credentials
            </label>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-400">
              {achievements.length} recorded
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsBulkMode(!isBulkMode)}
            className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
          >
            {isBulkMode ? "Switch to badge view" : "Switch to multiline text"}
          </button>
        </div>

        <p className="text-[11px] text-gray-400 font-light">
          Add honors, awards, leadership titles, certificates earned, or major accomplishments during this tenure (e.g. <em>&quot;Graduated with Academic Honors&quot;</em>, <em>&quot;Student Council Officer&quot;</em>, <em>&quot;Maintained 99% Lab Uptime&quot;</em>).
        </p>

        {!isBulkMode ? (
          <div className="flex flex-col gap-3">
            {/* Input row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyDown={handleAddAchievement}
                placeholder="Type an achievement or credential and press Enter..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] font-mono"
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                disabled={!achievementInput.trim()}
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-[var(--color-primary)] text-white hover:text-white disabled:opacity-30 rounded-lg text-[11px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-white/10"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {/* Badges List */}
            {achievements.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-black/40 rounded-xl border border-white/[0.08] min-h-[50px]">
                {achievements.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/15 text-[11px] text-gray-200 group hover:border-[var(--color-primary)]/50 transition-colors"
                  >
                    <span className="text-[#d36b54] text-[10px]">✓</span>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(idx)}
                      className="text-gray-500 hover:text-red-400 p-0.5 rounded transition-colors ml-1"
                      title="Remove achievement"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-gray-500 italic p-3 bg-black/30 rounded-lg border border-dashed border-white/10">
                No credentials added yet. Type an achievement above and click Add (or switch to multiline text).
              </div>
            )}
          </div>
        ) : (
          <textarea
            rows={4}
            value={achievements.join("\n")}
            onChange={(e) => handleBulkChange(e.target.value)}
            placeholder="Type or paste achievements, one per line:&#10;Graduated with Academic Honors&#10;Student Assistant of the Year&#10;Lead Developer for Campus Attendance System"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] resize-y font-mono"
          />
        )}
      </div>

      {/* Action Footer */}
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
