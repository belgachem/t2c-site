import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, paragraphs, tr, trlLabels, type Localized } from '@/lib/i18n'
import { imageUrl, sanityFetch } from '@/lib/sanity'
import { projectQuery, type Project } from '@/lib/queries'
import { ModelViewer } from '@/components/ModelViewer'
import { DownloadIcon } from '@/components/Icons'

type Params = Promise<{ locale: string; slug: string }>
type Data = { project: Project | null; all: { slug: string; title: Localized }[] }

const getData = (slug: string) => sanityFetch<Data>(projectQuery, { slug }, { project: null, all: [] })

/** Transforme un lien YouTube / Vimeo en lien d'intégration. */
function embedUrl(url?: string): string | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?dnt=1`
  return null
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {paragraphs(text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const { project } = await getData(slug)
  if (!project) return {}
  const img = imageUrl(project.mainImage, 1200, 630)
  return {
    title: tr(project.title, locale),
    description: tr(project.tagline, locale),
    alternates: { canonical: `/${locale}/projets/${slug}`, languages: { fr: `/fr/projets/${slug}`, en: `/en/projets/${slug}` } },
    openGraph: { title: tr(project.title, locale), description: tr(project.tagline, locale), images: img ? [img] : [] },
  }
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.project
  const { project: p, all } = await getData(slug)
  if (!p) notFound()

  const title = tr(p.title, locale)
  const heroImg = imageUrl(p.mainImage, 1100, 960)
  const domains = p.domains || []
  const figures = p.keyFigures || []
  const steps = (p.steps || []).filter((s) => tr(s.title, locale))
  const specs = (p.specs || []).filter((s) => tr(s.label, locale))
  const techs = p.technologies || []
  const safety = (p.safety || []).map((s) => tr(s, locale)).filter(Boolean)
  const perspectives = (p.perspectives || []).map((s) => tr(s, locale)).filter(Boolean)
  const gallery = p.gallery || []
  const video = embedUrl(p.videoUrl)
  const context = tr(p.context, locale)
  const challenge = tr(p.challenge, locale)
  const solution = tr(p.solution, locale)
  const idx = all.findIndex((x) => x.slug === slug)
  const next = all.length > 1 && idx >= 0 ? all[(idx + 1) % all.length] : null
  const hasMedia = gallery.length > 0 || video || p.videoFileUrl || p.model3dUrl

  return (
    <article>
      {/* ---------- EN-TÊTE ---------- */}
      <section className="project-head">
        <div className="container stack-lg">
          <nav aria-label="Fil d'Ariane" className="breadcrumb">
            <Link href={`/${locale}`}>{t.home}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/projets`}>{dict.nav.projects}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
          <div className="project-head-grid">
            <div className="stack-md project-head-text">
              {domains.length > 0 && (
                <div className="tag-row">
                  {domains.map((d, i) => (
                    <Link
                      key={d._id}
                      href={`/${locale}/projets?domaine=${d.slug}`}
                      className={i === 0 ? 'tag tag-solid' : 'tag tag-outline'}
                    >
                      {tr(d.title, locale).toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
              <h1>{title}</h1>
              {tr(p.tagline, locale) && <p className="lead muted">{tr(p.tagline, locale)}</p>}
              <dl className="meta-row">
                {p.stage && (
                  <div>
                    <dt>{t.stage}</dt>
                    <dd>{dict.stage[p.stage]}</dd>
                  </div>
                )}
                {p.prototypeType && (
                  <div>
                    <dt>{t.prototype}</dt>
                    <dd>{dict.projects.type[p.prototypeType]}</dd>
                  </div>
                )}
                {p.trl && (
                  <div>
                    <dt>{t.maturity}</dt>
                    <dd>TRL {p.trl}</dd>
                  </div>
                )}
                {p.year && (
                  <div>
                    <dt>{t.year}</dt>
                    <dd>{p.year}</dd>
                  </div>
                )}
              </dl>
            </div>
            {heroImg && (
              <div className="project-head-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImg} alt={p.mainImage?.alt || title} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- CHIFFRES CLÉS ---------- */}
      {figures.length > 0 && (
        <section className="section-tight">
          <div className="container stack-sm">
            <div className="figure-row">
              {figures.map((f) => (
                <div key={f._key} className="figure-card">
                  <span className="figure-value">{f.value}</span>
                  <span className="muted small">{tr(f.label, locale)}</span>
                </div>
              ))}
            </div>
            {tr(p.resultsNote, locale) && <span className="muted xsmall">{tr(p.resultsNote, locale)}</span>}
          </div>
        </section>
      )}

      {/* ---------- DÉFI / SOLUTION ---------- */}
      {(challenge || solution) && (
        <section className="section">
          <div className="container two-col">
            {challenge && (
              <div className="stack-md prose">
                <span className="mono-label">{t.challenge}</span>
                <Paragraphs text={challenge} />
              </div>
            )}
            {solution && (
              <div className="stack-md prose">
                <span className="mono-label">{t.solution}</span>
                <Paragraphs text={solution} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- FONCTIONNEMENT ---------- */}
      {steps.length > 0 && (
        <section className="section bg-ink">
          <div className="container stack-lg">
            <span className="mono-label on-dark">{t.howItWorks}</span>
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={s._key} className={i === 0 ? 'is-first' : undefined}>
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="step-title">{tr(s.title, locale)}</span>
                  {tr(s.description, locale) && <span className="step-text">{tr(s.description, locale)}</span>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- TECHNIQUE ---------- */}
      {(specs.length > 0 || techs.length > 0 || p.trl || safety.length > 0) && (
        <section className="section">
          <div className="container two-col">
            {specs.length > 0 && (
              <div className="stack-md">
                <span className="mono-label">{t.specs}</span>
                <table className="spec-table">
                  <tbody>
                    {specs.map((s) => (
                      <tr key={s._key}>
                        <th scope="row">{tr(s.label, locale)}</th>
                        <td>{tr(s.value, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="stack-lg">
              {techs.length > 0 && (
                <div className="stack-sm">
                  <span className="mono-label">{t.technologies}</span>
                  <div className="tag-row">
                    {techs.map((tech) => (
                      <span key={tech} className="tech">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {p.trl && (
                <div className="stack-sm">
                  <span className="mono-label">{t.maturityLevel}</span>
                  <div className="trl-bar" role="img" aria-label={`TRL ${p.trl} / 9`}>
                    {Array.from({ length: 9 }, (_, i) => (
                      <span key={i} className={i + 1 < p.trl! ? 'on' : i + 1 === p.trl ? 'current' : undefined} />
                    ))}
                  </div>
                  <span className="trl-caption">
                    <span>
                      <strong>TRL {p.trl}</strong> — {trlLabels[locale][p.trl]}
                    </span>
                    <span className="mono">{p.trl} / 9</span>
                  </span>
                </div>
              )}
              {safety.length > 0 && (
                <div className="stack-sm">
                  <span className="mono-label">{t.safety}</span>
                  <ul className="bullets">
                    {safety.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------- GALERIE ---------- */}
      {hasMedia && (
        <section className="section bg-soft">
          <div className="container stack-lg">
            <div className="stack-sm">
              <span className="mono-label">{t.gallery}</span>
              <h2>{t.galleryTitle}</h2>
            </div>
            {gallery.length > 0 && (
              <div className="gallery">
                {gallery.map((g) => {
                  const src = imageUrl(g, 1400)
                  return src ? (
                    <a key={g._key} href={src} target="_blank" rel="noopener noreferrer" className="gallery-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl(g, 900, 640) || src} alt={g.alt || title} loading="lazy" />
                    </a>
                  ) : null
                })}
              </div>
            )}
            {(video || p.videoFileUrl || p.model3dUrl) && (
              <div className="media-row">
                {(video || p.videoFileUrl) && (
                  <div className="media-box">
                    <span className="mono-label">{t.video.toUpperCase()}</span>
                    <div className="ratio">
                      {video ? (
                        <iframe
                          src={video}
                          title={`${t.video} — ${title}`}
                          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <video src={p.videoFileUrl} controls preload="metadata" />
                      )}
                    </div>
                  </div>
                )}
                {p.model3dUrl && (
                  <div className="media-box">
                    <span className="mono-label">{t.model3d.toUpperCase()}</span>
                    <div className="ratio">
                      <ModelViewer src={p.model3dUrl} alt={title} />
                    </div>
                    <span className="muted xsmall">{t.model3dHint}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- PERSPECTIVES + CONTEXTE ---------- */}
      {(perspectives.length > 0 || context || p.reportUrl) && (
        <section className="section">
          <div className="container two-col">
            {perspectives.length > 0 ? (
              <div className="stack-md">
                <span className="mono-label">{t.perspectives}</span>
                <h2 className="h3">{t.perspectivesTitle}</h2>
                <ul className="bullets lg">
                  {perspectives.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div />
            )}
            {(context || p.reportUrl) && (
              <aside className="context-box">
                {context && (
                  <>
                    <span className="mono-label">{t.context}</span>
                    <Paragraphs text={context} />
                  </>
                )}
                {p.reportUrl && (
                  <a href={`${p.reportUrl}?dl=`} className="btn btn-primary btn-block">
                    <DownloadIcon /> {t.report}
                  </a>
                )}
              </aside>
            )}
          </div>
        </section>
      )}

      {/* ---------- NAVIGATION ---------- */}
      <nav className="project-nav" aria-label="Projets">
        <div className="container project-nav-inner">
          <Link href={`/${locale}/projets`}>
            <span className="mono-label muted-label">{t.back}</span>
            <span className="nav-title">{t.backTitle}</span>
          </Link>
          {next && next.slug !== slug && (
            <Link href={`/${locale}/projets/${next.slug}`} className="align-end">
              <span className="mono-label muted-label">{t.next}</span>
              <span className="nav-title">{tr(next.title, locale)}</span>
            </Link>
          )}
        </div>
      </nav>

      {/* ---------- APPEL À L'ACTION ---------- */}
      <section className="cta bg-navy">
        <div className="container cta-inner">
          <div className="stack-sm max-640">
            <h2>{t.ctaTitle}</h2>
            <p className="lead-sm on-dark-muted">{t.ctaText}</p>
          </div>
          <Link href={`/${locale}/contact`} className="btn btn-sky btn-lg">
            {dict.home.ctaButton}
          </Link>
        </div>
      </section>
    </article>
  )
}
