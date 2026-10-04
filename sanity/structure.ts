import type { StructureResolver } from 'sanity/structure'

/** Menu du tableau de bord, en français. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('T2C Engineering')
    .items([
      S.documentTypeListItem('project').title('Projets'),
      S.documentTypeListItem('domain').title('Domaines'),
      S.divider(),
      S.listItem()
        .title("Page d'accueil")
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage').title("Page d'accueil")),
      S.listItem()
        .title('À propos')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('À propos')),
      S.divider(),
      S.listItem()
        .title('Paramètres du site')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Paramètres du site')),
    ])
