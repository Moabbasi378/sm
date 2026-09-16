# بریم سر قرار؟

A small, polished date-planning web app — fully in Persian (RTL, Vazirmatn
font, Jalali calendar, Persian digits). She picks the day, time, place, and
ride — you see it all on a password-protected `/admin` page.

Next.js App Router + TypeScript + Tailwind + Prisma (SQLite) + Zod.
Framer Motion for subtle animation, Lucide icons throughout.

## Commands

```bash
# 1. Install dependencies
bun install

# 2. Configure secrets (never commit .env)
cp .env.example .env
# then edit .env and set a long ADMIN_PASSWORD

# 3. Create the database + run migrations
bunx prisma migrate dev

# 4. Start development
bun run dev

# 5. Build for production
bun run build

# 6. Start production
bun run start
```

Other useful commands:

```bash
bunx tsc --noEmit        # typecheck (must be zero errors)
bunx eslint              # lint (must be zero errors)
bunx prisma studio       # inspect the SQLite database
bunx prisma migrate dev --name <change>  # after editing prisma/schema.prisma
```

## Routes

- `/` — public planner (date → time → location → ride → confirm)
- `/admin` — protected dashboard (password from `ADMIN_PASSWORD`)

## Environment

| Variable         | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `DATABASE_URL`   | Local SQLite path, e.g. `file:./dev.db` (migrations) |
| `ADMIN_PASSWORD` | Password for `/admin` (server-only)                 |
| `TURSO_DATABASE_URL` | Turso URL, e.g. `libsql://....turso.io` (production) |
| `TURSO_AUTH_TOKEN`   | Turso auth token (server-only secret)             |

Auth is a signed, HTTP-only cookie (`date_admin`) verified server-side.
The password never reaches the browser.

## Deploying to Vercel (with Turso)

Local SQLite files don't work on Vercel (read-only, ephemeral filesystem),
so production uses Turso. Local dev keeps using `prisma/dev.db`.

```bash
# 1. Install the Turso CLI and log in (once per machine)
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login

# 2. Create the database (once) — note the libsql:// URL it prints
turso db create <your-db-name>

# 3. Create an auth token (treat it like a password)
turso db tokens create <your-db-name>

# 4. Create the table on Turso by applying the existing migration
turso db shell <your-db-name> < prisma/migrations/*/migration.sql
```

Then in Vercel → project → Settings → Environment Variables, add:

| Variable             | Value                                  |
| -------------------- | -------------------------------------- |
| `TURSO_DATABASE_URL` | `libsql://....turso.io` (from step 2)  |
| `TURSO_AUTH_TOKEN`   | token from step 3                      |
| `ADMIN_PASSWORD`     | your secret password                   |

(`DATABASE_URL` is not needed on Vercel.) Deploy — `postinstall` runs
`prisma generate` automatically during the build.

Later schema changes: run `bunx prisma migrate dev --name <change>` locally,
then apply the new `migration.sql` to Turso with `turso db shell` again.
