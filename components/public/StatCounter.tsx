'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

// Editorial-bold stats: 4 columns separated by 3px black borders.
// Big red Bebas Neue numbers, tiny uppercase Inter labels.

interface StatConfig {
  key: string
  suffix: string
  label: string
  desc: string
}

const STAT_CONFIG: StatConfig[] = [
  { key: 'volunteers', suffix: '+', label: 'Members',       desc: 'Students and grads actively building in the community' },
  { key: 'workshops',  suffix: '',  label: 'Workshops',     desc: 'Paid, intensive, hands-on sessions run so far' },
  { key: 'projects',   suffix: '',  label: 'Projects',      desc: 'Real automation systems delivered to clients' },
  { key: 'reviews',    suffix: '+', label: 'Reviews',       desc: 'Verified feedback from our community' },
]

function AnimatedNumber({ value, suffix, loading }: {
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
    return <span ref={ref} className="inline-block w-16 h-10 bg-black/10 animate-pulse align-middle" />
  }
  return <span ref={ref}>{count}{suffix}</span>
}

export default function StatCounter() {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient()
      const [workshops, projects, reviews, users] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('type', 'workshop').eq('is_published', true),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', true),
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
    <section className="grid grid-cols-2 lg:grid-cols-4 border-b-[3px] border-black bg-white">
      {STAT_CONFIG.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className={[
            'p-6 sm:p-8 relative',
            i < STAT_CONFIG.length - 1 ? 'lg:border-r-[3px] lg:border-black' : '',
            i % 2 === 0 ? 'border-r-[3px] border-black lg:border-r-[3px]' : '',
            i < 2 ? 'border-b-[3px] border-black lg:border-b-0' : '',
          ].join(' ')}
        >
          <div className="font-editorial text-red text-[3rem] leading-none">
            <AnimatedNumber value={stats[stat.key] ?? 0} suffix={stat.suffix} loading={loading} />
          </div>
          <div className="text-[0.78rem] font-semibold uppercase tracking-[1px] text-black mt-1">
            {stat.label}
          </div>
          <p className="text-[0.78rem] text-[color:var(--color-gray-mid)] leading-[1.6] mt-2">
            {stat.desc}
          </p>
        </motion.div>
      ))}
    </section>
  )
}
