'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Code2, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter()
  const [password, setPassword] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        toast.success('Welcome back, admin!')
        onSuccess()
        router.refresh()
      } else {
        const json = await res.json().catch(() => null)
        toast.error(json?.error ?? 'Login failed')
      }
    } catch {
      toast.error('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xl sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Lock className="h-5.5 w-5.5" aria-hidden />
            </span>
            <h1 className="text-xl font-semibold tracking-tight">Admin dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Enter your admin password to manage the portfolio content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
            <Code2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              Default password is <code className="font-mono">admin123</code> — change it
              via <code className="font-mono">ADMIN_PASSWORD</code> in your .env file.
            </span>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <a href="#top" className="underline-offset-4 hover:underline">
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  )
}
