import Link from "next/link"
import NewTestimonialForm from "./NewTestimonialForm"

export default function NewTestimonialPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/admin/testimonials"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 mb-4"
        >
          <span>←</span> Back to Testimonials
        </Link>
        <h1 className="text-2xl font-light text-[var(--color-text-dark)] tracking-wide">Add New Testimonial</h1>
      </div>

      <NewTestimonialForm />
    </div>
  )
}
