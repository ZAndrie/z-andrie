"use client"

import { useTransition } from "react"
import { toggleTestimonialApproval } from "./actions"

export default function ToggleApprovalButton({ id, isApproved }: { id: string, isApproved: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        startTransition(() => {
          toggleTestimonialApproval(id, !isApproved)
        })
      }}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
        isApproved 
          ? "bg-green-100 text-green-700 hover:bg-green-200" 
          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      }`}
    >
      {isPending ? "Saving..." : isApproved ? "Approved" : "Pending"}
    </button>
  )
}
