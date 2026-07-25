"use client"

import { useTransition } from "react"
import { deleteTestimonial } from "./actions"

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure you want to delete this testimonial?")) {
          startTransition(() => {
            deleteTestimonial(id)
          })
        }
      }}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  )
}
