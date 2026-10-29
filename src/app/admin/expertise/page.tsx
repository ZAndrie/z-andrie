import { fetchGitHubExpertise } from "@/lib/github";
import ExpertiseList from "./ExpertiseList";

export const dynamic = "force-dynamic";

export default async function ExpertiseAdminPage() {
  const items = await fetchGitHubExpertise(undefined, true);

  return (
    <div className="flex flex-col gap-6 pb-20 font-mono">
      {/* Header Deck */}
      <div className="pb-5 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            SECTOR // SEC-03 // EXPERTISE_TREE
          </div>
          <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
            EXPERTISE &amp; <span className="text-[var(--color-primary)]">RESUME TREE</span>
          </h1>
          <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl">
            Live skill tree specializations, education milestones, and career trajectory synced directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">expertise/expertise.json</code> on GitHub.
          </p>
        </div>
      </div>

      {/* Full-Width Workspace Deck */}
      <ExpertiseList items={items} />
    </div>
  );
}
