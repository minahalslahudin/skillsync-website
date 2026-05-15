'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import BrandToggle from './BrandToggle'
import Button from '@/components/ui/Button'

const NAV_LINKS = [
  { href: '/about',     label: 'About' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/projects',  label: 'Projects' },
  { href: '/events',    label: 'Events' },
  { href: '/team',      label: 'Team' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const pathname                = usePathname() ?? ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-brand-dark/90 backdrop-blur-md shadow-lg border-b border-brand-muted/20'
            : 'bg-transparent',
        ].join(' ')}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-black text-xl text-brand-light hover:text-brand-accent transition-colors"
          >
            skill<span className="text-brand-accent">SYNC</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={[
                  'text-sm font-medium transition-colors',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'text-brand-accent'
                    : 'text-brand-muted hover:text-brand-light',
                ].join(' ')}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <BrandToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/join">
              <Button variant="primary" size="sm">Join Us</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 text-brand-muted hover:text-brand-light transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-brand-darker border-r border-brand-muted/20 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-brand-muted/15 flex-shrink-0">
                <span className="font-display font-black text-xl text-brand-light">
                  skill<span className="text-brand-accent">SYNC</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-brand-muted hover:text-brand-light transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-3 pt-4 flex-1 overflow-y-auto">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      pathname === href
                        ? 'bg-brand-accent/10 text-brand-accent'
                        : 'text-brand-muted hover:text-brand-light hover:bg-brand-mid/50',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="px-6 py-6 border-t border-brand-muted/15 flex flex-col gap-3 flex-shrink-0">
                <BrandToggle />
                <Link href="/login" className="block">
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/join" className="block">
                  <Button variant="primary" size="sm" className="w-full">Join Us</Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
