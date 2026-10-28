import { db } from '@/lib/db'
import { SiteShell } from '@/components/portfolio/site-shell'
import type { PortfolioData, Profile } from '@/components/portfolio/types'

export const dynamic = 'force-dynamic'

async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const [profile, skills, projects, experiences] = await Promise.all([
      db.profile.findFirst({ orderBy: { createdAt: 'asc' } }),
      db.skill.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] }),
      db.project.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    return {
      profile: profile
        ? {
            id: profile.id,
            name: profile.name,
            title: profile.title,
            tagline: profile.tagline,
            bio: profile.bio,
            email: profile.email,
            location: profile.location,
            availability: profile.availability,
            yearsExp: profile.yearsExp,
            githubUrl: profile.githubUrl,
            linkedinUrl: profile.linkedinUrl,
            twitterUrl: profile.twitterUrl,
          }
        : null,
      skills: skills.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        level: s.level,
        icon: s.icon,
        sortOrder: s.sortOrder,
      })),
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        tags: p.tags,
        imageUrl: p.imageUrl,
        liveUrl: p.liveUrl,
        repoUrl: p.repoUrl,
        featured: p.featured,
        sortOrder: p.sortOrder,
      })),
      experiences: experiences.map((e) => ({
        id: e.id,
        company: e.company,
        role: e.role,
        description: e.description,
        type: e.type,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate ? e.endDate.toISOString() : null,
        current: e.current,
        location: e.location,
        sortOrder: e.sortOrder,
      })),
    }
  } catch (error) {
    console.error('Failed to load portfolio data:', error)
    return { profile: null, skills: [], projects: [], experiences: [] }
  }
}

export default async function HomePage() {
  const data = await getPortfolioData()
  const profile: Profile | null = data.profile

  return (
    <SiteShell
      profile={profile}
      skills={data.skills}
      projects={data.projects}
      experiences={data.experiences}
    />
  )
}
