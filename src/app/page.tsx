import Link from "next/link";
import {
  ArrowRight,
  Bike,
  Check,
  ClipboardList,
  Clock,
  FileText,
  Fingerprint,
  Globe,
  KeyRound,
  Layers,
  MapPin,
  Palette,
  ScanLine,
  Search,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Déclarez votre vélo",
    text: "Un formulaire guidé réunit tout ce qui permet de reconnaître votre vélo : marque, modèle, marquage, numéro de série, signes distinctifs, circonstances du vol. Vous repartez avec une référence et un dossier clair, à remettre aux services de police ou de gendarmerie.",
    status: "Disponible",
    statusVariant: "success" as const,
  },
  {
    icon: Search,
    title: "2. Nous rechercherons les annonces correspondantes",
    text: "Les annonces publiées sur les plateformes de vente d'occasion seraient comparées aux vélos déclarés : catégorie, marque, modèle, couleur, taille de cadre, équipements et signes distinctifs.",
    status: "À venir",
    statusVariant: "warning" as const,
  },
  {
    icon: ScanLine,
    title: "3. Identifiez les correspondances potentielles",
    text: "Vous seriez averti des annonces qui ressemblent à votre vélo, avec les éléments qui justifient le rapprochement. La vérification reste la vôtre : une ressemblance n'est pas une preuve.",
    status: "À venir",
    statusVariant: "warning" as const,
  },
];

const PLATFORMS = [
  {
    icon: ShoppingBag,
    title: "Leboncoin",
    text: "Petites annonces entre particuliers : le premier réflexe de celui qui revend un vélo.",
  },
  {
    icon: Tag,
    title: "Vinted",
    text: "Vêtements et accessoires, parfois des cycles, des pièces détachées et des équipements.",
  },
  {
    icon: Globe,
    title: "eBay",
    text: "Enchères et achat immédiat, vélos complets comme composants.",
  },
  {
    icon: Store,
    title: "Et les autres",
    text: "Marketplaces généralistes, sites spécialisés, groupes entre particuliers, dépôts-ventes.",
  },
];

const BENEFITS: {
  icon: LucideIcon;
  title: string;
  text: string;
  span: string;
  status?: string;
}[] = [
  {
    icon: FileText,
    title: "Une déclaration simple",
    text: "Un formulaire guidé, des libellés clairs, les champs facultatifs signalés. Vous décrivez votre vélo une seule fois, au lieu de tout réexpliquer à chaque interlocuteur.",
    span: "lg:col-span-2",
  },
  {
    icon: Layers,
    title: "Des informations centralisées",
    text: "Marquage, numéro de série, facture, photos, circonstances : tout est réuni dans un dossier daté, plutôt que dispersé entre un courriel, un carnet et trois conversations.",
    span: "",
  },
  {
    icon: Search,
    title: "La préparation des futures recherches",
    text: "Une déclaration précise est la matière première du rapprochement d'annonces. Plus les informations sont complètes, plus la recherche sera fiable le jour où elle existera.",
    span: "",
  },
  {
    icon: Clock,
    title: "Un gain de temps",
    text: "Une référence unique et un récapitulatif structuré à transmettre au commissariat, à la gendarmerie, à votre assureur ou à un dépôt-vente.",
    span: "",
  },
  {
    icon: ShieldAlert,
    title: "La détection future d'annonces suspectes",
    text: "À terme, la comparaison de déclarations proches permettra de repérer des annonces récurrentes ou un même vélo présenté sous plusieurs identités.",
    span: "lg:col-span-2",
    status: "À venir",
  },
];

const SECTIONS = [
  {
    icon: Bike,
    title: "L'identité du vélo",
    text: "Catégorie, marque, modèle, année, taille de cadre, taille de roues, prix et lieu d'achat.",
  },
  {
    icon: MapPin,
    title: "Le lieu et les circonstances",
    text: "Date et heure approximatives, code postal, type d'endroit, antivol utilisé et la façon dont le vélo a été emporté.",
  },
  {
    icon: Fingerprint,
    title: "Le marquage et le numéro de série",
    text: "Numéro gravé sur le cadre, marquage BICYCODE ou autre code, et leur emplacement exact.",
  },
  {
    icon: Palette,
    title: "L'apparence",
    text: "Couleurs, matériau du cadre, type de freins et de transmission : ce que l'on voit sur une photo floue.",
  },
  {
    icon: ScanLine,
    title: "Les signes distinctifs",
    text: "Autocollants, gravures, chocs, rayures, pièces remplacées, recoloration : ce qui rend votre vélo reconnaissable.",
  },
  {
    icon: KeyRound,
    title: "La protection",
    text: "Type d'antivol, assurance, garantie, et le code de marquage éventuellement enregistré en ligne.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200/80 bg-zinc-50">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[26rem] w-[52rem] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div className="animate-fade-up">
              <Badge variant="outline" className="mb-6">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Démonstration — aucune donnée enregistrée
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Votre vélo a été volé&nbsp;?
                <br />
                <span className="text-indigo-600">Ne perdez pas espoir.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
                Demain, votre vélo pourrait réapparaître sur une plateforme de vente
                d&apos;occasion. Notre ambition : vous aider à le retrouver grâce à la
                recherche et au rapprochement d&apos;annonces en ligne.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="shadow-card">
                  <Link href="/declarer">
                    Déclarer le vol de mon vélo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#concept">Découvrir le concept</Link>
                </Button>
              </div>
              <p className="mt-10 max-w-xl border-t border-zinc-200/80 pt-6 text-sm leading-relaxed text-zinc-500">
                Gratuit et sans compte. Cette vitrine est une maquette : les recherches
                d&apos;annonces décrites ici sont des fonctionnalités en cours de
                développement, et aucune déclaration n&apos;est transmise ni enregistrée.
              </p>
            </div>

            {/* Dossier preview */}
            <div className="animate-fade-up lg:justify-self-end">
              <Card className="w-full max-w-md shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                        <Bike className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold tracking-tight text-zinc-900">
                          Dossier de signalement
                        </p>
                        <p className="text-xs tabular-nums text-zinc-500">VS-7KQ2-M4TB</p>
                      </div>
                    </div>
                    <Badge variant="neutral">Exemple</Badge>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-zinc-500">Vélo</span>
                      <span className="text-right text-sm font-medium text-zinc-900">
                        Rockrider ST&nbsp;540 — bleu nuit
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-zinc-500">Marquage</span>
                      <span className="text-right text-sm font-medium tabular-nums text-zinc-900">
                        BICYCODE 7512 3348 90
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-zinc-500">Vol</span>
                      <span className="text-right text-sm font-medium text-zinc-900">
                        Gare de Lyon, Paris&nbsp;12
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-zinc-500">Antivol</span>
                      <span className="text-right text-sm font-medium text-zinc-900">
                        U + chaîne, laissés sur place
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-zinc-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      À joindre au dépôt de plainte
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {[
                        "La référence VS-7KQ2-M4TB",
                        "La facture d'achat ou le certificat de marquage",
                        "Deux photos du vélo",
                      ].map((item) => (
                        <li key={item} className="flex gap-2 text-sm leading-relaxed text-zinc-700">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                    Contenu fictif, illustrant la forme du dossier produit par le formulaire.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section id="concept" className="scroll-mt-24 border-b border-zinc-200/80 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Comment ça marche
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Déclarer aujourd&apos;hui, pour pouvoir rechercher demain
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              La première étape fonctionne déjà. Les deux suivantes sont les
              fonctionnalités que nous développons&nbsp;: elles n&apos;existent pas encore
              et ne sont pas proposées à la souscription.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step) => (
              <li key={step.title}>
                <Card className="h-full transition-colors duration-200 hover:border-zinc-300 hover:bg-zinc-50/60">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <step.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <Badge variant={step.statusVariant}>{step.status}</Badge>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600">{step.text}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Plateformes de vente */}
      <section id="plateformes" className="scroll-mt-24 border-b border-zinc-200/80 bg-zinc-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Plateformes de vente
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Les annonces que nous voudrions savoir rapprocher
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Un vélo volé est rarement démonté&nbsp;: il est le plus souvent remis en vente
              en ligne, parfois quelques jours après le vol. C&apos;est là que le
              rapprochement d&apos;annonces a le plus de valeur.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PLATFORMS.map((platform) => (
              <div
                key={platform.title}
                className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors duration-200 hover:border-zinc-300 hover:bg-zinc-50/60"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                  <platform.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-sm font-semibold tracking-tight text-zinc-900">
                  {platform.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{platform.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm leading-relaxed text-amber-900">
              <strong className="font-semibold">Ces plateformes ne sont pas nécessairement
              partenaires.</strong> Aucun accord, aucune intégration et aucun accès à leurs
              données n&apos;existent à ce jour. Les recherches décrites sur cette page sont
              des fonctionnalités en cours de développement&nbsp;: la maquette ne consulte
              et ne référence aucune annonce.
            </p>
          </div>
        </div>
      </section>

      {/* Ce que la déclaration documente */}
      <section id="contenu-du-dossier" className="scroll-mt-24 border-b border-zinc-200/80 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Le contenu du dossier
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Tout ce qui sert à reconnaître un vélo
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">
                Un vélo se reconnaît rarement à un seul détail. C&apos;est la combinaison
                d&apos;un marquage, d&apos;une rayure et d&apos;une pièce remplacée qui
                transforme un doute en certitude. Le formulaire couvre les thèmes qui
                comptent, et signale ceux qui restent à compléter.
              </p>
              <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                <p className="text-sm font-medium text-zinc-900">
                  Ce que le formulaire ne demande pas
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "De compte, de mot de passe ou de carte bancaire",
                    "Le numéro de série si vous ne le connaissez pas : un simple « illisible » suffit",
                    "De photo si vous n'en avez pas sous la main",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors duration-200 hover:border-zinc-300 hover:bg-zinc-50/60"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
                    <section.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-semibold tracking-tight text-zinc-900">
                    {section.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{section.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section id="avantages" className="scroll-mt-24 border-b border-zinc-200/80 bg-zinc-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Ce que ça change
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Pourquoi déclarer son vélo maintenant
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Une déclaration bien faite sert d&apos;abord à porter plainte proprement. Elle
              sert ensuite à la recherche, le jour où elle sera possible.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {BENEFITS.map((item) => (
              <div
                key={item.title}
                className={`group rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-colors duration-200 hover:border-zinc-300 hover:bg-white sm:p-8 ${item.span}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {item.status ? <Badge variant="warning">{item.status}</Badge> : null}
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-16 sm:px-16 lg:py-20">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Un vélo volé mérite d&apos;être recherché.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-300">
                Les détails s&apos;effacent vite&nbsp;: la marque des pneus, l&apos;emplacement
                de la gravure, le type d&apos;antivol. Décrivez votre vélo tant que vous
                l&apos;avez encore en mémoire, et gardez un dossier réutilisable auprès de
                chaque interlocuteur.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100">
                  <Link href="/declarer">
                    Déclarer mon vélo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  Démonstration&nbsp;: aucune donnée n&apos;est enregistrée
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
