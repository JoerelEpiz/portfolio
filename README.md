# Joerel Epiz — Portfolio

A modern, full-stack portfolio website with a built-in admin dashboard.

- **Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Framer Motion
- **Backend:** Next.js API Route Handlers (no separate server needed)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** password-protected admin dashboard (httpOnly session cookie)

## Features

- Single-page portfolio: hero, tech marquee, about, skills, projects, experience timeline, contact form
- **Admin dashboard** at `/#admin` — manage profile, projects, skills, experience, and read/delete contact messages. Every change is stored in PostgreSQL and appears on the site instantly.
- Light/dark theme, fully responsive, animated with Framer Motion
- Contact form submissions validated with Zod and stored in the database

---

## Run locally on your Mac Mini

### ⚡ 3 steps — no Homebrew, no manual installs

Everything is bundled, including PostgreSQL (universal binaries — works on Apple Silicon and Intel).

```bash
# 1. Unpack
cd ~/Downloads && unzip portfolio-joerelepiz-source.zip -d portfolio && cd portfolio

# 2. One-command setup (installs deps, starts bundled PostgreSQL, creates tables, seeds content)
./scripts/mac-setup.sh

# 3. Start the site
npm run dev:mac        # or: bun run dev:mac
```

→ Open **http://localhost:3000** — admin dashboard at **http://localhost:3000/#admin** (password `admin123`, change it in `.env`).

The bundled database starts and stops together with the app (Ctrl+C), and lives entirely inside the project folder. Full guide + troubleshooting: see **README-MAC.md**.

### Manual alternative (you already have PostgreSQL)

Prefer full control? Follow the manual steps below.

### 1. Prerequisites

Install [Homebrew](https://brew.sh) if you don't have it, then:

```bash
# Bun (JavaScript runtime & package manager — recommended)
brew install bun

# PostgreSQL 16
brew install postgresql@16
brew services start postgresql@16
```

> Prefer a GUI? [Postgres.app](https://postgresapp.com) works too — just make sure PostgreSQL is running on port 5432.
> Docker alternative: `docker run -d --name portfolio-pg -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio_secret -e POSTGRES_DB=portfolio_db -p 5432:5432 postgres:16`

### 2. Create the database

```bash
psql postgres -c "CREATE USER portfolio WITH PASSWORD 'portfolio_secret';"
psql postgres -c "CREATE DATABASE portfolio_db OWNER portfolio;"
```

### 3. Set up the project

```bash
# unzip the project, then inside the folder:
cp .env.example .env

# IMPORTANT: open .env and change ADMIN_PASSWORD to your own secret.

bun install
bun run db:setup     # creates tables + seeds starter content
bun run dev:local
```

Open **http://localhost:3000** in your browser.

### 4. Open the admin dashboard

Go to **http://localhost:3000/#admin** (or click the "Admin" link in the footer)
and sign in with your `ADMIN_PASSWORD`.

- **Overview** — stats, latest messages, security hints
- **Messages** — read, reply, mark unread, delete contact inquiries
- **Projects / Skills / Experience** — full create, edit, delete
- **Profile** — name, title, bio, email, social links, availability

### 5. Open in VS Code

```bash
code .    # if you have the 'code' command installed
```

Recommended VS Code extensions: ESLint, Tailwind CSS IntelliSense, Prettier.

---

## Project structure

```
src/
  app/
    page.tsx                 # the single page (portfolio + #admin view)
    layout.tsx               # fonts, theme provider, metadata
    api/
      portfolio/route.ts     # GET  — full portfolio dataset
      contact/route.ts       # POST — save contact message
      admin/                 # login/logout/session + CRUD APIs (cookie-protected)
  components/
    portfolio/               # hero, about, skills, projects, experience, contact…
    admin/                   # dashboard, login, CRUD panels
  lib/
    db.ts                    # Prisma client
    admin-auth.ts            # session token helpers
    admin-schemas.ts         # Zod validation schemas
prisma/
  schema.prisma              # Profile, Skill, Project, Experience, Message
  seed.ts                    # starter content
scripts/                     # sandbox DB helpers (no-ops on macOS)
```

## Useful commands

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `bun run dev:local` | Start dev server on port 3000         |
| `bun run lint`      | Run ESLint                            |
| `bun run db:push`   | Sync Prisma schema to PostgreSQL      |
| `bun run db:seed`   | (Re-)seed starter content             |
| `bun run db:setup`  | push + seed in one go                 |

## Push to your GitHub repo

```bash
git init
git add .
git commit -m "Portfolio with admin dashboard"
git branch -M main
git remote add origin https://github.com/JoerelEpiz/portfolio.git
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, `.env` and local database files.

## Deploying (optional)

For production (e.g. Vercel + Neon/Supabase Postgres):

1. Create a managed PostgreSQL database and copy its connection string.
2. Set environment variables in your host: `DATABASE_URL`, `POSTGRES_URL`, `ADMIN_PASSWORD`.
3. Run `bunx prisma db push` against the production database (or add migrations).
4. Deploy the repo — the Next.js API routes work serverlessly out of the box.
