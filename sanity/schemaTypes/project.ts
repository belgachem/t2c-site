import { defineArrayMember, defineField, defineType } from 'sanity'
import { requireFr } from './locale'

export const project = defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  groups: [
    { name: 'general', title: 'Général', default: true },
    { name: 'content', title: 'Contenu' },
    { name: 'technical', title: 'Technique' },
    { name: 'media', title: 'Médias & fichiers' },
  ],
  fields: [
    // ---------- Général ----------
    defineField({ name: 'title', title: 'Titre du projet', type: 'localeString', group: 'general', validation: requireFr }),
    defineField({
      name: 'slug',
      title: 'Identifiant URL',
      type: 'slug',
      group: 'general',
      description: 'Cliquez sur « Generate » pour le créer à partir du titre.',
      options: { source: 'title.fr', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Accroche courte',
      type: 'localeString',
      group: 'general',
      description: 'Une phrase qui résume le projet (affichée sur les cartes).',
      validation: requireFr,
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: "Description de l'image (accessibilité)", type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'domains',
      title: 'Domaine(s)',
      type: 'array',
      group: 'general',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'domain' }] })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'stage',
      title: 'Stade du projet',
      type: 'string',
      group: 'general',
      options: {
        layout: 'radio',
        list: [
          { title: 'Concept', value: 'concept' },
          { title: 'En essai', value: 'test' },
          { title: 'Prototype testé', value: 'prototype' },
          { title: 'Validé / transféré', value: 'validated' },
        ],
      },
      initialValue: 'prototype',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prototypeType',
      title: 'Type de prototype',
      type: 'string',
      group: 'general',
      options: {
        layout: 'radio',
        list: [
          { title: 'Prototype imprimé en 3D', value: 'print3d' },
          { title: 'Réalisation finale', value: 'final' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'trl',
      title: 'Niveau de maturité (TRL 1 à 9)',
      type: 'number',
      group: 'general',
      description: '1 = principe observé · 4 = validé en laboratoire · 9 = système éprouvé en conditions réelles.',
      options: { list: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
      validation: (Rule) => Rule.required().min(1).max(9).integer(),
    }),
    defineField({ name: 'year', title: 'Année', type: 'number', group: 'general', validation: (Rule) => Rule.min(2000).max(2100).integer() }),
    defineField({
      name: 'featured',
      title: 'Mettre en avant sur la page d’accueil',
      type: 'boolean',
      group: 'general',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      group: 'general',
      description: 'Plus le nombre est petit, plus le projet apparaît en premier.',
      initialValue: 10,
    }),

    // ---------- Contenu ----------
    defineField({ name: 'challenge', title: 'Le défi', type: 'localeText', group: 'content', validation: requireFr }),
    defineField({ name: 'solution', title: 'Notre solution', type: 'localeText', group: 'content', validation: requireFr }),
    defineField({
      name: 'steps',
      title: 'Étapes de fonctionnement',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'title', title: 'Titre de l’étape', type: 'localeString', validation: requireFr }),
            defineField({ name: 'description', title: 'Description', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.fr' } },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'keyFigures',
      title: 'Chiffres clés (4 maximum)',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'keyFigure',
          fields: [
            defineField({ name: 'value', title: 'Valeur (ex. « 96,5 % »)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Libellé', type: 'localeString', validation: requireFr }),
          ],
          preview: { select: { title: 'value', subtitle: 'label.fr' } },
        }),
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: 'resultsNote', title: 'Note sur les résultats (facultatif)', type: 'localeString', group: 'content', description: 'Ex. « Résultats mesurés lors des essais du prototype. »' }),
    defineField({
      name: 'perspectives',
      title: 'Perspectives / évolutions',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'localeString' })],
    }),
    defineField({
      name: 'context',
      title: 'Contexte / partenaire',
      type: 'localeText',
      group: 'content',
      description: 'Client, partenaire, concours, laboratoire…',
    }),

    // ---------- Technique ----------
    defineField({
      name: 'specs',
      title: 'Caractéristiques techniques',
      type: 'array',
      group: 'technical',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spec',
          fields: [
            defineField({ name: 'label', title: 'Caractéristique (ex. « Masse »)', type: 'localeString', validation: requireFr }),
            defineField({ name: 'value', title: 'Valeur (ex. « 1,5 kg »)', type: 'localeString', validation: requireFr }),
          ],
          preview: { select: { title: 'label.fr', subtitle: 'value.fr' } },
        }),
      ],
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      group: 'technical',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'safety',
      title: 'Sécurité (facultatif)',
      type: 'array',
      group: 'technical',
      of: [defineArrayMember({ type: 'localeString' })],
    }),

    // ---------- Médias ----------
    defineField({
      name: 'gallery',
      title: 'Galerie photos',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: "Description de l'image", type: 'string' })],
        }),
      ],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vidéo (lien YouTube ou Vimeo)',
      type: 'url',
      group: 'media',
    }),
    defineField({
      name: 'videoFile',
      title: 'Ou fichier vidéo (MP4)',
      type: 'file',
      group: 'media',
      options: { accept: 'video/mp4,video/webm' },
    }),
    defineField({
      name: 'model3d',
      title: 'Modèle 3D (.glb)',
      type: 'file',
      group: 'media',
      description: 'Exportez votre modèle CAO au format GLB pour le visualiseur 3D interactif.',
      options: { accept: '.glb,model/gltf-binary' },
    }),
    defineField({
      name: 'report',
      title: 'Rapport (PDF)',
      type: 'file',
      group: 'media',
      options: { accept: 'application/pdf' },
    }),
  ],
  orderings: [
    { title: "Ordre d'affichage", name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Année (récent d’abord)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title.fr', subtitle: 'tagline.fr', media: 'mainImage', featured: 'featured' },
    prepare: ({ title, subtitle, media, featured }) => ({
      title: (featured ? '★ ' : '') + (title || 'Projet sans titre'),
      subtitle,
      media,
    }),
  },
})
