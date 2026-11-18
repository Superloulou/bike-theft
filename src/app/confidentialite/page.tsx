import type { Metadata } from "next";

import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de la maquette Vélo Signalé : aucune donnée personnelle n’est collectée, transmise ni conservée. Les points à préciser avant la mise en production sont explicitement indiqués.",
  alternates: { canonical: "/confidentialite" },
};

type Section = {
  title: string;
  body: string[];
  pending?: boolean;
};

const SECTIONS: Section[] = [
  {
    title: "Aucune donnée personnelle n’est collectée",
    body: [
      "Vélo Signalé est actuellement une maquette de démonstration. Dans son état actuel, le site ne collecte, ne transmet et ne conserve aucune donnée personnelle : ni nom, ni adresse, ni courriel, ni numéro de téléphone, ni adresse IP associée à un dossier.",
      "Le site ne dépose aucun cookie de mesure d’audience, aucun traceur publicitaire et aucun pixel tiers. Aucun service d’analyse d’audience n’est activé.",
    ],
  },
  {
    title: "Ce que devient ce que vous saisissez dans le formulaire",
    body: [
      "Le formulaire de déclaration fonctionne entièrement dans votre navigateur. Les informations que vous tapez restent en mémoire le temps de la visite : elles servent uniquement à afficher le récapitulatif et à valider la saisie étape par étape.",
      "Elles ne sont envoyées à aucun serveur, ni à Vélo Signalé, ni à un tiers. Elles ne sont enregistrées dans aucune base de données. Elles ne sont pas non plus conservées dans le navigateur : si vous fermez l’onglet ou rechargez la page, la saisie est perdue.",
      "La référence affichée à la fin (par exemple VS-7KQ2-M4TB) est fabriquée de façon aléatoire par votre navigateur. Elle ne correspond à aucun enregistrement existant et ne permet à personne de retrouver un dossier.",
    ],
  },
  {
    title: "Responsable du traitement",
    pending: true,
    body: [
      "Dès que le service collectera réellement des déclarations, un responsable de traitement devra être désigné et identifié ici : dénomination, forme juridique, adresse et adresse de contact dédiée aux demandes relatives aux données personnelles.",
      "Cette section volontairement incomplète ne doit pas être prise pour une information légale valide.",
    ],
  },
  {
    title: "Finalités et base légale du traitement futur",
    pending: true,
    body: [
      "Dans la version complète du service, les données saisies serviraient à constituer un dossier de recherche, à rapprocher ce dossier d’annonces publiées sur des plateformes de vente d’occasion, et — si l’utilisateur le demande — à l’avertir par courriel en cas de correspondance.",
      "Les finalités, la base légale (consentement, intérêt légitime ou exécution d’un service demandé par l’intéressé) et les durées de conservation associées devront être formalisées avant toute collecte réelle, puis détaillées dans la présente politique.",
    ],
  },
  {
    title: "Destinataires des données",
    body: [
      "Dans cette maquette : aucun destinataire. Rien n’est transmis.",
      "Pour le service futur, la liste des destinataires (prestataire d’hébergement, éventuel prestataire technique, et l’utilisateur lui-même pour le partage de son dossier) devra être publiée, accompagnée des garanties prévues lorsque des sous-traitants interviennent en dehors de l’Union européenne.",
    ],
  },
  {
    title: "Durée de conservation",
    pending: true,
    body: [
      "Dans cette maquette, aucune donnée n’est conservée : il n’existe donc aucun délai de conservation à appliquer.",
      "Pour le service futur, des durées distinctes devront être définies pour le dossier de déclaration, les correspondances détectées, les demandes d’alerte et les journaux techniques, avec un mécanisme de suppression ou d’anonymisation à l’échéance.",
    ],
  },
  {
    title: "Vos droits sur vos données",
    body: [
      "Le règlement général sur la protection des données vous ouvre un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité, ainsi que le droit de définir le sort de vos données après votre décès.",
      "Dans l’état actuel de la maquette, ces droits n’ont pas d’objet : aucune donnée personnelle n’est détenue, donc aucune donnée n’est à consulter, à corriger ni à supprimer. Une adresse de contact effective devra être publiée avant la mise en production pour permettre de les exercer.",
      "Vous pouvez également introduire une réclamation auprès de la Commission nationale de l’informatique et des libertés.",
    ],
  },
  {
    title: "Sécurité",
    pending: true,
    body: [
      "La maquette n’a pas de données à protéger, et aucune mesure de sécurité particulière n’a été mise en œuvre pour elle.",
      "Avant la mise en production, le service devra documenter ses mesures : chiffrement du transport, cloisonnement des accès, sauvegardes chiffrées, journalisation, gestion des habilitations et procédure en cas d’incident.",
    ],
  },
  {
    title: "Photographies et liens vers un dossier partagé",
    body: [
      "Cette maquette ne permet pas de téléverser de photographie : les champs prévus à cet effet ne prennent que du texte, et rien n’est envoyé.",
      "Si vous y collez un lien vers un dossier partagé, ce lien reste dans votre navigateur et n’est transmis à personne. Il n’est pas ouvert, pas analysé et pas enregistré.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <>
      <section className="border-b border-zinc-200/80 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl animate-fade-up">
            <Badge variant="outline">Maquette — aucune donnée collectée</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Politique de confidentialité
              <span className="block text-indigo-600">et transparence totale.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Cette page décrit ce qui se passe vraiment : dans cette maquette, rien n’est
              collecté, rien n’est envoyé, rien n’est conservé. Les sections qui concernent le
              futur service sont marquées comme restant à préciser.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
                    {section.title}
                  </h2>
                  {section.pending ? <Badge variant="warning">À préciser</Badge> : null}
                </div>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-amber-900">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              À faire avant la mise en production
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900/90">
              <li>
                Désigner le responsable du traitement et publier son identité ainsi qu’un adresse
                de contact réellement surveillée.
              </li>
              <li>
                Formaliser les finalités, la base légale, les durées de conservation et la liste
                des destinataires avant la première collecte.
              </li>
              <li>
                Documenter les mesures de sécurité, les éventuels sous-traitants et la procédure
                en cas d’incident, puis vérifier l’ensemble de cette politique.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
