import { fetchGitHubProjects } from "@/lib/github";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await fetchGitHubProjects(undefined, true);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header Deck */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          SECTOR // SEC-02 // PROJECTS_VAULT
        </div>
        <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
          PROJECTS <span className="text-[var(--color-primary)]">VAULT</span>
        </h1>
        <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-3xl">
          Register new custom portfolio showcases, tune repository metadata, and upload custom cover artwork. All entries sync directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">projects.json</code> on GitHub.
        </p>
      </div>

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-24">
          <ProjectForm />
        </div>
        <div className="lg:col-span-2">
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  );
}
