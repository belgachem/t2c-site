import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { projectSlugsQuery } from '@/lib/queries'
import { locales } from '@/lib/i18n'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch<{ slug: string; _updatedAt: string }[]>(projectSlugsQuery, {}, [])
  const pages = ['', '/projets', '/a-propos', '/contact']
  return locales.flatMap((l) => [
    ...pages.map((p) => ({ url: `${siteUrl}/${l}${p}`, changeFrequency: 'monthly' as const })),
    ...projects.map((p) => ({ url: `${siteUrl}/${l}/projets/${p.slug}`, lastModified: p._updatedAt })),
  ])
}
