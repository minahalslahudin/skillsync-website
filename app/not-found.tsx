import Link from 'next/link'

export const metadata = { title: '404 — Page Not Found | skillSYNC × skillIT' }

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 text-center">

      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
          <span className="text-brand-accent font-black text-lg">S</span>
        </div>
        <div className="text-left">
          <p className="text-white font-bold leading-tight">skillSYNC</p>
          <p className="text-brand-muted text-xs">× skillIT</p>
        </div>
      </div>

      <p className="text-7xl font-black text-brand-accent/20 mb-4 select-none">404</p>

      <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-light mb-3">
        Page not found
      </h1>
      <p className="text-brand-muted text-sm max-w-xs mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-brand-accent text-white rounded-lg text-sm font-semibold hover:bg-brand-accent/90 transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/workshops"
          className="px-6 py-2.5 bg-brand-mid text-brand-light rounded-lg text-sm font-semibold hover:bg-brand-mid/80 transition-colors"
        >
          Browse workshops
        </Link>
      </div>
    </main>
  )
}
