'use client'

import { useState } from 'react'

// Editorial-bold expandable open-positions list.
// Each department = 3px-bordered box, click to expand.

type Role = { title: string; skills: string[] }
type Department = { name: string; roles: Role[] }

const DEPARTMENTS: Department[] = [
  {
    name: 'CEO Office',
    roles: [
      { title: 'Content & Copywriting', skills: ['Writing', 'Storytelling', 'Brand voice', 'Content strategy', 'Editing'] },
      { title: 'Researcher',            skills: ['Market research', 'Competitive analysis', 'Report writing', 'Data synthesis'] },
      { title: 'Prompt Engineer',       skills: ['LLM prompting', 'ChatGPT / Claude / Gemini', 'Prompt chaining', 'Output evaluation'] },
      { title: 'Project Manager',       skills: ['Task management', 'Notion / Trello / Asana', 'Team coordination', 'Deadline tracking'] },
    ],
  },
  {
    name: 'Growth & Brand',
    roles: [
      { title: 'Social Media Manager',       skills: ['Instagram', 'LinkedIn', 'TikTok', 'Content calendar', 'Analytics'] },
      { title: 'Video Editor / Videographer',skills: ['Premiere Pro / CapCut', 'Reels / Shorts', 'Shooting', 'Color grading'] },
      { title: 'Graphic Designer',           skills: ['Figma', 'Canva', 'Adobe Illustrator', 'Brand identity'] },
      { title: 'Content Writer',             skills: ['Blog writing', 'SEO basics', 'Research', 'Editing'] },
      { title: 'Marketing Strategist',       skills: ['Campaign planning', 'Funnel strategy', 'Email marketing', 'Analytics'] },
    ],
  },
  {
    name: 'Technology & Platform',
    roles: [
      { title: 'Web Developer (Frontend / Backend)', skills: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Supabase', 'REST APIs', 'Git'] },
      { title: 'Automation Specialist',              skills: ['n8n', 'Make.com', 'Zapier', 'API integrations', 'Webhook setup'] },
      { title: 'ML / LLM Engineer',                  skills: ['Python', 'LangChain', 'OpenAI API', 'Fine-tuning', 'RAG', 'Hugging Face'] },
      { title: 'App Developer',                      skills: ['React Native or Flutter', 'Mobile UI', 'API integration', 'App deployment'] },
    ],
  },
  {
    name: 'Operations Office',
    roles: [
      { title: 'Operations Associate', skills: ['Communication', 'Problem solving', 'Scheduling', 'Process documentation', 'Attention to detail', 'Team coordination'] },
    ],
  },
]

export default function OpenPositions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-6">
      {DEPARTMENTS.map((dept, idx) => {
        const isOpen = openIndex === idx
        return (
          <div key={dept.name} className="border-[3px] border-black bg-white">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              aria-controls={`dept-${idx}`}
              className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left hover:bg-[color:var(--color-off-white)] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="font-editorial text-red text-[2rem] leading-none">
                  0{idx + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-editorial text-black text-[1.6rem] leading-none tracking-[1px] truncate">
                    {dept.name.toUpperCase()}
                  </h3>
                  <p className="text-[0.7rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)] mt-1">
                    {dept.roles.length} {dept.roles.length === 1 ? 'role' : 'roles'} open
                  </p>
                </div>
              </div>
              <span
                className={`flex-shrink-0 h-9 w-9 border-[3px] border-black bg-white flex items-center justify-center text-black text-sm transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-red text-white border-red' : ''
                }`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {isOpen && (
              <div id={`dept-${idx}`} className="border-t-[3px] border-black bg-[color:var(--color-off-white)]">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {dept.roles.map((role, rIdx) => (
                    <div
                      key={role.title}
                      className={[
                        'p-5 sm:p-6',
                        rIdx > 0 ? 'border-t-[3px] border-black md:border-t-0' : '',
                        rIdx % 2 === 1 ? 'md:border-l-[3px] md:border-black' : '',
                        rIdx >= 2 ? 'md:border-t-[3px] md:border-black' : '',
                      ].join(' ')}
                    >
                      <h4 className="font-editorial text-black text-[1.3rem] leading-none tracking-[1px] mb-3">
                        {role.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {role.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[0.7rem] uppercase tracking-[1px] px-2 py-1 border border-black text-black"
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
