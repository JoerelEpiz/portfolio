import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { experienceSchema, serializeExperienceInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** PUT /api/admin/experiences/[id] — update an experience entry. */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    const parsed = experienceSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const experience = await db.experience.update({
      where: { id },
      data: serializeExperienceInput(parsed.data),
    })
    return NextResponse.json({ ok: true, experience })
  } catch (error) {
    console.error('PUT /api/admin/experiences/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

/** DELETE /api/admin/experiences/[id] — delete an experience entry. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    await db.experience.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/experiences/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
