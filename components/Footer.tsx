import Link from 'next/link'
import { tr, type Dictionary, type Locale } from '@/lib/i18n'
import type { Settings } from '@/lib/queries'

export function Footer({ locale, dict, settings }: { locale: Locale; dict: Dictionary; settings: Settings }) {
  const name = settings.companyName || 'T2C Engineering'
  const lab = settings.labName || 'Innovation Lab'
  const description = tr(settings.description, locale) || dict.brand.footer
  const address = tr(settings.address, locale)
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-name">
              {name.split(' ')[0].toUpperCase()} {lab.toUpperCase()}
            </span>
            <p>{description}</p>
            {settings.mainWebsite && (
              <a href={settings.mainWebsite} target="_blank" rel="noopener" className="footer-parent">
                {dict.brand.discoverParent} ↗
              </a>
            )}
          </div>
          <div className="footer-col">
            <span className="mono-label on-dark">{dict.footer.navigation}</span>
            <Link href={`/${locale}/projets`}>{dict.nav.projects}</Link>
            <Link href={`/${locale}/a-propos`}>{dict.nav.about}</Link>
            <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
          </div>
          {(address || settings.email || settings.phone || settings.linkedin) && (
            <div className="footer-col">
              <span className="mono-label on-dark">{dict.footer.contact}</span>
              {address && <span className="pre-line">{address}</span>}
              {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
              {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
        <div className="footer-bottom">
          <span>
            © {year} {name} — {lab}. {dict.footer.rights}
          </span>
          <span className="footer-legal">
            <Link href={`/${locale}/mentions-legales`}>{dict.footer.legal}</Link>
            <Link href={`/${locale}/confidentialite`}>{dict.footer.privacy}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
