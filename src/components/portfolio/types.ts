export type Profile = {
  id: string
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  location: string
  availability: boolean
  yearsExp: number
  githubUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
}

export type Skill = {
  id: string
  name: string
  category: string
  level: number
  icon: string | null
  sortOrder: number
}

export type Project = {
  id: string
  title: string
  slug: string
  description: string
  tags: string[]
  imageUrl: string | null
  liveUrl: string | null
  repoUrl: string | null
  featured: boolean
  sortOrder: number
}

export type Experience = {
  id: string
  company: string
  role: string
  description: string
  type: string
  startDate: string
  endDate: string | null
  current: boolean
  location: string | null
  sortOrder: number
}

export type PortfolioData = {
  profile: Profile | null
  skills: Skill[]
  projects: Project[]
  experiences: Experience[]
}

export type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  body: string
  read: boolean
  createdAt: string
}
