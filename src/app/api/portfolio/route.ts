import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/portfolio
 * Returns the full portfolio dataset from PostgreSQL:
 * profile, skills, projects, experiences.
 */
export async function GET() {
  try {
    const [profile, skills, projects, experiences] = await Promise.all([
      db.profile.findFirst({ orderBy: { createdAt: 'asc' } }),
      db.skill.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] }),
      db.project.findMany({ orderBy: { sortOrder: 'asc' } }),
      db.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])

    return NextResponse.json({ profile, skills, projects, experiences })
  } catch (error) {
    console.error('GET /api/portfolio failed:', error)
    return NextResponse.json(
      { error: 'Failed to load portfolio data' },
      { status: 500 }
    )
  }
}
