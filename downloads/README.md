# Downloads

Ready-to-use files for this portfolio project. Click a file, then press the **Download raw file** button (top-right of the file view) — or grab them with one click from the [Releases page](https://github.com/JoerelEpiz/portfolio/releases).

## Portfolio-Full-Stack-Course.docx

A 55-page beginner-friendly course (15 chapters + appendix) that teaches you how to rebuild this entire portfolio on your Mac Mini from scratch:

- Part I — Web fundamentals + setting up your Mac dev environment
- Part II — Building the interface (Tailwind CSS, Navbar, Hero, Skills, Projects, Contact)
- Part III — Real database (PostgreSQL + Prisma, seed data, server components)
- Part IV — Admin dashboard (API routes, cookie authentication, CRUD)
- Part V — Publishing to GitHub

Every chapter pairs small explained code chunks with the full final file, plus Checkpoint boxes to verify your work before moving on.

## portfolio-joerelepiz-source.zip

The complete portfolio website source (147 files) ready to run on macOS — PostgreSQL is bundled, **no Homebrew required**:

```bash
# 1. Unzip anywhere, then inside the folder:
./scripts/mac-setup.sh   # one-time setup: installs Bun, deps, database + seed data
npm run dev:mac          # starts the site at http://localhost:3000
```

PostgreSQL starts and stops together with the dev server. See `README-MAC.md` inside the zip for troubleshooting, and `./scripts/reset-data.sh` if you ever want to restore the demo data.
