"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable}`}>
        {/* Subtle purple glow background */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 40% at 70% 10%, color-mix(in oklab, var(--color-accent) 35%, transparent), transparent 70%), radial-gradient(50% 35% at 20% 60%, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 70%)",
          }}
        />
        {/* App container */}
        <Suspense fallback={<div>Loading...</div>}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SiteNav />
            {children}
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

function SiteNav() {
  const searchParams = useSearchParams()
  return (
    <header className="sticky top-4 z-50">
      <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3" aria-label="Primary">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-primary shadow-[0_0_20px_var(--color-primary)]"  />
          <span className="text-sm font-semibold tracking-wider">StudySphere</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="link">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="link">
            Leaderboard
          </Link>
          <Link href="/profile" className="link">
            Profile
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost">
            Log In
          </Link>
          <Link href="/register" className="btn-primary">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default ClientLayout
