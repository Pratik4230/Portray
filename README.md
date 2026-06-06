# Portray

**Portray** is a multi-user portfolio platform where developers publish profiles (bio, skills, experience, projects) and recruiters discover talent on `/developers` **without an account**. Recruiters can open a public portfolio and send a message via a Server Action form; developers manage everything from a authenticated dashboard.

## What this project demonstrates

| Concept | Implementation |
|---------|----------------|
| **SSG / ISR** | Marketing pages, developer directory, public portfolios, project detail pages |
| **SSR** | Live portfolio stats (`PortfolioStats` + `unstable_noStore`) |
| **Dynamic SSR** | Dashboard routes (session-specific) |
| **REST API** | Projects, profile, experience — consumed with TanStack Query v5 |
| **Server Actions** | Recruiter `contactDeveloper` form; `markMessageRead` in inbox |
| **MongoDB** | Mongoose models + repositories in `lib/db/repositories/` |
| **Auth** | Better Auth (email/password, OTP verification, MongoDB adapter) |

Full architecture: [docs/PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md)

## Prerequisites

- [Bun](https://bun.sh) (or Node.js 20+)
- MongoDB ([local](https://www.mongodb.com/docs/manual/installation/) or [Atlas](https://www.mongodb.com/atlas))
- [Resend](https://resend.com) account for auth OTP emails

## Quick start

```bash
cp .env.example .env.local
bun install
bun run dev
```

Configure `.env.local` (see [.env.example](.env.example)):

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (database name: `portray`) |
| `BETTER_AUTH_SECRET` | Random secret — e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | App URL — `http://localhost:3000` in dev |
| `NEXT_PUBLIC_SITE_URL` | Public site URL — same as above in dev |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender — e.g. `Portray <onboarding@resend.dev>` |

Production:

```bash
bun run build
bun run start
```

## Demo accounts

Use these to explore the app after MongoDB is connected. Password for all demo users: **`Demo1234!`**

| Developer | Email | Public portfolio |
|-----------|-------|------------------|
| Priya Sharma | `priya@demo.portray.dev` | [/developers/priya](http://localhost:3000/developers/priya) |
| Arjun Mehta | `arjun@demo.portray.dev` | [/developers/arjun](http://localhost:3000/developers/arjun) |
| Ananya Iyer | `ananya@demo.portray.dev` | [/developers/ananya](http://localhost:3000/developers/ananya) |

**Developer path:** `/sign-in` → dashboard → profile / projects / experience → toggle public visibility.

**Recruiter path:** `/developers` (no login) → open a portfolio → contact form → developer inbox at `/dashboard/messages`.

You can also register a new account at `/sign-up`.

## Rendering strategies

| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` | SSG + featured fetch | Static marketing shell; optional featured profiles from DB |
| `/developers` | ISR (`revalidate: 60`) | Directory refreshes as developers go public |
| `/developers/[username]` | SSG + ISR | `generateStaticParams` for known usernames; time-based revalidation |
| `/developers/[username]/projects/[slug]` | SSG + ISR | Pre-rendered project pages on an interval |
| Portfolio stats on public page | SSR | Request-time count of recruiter messages this month |
| `/dashboard/*` | Dynamic SSR | Always session-fresh for logged-in developers |

`revalidatePath` runs when profiles, projects, or experience are updated, and when a recruiter sends a contact message.

## API routes vs Server Actions

| | REST API routes | Server Actions |
|--|-----------------|----------------|
| **Purpose** | Dashboard CRUD (projects, profile, experience) | Recruiter contact form; mark message read |
| **Client** | TanStack Query + `fetch` | HTML forms / `useActionState` |
| **Auth** | Session cookie in route handler | Session via `getAuth()` in action |

Projects are **REST only** — not duplicated in Server Actions.

## REST API

Envelope:

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

Authenticated endpoints require a Better Auth session cookie. Sign in via the browser, then copy the session cookie for curl (DevTools → Application → Cookies → `better-auth.session_token`).

### Projects

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List current user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/[id]` | Get one project |
| PATCH | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |

```bash
curl -s http://localhost:3000/api/projects \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" | jq

curl -s -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"title":"My App","slug":"my-app","description":"Side project","techStack":["Next.js"]}' | jq
```

### Profile

| Method | Path |
|--------|------|
| GET | `/api/profile` |
| PATCH | `/api/profile` |

```bash
curl -s -X PATCH http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"headline":"Full-stack Developer","isPublic":true}' | jq
```

### Experience

| Method | Path |
|--------|------|
| GET | `/api/experience` |
| POST | `/api/experience` |
| GET | `/api/experience/[id]` |
| PATCH | `/api/experience/[id]` |
| DELETE | `/api/experience/[id]` |

## Server Actions

| Action | File | Used on |
|--------|------|---------|
| `contactDeveloper` | `lib/actions/contact-developer.ts` | Public portfolio contact form |
| `markMessageRead` | `lib/actions/mark-message-read.ts` | `/dashboard/messages` |

## Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Marketing home |
| `/developers` | Developer directory |
| `/developers/[username]` | Public portfolio |
| `/developers/[username]/projects/[slug]` | Project detail |

### Auth

| Route | Description |
|-------|-------------|
| `/sign-up` | Register (email, username, password) |
| `/verify-email` | OTP verification |
| `/sign-in` | Login |
| `/forgot-password` | Request password reset OTP |
| `/reset-password` | Reset password |

### Dashboard (authenticated)

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview |
| `/dashboard/profile` | Edit profile & visibility |
| `/dashboard/projects` | Manage projects |
| `/dashboard/projects/[id]` | Project detail |
| `/dashboard/experience` | Manage experience |
| `/dashboard/messages` | Recruiter inbox |

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui, Tailwind CSS v4, Aceternity `background-beams` |
| Forms | TanStack Form |
| Data fetching | TanStack Query v5 |
| Database | MongoDB + Mongoose |
| Auth | Better Auth + Resend OTP |
| Validation | Zod |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript check |
