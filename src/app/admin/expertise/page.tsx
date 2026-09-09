import ExpertiseForm from "./ExpertiseForm"
import ExpertiseList from "./ExpertiseList"

export const dynamic = "force-dynamic"

export default async function ExpertiseAdminPage() {
  const items: any[] = []

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
          Manage <span className="text-[var(--color-primary)] font-light italic">Expertise & Resume</span>
        </h1>
        <p className="text-[var(--color-text-light)] text-[13px] leading-relaxed font-light">
          Add, edit, or remove entries under your Skills, Education, and Experience tabs. Changes will update instantly across your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1 sticky top-32">
          <ExpertiseForm />
        </div>
        <div className="lg:col-span-2">
          <ExpertiseList items={items} />
        </div>
      </div>
    </div>
  )
}
