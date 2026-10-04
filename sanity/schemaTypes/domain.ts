import { defineField, defineType } from 'sanity'
import { requireFr } from './locale'

export const domain = defineType({
  name: 'domain',
  title: 'Domaine',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nom du domaine', type: 'localeString', validation: requireFr }),
    defineField({
      name: 'slug',
      title: 'Identifiant URL',
      type: 'slug',
      description: 'Généré automatiquement à partir du nom (ex. « sante »).',
      options: { source: 'title.fr', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description courte', type: 'localeText' }),
    defineField({
      name: 'icon',
      title: 'Icône',
      type: 'string',
      initialValue: 'machine',
      options: {
        layout: 'radio',
        list: [
          { title: 'Industrie', value: 'industry' },
          { title: 'Santé', value: 'health' },
          { title: 'Robotique', value: 'robotics' },
          { title: 'Machines spéciales', value: 'machine' },
          { title: 'Intelligence artificielle', value: 'ai' },
          { title: 'Énergie', value: 'energy' },
          { title: 'Mobilité électrique / recharge', value: 'mobility' },
        ],
      },
    }),
    defineField({ name: 'order', title: "Ordre d'affichage", type: 'number', initialValue: 10 }),
  ],
  orderings: [{ title: "Ordre d'affichage", name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title.fr', subtitle: 'slug.current' } },
})
