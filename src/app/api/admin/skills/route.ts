import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { skillSchema, serializeSkillInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** GET /api/admin/skills — list all skills. */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const skills = await db.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })
    return NextResponse.json({ skills })
  } catch (error) {
    console.error('GET /api/admin/skills failed:', error)
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 })
  }
}

/** POST /api/admin/skills — create a skill. */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const parsed = skillSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const skill = await db.skill.create({ data: serializeSkillInput(parsed.data) })
    return NextResponse.json({ ok: true, skill }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/skills failed:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
