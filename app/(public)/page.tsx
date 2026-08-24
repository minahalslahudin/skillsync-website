import { Suspense } from 'react'
import HeroSection from '@/components/public/HeroSection'
import Ticker from '@/components/public/Ticker'
import StatCounter from '@/components/public/StatCounter'
import AboutSection from '@/components/public/AboutSection'
import SocialsSection from '@/components/public/SocialsSection'
import WorkshopCard from '@/components/public/WorkshopCard'
import ProjectCard from '@/components/public/ProjectCard'
import EventCard from '@/components/public/EventCard'
import ReviewCarousel from '@/components/public/ReviewCarousel'
import TeamSection from '@/components/public/TeamSection'
import SectionHeader from '@/components/public/SectionHeader'
import { getPublishedWorkshops, getUpcomingEvents } from '@/lib/supabase/queries/events'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import { getApprovedReviews } from '@/lib/supabase/queries/reviews'
import { getPublicTeamMembers } from '@/lib/supabase/queries/users'

// Scrolling ticker items — pulled from the inspiration design.
const TICKER_ITEMS = [
  'n8n', 'Make.com', 'LLM Engineering', 'Automation', 'Full-Stack',
  'AI Workflows', 'Robotics', 'CV Screening', 'Lead Capture', 'Bug Triage',
]

// ── Skeleton grids (editorial style — bordered rectangles) ─────────────────
function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-[3px] border-black h-64 animate-pulse bg-[color:var(--color-off-white)]" />
      ))}
    </div>
  )
}
function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-[3px] border-black h-24 animate-pulse bg-[color:var(--color-off-white)]" />
      ))}
    </div>
  )
}

// ── Async data sections ────────────────────────────────────────────────────
async function WorkshopsSection() {
  const workshops = await getPublishedWorkshops(6)
  if (workshops.length === 0) {
    return <p className="text-center py-10 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">Workshops coming soon.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workshops.map((w) => <WorkshopCard key={w.id} event={w} />)}
    </div>
  )
}
async function ProjectsSection() {
  const projects = await getPublishedProjects(6)
  if (projects.length === 0) {
    return <p className="text-center py-10 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">Projects coming soon.</p>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}
async function EventsSection() {
  const events = await getUpcomingEvents(6)
  if (events.length === 0) {
    return <p className="text-center py-10 text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">No upcoming events right now.</p>
  }
  return (
    <div className="flex flex-col gap-4">
      {events.map((e) => <EventCard key={e.id} event={e} />)}
    </div>
  )
}
async function ReviewsSection() {
  const reviews = await getApprovedReviews(10)
  return <ReviewCarousel reviews={reviews} />
}
async function TeamSectionServer() {
  const members = await getPublicTeamMembers()
  return <TeamSection members={members.slice(0, 6)} />
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* Ticker sits directly under the fixed nav */}
      <Ticker items={TICKER_ITEMS} variant="red" />

      {/* Hero (two-column, red panel right) */}
      <HeroSection />

      {/* Live stats — 4 columns, bordered */}
      <StatCounter />

      {/* About / brand story */}
      <AboutSection />

      {/* Workshops */}
      <section>
        <SectionHeader
          eyebrow="What We Teach"
          title="Our Workshops"
          subtitle="Hands-on sessions that give you skills you can use the next day."
          href="/workshops"
          linkLabel="All workshops"
        />
        <div className="p-6 sm:p-10 border-b-[3px] border-black">
          <Suspense fallback={<GridSkeleton count={3} />}>
            <WorkshopsSection />
          </Suspense>
        </div>
      </section>

      {/* Projects */}
      <section>
        <SectionHeader
          eyebrow="What We Build"
          title="Our Projects"
          subtitle="Real products built by our fellows — concept to deployment."
          href="/projects"
          linkLabel="All projects"
        />
        <div className="p-6 sm:p-10 border-b-[3px] border-black">
          <Suspense fallback={<GridSkeleton count={3} />}>
            <ProjectsSection />
          </Suspense>
        </div>
      </section>

      {/* Events */}
      <section>
        <SectionHeader
          eyebrow="Coming Up"
          title="Upcoming Events"
          subtitle="Cohorts, hackathons, and learning sessions open for registration."
          href="/events"
          linkLabel="All events"
        />
        <div className="p-6 sm:p-10 border-b-[3px] border-black">
          <Suspense fallback={<ListSkeleton count={4} />}>
            <EventsSection />
          </Suspense>
        </div>
      </section>

      {/* Reviews */}
      <section>
        <SectionHeader
          eyebrow="Community"
          title="What People Say"
          subtitle="Honest words from learners, builders, and contributors."
          href="/reviews"
          linkLabel="Leave a review"
        />
        <div className="p-6 sm:p-10 border-b-[3px] border-black">
          <Suspense fallback={<GridSkeleton count={1} />}>
            <ReviewsSection />
          </Suspense>
        </div>
      </section>

      {/* Team */}
      <section>
        <SectionHeader
          eyebrow="Our People"
          title="Meet The Team"
          subtitle="The people behind skillSYNC and skillIT."
          href="/team"
          linkLabel="Full team"
        />
        <div className="p-6 sm:p-10 border-b-[3px] border-black">
          <Suspense fallback={<GridSkeleton count={3} />}>
            <TeamSectionServer />
          </Suspense>
        </div>
      </section>

      {/* Socials */}
      <SocialsSection />

      {/* Second ticker at bottom for rhythm */}
      <Ticker items={TICKER_ITEMS} variant="black" />
    </>
  )
}
