# Vélo Signalé

**Maquette de démonstration** : site vitrine + parcours de déclaration de vol de vélo,
réalisé pour présenter le produit avant tout développement commercial.
Tout le contenu est en français, et le site **n'enregistre aucune donnée personnelle**.

## Ce que fait la maquette

- Pages vitrines : accueil, fonctionnalités, guide après un vol, tarification, contact,
  mentions légales, politique de confidentialité.
- Formulaire de déclaration en **4 étapes** — Identification du vélo, Lieu et
  circonstances du vol, Vos coordonnées, Récapitulatif — avec barre de progression,
  retour aux étapes précédentes, validation des champs, affichage des erreurs et case
  d'acceptation de la politique de confidentialité.
- Écran de confirmation **simulée** : la référence affichée est produite par le
  navigateur, aucune recherche n'est lancée, rien n'est transmis à un serveur.
- Page d'exemple de dossier (`/dossier/VS-DEMO-2401`) pour montrer ce que deviendrait un
  dossier de suivi.

## Ce que la maquette ne fait pas

- Aucun envoi d'e-mail.
- Aucun enregistrement de déclaration, en base ou ailleurs.
- Aucune recherche sur Leboncoin, Vinted ou eBay.
- Aucune statistique inventée : les fonctionnalités non développées sont signalées
  « à venir ».

L'API `/api/reports` répond volontairement **410 Gone** : elle est sortie du circuit pour
qu'aucune route HTTP n'écrive en base. Le code du back-end (service, base SQLite,
limiteur de requêtes, préparation de recherche) reste dans le dépôt comme base de travail,
mais il n'est importé par aucune page.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack, sortie `standalone`)
- React 19, TypeScript 5
- Tailwind CSS 3, Radix UI, lucide-react
- `better-sqlite3` : dépendance du back-end dormant, absente du bundle livré

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilation de production
npm run start    # sert le build
npm run lint     # ESLint (Next.js 16 a retiré `next lint`)
```

## Configuration

Modèle dans [.env.example](./.env.example) : `PORT`, `HOSTNAME`, `NODE_ENV`,
`DATABASE_FILE` (cette dernière ne concerne que le back-end dormant).

## Déploiement

Procédure complète — compilation, publication, mise à jour de la VM de recette,
vérifications, retour arrière — dans [DEPLOIEMENT.md](./DEPLOIEMENT.md).

```bash
bash deploy/build-standalone.sh    # paquet déployable dans dist/
bash deploy/deploy-vm210.sh        # déploiement sur la VM de recette
```

## Licence

Projet privé, destiné à un usage commercial.
