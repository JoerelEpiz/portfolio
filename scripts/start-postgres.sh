#!/bin/bash
# Portable PostgreSQL 16 for the portfolio project (runs as user `z`, no root needed)
PG_HOME=/home/z/my-project/db/pg
PGDATA=/home/z/my-project/db/pgdata
PGPORT=5432
export LD_LIBRARY_PATH=$PG_HOME/lib:$LD_LIBRARY_PATH

mkdir -p /home/z/my-project/db/logs

if [ ! -d "$PGDATA/base" ]; then
  echo "[pg] initializing data dir at $PGDATA ..."
  "$PG_HOME/bin/initdb" -D "$PGDATA" \
    --username=portfolio \
    --pwfile=/home/z/my-project/db/.pgpassfile \
    --auth=md5 \
    --encoding=UTF8 \
    --locale=C >/dev/null
  echo "[pg] initdb done"
fi

# start (if not already running)
"$PG_HOME/bin/pg_ctl" -D "$PGDATA" -l /home/z/my-project/db/logs/postgres.log -o "-p $PGPORT -k /home/z/my-project/db" status >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "[pg] starting postgres on port $PGPORT ..."
  "$PG_HOME/bin/pg_ctl" -D "$PGDATA" -l /home/z/my-project/db/logs/postgres.log -w -t 60 start -o "-p $PGPORT -k /home/z/my-project/db"
else
  echo "[pg] already running"
fi

# create database if missing
export PGPASSWORD=portfolio_secret
"$PG_HOME/bin/psql" -h 127.0.0.1 -p $PGPORT -U portfolio -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='portfolio_db'" | grep -q 1 \
  || "$PG_HOME/bin/createdb" -h 127.0.0.1 -p $PGPORT -U portfolio portfolio_db

echo "[pg] ready: postgresql://portfolio:***@127.0.0.1:5432/portfolio_db"
