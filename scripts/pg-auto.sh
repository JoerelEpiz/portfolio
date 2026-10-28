#!/bin/bash
# Starts the right PostgreSQL for this machine and makes sure the
# database + user exist. Used by mac-setup.sh and dev-mac.sh.
#
# Priority:
#   1. sandbox portable PostgreSQL (Linux, db/pg present)
#   2. anything already listening on :5432 (system Postgres / Postgres.app / Docker)
#   3. the bundled universal macOS binaries in postgres-mac/postgres-mac.txz
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/db/logs"

# ---------- 1. sandbox portable PostgreSQL (dev container only) ----------
if [ -d "$ROOT/db/pg" ]; then
  sh "$ROOT/scripts/pg-ensure.sh"
  exit 0
fi

# ---------- 2/3. macOS ----------
if [ "$(uname -s)" != "Darwin" ]; then
  echo "ℹ️  No bundled PostgreSQL for this OS — assuming PostgreSQL is already running on :5432"
  exit 0
fi

TXZ="$ROOT/postgres-mac/postgres-mac.txz"
PG_HOME="$ROOT/db/pg-mac"
PGDATA="$ROOT/db/pgdata-mac"

# ---------- 2. reuse an already-running PostgreSQL on :5432 ----------
if (echo > /dev/tcp/127.0.0.1/5432) 2>/dev/null; then
  echo "✅ PostgreSQL already running on port 5432 — using it"
  sh "$ROOT/scripts/ensure-db.sh"
  exit 0
fi

# ---------- 3. bundled PostgreSQL (no Homebrew needed) ----------
# Get the binaries: use the bundled copy, or download from Maven Central (CDN)
if [ ! -f "$TXZ" ]; then
  echo "📥 Downloading bundled PostgreSQL 16 (~30 MB, universal macOS binaries)..."
  mkdir -p "$ROOT/postgres-mac"
  JAR_URL="https://repo1.maven.org/maven2/io/zonky/test/postgres/embedded-postgres-binaries-darwin-amd64/16.4.0/embedded-postgres-binaries-darwin-amd64-16.4.0.jar"
  if ! curl -fL --max-time 600 -o "$ROOT/db/postgres-mac.jar" "$JAR_URL"; then
    echo "❌ Download failed. Check your internet connection, or download manually:"
    echo "   $JAR_URL"
    echo "   → unzip it and copy postgres-darwin-x86_64.txz to postgres-mac/postgres-mac.txz"
    exit 1
  fi
  unzip -o -j "$ROOT/db/postgres-mac.jar" "*.txz" -d "$ROOT/postgres-mac/" >/dev/null
  mv "$ROOT/postgres-mac/postgres-darwin-x86_64.txz" "$TXZ"
  rm -f "$ROOT/db/postgres-mac.jar"
  echo "✅ Bundled PostgreSQL downloaded"
fi

export DYLD_LIBRARY_PATH="$PG_HOME/lib:${DYLD_LIBRARY_PATH:-}"

# extract the universal binaries (first run only — cached afterwards)
if [ ! -x "$PG_HOME/bin/postgres" ]; then
  echo "📦 Extracting bundled PostgreSQL (first run only)..."
  rm -rf "$PG_HOME"
  mkdir -p "$PG_HOME"
  tar -xJf "$TXZ" -C "$PG_HOME"
fi

# initialize the data directory (first run only)
if [ ! -d "$PGDATA/base" ]; then
  echo "🗄  Initializing database cluster..."
  rm -rf "$PGDATA"
  printf 'portfolio_secret' > "$ROOT/db/.pgpassfile"
  "$PG_HOME/bin/initdb" -D "$PGDATA" \
    --username=portfolio --pwfile="$ROOT/db/.pgpassfile" \
    --auth=md5 --encoding=UTF8 --locale=C >/dev/null
  rm -f "$ROOT/db/.pgpassfile"
fi

# start the server
echo "▶ Starting bundled PostgreSQL..."
"$PG_HOME/bin/pg_ctl" -D "$PGDATA" -l "$ROOT/db/logs/postgres.log" \
  -w -t 60 start -o "-p 5432 -k $ROOT/db" >/dev/null

# wait until it accepts TCP connections
for _ in $(seq 1 30); do
  (echo > /dev/tcp/127.0.0.1/5432) 2>/dev/null && break
  sleep 1
done

sh "$ROOT/scripts/ensure-db.sh"
echo "✅ Bundled PostgreSQL ready (data lives in db/pgdata-mac)"
