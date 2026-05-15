'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { FaLinkedin, FaGithub } from 'react-icons/fa'
import type { TeamMemberWithUser } from '@/lib/supabase/queries/users'

interface TeamSectionProps {
  members: TeamMemberWithUser[]
  volunteerCount?: number
}

function isFounder(m: TeamMemberWithUser) {
  return m.custom_title?.toLowerCase().includes('founder') ?? false
}
function isCSuite(m: TeamMemberWithUser) {
  return !isFounder(m) && m.users.role === 'C-Suite'
}
function isLead(m: TeamMemberWithUser) {
  return !isFounder(m) && m.users.role === 'Lead'
}

type CardSize = 'large' | 'medium' | 'small'

function TeamCard({ member, size }: { member: TeamMemberWithUser; size: CardSize }) {
  const { users: u, custom_title } = member

  const initials = u.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const avatarSize =
    size === 'large' ? 'h-28 w-28' : size === 'medium' ? 'h-20 w-20' : 'h-14 w-14'
  const initialsText =
    size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-base'
  const nameText =
    size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm'
  const padding = size === 'large' ? 'p-7' : size === 'medium' ? 'p-6' : 'p-5'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`flex flex-col items-center text-center rounded-xl border border-brand-muted/20 bg-brand-mid ${padding} transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-brand-accent/40`}
    >
      {/* Avatar */}
      {u.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={u.avatar_url}
          alt={u.full_name}
          className={`${avatarSize} rounded-full object-cover ring-2 ring-brand-accent/30 mb-4`}
        />
      ) : (
        <div
          className={`${avatarSize} rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center mb-4`}
        >
          <span className={`${initialsText} font-display font-bold text-brand-accent`}>
            {initials}
          </span>
        </div>
      )}

      <h3 className={`${nameText} font-display font-semibold text-brand-light`}>
        {u.full_name}
      </h3>
      <p className="text-sm text-brand-accent mt-0.5">{custom_title ?? u.role}</p>
      {u.department && (
        <p className="text-xs text-brand-muted mt-0.5">{u.department}</p>
      )}

      {size !== 'small' && u.bio && (
        <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-3">{u.bio}</p>
      )}

      {/* Social links */}
      {(u.linkedin || u.github || u.portfolio) && (
        <div className="flex items-center gap-3 mt-4">
          {u.linkedin && (
            <a
              href={u.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted hover:text-[#0A66C2] transition-colors"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
          )}
          {u.github && (
            <a
              href={u.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted hover:text-brand-light transition-colors"
            >
              <FaGithub className="h-4 w-4" />
            </a>
          )}
          {u.portfolio && (
            <a
              href={u.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted hover:text-brand-accent transition-colors"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  )
}

function TierHeading({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold text-brand-muted uppercase tracking-widest mb-6 text-center">
      {label}
    </p>
  )
}

export default function TeamSection({ members, volunteerCount }: TeamSectionProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-brand-muted">
        Team profiles coming soon.
      </div>
    )
  }

  const founders = members.filter(isFounder)
  const cSuite   = members.filter(isCSuite)
  const leads    = members.filter(isLead)
  const others   = members.filter((m) => !isFounder(m) && !isCSuite(m) && !isLead(m))

  return (
    <div className="flex flex-col gap-14">
      {/* Founders — large cards, centred */}
      {founders.length > 0 && (
        <div>
          <TierHeading label="Founders" />
          <div
            className={`grid gap-6 ${
              founders.length === 1
                ? 'grid-cols-1 max-w-xs mx-auto'
                : founders.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {founders.map((m) => (
              <TeamCard key={m.id} member={m} size="large" />
            ))}
          </div>
        </div>
      )}

      {/* C-Suite — medium cards */}
      {cSuite.length > 0 && (
        <div>
          <TierHeading label="Leadership" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cSuite.map((m) => (
              <TeamCard key={m.id} member={m} size="medium" />
            ))}
          </div>
        </div>
      )}

      {/* Leads — smaller cards */}
      {leads.length > 0 && (
        <div>
          <TierHeading label="Department Leads" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {leads.map((m) => (
              <TeamCard key={m.id} member={m} size="small" />
            ))}
          </div>
        </div>
      )}

      {/* Other volunteers */}
      {others.length > 0 && (
        <div>
          <TierHeading label="Team" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {others.map((m) => (
              <TeamCard key={m.id} member={m} size="small" />
            ))}
          </div>
        </div>
      )}

      {/* Volunteer count pill */}
      {volunteerCount != null && volunteerCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center py-8 rounded-xl border border-brand-muted/20 bg-brand-mid"
        >
          <p className="text-4xl font-display font-black text-brand-accent">
            {volunteerCount}+
          </p>
          <p className="text-sm text-brand-muted mt-1">
            Active volunteers powering the mission
          </p>
        </motion.div>
      )}
    </div>
  )
}
