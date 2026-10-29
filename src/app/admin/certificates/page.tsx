import { fetchGitHubCertificates } from "@/lib/github";
import CertificateList from "./CertificateList";

export const dynamic = "force-dynamic";

export default async function CertificatesAdminPage() {
  const certificates = await fetchGitHubCertificates(undefined, true);

  return (
    <div className="flex flex-col gap-6 pb-20 font-mono">
      {/* Header Deck */}
      <div className="pb-5 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
            SECTOR // SEC-04 // CREDENTIALS_ARCHIVE
          </div>
          <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
            CREDENTIALS <span className="text-[var(--color-primary)]">ARCHIVE</span>
          </h1>
          <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl">
            Verified engineering diplomas, hackathon accolades, and industry-recognized certifications. Synced directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">certificates/certificates.json</code> on GitHub.
          </p>
        </div>
      </div>

      {/* Full-Width Workspace Deck */}
      <CertificateList certificates={certificates} />
    </div>
  );
}
