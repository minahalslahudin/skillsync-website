import type { Metadata } from 'next'
import FounderSection from '@/components/public/FounderSection'
import SectionHeader from '@/components/public/SectionHeader'

const LINKEDIN_URL  = 'https://www.linkedin.com/in/minahal-salahudin-a5747534b'
const INSTAGRAM_URL = 'https://www.instagram.com/minahaldot'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skillsync.pk'
const pageUrl = `${siteUrl}/team`
const ogImage = '/og-image.png'

export const metadata: Metadata = {
  title: 'Minahal Salahudin | Founder & CEO of skillSYNC',
  description:
    'Meet Minahal Salahudin, Founder & CEO of skillSYNC, a Pakistani ed-tech startup building practical tech skills and AI, automation, and web solutions through skillIT.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Minahal Salahudin | Founder & CEO of skillSYNC',
    description:
      'Meet Minahal Salahudin, Founder & CEO of skillSYNC, a Pakistani ed-tech startup building practical tech skills and AI, automation, and web solutions through skillIT.',
    url: pageUrl,
    siteName: 'skillSYNC × skillIT',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Minahal Salahudin, Founder of skillSYNC' }],
    locale: 'en_PK',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minahal Salahudin | Founder & CEO of skillSYNC',
    description:
      'Meet Minahal Salahudin, Founder & CEO of skillSYNC, a Pakistani ed-tech startup building practical tech skills.',
    images: [ogImage],
  },
}

// Schema.org Person — JSON-LD for richer search results.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Minahal Salahudin',
  jobTitle: 'Founder & CEO',
  worksFor: { '@type': 'Organization', name: 'skillSYNC' },
  alumniOf: 'FAST',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Islamabad',
    addressCountry: 'PK',
  },
  sameAs: [LINKEDIN_URL, INSTAGRAM_URL],
}

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static object: safe to serialize once at render time.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <FounderSection />

      {/* Placeholder for the rest of the team — profiles will be added here
          once the re-shoot and copy pass are complete. Keep this block so
          the page keeps its editorial-bold rhythm. */}
      <SectionHeader
        eyebrow="Our People"
        title="The Rest Of The Team"
        subtitle="More profiles coming soon. We are refreshing team photos and bios before publishing the full roster."
      />
      <div className="px-6 sm:px-10 py-16 border-b-[3px] border-black bg-white">
        <p className="text-center text-[color:var(--color-gray-mid)] uppercase tracking-[2px] text-sm">
          Team profiles coming soon.
        </p>
      </div>
    </>
  )
}
