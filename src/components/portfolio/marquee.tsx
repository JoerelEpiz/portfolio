'use client'

const technologies = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'PostgreSQL',
  'Prisma',
  'GraphQL',
  'Docker',
  'Redis',
  'Framer Motion',
  'Git',
]

export function Marquee() {
  const items = [...technologies, ...technologies]

  return (
    <div
      aria-hidden
      className="relative border-y border-border/60 bg-muted/30 py-4 backdrop-blur-sm"
    >
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-10 pr-10">
          {items.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center gap-10 whitespace-nowrap text-sm font-medium tracking-wide text-muted-foreground"
            >
              {tech}
              <span className="h-1 w-1 rounded-full bg-emerald-500/60" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
