'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  UserRound,
  Wrench,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AdminLogin } from './admin-login'
import { OverviewPanel } from './overview-panel'
import { MessagesPanel } from './messages-panel'
import { ProjectsPanel } from './projects-panel'
import { SkillsPanel } from './skills-panel'
import { ExperiencesPanel } from './experiences-panel'
import { ProfilePanel } from './profile-panel'

type TabKey = 'overview' | 'messages' | 'projects' | 'skills' | 'experiences' | 'profile'

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'messages', label: 'Messages', icon: Mail },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'skills', label: 'Skills', icon: Wrench },
  { key: 'experiences', label: 'Experience', icon: Briefcase },
  { key: 'profile', label: 'Profile', icon: UserRound },
]

export function AdminDashboard() {
  const router = useRouter()
  const [status, setStatus] = React.useState<'checking' | 'guest' | 'authed'>('checking')
  const [usingDefaultPassword, setUsingDefaultPassword] = React.useState(false)
  const [tab, setTab] = React.useState<TabKey>('overview')
  const [refreshKey, setRefreshKey] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setUsingDefaultPassword(Boolean(data.usingDefaultPassword))
        setStatus(data.authenticated ? 'authed' : 'guest')
      })
      .catch(() => !cancelled && setStatus('guest'))
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Signed out')
    setStatus('guest')
    router.refresh()
  }

  function goBackToSite() {
    window.location.hash = ''
    window.scrollTo({ top: 0 })
  }

  if (status === 'checking') {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    )
  }

  if (status === 'guest') {
    return <AdminLogin onSuccess={() => setRefreshKey((k) => k + 1)} />
  }

  return (
    <div className="min-h-[100svh] bg-muted/30">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Admin Dashboard</p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                Portfolio content management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={goBackToSite}>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">View site</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <nav
          aria-label="Admin sections"
          className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6"
        >
          <ul className="flex gap-1 pb-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? 'page' : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    tab === key
                      ? 'bg-emerald-600 text-white'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === 'overview' ? (
          <OverviewPanel
            usingDefaultPassword={usingDefaultPassword}
            onNavigate={(key) => setTab(key as TabKey)}
          />
        ) : null}
        {tab === 'messages' ? <MessagesPanel /> : null}
        {tab === 'projects' ? <ProjectsPanel /> : null}
        {tab === 'skills' ? <SkillsPanel /> : null}
        {tab === 'experiences' ? <ExperiencesPanel /> : null}
        {tab === 'profile' ? <ProfilePanel /> : null}
      </main>
    </div>
  )
}
