'use client'

import { useBrand } from '@/lib/context/BrandContext'

// Editorial-bold: two small square uppercase buttons side by side.
// Active state = black background + white text (no border-radius, no gradient).
export default function BrandToggle() {
  const { brand, setBrand } = useBrand()

  const base =
    'px-3 py-1.5 text-[0.7rem] uppercase tracking-[1px] font-semibold border-y-[3px] border-black transition-colors'

  return (
    <div className="inline-flex">
      <button
        onClick={() => setBrand('skillsync')}
        className={[
          base,
          'border-l-[3px]',
          brand === 'skillsync'
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-[color:var(--color-off-white)]',
        ].join(' ')}
      >
        skillSYNC
      </button>
      <button
        onClick={() => setBrand('skillit')}
        className={[
          base,
          'border-x-[3px]',
          brand === 'skillit'
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-[color:var(--color-off-white)]',
        ].join(' ')}
      >
        skillIT
      </button>
    </div>
  )
}
