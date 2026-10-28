import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { projectSchema, serializeProjectInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** GET /api/admin/projects — list all projects. */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const projects = await db.project.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('GET /api/admin/projects failed:', error)
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
  }
}

/** POST /api/admin/projects — create a project. */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const parsed = projectSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const project = await db.project.create({
      data: serializeProjectInput(parsed.data),
    })
    return NextResponse.json({ ok: true, project }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/projects failed:', error)
    return NextResponse.json(
      { error: 'Failed to create project. The slug may already exist.' },
      { status: 500 }
    )
  }
}
