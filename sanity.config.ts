'use client'

/**
 * Configuration du tableau de bord administrateur, accessible sur /admin.
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, singletonTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/admin',
  title: 'T2C Engineering — Administration',
  projectId: projectId || 'a-configurer',
  dataset,
  schema: {
    types: schemaTypes,
    // Les documents uniques ne peuvent pas être créés depuis le bouton « + »
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // ni dupliqués / supprimés
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
  plugins: [structureTool({ structure, title: 'Contenu' })],
  apiVersion,
})
