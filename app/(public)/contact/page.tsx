import ContactForm from '@/components/forms/ContactForm'
import SectionHeader from '@/components/public/SectionHeader'

const CONTACT_INFO = [
  { label: 'Email',    value: 'skillit.co@gmail.com',                    href: 'mailto:skillit.co@gmail.com' },
  { label: 'LinkedIn', value: 'linkedin.com/company/skillsync-za',       href: 'https://www.linkedin.com/company/skill-synchronized' },
  { label: 'GitHub',   value: 'github.com/skillitco',                    href: 'https://github.com/skillitco' },
]

export default function ContactPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Contact"
        title="Get In Touch"
        subtitle="Have a question, project proposal, or just want to say hi? Fill in the form and we'll get back within 1–2 business days."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 border-b-[3px] border-black bg-white">
        {/* Contact info column */}
        <div className="p-8 sm:p-10 lg:border-r-[3px] lg:border-black">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-3">Reach Us</p>
          <h2 className="font-editorial text-black text-[2.4rem] tracking-[2px] leading-[1]">
            LET&apos;S TALK.
          </h2>
          <div className="mt-10 flex flex-col gap-6">
            {CONTACT_INFO.map(({ label, value, href }) => (
              <div key={label} className="border-b-[3px] border-black pb-4">
                <p className="text-[0.7rem] uppercase tracking-[2px] text-red mb-1">{label}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.95rem] text-black hover:text-red transition-colors"
                >
                  {value}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Form column */}
        <div className="p-8 sm:p-10 bg-[color:var(--color-off-white)]">
          <ContactForm />
        </div>
      </div>
    </>
  )
}
