import { fetchGitHubExpertise } from "@/lib/github";
import ExpertiseForm from "./ExpertiseForm";
import ExpertiseList from "./ExpertiseList";

export const dynamic = "force-dynamic";

export default async function ExpertiseAdminPage() {
  const items = await fetchGitHubExpertise(undefined, true);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header Deck */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          SECTOR // SEC-03 // EXPERTISE_TREE
        </div>
        <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
          EXPERTISE &amp; <span className="text-[var(--color-primary)]">RESUME TREE</span>
        </h1>
        <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-3xl">
          Manage dynamic skills, education milestones, and career trajectory. All changes commit directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">expertise/expertise.json</code> on GitHub.
        </p>
      </div>

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-24">
          <ExpertiseForm />
        </div>
        <div className="lg:col-span-2">
          <ExpertiseList items={items} />
        </div>
      </div>
    </div>
  );
}
