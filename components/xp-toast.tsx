"use client"

import { useEffect, useState } from "react"

export function XPToast({ message }: { message: string }) {
  const [open, setOpen] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 3000)
    return () => clearTimeout(t)
  }, [])

  if (!open) return null
  return (
    <div className="fixed top-4 right-4 z-[60]">
      <div className="card px-4 py-3 flex items-center gap-2">
        <span aria-hidden className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
        <span className="text-sm">🎉 {message}</span>
      </div>
    </div>
  )
}
