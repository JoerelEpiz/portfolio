'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CheckCheck, Mail, MailOpen, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from './form-bits'
import type { Message } from '../portfolio/types'

export function MessagesPanel() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selected, setSelected] = React.useState<Message | null>(null)
  const [pendingDelete, setPendingDelete] = React.useState<Message | null>(null)

  const load = React.useCallback(async () => {
    const res = await fetch('/api/admin/messages')
    const json = await res.json()
    setMessages(json.messages ?? [])
    setLoading(false)
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  async function toggleRead(message: Message) {
    const res = await fetch(`/api/admin/messages/${message.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !message.read }),
    })
    if (res.ok) {
      toast.success(!message.read ? 'Marked as read' : 'Marked as unread')
      setSelected(null)
      load()
    } else {
      toast.error('Failed to update message')
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    const res = await fetch(`/api/admin/messages/${pendingDelete.id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      toast.success('Message deleted')
      setSelected(null)
      setPendingDelete(null)
      load()
    } else {
      toast.error('Failed to delete message')
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Contact messages</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread of ${messages.length} total`
              : `${messages.length} total — all caught up!`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState text="No messages yet — they will appear here when someone submits the contact form." />
      ) : (
        <ul className="grid max-h-[32rem] gap-3 overflow-y-auto pr-1">
          {messages.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => {
                  setSelected(m)
                  if (!m.read) toggleRead(m)
                }}
                className={`w-full rounded-xl border p-4 text-left transition-all hover:border-emerald-500/40 ${
                  m.read
                    ? 'border-border/60 bg-card'
                    : 'border-emerald-500/30 bg-emerald-500/5'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        m.read
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {m.read ? <MailOpen className="h-4 w-4" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {m.name}{' '}
                        <span className="font-normal text-muted-foreground">
                          · {m.email}
                        </span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.subject || '(no subject)'}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {format(new Date(m.createdAt), 'MMM d, yyyy · HH:mm')}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Message reader dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 pr-6">
                  {selected.subject || '(no subject)'}
                  {!selected.read ? (
                    <Badge className="rounded-full bg-emerald-600 text-[11px] text-white">
                      New
                    </Badge>
                  ) : null}
                </DialogTitle>
                <DialogDescription>
                  From {selected.name} · {selected.email} ·{' '}
                  {format(new Date(selected.createdAt), 'MMM d, yyyy HH:mm')}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap rounded-xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed">
                {selected.body}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => toggleRead(selected)}
                >
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                  Mark as {selected.read ? 'unread' : 'read'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  asChild
                >
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}>
                    Reply by email
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-auto gap-1.5"
                  onClick={() => setPendingDelete(selected)}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Delete
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the message from {pendingDelete?.name} ({pendingDelete?.email}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
