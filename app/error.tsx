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

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4 text-center font-sans">

        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 font-black text-lg">!</span>
          </div>
          <div className="text-left">
            <p className="text-white font-bold leading-tight">skillSYNC</p>
            <p className="text-zinc-500 text-xs">× skillIT</p>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-zinc-400 text-sm max-w-xs mb-10">
          An unexpected error occurred. Please try again or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2.5 bg-zinc-800 text-zinc-200 rounded-lg text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Back to home
          </a>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs text-zinc-600">Error ID: {error.digest}</p>
        )}

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left w-full max-w-xl">
            <summary className="text-xs text-zinc-600 cursor-pointer hover:text-zinc-400 select-none">
              Error details (dev only)
            </summary>
            <pre className="mt-2 text-xs text-red-400/80 bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
              {error.message}
              {error.stack ? '\n\n' + error.stack : ''}
            </pre>
          </details>
        )}
      </body>
    </html>
  )
}
