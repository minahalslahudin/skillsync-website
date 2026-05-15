'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const PHASES = [
  {
    label: 'Phase 0',
    name: 'Foundation',
    desc: 'Community setup, tools chosen, and the first cohort recruited.',
  },
  {
    label: 'Phase 1',
    name: 'Training',
    desc: 'Fellows onboarded through structured workshops and skill tracks.',
  },
  {
    label: 'Phase 2',
    name: 'Agency Work',
    desc: 'Real client projects delivered under the skillIT brand.',
  },
  {
    label: "What's Next",
    name: 'Scale',
    desc: 'Expanding to multiple cities and opening fellowship applications widely.',
  },
]

export default function AboutSection() {
  return (
    <section className="py-24 bg-brand-dark px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">

        {/* Heading */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Who We Are
          </motion.p>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-display font-bold text-brand-light mb-4"
          >
            Two brands,{' '}
            <span className="text-brand-accent">one mission</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Based in South Africa — building globally-ready talent through training and real client work.
          </motion.p>
        </motion.div>

        {/* Brand cards — two columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* skillIT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-2xl border-2 border-[#0F6B7A]/50 bg-brand-mid p-8 flex flex-col gap-4 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0F6B7A]/10 rounded-full blur-3xl pointer-events-none" />
            <p className="text-2xl font-display font-black text-[#7dd3da]">skillIT</p>
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Creative Agency
            </p>
            <p className="text-base text-gray-300 leading-relaxed flex-1">
              Our agency arm — delivering digital solutions for ambitious clients while giving our
              fellows hands-on experience on live projects.
            </p>
            <Link
              href="/skillit"
              className="self-start text-sm font-semibold text-[#7dd3da] hover:underline"
            >
              See agency work →
            </Link>
          </motion.div>

          {/* skillSYNC */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="relative rounded-2xl border-2 border-brand-accent/50 bg-brand-mid p-8 flex flex-col gap-4 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
            <p className="text-2xl font-display font-black text-brand-accent">skillSYNC</p>
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Training Platform
            </p>
            <p className="text-base text-gray-300 leading-relaxed flex-1">
              Our training arm — a structured fellowship programme that takes motivated young South
              Africans through real tech skills: design, development, data, and more.
            </p>
            <Link
              href="/skillsync"
              className="self-start text-sm font-semibold text-brand-accent hover:underline"
            >
              Explore training →
            </Link>
          </motion.div>
        </div>

        {/* Phase timeline — horizontal */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center text-lg font-display font-bold text-brand-light mb-12"
          >
            Our Journey
          </motion.h3>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-brand-muted/20" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {PHASES.map((phase, i) => (
                <motion.div
                  key={phase.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="relative z-10 h-10 w-10 rounded-full bg-brand-darker border-2 border-brand-accent/60 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-brand-accent">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-widest">
                      {phase.label}
                    </p>
                    <p className="text-sm font-semibold text-brand-light mt-0.5">{phase.name}</p>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{phase.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link href="/about">
            <Button variant="secondary" size="md">Learn More About Us</Button>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
