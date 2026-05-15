'use client'

import { motion } from 'framer-motion'
import type { Task } from '@/lib/types/app.types'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/formatDate'
import { cn } from '@/lib/utils/cn'

const STATUS_VARIANT = {
  pending:     'neutral',
  in_progress: 'info',
  completed:   'success',
  overdue:     'danger',
} as const

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
  overdue:     'Overdue',
}

const PRIORITY_DOT: Record<string, string> = {
  low:    'bg-brand-muted',
  medium: 'bg-yellow-500',
  high:   'bg-red-500',
}

export default function TaskCard({ task }: { task: Task }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start gap-4 rounded-xl border border-brand-muted/20 bg-brand-mid p-4 transition-all duration-200 hover:border-brand-accent/30"
    >
      <div className={cn('mt-2 h-2.5 w-2.5 rounded-full flex-shrink-0', PRIORITY_DOT[task.priority])} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={cn(
            'font-medium text-brand-light',
            task.status === 'completed' && 'line-through text-brand-muted'
          )}>
            {task.title}
          </p>
          <Badge variant={STATUS_VARIANT[task.status as keyof typeof STATUS_VARIANT] ?? 'neutral'}>
            {STATUS_LABEL[task.status] ?? task.status}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</p>
        )}
        {task.due_date && (
          <p className="text-xs text-brand-muted mt-2">Due {formatDate(task.due_date)}</p>
        )}
      </div>
    </motion.div>
  )
}
