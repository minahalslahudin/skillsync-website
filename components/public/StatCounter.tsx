'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface StatConfig {
  key: string
  suffix: string
  label: string
}

const STAT_CONFIG: StatConfig[] = [
  { key: 'workshops',  suffix: '+', label: 'Workshops Delivered' },
  { key: 'projects',   suffix: '+', label: 'Projects Completed' },
  { key: 'reviews',    suffix: '+', label: 'Community Reviews' },
  { key: 'volunteers', suffix: '+', label: 'Volunteers' },
]

function AnimatedNumber({
  value,
  suffix,
  loading,
}: {
  value: number
  suffix: string
  loading: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || loading || value === 0) return
    let current = 0
    const duration = 1600
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      current = Math.min(current + increment, value)
      setCount(Math.floor(current))
      if (current >= value) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value, loading])

  if (loading) {
    return (
      <span
        ref={ref}
        className="inline-block w-16 h-10 rounded-lg bg-brand-muted/20 animate-pulse align-middle"
      />
    )
  }

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function StatCounter() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      const [workshops, projects, reviews, users] = await Promise.all([
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('type', 'workshop')
          .eq('is_published', true),
        supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true),
        supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', true),
        supabase.from('users').select('*', { count: 'exact', head: true }),
      ])
      setStats({
        workshops:  workshops.count  ?? 0,
        projects:   projects.count   ?? 0,
        reviews:    reviews.count    ?? 0,
        volunteers: users.count      ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <section className="py-16 bg-brand-darker border-y border-brand-muted/10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STAT_CONFIG.map((stat) => (
            <motion.div
              key={stat.key}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-display font-black text-brand-accent mb-1">
                <AnimatedNumber
                  value={stats[stat.key] ?? 0}
                  suffix={stat.suffix}
                  loading={loading}
                />
              </p>
              <p className="text-sm text-brand-muted font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
