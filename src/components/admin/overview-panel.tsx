'use client'

import * as React from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  FolderKanban,
  Mail,
  Wrench,
} from 'lucide-react'
import { AdminCard, EmptyState } from './form-bits'
import type { Experience, Message, Profile, Project, Skill } from '../portfolio/types'

type OverviewPanelProps = {
  usingDefaultPassword: boolean
  onNavigate: (key: string) => void
}

export function OverviewPanel({ usingDefaultPassword, onNavigate }: OverviewPanelProps) {
  const [data, setData] = React.useState<{
    projects: Project[]
    skills: Skill[]
    experiences: Experience[]
    messages: Message[]
    profile: Profile | null
  } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/api/admin/projects').then((r) => r.json()),
      fetch('/api/admin/skills').then((r) => r.json()),
      fetch('/api/admin/experiences').then((r) => r.json()),
      fetch('/api/admin/messages').then((r) => r.json()),
      fetch('/api/admin/profile').then((r) => r.json()),
    ])
      .then(([p, s, e, m, pr]) => {
        if (cancelled) return
        setData({
          projects: p.projects ?? [],
          skills: s.skills ?? [],
          experiences: e.experiences ?? [],
          messages: m.messages ?? [],
          profile: pr.profile ?? null,
        })
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
    )
  }

  const unread = data.messages.filter((m) => !m.read).length
  const stats = [
    { label: 'Projects', value: data.projects.length, icon: FolderKanban, tab: 'projects' },
    { label: 'Skills', value: data.skills.length, icon: Wrench, tab: 'skills' },
    { label: 'Experience entries', value: data.experiences.length, icon: Briefcase, tab: 'experiences' },
    { label: 'Messages', value: data.messages.length, icon: Mail, tab: 'messages', badge: unread },
  ]

  return (
    <div className="grid gap-6">
      {usingDefaultPassword ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">
              You are using the default admin password
            </p>
            <p className="mt-0.5 text-muted-foreground">
              Open the <code className="font-mono text-xs">.env</code> file, set
              <code className="mx-1 font-mono text-xs">ADMIN_PASSWORD</code>to a strong value, then
              restart the dev server.
            </p>
          </div>
        </div>
      ) : null}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tab: statTab, badge }) => (
          <button
            key={label}
            onClick={() => onNavigate(statTab)}
            className="group rounded-2xl border border-border/70 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-500/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              {badge ? (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {badge} new
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              {label}
              <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest messages */}
        <AdminCard
          title="Latest messages"
          description="Recent inquiries from the contact form."
        >
          {data.messages.length === 0 ? (
            <EmptyState text="No messages yet — they will appear here when someone uses the contact form." />
          ) : (
            <ul className="grid max-h-72 gap-3 overflow-y-auto pr-1">
              {data.messages.slice(0, 5).map((m) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {!m.read ? (
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" aria-label="Unread" />
                      ) : null}
                      {m.name}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {m.subject || m.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        {/* Profile snapshot */}
        <AdminCard
          title="Profile snapshot"
          description="This information powers the hero and about sections."
        >
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{data.profile?.name ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
              <dt className="text-muted-foreground">Title</dt>
              <dd className="font-medium">{data.profile?.title ?? '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
              <dt className="text-muted-foreground">Availability</dt>
              <dd
                className={`font-medium ${
                  data.profile?.availability
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground'
                }`}
              >
                {data.profile?.availability ? 'Open to opportunities' : 'Currently booked'}
              </dd>
            </div>
          </dl>
        </AdminCard>
      </div>
    </div>
  )
}
