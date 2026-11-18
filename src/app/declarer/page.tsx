'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, PencilLine, Sparkles, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StepIdentite } from '@/components/form/steps/step-identite';
import { StepLieu } from '@/components/form/steps/step-lieu';
import { StepContact } from '@/components/form/steps/step-contact';
import { StepRecap } from '@/components/form/steps/step-recap';
import type { StepProps } from '@/components/form/steps/types';
import {
  firstFailingStep,
  errorsForStep,
  hasErrors,
  mockReference,
  TOTAL_STEPS,
} from '@/components/form/state';
import { emptyDraft, type ReportDraft } from '@/lib/types';
import type { SectionKey, SectionValue } from '@/components/form/steps/types';
import { STEPS, type FieldErrors } from '@/lib/validation';

/**
 * Brouillon de démonstration : toutes les valeurs sont volontairement fictives.
 * Il sert uniquement à parcourir le parcours sans tout ressaisir.
 */
function demoDraft(): ReportDraft {
  const draft = emptyDraft();
  draft.identity = {
    ...draft.identity,
    category: 'Électrique',
    brand: 'Empower',
    model: 'E-City 500',
    frameNumber: 'EMP2203471',
    year: '2022',
    purchasePrice: '1490',
    purchasePlace: 'Cycles Exemple, Lyon',
    invoiceAvailable: true,
    ownerNameOnInvoice: 'Camille Rousseau',
  };
  draft.appearance = {
    ...draft.appearance,
    colorMain: 'Bleu nuit',
    colorSecondary: 'Gris',
    frameMaterial: 'Aluminium',
    frameSize: 'M',
    wheelSize: '28" / 700',
    gender: 'Mixte',
    speed: '8 vitesses',
    brakes: 'Disque hydraulique',
    lights: 'Oui',
    bell: 'Oui',
    rack: 'Non',
    fenders: 'Oui',
    kickstand: 'Oui',
    basket: 'Non',
    childSeat: 'Non',
    computer: 'Inconnu',
  };
  draft.marks = {
    ...draft.marks,
    stickers: 'Autocollant “Cyclo Lyonnais” décollé sur le tube diagonal.',
    scratches: 'Rayure verticale de 4 cm sur la base arrière gauche.',
    photos: '3 photos dans mon téléphone : cadre, antivol, lieu du vol.',
  };
  draft.antiTheft = {
    ...draft.antiTheft,
    code: '75AB12345',
    codeRegistered: true,
    antivolMain: 'Antivol U',
    antivolSecondary: 'Chaîne',
    gpsTracker: false,
  };
  draft.location = {
    ...draft.location,
    postalCode: '69003',
    city: 'Lyon',
    address: 'Place Guichard, devant le n° 5',
    placeType: 'Rue / trottoir',
    stolenAt: '2025-01-14T18:30',
    timeApprox: true,
    departement: '69',
    wasLocked: true,
    lockType: 'Antivol U',
    policeReport: 'Vol constaté le soir, antivol U sectionné. Dépôt de plainte au commissariat des Cordeliers.',
  };
  draft.contact = {
    firstName: 'Camille',
    lastName: 'Rousseau',
    email: 'camille.rousseau@example.fr',
    phone: '06 12 34 56 78',
  };
  draft.consent = true;
  draft.notify = true;
  return draft;
}

export default function DeclarerPage() {
  const [draft, setDraft] = useState<ReportDraft>(emptyDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [reference, setReference] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const progress = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100);
  const errorCount = Object.keys(errors).length;

  const setSection = <K extends SectionKey>(section: K, value: SectionValue<K>): void => {
    setDraft((current) => ({ ...current, [section]: { ...current[section], ...value } }));
  };

  const setFlag = (key: 'consent' | 'notify', value: boolean): void => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const goTo = (index: number): void => {
    setStepIndex(Math.max(0, Math.min(TOTAL_STEPS - 1, index)));
    setErrors({});
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = (): void => {
    const stepErrors = errorsForStep(draft, step.id);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    goTo(stepIndex + 1);
  };

  const handlePrevious = (): void => {
    goTo(stepIndex - 1);
  };

  const handleSubmit = (): void => {
    const recapErrors = errorsForStep(draft, 'recap');
    if (hasErrors(recapErrors)) {
      setErrors(recapErrors);
      return;
    }
    const failing = firstFailingStep(draft);
    if (failing >= 0) {
      setStepIndex(failing);
      setErrors(errorsForStep(draft, STEPS[failing].id));
      return;
    }
    setReference(mockReference());
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = (): void => {
    setDraft(emptyDraft());
    setStepIndex(0);
    setErrors({});
  };

  if (reference) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-card sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Déclaration de démonstration terminée
            </h1>
          </div>

          <p className="mt-5 text-base text-zinc-600">
            Vous êtes arrivé au bout du parcours. Cette confirmation est <strong>simulée</strong> :
            aucune donnée n’a été envoyée, aucun e-mail ne vous sera adressé et aucune veille sur des
            sites de vente n’a été lancée.
          </p>

          <dl className="mt-6 grid gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50 p-5 sm:grid-cols-[12rem_1fr]">
            <dt className="text-sm text-zinc-500">Référence affichée</dt>
            <dd className="font-mono text-sm font-semibold text-zinc-900">{reference}</dd>
            <dt className="text-sm text-zinc-500">Origine de la référence</dt>
            <dd className="text-sm text-zinc-700">
              Générée côté navigateur, à titre d’exemple. Elle n’est enregistrée nulle part et ne
              permet pas de retrouver une déclaration.
            </dd>
          </dl>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Dans la version finale, cette étape enverrait un accusé de réception et ouvrirait un
            dossier consultable. Ces fonctionnalités sont annoncées « à venir » et ne sont pas
            activées ici.
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => setReference(null)}>
              <PencilLine className="h-4 w-4" aria-hidden="true" />
              Modifier la déclaration
            </Button>
            <Button variant="outline" onClick={reset}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Recommencer à zéro
            </Button>
            <Button asChild variant="ghost">
              <Link href="/dossier/VS-DEMO-2401">Voir un exemple de dossier</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stepProps: StepProps = { draft, errors, setSection, setFlag };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-medium text-indigo-700">Déclaration de vol</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Décrire le vélo volé
        </h1>
        <p className="mt-3 text-base text-zinc-600">
          Quatre étapes, enregistrées dans votre navigateur. Rien n’est transmis : cette page est une
          maquette de démonstration.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setDraft(demoDraft())}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Préremplir avec un exemple fictif
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Tout effacer
          </Button>
        </div>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-card sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-medium text-zinc-500" aria-live="polite">
            Étape {stepIndex + 1} sur {TOTAL_STEPS} — {step.label}
          </p>
          <p className="text-sm text-zinc-500">{progress} %</p>
        </div>
        <Progress value={progress} className="mt-3" />

        <ol className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {STEPS.map((entry, index) => (
            <li key={entry.id}>
              {index < stepIndex ? (
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  className="inline-flex items-center gap-1.5 text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  {entry.short}
                </button>
              ) : (
                <span
                  className={
                    index === stepIndex ? 'font-semibold text-zinc-900' : 'text-zinc-400'
                  }
                  aria-current={index === stepIndex ? 'step' : undefined}
                >
                  {entry.short}
                </span>
              )}
            </li>
          ))}
        </ol>

        <hr className="my-6 border-zinc-200/80" />

        {errorCount > 0 && (
          <div
            className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
            role="alert"
          >
            <p className="font-semibold">
              {errorCount === 1
                ? 'Un champ demande une correction.'
                : `${errorCount} champs demandent une correction.`}
            </p>
            <p className="mt-1 text-rose-800">
              Les champs concernés sont signalés juste sous le champ, en rouge.
            </p>
          </div>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (stepIndex === TOTAL_STEPS - 1) handleSubmit();
            else handleNext();
          }}
          noValidate
        >
          {step.id === 'identite' && <StepIdentite {...stepProps} />}
          {step.id === 'lieu' && <StepLieu {...stepProps} />}
          {step.id === 'contact' && <StepContact {...stepProps} />}
          {step.id === 'recap' && <StepRecap {...stepProps} onEdit={goTo} />}

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-zinc-200/80 pt-6">
            {stepIndex > 0 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Précédent
              </Button>
            )}
            {stepIndex < TOTAL_STEPS - 1 ? (
              <Button type="submit">
                Continuer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" size="lg">
                Valider ma déclaration
              </Button>
            )}
            <p className="text-sm text-zinc-500">
              Les champs marqués « Obligatoire » sont nécessaires pour passer à l’étape suivante.
            </p>
          </div>
        </form>
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        Besoin d’aide avant de commencer ? Consultez le{' '}
        <Link href="/guide" className="font-medium text-indigo-700 underline underline-offset-4">
          guide du dépôt de plainte et du marquage
        </Link>
        .
      </p>
    </div>
  );
}
