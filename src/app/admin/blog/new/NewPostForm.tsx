"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { UploadButton } from "@/utils/uploadthing";

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
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl">
      <div className="bg-white p-6 rounded-md border border-[var(--color-border)] flex flex-col gap-6">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Post Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-[var(--color-border)] rounded bg-[var(--color-light-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="E.g., My Awesome New Project"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Short Summary
          </label>
          <textarea
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 border border-[var(--color-border)] rounded bg-[var(--color-light-bg)] text-sm focus:outline-none focus:border-[var(--color-primary)] h-24 resize-none"
            placeholder="A brief summary of this post..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Cover Image
          </label>
          {coverImage ? (
            <div className="relative w-full h-[200px] rounded overflow-hidden mb-2">
              <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => setCoverImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded text-xs font-bold"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-gray-300 rounded bg-gray-50 flex justify-center">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    setCoverImage(res[0].url);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-[var(--color-border)]">
        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6">
          Post Content
        </label>
        <div className="min-h-[400px]">
          <ClassicEditor value={content} onChange={setContent} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-md border border-[var(--color-border)] flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-bold text-[var(--color-text-dark)] uppercase tracking-wide">
            Publish immediately
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-primary)] text-white px-8 py-3 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Post"}
        </button>
      </div>
    </form>
  );
}
