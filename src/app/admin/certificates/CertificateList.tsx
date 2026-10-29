"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { deleteCertificateFromGitHub } from "./actions";
import {
  ExternalLink,
  Trash2,
  Loader2,
  Award,
  Search,
  X,
  List,
  LayoutGrid,
  PlusCircle,
  FileText,
} from "lucide-react";
import NewCertificateForm from "./NewCertificateForm";

export default function CertificateList({ certificates }: { certificates: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCerts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return certificates;
    return certificates.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.issuer?.toLowerCase().includes(q) ||
        c.date?.toLowerCase().includes(q)
    );
  }, [certificates, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate from GitHub?")) return;
    setDeletingId(id);
    const res = await deleteCertificateFromGitHub(id);
    if (!res.success) {
      alert(res.error || "Failed to delete certificate from GitHub");
    }
    setDeletingId(null);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Top Toolbar */}
      <div className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificate title, issuer, or date..."
            className="w-full pl-9 pr-8 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* View Mode & Register Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1 p-1 bg-black/60 border border-white/10 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
              }`}
              title="Dense Table View (No Scrolling)"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-white/15 text-white" : "text-gray-500 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[1.5px] transition-all cursor-pointer ${
              showForm
                ? "bg-white/10 text-white border border-white/20"
                : "bg-[var(--color-primary)] hover:bg-[#d0350e] text-white shadow-lg shadow-[var(--color-primary)]/20"
            }`}
          >
            {showForm ? (
              <>
                <X size={13} />
                <span>CLOSE</span>
              </>
            ) : (
              <>
                <PlusCircle size={13} />
                <span>+ REGISTER CERT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Register Form */}
      {showForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <NewCertificateForm
            onClose={() => setShowForm(false)}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      {/* 1. DENSE TABLE / COMPACT LIST VIEW */}
      {viewMode === "table" ? (
        <div className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/60 border-b border-white/10 text-[9px] font-bold uppercase tracking-[2px] text-gray-500">
                  <th className="p-3.5 pl-5">Preview</th>
                  <th className="p-3.5">Certificate Designation</th>
                  <th className="p-3.5">Issuer / Organization</th>
                  <th className="p-3.5">Issue Date</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredCerts.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-3 pl-5">
                      <div className="w-14 h-10 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                        {c.imageUrl?.includes("type=pdf") ? (
                          <div className="w-full h-full flex items-center justify-center bg-black/80 text-[var(--color-primary)]">
                            <FileText size={16} />
                          </div>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-stencil text-base text-white tracking-wide uppercase line-clamp-1">
                        {c.title}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] text-[var(--color-primary)] uppercase tracking-wider font-bold">
                        {c.issuer}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-gray-400">
                      {c.date}
                    </td>
                    <td className="p-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={c.repoUrl || "https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                          title="Open in GitHub"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          disabled={deletingId === c.id}
                          onClick={() => handleDelete(c.id)}
                          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider p-1.5 rounded hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {deletingId === c.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2. FULL-WIDTH TACTICAL GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCerts.map((c) => (
            <div
              key={c.id}
              className="border border-white/10 bg-[#0e0e12]/90 p-5 rounded-xl flex flex-col gap-3 group hover:border-[var(--color-primary)]/40 hover:bg-[#121217] transition-all shadow-xl"
            >
              <div className="w-full h-40 bg-black border border-white/10 rounded-lg overflow-hidden relative">
                {c.imageUrl?.includes("type=pdf") ? (
                  <iframe
                    src={`${c.imageUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full object-cover pointer-events-none"
                    title="PDF"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                )}
              </div>

              <div className="flex flex-col flex-1">
                <div className="text-[9px] text-[var(--color-primary)] uppercase tracking-[2px] font-bold mb-1">
                  {c.issuer}
                </div>
                <h4 className="font-stencil text-lg text-white uppercase tracking-wide leading-tight mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                  {c.title}
                </h4>
                <p className="text-gray-400 text-[11px] leading-relaxed mb-3 flex-1 font-light">
                  ISSUED: <strong className="text-gray-300">{c.date}</strong>
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
                <a
                  href={c.repoUrl || "https://github.com/ZAndrie/portfolio-contents/tree/main/certificates"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-gray-400 text-[10px] uppercase font-bold hover:text-white tracking-wider transition-colors"
                >
                  <span>GitHub Record</span>
                  <ExternalLink size={11} />
                </a>
                <button
                  disabled={deletingId === c.id}
                  onClick={() => handleDelete(c.id)}
                  className="inline-flex items-center gap-1 text-red-400 text-[10px] uppercase font-bold hover:text-red-300 tracking-wider transition-colors disabled:opacity-50 p-1.5 rounded hover:bg-red-500/10"
                >
                  {deletingId === c.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCerts.length === 0 && (
        <div className="py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 bg-[#0e0e12]/40">
          <Award size={24} className="text-gray-500 mb-1" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-300">No credentials match filter criteria</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs text-[var(--color-primary)] underline hover:text-white uppercase tracking-wider"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
