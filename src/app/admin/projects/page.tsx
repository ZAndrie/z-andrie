import { fetchGitHubProjects } from "@/lib/github";
import ProjectList from "./ProjectList";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // Fetch all projects including hidden entries for admin management
  const projects = await fetchGitHubProjects(undefined, true, true);

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header Deck */}
      <div className="pb-5 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            SECTOR // SEC-02 // PROJECTS_VAULT
          </div>
          <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
            PROJECTS <span className="text-[var(--color-primary)]">VAULT</span>
          </h1>
          <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl">
            Live repositories and custom showcase artifacts. Use the visibility switch to hide specific projects from the public portfolio without deleting them on GitHub.
          </p>
        </div>
      </div>

      {/* Full-Width Workspace Deck */}
      <ProjectList projects={projects} />
    </div>
  );
}
