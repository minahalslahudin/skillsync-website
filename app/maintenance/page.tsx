import Link from 'next/link'
import { FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

export const metadata = { title: 'Under Maintenance — skillSYNC' }

// Editorial-bold maintenance page. Uses .public-shell so fonts and design
// tokens all work; the root body is dark by default.
export default function MaintenancePage() {
  return (
    <main className="public-shell min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-4">
        Under Maintenance
      </p>
      <h1 className="font-editorial text-black text-[3rem] sm:text-[5rem] leading-[0.9] tracking-[2px]">
        WE&apos;RE WORKING ON SOMETHING.
      </h1>
      <p className="text-[color:var(--color-gray-dark)] text-[0.95rem] leading-[1.7] max-w-md mt-6">
        The site is temporarily down for scheduled maintenance. We&apos;ll be back soon — thank you for your patience.
      </p>

      <div className="w-16 h-[3px] bg-red mt-10" />

      <p className="text-[0.7rem] uppercase tracking-[3px] text-[color:var(--color-gray-mid)] mt-10 mb-5">
        Stay connected
      </p>
      <div className="flex items-center gap-5">
        {[
          { href: 'https://wa.me/',       Icon: FaWhatsapp,  label: 'WhatsApp' },
          { href: 'https://linkedin.com/',Icon: FaLinkedin,  label: 'LinkedIn' },
          { href: 'https://instagram.com/',Icon: FaInstagram,label: 'Instagram' },
          { href: 'https://youtube.com/', Icon: FaYoutube,   label: 'YouTube' },
        ].map(({ href, Icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
             aria-label={label} className="text-black hover:text-red transition-colors">
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>

      <Link href="/admin" className="mt-16 text-[0.7rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)] hover:text-red transition-colors">
        Admin
      </Link>
    </main>
  )
}
