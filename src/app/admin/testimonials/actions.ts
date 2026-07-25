"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitPublicTestimonial(data: { name: string, role: string, content: string, imageUrl?: string, rating?: number }) {
  await prisma.testimonial.create({
    data: {
      ...data,
      rating: data.rating || 5,
      isApproved: false
    }
  })
}

export async function createTestimonial(data: { name: string, role: string, content: string, imageUrl?: string, evidenceUrl?: string, isApproved?: boolean, rating?: number, order?: number }) {
  await prisma.testimonial.create({
    data: {
      ...data,
      rating: data.rating || 5
    }
  })
  revalidatePath("/admin/testimonials")
  revalidatePath("/testimonials")
}

export async function updateTestimonial(id: string, data: { name: string, role: string, content: string, imageUrl?: string, evidenceUrl?: string, isApproved?: boolean, rating?: number, order?: number }) {
  await prisma.testimonial.update({
    where: { id },
    data: {
      ...data,
      rating: data.rating || 5
    }
  })
  revalidatePath("/admin/testimonials")
  revalidatePath("/testimonials")
}

export async function toggleTestimonialApproval(id: string, isApproved: boolean) {
  await prisma.testimonial.update({
    where: { id },
    data: { isApproved }
  })
  revalidatePath("/admin/testimonials")
  revalidatePath("/testimonials")
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({
    where: { id }
  })
  revalidatePath("/admin/testimonials")
  revalidatePath("/testimonials")
}
