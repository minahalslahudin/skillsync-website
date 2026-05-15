'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaWhatsapp } from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface SocialCard {
  label: string
  handle: string
  desc: string
  href: string
  Icon: IconType
  iconColor: string
  borderColor: string
  buttonClass: string
  buttonLabel: string
  highlight: boolean
}

const SOCIALS: SocialCard[] = [
  {
    label: 'WhatsApp',
    handle: 'Community Channel',
    desc: 'Join our active WhatsApp community for real-time updates, discussions, and announcements.',
    href: 'https://whatsapp.com/channel/0029VbCcBcZEquiHv1l8aa3b',
    Icon: FaWhatsapp,
    iconColor: 'text-[#25D366]',
    borderColor: 'border-[#25D366]/40 bg-[#25D366]/5',
    buttonClass: 'border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10',
    buttonLabel: 'Join Group',
    highlight: true,
  },
  {
    label: 'LinkedIn',
    handle: '@skillSYNC',
    desc: 'Follow us for career opportunities, thought leadership articles, and milestones.',
    href: 'https://www.linkedin.com/company/skill-synchronized',
    Icon: FaLinkedin,
    iconColor: 'text-brand-muted hover:text-[#0A66C2]',
    borderColor: 'border-brand-muted/20 hover:border-brand-accent/40',
    buttonClass: 'border-brand-muted/30 text-brand-muted hover:border-brand-accent/50 hover:text-brand-accent',
    buttonLabel: 'Follow Us',
    highlight: false,
  },
  {
    label: 'Instagram',
    handle: '@nexique_',
    desc: 'Behind-the-scenes content, workshop highlights, and community moments.',
    href: 'https://instagram.com/nexique_?igsh=MWMzY3ZqMDhjODRzOQ==',
    Icon: FaInstagram,
    iconColor: 'text-brand-muted hover:text-[#E1306C]',
    borderColor: 'border-brand-muted/20 hover:border-brand-accent/40',
    buttonClass: 'border-brand-muted/30 text-brand-muted hover:border-brand-accent/50 hover:text-brand-accent',
    buttonLabel: 'Follow Us',
    highlight: false,
  },
  {
    label: 'YouTube',
    handle: ' ',
    desc: 'Workshop recordings, tutorials, project showcases, and event recaps.',
    href: 'https://youtube.com/',
    Icon: FaYoutube,
    iconColor: 'text-brand-muted hover:text-[#FF0000]',
    borderColor: 'border-brand-muted/20 hover:border-brand-accent/40',
    buttonClass: 'border-brand-muted/30 text-brand-muted hover:border-brand-accent/50 hover:text-brand-accent',
    buttonLabel: 'Subscribe',
    highlight: false,
  },
  {
    label: 'GitHub',
    handle: 'skillitco',
    desc: 'Explore our open-source projects, tools, and fellowship contributions.',
    href: 'https://github.com/skillitco',
    Icon: FaGithub,
    iconColor: 'text-brand-muted hover:text-brand-light',
    borderColor: 'border-brand-muted/20 hover:border-brand-accent/40',
    buttonClass: 'border-brand-muted/30 text-brand-muted hover:border-brand-accent/50 hover:text-brand-accent',
    buttonLabel: 'Star Us',
    highlight: false,
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function SocialsSection() {
  return (
    <section className="py-20 bg-brand-darker px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-3"
          >
            Community
          </motion.p>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-display font-bold text-brand-light mb-12"
          >
            Join Our Community
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOCIALS.map(({ label, handle, desc, href, Icon, iconColor, borderColor, buttonClass, buttonLabel }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`flex flex-col items-center gap-3 rounded-xl border bg-brand-mid p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${borderColor}`}
              >
                <Icon className={`h-8 w-8 transition-colors duration-200 ${iconColor}`} />

                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-brand-light">{label}</p>
                  <p className="text-xs text-brand-muted">{handle}</p>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-auto text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors duration-200 ${buttonClass}`}
                >
                  {buttonLabel}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
