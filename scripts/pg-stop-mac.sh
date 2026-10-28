#!/bin/bash
# Stops the bundled PostgreSQL cluster (used by dev-mac.sh on exit).
# Never touches a system PostgreSQL — only the cluster this app created.
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PGDATA="$ROOT/db/pgdata-mac"
PG_HOME="$ROOT/db/pg-mac"

[ -d "$PGDATA/base" ] || exit 0
[ -x "$PG_HOME/bin/pg_ctl" ] || exit 0

export DYLD_LIBRARY_PATH="$PG_HOME/lib:${DYLD_LIBRARY_PATH:-}"
"$PG_HOME/bin/pg_ctl" -D "$PGDATA" stop -m fast >/dev/null 2>&1 || true
exit 0
