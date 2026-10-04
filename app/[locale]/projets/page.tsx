import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, isLocale, tr } from '@/lib/i18n'
import { sanityFetch } from '@/lib/sanity'
import { projectsQuery, type DomainRef, type ProjectCard as Card } from '@/lib/queries'
import { ProjectCard } from '@/components/ProjectCard'

type Params = Promise<{ locale: string }>
type Search = Promise<{ domaine?: string; stade?: string }>

const STAGES = ['concept', 'test', 'prototype', 'validated'] as const

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(isLocale(locale) ? locale : 'fr')
  return { title: dict.projects.title, description: dict.projects.intro }
}

export default async function ProjectsPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.projects
  const sp = await searchParams
  const domain = typeof sp.domaine === 'string' ? sp.domaine : ''
  const stage = STAGES.find((s) => s === sp.stade) || ''

  const data = await sanityFetch<{ projects: Card[]; domains: DomainRef[]; total: number }>(
    projectsQuery,
    { domain, stage },
    { projects: [], domains: [], total: 0 },
  )

  const href = (next: { domaine?: string; stade?: string }) => {
    const q = new URLSearchParams()
    const d = next.domaine ?? domain
    const st = next.stade ?? stage
    if (d) q.set('domaine', d)
    if (st) q.set('stade', st)
    const s = q.toString()
    return `/${locale}/projets${s ? `?${s}` : ''}`
  }

  return (
    <>
      <section className="page-head">
        <div className="container stack-md">
          <span className="mono-label">{dict.home.projectsLabel}</span>
          <h1>{t.title}</h1>
          <p className="muted lead-sm max-640">{t.intro}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container stack-lg">
          {data.total > 0 && (
            <div className="filters" aria-label="Filtres">
              <div className="chip-row">
                <Link href={href({ domaine: '' })} className={`chip${!domain ? ' is-active' : ''}`}>
                  {t.all}
                </Link>
                {data.domains.map((d) => (
                  <Link key={d._id} href={href({ domaine: d.slug })} className={`chip${domain === d.slug ? ' is-active' : ''}`}>
                    {tr(d.title, locale)}
                  </Link>
                ))}
              </div>
              <div className="chip-row">
                <Link href={href({ stade: '' })} className={`chip chip-sm${!stage ? ' is-active' : ''}`}>
                  {t.allStages}
                </Link>
                {STAGES.map((s) => (
                  <Link key={s} href={href({ stade: s })} className={`chip chip-sm${stage === s ? ' is-active' : ''}`}>
                    {dict.stage[s]}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data.projects.length > 0 ? (
            <div className="project-grid">
              {data.projects.map((p) => (
                <ProjectCard key={p._id} project={p} locale={locale} dict={dict} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>{data.total > 0 ? t.emptyFilter : t.empty}</p>
              {data.total > 0 && (
                <Link href={`/${locale}/projets`} className="text-link">
                  {t.reset}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
