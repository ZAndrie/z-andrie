import Certificates from "@/components/Certificates";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Certificates certificates={certificates} />
    </>
  );
}
