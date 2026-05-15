import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getMyAchievements } from '@/lib/supabase/queries/achievements'
import AchievementCard from '@/components/dashboard/AchievementCard'
import { formatDate } from '@/lib/utils/formatDate'

const TYPE_ICON: Record<string, string> = {
  certificate: '📜',
  milestone:   '🎯',
  award:       '🏆',
}

export default async function AchievementsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, joined_at')
    .eq('id', user.id)
    .single()

  const achievements = await getMyAchievements(user.id)
  const certificates = achievements.filter((a) => a.type === 'certificate')
  const awards       = achievements.filter((a) => a.type === 'award')
  const milestones   = achievements.filter((a) => a.type === 'milestone')

  // Build chronological timeline: join milestone + all achievements oldest first
  const timeline = [
    ...(profile?.joined_at
      ? [{ id: 'join', type: 'milestone' as const, title: 'Joined skillSYNC', description: `Welcome, ${(profile.full_name as string).split(' ')[0]}!`, earned_at: profile.joined_at as string }]
      : []),
    ...achievements,
  ].sort((a, b) => new Date(a.earned_at).getTime() - new Date(b.earned_at).getTime())

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">Achievements</h2>
        <p className="text-gray-400 mt-1">Your certificates, milestones, and awards.</p>
      </div>

      {achievements.length === 0 && (
        <div className="py-16 text-center rounded-2xl border border-brand-muted/20">
          <p className="text-4xl mb-4">🎯</p>
          <p className="font-display font-semibold text-brand-light mb-2">
            Your achievements will appear here
          </p>
          <p className="text-sm text-brand-muted max-w-xs mx-auto">
            as you contribute to skillSYNC — certificates, badges, and milestones are waiting for you.
          </p>
        </div>
      )}

      {certificates.length > 0 && (
        <Section title="Certificates">
          {certificates.map((a) => <AchievementCard key={a.id} achievement={a} />)}
        </Section>
      )}

      {awards.length > 0 && (
        <Section title="Awards">
          {awards.map((a) => <AchievementCard key={a.id} achievement={a} />)}
        </Section>
      )}

      {milestones.length > 0 && (
        <Section title="Milestones">
          {milestones.map((a) => <AchievementCard key={a.id} achievement={a} />)}
        </Section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <Section title="Your journey">
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-3.5 top-4 bottom-4 w-px bg-brand-muted/20" />
            {timeline.map((item) => (
              <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="relative z-10 h-7 w-7 rounded-full bg-brand-mid border-2 border-brand-muted/30 flex items-center justify-center flex-shrink-0 text-sm">
                  {TYPE_ICON[item.type] ?? '✨'}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-medium text-brand-light text-sm">{item.title}</p>
                    <span className="text-xs text-brand-muted flex-shrink-0">{formatDate(item.earned_at)}</span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-brand-light mb-4">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
