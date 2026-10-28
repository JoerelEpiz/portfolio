import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

const patchSchema = z.object({ read: z.boolean() })

/** PATCH /api/admin/messages/[id] — mark a message read/unread. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    const parsed = patchSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const message = await db.message.update({
      where: { id },
      data: { read: parsed.data.read },
    })
    return NextResponse.json({ ok: true, message })
  } catch (error) {
    console.error('PATCH /api/admin/messages/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

/** DELETE /api/admin/messages/[id] — permanently delete a message. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const { id } = await params
    await db.message.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/admin/messages/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
