import type { Metadata } from 'next'
import Link from 'next/link'
import WorkshopRegistrationForm from '@/components/forms/WorkshopRegistrationForm'

export const metadata: Metadata = {
  title: 'Register — n8n Launchpad | skillSYNC',
  description:
    'Secure your seat at the n8n Launchpad. 5 hours, fully hands-on, portfolio-ready automation workshop on 26 May 2025.',
}

const DETAILS = [
  { label: 'Date',     value: 'Mon, 26 May 2025' },
  { label: 'Duration', value: '5 Hours' },
  { label: 'Price',    value: 'Rs 450' },
  { label: 'Format',   value: 'Live Online' },
]

export default function WorkshopRegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted mb-8">
        <Link href="/workshops" className="hover:text-brand-accent transition-colors">
          Workshops
        </Link>
        <span>/</span>
        <Link
          href="/workshops/n8n-launchpad-may-2025"
          className="hover:text-brand-accent transition-colors"
        >
          n8n Launchpad
        </Link>
        <span>/</span>
        <span className="text-brand-light">Register</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3">
          Workshop Registration
        </p>
        <h1 className="text-3xl md:text-4xl font-display font-black text-brand-light leading-tight">
          n8n Launchpad
        </h1>
        <p className="text-xl text-brand-accent font-semibold mt-1">
          From Zero to Portfolio in 5 Hours
        </p>

        {/* Key detail cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DETAILS.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-brand-muted/20 bg-brand-mid p-4 text-center"
            >
              <p className="text-xs text-brand-muted mb-1">{label}</p>
              <p className="text-sm font-semibold text-brand-light">{value}</p>
            </div>
          ))}
        </div>

        {/* Perks */}
        <div className="mt-5 rounded-xl border border-brand-accent/20 bg-brand-accent/5 px-5 py-4">
          <p className="text-sm font-semibold text-brand-accent mb-2">What you&apos;ll get</p>
          <ul className="text-sm text-gray-300 space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-brand-accent mt-0.5 flex-shrink-0">✓</span>
              Certificate for all attendees
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-accent mt-0.5 flex-shrink-0">✓</span>
              Competency Letter for anyone who completes the special home challenge
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-accent mt-0.5 flex-shrink-0">✓</span>
              3 live workflows + 1 portfolio-ready project (CV Screener + Notion Talent Board)
            </li>
          </ul>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-6 sm:p-8">
        <h2 className="text-xl font-display font-bold text-brand-light mb-1">
          Your Details
        </h2>
        <p className="text-sm text-brand-muted mb-7">
          All fields are required unless marked otherwise.
        </p>
        <WorkshopRegistrationForm />
      </div>

    </div>
  )
}
