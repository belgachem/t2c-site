import { defineField, defineType } from 'sanity'

/** Texte court traduit (français obligatoire, anglais facultatif). */
export const localeString = defineType({
  name: 'localeString',
  title: 'Texte court (FR / EN)',
  type: 'object',
  options: { columns: 2 },
  fields: [
    defineField({ name: 'fr', title: 'Français', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
})

/** Paragraphe traduit (français obligatoire, anglais facultatif). */
export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraphe (FR / EN)',
  type: 'object',
  fields: [
    defineField({ name: 'fr', title: 'Français', type: 'text', rows: 5 }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 5 }),
  ],
})

/** Validation : le français doit être rempli. */
export const requireFr = (Rule: any) =>
  Rule.custom((value: { fr?: string } | undefined) =>
    value?.fr && value.fr.trim().length > 0 ? true : 'La version française est obligatoire',
  )
