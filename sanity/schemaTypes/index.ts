import { localeString, localeText } from './locale'
import { domain } from './domain'
import { project } from './project'
import { homePage, aboutPage, siteSettings } from './pages'

export const schemaTypes = [localeString, localeText, domain, project, homePage, aboutPage, siteSettings]

/** Documents uniques : on ne peut ni les dupliquer ni les supprimer. */
export const singletonTypes = new Set(['homePage', 'aboutPage', 'siteSettings'])
