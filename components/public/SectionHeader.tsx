import type { ReactNode } from 'react'
import Link from 'next/link'

// Editorial-bold section / page header.
// - Small red uppercase eyebrow.
// - Big Bebas Neue title.
// - Optional subtitle in grey Inter.
// - Optional link CTA on the right.
// - Bottom edge is a 3px black border (the signature).

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  href?: string
  linkLabel?: string
  align?: 'left' | 'center'
  className?: string
  children?: ReactNode
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
  align = 'left',
  className = '',
  children,
}: SectionHeaderProps) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`px-6 sm:px-10 py-8 sm:py-10 border-b-[3px] border-black bg-white ${className}`}>
      <div className={`flex flex-col ${alignCls} gap-3 sm:flex-row sm:items-end sm:justify-between`}>
        <div className={`flex flex-col ${alignCls} gap-3 min-w-0`}>
          {eyebrow && (
            <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red">
              {eyebrow}
            </p>
          )}
          <h1 className="font-editorial text-black text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] leading-[0.9] tracking-[2px]">
            {title.toUpperCase()}
          </h1>
          {subtitle && (
            <p className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-[560px]">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {href && linkLabel && (
          <Link
            href={href}
            className="text-[0.78rem] font-semibold uppercase tracking-[1px] text-black hover:text-red transition-colors flex-shrink-0"
          >
            {linkLabel} →
          </Link>
        )}
      </div>
    </div>
  )
}
