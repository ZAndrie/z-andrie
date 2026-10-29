import { fetchGitHubProjects } from "@/lib/github";
import EditProjectForm from "./EditProjectForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projects = await fetchGitHubProjects(undefined, true);
  const project = projects.find((p) => p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[2px] text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-3 group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects Vault
        </Link>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-1">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
          SECTOR // SEC-02 // TUNE_ENTRY
        </div>
        <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
          MODIFY <span className="text-[var(--color-primary)]">PROJECT</span>
        </h1>
        <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl">
          Tuning live showcase record for: <strong className="text-white">{project.title}</strong>
        </p>
      </div>

      <EditProjectForm project={project} />
    </div>
  );
}
