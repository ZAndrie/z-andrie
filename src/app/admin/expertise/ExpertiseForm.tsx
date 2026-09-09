"use client"
import { useState } from "react"
import { createExpertiseItem } from "./actions"

export default function ExpertiseForm() {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<string>("skills")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    await createExpertiseItem({
      category: formData.get("category") as string,
      title: formData.get("title") as string,
      subtitle: (formData.get("subtitle") as string) || undefined,
      year: formData.get("year") as string,
      percentage: formData.get("percentage") as string,
      order: 0,
    })
    setLoading(false)
    form.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--color-border)] shadow-sm flex flex-col gap-4">
      <h3 className="font-bold uppercase tracking-wider text-[14px]">Add New Resume Item</h3>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Category</label>
        <select 
          name="category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] bg-white font-sans"
        >
          <option value="skills">Skills</option>
          <option value="education">Education & Training</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Title / Name</label>
        <input 
          name="title" 
          required 
          placeholder={category === "skills" ? "e.g. UI / UX DESIGN" : category === "education" ? "e.g. BS IT or UI Mastery Workshop" : "e.g. Freelance Web Developer"} 
          className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          {category === "skills" ? "Proficiency Display (e.g. 95%)" : "Date Range / Years (e.g. 2023 - 2027 or Nov 2025)"}
        </label>
        <input 
          name="year" 
          required 
          placeholder={category === "skills" ? "95%" : "2023 - 2027 or Nov 2025 Workshop"} 
          className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">Progress Bar Width (%)</label>
        <input 
          name="percentage" 
          required 
          defaultValue={category === "skills" ? "90%" : "100%"} 
          placeholder="e.g. 95% or 100%" 
          className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
        <span className="text-[10px] text-gray-400">Controls the orange accent progress bar underneath the item.</span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
          Subtitle / Institution (Optional)
        </label>
        <input 
          name="subtitle" 
          placeholder={category === "education" ? "e.g. Cor Jesu College or Seminar Host" : category === "experience" ? "e.g. Tech Startup or Self-Employed" : "Optional notes"} 
          className="border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary)]" 
        />
      </div>

      <button disabled={loading} type="submit" className="mt-2 bg-[var(--color-text-dark)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] hover:bg-[var(--color-primary)] transition-colors disabled:opacity-50">
        {loading ? "Saving..." : "Save Item"}
      </button>
    </form>
  )
}
