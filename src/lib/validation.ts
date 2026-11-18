import type { ReportDraft } from './types';

export type StepId = 'identite' | 'lieu' | 'contact' | 'recap';

export const STEPS: { id: StepId; label: string; short: string }[] = [
  { id: 'identite', label: 'Identification du vélo', short: 'Vélo' },
  { id: 'lieu', label: 'Informations sur le vol', short: 'Vol' },
  { id: 'contact', label: 'Vos coordonnées', short: 'Coordonnées' },
  { id: 'recap', label: 'Récapitulatif', short: 'Récapitulatif' },
];

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
const POSTAL_RE = /^\d{5}$/;

const required = (value: string): boolean => value.trim().length > 0;

function validateContact(draft: ReportDraft, errors: FieldErrors) {
  if (!required(draft.contact.firstName)) errors['contact.firstName'] = 'Indiquez votre prénom.';
  if (!required(draft.contact.lastName)) errors['contact.lastName'] = 'Indiquez votre nom.';
  if (!EMAIL_RE.test(draft.contact.email.trim())) errors['contact.email'] = 'Adresse e-mail invalide.';
  // Le téléphone est facultatif, mais doit être valide lorsqu’il est renseigné.
  if (required(draft.contact.phone) && !PHONE_RE.test(draft.contact.phone.trim()))
    errors['contact.phone'] = 'Numéro de téléphone invalide. Format attendu : 06 12 34 56 78.';
}

function validateLocation(draft: ReportDraft, errors: FieldErrors) {
  if (!POSTAL_RE.test(draft.location.postalCode.trim())) errors['location.postalCode'] = 'Code postal à 5 chiffres.';
  if (!required(draft.location.city)) errors['location.city'] = 'Indiquez la ville du vol.';
  if (!required(draft.location.departement)) errors['location.departement'] = 'Indiquez le département du lieu du vol.';
  if (!required(draft.location.placeType)) errors['location.placeType'] = 'Précisez le type de lieu.';
  if (!required(draft.location.stolenAt)) errors['location.stolenAt'] = 'Indiquez la date du vol.';
  else if (new Date(draft.location.stolenAt).getTime() > Date.now())
    errors['location.stolenAt'] = 'La date ne peut pas être dans le futur.';
  if (draft.location.wasLocked && !required(draft.location.lockType))
    errors['location.lockType'] = 'Précisez le type d’antivol utilisé.';
}

function validateIdentity(draft: ReportDraft, errors: FieldErrors) {
  if (!required(draft.identity.category)) errors['identity.category'] = 'Sélectionnez la catégorie du vélo.';
  if (!required(draft.identity.brand)) errors['identity.brand'] = 'Indiquez la marque.';
  if (!required(draft.appearance.colorMain)) errors['appearance.colorMain'] = 'Indiquez la couleur principale.';
  // Le numéro de série est facultatif, mais doit être cohérent lorsqu’il est saisi.
  if (draft.identity.frameNumber && draft.identity.frameNumber.trim().length < 4)
    errors['identity.frameNumber'] = 'Le numéro de série semble incomplet.';
  if (required(draft.identity.year)) {
    const year = Number(draft.identity.year);
    if (!Number.isInteger(year) || year < 1970 || year > new Date().getFullYear() + 1)
      errors['identity.year'] = 'Année d’achat invalide.';
  }
  if (required(draft.identity.purchasePrice)) {
    const price = Number(draft.identity.purchasePrice);
    if (Number.isNaN(price) || price < 0) errors['identity.purchasePrice'] = 'Prix invalide.';
  }
  // Un signe distinctif au moins : c’est ce qui permet de prouver que le vélo retrouvé est le vôtre.
  const hasDetail =
    required(draft.marks.stickers) ||
    required(draft.marks.engravings) ||
    required(draft.marks.scratches) ||
    required(draft.marks.customParts) ||
    required(draft.marks.repaint);
  if (!hasDetail)
    errors['marks.details'] =
      'Décrivez au moins un signe distinctif : c’est ce qui permet de prouver que le vélo retrouvé est bien le vôtre.';

  if (draft.antiTheft.codeRegistered && !required(draft.antiTheft.code))
    errors['antiTheft.code'] = 'Précisez le code de marquage enregistré.';
}

function validateRecap(draft: ReportDraft, errors: FieldErrors) {
  if (!draft.consent)
    errors['consent'] = 'Vous devez accepter la politique de confidentialité pour valider la déclaration.';
}

const VALIDATORS: Record<StepId, (draft: ReportDraft, errors: FieldErrors) => void> = {
  identite: validateIdentity,
  lieu: validateLocation,
  contact: validateContact,
  recap: validateRecap,
};

export function validateStep(step: StepId, draft: ReportDraft): FieldErrors {
  const errors: FieldErrors = {};
  VALIDATORS[step](draft, errors);
  return errors;
}

export function validateDraft(draft: ReportDraft): FieldErrors {
  const errors: FieldErrors = {};
  for (const step of STEPS) VALIDATORS[step.id](draft, errors);
  return errors;
}

/** Taux de complétude : sert à mesurer la qualité du dossier de recherche. */
export function completeness(draft: ReportDraft): number {
  const fields = [
    draft.contact.firstName,
    draft.contact.lastName,
    draft.contact.email,
    draft.contact.phone,
    draft.location.postalCode,
    draft.location.city,
    draft.location.departement,
    draft.location.address,
    draft.location.stolenAt,
    draft.location.policeReport,
    draft.identity.category,
    draft.identity.brand,
    draft.identity.model,
    draft.identity.frameNumber,
    draft.identity.year,
    draft.identity.purchasePrice,
    draft.identity.purchasePlace,
    draft.appearance.colorMain,
    draft.appearance.colorSecondary,
    draft.appearance.frameMaterial,
    draft.appearance.frameSize,
    draft.appearance.wheelSize,
    draft.appearance.speed,
    draft.appearance.brakes,
    draft.marks.stickers,
    draft.marks.engravings,
    draft.marks.scratches,
    draft.marks.customParts,
    draft.antiTheft.code,
    draft.antiTheft.antivolMain,
  ];
  const filled = fields.filter((value) => required(value)).length;
  return Math.round((filled / fields.length) * 100);
}
