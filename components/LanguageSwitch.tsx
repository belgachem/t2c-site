'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`
  const rest = pathname.replace(/^\/(fr|en)(?=\/|$)/, '')
  return (
    <span className="lang-switch" aria-label="Langue / Language">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === locale ? 'true' : undefined}
          className={l === locale ? 'is-active' : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </span>
  )
}
