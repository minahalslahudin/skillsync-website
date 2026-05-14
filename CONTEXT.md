# skillSYNC × skillIT — Master Project Context

# PASTE THIS AT THE START OF EVERY CLAUDE CODE SESSION

\---

## PROJECT IDENTITY

* **Project:** Combined website for skillIT (agency) + skillSYNC (training platform)
* **Repo:** `skillsync-website` (monorepo — one Next.js app)
* **Live URL target:** Deployed on Vercel (free tier)
* **Database:** Supabase (free tier) — PostgreSQL + Auth + Storage
* **Primary brand color:** `#E94560` (accent red)
* **Dark background:** `#1A1A2E`

\---

## ABSOLUTE RULES — NEVER BREAK THESE

1. **Stack is locked.** Next.js 14 (App Router), Tailwind CSS, Supabase, TypeScript. Do NOT suggest or use any other framework, ORM, or auth library.
2. **No new dependencies without asking.** Before installing any package, state what it is and why. Only install if it has no free-tier cost.
3. **File structure is locked** (see below). Do not create files outside the defined structure.
4. **Always use TypeScript.** No `.js` files except config files (`next.config.js`, `tailwind.config.js`, `postcss.config.js`).
5. **Never hardcode data.** All content (workshops, projects, reviews, events, team) comes from Supabase. No static arrays of content in components.
6. **Environment variables** go in `.env.local` and are referenced as `process.env.NEXT\\\\\\\_PUBLIC\\\\\\\_\\\\\\\*` (client) or `process.env.\\\\\\\*` (server only). Never hardcode keys.
7. **Auth guard pattern is fixed** (see below). Do not create alternative auth patterns.
8. **One component = one file.** No multi-component files except `index.ts` barrel exports.
9. **All forms use react-hook-form + zod.** No exceptions.
10. **All DB queries go through `/lib/supabase/` helper functions.** No raw Supabase calls in components.

\---

## TECH STACK — EXACT VERSIONS

```json
{
  "next": "14.2.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "@supabase/supabase-js": "2.x",
  "@supabase/ssr": "latest",
  "react-hook-form": "7.x",
  "zod": "3.x",
  "framer-motion": "11.x",
  "recharts": "2.x",
  "react-hot-toast": "2.x",
  "@react-pdf/renderer": "3.x"
}
```

\---

## FILE \& FOLDER STRUCTURE — EXACT

```
skillsync-website/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── page.tsx              # Home /
│   │   ├── about/page.tsx
│   │   ├── skillit/page.tsx
│   │   ├── skillsync/page.tsx
│   │   ├── workshops/
│   │   │   ├── page.tsx
│   │   │   └── \\\\\\\[slug]/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── \\\\\\\[slug]/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── \\\\\\\[slug]/page.tsx
│   │   ├── team/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── join/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/                   # Auth route group
│   │   └── login/page.tsx
│   ├── dashboard/                # Volunteer dashboard (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── profile/page.tsx
│   │   ├── work/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── achievements/page.tsx
│   │   └── team/page.tsx         # Leads/C-Suite only
│   ├── admin/                    # Admin panel (protected, admin only)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── volunteers/page.tsx
│   │   ├── work/page.tsx
│   │   ├── events/page.tsx
│   │   ├── forms/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── applications/page.tsx
│   │   ├── warnings/page.tsx
│   │   ├── certificates/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── settings/page.tsx
│   ├── api/                      # API routes
│   │   ├── applications/route.ts
│   │   ├── reviews/route.ts
│   │   ├── contact/route.ts
│   │   ├── events/route.ts
│   │   ├── newsletter/route.ts
│   │   └── certificates/route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── public/                   # Public site components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── BrandToggle.tsx
│   │   ├── WorkshopCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ReviewCarousel.tsx
│   │   ├── TeamSection.tsx
│   │   ├── EventCard.tsx
│   │   ├── StatCounter.tsx
│   │   ├── SocialsSection.tsx
│   │   └── AboutSection.tsx
│   ├── forms/                    # All form components
│   │   ├── VolunteerApplicationForm.tsx
│   │   ├── DynamicEventForm.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ContactForm.tsx
│   │   ├── WeeklyReportForm.tsx
│   │   └── FormBuilder.tsx       # Admin form builder
│   ├── dashboard/                # Dashboard components
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── TaskCard.tsx
│   │   ├── ReportCard.tsx
│   │   ├── AchievementCard.tsx
│   │   └── TeamMemberRow.tsx
│   ├── admin/                    # Admin components
│   │   ├── VolunteerTable.tsx
│   │   ├── ApplicationCard.tsx
│   │   ├── WorkAssignModal.tsx
│   │   ├── EventEditor.tsx
│   │   ├── ProjectEditor.tsx
│   │   ├── WarningModal.tsx
│   │   └── AnalyticsChart.tsx
│   └── ui/                       # Reusable primitives
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── Skeleton.tsx
│       ├── Toast.tsx
│       └── Table.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client (SSR)
│   │   ├── middleware.ts         # Auth middleware helper
│   │   ├── queries/
│   │   │   ├── events.ts
│   │   │   ├── projects.ts
│   │   │   ├── reviews.ts
│   │   │   ├── users.ts
│   │   │   ├── tasks.ts
│   │   │   ├── reports.ts
│   │   │   ├── achievements.ts
│   │   │   └── applications.ts
│   │   └── mutations/
│   │       ├── events.ts
│   │       ├── projects.ts
│   │       ├── reviews.ts
│   │       ├── users.ts
│   │       ├── tasks.ts
│   │       └── reports.ts
│   ├── types/
│   │   ├── database.types.ts     # Auto-generated from Supabase
│   │   └── app.types.ts          # App-specific types
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── slugify.ts
│   │   └── cn.ts                 # clsx + tailwind-merge helper
│   └── constants/
│       ├── roles.ts
│       └── departments.ts
├── middleware.ts                  # Route protection
├── supabase/
│   ├── migrations/               # All SQL migrations
│   │   ├── 001\\\\\\\_initial\\\\\\\_schema.sql
│   │   ├── 002\\\\\\\_rls\\\\\\\_policies.sql
│   │   └── 003\\\\\\\_seed\\\\\\\_data.sql
│   └── config.toml
├── public/
│   ├── logo-skillsync.svg
│   ├── logo-skillit.svg
│   └── og-image.png
├── .env.local                    # Never commit
├── .env.example                  # Commit this (empty values)
├── next.config.js
├── tailwind.config.js
├── middleware.ts
└── tsconfig.json
```

\---

## DESIGN SYSTEM — EXACT TOKENS (Never deviate)

```typescript
// tailwind.config.js colors — USE THESE CLASS NAMES ONLY
colors: {
  brand: {
    dark:    '#1A1A2E',   // bg-brand-dark
    darker:  '#0D0D1A',   // bg-brand-darker
    mid:     '#2C2C54',   // bg-brand-mid
    accent:  '#E94560',   // bg-brand-accent, text-brand-accent
    muted:   '#4A4E69',   // text-brand-muted
    light:   '#F0F4FF',   // bg-brand-light
  },
  skillit: {
    accent:  '#0F6B7A',   // bg-skillit-accent
    light:   '#E8F4F8',
  }
}
```

```typescript
// Typography scale — USE THESE CLASSES ONLY
// Headings: font-display (Inter, weight 700+)
// Body: font-sans (Inter, weight 400)
// h1: text-5xl md:text-7xl font-display font-black
// h2: text-3xl md:text-4xl font-display font-bold
// h3: text-xl md:text-2xl font-display font-semibold
// body: text-base font-sans text-gray-300
// small: text-sm font-sans text-gray-400
```

\---

## AUTH PATTERN — FIXED, DO NOT CHANGE

```typescript
// middleware.ts — protects /dashboard and /admin
// Checks Supabase session. If none → redirect /login
// /admin routes also check user.is\\\\\\\_admin === true

// HOW TO GET USER IN SERVER COMPONENT:
import { createServerClient } from '@/lib/supabase/server'
const supabase = createServerClient()
const { data: { user } } = await supabase.auth.getUser()

// HOW TO GET USER IN CLIENT COMPONENT:
import { useUser } from '@/hooks/useUser'  // custom hook wrapping supabase client
const { user, profile, loading } = useUser()

// USER PROFILE (from 'users' table, not auth.users):
// After login, fetch user profile from public.users where id = auth.user.id
// Store in context: UserContext (see /lib/context/UserContext.tsx)
```

\---

## DATABASE TABLES SUMMARY

```
users           — profiles (id links to auth.users)
applications    — volunteer applications (pre-account)
events          — workshops, events, cohorts
registrations   — event sign-ups (form\\\\\\\_data is JSON)
projects        — portfolio projects
reviews         — testimonials (need approval)
tasks           — assigned work items
reports         — weekly work reports (entries is JSON array)
achievements    — certificates and milestones
warnings        — formal warning log
announcements   — internal notifications
team\\\\\\\_members    — public team display
newsletter      — email list
```

**Key relationships:**

* `users.id` = `auth.users.id` (UUID)
* `tasks.assigned\\\\\\\_to` → `users.id`
* `reports.user\\\\\\\_id` → `users.id`
* `achievements.user\\\\\\\_id` → `users.id`
* `registrations.event\\\\\\\_id` → `events.id`

\---

## COMPONENT PATTERNS — ALWAYS USE THESE

```typescript
// 1. SERVER COMPONENT (default for pages that fetch data)
export default async function WorkshopsPage() {
  const supabase = createServerClient()
  const { data: workshops } = await supabase
    .from('events')
    .select('\\\\\\\*')
    .eq('type', 'workshop')
    .eq('is\\\\\\\_published', true)
  return <WorkshopGrid workshops={workshops ?? \\\\\\\[]} />
}

// 2. CLIENT COMPONENT (only when needed: forms, animations, interactivity)
'use client'
// Add this directive ONLY when component uses: useState, useEffect, 
// event handlers, browser APIs, framer-motion animations

// 3. LOADING STATE — always use Suspense + Skeleton
// Wrap async server components in <Suspense fallback={<Skeleton />}>

// 4. ERROR HANDLING — every query must handle null
const { data: events, error } = await supabase.from('events').select('\\\\\\\*')
if (error) console.error(error) // log but don't crash
// Always use: data ?? \\\\\\\[] for arrays, data ?? null for objects

// 5. FORMS — always react-hook-form + zod
const schema = z.object({ name: z.string().min(2), email: z.string().email() })
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
```

\---

## ANIMATION PATTERN — FRAMER MOTION (consistent across site)

```typescript (make it work for all frame sizes)
// Scroll reveal — use on ALL section entries
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
}
// Wrap with: <motion.div viewport={{ once: true }} whileInView="animate" initial="initial" variants={fadeUp}>

// Card hover — use on ALL cards
className="... transition-all duration-300 hover:-translate-y-1 hover:shadow-\\\\\\\[0\\\\\\\_0\\\\\\\_20px\\\\\\\_rgba(233,69,96,0.3)] hover:border-brand-accent"

// Button hover
className="... transition-all duration-200 hover:scale-105 active:scale-95"
```

\---

## CURRENT BUILD STATUS

<!-- Claude Code updates this section as features are completed -->

* \[ ] Phase 1 — Public Website
* \[ ] Phase 2 — Auth + Volunteer Dashboard
* \[ ] Phase 3 — Admin Panel
* \[ ] Phase 4 — Polish + Deploy

**Last completed session:** \[Update this after each session]
**Next task:** \[Update this after each session]

\---

## ENVIRONMENT VARIABLES NEEDED

```bash
# .env.local

NEXT\_PUBLIC\_SUPABASE\_URL=https://prbysenecueagvhvnkxb.supabase.co

NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYnlzZW5lY3VlYWd2aHZua3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3Nzg2ODcsImV4cCI6MjA5NDM1NDY4N30.eMOmf1Hx-QtggR6u22D8LoPWvZzIO\_jaNNL-oxOOwbE

SUPABASE\_SERVICE\_ROLE\_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYnlzZW5lY3VlYWd2aHZua3hiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc3ODY4NywiZXhwIjoyMDk0MzU0Njg3fQ.QIGK9fJ1fBMSPnwigYpU0f9SE-ZGuzQR93YMrwtWl6Q

RESEND\_API\_KEY=re\_BGZaX5BC

NEXT\_PUBLIC\_SITE\_URL=http://localhost:3000
```

\---

## WHAT NOT TO DO — COMMON MISTAKES TO AVOID

* ❌ Do NOT use `getServerSideProps` or `getStaticProps` — we use App Router
* ❌ Do NOT use `pages/` directory — only `app/`
* ❌ Do NOT import server-only code in client components
* ❌ Do NOT use `useRouter` for redirects in server components — use `redirect()` from `next/navigation`
* ❌ Do NOT create a Prisma schema — we use Supabase client directly
* ❌ Do NOT use `axios` — use native `fetch` or Supabase client
* ❌ Do NOT use `useState` for server-fetched data — fetch in server component, pass as props
* ❌ Do NOT skip TypeScript types — every function needs typed params and return
* ❌ Do NOT use inline styles — only Tailwind classes
* ❌ Do NOT hardcode any text content that should come from DB



