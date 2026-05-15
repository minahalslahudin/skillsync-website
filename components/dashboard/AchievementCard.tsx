import type { Achievement } from '@/lib/types/app.types'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/formatDate'

const TYPE_VARIANT = {
  certificate: 'success',
  milestone:   'info',
  award:       'warning',
} as const

const TYPE_ICON: Record<string, string> = {
  certificate: '📜',
  milestone:   '🎯',
  award:       '🏆',
}

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="rounded-xl border border-brand-muted/20 bg-brand-mid p-5 flex items-start gap-4 transition-all duration-300 hover:border-brand-accent/40 hover:-translate-y-0.5 hover:shadow-glow">
      <div className="text-3xl flex-shrink-0 mt-0.5">{TYPE_ICON[achievement.type] ?? '🎖️'}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-brand-light">{achievement.title}</h3>
          <Badge variant={TYPE_VARIANT[achievement.type as keyof typeof TYPE_VARIANT] ?? 'neutral'}>
            {achievement.type}
          </Badge>
        </div>
        {achievement.description && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{achievement.description}</p>
        )}
        <p className="text-xs text-brand-muted mt-2">Issued {formatDate(achievement.issued_at)}</p>
        {achievement.certificate_url && (
          <a
            href={achievement.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-accent hover:underline mt-1 inline-block"
          >
            View certificate →
          </a>
        )}
      </div>
    </div>
  )
}
