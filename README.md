# skillSYNC × skillIT

Link to the video Demonstration: https://drive.google.com/file/d/1F0GJ0TgUwEXtJlJ4BBdU9b_FxlyHNST1/view?usp=sharing 

Combined website for **skillIT** (creative agency) and **skillSYNC** (tech training platform). Built with Next.js 14 App Router, Supabase, and Tailwind CSS.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database / Auth / Storage | Supabase |
| Forms | react-hook-form + zod |
| Email | Resend |
| Charts | Recharts 2 |
| PDF | @react-pdf/renderer |

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-org/skillsync-website.git
cd skillsync-website
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables — see `.env.example` for full descriptions:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `ADMIN_EMAIL`

### 3. Database

Run the migrations in order against your Supabase project:

```
supabase/migrations/001_schema.sql
supabase/migrations/002_rls.sql
supabase/migrations/003_storage.sql
supabase/migrations/004_functions.sql
supabase/migrations/005_site_settings.sql
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  (public)/        Public-facing pages (home, workshops, projects, events, reviews, apply)
  dashboard/       Volunteer dashboard — auth-gated
  admin/           Admin panel — admin-only
  api/             API route handlers
components/
  ui/              Shared design-system components
  admin/           Admin-only components
  dashboard/       Volunteer dashboard components
  forms/           Form components
lib/
  supabase/        All DB queries and mutations
  hooks/           React hooks
  types/           Shared TypeScript types
  utils/           Helpers
supabase/
  migrations/      SQL migration files
```

## Key routes

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/workshops` | Workshop listings |
| `/projects` | Project portfolio |
| `/events` | Events calendar |
| `/reviews` | Testimonials |
| `/apply` | Volunteer application |
| `/login` | Auth |
| `/dashboard` | Volunteer dashboard |
| `/admin` | Admin panel |
| `/maintenance` | Maintenance holding page |

## Admin panel

Navigate to `/admin` — requires `is_admin = true` on the user's profile. Sections:

- **Dashboard** — summary stats and activity feed
- **Volunteers** — manage users, roles, status
- **Applications** — review and approve/reject
- **Work** — assign and review tasks
- **Warnings** — issue and resolve warnings
- **Events** — create and manage workshops/events
- **Projects** — create and manage portfolio entries
- **Reviews** — moderate testimonials
- **Reports** — review weekly volunteer reports
- **Certificates** — generate PDF certificates and letters
- **Analytics** — charts for headcount, submissions, registrations
- **Settings** — site content, social links, feature toggles

## Deployment

Deploy to [Vercel](https://vercel.com) — connect the repo and set all environment variables from `.env.example` in the Vercel project settings.

The `SUPABASE_SERVICE_ROLE_KEY` is server-only — it is never sent to the browser.
