import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { profileSchema, serializeProfileInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** GET /api/admin/profile — get the profile. */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const profile = await db.profile.findFirst({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('GET /api/admin/profile failed:', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

/** PUT /api/admin/profile — update (or create) the profile. */
export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const parsed = profileSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const data = serializeProfileInput(parsed.data)
    const existing = await db.profile.findFirst({ orderBy: { createdAt: 'asc' } })

    const profile = existing
      ? await db.profile.update({ where: { id: existing.id }, data })
      : await db.profile.create({ data })

    return NextResponse.json({ ok: true, profile })
  } catch (error) {
    console.error('PUT /api/admin/profile failed:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
