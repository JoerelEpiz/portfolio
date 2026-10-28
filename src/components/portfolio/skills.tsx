'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Atom,
  Cloud,
  Code2,
  Container,
  Database,
  DatabaseZap,
  FileCode2,
  Figma,
  GitBranch,
  Globe,
  HardDrive,
  Route,
  Server,
  Share2,
  Sparkles,
  Triangle,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import type { Skill } from './types'

const iconMap: Record<string, LucideIcon> = {
  Atom,
  Triangle,
  FileCode2,
  Wind,
  Sparkles,
  Server,
  Route,
  Database,
  Share2,
  Globe,
  DatabaseZap,
  Zap,
  HardDrive,
  GitBranch,
  Container,
  Cloud,
  Figma,
}

type SkillsProps = {
  skills: Skill[]
}

export function Skills({ skills }: SkillsProps) {
  const categories = React.useMemo(
    () => ['All', ...Array.from(new Set(skills.map((s) => s.category)))],
    [skills]
  )
  const [active, setActive] = React.useState('All')

  const filtered = React.useMemo(
    () => (active === 'All' ? skills : skills.filter((s) => s.category === active)),
    [skills, active]
  )

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-20 border-y border-border/60 bg-muted/30 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="Tools I reach for every day"
          description="A snapshot of my core stack — refined over years of shipping real products."
        />

        {/* Category filter */}
        <div
          role="tablist"
          aria-label="Skill categories"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={active === category}
              onClick={() => setActive(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active === category
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'border border-border/70 bg-card text-muted-foreground hover:border-emerald-500/40 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <motion.ul
          layout
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((skill, i) => {
            const Icon = (skill.icon && iconMap[skill.icon]) || Code2
            return (
              <motion.li
                layout
                key={skill.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
                className="rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">{skill.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {skill.level}%
                  </span>
                </div>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={skill.level}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${skill.name} proficiency`}
                >
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
                  />
                </div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
