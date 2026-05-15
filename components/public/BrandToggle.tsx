'use client'

import { useBrand } from '@/lib/context/BrandContext'
import { cn } from '@/lib/utils/cn'

export default function BrandToggle() {
  const { brand, setBrand } = useBrand()

  return (
    <div className="flex items-center rounded-full border border-brand-muted/30 bg-brand-mid/50 p-0.5 gap-0.5">
      <button
        onClick={() => setBrand('skillsync')}
        className={cn(
          'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap',
          brand === 'skillsync'
            ? 'bg-brand-accent text-white shadow-sm'
            : 'text-brand-muted hover:text-brand-light'
        )}
      >
        skillSYNC
      </button>
      <button
        onClick={() => setBrand('skillit')}
        className={cn(
          'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap',
          brand === 'skillit'
            ? 'bg-skillit-accent text-white shadow-sm'
            : 'text-brand-muted hover:text-brand-light'
        )}
      >
        skillIT
      </button>
    </div>
  )
}
