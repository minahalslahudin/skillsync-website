import Link from 'next/link'
import { FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa'

export const metadata = { title: 'Under Maintenance — skillSYNC' }

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 text-center">

      {/* Logo mark */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
          <span className="text-brand-accent font-black text-lg">S</span>
        </div>
        <div className="text-left">
          <p className="text-white font-bold leading-tight">skillSYNC</p>
          <p className="text-brand-muted text-xs">× skillIT</p>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-light mb-4">
        We&rsquo;re working on something
      </h1>
      <p className="text-brand-muted text-base max-w-sm mb-2">
        The site is temporarily down for scheduled maintenance.
      </p>
      <p className="text-brand-muted/60 text-sm mb-10">
        We&rsquo;ll be back soon — thank you for your patience.
      </p>

      {/* Decorative divider */}
      <div className="w-12 h-px bg-brand-accent/40 mb-10" />

      {/* Social links */}
      <p className="text-xs text-brand-muted mb-4 uppercase tracking-widest">Stay connected</p>
      <div className="flex items-center gap-5">
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-muted hover:text-green-400 transition-colors"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="h-5 w-5" />
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-muted hover:text-blue-400 transition-colors"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="h-5 w-5" />
        </a>
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-muted hover:text-pink-400 transition-colors"
          aria-label="Instagram"
        >
          <FaInstagram className="h-5 w-5" />
        </a>
        <a
          href="https://youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-muted hover:text-red-400 transition-colors"
          aria-label="YouTube"
        >
          <FaYoutube className="h-5 w-5" />
        </a>
      </div>

      {/* Admin escape hatch */}
      <Link
        href="/admin"
        className="mt-16 text-xs text-brand-muted/30 hover:text-brand-muted transition-colors"
      >
        Admin
      </Link>
    </main>
  )
}
