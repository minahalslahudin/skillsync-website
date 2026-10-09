/** @type {import('next').NextConfig} */

// ─────────────────────────────────────────────────────────────────────────────
// Security headers applied to every response.
// ─────────────────────────────────────────────────────────────────────────────
// CSP is intentionally scoped to what this codebase actually loads:
//   • Scripts: self only. `unsafe-inline` + `unsafe-eval` are required by
//     Next.js's runtime + framer-motion / recharts — they can be tightened
//     once we adopt nonces (Next 15+ has better CSP nonce support).
//   • Styles: self + Google Fonts (Inter, Bebas Neue) + inline (Tailwind + FOUC-avoidance styles).
//   • Fonts: only fonts.gstatic.com (matches next/font/google fetch target).
//   • Images: self + supabase.co (public storage buckets) + data:/blob: for previews.
//   • Connections: self + supabase.co (Auth, Storage, Postgres via PostgREST).
//   • frame-ancestors: 'none' matches X-Frame-Options: DENY.
//
// If additional third-party services are ever needed (Resend webhooks,
// analytics, etc.), add hosts explicitly here — never widen to `*`.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'X-Frame-Options',        value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Content-Security-Policy', value: CSP },
  // Strict-Transport-Security only makes sense over HTTPS; safe on Vercel.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
]

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to every route.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config) => {
    // Required for @react-pdf/renderer — it depends on canvas which isn't available in Node
    config.resolve.alias = { ...config.resolve.alias, canvas: false }
    return config
  },
}

export default nextConfig
