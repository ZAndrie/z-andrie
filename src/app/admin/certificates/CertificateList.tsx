"use client"
import { deleteCertificate } from "./actions"

export default function CertificateList({ certificates }: { certificates: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certificates.map((c) => (
        <div key={c.id} className="border border-[var(--color-border)] bg-white p-4 flex flex-col gap-3 group hover:shadow-md transition-shadow">
          
          <div className="w-full h-40 bg-gray-100 rounded-sm overflow-hidden relative">
            {c.imageUrl?.includes("type=pdf") ? (
              <iframe src={`${c.imageUrl}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full object-cover pointer-events-none" title="PDF" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="flex flex-col flex-1">
            <div className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">{c.issuer}</div>
            <h4 className="font-serif text-xl leading-tight mb-1">{c.title}</h4>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-4 flex-1">Issued: {c.date}</p>
          </div>
          
          <div className="flex justify-end items-center pt-3 border-t border-gray-100">
             <div className="flex gap-4">
                <a href={`/admin/certificates/${c.id}`} className="text-gray-500 text-[10px] uppercase font-bold hover:text-[var(--color-primary)] tracking-wider transition-colors">
                  Edit
                </a>
                <button onClick={async () => {
                  if (confirm("Are you sure you want to delete this certificate?")) await deleteCertificate(c.id)
                }} className="text-red-500 text-[10px] uppercase font-bold hover:text-red-700 tracking-wider transition-colors">
                  Delete
                </button>
             </div>
          </div>
        </div>
      ))}
      
      {certificates.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-300">
          No certificates yet. Create your first certificate on the left!
        </div>
      )}
    </div>
  )
}
