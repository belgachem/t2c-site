import { NextResponse, type NextRequest } from 'next/server'

const locales = ['fr', 'en']

/** Redirige les adresses sans langue vers /fr (ou /en si le navigateur est en anglais). */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  if (hasLocale) return NextResponse.next()

  const accept = (request.headers.get('accept-language') || '').toLowerCase()
  const locale = accept.startsWith('en') ? 'en' : 'fr'

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Tout sauf : tableau de bord, API, fichiers internes Next.js et fichiers statiques
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
