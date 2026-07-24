import prisma from "@/lib/prisma"
import EditCertificateForm from "./EditCertificateForm"
import { notFound } from "next/navigation"

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!certificate) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">Edit <span className="text-[var(--color-primary)] font-light italic">Certificate</span></h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Update your certificate details below.
        </p>
      </div>
      
      <EditCertificateForm certificate={certificate} />
    </div>
  )
}
