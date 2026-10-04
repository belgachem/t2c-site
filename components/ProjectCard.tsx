import Link from 'next/link'
import { tr, type Dictionary, type Locale } from '@/lib/i18n'
import type { ProjectCard as Card } from '@/lib/queries'
import { imageUrl } from '@/lib/sanity'

export function ProjectCard({ project, locale, dict }: { project: Card; locale: Locale; dict: Dictionary }) {
  const img = imageUrl(project.mainImage, 800, 520)
  const domains = (project.domains || []).map((d) => tr(d.title, locale)).filter(Boolean)
  return (
    <Link href={`/${locale}/projets/${project.slug}`} className="project-card">
      <div className="project-card-media">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={project.mainImage?.alt || tr(project.title, locale)} loading="lazy" />
        ) : (
          <span className="media-placeholder" />
        )}
      </div>
      <div className="project-card-body">
        <span className="card-meta">
          <span className="card-domains">{domains.join(' · ').toUpperCase()}</span>
          {project.year && <span>{project.year}</span>}
        </span>
        <span className="card-title">{tr(project.title, locale)}</span>
        <span className="card-text">{tr(project.tagline, locale)}</span>
        <span className="card-tags">
          {project.stage && <span className="tag tag-sky">{(dict.stage[project.stage] || '').toUpperCase()}</span>}
          {project.prototypeType && <span className="tag">{(dict.projects.type[project.prototypeType] || '').toUpperCase()}</span>}
          {project.trl && <span className="tag">TRL {project.trl}</span>}
        </span>
      </div>
    </Link>
  )
}
