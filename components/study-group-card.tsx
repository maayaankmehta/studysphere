"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

export type StudyGroup = {
  id: string
  courseCode: string
  title: string
  description: string
  members: number
  capacity: number
  type: "Online" | "Offline" | "Exam Prep"
}

export function StudyGroupCard({ group, className }: { group: StudyGroup; className?: string }) {
  return (
    <article className={cn("card p-5 flex flex-col gap-4", className)} aria-label={`${group.title} card`}>
      <div className="flex items-center justify-between">
        <span className="pill">{group.courseCode}</span>
        <span className="text-xs text-muted-foreground">{group.type}</span>
      </div>
      <header className="space-y-1">
        <h3 className="text-lg font-semibold">{group.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
      </header>
      <footer className="mt-auto flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {group.members} / {group.capacity} Members
        </p>
        <Link href={`/groups/${group.id}`} className="btn-ghost" aria-label={`View details for ${group.title}`}>
          View Details
        </Link>
      </footer>
    </article>
  )
}
