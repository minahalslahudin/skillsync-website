'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/types/app.types'

const TOOL_BADGE: Record<string, string> = {
  'Make.com': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'n8n':      'bg-orange-500/15 text-orange-300 border-orange-500/30',
}
const DEFAULT_BADGE = 'bg-brand-accent/10 text-brand-accent border-brand-accent/30'

export default function ProjectCard({ project }: { project: Project }) {
  const badgeClass = project.tool ? (TOOL_BADGE[project.tool] ?? DEFAULT_BADGE) : DEFAULT_BADGE
  const initial    = project.title[0]?.toUpperCase() ?? '?'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group flex flex-col rounded-xl border border-brand-muted/20 bg-brand-mid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-[#E94560]/30"
    >
      {/* Gradient header */}
      <div className="relative h-36 bg-brand-darker overflow-hidden flex-shrink-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E94560]/20 via-[#E94560]/5 to-brand-darker" />
        <span className="relative text-8xl font-display font-black text-white/8 select-none">
          {initial}
        </span>
        {/* Tool badge */}
        {project.tool && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {project.tool}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Industry */}
        {project.industry && (
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium truncate">
            {project.industry.split(',')[0].trim()}
          </p>
        )}

        {/* Title */}
        <h3 className="text-base font-display font-semibold text-brand-light leading-snug group-hover:text-[#E94560] transition-colors duration-200 line-clamp-2">
          {project.title}
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 flex-1">
            {project.tagline}
          </p>
        )}

        {/* Impact strip */}
        {(project.time_saved || project.money_saved) && (
          <div className="rounded-lg bg-brand-darker/60 border border-brand-muted/15 px-3 py-2 space-y-0.5">
            {project.time_saved && (
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-300 font-medium">Saves:</span>{' '}
                {project.time_saved}
              </p>
            )}
            {project.money_saved && (
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-300 font-medium">Value:</span>{' '}
                {project.money_saved}
              </p>
            )}
          </div>
        )}

        {/* Builder + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-muted/15 gap-3">
          {project.builder_name ? (
            <div className="min-w-0">
              <p className="text-xs text-zinc-400 font-medium truncate">{project.builder_name}</p>
              {project.builder_role && (
                <p className="text-xs text-zinc-600 truncate">{project.builder_role}</p>
              )}
            </div>
          ) : (
            <span />
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-[#E94560]/10 text-[#E94560] border border-[#E94560]/20 hover:bg-[#E94560]/20 transition-colors"
          >
            View Case Study →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
