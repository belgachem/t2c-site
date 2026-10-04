import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, paragraphs, tr } from '@/lib/i18n'
import { imageUrl, sanityFetch } from '@/lib/sanity'
import { aboutQuery, type AboutPage } from '@/lib/queries'
import { LinkedinIcon } from '@/components/Icons'

type Params = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(isLocale(locale) ? locale : 'fr')
  return { title: dict.about.title }
}

export default async function AboutRoute({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.about
  const about = await sanityFetch<AboutPage | null>(aboutQuery, {}, null)
  const title = (about && tr(about.title, locale)) || t.title
  const intro = about ? tr(about.intro, locale) : ''
  const body = about ? tr(about.body, locale) : ''
  const values = (about?.values || []).filter((v) => tr(v.title, locale))
  const photo = about ? imageUrl(about.founderPhoto, 760, 900) : null
  const bio = about ? tr(about.founderBio, locale) : ''
  const isEmpty = !intro && !body && !about?.founderName

  return (
    <>
      <section className="page-head">
        <div className="container stack-md">
          <span className="mono-label">{dict.home.aboutLabel}</span>
          <h1>{title}</h1>
          {intro && <p className="muted lead max-760">{intro}</p>}
        </div>
      </section>

      {isEmpty && (
        <section className="section-tight">
          <div className="container">
            <p className="empty">{t.empty}</p>
          </div>
        </section>
      )}

      {body && (
        <section className="section-tight">
          <div className="container prose max-760">
            {paragraphs(body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className="section bg-soft">
          <div className="container stack-lg">
            <span className="mono-label">{t.values}</span>
            <div className="card-row">
              {values.map((v) => (
                <div key={v._key} className="domain-card static">
                  <span className="domain-title">{tr(v.title, locale)}</span>
                  {tr(v.description, locale) && <span className="muted small">{tr(v.description, locale)}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {about?.founderName && (
        <section className="section">
          <div className="container about-teaser">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={about.founderName} className="about-photo" />
            )}
            <div className="stack-md about-text">
              <span className="mono-label">{t.founder}</span>
              <h2>{about.founderName}</h2>
              {tr(about.founderRole, locale) && <p className="muted">{tr(about.founderRole, locale)}</p>}
              {bio && (
                <div className="prose">
                  {paragraphs(bio).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
              {about.founderLinkedin && (
                <a href={about.founderLinkedin} target="_blank" rel="noopener noreferrer" className="text-link inline-icon">
                  <LinkedinIcon /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
