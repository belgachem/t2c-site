import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-head">
      <div className="container stack-md">
        <span className="mono-label">404</span>
        <h1>Page introuvable · Page not found</h1>
        <p className="muted lead">La page demandée n’existe pas ou a été déplacée.</p>
        <div className="btn-row">
          <Link href="/fr" className="btn btn-primary">
            Retour à l’accueil
          </Link>
          <Link href="/en" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}
