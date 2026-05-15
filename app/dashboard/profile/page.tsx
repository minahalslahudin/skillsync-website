import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/forms/ProfileForm'
import { formatDate } from '@/lib/utils/formatDate'

function monthsSince(date: string): number {
  const joined = new Date(date)
  const now = new Date()
  return (now.getFullYear() - joined.getFullYear()) * 12 + (now.getMonth() - joined.getMonth())
}

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, bio, linkedin, github, portfolio, department, role, avatar_url, joined_at, email, skills, warning_count')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const months   = monthsSince(profile.joined_at as string)
  const initials = (profile.full_name as string)
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">My Profile</h2>
        <p className="text-gray-400 mt-1">Update your public information and social links.</p>
      </div>

      {/* Identity card */}
      <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-5">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url as string}
              alt={profile.full_name as string}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-accent/30 flex-shrink-0"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-display font-bold text-brand-accent">{initials}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-display font-semibold text-brand-light">{profile.full_name as string}</p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent font-medium">
                {profile.role as string}
              </span>
              {profile.department && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-muted/10 border border-brand-muted/20 text-brand-muted">
                  {profile.department as string}
                </span>
              )}
              {(profile.warning_count as number) > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                  ⚠️ {profile.warning_count} warning{(profile.warning_count as number) !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Joined {formatDate(profile.joined_at as string)}
              {' · '}
              {months <= 0 ? 'This month' : `${months} month${months !== 1 ? 's' : ''} in the org`}
            </p>
          </div>
        </div>
      </div>

      <ProfileForm
        userId={user.id}
        initial={{
          full_name:  profile.full_name  as string,
          bio:        profile.bio        as string | null,
          linkedin:   profile.linkedin   as string | null,
          github:     profile.github     as string | null,
          portfolio:  profile.portfolio  as string | null,
          department: profile.department as string | null,
          skills:     (profile.skills    as string[]) ?? [],
          avatar_url: profile.avatar_url as string | null,
        }}
      />
    </div>
  )
}
