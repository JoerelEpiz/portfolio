import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'portfolio_admin_session'
const TOKEN_PREFIX = 'portfolio-admin::v1::'

export const DEFAULT_ADMIN_PASSWORD = 'admin123'

/**
 * Derives a stateless session token from the admin password.
 * The token lives in an httpOnly cookie and is verified by
 * recomputing the hash from ADMIN_PASSWORD on every request.
 */
export function getAdminToken(password: string): string {
  return createHash('sha256').update(`${TOKEN_PREFIX}${password}`).digest('hex')
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD
}

export function isUsingDefaultPassword(): boolean {
  return getAdminPassword() === DEFAULT_ADMIN_PASSWORD
}

export function isAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  return !!token && token === getAdminToken(getAdminPassword())
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
