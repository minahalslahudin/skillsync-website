import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use | skillSYNC',
  description: 'The terms and conditions that govern your use of skillSYNC and skillIT.',
}

const LAST_UPDATED = 'July 16, 2026'

const SECTIONS = [
  {
    heading: '1. Acceptance of these Terms',
    body: [
      'These Terms of Use ("Terms") govern your access to and use of the skillSYNC and skillIT websites, workshops, volunteer program, and related services (together, the "Services"), operated by skillSYNC ("skillSYNC", "we", "us", or "our").',
      'By creating an account, registering for a workshop, submitting an application, or otherwise using the Services, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, please do not use the Services.',
    ],
  },
  {
    heading: '2. Who we are',
    body: [
      'skillSYNC is a community training platform that teaches practical tech skills through workshops, cohorts, and live projects. skillIT is our companion digital agency, where volunteers and alumni apply those skills to real client work.',
      'The two brands share the same team, systems, and these Terms unless stated otherwise.',
    ],
  },
  {
    heading: '3. Eligibility',
    body: [
      'You must be at least 16 years old to use the Services or submit any form on this site. If you are between 16 and 18, you confirm that a parent or legal guardian has reviewed and agreed to these Terms on your behalf.',
      'By registering for a workshop, applying to volunteer, or creating an account, you confirm that all information you provide is accurate, current, and complete.',
    ],
  },
  {
    heading: '4. Accounts',
    body: [
      'Certain parts of the Services (such as the volunteer dashboard and admin panel) require an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.',
      'Notify us immediately at skillit.co@gmail.com if you suspect any unauthorised use of your account. We may suspend or terminate accounts that violate these Terms or that we reasonably believe pose a security risk to the platform or other users.',
    ],
  },
  {
    heading: '5. Workshops & registration',
    body: [
      'Workshop seats are limited and allocated on a first-come, first-served basis once registration and proof of payment are submitted and verified.',
      'Payment receipts are reviewed manually and verification may take up to 24 hours. Submitting a receipt does not guarantee a seat until you receive confirmation from our team.',
      'Workshop fees are non-refundable once your seat has been confirmed, except where a workshop is cancelled or rescheduled by skillSYNC, in which case you will be offered a full refund or transfer to a future workshop at your choice.',
      'We reserve the right to postpone, reschedule, or cancel a workshop due to insufficient enrolment, facilitator availability, or circumstances beyond our reasonable control. Where this happens, we will notify registered participants as soon as possible.',
    ],
  },
  {
    heading: '6. Volunteer & internship program',
    body: [
      'The volunteer, internship, and paid-role pathway described on our Join page is offered at skillSYNC’s discretion and is not a guarantee of employment, income, or advancement. Progression between stages depends on performance, availability of positions, and organisational need.',
      'Volunteer and intern positions are stipend-based; permanent roles are paid. Stipend amounts, schedules, and eligibility are communicated directly to accepted applicants and may change over time.',
      'Where a role specifies a minimum time commitment (for example, 20 hours per week), you agree to honour that commitment or to communicate promptly with your team lead if you are unable to. Repeated unexplained absence may result in removal from the program.',
      'Certificates are issued for verified contributions and completed milestones, at skillSYNC’s discretion, and remain the property of skillSYNC to revoke if it is later found that the underlying work was misrepresented.',
    ],
  },
  {
    heading: '7. Acceptable use',
    body: [
      'When using the Services, you agree not to: (a) submit false, misleading, or impersonated information in any form or application; (b) upload malicious code, attempt to gain unauthorised access to any account, dashboard, or system; (c) harass, discriminate against, or abuse any member of the community, staff, or volunteers; (d) use the Services for any unlawful purpose or in a way that infringes the rights of others; or (e) scrape, resell, or redistribute content from the Services without our written permission.',
      'We may remove content, suspend access, or terminate accounts that violate this section, with or without notice.',
    ],
  },
  {
    heading: '8. Content you submit',
    body: [
      'Reviews, testimonials, application answers, project submissions, and other content you provide ("User Content") remain yours, but by submitting it you grant skillSYNC a non-exclusive, worldwide, royalty-free licence to display, reproduce, and use that content in connection with operating and promoting the Services (for example, showcasing a testimonial on the Reviews page).',
      'You are solely responsible for the accuracy and legality of your User Content. Do not submit anything you do not have the right to share, or that contains another person’s personal information without their consent.',
    ],
  },
  {
    heading: '9. Intellectual property',
    body: [
      'The skillSYNC and skillIT names, logos, course materials, website design, and code (excluding client and open-source work explicitly licensed otherwise) are the property of skillSYNC and may not be copied, reproduced, or used without our prior written consent.',
      'Client project work produced through skillIT is governed by the specific agreement in place with that client, which takes precedence over this section for that engagement.',
    ],
  },
  {
    heading: '10. Third-party links & services',
    body: [
      'The Services may link to third-party platforms (LinkedIn, Instagram, YouTube, GitHub, WhatsApp, payment platforms, and similar). We do not control and are not responsible for the content, policies, or practices of those third parties. Your use of them is subject to their own terms.',
    ],
  },
  {
    heading: '11. Disclaimers',
    body: [
      'The Services are provided "as is" and "as available", without warranties of any kind, express or implied, including any warranty of merchantability, fitness for a particular purpose, or non-infringement.',
      'We do not guarantee that workshops, mentorship, or the volunteer program will result in any particular skill outcome, job offer, or career result.',
    ],
  },
  {
    heading: '12. Limitation of liability',
    body: [
      'To the fullest extent permitted by law, skillSYNC and its volunteers, staff, and affiliates will not be liable for any indirect, incidental, special, or consequential damages arising out of or relating to your use of the Services, even if advised of the possibility of such damages.',
      'Nothing in these Terms limits liability that cannot lawfully be excluded, including liability for fraud or gross negligence.',
    ],
  },
  {
    heading: '13. Termination',
    body: [
      'You may stop using the Services and request deletion of your account at any time by contacting us. We may suspend or terminate your access to the Services if you breach these Terms, without prejudice to any other rights or remedies available to us.',
    ],
  },
  {
    heading: '14. Governing law',
    body: [
      'These Terms are governed by the laws of the Republic of South Africa. Any dispute arising from these Terms or your use of the Services will be subject to the non-exclusive jurisdiction of the South African courts.',
    ],
  },
  {
    heading: '15. Changes to these Terms',
    body: [
      'We may update these Terms from time to time to reflect changes to the Services or for legal or operational reasons. We will update the "Last updated" date below when we do. Continued use of the Services after changes take effect constitutes acceptance of the revised Terms.',
    ],
  },
  {
    heading: '16. Contact us',
    body: [
      'If you have any questions about these Terms, reach out at skillit.co@gmail.com or via the Contact page.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[3px] text-red mb-3">Legal</p>
        <h1 className="font-editorial text-black text-[3rem] sm:text-[4rem] leading-[0.9] tracking-[2px]">
          TERMS OF USE
        </h1>
        <p className="mt-4 text-[0.72rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)]">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-6 text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8] max-w-3xl">
          Please read these Terms carefully before using skillSYNC or skillIT. They explain what you can
          expect from us, and what we expect from you.
        </p>
      </div>

      <div className="px-6 sm:px-10 py-12 border-b-[3px] border-black bg-white">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {SECTIONS.map(({ heading, body }) => (
            <section key={heading}>
              <h2 className="font-editorial text-black text-[1.6rem] tracking-[1px] mb-4 pb-2 border-b-[3px] border-black">
                {heading}
              </h2>
              <div className="flex flex-col gap-3">
                {body.map((p, i) => (
                  <p key={i} className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.8]">{p}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-4 pt-6 border-t-[3px] border-black text-[0.85rem] text-[color:var(--color-gray-dark)]">
            See also our{' '}
            <Link href="/privacy" className="text-red hover:underline">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </>
  )
}
