'use client'

import * as React from 'react'
import { Navbar } from './navbar'
import { Hero } from './hero'
import { Marquee } from './marquee'
import { About } from './about'
import { Skills } from './skills'
import { Projects } from './projects'
import { Experience } from './experience'
import { Contact } from './contact'
import { Footer } from './footer'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import type { Profile, Skill, Project, Experience as ExperienceType } from './types'

type SiteShellProps = {
  profile: Profile | null
  skills: Skill[]
  projects: Project[]
  experiences: ExperienceType[]
}

/**
 * Client shell that routes between the public portfolio and the
 * admin dashboard based on the URL hash (#admin). This keeps the
 * whole app on a single page route while feeling like two apps.
 */
export function SiteShell({ profile, skills, projects, experiences }: SiteShellProps) {
  const [view, setView] = React.useState<'portfolio' | 'admin'>('portfolio')

  React.useEffect(() => {
    const sync = () =>
      setView(window.location.hash === '#admin' ? 'admin' : 'portfolio')
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  if (view === 'admin') {
    return <AdminDashboard />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar name={profile?.name ?? 'Portfolio'} />
      <main className="flex-1">
        <Hero
          profile={profile}
          projectCount={projects.length}
          skillCount={skills.length}
        />
        <Marquee />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  )
}
