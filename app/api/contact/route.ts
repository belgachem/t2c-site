import { NextResponse, type NextRequest } from 'next/server'

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Reçoit le formulaire de contact et l'envoie par email (Resend). */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  // Champ piège : rempli uniquement par les robots
  if (clean(body.website, 200)) return NextResponse.json({ ok: true })

  const name = clean(body.name, 120)
  const company = clean(body.company, 120)
  const email = clean(body.email, 160)
  const subject = clean(body.subject, 160)
  const message = clean(body.message, 5000)

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !body.consent) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  const from = process.env.CONTACT_FROM || 'T2C Engineering <onboarding@resend.dev>'
  if (!apiKey || !to) {
    console.error('[contact] RESEND_API_KEY ou CONTACT_TO manquant')
    return NextResponse.json({ ok: false, error: 'not-configured' }, { status: 500 })
  }

  const html = `
    <h2>Nouveau message depuis le site</h2>
    <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
    ${company ? `<p><strong>Société :</strong> ${escapeHtml(company)}</p>` : ''}
    <p><strong>Email :</strong> ${escapeHtml(email)}</p>
    ${subject ? `<p><strong>Objet :</strong> ${escapeHtml(subject)}</p>` : ''}
    <p style="white-space:pre-line">${escapeHtml(message)}</p>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `[Site web] ${subject || 'Nouveau contact'} — ${name}`,
      html,
    }),
  })

  if (!res.ok) {
    console.error('[contact] Resend error', res.status, await res.text())
    return NextResponse.json({ ok: false }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
