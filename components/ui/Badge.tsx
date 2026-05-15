import { cn } from '@/lib/utils/cn'

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  variant?: Variant
  dot?: boolean
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-green-900/40 text-green-400 border border-green-800',
  warning: 'bg-amber-900/40 text-amber-400 border border-amber-800',
  danger:  'bg-red-900/40 text-red-400 border border-red-800',
  info:    'bg-[#0F6B7A]/20 text-[#7dd3da] border border-[#0F6B7A]/50',
  neutral: 'bg-brand-mid text-brand-muted border border-brand-muted/50',
}

const dotClasses: Record<Variant, string> = {
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-[#7dd3da]',
  neutral: 'bg-brand-muted',
}

export default function Badge({
  variant = 'neutral',
  dot = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
