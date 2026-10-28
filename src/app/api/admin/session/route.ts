import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest, isUsingDefaultPassword } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/session
 * Returns whether the current request has a valid admin session.
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    authenticated: isAdminRequest(req),
    usingDefaultPassword: isUsingDefaultPassword(),
  })
}
