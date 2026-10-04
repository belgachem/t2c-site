import Link from 'next/link'
import type { Locale, Dictionary } from '@/lib/i18n'
import type { Settings } from '@/lib/queries'
import { imageUrl } from '@/lib/sanity'
import { LanguageSwitch } from './LanguageSwitch'
import { MenuIcon } from './Icons'

export function Header({ locale, dict, settings }: { locale: Locale; dict: Dictionary; settings: Settings }) {
  const logo = imageUrl(settings.logo, 160) || '/logo-mark.png'
  const name = settings.companyName || 'C2S Engineering'
  const lab = settings.labName || 'Innovation Lab'
  const links = [
    { href: `/${locale}/projets`, label: dict.nav.projects },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ]
  return (
    <header className="site-header">
      <div className="parent-strip">
        <div className="container parent-strip-inner">
          <span>
            {name.split(' ')[0]} {lab} — {dict.brand.strip} <strong>{name}</strong>
          </span>
          {settings.mainWebsite && (
            <a href={settings.mainWebsite} target="_blank" rel="noopener">
              {dict.brand.mainSite} ↗
            </a>
          )}
        </div>
      </div>
      <div className="container header-inner">
        <Link href={`/${locale}`} className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={34} height={40} className="brand-mark" />
          <span className="brand-text">
            <span className="brand-name">{name.toUpperCase()}</span>
            <span className="brand-slogan">{lab.toUpperCase()}</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Navigation principale">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <LanguageSwitch locale={locale} />
          <Link href={`/${locale}/contact`} className="btn btn-primary btn-sm">
            {dict.nav.propose}
          </Link>
        </nav>

        <details className="nav-mobile">
          <summary aria-label={dict.nav.menu}>
            <MenuIcon />
          </summary>
          <nav aria-label="Navigation mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
            <LanguageSwitch locale={locale} />
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              {dict.nav.propose}
            </Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
