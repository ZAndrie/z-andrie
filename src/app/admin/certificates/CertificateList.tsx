"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCertificateFromGitHub } from "./actions";
import { ExternalLink, Trash2, Loader2, Award } from "lucide-react";

export default function CertificateList({ certificates }: { certificates: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
      {certificates.map((c) => (
        <div
          key={c.id}
          className="border border-white/10 bg-[#0e0e12]/90 p-5 rounded-xl flex flex-col gap-3 group hover:border-[var(--color-primary)]/40 hover:bg-[#121217] transition-all shadow-[0_5px_20px_rgba(0,0,0,0.5)]"
        >
          {/* Media Preview */}
          <div className="w-full h-44 bg-black border border-white/10 rounded-lg overflow-hidden relative">
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
            <div className="text-[10px] text-[var(--color-primary)] uppercase tracking-[2px] font-bold mb-1">
              {c.issuer}
            </div>
            <h4 className="font-stencil text-xl text-white uppercase tracking-wide leading-tight mb-1 group-hover:text-[var(--color-primary)] transition-colors">
              {c.title}
            </h4>
            <p className="text-gray-400 text-[11px] leading-relaxed mb-3 flex-1">
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
                <Loader2 size={13} className="animate-spin text-red-400" />
              ) : (
                <Trash2 size={13} />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      ))}

      {certificates.length === 0 && (
        <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 bg-[#0e0e12]/40">
          <Award size={24} className="text-gray-500 mb-1" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-300">No credentials indexed</p>
          <p className="text-[11px] text-gray-500">Upload and commit your first certificate using the registry form.</p>
        </div>
      )}
    </div>
  );
}
