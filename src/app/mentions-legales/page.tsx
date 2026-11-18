import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de la maquette Vélo Signalé. Nature du service, édition et hébergement : les informations à compléter avant la mise en production sont explicitement indiquées.",
  alternates: { canonical: "/mentions-legales" },
};

const SECTIONS: { title: string; body: string[]; pending?: boolean }[] = [
  {
    title: "Nature du service",
    body: [
      "Ce site est une maquette de démonstration. Il présente un parcours de déclaration du vol d'un vélo et simule une confirmation.",
      "Aucune déclaration n'est transmise à un service de police ou de gendarmerie, aucune donnée n'est enregistrée sur un serveur et aucune recherche d'annonces n'est effectuée.",
    ],
  },
  {
    title: "Éditeur",
    body: [
      "L'identité de l'éditeur, son statut (particulier ou entreprise) et ses coordonnées doivent être renseignés avant toute mise en ligne publique.",
    ],
    pending: true,
  },
  {
    title: "Direction de la publication",
    body: [
      "La personne responsable de la publication doit être indiquée avant la mise en production.",
    ],
    pending: true,
  },
  {
    title: "Hébergement",
    body: [
      "La maquette est conçue pour être déployée par conteneur sur un serveur administré par le projet. Le nom de l'hébergeur, son adresse et les coordonnées de son responsable technique doivent être précisés avant la mise en ligne publique.",
    ],
    pending: true,
  },
  {
    title: "Propriété intellectuelle",
    body: [
      "Les contenus textuels de cette maquette sont rédigés pour le projet. Les marques citées (Leboncoin, Vinted, eBay, BICYCODE) appartiennent à leurs titulaires respectifs : leur mention a une visée informative et n'implique aucun partenariat, aucun agrément et aucune affiliation.",
      "Le projet n'est ni affilié ni approuvé par la FUB et ne distribue pas de gravures BICYCODE.",
    ],
  },
  {
    title: "Responsabilité",
    body: [
      "Les informations pratiques publiées dans le guide (dépôt de plainte, marquage, réflexes sur les plateformes) sont des repères généraux. Elles ne remplacent ni une procédure officielle, ni un conseil juridique.",
      "Une déclaration remplie dans cette maquette n'a aucune valeur probante et ne constitue pas un dépôt de plainte.",
    ],
  },
  {
    title: "Données personnelles",
    body: [
      "Aucune donnée à caractère personnel n'est collectée, transmise ni conservée par cette maquette. Les champs remplis dans le formulaire restent dans le navigateur et disparaissent lors de sa fermeture.",
      "La politique de confidentialité décrit ce point en détail.",
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl animate-fade-up">
            <Badge variant="outline">Maquette — informations incomplètes</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Mentions légales
              <span className="block text-indigo-600">état de la maquette.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Cette page indique ce qui est déjà vrai pour la démonstration et ce qui doit être
              complété avant une publication ouverte. Elle ne contient volontairement aucune
              identité, aucun numéro et aucune adresse inventés.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title} className="scroll-mt-24">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                    {section.title}
                  </h2>
                  {section.pending ? (
                    <Badge variant="warning">À compléter</Badge>
                  ) : null}
                </div>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Avant toute mise en production
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900/90">
              <li>— Renseigner l&apos;éditeur, le responsable de la publication et l&apos;hébergeur.</li>
              <li>— Publier une adresse de contact réelle sur la page Contact.</li>
              <li>
                — Vérifier la politique de confidentialité dès qu&apos;un envoi de données ou un
                service de recherche est activé.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
