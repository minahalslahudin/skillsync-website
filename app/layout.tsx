import type { Metadata } from 'next'
import { Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Bebas Neue — editorial-bold display font. Only one weight exists.
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skillsync.pk'

export const metadata: Metadata = {
  title: {
    default: 'skillSYNC × skillIT',
    template: '%s | skillSYNC × skillIT',
  },
  description:
    "Pakistan's newest tech training platform and creative agency — building the next generation of talent through workshops, real projects, and community.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'skillSYNC × skillIT',
    description:
      "Pakistan's newest tech training platform and creative agency.",
    url: siteUrl,
    siteName: 'skillSYNC × skillIT',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'skillSYNC × skillIT' }],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'skillSYNC × skillIT',
    description: "Pakistan's newest tech training platform and creative agency.",
    images: ['/og-image.png'],
  },
  // All <link rel="icon"> tags are declared explicitly inside <head> in the
  // RootLayout below (clearest signal for Google's favicon crawler). We only
  // keep the manifest reference here.
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <head>
        {supabaseUrl && (
          <link rel="preconnect" href={supabaseUrl} />
        )}
        {/* Explicit favicon tags. Next.js also emits tags from app/icon.*
            files and metadata.icons above, but older crawlers (notably
            Google's favicon fetcher) are more reliable when the links are
            hard-coded with the legacy `shortcut icon` rel. */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
      </head>
      {/* Body stays dark to keep admin/dashboard legacy pages intact.
          The public site's (public) layout wraps its content in a white
          .public-shell that overrides these defaults. */}
      <body className="font-sans antialiased bg-brand-dark text-gray-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
