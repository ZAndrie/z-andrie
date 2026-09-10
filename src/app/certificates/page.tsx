import Certificates from "@/components/Certificates";
import { fetchGitHubCertificates } from "@/lib/github";

export const revalidate = 60;

export default async function CertificatesPage() {
  const certificates = await fetchGitHubCertificates();

  return (
    <>
      <Certificates certificates={certificates} />
    </>
  );
}
