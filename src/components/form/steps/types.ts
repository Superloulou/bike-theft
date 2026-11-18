import type { FieldErrors } from '@/lib/validation';
import type { ReportDraft } from '@/lib/types';

export type SectionKey =
  | 'contact'
  | 'location'
  | 'identity'
  | 'appearance'
  | 'marks'
  | 'antiTheft';

export type SectionValue<K extends SectionKey> = Partial<ReportDraft[K]>;

export interface StepProps {
  draft: ReportDraft;
  /** Erreurs renvoyées par `validateStep` pour l'étape affichée. */
  errors: FieldErrors;
  /** Mise à jour partielle d'une rubrique du dossier. */
  setSection: <K extends SectionKey>(section: K, value: SectionValue<K>) => void;
  /** Mise à jour des deux consentements stockés à la racine du dossier. */
  setFlag: (key: 'consent' | 'notify', value: boolean) => void;
}
