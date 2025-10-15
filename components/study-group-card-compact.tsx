import Link from "next/link"
import { Users, Clock, BookOpen, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type GroupPreview = {
  id: string
  name: string
  subject: string
  nextSession?: { startsAt: string; timezone: string }
  memberCount: number
  level?: "Beginner" | "Intermediate" | "Advanced"
  blurb?: string
}

export default function StudyGroupCardCompact({
  id,
  name,
  subject,
  nextSession,
  memberCount,
  level = "Intermediate",
  blurb = "Focus sessions, shared notes, and weekly accountability.",
}: GroupPreview) {
  return (
    <article className={cn("glass p-5 md:p-6 relative z-10")}>
      <header className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-semibold text-foreground text-pretty">{name}</h3>
        <span className="rounded-full px-3 py-1 text-xs md:text-sm bg-primary/20 text-primary-foreground/90">
          {level}
        </span>
      </header>

      <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>

      <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <li className="flex items-center gap-2">
          <BookOpen className="size-4 text-primary" aria-hidden />
          <span className="text-foreground/90">{subject}</span>
        </li>
        <li className="flex items-center gap-2">
          <Users className="size-4 text-primary" aria-hidden />
          <span className="text-foreground/90">{memberCount} members</span>
        </li>
        <li className="col-span-2 flex items-center gap-2">
          <Clock className="size-4 text-primary" aria-hidden />
          <span className="text-foreground/90">
            {nextSession ? `Next: ${nextSession.startsAt} (${nextSession.timezone})` : "Scheduling new session"}
          </span>
        </li>
      </ul>

      <div className="mt-5 flex justify-end">
        <Link
          href={`/groups/${id}`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
          aria-label={`View details for ${name}`}
        >
          View Details
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  )
}
