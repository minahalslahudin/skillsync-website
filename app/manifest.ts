import type { MetadataRoute } from 'next'

// Served at /manifest.webmanifest by Next.js.
// Brand pink #E8445F on white — no black per the icon brief.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'skillSYNC × skillIT',
    short_name: 'skillSYNC',
    description:
      "Pakistan's newest tech training platform and creative agency.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E8445F',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
