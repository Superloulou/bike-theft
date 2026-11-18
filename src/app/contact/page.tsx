import Link from "next/link";
import { ArrowRight, AtSign, MailX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Contact",
  description:
    "Comment joindre le projet Vélo Signalé. Dans cette maquette, aucun formulaire de contact n'est actif et aucun courriel n'est envoyé.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl animate-fade-up">
            <Badge variant="outline">Démonstration — aucune donnée enregistrée</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Nous contacter
              <span className="block text-indigo-600">sans faux formulaire.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Cette page explique honnêtement ce qui est possible aujourd&apos;hui. Aucun
              formulaire de contact n&apos;est actif dans cette maquette&nbsp;: aucune adresse
              fictive n&apos;est affichée pour simuler une adresse réelle.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="animate-fade-up">
              <CardContent className="pt-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700"
                >
                  <MailX className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold tracking-tight text-zinc-900">
                  Ce qui n&apos;est pas actif
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-600">
                  <li>Aucun formulaire de contact&nbsp;: aucun champ, aucun envoi.</li>
                  <li>Aucun courriel envoyé, reçu ou archivé par ce site.</li>
                  <li>Aucune adresse, aucun téléphone et aucune adresse postale inventés.</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="animate-fade-up shadow-card ring-1 ring-indigo-200">
              <CardContent className="pt-6">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"
                >
                  <AtSign className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-base font-semibold tracking-tight text-zinc-900">
                  Ce qui sera publié au lancement
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  Quand le service existera, cette page affichera une adresse de contact réelle
                  et un canal pour les demandes relatives aux données personnelles. Le champ
                  réservé ci-dessous indique le format prévu, sans simuler une adresse existante.
                </p>
                <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
                  <p className="text-[13px] font-medium uppercase tracking-wider text-zinc-500">
                    Adresse de contact
                  </p>
                  <p className="mt-1 font-medium text-zinc-900">
                    à publier avant la mise en production
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/declarer">
                Déclarer le vol de mon vélo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/confidentialite">Politique de confidentialité</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
