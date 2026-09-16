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

| Variable         | Purpose                              |
| ---------------- | ------------------------------------ |
| `DATABASE_URL`   | SQLite path, e.g. `file:./dev.db`   |
| `ADMIN_PASSWORD` | Password for `/admin` (server-only)  |

Auth is a signed, HTTP-only cookie (`date_admin`) verified server-side.
The password never reaches the browser.
