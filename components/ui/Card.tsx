import { cn } from '@/lib/utils/cn'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
}

export default function Card({ className, children, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-brand-muted/30 bg-brand-mid p-6',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-brand-accent',
        className
      )}
    >
      {children}
    </div>
  )
}
