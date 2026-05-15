import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjectBySlug } from '@/lib/supabase/queries/projects'
import { formatDate } from '@/lib/utils/formatDate'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} | skillIT Projects`,
    description: project.short_description ?? project.description,
    openGraph: {
      images: project.cover_image ? [project.cover_image] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()

  const coverImage = project.image_urls?.[0] ?? project.cover_image
  const brandLabel = project.brand === 'skillit' ? 'skillIT' : 'skillSYNC'
  const brandColor = project.brand === 'skillit' ? 'text-[#7dd3da]' : 'text-brand-accent'

  const stats = [
    {
      label: 'Status',
      value: project.is_ongoing ? 'Live' : 'Completed',
      color: project.is_ongoing ? 'text-green-400' : 'text-brand-muted',
    },
    {
      label: 'Brand',
      value: brandLabel,
      color: brandColor,
    },
    {
      label: 'Tech Stack',
      value: `${project.tech_tags?.length ?? 0} tools`,
      color: 'text-brand-light',
    },
    {
      label: 'Published',
      value: formatDate(project.created_at),
      color: 'text-brand-light',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-light transition-colors mb-8"
      >
        ← Back to projects
      </Link>

      {/* Hero image */}
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={project.title}
          className="w-full h-72 object-cover rounded-2xl mb-10"
        />
      )}

      {/* Category + status */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        {project.category && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
            project.brand === 'skillit'
              ? 'text-[#7dd3da] bg-[#0F6B7A]/15 border-[#0F6B7A]/40'
              : 'text-brand-accent bg-brand-accent/10 border-brand-accent/30'
          }`}>
            {project.category}
          </span>
        )}
        {project.is_ongoing && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-medium">
            Live
          </span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-light">
        {project.title}
      </h1>

      {project.short_description && (
        <p className="mt-3 text-lg text-gray-400 leading-relaxed">
          {project.short_description}
        </p>
      )}

      {/* Tech stack */}
      {project.tech_tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {project.tech_tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-brand-mid border border-brand-muted/20 text-brand-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex items-center gap-4 mt-6">
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-accent text-white text-sm font-semibold hover:bg-brand-accent/90 transition-colors"
          >
            Live site ↗
          </a>
        )}
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-brand-muted/30 text-brand-light text-sm font-semibold hover:border-brand-accent/50 transition-colors"
          >
            View code ↗
          </a>
        )}
      </div>

      {/* Outcome stats cards */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-brand-muted/20 bg-brand-mid p-4 text-center"
          >
            <p className={`text-lg font-display font-bold ${color}`}>{value}</p>
            <p className="text-xs text-brand-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Content body */}
      {project.content && (
        <div
          className="mt-12 prose prose-invert prose-sm max-w-none text-gray-400"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      )}

      {!project.content && project.description && (
        <div className="mt-12">
          {project.description.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-400 leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
