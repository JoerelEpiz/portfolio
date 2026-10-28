import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'
import { projectSchema, serializeProjectInput } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

/** PUT /api/admin/projects/[id] — update a project. */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    const parsed = projectSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 }
      )
    }
    const project = await db.project.update({
      where: { id },
      data: serializeProjectInput(parsed.data),
    })
    return NextResponse.json({ ok: true, project })
  } catch (error) {
    console.error('PUT /api/admin/projects/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

/** DELETE /api/admin/projects/[id] — delete a project. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    await db.project.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/projects/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
