"use client"

import { useState } from "react"

export function Badge({ label, description }: { label: string; description: string }) {
  const [show, setShow] = useState(false)
  return (
    <div
      className="relative grid place-items-center aspect-square rounded-2xl p-4 glass"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      aria-label={`${label} badge`}
    >
      <div className="h-8 w-8 rounded-full bg-primary shadow-[0_0_16px_var(--color-primary)]" aria-hidden />
      <span className="mt-2 text-sm font-medium">{label}</span>

      {show && (
        <div
          role="tooltip"
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full card px-3 py-2 text-xs"
        >
          {description}
        </div>
      )}
    </div>
  )
}
