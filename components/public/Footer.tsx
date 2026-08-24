'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { FaLinkedin, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'

// Editorial-bold footer.
// Black bar top-line (matches inspiration's black footer), then a 3-col
// grid with brand, links, newsletter. Newsletter form kept fully functional
// against the existing /api/newsletter endpoint.

const schema = z.object({ email: z.string().email('Enter a valid email') })
type FormValues = z.infer<typeof schema>

const QUICK_LINKS = [
  { href: '/about',     label: 'About' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/projects',  label: 'Projects' },
  { href: '/events',    label: 'Events' },
  { href: '/team',      label: 'Team' },
  { href: '/reviews',   label: 'Reviews' },
  { href: '/join',      label: 'Join Us' },
  { href: '/contact',   label: 'Contact' },
]

const SOCIALS = [
  { href: 'https://linkedin.com/company/skill-synchronized', icon: FaLinkedin,  label: 'LinkedIn' },
  { href: 'https://instagram.com/nexique_',                  icon: FaInstagram, label: 'Instagram' },
  { href: 'https://youtube.com/',                            icon: FaYoutube,   label: 'YouTube' },
  { href: 'https://github.com/skillitco',                    icon: FaGithub,    label: 'GitHub' },
]

export default function Footer() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok)                  { toast.success("You're subscribed!"); reset() }
    else if (res.status === 409) { toast("You're already on the list.", { icon: 'ℹ️' }) }
    else                         { toast.error('Something went wrong. Please try again.') }
  }

  return (
    <footer className="border-t-[3px] border-black bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Column 1: Brand + socials */}
        <div className="p-8 sm:p-10 md:border-r-[3px] md:border-black flex flex-col gap-5 border-b-[3px] md:border-b-0 border-black">
          <Link href="/" className="font-editorial text-3xl tracking-[3px] text-black w-fit">
            skill<span className="text-red">SYNC</span>
          </Link>
          <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7] max-w-xs">
            Empowering students with real-world tech skills through workshops,
            live projects, and a thriving community.
          </p>
          <div className="flex items-center gap-4 mt-2">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-black hover:text-red transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick links */}
        <div className="p-8 sm:p-10 md:border-r-[3px] md:border-black border-b-[3px] md:border-b-0 border-black">
          <h3 className="text-[0.72rem] font-semibold text-black uppercase tracking-[2px] mb-5">
            Quick Links
          </h3>
          <ul className="grid grid-cols-2 gap-y-2 gap-x-6">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[0.85rem] text-[color:var(--color-gray-dark)] hover:text-red transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="p-8 sm:p-10 bg-red text-white">
          <h3 className="font-editorial text-white text-2xl tracking-[2px] mb-3">
            STAY UPDATED
          </h3>
          <p className="text-[0.82rem] text-white/80 leading-[1.7] mb-5">
            Get notified about new workshops, events, and volunteer opportunities.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full bg-white text-black placeholder:text-black/40 border-[3px] border-black px-3 py-2 text-sm focus:outline-none focus:bg-[color:var(--color-off-white)]"
            />
            {errors.email && (
              <p className="text-xs text-white/90">{errors.email.message}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-ed-red btn-ed-sm disabled:opacity-60"
            >
              {isSubmitting ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-[3px] border-black bg-black flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-10 py-4">
        <p className="text-[0.72rem] uppercase tracking-[1px] text-white/50">
          © {new Date().getFullYear()} skillSYNC × skillIT. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="text-[0.72rem] uppercase tracking-[1px] text-white/50 hover:text-red transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-[0.72rem] uppercase tracking-[1px] text-white/50 hover:text-red transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
