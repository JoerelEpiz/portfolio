#!/bin/bash
# Wipes ALL portfolio data and re-loads the starter content.
#     ./scripts/reset-data.sh
# The site can stay running — data resets in place.
set -euo pipefail
cd "$(dirname "$0")/.."

sh scripts/pg-auto.sh

RUNNER=""
if command -v bun  >/dev/null 2>&1; then RUNNER="bun"; fi
if [ -z "$RUNNER" ] && command -v node >/dev/null 2>&1; then RUNNER="node"; fi
if [ -z "$RUNNER" ]; then
  echo "❌ Need Bun or Node on PATH."
  exit 1
fi

set -a; . ./.env 2>/dev/null || true; set +a

echo "🗑  Dropping and recreating portfolio_db..."
"$RUNNER" scripts/db-reset.mjs

echo "🗄  Re-creating tables..."
./node_modules/.bin/prisma db push --accept-data-loss >/dev/null

echo "🌱 Re-seeding starter content..."
if [ "$RUNNER" = "bun" ]; then
  bun prisma/seed.ts
else
  npx -y tsx prisma/seed.ts
fi

echo ""
echo "✅ Data reset complete — refresh http://localhost:3000"
