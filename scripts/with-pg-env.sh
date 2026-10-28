#!/bin/sh
# Wrapper: forces Prisma CLI to use the PostgreSQL URL from .env
# (the sandbox shell exports a legacy SQLite DATABASE_URL which would otherwise win)
set -a
. "$(dirname "$0")/../.env" 2>/dev/null
set +a
exec "$@"
