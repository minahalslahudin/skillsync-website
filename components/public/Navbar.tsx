'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import BrandToggle from './BrandToggle'

const NAV_LINKS = [
  { href: '/about',     label: 'About' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/projects',  label: 'Projects' },
  { href: '/events',    label: 'Events' },
  { href: '/team',      label: 'Team' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const pathname                = usePathname() ?? ''

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b-[3px] border-black">
        <nav className="flex items-center justify-between px-6 sm:px-10 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-editorial text-2xl tracking-[3px] text-black"
          >
            skill<span className="text-red">SYNC</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-[0.8rem] uppercase tracking-[0.5px] text-[color:var(--color-gray-mid)]">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    active
                      ? 'text-black font-medium transition-colors'
                      : 'hover:text-black transition-colors'
                  }
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <BrandToggle />
            <Link href="/login" className="btn-ed-outline btn-ed-sm">
              Login
            </Link>
            <Link href="/join" className="btn-ed-primary btn-ed-sm">
              Join Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 text-black"
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
              className="fixed inset-0 z-50 bg-black/60 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r-[3px] border-black flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b-[3px] border-black flex-shrink-0">
                <span className="font-editorial text-2xl tracking-[3px] text-black">
                  skill<span className="text-red">SYNC</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-black"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col flex-1 overflow-y-auto">
                {NAV_LINKS.map(({ href, label }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={[
                        'px-6 py-4 text-sm uppercase tracking-wider border-b border-black/10 transition-colors',
                        active
                          ? 'bg-red text-white'
                          : 'text-black hover:bg-[color:var(--color-off-white)]',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  )
                })}
              </nav>

              <div className="px-6 py-6 border-t-[3px] border-black flex flex-col gap-3 flex-shrink-0">
                <BrandToggle />
                <Link href="/login" className="btn-ed-outline btn-ed-sm w-full">
                  Login
                </Link>
                <Link href="/join" className="btn-ed-primary btn-ed-sm w-full">
                  Join Us
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
