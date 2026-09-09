"use server"

import { revalidatePath } from "next/cache"

export async function createProject(data: {
  title: string;
  category: string;
  subtitle: string;
  imageUrl: string;
  projectUrl?: string;
  order?: number;
}) {
  revalidatePath("/admin/projects")
  revalidatePath("/works")
}

export async function deleteProject(id: string) {
  revalidatePath("/admin/projects")
  revalidatePath("/works")
}

export async function updateProject(id: string, data: {
  title: string;
  category: string;
  subtitle: string;
  imageUrl: string;
  projectUrl?: string;
  order?: number;
}) {
  revalidatePath("/admin/projects")
  revalidatePath("/works")
}
