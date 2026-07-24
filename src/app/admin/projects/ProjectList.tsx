"use client"
import { deleteProject } from "./actions"

export default function ProjectList({ projects }: { projects: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((p) => (
        <div key={p.id} className="border border-[var(--color-border)] bg-white p-4 flex flex-col gap-3 group hover:shadow-md transition-shadow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover bg-gray-100 rounded-sm" />
          <div className="flex flex-col flex-1">
            <div className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold mb-1">{p.category}</div>
            <h4 className="font-serif text-xl leading-tight mb-1">{p.title}</h4>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-4 flex-1">{p.subtitle}</p>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
             {p.projectUrl ? (
                <a href={p.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest text-[var(--color-text-dark)] hover:text-[var(--color-primary)]">
                  View Live →
                </a>
             ) : <span />}
             <div className="flex gap-4">
                <a href={`/admin/projects/${p.id}`} className="text-gray-500 text-[10px] uppercase font-bold hover:text-[var(--color-primary)] tracking-wider transition-colors">
                  Edit
                </a>
                <button onClick={async () => {
                  if (confirm("Are you sure you want to delete this project?")) await deleteProject(p.id)
                }} className="text-red-500 text-[10px] uppercase font-bold hover:text-red-700 tracking-wider transition-colors">
                  Delete
                </button>
             </div>
          </div>
        </div>
      ))}
      
      {projects.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-300">
          No projects yet. Create your first project on the left!
        </div>
      )}
    </div>
  )
}
