import Link from "next/link"
import Image from "next/image"
import { getGroupById, getSessionsForGroup } from "@/components/mock-data"
import { Users, Clock, Calendar, Video, MapPin } from "lucide-react"

export default function GroupDetailsPage({ params }: { params: { id: string } }) {
  const group = getGroupById(params.id)
  const sessions = getSessionsForGroup(params.id)

  if (!group) {
    return (
      <main className="py-10 sm:py-16">
        <section className="card p-6 space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">Group not found</h1>
          <p className="text-muted-foreground">We couldn’t find that study group.</p>
          <div>
            <Link className="btn-ghost" href="/dashboard">
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="py-10 sm:py-16 space-y-8">
      <section className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <p className="pill w-max">{group.courseCode}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold">{group.title}</h1>
            <p className="text-muted-foreground max-w-prose">{group.description}</p>
            <div className="flex items-center gap-3 pt-1 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
              <span className="inline-flex items-center gap-1">
                <Users className="size-4" aria-hidden />
                {group.members} / {group.capacity} members
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-4" aria-hidden />
                {group.type}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="btn-ghost">
              Back
            </Link>
            <Link href="/register" className="btn-primary">
              Join group
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Clock className="size-5 text-primary" aria-hidden />
              Upcoming study sessions
            </h2>
            <ul className="grid gap-3">
              {sessions.map((s) => (
                <li key={s.id} className="rounded-xl border border-[var(--glass-border)] bg-background/40 p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                        <Calendar className="size-4 text-primary" aria-hidden />
                        {s.when}
                      </p>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-2">
                        {s.mode === "Online" ? (
                          <Video className="size-4" aria-hidden />
                        ) : (
                          <MapPin className="size-4" aria-hidden />
                        )}
                        {s.mode}
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {s.attendees.map((a) => (
                        <Image
                          key={a.id}
                          src={"/placeholder.svg?height=32&width=32&query=user avatar"}
                          alt={`${a.name} avatar`}
                          width={32}
                          height={32}
                          className="rounded-full border border-[var(--glass-border)]"
                        />
                      ))}
                    </div>
                    <Link href="/register" className="btn-ghost">
                      Join session
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="text-xl font-semibold mb-3">Group guidelines</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Start on time and end on time—short, focused blocks win.</li>
              <li>Define a target for each session: topics, problems, or practice sets.</li>
              <li>Summarize takeaways and next steps at the end.</li>
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-xl font-semibold mb-3">At a glance</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Course</dt>
                <dd className="font-medium">{group.courseCode}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium">{group.type}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Members</dt>
                <dd className="font-medium">
                  {group.members}/{group.capacity}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sessions</dt>
                <dd className="font-medium">{sessions.length}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h2 className="text-xl font-semibold mb-3">Tips for this course</h2>
            <p className="text-sm text-muted-foreground">
              Break topics into small chunks, practice past papers weekly, and teach concepts to a peer to test depth.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
