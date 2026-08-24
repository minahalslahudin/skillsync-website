'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { TeamMemberWithUser } from '@/lib/supabase/queries/users'

// Editorial-bold team grid.
// Each card = square photo on top, name in Bebas Neue below, red role,
// grey Inter bio. 3px black border, no rounded corners.

interface TeamSectionProps {
  members: TeamMemberWithUser[]
}

function MemberCard({ member, index }: { member: TeamMemberWithUser; index: number }) {
  const { users: u, custom_title } = member
  const displayRole = custom_title ?? u.role
  const initials = u.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3), ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group flex flex-col border-[3px] border-black bg-white transition-colors duration-200 hover:bg-[color:var(--color-off-white)]"
    >
      {/* Square photo */}
      <div className="relative aspect-square w-full overflow-hidden bg-black border-b-[3px] border-black">
        {u.avatar_url ? (
          <Image
            src={u.avatar_url}
            alt={u.full_name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black">
            <span className="font-editorial text-white text-6xl">{initials}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-1">
        <h3 className="font-editorial text-black text-[1.6rem] leading-none tracking-[1px]">
          {u.full_name}
        </h3>
        <p className="text-[0.75rem] font-semibold uppercase tracking-[2px] text-red">
          {displayRole}
        </p>
        {u.department && (
          <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)]">
            {u.department}
          </p>
        )}
        {u.bio && (
          <p className="mt-3 text-[0.78rem] leading-[1.6] text-[color:var(--color-gray-dark)] line-clamp-3">
            {u.bio}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function TeamSection({ members }: TeamSectionProps) {
  // TEMP (Aug 2026): public team display trimmed to the founder only while the
  // rest of the team is being re-photographed and re-written. Also clears her
  // avatar so the initials placeholder renders — real photo comes next.
  // Undo by removing this block once real profiles are ready.
  const displayMembers = members
    .filter((m) => m.users.full_name.toLowerCase().includes('minahal'))
    .map((m) => ({ ...m, users: { ...m.users, avatar_url: null } }))

  if (displayMembers.length === 0) {
    return (
      <p className="py-12 text-center text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
        Team profiles coming soon.
      </p>
    )
  }

  // Founder shown solo in a centered single-card layout instead of a full grid.
  if (displayMembers.length === 1) {
    return (
      <div className="max-w-sm mx-auto">
        <MemberCard member={displayMembers[0]} index={0} />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayMembers.map((member, index) => (
        <MemberCard key={member.id} member={member} index={index} />
      ))}
    </div>
  )
}
