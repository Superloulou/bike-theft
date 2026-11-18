import { CheckboxField } from '@/components/form/fields';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';
import Link from 'next/link';
import type { StepProps } from '@/components/form/steps/types';
import type { ReactNode } from 'react';

type RecapProps = StepProps & {
  onEdit: (stepIndex: number) => void;
};

function value(raw: string | undefined): string {
  const text = (raw ?? '').trim();
  return text.length > 0 ? text : '—';
}

/** Formate la valeur du champ `datetime-local` en français lisible. */
function formatVol(raw: string | undefined): string {
  const text = (raw ?? '').trim();
  if (text.length === 0) return '—';
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="text-sm font-medium text-zinc-900">{children}</dd>
    </div>
  );
}

function Section({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (stepIndex: number) => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-card">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-zinc-500 hover:text-zinc-900"
          onClick={() => onEdit(stepIndex)}
        >
          <PencilLine className="h-3.5 w-3.5" />
          Modifier
        </Button>
      </div>
      <dl className="divide-y divide-zinc-100">{children}</dl>
    </section>
  );
}

function YesNo({ value }: { value: boolean }) {
  return <>{value ? 'Oui' : 'Non'}</>;
}

export function StepRecap({ draft, errors, setFlag, onEdit }: RecapProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Vérifiez les informations saisies. En retournant à une étape, la
        déclaration reste remplie&nbsp;: rien n’est effacé.
      </div>

      <Section title="Identification du vélo" stepIndex={0} onEdit={onEdit}>
        <Row label="Catégorie">{value(draft.identity.category)}</Row>
        <Row label="Marque">{value(draft.identity.brand)}</Row>
        <Row label="Modèle">{value(draft.identity.model)}</Row>
        <Row label="Numéro de série">
          {draft.identity.frameNumberHidden
            ? 'Non connu'
            : value(draft.identity.frameNumber)}
        </Row>
        <Row label="Année">{value(draft.identity.year)}</Row>
        <Row label="Prix d’achat">{value(draft.identity.purchasePrice)}</Row>
        <Row label="Marquage">
          {value(draft.antiTheft.code)}
          {draft.antiTheft.codeRegistered ? ' (enregistré à mon nom)' : ''}
        </Row>
      </Section>

      <Section title="Apparence" stepIndex={0} onEdit={onEdit}>
        <Row label="Couleur principale">{value(draft.appearance.colorMain)}</Row>
        <Row label="Couleur secondaire">
          {value(draft.appearance.colorSecondary)}
        </Row>
        <Row label="Taille de cadre">{value(draft.appearance.frameSize)}</Row>
        <Row label="Matériau du cadre">{value(draft.appearance.frameMaterial)}</Row>
        <Row label="Taille de roues">{value(draft.appearance.wheelSize)}</Row>
      </Section>

      <Section title="Signes distinctifs" stepIndex={0} onEdit={onEdit}>
        <Row label="Autocollants">{value(draft.marks.stickers)}</Row>
        <Row label="Gravures">{value(draft.marks.engravings)}</Row>
        <Row label="Rayures et chocs">{value(draft.marks.scratches)}</Row>
        <Row label="Peinture">{value(draft.marks.repaint)}</Row>
        <Row label="Pièces modifiées">{value(draft.marks.customParts)}</Row>
        <Row label="Photos">{value(draft.marks.photos)}</Row>
      </Section>

      <Section title="Circonstances du vol" stepIndex={1} onEdit={onEdit}>
        <Row label="Date et heure">
          {formatVol(draft.location.stolenAt)}
          {draft.location.timeApprox ? ' (heure approximative)' : ''}
        </Row>
        <Row label="Adresse">{value(draft.location.address)}</Row>
        <Row label="Code postal">{value(draft.location.postalCode)}</Row>
        <Row label="Ville">{value(draft.location.city)}</Row>
        <Row label="Département">{value(draft.location.departement)}</Row>
        <Row label="Type de lieu">{value(draft.location.placeType)}</Row>
        <Row label="Verrouillé">
          <YesNo value={draft.location.wasLocked} />
        </Row>
        <Row label="Antivol">{value(draft.location.lockType)}</Row>
        <Row label="Circonstances">{value(draft.location.policeReport)}</Row>
      </Section>

      <Section title="Vos coordonnées" stepIndex={2} onEdit={onEdit}>
        <Row label="Prénom">{value(draft.contact.firstName)}</Row>
        <Row label="Nom">{value(draft.contact.lastName)}</Row>
        <Row label="E-mail">{value(draft.contact.email)}</Row>
        <Row label="Téléphone">{value(draft.contact.phone)}</Row>
      </Section>

      <div className="space-y-4 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-card">
        <CheckboxField
          label="J’accepte la politique de confidentialité"
          description={
            <>
              Dans cette maquette, aucune donnée n’est transmise ni enregistrée.
              En production, vos coordonnées serviraient uniquement à confirmer
              que le vélo retrouvé est bien le vôtre (voir{' '}
              <Link
                href="/confidentialite"
                className="font-medium text-indigo-700 underline underline-offset-4"
              >
                politique de confidentialité
              </Link>
              ).
            </>
          }
          checked={draft.consent}
          onCheckedChange={(consent) => setFlag('consent', consent)}
          error={errors['consent']}
        />

        <CheckboxField
          label="Je souhaite être averti si une annonce correspond à mon vélo"
          description="Fonctionnalité à venir : la surveillance des annonces n’est pas activée dans cette démonstration."
          checked={draft.notify}
          onCheckedChange={(notify) => setFlag('notify', notify)}
        />
      </div>
    </div>
  );
}
