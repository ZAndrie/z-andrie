import Testimonials from "@/components/Testimonials";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimonials | Z Andrie",
  description: "Read what clients have to say about Z Andrie.",
}

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <>
      <div className="absolute top-[120px] right-[5%] md:right-[8%] z-10">
        <Link 
          href="/testimonials/leave-feedback"
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors shadow-sm"
        >
          Leave a Review
        </Link>
      </div>
      <Testimonials testimonials={testimonials} />
    </>
  );
}
