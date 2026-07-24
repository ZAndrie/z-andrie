"use client"
import { useState } from "react"
import { UploadDropzone } from "@/utils/uploadthing"
import "@uploadthing/react/styles.css"
import { createProject } from "./actions"

export default function ProjectForm() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    await createProject({
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      subtitle: formData.get("subtitle") as string,
      projectUrl: formData.get("projectUrl") as string,
      imageUrl,
      order: 0,
    })
    setLoading(false)
    setImageUrl("")
    form.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--color-border)] shadow-sm flex flex-col gap-4">
      <h3 className="font-bold uppercase tracking-wider text-[14px]">Add New Project</h3>
      
      <div className="flex flex-col gap-1">
        <label className="text-[12px] uppercase text-gray-500">Project Image (Required)</label>
        {imageUrl ? (
          <div className="relative h-40 w-full bg-gray-100 border border-[var(--color-border)]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
             <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-3 py-1 uppercase shadow-md hover:bg-black transition-colors">Remove</button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
            <UploadDropzone
              endpoint="imageUploader"
              appearance={{
                container: "p-4 w-full cursor-pointer",
                label: "text-[12px] uppercase text-[var(--color-primary)] font-bold mb-1 hover:text-[var(--color-text-dark)]",
                allowedContent: "text-[10px] text-gray-400",
                button: "ut-uploading:cursor-not-allowed !bg-[#222222] !text-white !text-[10px] !uppercase !font-bold !tracking-widest !px-8 !py-2 !mt-4 !rounded-none !w-auto"
              }}
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setImageUrl(res[0].url)
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
            />
          </div>
        )}
      </div>

      <input name="title" required placeholder="Project Title (e.g. My Awesome Site)" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="category" required placeholder="Category (e.g. Web Design, Branding)" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="subtitle" required placeholder="Subtitle / Short Description" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="projectUrl" placeholder="Live Link (Optional)" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      
      <button disabled={loading || !imageUrl} type="submit" className="mt-2 bg-[var(--color-text-dark)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50">
        {loading ? "Saving..." : "Save Project"}
      </button>
    </form>
  )
}
