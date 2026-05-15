import { Suspense } from 'react'
import Link from 'next/link'
import HeroSection from '@/components/public/HeroSection'
import StatCounter from '@/components/public/StatCounter'
import AboutSection from '@/components/public/AboutSection'
import SocialsSection from '@/components/public/SocialsSection'
import WorkshopCard from '@/components/public/WorkshopCard'
import ProjectCard from '@/components/public/ProjectCard'
import EventCard from '@/components/public/EventCard'
import ReviewCarousel from '@/components/public/ReviewCarousel'
import TeamSection from '@/components/public/TeamSection'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { getPublishedWorkshops, getUpcomingEvents } from '@/lib/supabase/queries/events'
import { getPublishedProjects } from '@/lib/supabase/queries/projects'
import { getApprovedReviews } from '@/lib/supabase/queries/reviews'
import { getPublicTeamMembers } from '@/lib/supabase/queries/users'

// ─── Private section header ────────────────────────────────────────────────
function SectionHeader({ title, subtitle, href, linkLabel }: {
  title: string
  subtitle?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-light">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-gray-400 max-w-xl">{subtitle}</p>
        )}
      </div>
      {href && linkLabel && (
        <Link href={href} className="text-sm font-semibold text-brand-accent hover:underline flex-shrink-0">
          {linkLabel} →
        </Link>
      )}
    </div>
  )
}

// ─── Card skeleton grids ────────────────────────────────────────────────────
function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

// ─── Async data sections ────────────────────────────────────────────────────
async function WorkshopsSection() {
  const workshops = await getPublishedWorkshops(6)
  if (workshops.length === 0) {
    return (
      <p className="text-center py-10 text-brand-muted">Workshops coming soon.</p>
    )
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
    return (
      <p className="text-center py-10 text-brand-muted">Projects coming soon.</p>
    )
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
    return (
      <p className="text-center py-10 text-brand-muted">No upcoming events right now. Check back soon.</p>
    )
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
  return <TeamSection members={members} />
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatCounter />
      <AboutSection />

      {/* Workshops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeader
          title="Our Workshops"
          subtitle="Hands-on sessions that give you practical skills you can use right away."
          href="/workshops"
          linkLabel="All workshops"
        />
        <Suspense fallback={<GridSkeleton count={3} />}>
          <WorkshopsSection />
        </Suspense>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-brand-muted/10">
        <SectionHeader
          title="Our Projects"
          subtitle="Real products built by our fellows — from concept to deployment."
          href="/projects"
          linkLabel="All projects"
        />
        <Suspense fallback={<GridSkeleton count={3} />}>
          <ProjectsSection />
        </Suspense>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-brand-muted/10">
        <SectionHeader
          title="Upcoming Events"
          subtitle="Cohorts, hackathons, and learning sessions open for registration."
          href="/events"
          linkLabel="All events"
        />
        <Suspense fallback={<ListSkeleton count={4} />}>
          <EventsSection />
        </Suspense>
      </section>

      {/* Reviews */}
      <section className="py-20 border-t border-brand-muted/10 bg-brand-darker/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="What People Say"
            subtitle="Hear from our community of learners, builders, and contributors."
            href="/reviews"
            linkLabel="Leave a review"
          />
        </div>
        <Suspense fallback={<GridSkeleton count={3} />}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ReviewsSection />
          </div>
        </Suspense>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-brand-muted/10">
        <SectionHeader
          title="Meet the Team"
          subtitle="The people behind skillSYNC and skillIT."
          href="/team"
          linkLabel="Full team"
        />
        <Suspense fallback={<GridSkeleton count={4} />}>
          <TeamSectionServer />
        </Suspense>
      </section>

      {/* Socials */}
      <section className="py-20 border-t border-brand-muted/10 bg-brand-darker/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Stay Connected"
            subtitle="Follow us for updates, tips, and community highlights."
          />
          <SocialsSection />
        </div>
      </section>
    </>
  )
}
