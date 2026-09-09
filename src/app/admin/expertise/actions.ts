"use server"

import { revalidatePath } from "next/cache"

export async function createExpertiseItem(data: {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
  percentage: string;
  order?: number;
}) {
  revalidatePath("/admin/expertise")
  revalidatePath("/expertise")
}

export async function deleteExpertiseItem(id: string) {
  revalidatePath("/admin/expertise")
  revalidatePath("/expertise")
}

export async function updateExpertiseItem(id: string, data: {
  category: string;
  title: string;
  subtitle?: string;
  year: string;
  percentage: string;
  order?: number;
}) {
  revalidatePath("/admin/expertise")
  revalidatePath("/expertise")
}

export async function seedDefaultExpertise() {
  return { success: true, message: "Static data is active." };
}
