'use client'

import { useState } from 'react'

type Role = {
  title: string
  skills: string[]
}

type Department = {
  name: string
  icon: string
  roles: Role[]
}

const DEPARTMENTS: Department[] = [
  {
    name: 'CEO Office',
    icon: '👑',
    roles: [
      {
        title: 'Content & Copywriting',
        skills: ['Writing', 'Storytelling', 'Brand voice', 'Content strategy', 'Editing'],
      },
      {
        title: 'Researcher',
        skills: ['Market research', 'Competitive analysis', 'Report writing', 'Data synthesis', 'Google Scholar / web research'],
      },
      {
        title: 'Prompt Engineer',
        skills: ['LLM prompting', 'AI tools (ChatGPT, Claude, Gemini)', 'Prompt chaining', 'Output evaluation', 'Python basics a plus'],
      },
      {
        title: 'Project Manager',
        skills: ['Task management', 'Notion / Trello / Asana', 'Team coordination', 'Deadline tracking', 'Communication'],
      },
    ],
  },
  {
    name: 'Growth & Brand',
    icon: '📈',
    roles: [
      {
        title: 'Social Media Manager',
        skills: ['Instagram', 'LinkedIn', 'TikTok', 'Content calendar', 'Analytics', 'Community engagement'],
      },
      {
        title: 'Video Editor / Videographer',
        skills: ['Premiere Pro or CapCut', 'Reels / Shorts editing', 'Shooting', 'Color grading', 'Motion graphics a plus'],
      },
      {
        title: 'Graphic Designer',
        skills: ['Figma', 'Canva', 'Adobe Illustrator', 'Brand identity', 'Social media creatives'],
      },
      {
        title: 'Content Writer',
        skills: ['Blog writing', 'SEO basics', 'Research', 'Editing', 'Brand tone'],
      },
      {
        title: 'Marketing Strategist',
        skills: ['Campaign planning', 'Funnel strategy', 'Email marketing', 'Analytics', 'Growth hacking'],
      },
    ],
  },
  {
    name: 'Technology & Platform',
    icon: '💻',
    roles: [
      {
        title: 'Web Developer (Frontend / Backend)',
        skills: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Supabase', 'REST APIs', 'Git'],
      },
      {
        title: 'Automation Specialist',
        skills: ['n8n', 'Make.com', 'Zapier', 'API integrations', 'Webhook setup', 'Workflow design'],
      },
      {
        title: 'ML / LLM Engineer',
        skills: ['Python', 'LangChain', 'OpenAI API', 'Fine-tuning', 'RAG pipelines', 'Hugging Face'],
      },
      {
        title: 'App Developer',
        skills: ['React Native or Flutter', 'Mobile UI', 'API integration', 'App deployment'],
      },
    ],
  },
  {
    name: 'Operations Office',
    icon: '⚙️',
    roles: [
      {
        title: 'Operations Associate',
        skills: [
          'Communication',
          'Problem solving',
          'Scheduling',
          'Process documentation',
          'Attention to detail',
          'Team coordination',
          'Ops / admin / HR / client management experience a plus',
        ],
      },
    ],
  },
]

export default function OpenPositions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-4">
      {DEPARTMENTS.map((dept, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={dept.name}
            className={`rounded-2xl border bg-brand-mid transition-all duration-300 overflow-hidden ${
              isOpen ? 'border-brand-accent/40 shadow-[0_0_20px_rgba(233,69,96,0.10)]' : 'border-brand-muted/20'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={`dept-${idx}`}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left hover:bg-brand-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{dept.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-display font-bold text-brand-light truncate">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {dept.roles.length} {dept.roles.length === 1 ? 'role' : 'roles'} open
                  </p>
                </div>
              </div>
              <span
                className={`flex-shrink-0 h-8 w-8 rounded-full border border-brand-muted/30 flex items-center justify-center text-brand-accent text-sm transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-brand-accent/10 border-brand-accent/40' : ''
                }`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {isOpen && (
              <div
                id={`dept-${idx}`}
                className="border-t border-brand-muted/20 px-4 py-5 sm:px-6 sm:py-6 bg-brand-dark/40"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dept.roles.map((role) => (
                    <div
                      key={role.title}
                      className="rounded-xl border border-brand-muted/20 bg-brand-mid p-4 sm:p-5 hover:border-brand-accent/30 transition-colors"
                    >
                      <h4 className="text-sm sm:text-base font-display font-semibold text-brand-light mb-3">
                        {role.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {role.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent/90"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
