import { notFound } from 'next/navigation'

/** Toute adresse inconnue affiche la page 404 du site. */
export default function CatchAll() {
  notFound()
}
