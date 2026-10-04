import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { getDictionary, isLocale, locales, tr } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity'
import { settingsQuery, type Settings } from '@/lib/queries'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import '../globals.css'

const archivo = Archivo({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--nf-display', display: 'swap' })
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--nf-body', display: 'swap' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--nf-mono', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = isLocale(locale) ? locale : 'fr'
  const settings = await sanityFetch<Settings>(settingsQuery, {}, {})
  const parent = settings.companyName || 'T2C Engineering'
  const name = `${parent.split(' ')[0]} ${settings.labName || 'Innovation Lab'}`
  const description = tr(settings.description, loc) || getDictionary(loc).brand.footer
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${name} — ${loc === 'fr' ? 'Essais & prototypes' : 'Tests & prototypes'} · ${parent}`, template: `%s · ${name}` },
    description,
    openGraph: { type: 'website', siteName: name, locale: loc === 'fr' ? 'fr_FR' : 'en_GB', description },
    icons: { icon: '/logo-mark.png' },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const settings = await sanityFetch<Settings>(settingsQuery, {}, {})

  return (
    <html lang={locale} className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          {locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}
        </a>
        <Header locale={locale} dict={dict} settings={settings} />
        <main id="contenu">{children}</main>
        <Footer locale={locale} dict={dict} settings={settings} />
        <CookieBanner locale={locale} dict={dict} />
      </body>
    </html>
  )
}
