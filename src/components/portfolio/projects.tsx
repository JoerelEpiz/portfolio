'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionHeading } from './section-heading'
import type { Project } from './types'

// Deterministic gradient per project slug — keeps covers unique but stable
const gradients = [
  'from-emerald-500/80 via-teal-500/60 to-cyan-600/70',
  'from-teal-500/80 via-emerald-600/50 to-zinc-700/70',
  'from-lime-500/70 via-emerald-500/60 to-teal-700/70',
  'from-cyan-500/70 via-teal-500/50 to-emerald-700/70',
  'from-emerald-600/80 via-lime-600/40 to-teal-800/70',
  'from-teal-600/80 via-cyan-500/50 to-emerald-700/70',
]

function coverGradient(slug: string) {
  let hash = 0
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  return gradients[hash % gradients.length]
}

type ProjectsProps = {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work I'm proud of"
          description="A mix of featured case studies and open-source experiments — all built end to end."
        />

        {/* Featured projects */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5"
            >
              {/* Cover */}
              <div
                className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br ${coverGradient(project.slug)}`}
              >
                <div className="bg-dots absolute inset-0 text-white/50" aria-hidden />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-2xl font-bold text-white backdrop-blur-sm">
                  {project.title.charAt(0)}
                </span>
                <span className="absolute left-4 top-4 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  Featured
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">{project.title}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    {project.liveUrl ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open live site of ${project.title}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    {project.repoUrl ? (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open source code of ${project.title}`}
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Badge
                        variant="secondary"
                        className="rounded-full border-transparent bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        {tag}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Other projects — compact list */}
        {others.length > 0 ? (
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              More experiments
            </h3>
            <ul className="mt-4 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card">
              {others.map((project) => (
                <li
                  key={project.id}
                  className="group flex flex-col gap-3 p-5 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium tracking-tight">{project.title}</h4>
                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open source code of ${project.title}`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ul className="hidden flex-wrap gap-1.5 md:flex" aria-hidden>
                      {project.tags.slice(0, 3).map((tag) => (
                        <li key={tag}>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {project.liveUrl ? (
                      <Button variant="ghost" size="sm" className="gap-1" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noreferrer">
                          Visit
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
