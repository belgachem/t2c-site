// Variables d'environnement Sanity, partagées par le site et le tableau de bord.
// Identifiant public du projet Sanity (peut aussi être défini dans .env.local)
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h8fplxcj'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2025-02-19'

/** Vrai quand le projet Sanity est configuré (.env.local / Vercel). */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId)
