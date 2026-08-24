import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Bot, Sparkles, BarChart2, GitBranch, Shield, Zap, Calendar, Mail,
  Copy, Tag, FileText, Briefcase, Package, Timer, Bell, Database,
  Layers, CheckCircle2, ArrowLeft, Clock, DollarSign,
  type LucideIcon,
} from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Project } from '@/lib/types/app.types'

// Feature icon keyword mapping — unchanged.
function getFeatureIcon(title: string): LucideIcon {
  const t = title.toLowerCase()
  if (t.includes('ai') || t.includes('gpt') || t.includes('bot') || t.includes('llm')) return Bot
  if (t.includes('personal') || t.includes('custom') || t.includes('unique')) return Sparkles
  if (t.includes('scor') || t.includes('rank') || t.includes('priorit')) return BarChart2
  if (t.includes('rout') || t.includes('branch') || t.includes('condition') || t.includes('way')) return GitBranch
  if (t.includes('error') || t.includes('safe') || t.includes('protect') || t.includes('guard')) return Shield
  if (t.includes('real-time') || t.includes('instant') || t.includes('trigger') || t.includes('fast')) return Zap
  if (t.includes('calendar') || t.includes('schedul') || t.includes('book')) return Calendar
  if (t.includes('email') || t.includes('mail') || t.includes('send')) return Mail
  if (t.includes('duplic') || t.includes('once')) return Copy
  if (t.includes('tag') || t.includes('label') || t.includes('classif') || t.includes('categor')) return Tag
  if (t.includes('audit') || t.includes('log') || t.includes('history') || t.includes('trail')) return FileText
  if (t.includes('product') || t.includes('service') || t.includes('client') || t.includes('business')) return Briefcase
  if (t.includes('local') || t.includes('cost') || t.includes('zero') || t.includes('free')) return Package
  if (t.includes('notif') || t.includes('alert')) return Bell
  if (t.includes('data') || t.includes('database') || t.includes('sheet')) return Database
  if (t.includes('decoupl') || t.includes('separate') || t.includes('workflow') || t.includes('pipeline')) return Layers
  if (t.includes('24/7') || t.includes('24x7') || t.includes('around') || t.includes('always')) return Timer
  return CheckCircle2
}

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('projects')
    .select('title, tagline, cover_image')
    .eq('slug', params.slug)
    .single()
  if (!data) return { title: 'Project Not Found' }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any
  return {
    title: `${d.title} — skillIT Case Study`,
    description: d.tagline ?? undefined,
    openGraph: { images: d.cover_image ? [d.cover_image] : [] },
  }
}

// Editorial-bold project case-study page.
// Kept the section content model identical — only visuals were re-skinned.

export default async function ProjectDetailPage({ params }: Props) {
  const admin = createAdminClient()
  const { data: project } = await admin
    .from('projects').select('*').eq('slug', params.slug).eq('is_published', true).single()
  if (!project) notFound()

  const p           = project as unknown as Project
  const howItWorks  = (p.how_it_works  as { title: string; description: string }[] | null) ?? []
  const keyFeatures = (p.key_features  as { title: string; description: string }[] | null) ?? []
  const results     = (p.results       as string[]                                | null) ?? []
  const techStack   = (p.tech_stack    as { tool: string;  role: string }[]      | null) ?? []

  return (
    <>
      {/* ── Breadcrumb strip ────────────────────────────────────── */}
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-3">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[1px] text-black hover:text-red">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to projects
        </Link>
      </div>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="border-b-[3px] border-black bg-white px-6 sm:px-10 py-12">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {p.tool && (
            <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-1 bg-black text-white">
              Built with {p.tool}
            </span>
          )}
          {p.industry && (
            <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-1 border border-black text-black">
              {p.industry.split(',')[0].trim()}
            </span>
          )}
          {p.project_type && (
            <span className="text-[0.62rem] font-semibold uppercase tracking-[2px] px-2 py-1 bg-red text-white">
              {p.project_type}
            </span>
          )}
        </div>

        <h1 className="font-editorial text-black text-[3rem] sm:text-[5rem] leading-[0.9] tracking-[2px]">
          {p.title.toUpperCase()}
        </h1>
        {p.tagline && (
          <p className="mt-6 text-[1.05rem] text-[color:var(--color-gray-dark)] leading-[1.7] max-w-3xl">
            {p.tagline}
          </p>
        )}

        {p.builder_name && (
          <div className="mt-8 inline-flex items-center gap-4 border-[3px] border-black bg-white px-4 py-3">
            <div className="w-10 h-10 bg-red flex items-center justify-center flex-shrink-0">
              <span className="font-editorial text-white text-lg">{p.builder_name[0]}</span>
            </div>
            <div>
              <p className="text-[0.85rem] text-[color:var(--color-gray-dark)]">
                Built by <span className="font-semibold text-black">{p.builder_name}</span>
              </p>
              {p.builder_role && (
                <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)]">
                  {p.builder_role}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── The Problem ────────────────────────────────────────── */}
      {p.problem_statement && (
        <section className="border-b-[3px] border-black bg-white">
          <div className="px-6 sm:px-10 py-4 border-b-[3px] border-black bg-red">
            <p className="font-editorial text-white text-[1.5rem] tracking-[2px]">THE PROBLEM</p>
          </div>
          <div className="px-6 sm:px-10 py-10">
            <p className="text-[1rem] sm:text-[1.1rem] text-black leading-[1.75] max-w-3xl">
              {p.problem_statement}
            </p>
          </div>
        </section>
      )}

      {/* ── How It Works ───────────────────────────────────────── */}
      {howItWorks.length > 0 && (
        <section className="border-b-[3px] border-black bg-white">
          <div className="px-6 sm:px-10 py-4 border-b-[3px] border-black">
            <p className="font-editorial text-black text-[1.5rem] tracking-[2px]">HOW IT WORKS</p>
          </div>
          <div className="px-6 sm:px-10 py-10 max-w-3xl">
            {howItWorks.map((step, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 border-[3px] border-black bg-red flex items-center justify-center font-editorial text-white text-lg">
                    {i + 1}
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="w-[3px] flex-1 bg-black min-h-8 my-1" />
                  )}
                </div>
                <div className={`pt-2 min-w-0 flex-1 ${i < howItWorks.length - 1 ? 'pb-8' : ''}`}>
                  <h3 className="font-editorial text-black text-[1.4rem] tracking-[1px]">{step.title}</h3>
                  <p className="text-[0.9rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-2">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Key Features ───────────────────────────────────────── */}
      {keyFeatures.length > 0 && (
        <section className="border-b-[3px] border-black bg-white">
          <div className="px-6 sm:px-10 py-4 border-b-[3px] border-black">
            <p className="font-editorial text-black text-[1.5rem] tracking-[2px]">KEY FEATURES</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {keyFeatures.map((feat, i) => {
              const Icon = getFeatureIcon(feat.title)
              const evenRow = Math.floor(i / 2) % 2 === 0
              return (
                <div
                  key={i}
                  className={[
                    'p-6 border-b-[3px] border-black',
                    i % 2 === 0 ? 'sm:border-r-[3px] sm:border-black' : '',
                    evenRow ? '' : '',
                  ].join(' ')}
                >
                  <div className="w-11 h-11 border-[3px] border-black bg-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-red" />
                  </div>
                  <h3 className="font-editorial text-black text-[1.3rem] tracking-[1px]">{feat.title}</h3>
                  <p className="text-[0.85rem] text-[color:var(--color-gray-dark)] leading-[1.7] mt-2">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Results & Impact ───────────────────────────────────── */}
      {results.length > 0 && (
        <section className="border-b-[3px] border-black bg-black text-white">
          <div className="px-6 sm:px-10 py-4 border-b-[3px] border-red">
            <p className="font-editorial text-white text-[1.5rem] tracking-[2px]">RESULTS &amp; IMPACT</p>
          </div>
          <ul className="px-6 sm:px-10 py-10 space-y-4 max-w-3xl">
            {results.map((r, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-red flex-shrink-0 mt-1"><CheckCircle2 className="w-5 h-5" /></span>
                <span className="text-[0.95rem] text-white leading-[1.7]">{r}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Time & Money Saved ─────────────────────────────────── */}
      {(p.time_saved || p.money_saved) && (
        <section className="border-b-[3px] border-black bg-white">
          <div className="px-6 sm:px-10 py-4 border-b-[3px] border-black">
            <p className="font-editorial text-black text-[1.5rem] tracking-[2px]">TIME &amp; MONEY SAVED</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {p.time_saved && (
              <div className="p-8 sm:border-r-[3px] sm:border-black border-b-[3px] sm:border-b-0 border-black flex gap-4 items-start">
                <div className="w-12 h-12 border-[3px] border-black bg-red flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-red mb-1">Time Saved</p>
                  <p className="font-editorial text-black text-[2rem] leading-none tracking-[1px]">{p.time_saved}</p>
                </div>
              </div>
            )}
            {p.money_saved && (
              <div className="p-8 flex gap-4 items-start">
                <div className="w-12 h-12 border-[3px] border-black bg-black flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[2px] text-red mb-1">Value Generated</p>
                  <p className="font-editorial text-black text-[2rem] leading-none tracking-[1px]">{p.money_saved}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Tech Stack ─────────────────────────────────────────── */}
      {techStack.length > 0 && (
        <section className="border-b-[3px] border-black bg-white">
          <div className="px-6 sm:px-10 py-4 border-b-[3px] border-black">
            <p className="font-editorial text-black text-[1.5rem] tracking-[2px]">TECH STACK</p>
          </div>
          <div className="p-6 sm:p-10 flex flex-wrap gap-3">
            {techStack.map((item, i) => (
              <div key={i} className="border-[3px] border-black bg-white px-4 py-2">
                <p className="text-[0.85rem] font-semibold text-black">{item.tool}</p>
                <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] mt-0.5">
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="p-8 sm:p-16 border-b-[3px] border-black bg-red text-white text-center">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[3px] text-white/80 mb-4">skillIT</p>
        <h2 className="font-editorial text-white text-[3rem] sm:text-[4.5rem] leading-[0.95] tracking-[2px]">
          WANT THIS FOR YOUR BUSINESS?
        </h2>
        <p className="mt-4 text-white/85 max-w-xl mx-auto leading-relaxed">
          We build custom automation systems for companies across Pakistan and beyond. Tell us what&apos;s
          costing you time — we&apos;ll build the system that fixes it.
        </p>
        <Link href="/contact" className="btn-ed-red mt-8 inline-flex" style={{ background: '#080808', color: '#fff' }}>
          Get in Touch →
        </Link>
      </section>
    </>
  )
}
