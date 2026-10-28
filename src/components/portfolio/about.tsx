'use client'

import { motion } from 'framer-motion'
import { Compass, Layout, PencilRuler, Rocket } from 'lucide-react'
import { SectionHeading } from './section-heading'
import type { Profile } from './types'

type AboutProps = {
  profile: Profile | null
}

const focusAreas = [
  {
    icon: Layout,
    title: 'Interface Engineering',
    text: 'Pixel-accurate, accessible UIs with React and Tailwind — responsive down to the smallest viewport.',
  },
  {
    icon: Compass,
    title: 'Product Thinking',
    text: 'From user flows to shipping: I care about the why behind every feature, not just the how.',
  },
  {
    icon: PencilRuler,
    title: 'Design Systems',
    text: 'Reusable component libraries and tokens that keep products consistent as teams scale.',
  },
  {
    icon: Rocket,
    title: 'Performance',
    text: 'Core Web Vitals budgets, streaming SSR and smart caching to keep everything feeling instant.',
  },
]

export function About({ profile }: AboutProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-20 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About me"
          title="Turning ideas into polished products"
          description="A quick look at who I am, how I work, and what I bring to a team."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Bio card — spans more space */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8 lg:col-span-3"
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
            />
            <h3 id="about-heading" className="text-xl font-semibold tracking-tight">
              Hi again — I&apos;m {profile?.name?.split(' ')[0] ?? 'glad you stopped by'}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {profile?.bio ??
                'I am a developer passionate about building modern, performant web applications with clean architecture and thoughtful design.'}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              When I&apos;m not shipping features, you&apos;ll find me contributing to open
              source, writing about frontend architecture, or mentoring junior developers.
              I believe the best products come from teams that value craft, honest
              feedback, and iterating quickly based on real user data.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Location
                </dt>
                <dd className="mt-1 font-medium">{profile?.location ?? 'Remote'}</dd>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  Status
                </dt>
                <dd className="mt-1 font-medium text-emerald-600 dark:text-emerald-400">
                  {profile?.availability ? 'Open to opportunities' : 'Currently booked'}
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Focus areas */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1 xl:grid-cols-2">
            {focusAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                className="group rounded-2xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 transition-colors dark:text-emerald-400">
                  <area.icon className="h-5 w-5" aria-hidden />
                </span>
                <h4 className="mt-3 text-sm font-semibold tracking-tight">{area.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {area.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
