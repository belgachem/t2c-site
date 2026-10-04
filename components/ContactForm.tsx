'use client'

import { useState, type FormEvent } from 'react'
import type { Dictionary } from '@/lib/i18n'

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>('idle')
  const t = dict.contact

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="form-row">
        <label>
          <span>{t.name}</span>
          <input name="name" type="text" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          <span>{t.company}</span>
          <input name="company" type="text" maxLength={120} autoComplete="organization" />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>{t.email}</span>
          <input name="email" type="email" required maxLength={160} autoComplete="email" />
        </label>
        <label>
          <span>{t.subject}</span>
          <input name="subject" type="text" maxLength={160} />
        </label>
      </div>
      <label>
        <span>{t.message}</span>
        <textarea name="message" required rows={6} maxLength={5000} />
      </label>
      {/* Champ piège anti-spam, invisible pour les humains */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>{t.consent}</span>
      </label>
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.send}
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {status === 'success' && <span className="ok">{t.success}</span>}
        {status === 'error' && <span className="err">{t.error}</span>}
      </p>
    </form>
  )
}
