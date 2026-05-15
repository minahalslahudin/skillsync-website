import type { TeamMemberWithUser } from '@/lib/supabase/queries/users'
import Badge from '@/components/ui/Badge'
import { Td, Tr } from '@/components/ui/Table'

export default function TeamMemberRow({ member }: { member: TeamMemberWithUser }) {
  const { users: u, custom_title } = member
  const initials = u.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Tr>
      <Td>
        <div className="flex items-center gap-3">
          {u.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={u.avatar_url}
              alt={u.full_name}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand-accent">{initials}</span>
            </div>
          )}
          <span className="font-medium text-brand-light">{u.full_name}</span>
        </div>
      </Td>
      <Td><span className="text-brand-muted">{custom_title ?? u.role}</span></Td>
      <Td>
        {u.department && <Badge variant="neutral">{u.department}</Badge>}
      </Td>
      <Td>
        <div className="flex items-center gap-3 text-xs">
          {u.linkedin && (
            <a href={u.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-brand-muted hover:text-brand-accent transition-colors">LinkedIn</a>
          )}
          {u.github && (
            <a href={u.github} target="_blank" rel="noopener noreferrer"
              className="text-brand-muted hover:text-brand-light transition-colors">GitHub</a>
          )}
        </div>
      </Td>
    </Tr>
  )
}
