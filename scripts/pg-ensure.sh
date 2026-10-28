#!/bin/bash
# Ensures the portable PostgreSQL instance is running (sandbox only).
# On other machines (e.g. macOS with Homebrew PostgreSQL) this exits
# immediately and does nothing.
[ -d /home/z/my-project/db/pg ] || exit 0

PG_HOME=/home/z/my-project/db/pg
PGDATA=/home/z/my-project/db/pgdata
DB_PORT=5432
export LD_LIBRARY_PATH=$PG_HOME/lib:$LD_LIBRARY_PATH

(echo > /dev/tcp/127.0.0.1/$DB_PORT) 2>/dev/null && exit 0

mkdir -p /home/z/my-project/db/logs /home/z/my-project/db
[ -f /home/z/my-project/db/.pgpassfile ] || printf 'portfolio_secret' > /home/z/my-project/db/.pgpassfile

if [ ! -d "$PGDATA/base" ]; then
  "$PG_HOME/bin/initdb" -D "$PGDATA" \
    --username=portfolio \
    --pwfile=/home/z/my-project/db/.pgpassfile \
    --auth=md5 \
    --encoding=UTF8 \
    --locale=C >/dev/null 2>&1
fi

"$PG_HOME/bin/pg_ctl" -D "$PGDATA" \
  -l /home/z/my-project/db/logs/postgres.log \
  -w -t 60 start -o "-p $DB_PORT -k /home/z/my-project/db" >/dev/null 2>&1

exit 0
