export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export type Localized = { fr?: string; en?: string } | null | undefined

/** Renvoie la traduction demandée, sinon le français. */
export function tr(value: Localized, locale: Locale): string {
  if (!value) return ''
  return (value[locale] || value.fr || value.en || '').trim()
}

/** Découpe un texte en paragraphes (lignes vides). */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export const trlLabels: Record<Locale, string[]> = {
  fr: [
    '',
    'Principes de base observés',
    'Concept technologique formulé',
    'Preuve de concept expérimentale',
    'Validé en laboratoire',
    'Validé en environnement représentatif',
    'Démontré en environnement représentatif',
    'Démontré en environnement opérationnel',
    'Système complet et qualifié',
    'Éprouvé en conditions réelles',
  ],
  en: [
    '',
    'Basic principles observed',
    'Technology concept formulated',
    'Experimental proof of concept',
    'Validated in the lab',
    'Validated in a relevant environment',
    'Demonstrated in a relevant environment',
    'Demonstrated in an operational environment',
    'System complete and qualified',
    'Proven in operational conditions',
  ],
}

const fr = {
  brand: {
    strip: 'la branche innovation de',
    mainSite: 'Ingénierie & machines spéciales : site principal',
    footer: 'La branche innovation de C2S Engineering : essais, prototypes et démonstrateurs.',
    discoverParent: 'Découvrir C2S Engineering',
  },
  stage: { concept: 'Concept', test: 'En essai', prototype: 'Prototype testé', validated: 'Validé' } as Record<string, string>,
  nav: { projects: 'Projets', about: 'Le Lab', contact: 'Contact', propose: 'Proposer une idée', menu: 'Menu' },
  home: {
    eyebrow: 'C2S ENGINEERING · INNOVATION LAB',
    title: "Tester les idées. Prototyper l'avenir.",
    text: "C2S Innovation Lab est la branche innovation de C2S Engineering. Nous y explorons de nouvelles idées en robotique, santé et industrie, et les mettons à l'épreuve par des essais et des prototypes — de l'impression 3D au démonstrateur fonctionnel.",
    discover: 'Voir nos prototypes',
    contactUs: 'Proposer une idée',
    featured: 'PROJET À LA UNE',
    innovatorLabel: "LE MOT DE L'INNOVATEUR",
    domainsLabel: 'DOMAINES',
    domainsTitle: 'Là où nous innovons',
    projectsLabel: 'PROTOTYPES & ESSAIS',
    projectsTitle: 'Projets du Lab',
    allProjects: 'Voir tous les projets',
    processLabel: 'DÉMARCHE',
    processTitle: 'Du concept au prototype validé',
    process: [
      { title: 'Idée & concept', text: 'Identifier un besoin, imaginer une réponse, la modéliser en CAO.' },
      { title: 'Essais & tests', text: 'Tester rapidement les principes clés : capteurs, mécanismes, algorithmes.' },
      { title: 'Prototype', text: "Impression 3D et intégration électronique d'un démonstrateur fonctionnel." },
      { title: 'Validation & transfert', text: 'Mesurer les résultats, puis industrialiser avec C2S Engineering.' },
    ],
    aboutLabel: 'LE LAB',
    aboutMore: 'En savoir plus sur le Lab',
    ctaTitle: "Une idée à mettre à l'épreuve ?",
    ctaText: 'Partenaire, client ou chercheur : testons-la ensemble, du premier essai au prototype.',
    ctaButton: 'Proposer une idée',
  },
  projects: {
    title: 'Projets du Lab',
    intro: "Concepts, essais et prototypes menés par C2S Innovation Lab, la branche innovation de C2S Engineering.",
    all: 'Tous',
    allStages: 'Tous les stades',
    empty: 'Les projets seront bientôt publiés.',
    emptyFilter: 'Aucun projet ne correspond à ces filtres.',
    reset: 'Réinitialiser les filtres',
    type: { print3d: 'Impression 3D', final: 'Réalisation finale' } as Record<string, string>,
    domain: 'Domaine',
  },
  project: {
    home: 'Accueil',
    stage: 'STADE',
    prototype: 'PROTOTYPE',
    maturity: 'MATURITÉ',
    year: 'ANNÉE',
    challenge: 'LE DÉFI',
    solution: 'NOTRE SOLUTION',
    howItWorks: 'FONCTIONNEMENT',
    specs: 'CARACTÉRISTIQUES TECHNIQUES',
    technologies: 'TECHNOLOGIES',
    maturityLevel: 'NIVEAU DE MATURITÉ',
    safety: 'SÉCURITÉ',
    gallery: 'GALERIE',
    galleryTitle: 'Le projet en images',
    model3d: 'Modèle 3D interactif',
    model3dHint: 'Faites glisser pour faire pivoter · molette pour zoomer',
    video: 'Vidéo',
    perspectives: 'PERSPECTIVES',
    perspectivesTitle: 'Prochaines évolutions',
    context: 'CONTEXTE',
    report: 'Télécharger le rapport (PDF)',
    back: '← TOUS LES PROJETS',
    backTitle: 'Retour au portfolio',
    next: 'PROJET SUIVANT →',
    ctaTitle: 'Ce prototype vous intéresse ?',
    ctaText: 'Partenariat, essais complémentaires ou industrialisation avec C2S Engineering : échangeons.',
  },
  about: { title: 'Le Lab', founder: 'LE FONDATEUR', values: 'NOS ENGAGEMENTS', empty: 'Cette page sera bientôt complétée.' },
  contact: {
    title: 'Contact',
    intro: 'Une idée à tester, un partenariat, une question ? Écrivez-nous, nous vous répondons rapidement.',
    name: 'Nom complet',
    company: 'Société (facultatif)',
    email: 'Email professionnel',
    subject: 'Objet',
    message: 'Votre message',
    consent: "J'accepte que mes données soient utilisées pour répondre à ma demande.",
    send: 'Envoyer le message',
    sending: 'Envoi en cours…',
    success: 'Merci ! Votre message a bien été envoyé.',
    error: "L'envoi a échoué. Merci de réessayer ou de nous écrire directement par email.",
    details: 'COORDONNÉES',
  },
  footer: { navigation: 'NAVIGATION', contact: 'CONTACT', rights: 'Tous droits réservés.', legal: 'Mentions légales', privacy: 'Confidentialité' },
  cookies: {
    text: "Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement. Aucune donnée n'est utilisée à des fins publicitaires.",
    ok: "J'ai compris",
    more: 'En savoir plus',
  },
  legal: { legalTitle: 'Mentions légales', privacyTitle: 'Politique de confidentialité', empty: 'Contenu à compléter depuis le tableau de bord.' },
  notFound: { title: 'Page introuvable', text: "La page demandée n'existe pas ou a été déplacée.", back: "Retour à l'accueil" },
}

export type Dictionary = typeof fr

const en: Dictionary = {
  brand: {
    strip: 'the innovation branch of',
    mainSite: 'Engineering & special machines: main website',
    footer: 'The innovation branch of C2S Engineering: tests, prototypes and demonstrators.',
    discoverParent: 'Discover C2S Engineering',
  },
  stage: { concept: 'Concept', test: 'Testing', prototype: 'Tested prototype', validated: 'Validated' },
  nav: { projects: 'Projects', about: 'The Lab', contact: 'Contact', propose: 'Submit an idea', menu: 'Menu' },
  home: {
    eyebrow: 'C2S ENGINEERING · INNOVATION LAB',
    title: 'Testing ideas. Prototyping the future.',
    text: 'C2S Innovation Lab is the innovation branch of C2S Engineering. We explore new ideas in robotics, healthcare and industry, and put them to the test through experiments and prototypes — from 3D printing to working demonstrators.',
    discover: 'See our prototypes',
    contactUs: 'Submit an idea',
    featured: 'FEATURED PROJECT',
    innovatorLabel: 'A WORD FROM THE INNOVATOR',
    domainsLabel: 'FIELDS',
    domainsTitle: 'Where we innovate',
    projectsLabel: 'PROTOTYPES & TESTS',
    projectsTitle: 'Lab projects',
    allProjects: 'View all projects',
    processLabel: 'APPROACH',
    processTitle: 'From concept to validated prototype',
    process: [
      { title: 'Idea & concept', text: 'Identify a need, imagine an answer, model it in CAD.' },
      { title: 'Tests & trials', text: 'Quickly test the key principles: sensors, mechanisms, algorithms.' },
      { title: 'Prototype', text: '3D printing and electronics integration of a working demonstrator.' },
      { title: 'Validation & transfer', text: 'Measure results, then industrialise with C2S Engineering.' },
    ],
    aboutLabel: 'THE LAB',
    aboutMore: 'Learn more about the Lab',
    ctaTitle: 'An idea worth testing?',
    ctaText: "Partner, client or researcher: let's test it together, from first trial to prototype.",
    ctaButton: 'Submit an idea',
  },
  projects: {
    title: 'Lab projects',
    intro: 'Concepts, tests and prototypes led by C2S Innovation Lab, the innovation branch of C2S Engineering.',
    all: 'All',
    allStages: 'All stages',
    empty: 'Projects will be published soon.',
    emptyFilter: 'No project matches these filters.',
    reset: 'Reset filters',
    type: { print3d: '3D printed', final: 'Final build' },
    domain: 'Field',
  },
  project: {
    home: 'Home',
    stage: 'STAGE',
    prototype: 'PROTOTYPE',
    maturity: 'MATURITY',
    year: 'YEAR',
    challenge: 'THE CHALLENGE',
    solution: 'OUR SOLUTION',
    howItWorks: 'HOW IT WORKS',
    specs: 'TECHNICAL SPECIFICATIONS',
    technologies: 'TECHNOLOGIES',
    maturityLevel: 'TECHNOLOGY READINESS',
    safety: 'SAFETY',
    gallery: 'GALLERY',
    galleryTitle: 'The project in pictures',
    model3d: 'Interactive 3D model',
    model3dHint: 'Drag to rotate · scroll to zoom',
    video: 'Video',
    perspectives: 'OUTLOOK',
    perspectivesTitle: 'Next steps',
    context: 'CONTEXT',
    report: 'Download the report (PDF)',
    back: '← ALL PROJECTS',
    backTitle: 'Back to portfolio',
    next: 'NEXT PROJECT →',
    ctaTitle: 'Interested in this prototype?',
    ctaText: "Partnership, further testing or industrialisation with C2S Engineering: let's talk.",
  },
  about: { title: 'The Lab', founder: 'THE FOUNDER', values: 'OUR COMMITMENTS', empty: 'This page will be completed soon.' },
  contact: {
    title: 'Contact',
    intro: 'An idea to test, a partnership, a question? Write to us and we will reply promptly.',
    name: 'Full name',
    company: 'Company (optional)',
    email: 'Business email',
    subject: 'Subject',
    message: 'Your message',
    consent: 'I agree that my data may be used to answer my request.',
    send: 'Send message',
    sending: 'Sending…',
    success: 'Thank you! Your message has been sent.',
    error: 'Sending failed. Please try again or email us directly.',
    details: 'DETAILS',
  },
  footer: { navigation: 'NAVIGATION', contact: 'CONTACT', rights: 'All rights reserved.', legal: 'Legal notice', privacy: 'Privacy' },
  cookies: {
    text: 'This site only uses technical cookies required for it to work. No data is used for advertising.',
    ok: 'Got it',
    more: 'Learn more',
  },
  legal: { legalTitle: 'Legal notice', privacyTitle: 'Privacy policy', empty: 'Content to be completed from the dashboard.' },
  notFound: { title: 'Page not found', text: 'The page you requested does not exist or has moved.', back: 'Back to home' },
}

export const dictionaries: Record<Locale, Dictionary> = { fr, en }
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale]
