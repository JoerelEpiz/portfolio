#!/bin/bash
# Starts the database and the site together.
#   npm run dev:mac      (or: bun run dev:mac)
# The bundled PostgreSQL starts/stops with the app (Ctrl+C stops both).
set -euo pipefail
cd "$(dirname "$0")/.."

sh scripts/pg-auto.sh

# only attach the auto-stop when the bundled cluster is in use
if [ -d db/pgdata-mac/base ]; then
  trap 'sh scripts/pg-stop-mac.sh >/dev/null 2>&1 || true' EXIT
fi

echo ""
echo "🌐  Site : http://localhost:3000"
echo "🔐  Admin: http://localhost:3000/#admin   (password in .env)"
echo "🛑  Stop : press Ctrl+C (database stops with the app)"
echo ""

./node_modules/.bin/next dev -p 3000
