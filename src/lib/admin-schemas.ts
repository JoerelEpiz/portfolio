import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug may only contain lowercase letters, numbers and dashes'
    )
    .max(120)
    .optional()
    .or(z.literal('')),
  description: z.string().trim().min(10).max(2000),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  imageUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  liveUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  repoUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(999).default(0),
})

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(60),
  category: z.string().trim().min(1).max(40),
  level: z.number().int().min(0).max(100),
  icon: z.string().trim().max(40).optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).max(999).default(0),
})

export const experienceSchema = z.object({
  company: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  description: z.string().trim().min(10).max(3000),
  type: z.enum(['work', 'education']),
  startDate: z.string().min(4).max(40),
  endDate: z.string().max(40).optional().or(z.literal('')),
  current: z.boolean().default(false),
  location: z.string().trim().max(120).optional().or(z.literal('')),
  sortOrder: z.number().int().min(0).max(999).default(0),
})

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  title: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(200),
  bio: z.string().trim().min(10).max(3000),
  email: z.string().trim().email().max(200),
  location: z.string().trim().min(1).max(120),
  availability: z.boolean().default(true),
  yearsExp: z.number().int().min(0).max(60),
  githubUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  linkedinUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  twitterUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
})

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

export function serializeProjectInput(data: z.infer<typeof projectSchema>) {
  return {
    title: data.title,
    slug: data.slug ? data.slug : slugify(data.title),
    description: data.description,
    tags: data.tags,
    imageUrl: data.imageUrl || null,
    liveUrl: data.liveUrl || null,
    repoUrl: data.repoUrl || null,
    featured: data.featured,
    sortOrder: data.sortOrder,
  }
}

export function serializeSkillInput(data: z.infer<typeof skillSchema>) {
  return {
    name: data.name,
    category: data.category,
    level: data.level,
    icon: data.icon || null,
    sortOrder: data.sortOrder,
  }
}

export function serializeExperienceInput(data: z.infer<typeof experienceSchema>) {
  const start = new Date(data.startDate)
  if (Number.isNaN(start.getTime())) throw new Error('Invalid start date')
  const end = data.current || !data.endDate ? null : new Date(data.endDate)
  if (end && Number.isNaN(end.getTime())) throw new Error('Invalid end date')
  return {
    company: data.company,
    role: data.role,
    description: data.description,
    type: data.type,
    startDate: start,
    endDate: end,
    current: data.current,
    location: data.location || null,
    sortOrder: data.sortOrder,
  }
}

export function serializeProfileInput(data: z.infer<typeof profileSchema>) {
  return {
    name: data.name,
    title: data.title,
    tagline: data.tagline,
    bio: data.bio,
    email: data.email,
    location: data.location,
    availability: data.availability,
    yearsExp: data.yearsExp,
    githubUrl: data.githubUrl || null,
    linkedinUrl: data.linkedinUrl || null,
    twitterUrl: data.twitterUrl || null,
  }
}
