# Portray

Show who you are. Portray is where developers publish portfolios and recruiters discover talent.

## Stack

| Package | Version |
|---------|---------|
| Next.js | 16.2.6 |
| better-auth | 1.6.14 |
| @better-auth/mongo-adapter | 1.6.14 |
| resend | 6.12.4 |
| mongoose | 9.6.3 |
| @tanstack/react-form | 1.33.x |
| @tanstack/react-query | 5.101.x |

UI: shadcn/ui, Aceternity UI (`@aceternity/background-beams`)

## Setup

```bash
cp .env.example .env.local
bun install
```

Set in `.env.local`:

- `MONGO_URI` — MongoDB connection string
- `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
- `BETTER_AUTH_URL` — `http://localhost:3000`
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000`
- `RESEND_API_KEY` — from [Resend](https://resend.com)
- `RESEND_FROM_EMAIL` — verified sender, e.g. `Portray <onboarding@resend.dev>`

```bash
bun run dev
```

## Seed demo data

Creates three public demo developers with projects, experience, and sample inbox messages:

```bash
bun run seed
```

| Developer | Email | Password | Public portfolio |
|-----------|-------|----------|------------------|
| Jane Doe | `jane@demo.portray.dev` | `Demo1234!` | `/developers/jane` |
| Alex Chen | `alex@demo.portray.dev` | `Demo1234!` | `/developers/alex` |
| Sam Patel | `sam@demo.portray.dev` | `Demo1234!` | `/developers/sam` |

Safe to re-run: refreshes app data for these accounts without duplicating users.

## Auth flows

| Route | Purpose |
|-------|---------|
| `/sign-up` | Register with email, username, password |
| `/verify-email` | Email OTP (sent once on signup) → auto sign-in |
| `/sign-in` | Login |
| `/forgot-password` | Request reset OTP |
| `/reset-password` | Reset password with OTP |
| `/dashboard` | Protected developer area |
| `/dashboard/projects` | Projects CRUD (REST + TanStack Query) |

## Projects API

| Method | Path |
|--------|------|
| GET | `/api/projects` |
| POST | `/api/projects` |
| GET | `/api/projects/[id]` |
| PATCH | `/api/projects/[id]` |
| DELETE | `/api/projects/[id]` |

Responses use `{ success, data }` or `{ success: false, error }`. Requires session cookie.

## Docs

See [docs/PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md).
