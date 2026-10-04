import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, tr } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity'
import { settingsQuery, type Settings } from '@/lib/queries'
import { LegalPage } from '@/components/LegalPage'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  return { title: getDictionary(isLocale(locale) ? locale : 'fr').legal.privacyTitle, robots: { index: false } }
}

export default async function PrivacyRoute({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const settings = await sanityFetch<Settings>(settingsQuery, {}, {})
  return <LegalPage title={dict.legal.privacyTitle} text={tr(settings.privacyPolicy, locale)} empty={dict.legal.empty} />
}
