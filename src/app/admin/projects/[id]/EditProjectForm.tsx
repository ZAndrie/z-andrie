"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateProject } from "../actions";
import { GitHubProject } from "@/lib/github";

export default function EditProjectForm({ project }: { project: GitHubProject }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>(project.imageUrl || "");
  const [hidden, setHidden] = useState<boolean>(Boolean(project.hidden));
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
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
      const formData = new FormData(e.currentTarget);
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

      const res = await updateProject(project.id, {
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
          text: "Project updates committed directly to GitHub repository!",
        });
        setFile(null);
        setPreviewUrl("");
        router.refresh();
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to commit changes to GitHub.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const displayImage = previewUrl || imageUrlInput;

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 font-mono">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0e0e12]/95 border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col gap-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-primary)]/10 rounded-bl-3xl pointer-events-none" />

        <div>
          <div className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-[2px] mb-1">
            RECORD ID: {project.id}
          </div>
          <h3 className="font-stencil text-2xl text-white uppercase tracking-wider">
            MODIFY ENTRY SPECIFICATIONS
          </h3>
          <p className="text-xs text-gray-400 font-light mt-1">
            Target Record: <strong className="text-white">{project.title}</strong>
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-lg text-[11px] leading-relaxed flex items-start gap-2.5 ${
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

        {/* Project Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
            Project Cover Imagery
          </label>

          {displayImage ? (
            <div className="relative h-60 w-full bg-black border border-white/10 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayImage} alt="Cover Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  handleRemoveFile();
                  setImageUrlInput("");
                }}
                className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white text-[9px] font-bold px-3 py-1 uppercase tracking-wider rounded shadow transition-colors z-10"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="border border-dashed border-white/15 hover:border-[var(--color-primary)]/50 bg-black/40 hover:bg-black/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <UploadCloud size={28} className="text-gray-500 group-hover:text-[var(--color-primary)] mb-2 transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">
                  Upload Replacement Cover
                </span>
                <span className="text-[10px] text-gray-500 mt-0.5">PNG, JPG, or WEBP (Commits to GitHub)</span>
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
                placeholder="https://example.com/project-preview.png"
                className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Project Title *
            </label>
            <input
              name="title"
              defaultValue={project.title}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Category *
            </label>
            <input
              name="category"
              defaultValue={project.category}
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Mission Subtitle / Description *
            </label>
            <textarea
              name="subtitle"
              defaultValue={project.subtitle}
              required
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              Live Deployment URL (Optional)
            </label>
            <input
              name="projectUrl"
              type="url"
              defaultValue={project.projectUrl || ""}
              placeholder="https://myproject.vercel.app"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
              GitHub Repository URL (Optional)
            </label>
            <input
              name="githubUrl"
              type="url"
              defaultValue={project.githubUrl || ""}
              placeholder="https://github.com/ZAndrie/repository-name"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Visibility Setting */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Public Portfolio Visibility
              </span>
              <span className="text-[10px] text-gray-500">
                {hidden ? "Project is currently HIDDEN from the public portfolio." : "Project is VISIBLE in Stage 03 Production."}
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-primary)] rounded bg-black/60 border border-white/20 cursor-pointer"
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Hide Project
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Link
            href="/admin/projects"
            className="flex-1 bg-white/5 border border-white/10 text-gray-300 p-3.5 font-bold uppercase tracking-[2px] text-[11px] rounded-lg hover:bg-white/10 hover:text-white transition-colors text-center"
          >
            Abort / Cancel
          </Link>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 bg-[var(--color-primary)] hover:bg-[#d0350e] text-white p-3.5 font-bold uppercase tracking-[2px] text-[11px] rounded-lg shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>SAVING TO GITHUB...</span>
              </>
            ) : (
              "COMMIT CHANGES"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
