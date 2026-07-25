"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadButton } from "@/utils/uploadthing"
import Image from "next/image"
import { createTestimonial } from "../actions"

export default function NewTestimonialForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [evidenceUrl, setEvidenceUrl] = useState<string>("")
  const [error, setError] = useState("")
  const [rating, setRating] = useState(5)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await createTestimonial({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        content: formData.get("content") as string,
        imageUrl: imageUrl || undefined,
        evidenceUrl: evidenceUrl || undefined,
        isApproved: true, // Manually added are approved by default
        rating: rating,
        order: 0,
      })
      
      router.push("/admin/testimonials")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Client Name
            </label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Role / Company
            </label>
            <input 
              type="text" 
              name="role" 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm"
              placeholder="e.g. CEO at TechCorp"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Feedback Message
          </label>
          <textarea 
            name="content" 
            required 
            rows={5}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm resize-none"
            placeholder="Write the client's testimonial here..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-3xl focus:outline-none transition-colors"
                style={{
                  color: rating >= star ? "#fbbf24" : "#e5e7eb"
                }}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
            <span className="ml-4 text-xs font-bold text-gray-400 uppercase">{rating} / 5</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Client Photo / Avatar (Optional)
          </label>
          
          <div className="mt-2 flex items-start gap-6">
            {imageUrl ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                <Image src={imageUrl} alt="Uploaded avatar" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                <span className="text-xs font-bold uppercase">No Image</span>
              </div>
            )}
            
            <div className="flex-1">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setImageUrl(res[0].url)
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`)
                }}
                className="ut-button:bg-[var(--color-primary)] ut-button:ut-readying:bg-[var(--color-primary)]/50 ut-button:text-sm ut-button:font-bold ut-button:tracking-wider ut-button:w-auto ut-button:px-6"
              />
              <p className="text-xs text-gray-400 mt-2">Recommended: Square image (e.g. 400x400px)</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Proof / Evidence (Internal Use Only)
          </label>
          
          <div className="mt-2 flex items-start gap-6 bg-yellow-50 p-6 rounded-lg border border-yellow-100">
            {evidenceUrl ? (
              <div className="relative w-20 h-20 overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                <Image src={evidenceUrl} alt="Evidence" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setEvidenceUrl("")}
                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 bg-white border border-yellow-200 flex items-center justify-center text-yellow-600 flex-shrink-0">
                <span className="text-xs font-bold uppercase text-center leading-tight">No<br/>Proof</span>
              </div>
            )}
            
            <div className="flex-1">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setEvidenceUrl(res[0].url)
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload Error: ${error.message}`)
                }}
                className="ut-button:bg-yellow-600 ut-button:ut-readying:bg-yellow-600/50 ut-button:text-xs ut-button:font-bold ut-button:tracking-wider ut-button:w-auto ut-button:px-6 ut-button:py-2 ut-button:h-auto"
              />
              <p className="text-[11px] text-yellow-700 mt-2">Upload a screenshot of the client's message or email for validation.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[var(--color-text-dark)] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Testimonial"}
          </button>
        </div>
      </form>
    </div>
  )
}
