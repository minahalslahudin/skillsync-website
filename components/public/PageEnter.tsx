'use client'

// Wrap every public page's client body in this for a subtle enter animation.
// Server-rendered pages should wrap only the interactive/hero region — the
// rest of the page can render statically for SEO.

import { motion } from 'framer-motion'

export default function PageEnter({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
