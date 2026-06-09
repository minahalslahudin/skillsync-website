'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { TeamMemberWithUser } from '@/lib/supabase/queries/users'

interface TeamSectionProps {
  members: TeamMemberWithUser[]
}

function MemberCard({ member, index }: { member: TeamMemberWithUser; index: number }) {
  const { users: u, custom_title } = member
  const displayRole = custom_title ?? u.role
  const initials = u.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3), ease: 'easeOut' }}
      className="group flex flex-col items-center text-center rounded-2xl border border-white/[0.06] bg-[#111827] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-[0_8px_40px_rgba(233,69,96,0.12)]"
    >
      {/* Photo */}
      <div className="relative mb-5 h-24 w-24 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white/10 transition-all duration-300 group-hover:ring-brand-accent/40">
        {u.avatar_url ? (
          <Image
            src={u.avatar_url}
            alt={u.full_name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-accent/15">
            <span className="text-xl font-bold text-brand-accent">{initials}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-base font-bold leading-snug text-white">{u.full_name}</h3>

      {/* Role */}
      <p className="mt-1 text-sm font-medium text-brand-accent">{displayRole}</p>

      {/* Department */}
      {u.department && (
        <p className="mt-0.5 text-xs text-gray-500">{u.department}</p>
      )}

      {/* Bio */}
      {u.bio && (
        <p className="mt-4 text-xs leading-relaxed text-gray-400 line-clamp-3">{u.bio}</p>
      )}
    </motion.div>
  )
}

export default function TeamSection({ members }: TeamSectionProps) {
  if (members.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">Team profiles coming soon.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member, index) => (
        <MemberCard key={member.id} member={member} index={index} />
      ))}
    </div>
  )
}
