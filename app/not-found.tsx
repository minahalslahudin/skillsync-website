import Link from 'next/link'

export const metadata = { title: '404 — Page Not Found | skillSYNC × skillIT' }

// Editorial-bold 404. Rendered outside the (public) layout because Next
// routes not-found to the root, so it stamps its own shell.
export default function NotFound() {
  return (
    <main className="public-shell min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-4">
        Not Found
      </p>
      <p className="font-editorial text-black text-[10rem] leading-[0.9] tracking-[2px] select-none">
        404
      </p>
      <h1 className="font-editorial text-black text-[2.5rem] sm:text-[3.5rem] leading-[0.9] tracking-[2px] mt-4">
        PAGE NOT FOUND
      </h1>
      <p className="text-[color:var(--color-gray-dark)] text-[0.9rem] leading-[1.7] max-w-md mt-4">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 inline-flex">
        <Link href="/" className="btn-ed-primary">Back to home</Link>
        <Link href="/workshops" className="btn-ed-outline border-l-0">Browse workshops</Link>
      </div>
    </main>
  )
}
