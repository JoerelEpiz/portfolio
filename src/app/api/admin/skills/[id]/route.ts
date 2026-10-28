import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { skillSchema, serializeSkillInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** PUT /api/admin/skills/[id] — update a skill. */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    const parsed = skillSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const skill = await db.skill.update({
      where: { id },
      data: serializeSkillInput(parsed.data),
    })
    return NextResponse.json({ ok: true, skill })
  } catch (error) {
    console.error('PUT /api/admin/skills/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

/** DELETE /api/admin/skills/[id] — delete a skill. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    await db.skill.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/skills/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}
