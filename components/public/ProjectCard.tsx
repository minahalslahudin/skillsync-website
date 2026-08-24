'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/types/app.types'

// Editorial-bold project card.
// - 3px black border + top black band with the tool badge.
// - Big title in Bebas Neue.
// - Builder name/role at bottom, separated by a thin black line.

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group flex flex-col border-[3px] border-black bg-white transition-colors duration-200 hover:bg-[color:var(--color-off-white)]"
    >
      {/* Top black strip with tool + industry */}
      <div className="bg-black text-white flex items-center justify-between px-4 py-2 border-b-[3px] border-black">
        <span className="font-editorial text-lg tracking-[2px]">
          {project.tool ?? 'AUTOMATION'}
        </span>
        {project.industry && (
          <span className="text-[0.68rem] font-semibold uppercase tracking-[2px] text-white/70 truncate max-w-[50%]">
            {project.industry.split(',')[0].trim()}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3 relative">
        <span className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[6px] bg-red transition-all duration-200" />

        {/* Title */}
        <h3 className="font-editorial text-black text-[1.8rem] leading-[1] tracking-[1px] line-clamp-2">
          {project.title}
        </h3>

        {/* Tagline */}
        {project.tagline && (
          <p className="text-[0.82rem] text-[color:var(--color-gray-dark)] leading-[1.7] line-clamp-3 flex-1">
            {project.tagline}
          </p>
        )}

        {/* Impact strip */}
        {(project.time_saved || project.money_saved) && (
          <div className="grid grid-cols-2 border-[3px] border-black">
            {project.time_saved && (
              <div className="p-3 border-r-[3px] border-black">
                <p className="text-[0.62rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)]">Saves</p>
                <p className="text-[0.85rem] font-semibold text-black leading-tight mt-0.5">{project.time_saved}</p>
              </div>
            )}
            {project.money_saved && (
              <div className={`p-3 ${!project.time_saved ? 'col-span-2' : ''}`}>
                <p className="text-[0.62rem] uppercase tracking-[2px] text-[color:var(--color-gray-mid)]">Value</p>
                <p className="text-[0.85rem] font-semibold text-black leading-tight mt-0.5">{project.money_saved}</p>
              </div>
            )}
          </div>
        )}

        {/* Builder + CTA */}
        <div className="mt-auto pt-4 border-t-[3px] border-black flex items-center justify-between gap-3">
          {project.builder_name ? (
            <div className="min-w-0">
              <p className="text-[0.78rem] font-semibold text-black truncate">{project.builder_name}</p>
              {project.builder_role && (
                <p className="text-[0.7rem] uppercase tracking-[1px] text-[color:var(--color-gray-mid)] truncate">
                  {project.builder_role}
                </p>
              )}
            </div>
          ) : <span />}
          <Link
            href={`/projects/${project.slug}`}
            className="text-[0.78rem] font-semibold uppercase tracking-[1px] text-black hover:text-red transition-colors flex-shrink-0"
          >
            Case study →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
