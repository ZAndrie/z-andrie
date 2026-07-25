"use client"

import { useState } from "react"
import { UploadButton } from "@/utils/uploadthing"
import Image from "next/image"
import { submitPublicTestimonial } from "@/app/admin/testimonials/actions"

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [error, setError] = useState("")
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await submitPublicTestimonial({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        content: formData.get("content") as string,
        imageUrl: imageUrl || undefined,
        rating: rating,
      })
      
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white p-10 md:p-16 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h3 className="text-2xl font-serif text-[var(--color-text-dark)] mb-4">Thank you for your feedback!</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your review has been successfully submitted and is pending approval. I truly appreciate you taking the time to share your experience.
        </p>
        <a 
          href="/testimonials"
          className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors"
        >
          Return to Testimonials
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-10">
        <h2 className="text-2xl font-serif text-[var(--color-text-dark)] mb-2">Leave a Review</h2>
        <p className="text-sm text-gray-500">Share your experience working with me. Your feedback means a lot!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Your Name
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
              Your Role / Company
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
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="text-4xl focus:outline-none transition-colors"
                style={{
                  color: (hoverRating || rating) >= star ? "#fbbf24" : "#e5e7eb"
                }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
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
            Your Review
          </label>
          <textarea 
            name="content" 
            required 
            rows={5}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all text-sm resize-none"
            placeholder="Tell us about your experience..."
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            Profile Photo (Optional)
          </label>
          
          <div className="mt-2 flex items-start gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
            {imageUrl ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                <Image src={imageUrl} alt="Uploaded avatar" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity"
                >
                  REMOVE
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-300 flex-shrink-0">
                <span className="text-xs font-bold uppercase text-center leading-tight">No<br/>Photo</span>
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
                  alert(`Upload Error: ${error.message}`)
                }}
                className="ut-button:bg-[var(--color-primary)] ut-button:ut-readying:bg-[var(--color-primary)]/50 ut-button:text-xs ut-button:font-bold ut-button:tracking-wider ut-button:w-auto ut-button:px-6 ut-button:py-2 ut-button:h-auto"
              />
              <p className="text-[11px] text-gray-500 mt-2">A square image works best. This will be shown next to your review.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[var(--color-text-dark)] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  )
}
