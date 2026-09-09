"use client"
import { useState } from "react"
import { deleteExpertiseItem, seedDefaultExpertise } from "./actions"
import { Sparkles, Trash2, Briefcase, GraduationCap, Wrench } from "lucide-react"

export default function ExpertiseList({ items }: { items: any[] }) {
  const [seeding, setSeeding] = useState(false)

  const handleSeed = async () => {
    if (!confirm("Load your default Skills, Education, and Experience items into the database?")) return;
    setSeeding(true);
    const res = await seedDefaultExpertise();
    setSeeding(false);
    if (res && !res.success) {
      alert(res.message);
    }
  };

  const skills = items.filter(i => i.category === "skills");
  const education = items.filter(i => i.category === "education");
  const experience = items.filter(i => i.category === "experience");

  const renderSection = (title: string, data: any[], icon: React.ReactNode) => (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
        <div className="text-[var(--color-primary)]">{icon}</div>
        <h4 className="font-bold uppercase tracking-widest text-[12px] text-[var(--color-text-dark)]">
          {title} ({data.length})
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <div className="text-[12px] text-gray-400 italic py-2">No items in this section yet.</div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="border border-[var(--color-border)] bg-white p-4 flex justify-between items-center group hover:shadow-sm transition-all">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-bold text-[15px] uppercase text-[var(--color-text-dark)]">{item.title}</span>
                  <span className="text-[11px] text-[var(--color-primary)] font-bold">{item.year}</span>
                </div>
                {item.subtitle && (
                  <span className="text-[12px] text-gray-500 italic">{item.subtitle}</span>
                )}
                <div className="w-48 h-[3px] bg-gray-100 mt-2 rounded overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)]" style={{ width: item.percentage || "100%" }} />
                </div>
              </div>

              <div>
                <button 
                  onClick={async () => {
                    if (confirm(`Delete "${item.title}"?`)) await deleteExpertiseItem(item.id)
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {items.length === 0 && (
        <div className="mb-8 p-6 bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500 flex-shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">No resume items in database</h4>
              <p className="text-xs text-amber-700 mt-0.5">Want to instantly import all your current default portfolio items (BS IT, SHS, UI/UX Design 95%, etc.)?</p>
            </div>
          </div>
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-wider hover:bg-[#b04825] transition-colors flex-shrink-0 disabled:opacity-50 shadow-sm"
          >
            {seeding ? "Importing..." : "Seed Default Items ✨"}
          </button>
        </div>
      )}

      {renderSection("Skills & Proficiency", skills, <Wrench size={16} />)}
      {renderSection("Education & Training", education, <GraduationCap size={16} />)}
      {renderSection("Work Experience", experience, <Briefcase size={16} />)}
    </div>
  );
}
