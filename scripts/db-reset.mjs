// Wipes the portfolio_db database completely (drop + recreate), then
// `reset-data.sh` re-pushes the schema and re-seeds starter content.
import { PrismaClient } from '@prisma/client'

const base =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'postgresql://portfolio:portfolio_secret@127.0.0.1:5432/portfolio_db'

const dbName = (base.match(/\/([^/?]+)(\?|$)/) || [])[1] || 'portfolio_db'
const adminUrl = base.replace(/\/([^/?]+)(\?|$)/, '/postgres$2')

const admin = new PrismaClient({
  datasources: { db: { url: adminUrl } },
})

async function main() {
  await admin.$executeRawUnsafe(
    `DROP DATABASE IF EXISTS "${dbName.replace(/"/g, '')}" WITH (FORCE)`
  )
  console.log(`✓ database ${dbName} dropped`)
  await admin.$executeRawUnsafe(
    `CREATE DATABASE "${dbName.replace(/"/g, '')}" OWNER portfolio`
  )
  console.log(`✓ database ${dbName} recreated (empty)`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('✗ database reset failed:', e.message)
    process.exit(1)
  })
