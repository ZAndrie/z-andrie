"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { UploadButton } from "@/utils/uploadthing";
import { Loader2 } from "lucide-react";

const ClassicEditor = dynamic(() => import("@/components/admin/ClassicEditor"), { ssr: false });

export default function NewPostForm() {
  const router = useRouter();
  const [editorType] = useState<"html" | "json">("html");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage,
          published,
          editorType,
        }),
      });

      if (response.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        const error = await response.json();
        alert("Error saving post: " + error.message);
      }
    } catch {
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl font-mono">
      <div className="bg-[#0e0e12]/95 p-6 rounded-xl border border-white/10 flex flex-col gap-5 shadow-xl">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-2">
            Post Title / Header
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-white/10 rounded-lg bg-black/60 text-white font-mono text-xs focus:outline-none focus:border-[var(--color-primary)] placeholder:text-gray-600"
            placeholder="e.g. Architectural Overview: Next.js 15 & Three.js"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-2">
            Field Excerpt / Summary
          </label>
          <textarea
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 border border-white/10 rounded-lg bg-black/60 text-white font-mono text-xs focus:outline-none focus:border-[var(--color-primary)] h-24 resize-none placeholder:text-gray-600"
            placeholder="A brief high-level overview of the devlog entry..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-2">
            Cover Imagery
          </label>
          {coverImage ? (
            <div className="relative w-full h-[220px] rounded-lg overflow-hidden border border-white/10 mb-2 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Reset Image
              </button>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-white/15 rounded-xl bg-black/40 flex justify-center">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    setCoverImage(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload Error: ${error.message}`);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0e0e12]/95 p-6 rounded-xl border border-white/10 shadow-xl">
        <label className="block text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-4">
          Article Body / Transmission Content
        </label>
        <div className="min-h-[400px] text-white">
          <ClassicEditor value={content} onChange={setContent} />
        </div>
      </div>

      <div className="bg-[#0e0e12]/95 p-6 rounded-xl border border-white/10 flex items-center justify-between shadow-xl">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-primary)] rounded bg-black/60 border border-white/20"
          />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Broadcast &amp; Publish Immediately
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-primary)] hover:bg-[#d0350e] text-white px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-[2px] shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>COMMITTING...</span>
            </>
          ) : (
            "PUBLISH DEVLOG"
          )}
        </button>
      </div>
    </form>
  );
}
