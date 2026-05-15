import ContactForm from '@/components/forms/ContactForm'

const CONTACT_INFO = [
  { label: 'Email',    value: 'hello@skillsync.co.za',       href: 'mailto:hello@skillsync.co.za' },
  { label: 'LinkedIn', value: 'linkedin.com/company/skillsync-za', href: 'https://linkedin.com/company/skillsync-za' },
  { label: 'GitHub',   value: 'github.com/skillsync-za',     href: 'https://github.com/skillsync-za' },
]

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <p className="text-brand-accent text-sm font-semibold tracking-widest uppercase mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-brand-light leading-tight">
            Get in touch
          </h1>
          <p className="mt-5 text-gray-400 leading-relaxed max-w-md">
            Have a question, project proposal, or just want to say hi? Fill in the form and we&apos;ll get back to you within 1–2 business days.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {CONTACT_INFO.map(({ label, value, href }) => (
              <div key={label}>
                <p className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">{label}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light hover:text-brand-accent transition-colors text-sm"
                >
                  {value}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl border border-brand-muted/20 bg-brand-mid p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
