"use client"

import Image from "next/image"
import Link from "next/link"
import { StudyGroupCard } from "@/components/study-group-card"
import { groups } from "@/components/mock-data"
import AuroraBackground from "@/components/aurora-background"
import { Users, Calendar, Trophy, Star, ShieldCheck, Brain, RefreshCcw } from "lucide-react"

export default function HomePage() {
  return (
    <main className="py-10 sm:py-16 relative">
      <AuroraBackground />

      <section className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <p className="pill w-max">From BMSCE</p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-balance">
            High-impact study groups for ambitious students.
          </h1>
          <p className="text-muted-foreground max-w-prose leading-relaxed">
            Find or create groups for any course. Level up with XP, unlock badges, and climb the leaderboard — all in a
            sleek, glassmorphism experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
            <Link href="/login" className="btn-ghost">
              I already have an account
            </Link>
          </div>

          <ul className="grid grid-cols-3 gap-3 pt-2 text-sm">
            <li className="flex items-center gap-2">
              <Users className="size-4 text-primary" aria-hidden />
              <span className="text-foreground/90">Peer groups</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" aria-hidden />
              <span className="text-foreground/90">Planned sessions</span>
            </li>
            <li className="flex items-center gap-2">
              <Trophy className="size-4 text-primary" aria-hidden />
              <span className="text-foreground/90">XP & badges</span>
            </li>
          </ul>
        </div>

        <div className="grid gap-4">
          <div className="card p-3">
            <Image
              src="/images/hero-1.png"
              alt="Showcase hero with neon green highlights"
              width={1200}
              height={700}
              className="rounded-xl"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-3">
              <Image
                src="/images/section-1.png"
                alt="Liquid glass section with rating and cards"
                width={1200}
                height={700}
                className="rounded-xl"
              />
            </div>
            <div className="card p-3">
              <Image
                src="/images/section-2.png"
                alt="Client logo grid with glass tiles"
                width={1200}
                height={700}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">How StudySphere helps you study smarter</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-5">
            <p className="pill mb-2">Step 1</p>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="size-5 text-primary" aria-hidden />
              Join or create a study group
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find peers in your course or create your own group with clear goals. Set capacity, topics, and cadence.
            </p>
          </div>
          <div className="card p-5">
            <p className="pill mb-2">Step 2</p>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="size-5 text-primary" aria-hidden />
              Schedule focused sessions
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plan sessions with timings and mode (online/offline). Use shared resources and agree on outcomes.
            </p>
          </div>
          <div className="card p-5">
            <p className="pill mb-2">Step 3</p>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="size-5 text-primary" aria-hidden />
              Earn XP and level up
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Show up, contribute, and collect XP. Unlock badges and climb the leaderboard together.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Why group study works</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card p-5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" aria-hidden />
              Accountability
            </h3>
            <p className="text-sm text-muted-foreground">
              Showing up for others increases follow-through. Short sessions build momentum, not burnout.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Brain className="size-5 text-primary" aria-hidden />
              Active Learning
            </h3>
            <p className="text-sm text-muted-foreground">
              Explaining concepts, solving problems, and peer feedback improve long-term retention.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <RefreshCcw className="size-5 text-primary" aria-hidden />
              Consistency
            </h3>
            <p className="text-sm text-muted-foreground">
              A regular schedule beats cramming. Plan ahead, track progress, and celebrate small wins.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16 space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Star className="size-6 text-primary" aria-hidden />
            Featured study groups
          </h2>
          <Link href="/dashboard" className="btn-ghost">
            Browse all
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.slice(0, 6).map((g) => (
            <StudyGroupCard key={g.id} group={g} />
          ))}
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="card p-6 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--glass-border)] bg-background/40 p-4">
              <h3 className="font-semibold">How long are sessions?</h3>
              <p className="text-sm text-muted-foreground">
                Most groups meet for 60–90 minutes. Short and consistent sessions keep focus high.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-background/40 p-4">
              <h3 className="font-semibold">Can I join multiple groups?</h3>
              <p className="text-sm text-muted-foreground">
                Yes — join a core group and add topic-specific groups when exams approach.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-background/40 p-4">
              <h3 className="font-semibold">Online or in-person?</h3>
              <p className="text-sm text-muted-foreground">
                Both. Choose what fits your schedule and learning style; many groups mix modes.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--glass-border)] bg-background/40 p-4">
              <h3 className="font-semibold">Is there a cost?</h3>
              <p className="text-sm text-muted-foreground">
                StudySphere groups are free. Optional premium features may be added later.
              </p>
            </div>
          </div>
          <div className="pt-2">
            <Link href="/register" className="btn-primary">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
