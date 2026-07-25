import prisma from "@/lib/prisma"
import Link from "next/link"
import EditTestimonialForm from "./EditTestimonialForm"
import { notFound } from "next/navigation"

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: params.id }
  })

  if (!testimonial) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/admin/testimonials"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 mb-4"
        >
          <span>←</span> Back to Testimonials
        </Link>
        <h1 className="text-2xl font-light text-[var(--color-text-dark)] tracking-wide">Edit Testimonial</h1>
      </div>

      <EditTestimonialForm testimonial={testimonial} />
    </div>
  )
}
