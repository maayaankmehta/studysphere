"use client"

import { cn } from "@/lib/utils"

export default function AuroraBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("aurora", className)}>
      <span className="a1" />
      <span className="a2" />
      <span className="a3" />
    </div>
  )
}
