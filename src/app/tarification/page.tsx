import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, User, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Tarifs",
  description:
    "La déclaration est gratuite dans cette maquette. Les tarifs présentés sont des hypothèses de travail, non une offre commerciale.",
  alternates: { canonical: "/tarification" },
};

const FORMULES = [
  {
    icon: User,
    name: "Particulier",
    price: "Gratuit",
    period: "dans cette maquette",
    current: true,
    items: [
      "Déclaration en quatre étapes",
      "Récapitulatif prêt à recopier pour un dépôt de plainte",
      "Référence de démonstration générée dans le navigateur",
    ],
    note: "Aucun paiement n’est demandé et aucune donnée n’est conservée.",
  },
  {
    icon: Building2,
    name: "Commerce de vélo / atelier",
    price: "Non fixé",
    period: "formule envisagée",
    current: false,
    items: [
      "Déclarations multiples pour un même établissement",
      "Suivi des vélos vendus et de leur marquage",
      "Interlocuteur unique en cas de piste",
    ],
    note: "Cette formule n’existe pas encore : aucun tarif n’est proposé, aucun abonnement n’est ouvert.",
  },
  {
    icon: Wallet,
    name: "Assureur / collectivité",
    price: "Non fixé",
    period: "piste de travail",
    current: false,
    items: [
      "Import des dossiers déclarés par les assurés",
      "Statistiques locales de vols déclarés",
      "Accès via une API documentée",
    ],
    note: "Simple hypothèse de modèle économique, sans engagement commercial.",
  },
];

export default function TarificationPage() {
  return (
    <>
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Badge variant="outline">Démonstration — aucune donnée enregistrée</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Déclarer un vélo volé&nbsp;:
            <br />
            <span className="text-indigo-600">gratuit dans cette maquette.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Cette page explique comment le service pourrait être financé plus tard. Elle
            n&apos;est pas une offre&nbsp;: aucun tarif n&apos;est engagé, aucun paiement
            n&apos;est possible et aucun formulaire de contact commercial n&apos;est
            actif.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="shadow-card">
              <Link href="/declarer">
                Déclarer le vol de mon vélo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/fonctionnalites">Fonctionnalités à venir</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200/80 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {FORMULES.map((formule) => {
              const Icon = formule.icon;
              return (
                <Card
                  key={formule.name}
                  className={`animate-fade-up ${
                    formule.current ? "shadow-card ring-1 ring-indigo-200" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {formule.current ? (
                        <Badge variant="success">Ce qui est testé</Badge>
                      ) : (
                        <Badge variant="warning">À l&apos;étude</Badge>
                      )}
                    </div>
                    <h2 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">
                      {formule.name}
                    </h2>
                    <p className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">
                      {formule.price}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">{formule.period}</p>
                    <ul className="mt-6 space-y-2.5">
                      {formule.items.map((item) => (
                        <li key={item} className="flex gap-2.5 text-sm text-zinc-600">
                          <BadgeCheck
                            className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p
                      className="mt-6 border-t border-zinc-200 pt-4 text-[13px] leading-relaxed text-zinc-500"
                    >
                      {formule.note}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-base font-semibold tracking-tight text-amber-900">
              Ce que ces tarifs ne sont pas
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900/90">
              <li>
                Une offre commerciale&nbsp;: aucun paiement, aucun devis, aucun
                abonnement n&apos;est proposé.
              </li>
              <li>
                Un partenariat&nbsp;: aucune plateforme de vente, assurance ou
                collectivité n&apos;a validé ces formules.
              </li>
              <li>
                Une garantie de service&nbsp;: la recherche d&apos;annonces, base de
                donnée et les alertes restent à construire.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
