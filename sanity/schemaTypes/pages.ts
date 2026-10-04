import { defineArrayMember, defineField, defineType } from 'sanity'

/** Page d'accueil (document unique). */
export const homePage = defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Bannière' },
    { name: 'innovator', title: "Le mot de l'innovateur — votre photo et votre message dans la bannière d'accueil" },
  ],
  fields: [
    defineField({ name: 'heroEyebrow', title: 'Sur-titre', type: 'localeString', fieldset: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Grand titre', type: 'localeString', fieldset: 'hero' }),
    defineField({ name: 'heroText', title: 'Texte d’introduction', type: 'localeText', fieldset: 'hero' }),
    defineField({
      name: 'innovatorPhoto',
      title: 'Votre photo',
      type: 'image',
      fieldset: 'innovator',
      options: { hotspot: true },
      description: 'Portrait vertical de préférence. Le point focal (hotspot) permet de centrer le visage.',
    }),
    defineField({ name: 'innovatorName', title: 'Votre nom', type: 'string', fieldset: 'innovator' }),
    defineField({ name: 'innovatorRole', title: 'Votre fonction', type: 'localeString', fieldset: 'innovator', description: 'Ex. « Fondateur · Responsable innovation »' }),
    defineField({ name: 'innovatorTitle', title: 'Titre du message (facultatif)', type: 'localeString', fieldset: 'innovator', description: 'Ex. « Innover, c’est oser tester »' }),
    defineField({
      name: 'innovatorMessage',
      title: 'Votre message',
      type: 'localeText',
      fieldset: 'innovator',
      description: 'Affiché dans la bannière de la page d’accueil, à côté de votre photo. Restez court : 2 à 4 phrases.',
    }),
    defineField({
      name: 'heroProject',
      title: 'Projet affiché dans la bannière',
      type: 'reference',
      to: [{ type: 'project' }],
      description: 'Si vide, le premier projet « mis en avant » est utilisé.',
    }),
    defineField({
      name: 'stats',
      title: 'Chiffres clés de la société (4 maximum)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stat',
          fields: [
            defineField({ name: 'value', title: 'Valeur', type: 'string' }),
            defineField({ name: 'label', title: 'Libellé', type: 'localeString' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label.fr' } },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: 'domainsIntro', title: 'Texte de la section « Domaines »', type: 'localeText' }),
    defineField({
      name: 'process',
      title: 'Démarche (étapes)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({ name: 'title', title: 'Titre', type: 'localeString' }),
            defineField({ name: 'description', title: 'Description', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.fr' } },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({ name: 'ctaTitle', title: 'Appel à l’action — titre', type: 'localeString' }),
    defineField({ name: 'ctaText', title: 'Appel à l’action — texte', type: 'localeText' }),
  ],
  preview: { prepare: () => ({ title: "Page d'accueil" }) },
})

/** Page « À propos » (document unique). */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'À propos',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'localeString' }),
    defineField({ name: 'intro', title: 'Introduction', type: 'localeText' }),
    defineField({ name: 'body', title: 'Présentation de la société', type: 'localeText' }),
    defineField({
      name: 'values',
      title: 'Valeurs / engagements',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'companyValue',
          fields: [
            defineField({ name: 'title', title: 'Titre', type: 'localeString' }),
            defineField({ name: 'description', title: 'Description', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.fr' } },
        }),
      ],
    }),
    defineField({ name: 'founderName', title: 'Nom du fondateur', type: 'string' }),
    defineField({ name: 'founderRole', title: 'Fonction', type: 'localeString' }),
    defineField({ name: 'founderPhoto', title: 'Photo du fondateur', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'founderBio', title: 'Biographie', type: 'localeText' }),
    defineField({ name: 'founderLinkedin', title: 'LinkedIn du fondateur', type: 'url' }),
  ],
  preview: { prepare: () => ({ title: 'À propos' }) },
})

/** Paramètres du site (document unique). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identité', default: true },
    { name: 'contact', title: 'Coordonnées' },
    { name: 'legal', title: 'Mentions légales' },
  ],
  fields: [
    defineField({ name: 'companyName', title: 'Nom de la société mère', type: 'string', group: 'identity', initialValue: 'C2S Engineering' }),
    defineField({ name: 'labName', title: 'Nom de la branche innovation (sous le logo)', type: 'string', group: 'identity', initialValue: 'Innovation Lab' }),
    defineField({
      name: 'mainWebsite',
      title: 'Adresse du site principal de C2S Engineering',
      type: 'url',
      group: 'identity',
      description: 'Affiché dans le bandeau du haut et le pied de page (ex. https://www.c2s-engineering.com).',
    }),
    defineField({ name: 'logo', title: 'Logo (symbole, de préférence SVG ou PNG transparent)', type: 'image', group: 'identity' }),
    defineField({ name: 'description', title: 'Description courte (pied de page et Google)', type: 'localeText', group: 'identity' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Adresse', type: 'localeText', group: 'contact' }),
    defineField({ name: 'linkedin', title: 'Page LinkedIn', type: 'url', group: 'contact' }),
    defineField({ name: 'legalNotice', title: 'Mentions légales', type: 'localeText', group: 'legal' }),
    defineField({ name: 'privacyPolicy', title: 'Politique de confidentialité', type: 'localeText', group: 'legal' }),
  ],
  preview: { prepare: () => ({ title: 'Paramètres du site' }) },
})
