'use client'

// Editorial-bold horizontal ticker strip.
// Background: red. Text: white uppercase, wide letter-spacing.
// Items scroll left infinitely (18s). Items are duplicated so the
// -50% CSS animation loops seamlessly.

interface TickerProps {
  items: string[]
  /**
   * background color (default red). Pass 'black' for a black variant.
   */
  variant?: 'red' | 'black' | 'white'
}

export default function Ticker({ items, variant = 'red' }: TickerProps) {
  const doubled = [...items, ...items]

  const bg =
    variant === 'red'   ? 'bg-red' :
    variant === 'black' ? 'bg-black' :
                          'bg-white'
  const textColor =
    variant === 'white' ? 'text-black' : 'text-white'
  const dividerColor =
    variant === 'white' ? 'border-black/15' : 'border-white/20'

  return (
    <div className={`flex overflow-hidden border-y-[3px] border-black ${bg}`}>
      <div className="ed-ticker-track">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[2px] border-r ${dividerColor} ${textColor} flex-shrink-0`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
