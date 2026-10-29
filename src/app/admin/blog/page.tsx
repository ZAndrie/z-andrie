import Link from "next/link";
import { PlusCircle, ExternalLink, FileText, CheckCircle, Radio } from "lucide-react";
import { fetchGitHubBlogPosts } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await fetchGitHubBlogPosts();

  return (
    <div className="flex flex-col gap-8 pb-20 font-mono">
      {/* Header Deck */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            SECTOR // SEC-05 // DEVLOGS
          </div>
          <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
            DEVLOGS &amp; <span className="text-[var(--color-primary)]">FIELD NOTES</span>
          </h1>
          <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl">
            Engineering logs, mission retrospectives, and architecture breakdowns committed to GitHub.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-[var(--color-primary)] hover:bg-[#d0350e] text-white px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[2px] transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 shrink-0"
        >
          <PlusCircle size={15} />
          <span>COMPOSE DEVLOG</span>
        </Link>
      </div>

      <div className="bg-[#0e0e12]/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        {posts.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-[var(--color-primary)]">
              <FileText size={24} />
            </div>
            <h3 className="font-stencil text-xl text-white uppercase tracking-wider mb-2">
              NO DEVLOG ENTRIES DETECTED
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
              You haven&apos;t published any devlog articles yet. Dispatch your first transmission using the compose button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10">
                  <th className="p-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Title &amp; Excerpt</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Status</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Format</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400">Timestamp</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-[2px] text-gray-400 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-stencil text-lg text-white mb-1 uppercase tracking-wide">{post.title}</div>
                      <div className="text-[11px] text-gray-400 line-clamp-1 font-light">{post.excerpt}</div>
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle size={11} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold uppercase tracking-wider">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-mono text-gray-400 bg-black/40 border border-white/10 px-2 py-0.5 rounded uppercase">
                        {post.editorType === "json" ? "Block" : "Markdown"}
                      </span>
                    </td>
                    <td className="p-4 text-[11px] text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={post.githubUrl || `/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-white/5"
                        title="View on GitHub / Website"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
