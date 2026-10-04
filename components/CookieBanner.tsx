'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Dictionary, Locale } from '@/lib/i18n'

const KEY = 'c2s-cookie-notice'

export function CookieBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const accept = () => {
    try {
      window.localStorage.setItem(KEY, '1')
    } catch {
      /* stockage indisponible : on masque simplement */
    }
    setVisible(false)
  }

  return (
    <div className="cookie-banner" role="region" aria-label="Cookies">
      <p>
        {dict.cookies.text} <Link href={`/${locale}/confidentialite`}>{dict.cookies.more}</Link>
      </p>
      <button type="button" className="btn btn-primary btn-sm" onClick={accept}>
        {dict.cookies.ok}
      </button>
    </div>
  )
}
