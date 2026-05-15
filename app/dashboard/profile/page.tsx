import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/forms/ProfileForm'

export default async function ProfilePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, bio, linkedin, github, portfolio, department, role, avatar_url, joined_at, email')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const initials = (profile.full_name as string)
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">My Profile</h2>
        <p className="text-gray-400 mt-1">Update your public information and social links.</p>
      </div>

      {/* Avatar + identity */}
      <div className="flex items-center gap-5 p-5 rounded-xl border border-brand-muted/20 bg-brand-mid">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url as string}
            alt={profile.full_name as string}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-accent/30"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center">
            <span className="text-xl font-display font-bold text-brand-accent">{initials}</span>
          </div>
        )}
        <div>
          <p className="font-display font-semibold text-brand-light">{profile.full_name as string}</p>
          <p className="text-sm text-brand-accent">{profile.role as string}</p>
          <p className="text-xs text-brand-muted">{profile.email as string}</p>
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
        }}
      />
    </div>
  )
}
