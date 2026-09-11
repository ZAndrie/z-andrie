import { fetchGitHubProjects } from "@/lib/github"
import ProjectForm from "./ProjectForm"
import ProjectList from "./ProjectList"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const projects = await fetchGitHubProjects(undefined, true)

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">Manage <span className="text-[var(--color-primary)] font-light italic">Projects</span></h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Add new portfolio projects, search, and edit custom titles, categories, and cover images. Repositories are preserved and cannot be deleted from here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1 sticky top-32">
          <ProjectForm />
        </div>
        <div className="lg:col-span-2">
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  )
}
