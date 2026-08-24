'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaWhatsapp } from 'react-icons/fa'
import type { IconType } from 'react-icons'

// Editorial-bold socials section — grid of bordered cards, no gaps.

interface SocialCard {
  label: string
  handle: string
  desc: string
  href: string
  Icon: IconType
  buttonLabel: string
  featured?: boolean
}

const SOCIALS: SocialCard[] = [
  {
    label: 'WhatsApp',
    handle: 'Community Channel',
    desc: 'Real-time updates, discussions, and announcements from the community.',
    href: 'https://whatsapp.com/channel/0029VbCcBcZEquiHv1l8aa3b',
    Icon: FaWhatsapp,
    buttonLabel: 'Join Group',
    featured: true,
  },
  { label: 'LinkedIn',  handle: '@skillSYNC', desc: 'Career opportunities, articles, milestones.',                href: 'https://www.linkedin.com/company/skill-synchronized', Icon: FaLinkedin,  buttonLabel: 'Follow Us' },
  { label: 'Instagram', handle: '@nexique_',  desc: 'Behind-the-scenes, workshop highlights, community moments.', href: 'https://instagram.com/nexique_?igsh=MWMzY3ZqMDhjODRzOQ==', Icon: FaInstagram, buttonLabel: 'Follow Us' },
  { label: 'YouTube',   handle: '',           desc: 'Workshop recordings, tutorials, project showcases.',         href: 'https://youtube.com/',                              Icon: FaYoutube,   buttonLabel: 'Subscribe' },
  { label: 'GitHub',    handle: 'skillitco',  desc: 'Open-source projects, tools, fellowship contributions.',    href: 'https://github.com/skillitco',                      Icon: FaGithub,    buttonLabel: 'Star Us' },
]

export default function SocialsSection() {
  return (
    <section className="border-b-[3px] border-black bg-white">
      <div className="px-6 sm:px-10 py-10 border-b-[3px] border-black">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-3">Community</p>
        <h2 className="font-editorial text-black text-[3rem] sm:text-[4rem] leading-[0.9] tracking-[2px]">
          STAY CONNECTED
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {SOCIALS.map(({ label, handle, desc, href, Icon, buttonLabel, featured }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={[
              'flex flex-col p-6 sm:p-8 relative',
              'border-b-[3px] border-black',
              'sm:[&:nth-child(odd)]:border-r-[3px] sm:[&:nth-child(odd)]:border-black',
              'lg:!border-r-[3px] lg:border-black lg:[&:nth-child(3n)]:!border-r-0',
              featured ? 'bg-red text-white' : 'bg-white',
            ].join(' ')}
          >
            <Icon className={`h-10 w-10 ${featured ? 'text-white' : 'text-black'}`} />
            <p className={`font-editorial text-[2rem] tracking-[2px] leading-none mt-4 ${featured ? 'text-white' : 'text-black'}`}>
              {label.toUpperCase()}
            </p>
            {handle && (
              <p className={`text-[0.72rem] uppercase tracking-[2px] mt-1 ${featured ? 'text-white/70' : 'text-[color:var(--color-gray-mid)]'}`}>
                {handle}
              </p>
            )}
            <p className={`text-[0.82rem] leading-[1.7] mt-4 flex-1 ${featured ? 'text-white/85' : 'text-[color:var(--color-gray-dark)]'}`}>
              {desc}
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 self-start text-[0.78rem] font-semibold uppercase tracking-[1px] px-4 py-2 border-[3px] transition-colors ${
                featured
                  ? 'border-white text-white hover:bg-white hover:text-red'
                  : 'border-black text-black hover:bg-black hover:text-white'
              }`}
            >
              {buttonLabel} →
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
