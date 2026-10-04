import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, paragraphs, tr } from '@/lib/i18n'
import { imageUrl, sanityFetch } from '@/lib/sanity'
import { homeQuery, type AboutPage, type DomainRef, type HomePage, type ProjectCard as Card } from '@/lib/queries'
import { ProjectCard } from '@/components/ProjectCard'
import { DomainIcon } from '@/components/Icons'

/** Photo de test déposée dans le dossier public (innovateur.jpg / .png / .webp). */
function localPhoto(): string | null {
  for (const name of ['innovateur.jpg', 'innovateur.jpeg', 'innovateur.png', 'innovateur.webp']) {
    try {
      if (fs.existsSync(path.join(process.cwd(), 'public', name))) return `/${name}`
    } catch {
      /* ignore */
    }
  }
  return null
}

type HomeData = {
  page: HomePage | null
  featured: Card[]
  latest: Card[]
  domains: DomainRef[]
  about: AboutPage | null
}

export default async function HomePageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.home
  const data = await sanityFetch<HomeData>(homeQuery, {}, { page: null, featured: [], latest: [], domains: [], about: null })
  const page: HomePage = data.page || {}

  const heroProject = page.heroProject || data.featured[0] || data.latest[0] || null
  const showcase = (data.featured.length ? data.featured : data.latest).slice(0, 3)
  const stats = (page.stats || []).filter((s) => s.value)
  const cmsProcess = (page.process || []).filter((s) => tr(s.title, locale))
  const process = cmsProcess.length
    ? cmsProcess.map((s) => ({ key: s._key, title: tr(s.title, locale), text: tr(s.description, locale) }))
    : t.process.map((s, i) => ({ key: String(i), title: s.title, text: s.text }))
  const heroImg = heroProject ? imageUrl(heroProject.mainImage, 960, 700) : null
  // Photo : celle du tableau de bord, sinon public/innovateur.jpg (pratique pour tester)
  const innovatorImg = imageUrl(page.innovatorPhoto, 800, 640) || localPhoto()
  const innovatorMessage = tr(page.innovatorMessage, locale)
  const showInnovator = Boolean(innovatorImg || innovatorMessage)
  const about = data.about
  const founderImg = about ? imageUrl(about.founderPhoto, 760, 880) : null
  let n = 0
  const num = () => String(++n).padStart(2, '0')

  return (
    <>
      {/* ---------- BANNIÈRE ---------- */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="mono-label on-dark">{tr(page.heroEyebrow, locale) || t.eyebrow}</span>
            <h1>{tr(page.heroTitle, locale) || t.title}</h1>
            <p className="lead on-dark">{tr(page.heroText, locale) || t.text}</p>
            <div className="btn-row">
              <Link href={`/${locale}/projets`} className="btn btn-sky">
                {t.discover}
              </Link>
              <Link href={`/${locale}/contact`} className="btn btn-ghost-dark">
                {t.contactUs}
              </Link>
            </div>
          </div>
          {showInnovator ? (
            <figure className="hero-innovator">
              {innovatorImg && (
                <div className="hero-innovator-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={innovatorImg} alt={page.innovatorName || ''} />
                </div>
              )}
              {(innovatorMessage || page.innovatorName) && (
                <figcaption className="hero-innovator-card">
                  <span className="mono-label">{t.innovatorLabel}</span>
                  {tr(page.innovatorTitle, locale) && <span className="hero-innovator-title">{tr(page.innovatorTitle, locale)}</span>}
                  {innovatorMessage && (
                    <blockquote className="innovator-quote">
                      {paragraphs(innovatorMessage).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </blockquote>
                  )}
                  {page.innovatorName && (
                    <span className="hero-innovator-sign">
                      <span className="founder-name">{page.innovatorName}</span>
                      {tr(page.innovatorRole, locale) && <span className="muted small">{tr(page.innovatorRole, locale)}</span>}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>
          ) : (
            heroProject && (
              <Link href={`/${locale}/projets/${heroProject.slug}`} className="hero-card">
                <div className="hero-card-media">
                  {heroImg && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroImg} alt={heroProject.mainImage?.alt || tr(heroProject.title, locale)} />
                  )}
                  <span className="badge">{t.featured}</span>
                </div>
                <div className="hero-card-body">
                  <span className="mono-label">
                    {(heroProject.domains || []).map((d) => tr(d.title, locale)).join(' · ').toUpperCase()}
                  </span>
                  <span className="hero-card-title">{tr(heroProject.title, locale)}</span>
                  <span className="hero-card-meta">
                    <span>
                      {[heroProject.stage && dict.stage[heroProject.stage], heroProject.prototypeType && dict.projects.type[heroProject.prototypeType]]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    {heroProject.trl && <span className="mono">TRL {heroProject.trl}</span>}
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* ---------- CHIFFRES ---------- */}
      {stats.length > 0 && (
        <section className="stats" aria-label="Chiffres clés">
          <div className="container stats-inner">
            {stats.map((s) => (
              <div key={s._key} className="stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{tr(s.label, locale)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- DOMAINES ---------- */}
      {data.domains.length > 0 && (
        <section className="section bg-soft">
          <div className="container stack-lg">
            <div className="section-head">
              <div className="stack-sm">
                <span className="mono-label">
                  {num()} — {t.domainsLabel}
                </span>
                <h2>{t.domainsTitle}</h2>
              </div>
              {tr(page.domainsIntro, locale) && <p className="muted max-440">{tr(page.domainsIntro, locale)}</p>}
            </div>
            <div className="card-row">
              {data.domains.map((d) => (
                <Link key={d._id} href={`/${locale}/projets?domaine=${d.slug}`} className="domain-card">
                  <DomainIcon name={d.icon} />
                  <span className="domain-title">{tr(d.title, locale)}</span>
                  {tr(d.description, locale) && <span className="muted small">{tr(d.description, locale)}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- PROJETS ---------- */}
      <section className="section">
        <div className="container stack-lg">
          <div className="section-head">
            <div className="stack-sm">
              <span className="mono-label">
                {num()} — {t.projectsLabel}
              </span>
              <h2>{t.projectsTitle}</h2>
            </div>
          </div>
          {showcase.length > 0 ? (
            <div className="project-grid">
              {showcase.map((p) => (
                <ProjectCard key={p._id} project={p} locale={locale} dict={dict} />
              ))}
            </div>
          ) : (
            <p className="empty">{dict.projects.empty}</p>
          )}
          {showcase.length > 0 && (
            <Link href={`/${locale}/projets`} className="btn btn-outline center">
              {t.allProjects}
            </Link>
          )}
        </div>
      </section>

      {/* ---------- DÉMARCHE ---------- */}
      <section className="section bg-ink">
          <div className="container stack-lg">
            <div className="stack-sm max-680">
              <span className="mono-label on-dark">
                {num()} — {t.processLabel}
              </span>
              <h2>{t.processTitle}</h2>
            </div>
            <ol className="steps">
              {process.map((s, i) => (
                <li key={s.key} className={i === 0 ? 'is-first' : undefined}>
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-title">{s.title}</span>
                  {s.text && <span className="step-text">{s.text}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>


      {/* ---------- À PROPOS ---------- */}
      {about && (tr(about.intro, locale) || about.founderName) && (
        <section className="section">
          <div className="container about-teaser">
            {founderImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={founderImg} alt={about.founderName || ''} className="about-photo" />
            )}
            <div className="stack-md about-text">
              <span className="mono-label">
                {num()} — {t.aboutLabel}
              </span>
              {tr(about.title, locale) && <h2>{tr(about.title, locale)}</h2>}
              {tr(about.intro, locale) && <p className="muted lead-sm">{tr(about.intro, locale)}</p>}
              {about.founderName && (
                <div className="founder-line">
                  <span className="founder-name">{about.founderName}</span>
                  {tr(about.founderRole, locale) && <span className="muted">{tr(about.founderRole, locale)}</span>}
                </div>
              )}
              <Link href={`/${locale}/a-propos`} className="text-link">
                {t.aboutMore} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- APPEL À L'ACTION ---------- */}
      <section className="cta bg-soft">
        <div className="container cta-inner">
          <div className="stack-sm max-640">
            <h2>{tr(page.ctaTitle, locale) || t.ctaTitle}</h2>
            <p className="muted lead-sm">{tr(page.ctaText, locale) || t.ctaText}</p>
          </div>
          <Link href={`/${locale}/contact`} className="btn btn-primary btn-lg">
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  )
}
