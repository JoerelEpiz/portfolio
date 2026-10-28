import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, getAdminToken, getAdminPassword } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/login
 * Body: { password: string }
 * Sets an httpOnly session cookie valid for 7 days.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!password || password !== getAdminPassword()) {
      return NextResponse.json(
        { error: 'Incorrect admin password' },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE, getAdminToken(password), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (error) {
    console.error('POST /api/admin/login failed:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
