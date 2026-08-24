'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// Editorial-bold "who we are" section.
// - Section header row with 3px bottom border.
// - Two black/red side-by-side panels for the twin brands.
// - Timeline as a 4-cell bordered grid.

const PHASES = [
  { label: 'Phase 0',      name: 'Foundation',  desc: 'Community setup, tools chosen, first cohort recruited.' },
  { label: 'Phase 1',      name: 'Training',    desc: 'Fellows onboarded through structured workshops and tracks.' },
  { label: 'Phase 2',      name: 'Agency Work', desc: 'Real client projects delivered under the skillIT brand.' },
  { label: "What's Next",  name: 'Scale',       desc: 'Expanding to multiple cities, opening applications widely.' },
]

export default function AboutSection() {
  return (
    <section className="border-b-[3px] border-black bg-white">
      {/* Section header */}
      <div className="px-6 sm:px-10 py-10 border-b-[3px] border-black">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-3">
          Who We Are
        </p>
        <h2 className="font-editorial text-black text-[3rem] sm:text-[4rem] leading-[0.9] tracking-[2px]">
          TWO BRANDS. ONE MISSION.
        </h2>
        <p className="mt-4 text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-[560px]">
          Based in Pakistan — building globally-ready talent through training and real client work.
        </p>
      </div>

      {/* Twin brand panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b-[3px] border-black">
        {/* skillIT (black panel) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 bg-black text-white md:border-r-[3px] md:border-black border-b-[3px] md:border-b-0 border-black flex flex-col gap-4"
        >
          <p className="font-editorial text-white text-[2.5rem] leading-none tracking-[2px]">
            skillIT
          </p>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[2px] text-white/60">
            Creative Agency
          </p>
          <p className="text-[0.9rem] text-white/80 leading-[1.7] flex-1">
            Our agency arm — delivering digital solutions for ambitious clients while giving our fellows
            hands-on experience on live projects.
          </p>
          <Link href="/skillit" className="btn-ed-red mt-2 w-fit">
            See agency work →
          </Link>
        </motion.div>

        {/* skillSYNC (red panel) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8 sm:p-10 bg-red text-white flex flex-col gap-4"
        >
          <p className="font-editorial text-white text-[2.5rem] leading-none tracking-[2px]">
            skillSYNC
          </p>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[2px] text-white/70">
            Training Platform
          </p>
          <p className="text-[0.9rem] text-white/90 leading-[1.7] flex-1">
            Our training arm — a structured fellowship programme that takes motivated young Pakistanis
            through real tech skills: automation, LLMs, dev, and more.
          </p>
          <Link
            href="/skillsync"
            className="btn-ed-red mt-2 w-fit"
            style={{ background: '#080808', color: '#fff' }}
          >
            Explore training →
          </Link>
        </motion.div>
      </div>

      {/* Journey timeline */}
      <div>
        <div className="px-6 sm:px-10 py-6 border-b-[3px] border-black">
          <h3 className="font-editorial text-black text-[2rem] leading-none tracking-[2px]">
            OUR JOURNEY
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4">
          {PHASES.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={[
                'p-6 sm:p-8 border-b-[3px] md:border-b-0 border-black',
                i < PHASES.length - 1 ? 'md:border-r-[3px] md:border-black' : '',
              ].join(' ')}
            >
              <div className="font-editorial text-red text-[3rem] leading-none">0{i + 1}</div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[2px] text-[color:var(--color-gray-mid)] mt-2">
                {p.label}
              </p>
              <p className="text-[0.95rem] font-semibold uppercase tracking-[1px] text-black mt-1">
                {p.name}
              </p>
              <p className="text-[0.78rem] text-[color:var(--color-gray-mid)] leading-[1.6] mt-2">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
