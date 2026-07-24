"use client"
import { useState } from "react"
import { UploadDropzone } from "@/utils/uploadthing"
import "@uploadthing/react/styles.css"
import { createCertificate } from "./actions"

export default function NewCertificateForm() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    await createCertificate({
      title: formData.get("title") as string,
      issuer: formData.get("issuer") as string,
      date: formData.get("date") as string,
      imageUrl,
      order: 0,
    })
    setLoading(false)
    setImageUrl("")
    form.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--color-border)] shadow-sm flex flex-col gap-4">
      <h3 className="font-bold uppercase tracking-wider text-[14px]">Add New Certificate</h3>
      
      <div className="flex flex-col gap-1">
        <label className="text-[12px] uppercase text-gray-500">Certificate Image (Required)</label>
        {imageUrl ? (
          <div className="relative h-40 w-full bg-gray-100 border border-[var(--color-border)] overflow-hidden">
             {imageUrl.includes("type=pdf") ? (
               <iframe src={imageUrl} className="w-full h-full object-cover" title="PDF Preview" />
             ) : (
               /* eslint-disable-next-line @next/next/no-img-element */
               <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
             )}
             <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-3 py-1 uppercase shadow-md hover:bg-black transition-colors z-10">Remove</button>
          </div>
        ) : (
          <div className="border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
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
                  const isPdf = res[0].name.toLowerCase().endsWith(".pdf")
                  setImageUrl(res[0].url + (isPdf ? "?type=pdf" : ""))
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`)
              }}
            />
          </div>
        )}
      </div>

      <input name="title" required placeholder="Certificate Title (e.g. AWS Certified)" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="issuer" required placeholder="Issuer / Organization (e.g. Amazon Web Services)" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="date" required placeholder="Date Issued (e.g. 2024 or Oct 2024)" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      
      <button disabled={loading || !imageUrl} type="submit" className="mt-2 bg-[var(--color-text-dark)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50">
        {loading ? "Saving..." : "Save Certificate"}
      </button>
    </form>
  )
}
