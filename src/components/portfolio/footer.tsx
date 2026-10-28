import { Code2, Github, Linkedin, Twitter } from 'lucide-react'
import type { Profile } from './types'

type FooterProps = {
  profile: Profile | null
}

export function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Code2 className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm">{profile?.name ?? 'Portfolio'}</span>
          </a>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#projects" className="transition-colors hover:text-foreground">
                  Projects
                </a>
              </li>
              <li>
                <a href="#experience" className="transition-colors hover:text-foreground">
                  Experience
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <ul className="flex items-center gap-1">
            {profile?.githubUrl ? (
              <li>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Github className="h-4.5 w-4.5" aria-hidden />
                </a>
              </li>
            ) : null}
            {profile?.linkedinUrl ? (
              <li>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Linkedin className="h-4.5 w-4.5" aria-hidden />
                </a>
              </li>
            ) : null}
            {profile?.twitterUrl ? (
              <li>
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter profile"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Twitter className="h-4.5 w-4.5" aria-hidden />
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {profile?.name ?? 'Portfolio'}. Built with Next.js, Tailwind CSS,
            Prisma & PostgreSQL. All rights reserved.
          </p>
          <a
            href="#admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 transition-colors hover:border-emerald-500/40 hover:text-foreground"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}
