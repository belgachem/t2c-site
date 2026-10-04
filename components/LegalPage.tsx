import { paragraphs } from '@/lib/i18n'

export function LegalPage({ title, text, empty }: { title: string; text: string; empty: string }) {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>{title}</h1>
        </div>
      </section>
      <section className="section-tight">
        <div className="container prose max-760">
          {text ? paragraphs(text).map((p, i) => <p key={i}>{p}</p>) : <p className="empty">{empty}</p>}
        </div>
      </section>
    </>
  )
}
