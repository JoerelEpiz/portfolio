import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { experienceSchema, serializeExperienceInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** GET /api/admin/experiences — list all experiences. */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const experiences = await db.experience.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ experiences })
  } catch (error) {
    console.error('GET /api/admin/experiences failed:', error)
    return NextResponse.json({ error: 'Failed to load experiences' }, { status: 500 })
  }
}

/** POST /api/admin/experiences — create an experience entry. */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const parsed = experienceSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const experience = await db.experience.create({
      data: serializeExperienceInput(parsed.data),
    })
    return NextResponse.json({ ok: true, experience }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/experiences failed:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}
