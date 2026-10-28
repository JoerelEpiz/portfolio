#!/bin/bash
# Makes sure the 'portfolio' role and 'portfolio_db' database exist.
# Called automatically by pg-auto.sh — you rarely need to run this yourself.
set -euo pipefail
cd "$(dirname "$0")/.."

# --- case 1: bundled cluster (its superuser IS 'portfolio' already) ---
if [ -d db/pgdata-mac/base ]; then
  RUNNER=""
  if command -v bun  >/dev/null 2>&1; then RUNNER="bun"; fi
  if [ -z "$RUNNER" ] && command -v node >/dev/null 2>&1; then RUNNER="node"; fi
  if [ -z "$RUNNER" ]; then
    echo "❌ Need Bun or Node on PATH to manage the database."
    exit 1
  fi
  set -a; . ./.env 2>/dev/null || true; set +a
  "$RUNNER" scripts/db-bootstrap.mjs
  exit 0
fi

# --- case 2: system PostgreSQL (Homebrew / Postgres.app) ---
if command -v psql >/dev/null 2>&1; then
  psql postgres -v ON_ERROR_STOP=1 -q <<'SQL'
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'portfolio') THEN
    CREATE ROLE portfolio LOGIN PASSWORD 'portfolio_secret';
  ELSE
    ALTER ROLE portfolio WITH LOGIN PASSWORD 'portfolio_secret';
  END IF;
END $$;
SQL
  if ! psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='portfolio_db'" | grep -q 1; then
    createdb -O portfolio portfolio_db 2>/dev/null \
      || psql postgres -c 'CREATE DATABASE portfolio_db OWNER portfolio'
  fi
  echo "✓ role + database ready (system PostgreSQL)"
  exit 0
fi

echo "❌ Could not find a way to create the database."
echo "   Start the bundled PostgreSQL first:  sh scripts/pg-auto.sh"
exit 1
