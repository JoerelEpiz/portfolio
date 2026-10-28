import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.POSTGRES_URL ||
        process.env.DATABASE_URL ||
        'postgresql://portfolio:portfolio_secret@127.0.0.1:5432/portfolio_db',
    },
  },
})

async function main() {
  // ---- Profile ----
  await prisma.profile.deleteMany()
  await prisma.profile.create({
    data: {
      name: 'Joerel Epiz',
      title: 'Full-Stack Developer',
      tagline: 'I build fast, delightful products for the web.',
      bio: 'Full-stack developer who loves turning ideas into polished, production-ready web apps. I work across the whole stack — Next.js and TypeScript on the frontend, Node.js APIs and PostgreSQL on the backend — with a strong eye for design systems, performance and accessibility. Everything on this site is managed through my built-in admin dashboard.',
      email: 'hello@joerelepiz.dev',
      location: 'Manila, Philippines',
      availability: true,
      yearsExp: 3,
      githubUrl: 'https://github.com/JoerelEpiz',
      linkedinUrl: 'https://linkedin.com',
      twitterUrl: 'https://x.com',
    },
  })

  // ---- Skills ----
  await prisma.skill.deleteMany()
  const skills: {
    name: string
    category: string
    level: number
    icon?: string
    sortOrder: number
  }[] = [
    // Frontend
    { name: 'React', category: 'Frontend', level: 95, icon: 'Atom', sortOrder: 1 },
    { name: 'Next.js', category: 'Frontend', level: 92, icon: 'Triangle', sortOrder: 2 },
    { name: 'TypeScript', category: 'Frontend', level: 90, icon: 'FileCode2', sortOrder: 3 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 94, icon: 'Wind', sortOrder: 4 },
    { name: 'Framer Motion', category: 'Frontend', level: 85, icon: 'Sparkles', sortOrder: 5 },
    // Backend
    { name: 'Node.js', category: 'Backend', level: 90, icon: 'Server', sortOrder: 1 },
    { name: 'Next.js API Routes', category: 'Backend', level: 90, icon: 'Route', sortOrder: 2 },
    { name: 'Prisma ORM', category: 'Backend', level: 88, icon: 'Database', sortOrder: 3 },
    { name: 'GraphQL', category: 'Backend', level: 78, icon: 'Share2', sortOrder: 4 },
    { name: 'REST APIs', category: 'Backend', level: 93, icon: 'Globe', sortOrder: 5 },
    // Database
    { name: 'PostgreSQL', category: 'Database', level: 88, icon: 'DatabaseZap', sortOrder: 1 },
    { name: 'Redis', category: 'Database', level: 75, icon: 'Zap', sortOrder: 2 },
    { name: 'SQLite', category: 'Database', level: 85, icon: 'HardDrive', sortOrder: 3 },
    // Tools
    { name: 'Git & GitHub', category: 'Tools', level: 92, icon: 'GitBranch', sortOrder: 1 },
    { name: 'Docker', category: 'Tools', level: 80, icon: 'Container', sortOrder: 2 },
    { name: 'Vercel', category: 'Tools', level: 90, icon: 'Cloud', sortOrder: 3 },
    { name: 'Figma', category: 'Tools', level: 76, icon: 'Figma', sortOrder: 4 },
  ]
  await prisma.skill.createMany({ data: skills })

  // ---- Projects ----
  await prisma.project.deleteMany()
  const projects = [
    {
      title: 'Nebula Analytics',
      slug: 'nebula-analytics',
      description:
        'Real-time analytics dashboard for SaaS teams with live charts, anomaly alerts and a SQL explorer. Handles 2M+ events per day.',
      tags: ['Next.js', 'PostgreSQL', 'WebSockets', 'Recharts'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com',
      featured: true,
      sortOrder: 1,
    },
    {
      title: 'Lumen Store',
      slug: 'lumen-store',
      description:
        'Headless e-commerce storefront with cart, Stripe checkout, order tracking and an admin panel. 98+ Lighthouse score.',
      tags: ['Next.js', 'Prisma', 'Stripe', 'Tailwind'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com',
      featured: true,
      sortOrder: 2,
    },
    {
      title: 'Echo Chat',
      slug: 'echo-chat',
      description:
        'Real-time collaboration chat with rooms, typing indicators, file sharing and AI summarization of long threads.',
      tags: ['React', 'Socket.io', 'Redis', 'OpenAI'],
      liveUrl: 'https://example.com',
      repoUrl: 'https://github.com',
      featured: true,
      sortOrder: 3,
    },
    {
      title: 'Pulse Health',
      slug: 'pulse-health',
      description:
        'Mobile-first habit & fitness tracker with streaks, charts and offline sync built on PWA technology.',
      tags: ['PWA', 'IndexedDB', 'Zustand'],
      liveUrl: 'https://example.com',
      featured: false,
      sortOrder: 4,
    },
    {
      title: 'Forge CMS',
      slug: 'forge-cms',
      description:
        'Open-source headless CMS with block-based editing, role-based access and a plugin marketplace.',
      tags: ['Node.js', 'GraphQL', 'PostgreSQL'],
      repoUrl: 'https://github.com',
      featured: false,
      sortOrder: 5,
    },
    {
      title: 'Orbit Docs',
      slug: 'orbit-docs',
      description:
        'Notion-style collaborative documents with rich text editing, comments and version history.',
      tags: ['Next.js', 'CRDT', 'Tiptap', 'PostgreSQL'],
      repoUrl: 'https://github.com',
      featured: false,
      sortOrder: 6,
    },
  ]
  await prisma.project.createMany({ data: projects })

  // ---- Experience ----
  await prisma.experience.deleteMany()
  const experiences = [
    {
      company: 'Stellar Labs',
      role: 'Senior Full-Stack Developer',
      description:
        'Leading the platform team building a multi-tenant SaaS used by 40k+ users. Migrated the monolith to Next.js App Router with a 3x improvement in TTFB, introduced a design system adopted by 4 product teams, and set up CI pipelines that cut release time from hours to minutes.',
      type: 'work',
      startDate: new Date('2023-03-01'),
      endDate: null,
      current: true,
      location: 'Remote',
      sortOrder: 1,
    },
    {
      company: 'Bright Commerce',
      role: 'Frontend Developer',
      description:
        'Built and maintained the storefront of an e-commerce platform serving 500k monthly visitors. Owned checkout performance work that lifted conversion by 12%, and led the migration from CRA to Next.js with zero downtime.',
      type: 'work',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2023-02-01'),
      current: false,
      location: 'Manila, PH',
      sortOrder: 2,
    },
    {
      company: 'PixelWorks Studio',
      role: 'Web Developer',
      description:
        'Delivered 20+ marketing sites and web apps for clients across fintech, health and education. Collaborated directly with designers to translate Figma prototypes into pixel-perfect, responsive interfaces.',
      type: 'work',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2021-05-01'),
      current: false,
      location: 'Manila, PH',
      sortOrder: 3,
    },
    {
      company: 'B.S. Computer Science',
      role: 'University of the Philippines',
      description:
        'Graduated cum laude. Focus on software engineering, databases and distributed systems. Led the dev society and organized the annual campus hackathon.',
      type: 'education',
      startDate: new Date('2015-08-01'),
      endDate: new Date('2019-05-01'),
      current: false,
      location: 'Quezon City, PH',
      sortOrder: 4,
    },
  ]
  await prisma.experience.createMany({ data: experiences })

  const counts = {
    profile: await prisma.profile.count(),
    skills: await prisma.skill.count(),
    projects: await prisma.project.count(),
    experiences: await prisma.experience.count(),
    messages: await prisma.message.count(),
  }
  console.log('Seed complete:', counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
