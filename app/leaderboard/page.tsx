"use client"

const users = [
  { name: "Ava", xp: 5400 },
  { name: "Liam", xp: 5100 },
  { name: "Noah", xp: 4800 },
  { name: "Emma", xp: 4300 },
  { name: "Mia", xp: 3900 },
  { name: "Ethan", xp: 3600 },
]

export default function LeaderboardPage() {
  return (
    <main className="py-10 space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <ol className="space-y-3">
        {users.map((u, i) => {
          const glow =
            i === 0
              ? "shadow-[0_0_0_2px_#ffd70040] outline outline-2 outline-[#ffd70080]"
              : i === 1
                ? "shadow-[0_0_0_2px_#c0c0c040] outline outline-2 outline-[#c0c0c080]"
                : i === 2
                  ? "shadow-[0_0_0_2px_#cd7f3240] outline outline-2 outline-[#cd7f3280]"
                  : ""
          return (
            <li key={u.name} className={`card px-5 py-4 flex items-center justify-between ${glow}`}>
              <div className="flex items-center gap-4">
                <span className="pill w-10 text-center">{i + 1}</span>
                <span className="font-medium">{u.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{u.xp} XP</span>
            </li>
          )
        })}
      </ol>
    </main>
  )
}
