"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateProject } from "../actions";
import { GitHubProject } from "@/lib/github";

export default function EditProjectForm({ project }: { project: GitHubProject }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrlInput, setImageUrlInput] = useState<string>(project.imageUrl || "");
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
        projectUrl,
        githubUrl: githubUrl || project.githubUrl,
        imageUrl: fileBase64 ? undefined : (imageUrlInput.trim() || project.imageUrl),
        fileName,
        fileBase64,
        order: project.order,
      });

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully updated "${title}"! Saved to GitHub projects/projects.json.`,
        });
        setTimeout(() => {
          router.push("/admin/projects");
          router.refresh();
        }, 800);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update project on GitHub.",
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
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[var(--color-primary)] transition-colors self-start"
      >
        <ArrowLeft size={14} /> Back to Projects List
      </Link>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-[var(--color-border)] shadow-sm flex flex-col gap-5 rounded-lg">
        <div>
          <h3 className="font-serif text-2xl text-[var(--color-text-dark)] uppercase">Edit Project</h3>
          <p className="text-xs text-gray-500 font-light mt-1">
            Updating: <strong className="text-[var(--color-text-dark)]">{project.title}</strong> ({project.id})
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

        {/* Project Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
            Project Cover Image
          </label>

          {displayImage ? (
            <div className="relative h-60 w-full bg-gray-100 border border-[var(--color-border)] rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayImage} alt="Uploaded" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  handleRemoveFile();
                  setImageUrlInput("");
                }}
                className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded shadow hover:bg-black transition-colors z-10"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] bg-gray-50 hover:bg-gray-100/80 rounded p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
                <UploadCloud size={28} className="text-gray-400 group-hover:text-[var(--color-primary)] mb-2 transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 group-hover:text-[var(--color-primary)] transition-colors">
                  Upload Replacement Image
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, or WEBP (Commits to GitHub)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="flex-shrink mx-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Or Image URL</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  if (file) handleRemoveFile();
                }}
                placeholder="https://example.com/project-preview.png"
                className="border border-[var(--color-border)] rounded p-2.5 text-xs focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Project Title *
            </label>
            <input
              name="title"
              defaultValue={project.title}
              required
              className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Category *
            </label>
            <input
              name="category"
              defaultValue={project.category}
              required
              className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Subtitle / Short Description *
            </label>
            <textarea
              name="subtitle"
              defaultValue={project.subtitle}
              required
              rows={3}
              className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Live Deployment URL (Optional)
            </label>
            <input
              name="projectUrl"
              type="url"
              defaultValue={project.projectUrl || ""}
              placeholder="https://myproject.vercel.app"
              className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              GitHub Repository URL (Optional)
            </label>
            <input
              name="githubUrl"
              type="url"
              defaultValue={project.githubUrl || ""}
              placeholder="https://github.com/ZAndrie/repository-name"
              className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Link
            href="/admin/projects"
            className="flex-1 bg-gray-100 text-[var(--color-text-dark)] p-4 font-bold uppercase tracking-[2px] text-[11px] rounded hover:bg-gray-200 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            disabled={loading}
            type="submit"
            className="flex-1 bg-[var(--color-text-dark)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] rounded hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving to GitHub...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

