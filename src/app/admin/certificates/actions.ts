"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCertificate(data: { title: string, issuer: string, date: string, imageUrl: string, order?: number }) {
  await prisma.certificate.create({
    data
  })
  revalidatePath("/admin/certificates")
  revalidatePath("/certificates")
}

export async function updateCertificate(id: string, data: { title: string, issuer: string, date: string, imageUrl: string, order?: number }) {
  await prisma.certificate.update({
    where: { id },
    data
  })
  revalidatePath("/admin/certificates")
  revalidatePath("/certificates")
}

export async function deleteCertificate(id: string) {
  await prisma.certificate.delete({
    where: { id }
  })
  revalidatePath("/admin/certificates")
  revalidatePath("/certificates")
}
