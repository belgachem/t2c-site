# T2C Innovation Lab — portfolio de la branche innovation de T2C Engineering

Site vitrine bilingue (FR / EN) avec tableau de bord administrateur intégré sur `/admin`.

- **Site** : Next.js 15 (React 19)
- **Base de données + tableau de bord** : Sanity (hébergé, offre gratuite)
- **Hébergement conseillé** : Vercel (offre gratuite)
- **Emails du formulaire** : Resend (offre gratuite)

Le site est livré **vide** : tout le contenu se gère depuis `/admin`.

---

## 1. Installer sur votre ordinateur (une seule fois)

1. Installez **Node.js 20 ou plus récent** : <https://nodejs.org> (version « LTS »).
2. Ouvrez un terminal dans ce dossier (`t2c-site`) et lancez :

   ```bash
   npm install
   ```

## 2. Créer le projet Sanity (la base de données)

1. Créez un compte gratuit sur <https://www.sanity.io> (avec votre email professionnel).
2. Sur <https://www.sanity.io/manage>, cliquez sur **Create new project**, nommez-le `T2C Engineering`.
   Créez un dataset nommé `production` (visibilité **public**) s'il n'existe pas déjà.
3. Copiez le **Project ID** affiché (8 caractères, ex. `ab12cd34`).
4. Dans ce dossier, copiez `.env.example` en `.env.local`, puis collez l'identifiant :

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=ab12cd34
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Les autres variables peuvent attendre.

5. Autorisez le site à se connecter au tableau de bord (CORS) :
   sur <https://www.sanity.io/manage> → votre projet → **API** → **CORS origins** → ajoutez
   `http://localhost:3000` en cochant **Allow credentials**.

## 3. Lancer le site en local

```bash
npm run dev
```

- Site : <http://localhost:3000>
- Tableau de bord : <http://localhost:3000/admin>

### Premiers contenus conseillés (dans /admin)

1. **Paramètres du site** : nom de la société mère, nom de la branche (« Innovation Lab »), adresse du site principal T2C Engineering, logo, coordonnées, mentions légales.
2. **Domaines** : Industrie, Santé, Robotique, Machines spéciales… (choisissez une icône).
3. **Page d'accueil** : titre, texte, chiffres clés, étapes de la démarche.
4. **À propos** : présentation et fondateur.
5. **Projets** : ajoutez vos projets puis cliquez sur **Publish**.

Tout texte a une version **Français** (obligatoire) et **English** (facultative : si elle est vide, le français s'affiche).

## 4. Mettre en ligne sur Vercel

1. Créez un dépôt GitHub (privé) et envoyez-y ce dossier.
2. Sur <https://vercel.com>, **Add New → Project**, importez le dépôt.
3. Dans **Environment Variables**, recopiez les variables de `.env.local`
   (et `NEXT_PUBLIC_SITE_URL` = l'adresse finale du site).
4. **Deploy**. Ajoutez ensuite votre nom de domaine dans **Settings → Domains**.
5. Dans Sanity → **API → CORS origins**, ajoutez l'adresse du site (`https://www.votre-domaine.com`), **Allow credentials** coché.

## 5. Publication instantanée (webhook)

Sans webhook, une modification apparaît sur le site en 5 minutes maximum.
Pour qu'elle apparaisse en quelques secondes :

1. Choisissez un mot secret et mettez-le dans `SANITY_REVALIDATE_SECRET` (Vercel + `.env.local`).
2. Sanity → **API → Webhooks → Create webhook** :
   - URL : `https://www.votre-domaine.com/api/revalidate`
   - Dataset : `production`, déclencheurs : Create, Update, Delete
   - HTTP method : `POST`, **Secret** : le même mot secret.

## 6. Formulaire de contact

1. Créez un compte sur <https://resend.com>, vérifiez votre nom de domaine.
2. Renseignez `RESEND_API_KEY`, `CONTACT_TO` (adresse de réception) et `CONTACT_FROM`.

## Ajouter un administrateur

Sanity → **Members → Invite** : la personne invitée peut se connecter sur `/admin`.

## Structure du code

```
app/[locale]/…            pages du site (fr / en)
app/admin/                tableau de bord Sanity
app/api/contact           envoi du formulaire
app/api/revalidate        mise à jour instantanée (webhook)
components/               en-tête, pied de page, cartes, formulaire…
lib/i18n.ts               textes fixes FR / EN de l'interface
lib/queries.ts            requêtes vers la base de données
sanity/schemaTypes/       structure des données (formulaires du tableau de bord)
app/globals.css           styles (couleurs de la charte en haut du fichier)
```
