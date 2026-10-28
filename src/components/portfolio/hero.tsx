'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Github,
  Linkedin,
  MapPin,
  Twitter,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Profile } from './types'

type HeroProps = {
  profile: Profile | null
  projectCount: number
  skillCount: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 * i, ease: 'easeOut' as const },
  }),
}

export function Hero({ profile, projectCount, skillCount }: HeroProps) {
  const name = profile?.name ?? 'My Portfolio'
  const firstName = name.split(' ')[0]
  const lastName = name.split(' ').slice(1).join(' ')

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* Background effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 text-foreground/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]">
          <div className="bg-dots h-full w-full" />
        </div>
        <div className="animate-blob absolute -top-24 right-[10%] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div
          className="animate-blob absolute bottom-[10%] left-[5%] h-80 w-80 rounded-full bg-teal-500/15 blur-3xl"
          style={{ '--blob-delay': '-6s' } as React.CSSProperties}
        />
        <div
          className="animate-blob absolute left-[40%] top-[30%] h-64 w-64 rounded-full bg-lime-500/10 blur-3xl"
          style={{ '--blob-delay': '-11s' } as React.CSSProperties}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <div className="flex flex-col items-start gap-6">
          {/* Availability badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile?.availability ? 'Available for new projects' : 'Currently booked'}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-lime-500 bg-clip-text text-transparent">
              {firstName} {lastName}
            </span>
            <br />
            <span className="text-foreground/90">{profile?.title ?? 'Developer'}</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {profile?.tagline ??
              'Crafting modern web experiences with clean code and thoughtful design.'}
          </motion.p>

          {/* Meta */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            {profile?.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                {profile.location}
              </span>
            ) : null}
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                {profile.email}
              </a>
            ) : null}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="flex flex-wrap items-center gap-3"
          >
            <a href="#projects">
              <Button
                size="lg"
                className="group rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500"
              >
                View my work
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Button>
            </a>
            <a href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-border/80 bg-background/50 backdrop-blur"
              >
                Get in touch
              </Button>
            </a>
            <div className="ml-1 flex items-center gap-1">
              {profile?.githubUrl ? (
                <Button variant="ghost" size="icon" asChild>
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                    <Github className="h-5 w-5" />
                  </a>
                </Button>
              ) : null}
              {profile?.linkedinUrl ? (
                <Button variant="ghost" size="icon" asChild>
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
              ) : null}
              {profile?.twitterUrl ? (
                <Button variant="ghost" size="icon" asChild>
                  <a href={profile.twitterUrl} target="_blank" rel="noreferrer" aria-label="Twitter profile">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.dl
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mt-6 grid w-full max-w-lg grid-cols-3 gap-4 border-t border-border/60 pt-6"
          >
            {[
              { value: `${profile?.yearsExp ?? 5}+`, label: 'Years experience' },
              { value: `${projectCount}`, label: 'Projects shipped' },
              { value: `${skillCount}`, label: 'Technologies' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="order-2 text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
                <dd className="order-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.a>
    </section>
  )
}
