import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | skillSYNC',
  description: 'How skillSYNC and skillIT collect, use, and protect your personal information.',
}

const LAST_UPDATED = 'July 16, 2026'

const SECTIONS = [
  {
    heading: '1. Who we are',
    body: [
      'This Privacy Policy explains how skillSYNC ("skillSYNC", "we", "us", "our") collects, uses, discloses, and protects personal information through the skillSYNC and skillIT websites, workshops, volunteer program, and related services (the "Services").',
      'We process personal information in accordance with South Africa’s Protection of Personal Information Act (POPIA), and we aim to follow good-practice data protection principles regardless of where you access the Services from.',
    ],
  },
  {
    heading: '2. Information we collect',
    body: [
      'Contact & newsletter: your name and email address when you use the contact form or subscribe to our newsletter.',
      'Volunteer applications: your name, email, phone number, and the answers you give in our application form (for example, your area of interest, experience, and availability).',
      'Workshop registrations: your name, email, phone number, university/institution, semester or year, current skill level, reason for applying, referral source, and a proof-of-payment file (image or PDF) you upload to confirm your seat.',
      'Account & platform data: if you are a volunteer, staff member, or admin, we store login credentials (via our authentication provider), profile information, role, task and project activity, achievements, certificates, and any content you submit while using the volunteer dashboard or admin panel.',
      'Reviews & testimonials: any review, rating, or testimonial you submit for display on the Services.',
      'Technical data: standard technical information such as IP address, browser type, device information, and pages visited, collected automatically to keep the Services secure and functioning correctly.',
    ],
  },
  {
    heading: '3. How we use your information',
    body: [
      'To operate the Services — process workshop registrations, verify payments, review volunteer applications, issue certificates, and manage volunteer/admin accounts.',
      'To communicate with you — respond to enquiries, send workshop confirmations, send the newsletter (only if you subscribed), and share relevant updates about events, workshops, and volunteer opportunities.',
      'To improve the Services — understand how the Services are used so we can fix issues and build better features.',
      'To keep the Services safe — detect and prevent fraud, abuse, and unauthorised access, including verifying proof-of-payment submissions.',
      'To meet legal obligations — where processing is required by law or to establish, exercise, or defend a legal claim.',
    ],
  },
  {
    heading: '4. Legal basis for processing',
    body: [
      'We process your information on one or more of the following bases: your consent (for example, subscribing to the newsletter), performance of a request you initiated (for example, registering for a workshop or applying to volunteer), our legitimate interests in operating and improving a community platform, and compliance with legal obligations.',
      'Where we rely on consent, you may withdraw it at any time — see "Your rights" below.',
    ],
  },
  {
    heading: '5. Who we share information with',
    body: [
      'We do not sell your personal information. We share it only with:',
    ],
    list: [
      'Service providers who help us run the Services — for example, our hosting and database provider (Supabase), which stores account data, application data, and uploaded files, and our email/newsletter delivery provider.',
      'skillSYNC and skillIT staff and volunteers who need access to review applications, verify payments, or manage workshops and projects, on a need-to-know basis.',
      'Third parties you choose to interact with directly — for example, if you join a WhatsApp group linked from our site, that group is operated by WhatsApp/Meta and governed by their own privacy terms, not this Policy.',
      'Authorities, where required to comply with a legal obligation, protect our rights, or investigate fraud or abuse.',
    ],
  },
  {
    heading: '6. Data storage & security',
    body: [
      'Your data is stored with our infrastructure provider (Supabase), using encryption in transit and access controls to restrict who can view it. Admin and volunteer dashboards are protected by authentication and role-based access, so only authorised team members can see application, payment, and volunteer data.',
      'No system is completely secure, and we cannot guarantee absolute security of information transmitted to us. If we become aware of a data breach that affects you, we will notify you and any relevant regulator as required by law.',
    ],
  },
  {
    heading: '7. Data retention',
    body: [
      'We keep personal information for as long as necessary to fulfil the purpose it was collected for — for example, for the duration of your volunteer engagement plus a reasonable period afterwards for record-keeping, or until you ask us to delete it and we have no legal reason to retain it.',
      'Unsuccessful workshop or volunteer applications are retained for a limited period in case a similar opportunity opens up, after which they are deleted or anonymised.',
    ],
  },
  {
    heading: '8. Your rights',
    body: [
      'Subject to applicable law, you have the right to:',
    ],
    list: [
      'Access the personal information we hold about you.',
      'Request correction of inaccurate or incomplete information.',
      'Request deletion of your information, where we are not required to keep it for legal or legitimate business reasons.',
      'Object to, or ask us to restrict, certain processing (for example, unsubscribe from the newsletter at any time via the link in any email or by contacting us).',
      'Withdraw consent at any time where processing is based on consent, without affecting processing carried out before withdrawal.',
      'Lodge a complaint with South Africa’s Information Regulator (or your local data protection authority) if you believe we have not handled your information properly.',
    ],
    footer: 'To exercise any of these rights, contact us at skillit.co@gmail.com. We will respond within a reasonable time.',
  },
  {
    heading: '9. Cookies & similar technologies',
    body: [
      'We use essential cookies to keep you securely signed in to the volunteer dashboard and admin panel. We do not use these cookies for advertising or cross-site tracking. Disabling cookies in your browser may prevent parts of the Services (like login) from working correctly.',
    ],
  },
  {
    heading: '10. Children’s privacy',
    body: [
      'The Services are intended for people aged 16 and over. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal information, please contact us so we can delete it.',
    ],
  },
  {
    heading: '11. Changes to this Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will update the "Last updated" date below when we do, and material changes will be communicated where appropriate.',
    ],
  },
  {
    heading: '12. Contact us',
    body: [
      'For any questions, requests, or concerns about this Privacy Policy or how we handle your information, contact us at skillit.co@gmail.com or via the Contact page.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-3">Legal</p>
        <h1 className="font-editorial text-black text-[3rem] sm:text-[4rem] leading-[0.9] tracking-[2px]">
          PRIVACY POLICY
        </h1>
        <p className="mt-4 text-[0.72rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)]">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-3xl">
          Your privacy matters to us. This policy explains what personal information we collect across
          skillSYNC and skillIT, why we collect it, and the choices and rights you have over it.
        </p>
      </div>

      <div className="px-6 sm:px-10 py-12 border-b-[3px] border-black bg-white">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {SECTIONS.map(({ heading, body, list, footer }) => (
            <section key={heading}>
              <h2 className="font-editorial text-black text-[1.6rem] tracking-[1px] mb-4 pb-2 border-b-[3px] border-black">
                {heading}
              </h2>
              <div className="flex flex-col gap-3">
                {body.map((p, i) => (
                  <p key={i} className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8]">{p}</p>
                ))}
                {list && (
                  <ul className="list-disc pl-5 flex flex-col gap-2">
                    {list.map((item, i) => (
                      <li key={i} className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8]">{item}</li>
                    ))}
                  </ul>
                )}
                {footer && (
                  <p className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8]">{footer}</p>
                )}
              </div>
            </section>
          ))}

          <div className="mt-4 pt-6 border-t-[3px] border-black text-[0.85rem] text-[color:var(--color-gray-dark)]">
            See also our{' '}
            <Link href="/terms" className="text-red hover:underline">Terms of Use</Link>.
          </div>
        </div>
      </div>
    </>
  )
}
