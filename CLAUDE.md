# CLAUDE.md — skillSYNC × skillIT Project Architecture

Comprehensive reference for the combined **skillSYNC** (tech training platform) and **skillIT** (creative agency) website. Read this before making any changes.

> **Location:** all app code lives under `skillsync-website/`. The outer `D:/2026/skillit website/` folder just holds a stray `package.json` / `node_modules` (leftover — not the real project).

---

## Tech Stack Summary

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 14.2.35** (App Router, RSC) |
| Language | **TypeScript 5** (`strict: true`) |
| Styling | **Tailwind CSS 3.4** with custom brand tokens |
| Database / Auth / Storage | **Supabase** (Postgres + RLS + Storage) |
| Auth SDK | `@supabase/ssr` (cookie-based SSR sessions) + `@supabase/supabase-js` |
| Forms | `react-hook-form` + `zod` (`@hookform/resolvers`) |
| UI utilities | `clsx`, `tailwind-merge` (via `cn()`), `lucide-react`, `react-icons`, `framer-motion` |
| Toasts | `react-hot-toast` |
| PDF | `@react-pdf/renderer` (certificates, volunteer letters) |
| Charts | `recharts` (admin analytics) |
| Delight | `canvas-confetti` |
| Email (planned/referenced in docs) | **Resend** (env vars present; not yet wired into any route file I could find) |
| Deployment target | **Vercel** (per README) |
| Node runtime | Next default (Node.js) |

`package.json` scripts: `dev` / `build` / `start` / `lint`. **No test scripts, no test runner installed, no `*.test.*` / `*.spec.*` project files.**

---

## Repository Layout

```
skillsync-website/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Marketing pages (route group, uses PublicLayout w/ Navbar+Footer)
│   ├── (auth)/login/             # Volunteer login (route group)
│   ├── (admin-auth)/admin/login/ # Admin login (route group, separate from admin panel)
│   ├── admin/                    # Admin panel — auth-gated in middleware
│   ├── dashboard/                # Volunteer dashboard — auth-gated in middleware
│   ├── api/                      # REST endpoints (route.ts handlers)
│   ├── maintenance/              # Holding page when site_settings.maintenance_mode = true
│   ├── layout.tsx                # Root layout — Inter font, metadata, Providers
│   ├── providers.tsx             # UserProvider + react-hot-toast <Toaster>
│   ├── error.tsx / not-found.tsx # Error boundaries
│   ├── robots.ts / sitemap.ts    # SEO
│   └── globals.css               # Tailwind directives + custom scrollbar
├── components/
│   ├── ui/            # Shared design system (Button, Card, Modal, Input, Badge, Table, Skeleton)
│   ├── public/        # Marketing site components
│   ├── admin/         # Admin panel components (editors, tables, modals, PDF documents)
│   ├── dashboard/     # Volunteer dashboard components
│   └── forms/         # Reusable forms (application, review, contact, weekly report, etc.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # createBrowserClient (anon)
│   │   ├── server.ts       # createServerClient (cookie-based, anon)
│   │   ├── middleware.ts   # createMiddlewareClient (edge middleware)
│   │   ├── admin.ts        # createAdminClient (service-role, server-only, RLS-bypass)
│   │   ├── queries/        # Read-side data access, one file per domain
│   │   └── mutations/      # Write-side data access, one file per domain
│   ├── types/app.types.ts  # All domain interfaces
│   ├── constants/          # ROLES, DEPARTMENTS enums
│   ├── context/            # BrandContext, UserContext
│   ├── hooks/useUser.ts    # Thin wrapper over UserContext
│   └── utils/              # cn, formatDate, slugify, fileValidation
├── supabase/migrations/    # 001–013 SQL migrations (ordered)
├── scripts/                # One-off seed scripts (ts, run via ts-node/tsx externally)
├── public/team/            # Team member avatars
├── middleware.ts           # Auth + maintenance-mode routing
├── next.config.mjs         # Image remote patterns + canvas alias for @react-pdf
├── tailwind.config.ts      # Brand color tokens + font/shadow extensions
└── .env.local / .env.example
```

---

## Frontend

### Routing (Next.js App Router)

Route groups `(public)`, `(auth)`, `(admin-auth)` are used purely for layout scoping — they don't appear in URLs.

**Public routes** (`app/(public)/`, all wrap `PublicLayout` = `<BrandProvider><Navbar/><main/><Footer/></BrandProvider>`):

| URL | File | Purpose |
|-----|------|---------|
| `/` | `page.tsx` | Landing: hero, stats, workshops, projects, events, reviews, team, socials |
| `/about` | `about/page.tsx` | About page |
| `/contact` | `contact/page.tsx` | Contact form |
| `/workshops` | `workshops/page.tsx` | Workshop listing (filter grid) |
| `/workshops/[slug]` | `workshops/[slug]/page.tsx` | Workshop detail + registration |
| `/workshops/register` | `workshops/register/page.tsx` | Custom paid-workshop form (payment receipt upload) |
| `/projects` | `projects/page.tsx` | Portfolio listing |
| `/projects/[slug]` | `projects/[slug]/page.tsx` | Project detail / case study |
| `/events` | `events/page.tsx` | Event listing |
| `/events/[slug]` | `events/[slug]/page.tsx` | Event detail |
| `/reviews` | `reviews/page.tsx` | Testimonials grid + submit form |
| `/team` | `team/page.tsx` | Public team members |
| `/join` | `join/page.tsx` | Volunteer application form |
| `/skillsync` | `skillsync/page.tsx` | skillSYNC brand landing |
| `/skillit` | `skillit/page.tsx` | skillIT brand landing |
| `/privacy` | `privacy/page.tsx` | Privacy policy |
| `/terms` | `terms/page.tsx` | Terms |

**Auth routes:**
- `/login` — volunteer login (`app/(auth)/login/page.tsx`)
- `/admin/login` — admin login (`app/(admin-auth)/admin/login/page.tsx`)

**Volunteer dashboard** (`app/dashboard/`, wraps `DashboardLayout` = sidebar + header):
- `/dashboard` — overview
- `/dashboard/work` — assigned tasks
- `/dashboard/reports` — weekly reports
- `/dashboard/achievements` — certificates & milestones
- `/dashboard/team` — team view
- `/dashboard/profile` — profile editor

**Admin panel** (`app/admin/`, wraps `AdminLayout` = sidebar + header):
- `/admin` and `/admin/dashboard` — summary
- `/admin/volunteers` · `/admin/applications` · `/admin/work` · `/admin/warnings` · `/admin/events` · `/admin/projects` · `/admin/reviews` · `/admin/reports` · `/admin/certificates` · `/admin/analytics` · `/admin/settings`

**Special:**
- `/maintenance` — served to public routes when `site_settings.maintenance_mode = 'true'`
- `robots.ts`, `sitemap.ts` — SEO route handlers

### Middleware (`middleware.ts`)

Runs on every non-static route. Responsibilities:
1. Redirect authenticated volunteers away from `/login` → `/dashboard`.
2. Gate `/dashboard/**` — require session, else redirect to `/login?redirectTo=…`.
3. Gate `/admin/**` (except `/admin/login`) — require session **and** `users.is_admin === true OR users.role === 'Admin'`, else `/admin/login`.
4. Redirect already-authed admins away from `/admin/login` → `/admin/dashboard`.
5. Maintenance-mode check: reads `site_settings.maintenance_mode` and redirects public routes to `/maintenance` when `'true'`. Skips `/admin`, `/api`, `/maintenance`, `/login`, `/dashboard`. Wrapped in try/catch so a missing settings table doesn't 500.
6. Refreshes Supabase session cookies via `createMiddlewareClient` (`lib/supabase/middleware.ts`).

### Styling & Design System

**Editorial-bold** design system for public pages (redesigned Aug 2026); legacy dark theme kept for admin/dashboard/auth.

**Palette** (in `tailwind.config.ts` + `:root` vars in `globals.css`):

```
─ Editorial (public) ─
ink        #080808  primary text, all borders
paper      #ffffff  page background
off        #f5f0eb  card hover background
red        #E94560  accent — used sparingly for impact
ink-60/40/20        greys for body copy & muted text

─ Legacy dark (admin, dashboard, auth) ─
brand:   dark #1A1A2E · darker #0D0D1A · mid #2C2C54 · accent #E94560 · muted #4A4E69 · light #F0F4FF
skillit: accent #0F6B7A · light #E8F4F8
```

**Typography** — two Google Fonts loaded in `app/layout.tsx`:
- `Bebas Neue` → `var(--font-bebas)` → Tailwind `font-editorial` / `font-display`. Used for all headings, hero text, numbers.
- `Inter`      → `var(--font-inter)` → Tailwind `font-sans`. Used for all body copy.

**Public shell** — `app/(public)/layout.tsx` wraps children in `<div class="public-shell">` which sets white background and Inter font. The root `<body>` stays `bg-brand-dark` so admin/dashboard/auth pages keep their original dark theme.

**Design-system utilities** (in `globals.css`, `@layer utilities`):
- `.font-editorial`, `.track-ed` (2px), `.track-ed-wide` (3px)
- `.border-ed`, `.border-ed-t/b/l/r` — 3px solid black. The 3px black border is the signature of the design; use it for section dividers, card outlines, and internal separators. No border-radius anywhere on public.
- `.btn-ed-primary` (black bg → red on hover), `.btn-ed-outline` (transparent → black on hover), `.btn-ed-red` (white bg, red text — for use on red panels). `.btn-ed-sm` size modifier.
- `.ed-ticker-track` + `@keyframes ed-ticker` — the horizontal scrolling ticker strip.

**Motion** — `framer-motion` used site-wide. Standard patterns:
- Page entry: `<PageEnter>` wrapper (fade + slide up) — `components/public/PageEnter.tsx`.
- Section reveal: `initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}}`.
- Card hover: `whileHover={{y:-2}}`.
- Hero headline: word-by-word staggered reveal (see `HeroSection.tsx`).

**Reserved for future 3D**: the hero renders an empty `<div id="hero-3d-canvas">` positioned absolutely behind the text — drop a Three.js/Spline mount into it later without touching layout.

**Reusable public components** (all in `components/public/`):
- `SectionHeader` — the editorial page-header block (red eyebrow + Bebas Neue title + subtitle + bottom-border). Use it at the top of every public page.
- `Ticker` — the scrolling strip (`variant`: `red | black | white`).
- `PageEnter` — motion wrapper for client-side entry animations.

**Legacy UI primitives** in `components/ui/` (Button, Card, Input, Modal, Badge, Table, Skeleton) still use `brand.*` tokens and dark theme. They are consumed by admin/dashboard/auth only — the public site does not import from `@/components/ui` at all.

Global CSS (`app/globals.css`) declares the root palette variables, keeps the dark scrollbar, exposes `.public-shell` for the white theme, and defines all editorial utility classes.

**Reusable UI primitives** in `components/ui/`:
- `Button.tsx` — variants `primary | secondary | ghost | danger`; sizes `sm | md | lg`; loading state.
- `Card.tsx` — bordered rounded panel with optional hover lift + accent glow.
- `Input.tsx` — labeled input with error/helperText.
- `Modal.tsx` — accessible modal (backdrop, esc-to-close).
- `Badge.tsx` — variants `success | warning | danger | info | neutral`, optional dot.
- `Table.tsx` — `Table / Thead / Tbody / Tr / Th / Td` primitives.
- `Skeleton.tsx` — `Skeleton`, `SkeletonText`, `SkeletonCard` loaders.

`cn()` (`lib/utils/cn.ts`) wraps `clsx + tailwind-merge` — used everywhere for conditional class merging.

**Motion:** `framer-motion` for hero animations, mobile drawer, and modal transitions.

**Icons:** `lucide-react` (primary) + `react-icons` (used for `Fa*` brand social icons).

### State Management

- **`UserContext`** (`lib/context/UserContext.tsx`) — module-level singleton browser Supabase client; exposes `{ user, profile, loading, isAdmin, refetchProfile }`. Provided in `app/providers.tsx`, consumed via `useUser()`.
- **`BrandContext`** (`lib/context/BrandContext.tsx`) — toggles between `skillsync` and `skillit`; injects the current accent color as a CSS variable. Provided only in `PublicLayout`.
- **Local state** everywhere else — `useState`/`useReducer`. No Redux/Zustand/Jotai.
- **Server data** — fetched in Server Components via `lib/supabase/queries/*` (SSR), or via `fetch('/api/…')` from client components.
- **Form state** — `react-hook-form` + `zodResolver`.

### Notable Public Components

`components/public/`: `HeroSection` (animated brand-aware hero with particles), `StatCounter`, `AboutSection`, `SocialsSection`, `WorkshopCard`, `WorkshopsFilterGrid`, `ProjectCard`, `ProjectsFilterGrid`, `EventCard`, `EventsFilterGrid`, `ReviewCarousel`, `ReviewsGrid`, `TeamSection`, `OpenPositions`, `Navbar`, `Footer`, `BrandToggle`.

Home page (`app/(public)/page.tsx`) is an RSC that streams sections with `<Suspense>` + `SkeletonCard` fallbacks; each section is an `async` component pulling from Supabase queries.

### Form Components

`components/forms/`:
- `VolunteerApplicationForm.tsx` — public join form, uploads CV via signed URL (see CV flow below).
- `WorkshopRegistrationForm.tsx` — paid workshop signup with payment receipt file upload. Hardcoded default `workshop_id = 'n8n-launchpad-may-2026'`.
- `DynamicEventForm.tsx` — renders arbitrary field schema from `events.form_schema`.
- `FormBuilder.tsx` — admin UI to build a form schema (used by `EventEditor`).
- `ContactForm.tsx`, `ReviewForm.tsx`, `ProfileForm.tsx`, `WeeklyReportForm.tsx`.

---

## Backend

Framework: **Next.js API Route Handlers** (`app/api/**/route.ts`) — no separate server. All handlers are Node.js runtime (default).

### Auth Model

- **Provider:** Supabase Auth (email/password).
- **Session:** cookie-based SSR sessions via `@supabase/ssr`. Middleware refreshes cookies on every request.
- **Three Supabase client factories** in `lib/supabase/`:
  - `client.ts` — browser (anon key).
  - `server.ts` — Server Components / route handlers (anon key + user cookies).
  - `admin.ts` — server-only, **service-role key**, bypasses RLS. Used inside API routes after an admin guard.
  - `middleware.ts` — edge middleware variant.
- **Admin guard pattern** repeated in every `/api/admin/*` route:
  ```ts
  async function guardAdmin() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const admin = createAdminClient()
    const { data: profile } = await admin.from('users').select('is_admin').eq('id', user.id).single()
    return profile?.is_admin ? user : null
  }
  ```
- **Profile row creation** — `handle_new_user()` trigger on `auth.users` inserts a matching `public.users` row (SECURITY DEFINER, ON CONFLICT DO NOTHING). Full name comes from `raw_user_meta_data.full_name` or the email local-part.
- **Approval flow** — approving an application in `/api/admin/applications` generates a random password and creates the auth user via `supabase.auth.admin.createUser` (service-role).

### API Endpoints

All requests validated with `zod`. All admin routes are protected by `guardAdmin()`.

**Public / anonymous:**

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/applications` | POST | Submit volunteer application (accepts a validated `cv_url` storage path from the sign step). |
| `/api/cv-upload/sign` | POST | Returns a Supabase signed upload URL so the browser PUTs the CV directly to storage (avoids Vercel's 4.5 MB body cap). Validates extension server-side. |
| `/api/contact` | POST | Contact-form submission; subject constrained to `{General, Partnership, Client Enquiry, Workshop, Other}`. |
| `/api/newsletter` | POST | Newsletter subscribe (upsert on email). |
| `/api/reviews` | POST | Public review submission (needs admin approval before display). |
| `/api/events` | POST | Generic event registration (via `registerForEvent` mutation). |
| `/api/registrations` | POST | Alt registration endpoint (via `createRegistration` mutation). |
| `/api/workshop-register` | POST | Paid workshop signup — multipart form; handles receipt upload directly (server-side) to the `payment-receipts` bucket. |

**Authenticated:**

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/reports` | POST | Volunteer submits/resubmits their weekly report. |
| `/api/announcements` | GET/POST | Fetch announcements addressed to the caller; admins post new ones. |

**Admin-only** (`/api/admin/*`):

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/admin/applications` | GET / POST | List applications; approve or reject (approve provisions auth user + optional welcome flow). |
| `/api/admin/cvs` | GET | Issues a **signed URL** (1h) to a private CV in the `cvs` bucket. Path is validated (`uploads/…`, no `..`) to prevent traversal. |
| `/api/admin/events` | GET / POST / PATCH / DELETE | Event CRUD + toggle-published. |
| `/api/admin/projects` | GET / POST / PATCH / DELETE | Project CRUD + toggle-published. |
| `/api/admin/reports` | GET / POST | List reports (filter by week/user/status); admin review (`approved`/`rejected` + comment). |
| `/api/admin/reviews` | GET / POST | List by tab (`pending`/`approved`/`featured`); update/delete. |
| `/api/admin/settings` | GET / PATCH | Site-wide key/value settings. |
| `/api/admin/tasks` | GET / POST | List tasks; create assignments. |
| `/api/admin/users` | POST | Discriminated actions: `promote` (change role) or `status` (`active`/`on_hold`/`removed`). |
| `/api/admin/warnings` | POST | Issue warning (severity `minor`/`major`/`final`) or resolve one. |

### Data Access Layer

Every domain has a `queries/<domain>.ts` (reads) and `mutations/<domain>.ts` (writes) module in `lib/supabase/`. Domains: **achievements, admin, analytics, announcements, applications, events, projects, reports, reviews, settings, tasks, users, warnings.** API routes and Server Components call these functions — they never build raw queries inline.

### Database — Postgres (Supabase)

Migrations live in `supabase/migrations/` and must be applied in numerical order:

| # | File | Contents |
|---|------|----------|
| 001 | `001_initial_schema.sql` | All core tables |
| 002 | `002_rls_policies.sql` | Enable RLS on every table + `is_admin()` SECURITY DEFINER helper + policies |
| 003 | `003_functions.sql` | Triggers/functions: `handle_new_user`, `increment_seats_taken`, `sync_warning_count`, `get_unread_announcement_count` |
| 004 | `004_contacts.sql` | `contacts` table + RLS |
| 005 | `005_site_settings.sql` | `site_settings` KV table (seeded defaults) + `announcement_reads` |
| 006 | `006_cv_storage.sql` | `cv_url` column + private `cvs` storage bucket (20 MB, pdf/doc/docx) |
| 007 | `007_workshop_registrations.sql` | `workshop_registrations` table + `payment-receipts` bucket |
| 008 | `008_workshop_seed.sql` | Adds `registration_open`, `is_online`, `location`, `content`, `cover_image` columns; seeds three n8n workshops |
| 009 | `009_payment_receipts_public.sql` | Marks `payment-receipts` bucket public |
| 010 | `010_missing_columns_and_buckets.sql` | Extra project columns; `avatars` + `public` buckets; fixes `site_settings` RLS to use `is_admin()` (original inline EXISTS check was silently failing) |
| 011 | `011_projects_overhaul.sql` | Adds project meta (tagline, builder, tools, results JSON, etc.) |
| 012 | `012_fix_workshop_seats.sql` | Corrects `seats`/`seats_taken` for closed paid workshops |
| 013 | `013_external_registration.sql` | Adds `external_registration_url` + `hide_seats_display`; seeds `llm-bootcamp-1` |

**Tables (public schema):**

| Table | Purpose |
|-------|---------|
| `users` | 1-to-1 with `auth.users`; role, department, status, is_admin, warning_count, socials, skills[]. Roles: `Volunteer|Intern|Lead|C-Suite|Admin`. |
| `applications` | Pre-account public join-form submissions (+ `cv_url` storage path). Status: `pending|approved|rejected|waitlisted`. |
| `events` | Workshops/events/cohorts. Type: `workshop|event|cohort`; brand: `skillsync|skillit`; `is_paid`, `price`, `seats`, `seats_taken`, `registration_open`, `is_published`, `is_online`, `form_schema` (jsonb), `tools_covered` (text[]), `external_registration_url`, `hide_seats_display`. |
| `registrations` | Generic event sign-ups (`form_data` jsonb). |
| `workshop_registrations` | Paid workshop sign-ups (structured columns + payment receipt URL). Status: `pending|confirmed|rejected`. |
| `projects` | Portfolio entries — dozens of case-study columns (`how_it_works`, `key_features`, `results`, `tech_stack`, `time_saved`, `money_saved`, `project_type`, `tagline`, `builder_*`, `industry`, `problem_statement`, etc.). |
| `reviews` | Testimonials (require admin approval). Rating 1–5. |
| `tasks` | Work items assigned to volunteers. Priority `low|medium|high`; status `not_started|in_progress|submitted|completed|overdue`. |
| `reports` | Weekly reports (unique per user+week); `entries` jsonb array of `{day, task_name, hours, deliverable}`. |
| `achievements` | Certificates/milestones/awards; optional cert URL & badge icon. |
| `warnings` | Formal warnings (max 3 per user); auto-syncs `users.warning_count` via `sync_warning_count` trigger. |
| `announcements` | Internal notifications, targeted `all` / role / department / individual user. |
| `announcement_reads` | Per-user read receipts. |
| `team_members` | Controls who appears on public `/team` (`is_public`, `display_order`, `custom_title`). |
| `newsletter` | Email subscription list. |
| `contacts` | Contact-form submissions. |
| `site_settings` | Key/value config (hero taglines, social URLs, feature toggles, `maintenance_mode`, per-topic admin emails). |

**Row-Level Security** is enabled on every table with a consistent pattern:
- Public/anonymous can INSERT to public-form tables (`applications`, `registrations`, `workshop_registrations`, `reviews`, `newsletter`, `contacts`).
- SELECT is scoped to owner + `is_admin()` for user-owned tables (`tasks`, `reports`, `achievements`, `warnings`), or to `is_published/is_approved/is_public = true` + `is_admin()` for public content.
- All admin-only writes (events, projects, reviews moderation, warnings, achievements, team_members, newsletter reads) require `is_admin()`.
- `is_admin()` is a SECURITY DEFINER SQL helper to prevent recursion inside the `users` policies.

**Storage buckets:**

| Bucket | Public? | Size cap | MIME | Notes |
|--------|--------|----------|------|-------|
| `cvs` | No | 20 MB | pdf/doc/docx | Admin-only SELECT policy; writes via service-role. |
| `payment-receipts` | Yes (since 009) | 5 MB | jpeg/png/pdf | Random filenames → enumeration-safe. |
| `avatars` | Yes | 5 MB | jpeg/png/webp/gif | Any authed user can insert/update. |
| `public` | Yes | 10 MB | any | Admin-created project images. |

### Environment Variables

Declared in `.env.example`:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- **Email (Resend)**: `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_EMAIL`.
- **Site**: `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

Current `.env.local` only defines the three Supabase vars — the Resend/site vars are documented but not populated.

### External Services

- **Supabase** — auth, Postgres, storage.
- **Resend** — email (env vars declared and README lists it, but no `import` from a `resend` SDK exists in the code — email sending appears to be planned rather than wired up).
- **Vercel** — hosting target per README.
- **Google Forms** — external registration URL for `llm-bootcamp-1` event.

---

## Data Flow (frontend ↔ backend)

1. **Public listing pages** — React Server Components in `app/(public)/**` call `lib/supabase/queries/*` directly via the anon server client. Data streams to the client under `<Suspense>` with `SkeletonCard` fallbacks.
2. **Client-side mutations** — forms use `react-hook-form` + `zod`, then `fetch('/api/…', { method: 'POST' })`. API routes revalidate with `zod`, apply business logic through mutation helpers, and return JSON. `react-hot-toast` surfaces success/error.
3. **Auth session** — `@supabase/ssr` writes HTTP-only cookies; middleware refreshes them on every request; browser components read the same session via the `UserContext` singleton client.
4. **CV upload flow** — browser POSTs filename to `/api/cv-upload/sign` → server validates extension + issues a **short-lived single-use Supabase signed upload URL** → browser PUTs the file directly to storage → then POSTs the resulting storage path (`uploads/…`) to `/api/applications` → server strictly validates the path with a regex before persisting. This bypasses Vercel's 4.5 MB body limit and keeps large blobs off the serverless function.
5. **Payment receipt flow** (paid workshops) — `WorkshopRegistrationForm` submits multipart form to `/api/workshop-register`, which uploads the receipt server-side (small enough to fit in the body limit) and inserts the `workshop_registrations` row.
6. **Admin actions** — admin panel components fetch `/api/admin/*` endpoints; each is double-guarded (middleware + `guardAdmin()` in the route).

---

## Known Issues / Gotchas / Incomplete Features

1. **Type / schema drift on `Event`** — `lib/types/app.types.ts` `Event` interface uses `start_date` / `end_date` / `max_capacity`, but the SQL schema has `date` / `registration_deadline` / `seats`. The interface duplicates both spellings (`seats`, `date`) so code using one or the other still compiles. Actual DB access should follow the SQL column names.
2. **Warning severity mismatch** — the `Warning` TS type uses `severity: 'minor'|'major'|'final'` and the warnings API accepts these, but the SQL `warnings` table uses `warning_number 1–3` with no `severity` column. `issueWarning`/`resolveWarning` mutations must be reconciling this — worth checking before touching that flow.
3. **Users.status mismatch** — SQL check enforces `active|inactive|suspended`; TS type declares `active|on_hold|removed`; `/api/admin/users` accepts `active|on_hold|removed` (matches TS, not DB). Likely a bug — DB writes with `on_hold`/`removed` would fail the CHECK constraint.
4. **Slug year drift** — `context.md` warns that migrations use `-2026-` (or previously `-2025-`) slugs; the code base and seed data reference both. The hardcoded workshop id in `WorkshopRegistrationForm` and `/api/workshop-register` default is `'n8n-launchpad-may-2026'`.
5. **Resend email is documented but not implemented** — no `resend` package installed, no `import` anywhere; approval / notification emails aren't actually being sent.
6. **No tests** — no Jest/Vitest/Playwright configured; no test files in the repo.
7. **Multiple root package.json** — the outer `D:/2026/skillit website/package.json` isn't the real project — it's likely a stray/duplicate. Always work inside `skillsync-website/`.
8. **Fresh Supabase project needed** — `.env.local` currently only has the three Supabase keys; Resend / site vars documented in `.env.example` aren't populated.
9. **RLS-in-migrations quirk** — migration `010` had to fix `site_settings` policies from an inline `EXISTS` subquery to `is_admin()`; the original silently failed the UPDATE check. Watch for the same trap when adding new admin policies — always call `is_admin()`.
10. **`components/forms/VolunteerApplicationForm.tsx:260`** — placeholder text `+92 XXX XXXXXXX` (this is the only "TODO/XXX-like" marker found in the codebase; it's intentional Pakistan-phone hinting, not an actual TODO).
11. **`icons` package** — `package.json` pins `lucide-react` at `^1.16.0` which is very old; may want to upgrade before adopting newer icons.

---

## Deployment

- **Target:** Vercel (README) — connect the repo and set env vars from `.env.example` in Vercel project settings.
- **`next.config.mjs`** allows remote images from any `*.supabase.co/storage/v1/object/public/**` host and stubs out `canvas` for `@react-pdf/renderer` in the webpack config.
- **No Dockerfile, no CI/CD config** (`.github/workflows/`, `Dockerfile`, `docker-compose.yml`) present in the repo. Only `.claude/settings.local.json` for Claude Code state.
- **`middleware.ts`** matcher excludes `_next/static`, `_next/image`, `favicon.ico`, and common image extensions — everything else runs the auth+maintenance middleware.

---

## Quick Command Reference

```bash
# From skillsync-website/
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

Apply DB changes by running `supabase/migrations/00N_*.sql` files in order against the Supabase project.
