# README-MAC.md — running the portfolio on your Mac Mini

A complete guide for running the site locally at **http://localhost:3000**.
No Homebrew, no Node, no PostgreSQL installation needed — everything is bundled.

---

## Quick start (3 steps)

```bash
# 1. Unpack
cd ~/Downloads && unzip portfolio-joerelepiz-source.zip -d portfolio && cd portfolio

# 2. One-command setup
./scripts/mac-setup.sh

# 3. Start
npm run dev:mac        # or: bun run dev:mac
```

Open **http://localhost:3000**.
Admin dashboard: **http://localhost:3000/#admin** — default password `admin123`
(change it by editing `ADMIN_PASSWORD` in the `.env` file, then restart).

> If macOS says the script is from an unidentified developer, run it like this instead:
> `bash scripts/mac-setup.sh` — Terminal scripts are not blocked.

---

## What `mac-setup.sh` does

| Step | Action |
| ---- | ------ |
| 1 | Installs **Bun** via its official installer if neither Bun nor Node exists (self-contained, no Homebrew, no sudo) |
| 2 | Runs `bun install` (or `npm install`) — project dependencies |
| 3 | Generates the Prisma client |
| 4 | Creates `.env` from `.env.example` (first run only) |
| 5 | Extracts the **bundled PostgreSQL** and starts it on port 5432 — binaries are included in the full zip; on a git clone they auto-download (~30 MB) from Maven Central's CDN on first run |
| 6 | Creates the `portfolio` user + `portfolio_db` database, pushes the schema, seeds starter content |

First run takes a couple of minutes (dependency download). Every run after that
is a few seconds — extraction and seeding are cached.

## Daily usage

```bash
cd ~/portfolio        # your project folder
npm run dev:mac       # starts PostgreSQL + the site together
```

- **Stop:** press `Ctrl+C` — the bundled database stops with the app.
- **Data lives in** `db/pgdata-mac/` inside the project. Delete that folder to
  start with a fresh cluster on next launch.
- **Reset to starter content anytime:** `./scripts/reset-data.sh`

## If you already run PostgreSQL (Homebrew / Postgres.app / Docker)

The scripts auto-detect it: if something is listening on port 5432, the bundled
database is skipped and your existing server is used. The setup creates the
`portfolio` role and `portfolio_db` database there automatically (default local
auth on Homebrew allows this). Connection settings are in `.env` — point
`DATABASE_URL` at any PostgreSQL 13+ instance (local, Neon, Supabase…) and the
app follows.

---

## Troubleshooting

**“Port 5432 already in use” / wrong server picked up**
The scripts reuse whatever is on 5432. To force the bundled one, stop the other
server first (`brew services stop postgresql@16`), or run the bundled one on a
different port: edit `scripts/pg-auto.sh` and change `-p 5432` to `-p 5433`,
then set the port in `.env` (`postgresql://portfolio:portfolio_secret@127.0.0.1:5433/portfolio_db`).

**`zsh: permission denied` when running a script**
Run it via bash: `bash scripts/mac-setup.sh` (or `chmod +x scripts/*.sh` once).

**`command not found: bun` after setup**
The Bun installer adds itself to your shell profile — open a new Terminal tab,
or run `export PATH="$HOME/.bun/bin:$PATH"`.

**Site starts but shows database errors**
The database may have been stopped manually. Just restart the app
(`npm run dev:mac`) — it starts the database too. Still broken?
`./scripts/reset-data.sh` gives you a clean, re-seeded database.

**Setup can't download the PostgreSQL bundle (no internet / blocked)**
The first run downloads ~30 MB from Maven Central. If that fails, download it
manually on any machine:
`https://repo1.maven.org/maven2/io/zonky/test/postgres/embedded-postgres-binaries-darwin-amd64/16.4.0/embedded-postgres-binaries-darwin-amd64-16.4.0.jar`
→ unzip it → copy `postgres-darwin-x86_64.txz` into the project as
`postgres-mac/postgres-mac.txz`, then re-run `./scripts/mac-setup.sh`.

**macOS quarantined the downloaded files**
`mac-setup.sh` removes quarantine flags automatically. If something still
blocks: `xattr -dr com.apple.quarantine .` inside the project folder.

**Starting completely fresh**
```bash
rm -rf db/pgdata-mac db/pg-mac     # wipes the bundled database
./scripts/mac-setup.sh             # re-initializes everything
```

---

## Optional: Node/npm instead of Bun

Bun is the default runtime (installed automatically). If you prefer Node:
install Node 20.11+ (`brew install node@22`), run `npm install`, and use
`npm run dev:mac` — the dev server, database and admin dashboard work the same.
One caveat: seeding/resetting data needs Bun or `npx tsx` (the scripts handle
this automatically).

## Deploying later (optional)

The project deploys as-is to Vercel/Netlify with a managed Postgres
(Neon, Supabase, Railway): set `DATABASE_URL`, `POSTGRES_URL` and
`ADMIN_PASSWORD` in the host's environment, run `bunx prisma db push` against
the production database once, then deploy. See README.md for details.
