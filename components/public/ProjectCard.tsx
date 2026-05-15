'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/types/app.types'
import Badge from '@/components/ui/Badge'

interface ProjectCardProps {
  project: Project
}

const GRADIENT: Record<string, string> = {
  skillit:   'from-[#0F6B7A]/50 via-[#0F6B7A]/20 to-brand-darker',
  skillsync: 'from-[#E94560]/50 via-[#E94560]/20 to-brand-darker',
}

const CATEGORY_CLASS: Record<string, string> = {
  skillit:   'text-[#7dd3da] bg-[#0F6B7A]/15 border-[#0F6B7A]/40',
  skillsync: 'text-brand-accent bg-brand-accent/10 border-brand-accent/30',
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const coverImage = project.image_urls?.[0] ?? project.cover_image
  const brandKey = (project.brand ?? 'skillsync') in GRADIENT ? (project.brand ?? 'skillsync') : 'skillsync'
  const gradientClass = GRADIENT[brandKey]
  const categoryClass = CATEGORY_CLASS[brandKey]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group flex flex-col rounded-xl border border-brand-muted/20 bg-brand-mid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow hover:border-brand-accent/50"
    >
      {/* Cover image / gradient placeholder */}
      <div className="relative h-44 bg-brand-darker overflow-hidden flex-shrink-0">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-5xl font-display font-black text-white/15 select-none">
              {project.title[0]}
            </span>
          </div>
        )}
        {project.is_ongoing && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" dot>Live</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Brand-coloured category tag */}
        {project.category && (
          <span
            className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${categoryClass}`}
          >
            {project.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-display font-semibold text-brand-light leading-snug group-hover:text-brand-accent transition-colors duration-200 line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        {project.short_description && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
            {project.short_description}
          </p>
        )}

        {/* Tech tags */}
        {project.tech_tags && project.tech_tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tech_tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-brand-dark/60 text-brand-muted border border-brand-muted/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-brand-muted/15">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-semibold text-brand-accent hover:underline transition-colors"
          >
            Case study →
          </Link>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-muted hover:text-brand-light transition-colors ml-auto"
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
