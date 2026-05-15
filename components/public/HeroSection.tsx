'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useBrand } from '@/lib/context/BrandContext'
import Button from '@/components/ui/Button'

const MODES = {
  skillsync: {
    eyebrow: "Pakistan's Newest Tech Collective",
    tagline: 'Build. Learn. Earn.',
    description:
      'Training the next generation of tech talent through hands-on workshops, real-world projects, and a community that grows together.',
    cta1: { label: 'Explore Workshops', href: '/workshops' },
    cta2: { label: 'Join as Volunteer', href: '/join' },
    accent: '#E94560',
  },
  skillit: {
    eyebrow: 'Digital Agency · Pakistan',
    tagline: 'We Build. You Scale.',
    description:
      'We deliver high-quality digital products for ambitious clients — websites, apps, and brand experiences crafted by real-world talent.',
    cta1: { label: 'See Our Work', href: '/projects' },
    cta2: { label: 'Get in Touch', href: '/contact' },
    accent: '#0F6B7A',
  },
}

const PARTICLES = [
  { size: 280, top: '8%',  left: '4%',  opacity: 0.06, speed: 7 },
  { size: 180, top: '58%', left: '78%', opacity: 0.05, speed: 8 },
  { size: 110, top: '28%', left: '68%', opacity: 0.07, speed: 6 },
  { size: 85,  top: '72%', left: '18%', opacity: 0.06, speed: 9 },
  { size: 65,  top: '14%', left: '54%', opacity: 0.05, speed: 7.5 },
  { size: 140, top: '48%', left: '38%', opacity: 0.04, speed: 10 },
]

export default function HeroSection() {
  const { brand } = useBrand()
  const mode = MODES[brand]

  return (
    <>
      <style>{`
        @keyframes hero-gradient {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .hero-bg {
          background: linear-gradient(135deg, #1A1A2E 0%, #16213E 30%, #2C2C54 65%, #1A1A2E 100%);
          background-size: 400% 400%;
          animation: hero-gradient 14s ease infinite;
        }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
      `}</style>

      <section className="hero-bg relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              opacity: p.opacity,
              background: mode.accent,
              filter: 'blur(72px)',
              animation: `particle-float ${p.speed}s ease-in-out ${i * 0.6}s infinite`,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
            >
              <p className="text-brand-muted text-sm font-medium tracking-widest uppercase mb-5">
                {mode.eyebrow}
              </p>

              <h1 className="text-5xl md:text-7xl font-display font-black text-brand-light leading-[1.05] mb-6">
                {mode.tagline}
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                {mode.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={mode.cta1.href}>
                  <Button variant="primary" size="lg">{mode.cta1.label}</Button>
                </Link>
                <Link href={mode.cta2.href}>
                  <Button variant="secondary" size="lg">{mode.cta2.label}</Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-muted/60"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-brand-muted/40 to-transparent"
          />
        </motion.div>
      </section>
    </>
  )
}
