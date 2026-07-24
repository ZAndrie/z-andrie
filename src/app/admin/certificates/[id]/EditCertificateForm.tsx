"use client"
import { useState } from "react"
import { UploadDropzone } from "@/utils/uploadthing"
import "@uploadthing/react/styles.css"
import { updateCertificate } from "../actions"
import { useRouter } from "next/navigation"

export default function EditCertificateForm({ certificate }: { certificate: any }) {
  const [imageUrl, setImageUrl] = useState<string>(certificate.imageUrl || "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await updateCertificate(certificate.id, {
      title: formData.get("title") as string,
      issuer: formData.get("issuer") as string,
      date: formData.get("date") as string,
      imageUrl,
    })
    setLoading(false)
    router.push("/admin/certificates")
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--color-border)] shadow-sm flex flex-col gap-4 max-w-2xl mx-auto">
      <h3 className="font-bold uppercase tracking-wider text-[14px]">Edit Certificate</h3>
      
      <div className="flex flex-col gap-1">
        <label className="text-[12px] uppercase text-gray-500">Certificate Image (Required)</label>
        {imageUrl ? (
          <div className="relative h-60 w-full bg-gray-100 border border-[var(--color-border)] overflow-hidden">
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

      <input name="title" defaultValue={certificate.title} required placeholder="Certificate Title" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="issuer" defaultValue={certificate.issuer} required placeholder="Issuer / Organization" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      <input name="date" defaultValue={certificate.date} required placeholder="Date Issued" className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" />
      
      <div className="flex gap-4 mt-2">
        <button type="button" onClick={() => router.push("/admin/certificates")} className="flex-1 bg-gray-100 text-[var(--color-text-dark)] p-4 font-bold uppercase tracking-[2px] text-[11px] hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button disabled={loading || !imageUrl} type="submit" className="flex-1 bg-[var(--color-text-dark)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Update Certificate"}
        </button>
      </div>
    </form>
  )
}
