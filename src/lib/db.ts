import { PrismaClient } from '@prisma/client'

/**
 * Robust Prisma client for the portfolio app.
 *
 * The sandbox shell exports a legacy SQLite `DATABASE_URL`, which would
 * normally override values from `.env`. We therefore prefer the dedicated
 * `POSTGRES_URL` (loaded from `.env` by Next.js) and fall back to
 * `DATABASE_URL` for standard deployments.
 */
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaUrl: string | undefined
}

function getClient(): PrismaClient {
  // Rebuild the client if the resolved URL changed (e.g. after env hot-reload)
  if (globalForPrisma.prisma && globalForPrisma.prismaUrl === databaseUrl) {
    return globalForPrisma.prisma
  }

  const client = new PrismaClient({
    datasources: {
      db: {
        url:
          databaseUrl ||
          'postgresql://portfolio:portfolio_secret@127.0.0.1:5432/portfolio_db',
      },
    },
  })

  globalForPrisma.prisma = client
  globalForPrisma.prismaUrl = databaseUrl
  return client
}

export const db = getClient()
