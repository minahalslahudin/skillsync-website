import type { Metadata } from 'next'
import Link from 'next/link'
import WorkshopRegistrationForm from '@/components/forms/WorkshopRegistrationForm'
import SectionHeader from '@/components/public/SectionHeader'

export const metadata: Metadata = {
  title: 'Register — n8n Launchpad | skillSYNC',
  description:
    'Secure your seat at the n8n Launchpad. 5 hours, fully hands-on, portfolio-ready automation workshop on 25 May 2026.',
}

const DETAILS = [
  { label: 'Date',     value: 'Mon, 25 May 2026' },
  { label: 'Duration', value: '5 Hours' },
  { label: 'Price',    value: 'Rs 450' },
  { label: 'Format',   value: 'Live Online' },
]

const PERKS = [
  'Certificate for all attendees',
  'Competency Letter for anyone who completes the special home challenge',
  '3 live workflows + 1 portfolio-ready project (CV Screener + Notion Talent Board)',
]

export default function WorkshopRegisterPage() {
  return (
    <>
      {/* Breadcrumb strip */}
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-3">
        <nav className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)]">
          <Link href="/workshops" className="hover:text-red">Workshops</Link>
          <span>/</span>
          <Link href="/workshops/n8n-launchpad-may-2026" className="hover:text-red">n8n Launchpad</Link>
          <span>/</span>
          <span className="text-black">Register</span>
        </nav>
      </div>

      <SectionHeader
        eyebrow="Workshop Registration"
        title="n8n Launchpad"
        subtitle="From Zero to Portfolio in 5 Hours."
      />

      {/* Detail cells — 4-col bordered grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b-[3px] border-black bg-white">
        {DETAILS.map((d, i) => (
          <div
            key={d.label}
            className={[
              'p-5 border-b-[3px] border-black sm:border-b-0',
              i < DETAILS.length - 1 ? 'sm:border-r-[3px] sm:border-black' : '',
              i % 2 === 0 && i === DETAILS.length - 2 ? '' : '',
              i % 2 === 0 ? 'border-r-[3px] border-black sm:border-r-[3px]' : '',
            ].join(' ')}
          >
            <p className="text-[0.68rem] uppercase tracking-[2px] text-red">{d.label}</p>
            <p className="font-editorial text-black text-[1.8rem] leading-none mt-2">{d.value}</p>
          </div>
        ))}
      </div>

      {/* Perks strip */}
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-red text-white">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[2px] mb-3">What you&apos;ll get</p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERKS.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[0.9rem] leading-[1.6]">
              <span className="text-white font-bold flex-shrink-0">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form */}
      <SectionHeader eyebrow="Fill In Your Details" title="Your Application" subtitle="All fields are required unless marked otherwise." />
      <div className="p-6 sm:p-10 border-b-[3px] border-black bg-white">
        <div className="max-w-2xl mx-auto border-[3px] border-black bg-white p-8">
          <WorkshopRegistrationForm />
        </div>
      </div>
    </>
  )
}
