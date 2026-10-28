'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeading } from './section-heading'
import type { Profile } from './types'

type ContactProps = {
  profile: Profile | null
}

export function Contact({ profile }: ContactProps) {
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          body: data.get('body'),
        }),
      })

      const json = await res.json()

      if (res.ok) {
        toast.success('Message sent!', {
          description: "Thanks for reaching out — I'll get back to you soon.",
        })
        form.reset()
      } else {
        const firstIssue = json?.issues?.[0]?.message
        toast.error(firstIssue ?? json?.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error — please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something together"
          description="Have a project in mind, a role to fill, or just want to say hi? My inbox is always open."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8 lg:col-span-2"
          >
            <div
              aria-hidden
              className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
            />
            <h3 className="text-lg font-semibold tracking-tight">Contact details</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              I usually reply within one business day. For project inquiries, a short
              brief with your goals and timeline helps me respond faster and better.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              {profile?.email ? (
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-4 transition-all hover:border-emerald-500/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                      <Mail className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-xs text-muted-foreground">Email</span>
                      <span className="font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {profile.email}
                      </span>
                    </span>
                  </a>
                </li>
              ) : null}
              {profile?.location ? (
                <li className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-muted-foreground">Based in</span>
                    <span className="font-medium">{profile.location}</span>
                  </span>
                </li>
              ) : null}
            </ul>

            <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm">
              <p className="font-medium text-emerald-700 dark:text-emerald-400">
                {profile?.availability ? 'Currently available' : 'Currently booked'}
              </p>
              <p className="mt-1 text-muted-foreground">
                {profile?.availability
                  ? 'Taking on select freelance and contract projects for this quarter.'
                  : 'My schedule is full right now, but I am happy to chat about future collaborations.'}
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="contact-name">Name *</Label>
                  <Input
                    id="contact-name"
                    name="name"
                    placeholder="Jane Smith"
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Email *</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="jane@company.com"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  name="subject"
                  placeholder="Project inquiry, collaboration, role…"
                  maxLength={150}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-body">Message *</Label>
                <Textarea
                  id="contact-body"
                  name="body"
                  placeholder="Tell me a little about your project — goals, timeline, budget range…"
                  rows={6}
                  required
                  minLength={10}
                  maxLength={5000}
                  className="resize-y"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 sm:w-auto sm:justify-self-end"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Send className="h-4 w-4" aria-hidden />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Your message is stored securely in my PostgreSQL database and delivered
                straight to my inbox — no third parties involved.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
