import { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://skillsync.pk'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient()

  const [{ data: workshops }, { data: projects }] = await Promise.all([
    supabase
      .from('workshops')
      .select('slug, updated_at')
      .eq('is_published', true),
    supabase
      .from('projects')
      .select('slug, updated_at')
      .eq('is_published', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${siteUrl}/workshops`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${siteUrl}/projects`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${siteUrl}/events`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${siteUrl}/reviews`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${siteUrl}/apply`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/contact`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const workshopRoutes: MetadataRoute.Sitemap = (workshops ?? []).map((w) => ({
    url: `${siteUrl}/workshops/${w.slug}`,
    lastModified: w.updated_at ? new Date(w.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...workshopRoutes, ...projectRoutes]
}
