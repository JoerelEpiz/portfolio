'use client'

import * as React from 'react'
import { Loader2, Pencil, Plus, Star, Trash2, X } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from './form-bits'
import type { Project } from '../portfolio/types'

type FormState = {
  title: string
  slug: string
  description: string
  tags: string
  liveUrl: string
  repoUrl: string
  featured: boolean
  sortOrder: string
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  description: '',
  tags: '',
  liveUrl: '',
  repoUrl: '',
  featured: false,
  sortOrder: '0',
}

export function ProjectsPanel() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [saving, setSaving] = React.useState(false)
  const [pendingDelete, setPendingDelete] = React.useState<Project | null>(null)

  const load = React.useCallback(async () => {
    const res = await fetch('/api/admin/projects')
    const json = await res.json()
    setProjects(json.projects ?? [])
    setLoading(false)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  function startCreate() {
    setEditingId('new')
    setForm(emptyForm)
  }

  function startEdit(project: Project) {
    setEditingId(project.id)
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      tags: project.tags.join(', '),
      liveUrl: project.liveUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      featured: project.featured,
      sortOrder: String(project.sortOrder),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      liveUrl: form.liveUrl || undefined,
      repoUrl: form.repoUrl || undefined,
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
    }
    try {
      const res = await fetch(
        editingId === 'new' ? '/api/admin/projects' : `/api/admin/projects/${editingId}`,
        {
          method: editingId === 'new' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const json = await res.json().catch(() => null)
      if (res.ok) {
        toast.success(editingId === 'new' ? 'Project created' : 'Project updated')
        cancelEdit()
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
    const res = await fetch(`/api/admin/projects/${pendingDelete.id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      toast.success('Project deleted')
      if (editingId === pendingDelete.id) cancelEdit()
      setPendingDelete(null)
      load()
    } else {
      toast.error('Failed to delete project')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* List */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <Button
            size="sm"
            className="gap-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={startCreate}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            New project
          </Button>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-4">
            <EmptyState text="No projects yet. Create your first one!" />
          </div>
        ) : (
          <ul className="mt-4 grid max-h-[32rem] gap-3 overflow-y-auto pr-1">
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    {p.featured ? (
                      <Badge className="rounded-full bg-emerald-500/15 px-2 py-0 text-[11px] text-emerald-600 dark:text-emerald-400">
                        <Star className="mr-0.5 h-2.5 w-2.5" aria-hidden />
                        Featured
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {p.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${p.title}`} onClick={() => startEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    aria-label={`Delete ${p.title}`}
                    onClick={() => setPendingDelete(p)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form */}
      <div className="lg:col-span-2">
        {editingId ? (
          <form
            onSubmit={handleSave}
            className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold tracking-tight">
                {editingId === 'new' ? 'New project' : 'Edit project'}
              </h3>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" aria-label="Cancel" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-title">Title *</Label>
              <Input
                id="project-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="My Awesome App"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-slug">Slug</Label>
              <Input
                id="project-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated from title"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-description">Description *</Label>
              <Textarea
                id="project-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What does it do? What did you build?"
                rows={4}
                required
                className="resize-y"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-tags">Tags</Label>
              <Input
                id="project-tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Next.js, PostgreSQL, Tailwind"
              />
              <p className="text-xs text-muted-foreground">Comma separated, up to 12.</p>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-live">Live URL</Label>
              <Input
                id="project-live"
                type="url"
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-repo">Repo URL</Label>
              <Input
                id="project-repo"
                type="url"
                value={form.repoUrl}
                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                placeholder="https://github.com/…"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
              <Label htmlFor="project-featured" className="cursor-pointer">
                Featured on homepage
              </Label>
              <Switch
                id="project-featured"
                checked={form.featured}
                onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="project-order">Sort order</Label>
              <Input
                id="project-order"
                type="number"
                min={0}
                max={999}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {editingId === 'new' ? 'Create project' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            Select a project to edit, or click{' '}
            <span className="font-medium text-foreground">New project</span> to add one.
            Changes appear on the portfolio immediately after saving.
          </div>
        )}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{pendingDelete?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the project from your portfolio. This action
              cannot be undone.
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
