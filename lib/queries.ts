import { groq } from 'next-sanity'
import type { Localized } from './i18n'
import type { SanityImage } from './sanity'

// ---------- Types ----------
export type DomainRef = { _id: string; title: Localized; slug: string; icon?: string; description?: Localized }

export type ProjectCard = {
  _id: string
  title: Localized
  tagline: Localized
  slug: string
  mainImage: SanityImage
  stage?: 'concept' | 'test' | 'prototype' | 'validated'
  prototypeType?: 'print3d' | 'final'
  trl?: number
  year?: number
  domains?: DomainRef[]
}

export type Project = ProjectCard & {
  challenge?: Localized
  solution?: Localized
  steps?: { _key: string; title: Localized; description?: Localized }[]
  keyFigures?: { _key: string; value: string; label: Localized }[]
  resultsNote?: Localized
  perspectives?: (Localized & { _key: string })[]
  context?: Localized
  specs?: { _key: string; label: Localized; value: Localized }[]
  technologies?: string[]
  safety?: (Localized & { _key: string })[]
  gallery?: (NonNullable<SanityImage> & { _key: string })[]
  videoUrl?: string
  videoFileUrl?: string
  model3dUrl?: string
  reportUrl?: string
}

export type Settings = {
  companyName?: string
  labName?: string
  mainWebsite?: string
  logo?: SanityImage
  description?: Localized
  email?: string
  phone?: string
  address?: Localized
  linkedin?: string
  legalNotice?: Localized
  privacyPolicy?: Localized
}

export type HomePage = {
  heroEyebrow?: Localized
  heroTitle?: Localized
  heroText?: Localized
  heroProject?: ProjectCard | null
  innovatorPhoto?: SanityImage
  innovatorName?: string
  innovatorRole?: Localized
  innovatorTitle?: Localized
  innovatorMessage?: Localized
  stats?: { _key: string; value?: string; label?: Localized }[]
  domainsIntro?: Localized
  process?: { _key: string; title?: Localized; description?: Localized }[]
  ctaTitle?: Localized
  ctaText?: Localized
}

export type AboutPage = {
  title?: Localized
  intro?: Localized
  body?: Localized
  values?: { _key: string; title?: Localized; description?: Localized }[]
  founderName?: string
  founderRole?: Localized
  founderPhoto?: SanityImage
  founderBio?: Localized
  founderLinkedin?: string
}

// ---------- Requêtes GROQ ----------
const cardFields = groq`
  _id, title, tagline, "slug": slug.current, mainImage, stage, prototypeType, trl, year,
  "domains": domains[]->{ _id, title, "slug": slug.current, icon }
`

export const settingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]`

export const homeQuery = groq`{
  "page": *[_type == "homePage" && _id == "homePage"][0]{ ..., "heroProject": heroProject->{ ${cardFields} } },
  "featured": *[_type == "project" && defined(slug.current) && featured == true] | order(coalesce(order, 999) asc, year desc)[0...6]{ ${cardFields} },
  "latest": *[_type == "project" && defined(slug.current)] | order(coalesce(order, 999) asc, year desc)[0...6]{ ${cardFields} },
  "domains": *[_type == "domain" && defined(slug.current)] | order(coalesce(order, 999) asc){ _id, title, "slug": slug.current, icon, description },
  "about": *[_type == "aboutPage" && _id == "aboutPage"][0]{ title, intro, founderName, founderRole, founderPhoto }
}`

export const projectsQuery = groq`{
  "projects": *[_type == "project" && defined(slug.current)
      && ($domain == "" || $domain in domains[]->slug.current)
      && ($stage == "" || stage == $stage)
    ] | order(coalesce(order, 999) asc, year desc){ ${cardFields} },
  "domains": *[_type == "domain" && defined(slug.current)] | order(coalesce(order, 999) asc){ _id, title, "slug": slug.current },
  "total": count(*[_type == "project" && defined(slug.current)])
}`

export const projectQuery = groq`{
  "project": *[_type == "project" && slug.current == $slug][0]{
    ${cardFields},
    challenge, solution, steps, keyFigures, resultsNote, perspectives, context,
    specs, technologies, safety, gallery, videoUrl,
    "videoFileUrl": videoFile.asset->url,
    "model3dUrl": model3d.asset->url,
    "reportUrl": report.asset->url
  },
  "all": *[_type == "project" && defined(slug.current)] | order(coalesce(order, 999) asc, year desc){ "slug": slug.current, title }
}`

export const projectSlugsQuery = groq`*[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`

export const aboutQuery = groq`*[_type == "aboutPage" && _id == "aboutPage"][0]`
