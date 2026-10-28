#!/bin/bash
# ============================================================
#  Portfolio — ONE-COMMAND Mac setup  (no Homebrew required)
#
#      ./scripts/mac-setup.sh
#
#  What it does:
#    1. Makes sure a JavaScript runtime exists (installs Bun via
#       its official installer if neither Bun nor Node is present)
#    2. Installs project dependencies
#    3. Starts the BUNDLED PostgreSQL (works on Apple Silicon and
#       Intel — universal binaries, data stored inside the project)
#    4. Creates the database, tables and starter content
#
#  Afterwards, start the site any time with:
#      npm run dev:mac      (or: bun run dev:mac)
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "=========================================="
echo " Portfolio — first-time Mac setup"
echo "=========================================="

# downloaded zips carry a quarantine flag — remove it so nothing gets blocked
xattr -dr com.apple.quarantine . 2>/dev/null || true

if [ "$(uname -s)" != "Darwin" ]; then
  echo "⚠️  This script targets macOS. On Linux/WSL install PostgreSQL 16 manually, then:"
  echo "      cp .env.example .env && bun install && bun run db:setup && bun run dev:local"
  exit 1
fi

# ---------- 1. JavaScript runtime ----------
if ! command -v bun >/dev/null 2>&1 && ! command -v node >/dev/null 2>&1; then
  echo "📦 No Bun/Node found — installing Bun (self-contained, no Homebrew)..."
  curl -fsSL https://bun.sh/install | bash
fi
export PATH="$HOME/.bun/bin:$PATH"
if command -v bun >/dev/null 2>&1; then
  echo "✅ Bun $(bun --version)"
else
  echo "✅ Node $(node --version)"
fi

# ---------- 2. dependencies ----------
if [ ! -d node_modules ]; then
  echo "📥 Installing dependencies (one-time, ~1 min)..."
  if command -v bun >/dev/null 2>&1; then bun install; else npm install; fi
else
  echo "✅ Dependencies already installed"
fi
echo "🧬 Generating Prisma client..."
./node_modules/.bin/prisma generate >/dev/null
echo "✅ Prisma client ready"

# ---------- 3. environment file ----------
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "✏️  Created .env — admin dashboard password is 'admin123'."
  echo "    Change it anytime: edit ADMIN_PASSWORD in .env"
fi

# ---------- 4. database (bundled PostgreSQL, auto-starts) ----------
sh scripts/pg-auto.sh

# ---------- 5. tables + starter content ----------
echo "🗄  Creating tables + loading starter content..."
sh scripts/with-pg-env.sh ./node_modules/.bin/prisma db push --accept-data-loss >/dev/null
echo "✅ Tables created"
if command -v bun >/dev/null 2>&1; then
  sh scripts/with-pg-env.sh bun prisma/seed.ts
else
  sh scripts/with-pg-env.sh npx -y tsx prisma/seed.ts
fi

# ---------- done ----------
echo ""
echo "=========================================="
echo " 🎉 Setup complete!"
echo "=========================================="
echo ""
echo " Start the site now (or anytime later):"
echo ""
echo "     npm run dev:mac          (or: bun run dev:mac)"
echo ""
echo " →  http://localhost:3000"
echo " →  Admin dashboard: http://localhost:3000/#admin"
echo ""
echo " Troubleshooting & daily usage: see README-MAC.md"
echo ""
