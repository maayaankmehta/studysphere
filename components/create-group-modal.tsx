"use client"

import { useEffect } from "react"

export function CreateGroupModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (group: { code: string; title: string; size: number; description: string }) => void
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onEsc)
    return () => document.removeEventListener("keydown", onEsc)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <form
        className="card relative z-10 w-full max-w-lg p-6 sm:p-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const data = new FormData(form)
          onCreate({
            code: String(data.get("code") || ""),
            title: String(data.get("title") || ""),
            size: Number(data.get("size") || 5),
            description: String(data.get("description") || ""),
          })
        }}
        aria-label="Create group modal"
      >
        <h2 className="text-xl font-semibold">Create a new group</h2>
        <div className="grid gap-3">
          <label className="text-sm">
            <span className="block mb-1">Course Code</span>
            <input
              name="code"
              className="w-full rounded-lg bg-background/40 border border-[var(--glass-border)] px-3 py-2"
              required
            />
          </label>
          <label className="text-sm">
            <span className="block mb-1">Group Title</span>
            <input
              name="title"
              className="w-full rounded-lg bg-background/40 border border-[var(--glass-border)] px-3 py-2"
              required
            />
          </label>
          <label className="text-sm">
            <span className="block mb-1">Description</span>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg bg-background/40 border border-[var(--glass-border)] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="block mb-1">Group Size</span>
            <input name="size" type="range" min={2} max={20} defaultValue={8} className="w-full" />
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Group
          </button>
        </div>
      </form>
    </div>
  )
}
