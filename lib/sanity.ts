import { createClient, type QueryParams } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env'

/** Étiquette de cache commune : le webhook la vide à chaque publication. */
export const CACHE_TAG = 'sanity'

const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'published' })
  : null

/**
 * Lit des données dans Sanity. Si Sanity n'est pas encore configuré
 * ou en cas d'erreur, renvoie `fallback` pour que le site reste en ligne.
 */
export async function sanityFetch<T>(query: string, params: QueryParams, fallback: T): Promise<T> {
  if (!client) return fallback
  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: 300, tags: [CACHE_TAG] },
    })
    return (result ?? fallback) as T
  } catch (error) {
    console.error('[sanity] fetch error', error)
    return fallback
  }
}

const builder = isSanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null

export type SanityImage = { asset?: { _ref?: string; _id?: string }; alt?: string; hotspot?: unknown; crop?: unknown } | null | undefined

/** URL optimisée d'une image Sanity (largeur max, format auto). */
export function imageUrl(image: SanityImage, width: number, height?: number): string | null {
  if (!builder || !image?.asset) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let b = builder.image(image as any).width(width).auto('format').quality(82)
  if (height) b = b.height(height).fit('crop')
  return b.url()
}
