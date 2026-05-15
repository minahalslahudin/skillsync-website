'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { FaLinkedin, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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
  { href: 'https://linkedin.com/company/skillsync-za',  icon: FaLinkedin,  label: 'LinkedIn' },
  { href: 'https://instagram.com/skillsync.za',         icon: FaInstagram, label: 'Instagram' },
  { href: 'https://youtube.com/@skillsyncza',           icon: FaYoutube,   label: 'YouTube' },
  { href: 'https://github.com/skillsync-za',            icon: FaGithub,    label: 'GitHub' },
]

export default function Footer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      toast.success("You're subscribed!")
      reset()
    } else if (res.status === 409) {
      toast("You're already on the list.", { icon: 'ℹ️' })
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <footer className="bg-brand-darker border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Brand + socials */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-display font-black text-2xl text-brand-light hover:text-brand-accent transition-colors w-fit"
            >
              skill<span className="text-brand-accent">SYNC</span>
            </Link>
            <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
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
                  className="text-brand-muted hover:text-brand-accent transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-brand-muted hover:text-brand-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-5">
              Stay Updated
            </h3>
            <p className="text-sm text-brand-muted mb-5 leading-relaxed">
              Get notified about new workshops, events, and volunteer opportunities.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <Input
                {...register('email')}
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                aria-label="Email address"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={isSubmitting}
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} skillSYNC × skillIT. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-brand-muted hover:text-brand-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-brand-muted hover:text-brand-light transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
