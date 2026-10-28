// Creates the "portfolio_db" database (and role) if missing.
// Connects to the always-present "postgres" database as admin, then issues DDL.
// Works with the bundled cluster (superuser = portfolio) and with a system PostgreSQL.
import { PrismaClient } from '@prisma/client'

const base =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgresql://portfolio:portfolio_secret@127.0.0.1:5432/portfolio_db'

// target database name from the URL (e.g. .../portfolio_db)
const dbName = (base.match(/\/([^/?]+)(\?|$)/) || [])[1] || 'portfolio_db'

// point the admin connection at the "postgres" maintenance database
const adminUrl = base.replace(/\/([^/?]+)(\?|$)/, '/postgres$2')

const admin = new PrismaClient({
  datasources: { db: { url: adminUrl } },
})

async function main() {
  // 1. role (no-op when it already exists, e.g. bundled cluster superuser)
  await admin.$executeRawUnsafe(`DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'portfolio') THEN
      CREATE ROLE portfolio LOGIN PASSWORD 'portfolio_secret';
    END IF;
  END $$;`)

  // 2. database (no-op when it already exists)
  const rows = await admin.$queryRawUnsafe(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    dbName
  )
  if (Array.isArray(rows) && rows.length > 0) {
    console.log(`✓ database ${dbName} already exists`)
  } else {
    await admin.$executeRawUnsafe(
      `CREATE DATABASE "${dbName.replace(/"/g, '')}" OWNER portfolio`
    )
    console.log(`✓ database ${dbName} created`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('✗ database bootstrap failed:', e.message)
    process.exit(1)
  })
