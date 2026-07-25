import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import DeleteButton from "./DeleteButton"
import ToggleApprovalButton from "./ToggleApprovalButton"

export const dynamic = "force-dynamic"

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-light text-[var(--color-text-dark)] tracking-wide">Testimonials</h1>
          <p className="text-[12px] text-gray-500 mt-1 uppercase tracking-wider">Manage your client feedback</p>
        </div>
        <Link 
          href="/admin/testimonials/new"
          className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors"
        >
          + Add New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Role / Company</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {t.imageUrl ? (
                        <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-500 md:hidden">{t.role}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-sm text-gray-600">
                  {t.role}
                </td>
                <td className="p-4">
                  <ToggleApprovalButton id={t.id} isApproved={t.isApproved} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Link 
                      href={`/admin/testimonials/${t.id}`}
                      className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] font-medium text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={t.id} />
                  </div>
                </td>
              </tr>
            ))}
            
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 text-sm">
                  No testimonials found. Click "Add New" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
