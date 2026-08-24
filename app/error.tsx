'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  // Editorial-bold error page (renders its own <html>/<body> since it's a root
  // error boundary). Fonts come from cached CSS.
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-[#E94560] mb-4">Error</p>
        <h1 className="leading-[0.9] tracking-[2px] text-black text-[4rem] sm:text-[6rem]" style={{ fontFamily: '"Bebas Neue", Impact, sans-serif' }}>
          SOMETHING BROKE.
        </h1>
        <p className="text-[color:#666] max-w-md leading-[1.7] mt-6">
          An unexpected error occurred. Please try again, or head back to the homepage.
        </p>

        <div className="mt-8 inline-flex">
          <button onClick={reset} className="px-6 py-3 bg-black text-white border-[3px] border-black uppercase text-sm tracking-[1px] hover:bg-[#E94560] hover:border-[#E94560] transition-colors">
            Try again
          </button>
          <a href="/" className="px-6 py-3 bg-white text-black border-[3px] border-black border-l-0 uppercase text-sm tracking-[1px] hover:bg-black hover:text-white transition-colors">
            Back to home
          </a>
        </div>

        {error.digest && (
          <p className="mt-6 text-[0.7rem] uppercase tracking-[2px] text-[color:#999]">Error ID: {error.digest}</p>
        )}

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left w-full max-w-xl">
            <summary className="text-xs text-[color:#666] cursor-pointer hover:text-black select-none uppercase tracking-[1px]">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs text-[#E94560] bg-[color:#f5f0eb] border-[3px] border-black p-4 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
              {error.message}
              {error.stack ? '\n\n' + error.stack : ''}
            </pre>
          </details>
        )}
      </body>
    </html>
  )
}
