"use client"

import { Badge } from "@/components/user-badge"

export default function ProfilePage() {
  const xp = 1250
  const next = 2000
  const pct = Math.min(100, Math.round((xp / next) * 100))

  return (
    <main className="py-10 grid gap-6 lg:grid-cols-3">
      <section className="card p-6 lg:col-span-1 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary" aria-hidden />
          <div>
            <h2 className="text-xl font-semibold">Alex Student</h2>
            <p className="text-sm text-muted-foreground">Level 4 • Senior</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>XP Progress</span>
            <span>
              {xp} / {next} XP
            </span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="lg:col-span-2 card p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements Unlocked</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Badge label="Initiator" description="Created your first group." />
          <Badge label="Weekend Warrior" description="Attended a weekend session." />
          <Badge label="Connector" description="Joined 3 groups." />
          <Badge label="Ace" description="Completed 5 sessions." />
        </div>
      </section>
    </main>
  )
}
