'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { TextAreaField, TextField } from './form-bits'

type ProfileForm = {
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  location: string
  availability: boolean
  yearsExp: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
}

const emptyProfile: ProfileForm = {
  name: '',
  title: '',
  tagline: '',
  bio: '',
  email: '',
  location: '',
  availability: true,
  yearsExp: '0',
  githubUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
}

export function ProfilePanel() {
  const router = useRouter()
  const [form, setForm] = React.useState<ProfileForm>(emptyProfile)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/admin/profile')
      .then((r) => r.json())
      .then((json) => {
        const p = json.profile
        if (p) {
          setForm({
            name: p.name ?? '',
            title: p.title ?? '',
            tagline: p.tagline ?? '',
            bio: p.bio ?? '',
            email: p.email ?? '',
            location: p.location ?? '',
            availability: Boolean(p.availability),
            yearsExp: String(p.yearsExp ?? 0),
            githubUrl: p.githubUrl ?? '',
            linkedinUrl: p.linkedinUrl ?? '',
            twitterUrl: p.twitterUrl ?? '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      title: form.title,
      tagline: form.tagline,
      bio: form.bio,
      email: form.email,
      location: form.location,
      availability: form.availability,
      yearsExp: Number(form.yearsExp) || 0,
      githubUrl: form.githubUrl || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      twitterUrl: form.twitterUrl || undefined,
    }
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => null)
      if (res.ok) {
        toast.success('Profile saved — the site is up to date!')
        router.refresh()
      } else {
        toast.error(json?.issues?.[0] ?? json?.error ?? 'Save failed')
      }
    } catch {
      toast.error('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-card" />
  }

  return (
    <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
      <div className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-semibold tracking-tight">Identity</h3>
        <TextField
          label="Full name *"
          id="profile-name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="Joerel Epiz"
          required
        />
        <TextField
          label="Professional title *"
          id="profile-title"
          value={form.title}
          onChange={(v) => setForm({ ...form, title: v })}
          placeholder="Full-Stack Developer"
          required
        />
        <TextField
          label="Tagline *"
          id="profile-tagline"
          value={form.tagline}
          onChange={(v) => setForm({ ...form, tagline: v })}
          placeholder="I build fast, delightful products for the web."
          required
        />
        <TextAreaField
          label="Bio *"
          id="profile-bio"
          value={form.bio}
          onChange={(v) => setForm({ ...form, bio: v })}
          placeholder="Tell visitors about yourself…"
          rows={6}
          required
        />
      </div>

      <div className="grid content-start gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
        <h3 className="font-semibold tracking-tight">Details & links</h3>
        <TextField
          label="Email *"
          id="profile-email"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          placeholder="you@example.com"
          required
        />
        <TextField
          label="Location *"
          id="profile-location"
          value={form.location}
          onChange={(v) => setForm({ ...form, location: v })}
          placeholder="Manila, Philippines"
          required
        />
        <div className="grid gap-1.5">
          <Label htmlFor="profile-years">Years of experience *</Label>
          <input
            id="profile-years"
            type="number"
            min={0}
            max={60}
            value={form.yearsExp}
            onChange={(e) => setForm({ ...form, yearsExp: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            required
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
          <Label htmlFor="profile-availability" className="cursor-pointer">
            Available for new projects
          </Label>
          <Switch
            id="profile-availability"
            checked={form.availability}
            onCheckedChange={(checked) => setForm({ ...form, availability: checked })}
          />
        </div>

        <TextField
          label="GitHub URL"
          id="profile-github"
          type="url"
          value={form.githubUrl}
          onChange={(v) => setForm({ ...form, githubUrl: v })}
          placeholder="https://github.com/JoerelEpiz"
        />
        <TextField
          label="LinkedIn URL"
          id="profile-linkedin"
          type="url"
          value={form.linkedinUrl}
          onChange={(v) => setForm({ ...form, linkedinUrl: v })}
          placeholder="https://linkedin.com/in/…"
        />
        <TextField
          label="Twitter / X URL"
          id="profile-twitter"
          type="url"
          value={form.twitterUrl}
          onChange={(v) => setForm({ ...form, twitterUrl: v })}
          placeholder="https://x.com/…"
        />

        <Button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Save profile
        </Button>
      </div>
    </form>
  )
}
