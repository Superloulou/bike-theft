import { STEPS, validateStep, type FieldErrors, type StepId } from '@/lib/validation';
import type { ReportDraft } from '@/lib/types';

export const TOTAL_STEPS = STEPS.length;

/** Erreurs du périmètre d'une étape : les autres étapes restent silencieuses. */
export function errorsForStep(draft: ReportDraft, step: StepId): FieldErrors {
  return validateStep(step, draft);
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Index de la première étape (dans l'ordre du parcours) contenant une erreur. */
export function firstFailingStep(draft: ReportDraft, from = 0): number {
  for (let index = from; index < STEPS.length; index += 1) {
    if (hasErrors(validateStep(STEPS[index].id, draft))) return index;
  }
  return -1;
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomBlock(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('');
}

/**
 * Maquette : la référence est fabriquée côté navigateur sur le format de
 * `generateReference()` côté serveur, sans aucun appel réseau.
 */
export function mockReference(): string {
  return `VS-${randomBlock(4)}-${randomBlock(4)}`;
}
