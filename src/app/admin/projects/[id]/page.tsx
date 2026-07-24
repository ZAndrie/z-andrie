import prisma from "@/lib/prisma"
import EditProjectForm from "./EditProjectForm"
import { notFound } from "next/navigation"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">Edit <span className="text-[var(--color-primary)] font-light italic">Project</span></h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Update your project details below. Changes reflect instantly on your portfolio.
        </p>
      </div>
      
      <EditProjectForm project={project} />
    </div>
  )
}
