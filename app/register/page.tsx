"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function validate() {
    const next: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email."
    if (password.length < 8) next.password = "Password must be at least 8 characters."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    router.push("/dashboard")
  }

  return (
    <main className="py-16 grid place-items-center">
      <form onSubmit={onSubmit} className="card max-w-md w-full p-6 sm:p-8 space-y-6" aria-label="Sign up form">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">Welcome to StudySphere.</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">University Email</label>
          <input
            className="w-full rounded-lg bg-background/40 border border-[var(--glass-border)] px-3 py-2"
            type="email"
            aria-invalid={!!errors.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-xs text-[var(--color-accent)]">{errors.email}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            className="w-full rounded-lg bg-background/40 border border-[var(--glass-border)] px-3 py-2"
            type="password"
            aria-invalid={!!errors.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-xs text-[var(--color-accent)]">{errors.password}</p>}
        </div>
        <button className="btn-primary w-full" type="submit">
          Sign Up
        </button>
      </form>
    </main>
  )
}
