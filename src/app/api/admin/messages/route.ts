import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAdminRequest, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/** GET /api/admin/messages — list all contact messages (newest first). */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized()
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ messages })
  } catch (error) {
    console.error('GET /api/admin/messages failed:', error)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}
