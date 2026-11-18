import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  GitCompareArrows,
  Layers,
  MapPin,
  ScanSearch,
  Share2,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Fonctionnalités à venir",
  description:
    "Ce que fait déjà la maquette, et ce qui reste à construire : recherche d'annonces, rapprochement, alertes et partage du dossier. Aucune de ces fonctionnalités n'est active.",
  alternates: { canonical: "/fonctionnalites" },
};

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
  status: string;
  variant: "success" | "warning" | "neutral";
};

const DONE: Feature[] = [
  {
    icon: Layers,
    title: "Formulaire guidé en quatre étapes",
    text: "Identification du vélo, circonstances du vol, coordonnées et récapitulatif. Les contrôles sont faits dans le navigateur, avec un message d’erreur clair et une navigation arrière qui conserve la saisie.",
    status: "Disponible",
    variant: "success",
  },
  {
    icon: ShieldCheck,
    title: "Dossier structuré et référence de démonstration",
    text: "Le récapitulatif reprend toutes les informations utiles à un dépôt de plainte. La référence affichée à la fin est générée dans le navigateur, à titre d’exemple.",
    status: "Disponible",
    variant: "success",
  },
];

const TODO: Feature[] = [
  {
    icon: ScanSearch,
    title: "Recherche d’annonces sur les plateformes de vente",
    text: "Interroger les petites annonces pour retrouver un vélo correspondant au dossier. Cette fonctionnalité n’est pas développée : aucune recherche n’est lancée, aucun résultat n’est affiché.",
    status: "À venir",
    variant: "warning",
  },
  {
    icon: GitCompareArrows,
    title: "Rapprochement et score de correspondance",
    text: "Comparer une annonce au dossier déclaré, classer les pistes par degré de probabilité et assumer les faux positifs. Rien de ce tri n’existe aujourd’hui.",
    status: "À venir",
    variant: "warning",
  },
  {
    icon: BellRing,
    title: "Alertes par courriel",
    text: "Prévenir l’auteur du dossier quand une piste sérieuse apparaît. Aucun envoi de courriel n’est programmé dans cette maquette.",
    status: "À venir",
    variant: "warning",
  },
  {
    icon: Share2,
    title: "Dossier partageable",
    text: "Un lien de consultation pour transmettre le dossier au commissariat, à l’assureur ou à un proche, avec un accès maîtrisé. Le partage n’est pas implémenté.",
    status: "À venir",
    variant: "warning",
  },
  {
    icon: MapPin,
    title: "Carte des vols déclarés",
    text: "Visualiser les zones où des vélos ont été déclarés volés. La publication des dossiers suppose un consentement explicite et une anonymisation du lieu.",
    status: "À l’étude",
    variant: "neutral",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <Card className="animate-fade-up">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <Badge variant={feature.variant}>{feature.status}</Badge>
        </div>
        <h3 className="mt-5 text-base font-semibold tracking-tight text-zinc-900">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.text}</p>
      </CardContent>
    </Card>
  );
}

export default function FonctionnalitesPage() {
  return (
    <>
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Badge variant="outline">Démonstration — aucune donnée enregistrée</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Ce qui fonctionne,
            <br />
            <span className="text-indigo-600">et ce qui reste à construire.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Cette page sert de feuille de route honnête. Elle sépare ce que la maquette
            fait réellement de ce qui n&apos;est encore qu&apos;un projet. Rien de ce qui
            est annoncé comme &quot;à venir&quot; ne fonctionne.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="shadow-card">
              <Link href="/declarer">
                Essayer le formulaire
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tarification">Voir la page Tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200/80 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Disponible
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Ce que la maquette fait vraiment
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {DONE.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              À venir
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Les fonctionnalités de recherche
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-600">
              C&apos;est le cœur du service imaginé, et c&apos;est précisément la partie
              non développée. Les mentions de Leboncoin, Vinted ou eBay expliquent le
              concept&nbsp;; elles ne doivent pas laisser croire qu&apos;une surveillance
              d&apos;annonces est en cours.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TODO.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
