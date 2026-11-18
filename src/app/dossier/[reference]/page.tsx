import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Ban, EyeOff, Search, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { isValidReference } from '@/lib/reference';

export const metadata = {
  title: "Dossier d'exemple",
  description:
    "Exemple fictif de ce qu'afficherait un dossier de déclaration. Maquette de démonstration : aucune donnée n'est enregistrée et aucune veille n'est active.",
};

/**
 * Maquette de démonstration : la page montre la mise en page prévue pour un
 * dossier, avec des données entièrement fictives écrites dans le code. Aucune
 * déclaration n'est stockée côté serveur et aucune recherche sur les plateformes
 * de vente n'est effectuée.
 */

type Fiche = { label: string; value: string };

const IDENTITE: Fiche[] = [
  { label: 'Type de vélo', value: 'Électrique (VAE)' },
  { label: 'Marque', value: 'Empower' },
  { label: 'Modèle', value: 'E-City 500' },
  { label: 'Année', value: '2023' },
  { label: 'Taille de cadre', value: 'M (48 cm)' },
  { label: 'Matériau', value: 'Aluminium' },
  { label: 'Numéro de série', value: 'Masqué dans cet exemple' },
  { label: 'Marquage Bicycode', value: '75AB12345' },
];

const APPARENCE: Fiche[] = [
  { label: 'Couleur principale', value: 'Bleu nuit' },
  { label: 'Couleur secondaire', value: 'Gris' },
  { label: 'Taille de roues', value: '28" / 700' },
  { label: 'Vitesse', value: '8 vitesses' },
  { label: 'Freins', value: 'Disque hydraulique' },
  { label: 'Signes distinctifs', value: 'Rayure verticale sur le tube diagonal, garde-boue avant remplacé' },
];

const VOL: Fiche[] = [
  { label: 'Date du vol', value: '14 janvier 2025, vers 18 h 30 (heure approximative)' },
  { label: 'Lieu', value: 'Place Guichard, parking vélo sur trottoir' },
  { label: 'Ville', value: 'Lyon — 69003 (département 69)' },
  { label: 'Antivol déclaré', value: 'Antivol U + chaîne' },
  { label: 'Circonstances', value: 'Déclaré par la personne utilisatrice dans l’exemple de remplissage.' },
];

export default async function DossierPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  if (!isValidReference(reference)) notFound();

  return (
    <>
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="warning">Exemple fictif — démonstration</Badge>
              <Badge variant="outline">Aucune donnée enregistrée</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Dossier <span className="text-indigo-600">{reference}</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Cette page illustre la mise en page prévue pour consulter une déclaration. Les
              informations affichées sont <strong className="font-semibold text-zinc-900">
              entièrement fictives</strong>, écrites dans le code de la maquette&nbsp;: elles ne
              correspondent à aucun vélo réel et ne proviennent d&apos;aucune base de données.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="animate-fade-up shadow-card ring-1 ring-amber-200 lg:col-span-3">
              <CardContent className="pt-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"
                >
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold tracking-tight text-zinc-900">
                  Ce que ce dossier ne représente pas
                </h2>
                <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-zinc-600 sm:grid-cols-2">
                  <li>Aucune déclaration n&apos;a été transmise ni enregistrée.</li>
                  <li>Aucun courriel de confirmation n&apos;a été envoyé.</li>
                  <li>Aucune veille sur Leboncoin, Vinted ou eBay n&apos;est en cours.</li>
                  <li>Aucun dépôt de plainte n&apos;a été effectué à partir de cette page.</li>
                </ul>
              </CardContent>
            </Card>

            <FicheCard title="Identité du vélo" fiche={IDENTITE} />
            <FicheCard title="Apparence" fiche={APPARENCE} />
            <FicheCard title="Circonstances du vol" fiche={VOL} />
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Card className="animate-fade-up">
              <CardContent className="pt-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
                >
                  <Search className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold tracking-tight text-zinc-900">
                  Résultats des plateformes de vente
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  Section prévue pour une version ultérieure. La recherche automatique sur les
                  sites de vente n&apos;est pas implémentée dans cette maquette&nbsp;: elle
                  nécessiterait l&apos;accord des plateformes concernées et une analyse
                  juridique.
                </p>
                <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500">
                  <Ban className="mb-2 inline-flex h-4 w-4" aria-hidden="true" />
                  Aucun résultat affiché&nbsp;: aucune recherche n&apos;a été lancée.
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-up">
              <CardContent className="pt-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700"
                >
                  <EyeOff className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold tracking-tight text-zinc-900">
                  Coordonnées de la personne déclarante
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  Volontairement masquées. Dans la version prévue, un dossier partagé ne
                  montrerait que les informations utiles à la reconnaissance du vélo, jamais
                  l&apos;identité ni les coordonnées de la personne qui a rempli la déclaration.
                </p>
                <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500">
                  Prénom, nom, courriel et téléphone&nbsp;: non affichés.
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/declarer">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Remplir la déclaration de démonstration
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/fonctionnalites">Voir les fonctionnalités prévues</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function FicheCard({ title, fiche }: { title: string; fiche: Fiche[] }) {
  return (
    <Card className="animate-fade-up">
      <CardContent className="pt-6">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h2>
        <dl className="mt-4 space-y-3">
          {fiche.map((item) => (
            <div key={item.label}>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                {item.label}
              </dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-zinc-800">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
