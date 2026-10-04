import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { CACHE_TAG } from '@/lib/sanity'

/**
 * Appelé par le webhook Sanity à chaque publication :
 * le site est mis à jour immédiatement, sans redéploiement.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ message: 'SANITY_REVALIDATE_SECRET manquant' }, { status: 500 })
  }
  try {
    const { isValidSignature } = await parseBody(request, secret)
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Signature invalide' }, { status: 401 })
    }
    revalidateTag(CACHE_TAG)
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur' }, { status: 500 })
  }
}
