'use client'

import * as React from 'react'
import { format } from 'date-fns'
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { EmptyState, Field, TextAreaField, TextField } from './form-bits'
import { Input } from '@/components/ui/input'
import type { Experience } from '../portfolio/types'

type FormState = {
  company: string
  role: string
  description: string
  type: 'work' | 'education'
  startDate: string
  endDate: string
  current: boolean
  location: string
  sortOrder: string
}

const emptyForm: FormState = {
  company: '',
  role: '',
  description: '',
  type: 'work',
  startDate: '',
  endDate: '',
  current: false,
  location: '',
  sortOrder: '0',
}

function toDateString(iso: string | null) {
  return iso ? format(new Date(iso), 'yyyy-MM-dd') : ''
}

export function ExperiencesPanel() {
  const [experiences, setExperiences] = React.useState<Experience[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [saving, setSaving] = React.useState(false)
  const [pendingDelete, setPendingDelete] = React.useState<Experience | null>(null)

  const load = React.useCallback(async () => {
    const res = await fetch('/api/admin/experiences')
    const json = await res.json()
    setExperiences(json.experiences ?? [])
    setLoading(false)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  function startEdit(item: Experience) {
    setEditingId(item.id)
    setForm({
      company: item.company,
      role: item.role,
      description: item.description,
      type: item.type === 'education' ? 'education' : 'work',
      startDate: toDateString(item.startDate),
      endDate: toDateString(item.endDate),
      current: item.current,
      location: item.location ?? '',
      sortOrder: String(item.sortOrder),
    })
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      company: form.company,
      role: form.role,
      description: form.description,
      type: form.type,
      startDate: form.startDate,
      endDate: form.current ? '' : form.endDate,
      current: form.current,
      location: form.location || undefined,
      sortOrder: Number(form.sortOrder) || 0,
    }
    try {
      const res = await fetch(
        editingId === 'new' ? '/api/admin/experiences' : `/api/admin/experiences/${editingId}`,
        {
          method: editingId === 'new' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const json = await res.json().catch(() => null)
      if (res.ok) {
        toast.success(editingId === 'new' ? 'Experience added' : 'Experience updated')
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
    const res = await fetch(`/api/admin/experiences/${pendingDelete.id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      toast.success('Experience deleted')
      if (editingId === pendingDelete.id) {
        setEditingId(null)
        setForm(emptyForm)
      }
      setPendingDelete(null)
      load()
    } else {
      toast.error('Failed to delete experience')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={() => {
              setEditingId('new')
              setForm(emptyForm)
            }}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add entry
          </Button>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="mt-4">
            <EmptyState text="No experience entries yet. Add your first role or education entry!" />
          </div>
        ) : (
          <ul className="mt-4 grid max-h-[32rem] gap-3 overflow-y-auto pr-1">
            {experiences.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{item.role}</p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {item.type === 'education' ? 'Education' : 'Work'}
                    </span>
                    {item.current ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        Current
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.company} · {format(new Date(item.startDate), 'MMM yyyy')} —{' '}
                    {item.current ? 'Present' : item.endDate ? format(new Date(item.endDate), 'MMM yyyy') : ''}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${item.role}`} onClick={() => startEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    aria-label={`Delete ${item.role}`}
                    onClick={() => setPendingDelete(item)}
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
                {editingId === 'new' ? 'Add entry' : 'Edit entry'}
              </h3>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Cancel" onClick={() => setEditingId(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Field label="Type *" htmlFor="exp-type">
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm({ ...form, type: value as 'work' | 'education' })
                }
              >
                <SelectTrigger id="exp-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <TextField
              label="Role / Degree *"
              id="exp-role"
              value={form.role}
              onChange={(v) => setForm({ ...form, role: v })}
              placeholder="Senior Developer"
              required
            />
            <TextField
              label="Company / School *"
              id="exp-company"
              value={form.company}
              onChange={(v) => setForm({ ...form, company: v })}
              placeholder="Acme Inc."
              required
            />

            <TextAreaField
              label="Description *"
              id="exp-description"
              value={form.description}
              onChange={(v) => setForm({ ...form, description: v })}
              placeholder="What did you do there? Key achievements…"
              rows={4}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start date *" htmlFor="exp-start">
                <Input
                  id="exp-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </Field>
              <Field label="End date" htmlFor="exp-end">
                <Input
                  id="exp-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  disabled={form.current}
                />
              </Field>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
              <Label htmlFor="exp-current" className="cursor-pointer">
                Currently active
              </Label>
              <Switch
                id="exp-current"
                checked={form.current}
                onCheckedChange={(checked) => setForm({ ...form, current: checked })}
              />
            </div>

            <TextField
              label="Location"
              id="exp-location"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
              placeholder="Remote / City, Country"
            />

            <Field label="Sort order" htmlFor="exp-order">
              <Input
                id="exp-order"
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
              {editingId === 'new' ? 'Add entry' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            Select an entry to edit, or click{' '}
            <span className="font-medium text-foreground">Add entry</span>.
          </div>
        )}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete “{pendingDelete?.role}” at {pendingDelete?.company}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes the entry from your portfolio timeline. This action cannot be
              undone.
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
