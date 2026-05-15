import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {supabaseUrl && (
          <link rel="preconnect" href={supabaseUrl} />
        )}
      </head>
      <body className="font-sans antialiased bg-brand-dark text-gray-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
