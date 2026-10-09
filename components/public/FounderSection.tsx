'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaLinkedin } from 'react-icons/fa'

// Editorial-bold "Meet the Founder" section.
// Lives at the top of the /team page while the rest of the team is being
// re-photographed. Matches the site's editorial-bold system: 3px black
// borders, Bebas Neue headlines, red accents, white panels, no rounded
// corners, scroll-in reveal animations.

const BIO_PARAGRAPHS: string[] = [
  'Minahal Salahudin is the Founder & CEO of skillSYNC, an ed-tech startup based in Islamabad, Pakistan, focused on giving students and young professionals practical, job-ready skills.',
  'Currently studying at FAST, Minahal brings a rare mix of experience across cybersecurity analysis and AI automation engineering. That technical depth shapes everything skillSYNC teaches: real tools, real projects, and real outcomes instead of theory alone.',
  "Under Minahal's leadership, skillSYNC runs hands-on cohorts and workshops, including the AI Cohort 1.0 workshop series under Accelerate Punjab, and the skillSYNC Community, an open space for developers and learners from every department. Its agency arm, skillIT, delivers AI, automation, and web solutions to businesses, which keeps the learning side grounded in what clients actually need.",
  'skillSYNC was recognized as a Top 20 emerging startup in Cohort 1 of the PITB Accelerate Punjab Incubation Program at the Rawalpindi Incubation Center.',
  "Minahal's mission is simple: help more people in Pakistan build skills that lead to real work.",
]

const CREDENTIALS: { label: string }[] = [
  { label: 'Founder & CEO, skillSYNC' },
  { label: 'Top 20 Emerging Startup, PITB Accelerate Punjab (Cohort 1)' },
  { label: 'Student, FAST' },
  { label: 'Background: Cybersecurity and AI Automation' },
]

const MILESTONES: { date: string; label: string }[] = [
  { date: 'APR 2026', label: 'Founded skillSYNC' },
  { date: 'JUN 2026', label: 'Launched skillIT, the agency arm for AI, automation, and web solutions' },
  { date: 'JUN 2026', label: 'Selected for the PITB Accelerate Punjab Incubation Program, Rawalpindi Incubation Center' },
  { date: 'JUL 2026', label: 'Ran AI Cohort 1.0 workshop series' },
  { date: 'SEP 2026', label: 'Launched skillSYNC Community' },
]

const RUNNING_STATS: { value: string; label: string }[] = [
  { value: '300+', label: 'Students trained' },
  { value: '10+',  label: 'Cohorts run' },
]

const FOUNDER_IMAGE_SRC = '/team/founder.jpeg'

const LINKEDIN_URL = 'https://www.linkedin.com/in/minahal-salahudin-a5747534b'

const COMMUNITY_FORM_URL = 'https://forms.gle/8E9uzGXQSf4kdJK18'

export default function FounderSection() {
  return (
    <section aria-labelledby="founder-heading" className="bg-white">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 py-8 sm:py-10 border-b-[3px] border-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red">
            Meet the Founder
          </p>
          <h2
            id="founder-heading"
            className="font-editorial text-black text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] leading-[0.9] tracking-[2px]"
          >
            THE PERSON BEHIND SKILLSYNC
          </h2>
          <p className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-[640px]">
            Founder &amp; CEO of skillSYNC and skillIT, building practical tech skills and real solutions for Pakistan.
          </p>
        </motion.div>
      </div>

      {/* ── Bio (left on desktop) + portrait (right on desktop) ───────────────
          Mobile keeps the photo on top via DOM order; `lg:order-last` moves it
          to the right-hand column on desktop. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] border-b-[3px] border-black">
        {/* Photo — fixed 4:5 aspect to prevent CLS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full aspect-[4/5] bg-black border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-black overflow-hidden lg:order-last"
        >
          <Image
            src={FOUNDER_IMAGE_SRC}
            alt="Minahal Salahudin, Founder and CEO of skillSYNC"
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="p-6 sm:p-10 flex flex-col gap-5"
        >
          <h3 className="font-editorial text-black text-[2rem] sm:text-[2.4rem] leading-[0.95] tracking-[2px]">
            MINAHAL SALAHUDIN
          </h3>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[2px] text-red">
            Founder &amp; CEO
          </p>
          <div className="flex flex-col gap-4 text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8]">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Credentials strip (4 badges) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b-[3px] border-black">
        {CREDENTIALS.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(i * 0.05, 0.2) }}
            className={[
              'p-6 sm:p-8 flex items-start gap-4 bg-white',
              // horizontal and vertical dividers that collapse neatly at each breakpoint
              'border-b-[3px] border-black sm:[&:nth-child(odd)]:border-r-[3px] sm:[&:nth-child(odd)]:border-black',
              'lg:!border-r-[3px] lg:border-black lg:[&:last-child]:!border-r-0',
              i >= CREDENTIALS.length - 2 ? 'sm:border-b-0' : '',
            ].join(' ')}
          >
            <div className="font-editorial text-red text-[2.4rem] leading-none shrink-0">
              0{i + 1}
            </div>
            <p className="text-[0.85rem] sm:text-[0.9rem] font-semibold text-black leading-[1.5] tracking-[0.3px]">
              {c.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Milestones timeline ───────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 py-10 sm:py-12 border-b-[3px] border-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-8"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red">
            Milestones
          </p>
          <h3 className="font-editorial text-black text-[2rem] sm:text-[2.6rem] leading-[0.95] tracking-[2px] mt-2">
            THE ROAD SO FAR
          </h3>
        </motion.div>

        <ol className="relative border-l-[3px] border-black ml-2 sm:ml-4 flex flex-col gap-6 sm:gap-8">
          {MILESTONES.map((m, i) => (
            <motion.li
              key={`${m.date}-${i}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(i * 0.06, 0.3) }}
              className="relative pl-6 sm:pl-8"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[9px] top-2 w-[15px] h-[15px] bg-red border-[3px] border-black"
              />
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-5">
                <div className="font-editorial text-black text-[1.6rem] leading-none tracking-[1.5px] uppercase min-w-[8rem]">
                  {m.date}
                </div>
                <p className="text-[0.92rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-1 sm:mt-0">
                  {m.label}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Running stats strip */}
        <div className="mt-10 grid grid-cols-2 border-[3px] border-black">
          {RUNNING_STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                'p-5 sm:p-6 text-center',
                i === 0 ? 'border-r-[3px] border-black' : '',
              ].join(' ')}
            >
              <div className="font-editorial text-red text-[2.4rem] sm:text-[3rem] leading-none">
                {s.value}
              </div>
              <div className="mt-2 text-[0.72rem] sm:text-[0.78rem] font-semibold uppercase tracking-[2px] text-black">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pull quote ────────────────────────────────────────────────────── */}
      <div className="border-b-[3px] border-black bg-[color:var(--color-red)]">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="px-6 sm:px-10 py-12 sm:py-16 max-w-5xl mx-auto"
        >
          <p className="font-editorial text-white text-[2rem] sm:text-[3rem] md:text-[3.6rem] leading-[1.05] tracking-[1.5px]">
            &ldquo;IF YOU CAN BUILD IT, YOU CAN LEARN IT. WE MAKE SURE YOU BUILD IT.&rdquo;
          </p>
          <footer className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[3px] text-white/85">
            Minahal Salahudin, Founder &amp; CEO
          </footer>
        </motion.blockquote>
      </div>

      {/* ── CTAs ──────────────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 py-10 sm:py-12 border-b-[3px] border-black">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-0 sm:gap-0"
        >
          <a
            href={COMMUNITY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ed-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
          >
            Join the Community
          </a>
          <Link
            href="/skillit"
            className="btn-ed-outline sm:border-l-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
          >
            Work with skillIT
          </Link>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ed-outline sm:border-l-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red inline-flex items-center gap-2"
          >
            <FaLinkedin aria-hidden="true" className="h-4 w-4" />
            Connect on LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  )
}
