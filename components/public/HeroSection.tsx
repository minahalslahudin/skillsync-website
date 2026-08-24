'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Editorial-bold hero — direct translation of the inspiration file.
// Left column: giant Bebas Neue headline + sub + two connected buttons.
// Right column: red panel for the skillIT/agency pitch.
// A relatively-positioned `#hero-3d-canvas` sits behind the text so a
// future Three.js/Spline element can be dropped in without layout changes.

const WORDS = ['STOP', 'WATCHING.', 'START', 'BUILDING.']

const RECENT = [
  'LeadSYNC AI · Auto Recruiting Bot',
  'WhatsApp Support Bot · AI Digest Bot',
]

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] border-b-[3px] border-black bg-white relative">
      {/* Placeholder for future 3D background — Three.js / Spline goes here */}
      <div
        id="hero-3d-canvas"
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      />

      {/* Left column ─────────────────────────────────────────────────────── */}
      <div className="relative p-8 sm:p-12 lg:p-14 lg:border-r-[3px] lg:border-black">
        {/* Giant headline — staggered word-by-word reveal */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
          }}
          className="font-editorial text-black leading-[0.9] tracking-[2px] mb-8
                     text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem]"
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="block"
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-[420px] mb-8"
        >
          skillSYNC trains students and fresh grads on automation, AI, and
          full-stack development — with real projects, real mentorship, and a
          real path to a paid career in tech.
        </motion.p>

        {/* Two CTA buttons with no gap between them (shared black border) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="inline-flex"
        >
          <Link href="/join" className="btn-ed-primary">
            Join skillSYNC
          </Link>
          <Link
            href="/skillit"
            className="btn-ed-outline border-l-0"
          >
            Hire with skillIT
          </Link>
        </motion.div>
      </div>

      {/* Right column — red panel ────────────────────────────────────────── */}
      <div className="p-8 sm:p-10 lg:p-12 bg-red flex flex-col justify-between gap-8 border-t-[3px] border-black lg:border-t-0">
        <div>
          <div className="text-[0.68rem] uppercase tracking-[3px] text-white/60 mb-4">
            For companies
          </div>
          <div className="font-editorial text-white leading-[1] tracking-[2px] text-[2.2rem] sm:text-[2.8rem]">
            HIRE
            <br />
            AUTOMATION
            <br />
            ENGINEERS
          </div>
          <p className="text-[0.82rem] text-white/75 leading-[1.7] mt-4">
            Get vetted engineers who build n8n, Make.com, and AI workflow
            systems for your business — delivered and production-ready.
          </p>
          <Link href="/skillit" className="btn-ed-red mt-6 inline-flex">
            Explore skillIT →
          </Link>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="text-[0.68rem] uppercase tracking-[2px] text-white/50 mb-3">
            Recent Projects
          </div>
          <div className="text-[0.82rem] text-white leading-[2]">
            {RECENT.map((r) => (
              <div key={r}>{r}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
