"use client"

import { useMemo, useState } from "react"
import { groups } from "@/components/mock-data"
import { StudyGroupCard, type StudyGroup } from "@/components/study-group-card"
import { CreateGroupModal } from "@/components/create-group-modal"
import { XPToast } from "@/components/xp-toast"

const FILTERS = ["All", "Online", "Offline", "Exam Prep"] as const

export default function DashboardPage() {
  const [q, setQ] = useState("")
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All")
  const [open, setOpen] = useState(false)
  const [toastKey, setToastKey] = useState(0)

  const filtered = useMemo(() => {
    const byFilter = (g: StudyGroup) => (filter === "All" ? true : g.type === filter)
    const byQuery = (g: StudyGroup) => [g.courseCode, g.title].some((v) => v.toLowerCase().includes(q.toLowerCase()))
    return groups.filter((g) => byFilter(g) && byQuery(g))
  }, [q, filter])

  return (
    <main className="py-8 space-y-6">
      <section className="card p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <label className="sr-only">Search by course code or name</label>
            <input
              className="w-full rounded-xl bg-background/40 border border-[var(--glass-border)] px-4 py-3 text-sm"
              placeholder="Search by course code or name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`pill ${filter === f ? "outline outline-2 outline-[var(--color-ring)]" : ""}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
            <button className="btn-primary" onClick={() => setOpen(true)}>
              Create Group
            </button>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <StudyGroupCard key={g.id} group={g} />
        ))}
      </section>

      <CreateGroupModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(newGroup) => {
          // mock success and show gamified toast
          setOpen(false)
          setToastKey((k) => k + 1)
        }}
      />
      <XPToast key={toastKey} message="+25 XP! You’ve created a group." />
    </main>
  )
}
