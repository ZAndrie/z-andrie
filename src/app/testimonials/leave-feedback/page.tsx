import FeedbackForm from "./FeedbackForm"
import Link from "next/link"

export const metadata = {
  title: "Leave a Review | Z Andrie",
  description: "Share your experience working with Z Andrie.",
}

export default function LeaveFeedbackPage() {
  return (
    <div className="min-h-screen bg-[var(--color-light-bg)] pt-40 pb-32">
      <div className="w-[90%] md:w-[85%] max-w-[800px] mx-auto">
        <Link 
          href="/testimonials"
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 mb-8"
        >
          <span>←</span> Back to Testimonials
        </Link>
        <FeedbackForm />
      </div>
    </div>
  )
}
