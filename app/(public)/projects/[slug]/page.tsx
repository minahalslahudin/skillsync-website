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

// ── Feature icon keyword mapping ────────────────────────────────────────────
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

const TOOL_BADGE: Record<string, string> = {
  'Make.com': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'n8n':      'bg-orange-500/15 text-orange-300 border-orange-500/30',
}

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('projects')
    .select('title, tagline, short_description, cover_image')
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

export default async function ProjectDetailPage({ params }: Props) {
  const admin = createAdminClient()
  const { data: project } = await admin
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!project) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p           = project as unknown as Project
  const howItWorks  = (p.how_it_works  as { title: string; description: string }[] | null) ?? []
  const keyFeatures = (p.key_features  as { title: string; description: string }[] | null) ?? []
  const results     = (p.results       as string[]                                | null) ?? []
  const techStack   = (p.tech_stack    as { tool: string;  role: string }[]      | null) ?? []
  const toolClass   = p.tool ? (TOOL_BADGE[p.tool] ?? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30') : ''

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-darker border-b border-brand-muted/10">
        {/* Decorative radial glow */}
        <div className="pointer-events-none absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-[#E94560]/6 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-[#E94560]/4 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pb-20">
          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to projects
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {p.tool && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${toolClass}`}>
                Built with {p.tool}
              </span>
            )}
            {p.industry && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full border border-brand-muted/25 bg-brand-mid/60 text-zinc-400">
                {p.industry.split(',')[0].trim()}
              </span>
            )}
            {p.project_type && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[#E94560]/30 bg-[#E94560]/8 text-[#E94560]">
                {p.project_type}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-brand-light leading-[1.08] tracking-tight">
            {p.title}
          </h1>

          {/* Tagline */}
          {p.tagline && (
            <p className="mt-5 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl">
              {p.tagline}
            </p>
          )}

          {/* Builder credit */}
          {p.builder_name && (
            <div className="mt-8 flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-brand-muted/20 bg-brand-mid/50 w-fit max-w-full">
              <div className="w-8 h-8 rounded-full bg-[#E94560]/15 border border-[#E94560]/30 flex items-center justify-center text-sm font-bold text-[#E94560] flex-shrink-0 select-none">
                {p.builder_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-zinc-400 truncate">
                  Built by{' '}
                  <span className="font-semibold text-zinc-200">{p.builder_name}</span>
                </p>
                {p.builder_role && (
                  <p className="text-xs text-zinc-500 truncate">{p.builder_role}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          THE PROBLEM
      ══════════════════════════════════════════════════════ */}
      {p.problem_statement && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-brand-muted/10">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-5">
            The Problem
          </p>
          <div className="relative rounded-xl border border-red-500/20 bg-red-500/[0.04] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#E94560] via-[#E94560]/70 to-[#E94560]/20 rounded-l-xl" />
            <p className="pl-7 pr-6 py-6 text-base sm:text-lg text-zinc-300 leading-relaxed">
              {p.problem_statement}
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — vertical timeline
      ══════════════════════════════════════════════════════ */}
      {howItWorks.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-brand-muted/10">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-10">
            How It Works
          </p>
          <div>
            {howItWorks.map((step, i) => (
              <div key={i} className="flex gap-5">
                {/* Circle + connecting line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#E94560]/10 border-2 border-[#E94560]/40 flex items-center justify-center text-sm font-bold text-[#E94560]">
                    {i + 1}
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-[#E94560]/35 to-transparent min-h-8 my-1.5" />
                  )}
                </div>
                {/* Content */}
                <div className={`pt-2 min-w-0 flex-1 ${i < howItWorks.length - 1 ? 'pb-8' : 'pb-0'}`}>
                  <h3 className="font-semibold text-zinc-100 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          KEY FEATURES — icon grid
      ══════════════════════════════════════════════════════ */}
      {keyFeatures.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-brand-muted/10">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-8">
            Key Features
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyFeatures.map((feat, i) => {
              const Icon = getFeatureIcon(feat.title)
              return (
                <div
                  key={i}
                  className="group rounded-xl border border-brand-muted/20 bg-brand-mid/50 p-5 hover:border-[#E94560]/30 hover:bg-[#E94560]/[0.04] transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E94560]/10 border border-[#E94560]/20 flex items-center justify-center mb-3.5 group-hover:bg-[#E94560]/15 transition-colors">
                    <Icon className="w-4 h-4 text-[#E94560]" />
                  </div>
                  <h3 className="font-semibold text-zinc-100 mb-1.5 leading-snug">{feat.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          RESULTS & IMPACT — full-width accent section
      ══════════════════════════════════════════════════════ */}
      {results.length > 0 && (
        <section className="bg-brand-darker/60 border-y border-brand-muted/10 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-8">
              Results & Impact
            </p>
            <ul className="space-y-4">
              {results.map((result, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <span className="text-base text-zinc-300 leading-relaxed">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          TIME & MONEY SAVED
      ══════════════════════════════════════════════════════ */}
      {(p.time_saved || p.money_saved) && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-brand-muted/10">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-8">
            Time & Money Saved
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {p.time_saved && (
              <div className="rounded-xl border border-brand-muted/20 bg-brand-mid/50 p-6 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-[#E94560]/10 border border-[#E94560]/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#E94560]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Time Saved</p>
                  <p className="text-xl font-display font-bold text-brand-light leading-snug">{p.time_saved}</p>
                </div>
              </div>
            )}
            {p.money_saved && (
              <div className="rounded-xl border border-brand-muted/20 bg-brand-mid/50 p-6 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Value Generated</p>
                  <p className="text-xl font-display font-bold text-brand-light leading-snug">{p.money_saved}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TECH STACK — pill tags
      ══════════════════════════════════════════════════════ */}
      {techStack.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-brand-muted/10">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-8">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-3">
            {techStack.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-brand-muted/20 bg-brand-mid/50 px-4 py-3 hover:border-[#E94560]/25 transition-colors"
              >
                <p className="text-sm font-semibold text-zinc-200">{item.tool}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <section className="border-t border-[#E94560]/15 bg-gradient-to-b from-[#E94560]/[0.06] to-transparent py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-[#E94560] uppercase tracking-[0.2em] mb-4">skillIT</p>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-light mb-4 leading-tight">
            Want this built for your business?
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed max-w-lg mx-auto">
            We build custom automation systems for companies across Pakistan and beyond. Tell us what&apos;s costing you time — we&apos;ll build the system that fixes it.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 rounded-lg bg-[#E94560] text-white font-semibold text-sm hover:bg-[#E94560]/90 transition-colors"
          >
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  )
}
