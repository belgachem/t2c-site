import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, tr } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity'
import { settingsQuery, type Settings } from '@/lib/queries'
import { ContactForm } from '@/components/ContactForm'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(isLocale(locale) ? locale : 'fr')
  return { title: dict.contact.title, description: dict.contact.intro }
}

export default async function ContactRoute({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.contact
  const settings = await sanityFetch<Settings>(settingsQuery, {}, {})
  const address = tr(settings.address, locale)
  const hasDetails = address || settings.email || settings.phone || settings.linkedin

  return (
    <>
      <section className="page-head">
        <div className="container stack-md">
          <span className="mono-label">CONTACT</span>
          <h1>{t.title}</h1>
          <p className="muted lead max-640">{t.intro}</p>
        </div>
      </section>
      <section className="section-tight">
        <div className="container contact-grid">
          <ContactForm dict={dict} />
          {hasDetails && (
            <aside className="context-box">
              <span className="mono-label">{t.details}</span>
              {address && <p className="pre-line">{address}</p>}
              {settings.email && (
                <p>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </p>
              )}
              {settings.phone && (
                <p>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                </p>
              )}
              {settings.linkedin && (
                <p>
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </p>
              )}
            </aside>
          )}
        </div>
      </section>
    </>
  )
}
