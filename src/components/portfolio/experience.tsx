'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin } from 'lucide-react'
import { SectionHeading } from './section-heading'
import type { Experience as ExperienceType } from './types'

function formatMonth(dateIso: string) {
  return new Date(dateIso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

type ExperienceProps = {
  experiences: ExperienceType[]
}

export function Experience({ experiences }: ExperienceProps) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've worked & studied"
          description="Six years of building products across startups, agencies and my own projects."
        />

        <ol className="relative mx-auto mt-14 max-w-3xl">
          {/* Timeline line */}
          <span
            aria-hidden
            className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-emerald-500/60 via-border to-transparent sm:left-[23px]"
          />

          {experiences.map((item, i) => {
            const isWork = item.type === 'work'
            const Icon = isWork ? Briefcase : GraduationCap
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
                className="relative flex gap-4 pb-10 last:pb-0 sm:gap-6"
              >
                {/* Icon node */}
                <span
                  className={`relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border sm:h-12 sm:w-12 ${
                    item.current
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-600 shadow-[0_0_16px_rgba(16,185,129,0.25)] dark:text-emerald-400'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden />
                </span>

                {/* Card */}
                <div className="flex-1 rounded-2xl border border-border/70 bg-card p-5 transition-all hover:border-emerald-500/30 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold tracking-tight">{item.role}</h3>
                      <p className="mt-0.5 text-sm text-emerald-600 dark:text-emerald-400">
                        {item.company}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p className="whitespace-nowrap font-medium text-foreground/80">
                        {formatMonth(item.startDate)} —{' '}
                        {item.current ? 'Present' : item.endDate ? formatMonth(item.endDate) : ''}
                      </p>
                      {item.location ? (
                        <p className="mt-0.5 inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" aria-hidden />
                          {item.location}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  {item.current ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Current role
                    </span>
                  ) : null}
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
