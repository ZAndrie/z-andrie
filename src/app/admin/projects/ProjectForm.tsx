"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, PlusCircle, X, EyeOff } from "lucide-react";
import { createProject } from "./actions";

export default function ProjectForm({
  onSuccess,
  onClose,
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setImageUrlInput("");
      setStatusMessage(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const title = (formData.get("title") as string).trim();
      const category = (formData.get("category") as string).trim();
      const subtitle = (formData.get("subtitle") as string).trim();
      const projectUrl = (formData.get("projectUrl") as string).trim();
      const githubUrl = (formData.get("githubUrl") as string).trim();

      let fileBase64: string | undefined = undefined;
      let fileName: string | undefined = undefined;

      if (file) {
        fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        fileName = file.name;
      }

      const res = await createProject({
        title,
        category,
        subtitle,
        projectUrl: projectUrl || undefined,
        githubUrl: githubUrl || undefined,
        imageUrl: imageUrlInput || undefined,
        fileBase64,
        fileName,
        hidden,
      });

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "Project committed directly to GitHub repository!",
        });
        setFile(null);
        setPreviewUrl("");
        setImageUrlInput("");
        form.reset();
        router.refresh();
        onSuccess?.();
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to commit project to GitHub.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected network error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const effectiveImage = previewUrl || imageUrlInput;

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
            <span>DISPATCH // NEW_ENTRY</span>
          </div>
          <h3 className="font-stencil text-2xl text-white uppercase tracking-wider">
            REGISTER PROJECT
          </h3>
          <p className="text-[11px] text-gray-400 font-light mt-0.5">
            Commits directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">projects.json</code> on GitHub.
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

      {/* Grid: Image and inputs side-by-side on larger displays to stay compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cover Image Upload Area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
            Cover Imagery
          </label>

          {effectiveImage ? (
            <div className="relative h-44 w-full bg-black border border-white/10 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={effectiveImage} alt="Cover Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  handleRemoveFile();
                  setImageUrlInput("");
                }}
                className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider rounded shadow transition-colors z-10"
              >
                Reset Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="border border-dashed border-white/15 hover:border-[var(--color-primary)]/50 bg-black/40 hover:bg-black/60 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <UploadCloud size={22} className="text-gray-500 group-hover:text-[var(--color-primary)] mb-1.5 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">
                  Select Cover Image
                </span>
                <span className="text-[9px] text-gray-500 mt-0.5">PNG, JPG, or WEBP</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-2 text-[9px] uppercase tracking-widest text-gray-600 font-semibold">Or Image URL</span>
                <div className="flex-grow border-t border-white/10" />
              </div>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  if (file) handleRemoveFile();
                }}
                placeholder="https://images.unsplash.com/..."
                className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}

          {/* Visibility Checkbox */}
          <div className="mt-3 p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff size={14} className={hidden ? "text-amber-400" : "text-gray-500"} />
              <label htmlFor="hide-checkbox" className="text-[10px] font-bold uppercase tracking-wider text-gray-300 cursor-pointer">
                Hide from Public Portfolio
              </label>
            </div>
            <input
              id="hide-checkbox"
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-primary)] rounded bg-black/60 border border-white/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Project Title *
            </label>
            <input
              name="title"
              required
              placeholder="e.g. Modern E-Commerce Platform"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Discipline / Category *
            </label>
            <input
              name="category"
              required
              placeholder="e.g. Full Stack, Web Systems, PHP / Blade"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Mission Objective / Subtitle *
            </label>
            <textarea
              name="subtitle"
              required
              rows={2}
              placeholder="Key capabilities, architectural stack, and features..."
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
                Live URL (Optional)
              </label>
              <input
                name="projectUrl"
                type="url"
                placeholder="https://..."
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
                GitHub URL (Optional)
              </label>
              <input
                name="githubUrl"
                type="url"
                placeholder="https://github.com/..."
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
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
              <span>COMMITTING TO GITHUB...</span>
            </>
          ) : (
            "DEPLOY PROJECT ENTRY"
          )}
        </button>
      </div>
    </form>
  );
}
