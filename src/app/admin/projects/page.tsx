import prisma from "@/lib/prisma"
import ProjectForm from "./ProjectForm"
import ProjectList from "./ProjectList"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">Manage <span className="text-[var(--color-primary)] font-light italic">Projects</span></h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Add new portfolio works or remove existing ones. Changes will reflect instantly on your public website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1 sticky top-32">
          <ProjectForm />
        </div>
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end border-b border-[var(--color-border)] pb-3 mb-6">
             <h3 className="font-bold uppercase tracking-widest text-[12px] text-gray-400">Existing Projects ({projects.length})</h3>
          </div>
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  )
}
