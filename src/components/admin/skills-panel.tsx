'use client'

import * as React from 'react'
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EmptyState, Field } from './form-bits'
import { Input } from '@/components/ui/input'
import type { Skill } from '../portfolio/types'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Tools']

type FormState = {
  name: string
  category: string
  level: string
  icon: string
  sortOrder: string
}

const emptyForm: FormState = {
  name: '',
  category: 'Frontend',
  level: '80',
  icon: '',
  sortOrder: '0',
}

export function SkillsPanel() {
  const [skills, setSkills] = React.useState<Skill[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [saving, setSaving] = React.useState(false)
  const [pendingDelete, setPendingDelete] = React.useState<Skill | null>(null)

  const load = React.useCallback(async () => {
    const res = await fetch('/api/admin/skills')
    const json = await res.json()
    setSkills(json.skills ?? [])
    setLoading(false)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  function startEdit(skill: Skill) {
    setEditingId(skill.id)
    setForm({
      name: skill.name,
      category: skill.category,
      level: String(skill.level),
      icon: skill.icon ?? '',
      sortOrder: String(skill.sortOrder),
    })
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      category: form.category,
      level: Math.min(100, Math.max(0, Number(form.level) || 0)),
      icon: form.icon || undefined,
      sortOrder: Number(form.sortOrder) || 0,
    }
    try {
      const res = await fetch(
        editingId === 'new' ? '/api/admin/skills' : `/api/admin/skills/${editingId}`,
        {
          method: editingId === 'new' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const json = await res.json().catch(() => null)
      if (res.ok) {
        toast.success(editingId === 'new' ? 'Skill added' : 'Skill updated')
        setEditingId(null)
        setForm(emptyForm)
        load()
      } else {
        toast.error(json?.issues?.[0] ?? json?.error ?? 'Save failed')
      }
    } catch {
      toast.error('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const res = await fetch(`/api/admin/skills/${pendingDelete.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Skill deleted')
      if (editingId === pendingDelete.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      setPendingDelete(null)
      load()
    } else {
      toast.error('Failed to delete skill')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Skills</h2>
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={() => {
              setEditingId('new')
              setForm(emptyForm)
            }}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add skill
          </Button>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-card" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="mt-4">
            <EmptyState text="No skills yet. Add your first one!" />
          </div>
        ) : (
          <ul className="mt-4 grid max-h-[32rem] gap-3 overflow-y-auto pr-1">
            {skills.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {s.level}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {s.category}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${s.name}`} onClick={() => startEdit(s)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    aria-label={`Delete ${s.name}`}
                    onClick={() => setPendingDelete(s)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lg:col-span-2">
        {editingId ? (
          <form
            onSubmit={handleSave}
            className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold tracking-tight">
                {editingId === 'new' ? 'Add skill' : 'Edit skill'}
              </h3>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Cancel" onClick={() => setEditingId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Field label="Name *" htmlFor="skill-name">
              <Input
                id="skill-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="React"
                required
              />
            </Field>

            <Field label="Category *" htmlFor="skill-category">
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger id="skill-category">
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Level (0–100) *" htmlFor="skill-level">
              <Input
                id="skill-level"
                type="number"
                min={0}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                required
              />
            </Field>

            <Field
              label="Icon"
              htmlFor="skill-icon"
              hint="Optional Lucide icon name (e.g. Atom, Server, Wind)."
            >
              <Input
                id="skill-icon"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="Atom"
              />
            </Field>

            <Field label="Sort order" htmlFor="skill-order">
              <Input
                id="skill-order"
                type="number"
                min={0}
                max={999}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </Field>

            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {editingId === 'new' ? 'Add skill' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            Select a skill to edit, or click{' '}
            <span className="font-medium text-foreground">Add skill</span>.
          </div>
        )}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pendingDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the skill from your portfolio. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
