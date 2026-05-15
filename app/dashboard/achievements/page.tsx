import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getMyAchievements } from '@/lib/supabase/queries/achievements'
import AchievementCard from '@/components/dashboard/AchievementCard'

export default async function AchievementsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const achievements = await getMyAchievements(user.id)

  const certificates = achievements.filter((a) => a.type === 'certificate')
  const milestones   = achievements.filter((a) => a.type === 'milestone')
  const awards       = achievements.filter((a) => a.type === 'award')

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display font-bold text-brand-light">Achievements</h2>
        <p className="text-gray-400 mt-1">Your certificates, milestones, and awards.</p>
      </div>

      {achievements.length === 0 && (
        <p className="text-brand-muted text-sm py-12 text-center rounded-xl border border-brand-muted/20">
          No achievements yet. Keep contributing — they&apos;re coming! 🎯
        </p>
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
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-display font-semibold text-brand-light mb-3">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
