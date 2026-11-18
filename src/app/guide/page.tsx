import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Camera,
  FileText,
  KeyRound,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Guide après un vol',
  description:
    "Que faire après le vol d'un vélo : porter plainte, faire marquer son cadre, réunir les preuves et consigner un signalement complet.",
  alternates: { canonical: '/guide' },
};

const PLAINTE = [
  {
    title: 'Réunir les preuves avant de se déplacer',
    body: "Photographiez le vélo (cadre, composants, accessoires, signes distinctifs), retrouvez la facture d’achat ou le certificat de garantie, et notez le numéro de série gravé sur le cadre. Sans ces éléments, la plainte reste difficile à exploiter et une restitution devient compliquée à justifier.",
  },
  {
    title: 'Déposer plainte au commissariat ou à la gendarmerie',
    body: "Le dépôt se fait dans le service de votre choix, idéalement là où le vol a eu lieu. Vous pouvez aussi l’adresser par écrit au procureur de la République. Le numéro de plainte et la date de dépôt sont à conserver : ils relient votre vélo au dossier et servent en cas de restitution.",
  },
  {
    title: 'Déclarer le vélo auprès de son assureur',
    body: "Si le vélo est couvert (habitation, extension « vélo », assurance professionnelle), la déclaration doit être faite sous deux jours ouvrés en général. La plainte et la facture vous seront demandées. Un vélo électrique peut relever d’une garantie spécifique : vérifiez les plafonds et la franchise.",
  },
  {
    title: 'Conserver une trace écrite de tout',
    body: "Main courante, e-mail à l’assureur, échange avec un syndic pour un vol dans un local fermé : chaque document renforce le dossier. Notez aussi les éventuelles caméras de vidéoprotection du lieu, dont les enregistrements sont effacés au bout de quelques jours.",
  },
];

const MARQUAGE = [
  {
    title: 'Le marquage BICYCODE',
    body: "Dispositif prévu par la loi d’orientation des mobilités, le marquage appose un identifiant unique sur le cadre, relié à un registre national. Il rend la revente d’un vélo volé plus difficile et facilite l’identification par les forces de l’ordre, les boutiques vélo ou les déchetteries. Le marquage est obligatoire pour les vélos neufs vendus en France depuis le 1er janvier 2021.",
  },
  {
    title: 'Le numéro de série constructeur',
    body: "Gravé sous le boîtier de pédalier, sur le tube de direction ou l’arrière des bases, il est propre au fabricant. Il ne remplace pas un marquage, mais il permet de relier un vélo retrouvé à une facture. Photographiez-le lisiblement, sans peinture ni boue.",
  },
  {
    title: 'Et si le vélo n’est pas marqué ?',
    body: "Faites marquer le vélo chez un revendeur agréé ou lors d’une opération de marquage organisée par une collectivité. L’opération coûte généralement entre 10 et 30 euros et prend une vingtaine de minutes. C’est la démarche la plus utile après un vol : elle protège votre prochain vélo, et le vôtre s’il vous est restitué.",
  },
];

const CONSTAT = [
  {
    title: 'Horodatage et lieu',
    body: "Notez la date et l’heure la plus précise possible, ainsi que l’adresse exacte, le type de stationnement (arceau, local fermé, cave, rue) et le moyen d’attache utilisé. Ces éléments orientent les vérifications et permettent de demander les images de vidéoprotection avant leur effacement.",
  },
  {
    title: 'Relevé des éléments uniques',
    body: "Rayures, autocollants, réparation, dérailleur remplacé, selle ou poignées changées, couleur atypique, garde-boue ajouté : ce sont ces détails, et non la marque du vélo, qui permettent de reconnaître un cadre sur une photo d’annonce floue.",
  },
  {
    title: 'Photos de référence',
    body: "Gardez au moins quatre clichés : vue d’ensemble de profil, gros plan du numéro gravé, gros plan des signes distinctifs, vue des composants (roues, transmission, freins). Une photo nette vaut mieux qu’une série sombre et floues.",
  },
];

const REFLEXES = [
  {
    icon: Search,
    title: 'Surveiller les annonces',
    body: "Consultez les plateformes de vente d’occasion avec des critères larges (marque, modèle, ville, prix) et activez des alertes. La plupart des vélos volés y réapparaissent en quelques semaines.",
  },
  {
    icon: ShieldCheck,
    title: 'Ne jamais contacter le vendeur seul',
    body: "Si une annonce ressemble à votre vélo, ne prenez pas rendez-vous vous-même et n’accusez personne publiquement. Signalez l’annonce à la plateforme et transmettez les éléments au service de police ou de gendarmerie en charge de votre plainte.",
  },
  {
    icon: FileText,
    title: 'Documenter la correspondance',
    body: "Capturez l’annonce (titre, prix, ville, date de publication, photos, lien), relevez le numéro de l’annonce et conservez la capture horodatée. Ces éléments complètent la plainte sans remplacer l’enquête.",
  },
  {
    icon: KeyRound,
    title: 'Prévenir son assureur et le service en charge',
    body: "En cas de forte probabilité, prévenez l’assureur et le commissariat ou la gendarmerie qui suit votre dossier. La restitution d’un vélo retrouvé suppose de prouver la propriété : facture, marquage et photos font la différence.",
  },
];

const CHECKLIST = [
  'Photographier le vélo et le numéro gravé sur le cadre',
  'Retrouver la facture d’achat ou le certificat de garantie',
  'Relever date, heure et adresse exacte du vol',
  'Déposer plainte et conserver le numéro de dépôt',
  'Déclarer le sinistre à son assureur',
  'Noter les signes distinctifs et les modifications',
  'Demander l’exploitation des caméras du lieu',
  'Faire marquer le vélo (ou le prochain)',
];

export default function GuidePage() {
  return (
    <div className="pb-24">
      <section className="border-b border-zinc-200/80 bg-zinc-50/80">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
          <Badge variant="neutral">
            <BookOpen className="h-3 w-3" aria-hidden="true" />
            Guide pratique
          </Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Que faire après le vol
            <br />
            <span className="text-zinc-500">de son vélo&nbsp;?</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-600">
            Les premières heures comptent. Ce guide détaille les démarches
            officielles, le marquage du cadre et les éléments à réunir pour
            qu’un signalement soit exploitable&nbsp;— par vous, par votre
            assureur et par les services enquêteurs.
          </p>
          <nav
            aria-label="Sommaire du guide"
            className="mt-8 flex flex-wrap gap-2 text-[13px]"
          >
            {[
              { href: '#porter-plainte', label: 'Porter plainte' },
              { href: '#marquage', label: 'Marquage du cadre' },
              { href: '#constater', label: 'Constat du vol' },
              { href: '#plateformes', label: 'Plateformes de vente' },
              { href: '#checklist', label: 'Liste de contrôle' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 shadow-xs transition-colors hover:border-zinc-300 hover:bg-zinc-50"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-6">
        <section id="porter-plainte" className="scroll-mt-24 pt-16">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold tabular-nums text-indigo-700 ring-1 ring-indigo-100">
              1
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Porter plainte
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            La plainte est la seule démarche qui ouvre une enquête et permet une
            restitution officielle. Elle se dépose même sans facture, même
            plusieurs jours après les faits.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PLAINTE.map((item) => (
              <Card key={item.title} className="h-full">
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Ces repères sont donnés à titre informatif et ne remplacent pas les
            informations communiquées par un service de police, de gendarmerie
            ou par un assureur.
          </p>
        </section>

        <section id="marquage" className="scroll-mt-24 pt-16">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold tabular-nums text-indigo-700 ring-1 ring-indigo-100">
              2
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Marquage du cadre
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Un cadre marqué est un vélo difficile à revendre et facile à
            identifier. C&apos;est la mesure de prévention la plus efficace,
            avant comme après un vol.
          </p>
          <div className="mt-8 space-y-4">
            {MARQUAGE.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="constater" className="scroll-mt-24 pt-16">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold tabular-nums text-indigo-700 ring-1 ring-indigo-100">
              3
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Constat du vol
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Un bon signalement se joue sur les détails. Plus le relevé est
            précis, plus il a de chances de rapprocher un vélo retrouvé d&apos;une
            annonce.
          </p>
          <div className="mt-8 space-y-4">
            {CONSTAT.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="plateformes" className="scroll-mt-24 pt-16">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold tabular-nums text-indigo-700 ring-1 ring-indigo-100">
              4
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Sur une plateforme de vente
            </h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Une ressemblance n&apos;est pas une preuve. La règle est de documenter
            et de transmettre, jamais de se substituer à l&apos;enquête.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REFLEXES.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="h-full">
                  <CardHeader>
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.body}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="checklist" className="scroll-mt-24 pt-16">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
              <Camera className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Liste de contrôle
            </h2>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Les huit réflexes après un vol</CardTitle>
              <CardDescription>
                À parcourir dans l&apos;ordre, dans les vingt-quatre heures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-2.5 sm:grid-cols-2">
                {CHECKLIST.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-zinc-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold tabular-nums text-zinc-600">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Maquette de démonstration
            </div>
            <p className="text-sm leading-relaxed text-amber-900/90">
              La déclaration en ligne et la recherche automatique d&apos;annonces
              sont des fonctionnalités en cours de développement&nbsp;: elles
              n&apos;explorent aucune plateforme et n&apos;enregistrent aucune
              donnée. Le guide, lui, reste valable quel que soit le service.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/declarer">
                  Déclarer le vol de mon vélo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/tarification">Tarifs du service</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
