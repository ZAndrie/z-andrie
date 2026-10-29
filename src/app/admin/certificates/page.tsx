import { fetchGitHubCertificates } from "@/lib/github";
import CertificateList from "./CertificateList";
import NewCertificateForm from "./NewCertificateForm";

export const dynamic = "force-dynamic";

export default async function CertificatesAdminPage() {
  const certificates = await fetchGitHubCertificates(undefined, true);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header Deck */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          SECTOR // SEC-04 // CREDENTIALS_ARCHIVE
        </div>
        <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
          CREDENTIALS <span className="text-[var(--color-primary)]">ARCHIVE</span>
        </h1>
        <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-3xl">
          Register engineering diplomas, industry certificates, and academic honors. Commits directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">certificates/certificates.json</code> on GitHub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 sticky top-24">
          <NewCertificateForm />
        </div>
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-6 font-mono">
            <h3 className="font-stencil text-xl uppercase tracking-wider text-white">
              VERIFIED CREDENTIALS ({certificates.length})
            </h3>
          </div>
          <CertificateList certificates={certificates} />
        </div>
      </div>
    </div>
  );
}
