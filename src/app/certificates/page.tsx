import Certificates from "@/components/Certificates";
import { fetchGitHubCertificates } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const certificates = await fetchGitHubCertificates();

  return (
    <>
      <Certificates certificates={certificates} />
    </>
  );
}
