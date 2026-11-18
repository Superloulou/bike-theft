import 'server-only';

import {
  ACCESSORIES,
  BRAKES,
  CATEGORIES,
  COLORS,
  FRAME_MATERIALS,
  GENDERS,
  LOCK_TYPES,
  PLACE_TYPES,
  SPEEDS,
  WHEEL_SIZES,
} from './options';
import { generateReference, isValidReference, normalizeReference } from './reference';
import { buildSearchPlan } from './leboncoin';
import { emptyDraft } from './types';
import type {
  ReportDraft,
  ReportRecord,
  SearchPlan,
} from './types';
import { getReport, insertReport } from './db';
import { validateDraft, type FieldErrors } from './validation';

/**
 * Couche serveur uniquement : elle assainit la saisie du formulaire, la
 * convertit en dossier persisté, et reconstruit le plan de recherche.
 * Elle centralise les règles pour que la route API reste très fine.
 */

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

/** Texte libre : on borne la longueur pour éviter les payloads abusifs. */
function text(value: unknown, maxLength = 500): string {
  if (typeof value === 'number') return String(value);
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/**
 * Les listes déroulantes sont fermées : on ne conserve que les valeurs
 * connues. La chaîne vide est acceptée car elle signifie « non renseigné ».
 */
function oneOf<T extends readonly string[]>(value: unknown, options: T): T[number] | '' {
  const v = text(value, 120);
  if (!v) return '';
  return (options as readonly string[]).includes(v) ? (v as T[number]) : '';
}

function bool(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

/** Un accessoire vaut « Oui », « Non », « Inconnu » — ou vide si non renseigné. */
function accessory(value: unknown): string {
  return oneOf(value, ACCESSORIES);
}

function hydrateContact(src: UnknownRecord): ReportDraft['contact'] {
  // Les enregistrements les plus anciens stockaient un seul champ « fullName ».
  const legacy = text(src.fullName, 120);
  const legacyParts = legacy.split(/\s+/);
  return {
    firstName: text(src.firstName, 80) || (legacyParts.length > 1 ? legacyParts.slice(0, -1).join(' ') : legacy),
    lastName: text(src.lastName, 80) || (legacyParts.length > 1 ? legacyParts[legacyParts.length - 1] : ''),
    email: text(src.email, 160).toLowerCase(),
    phone: text(src.phone, 30),
  };
}

function hydrateLocation(src: UnknownRecord): ReportDraft['location'] {
  return {
    postalCode: text(src.postalCode, 20),
    city: text(src.city, 120),
    address: text(src.address, 200),
    placeType: oneOf(src.placeType, PLACE_TYPES),
    stolenAt: text(src.stolenAt, 32),
    timeApprox: bool(src.timeApprox),
    departement: text(src.departement, 60),
    wasLocked: bool(src.wasLocked),
    lockType: oneOf(src.lockType, LOCK_TYPES),
    policeReport: text(src.policeReport, 120),
  };
}

function hydrateIdentity(src: UnknownRecord): ReportDraft['identity'] {
  return {
    category: oneOf(src.category, CATEGORIES),
    brand: text(src.brand, 80),
    model: text(src.model, 120),
    frameNumber: text(src.frameNumber, 80),
    frameNumberHidden: bool(src.frameNumberHidden),
    year: text(src.year, 8),
    purchasePrice: text(src.purchasePrice, 20),
    purchasePlace: text(src.purchasePlace, 120),
    invoiceAvailable: bool(src.invoiceAvailable),
    ownerNameOnInvoice: text(src.ownerNameOnInvoice, 120),
  };
}

function hydrateAppearance(src: UnknownRecord): ReportDraft['appearance'] {
  return {
    colorMain: oneOf(src.colorMain, COLORS),
    colorSecondary: oneOf(src.colorSecondary, COLORS),
    frameMaterial: oneOf(src.frameMaterial, FRAME_MATERIALS),
    frameSize: text(src.frameSize, 40),
    wheelSize: oneOf(src.wheelSize, WHEEL_SIZES),
    gender: oneOf(src.gender, GENDERS),
    speed: oneOf(src.speed, SPEEDS),
    brakes: oneOf(src.brakes, BRAKES),
    lights: accessory(src.lights),
    bell: accessory(src.bell),
    rack: accessory(src.rack),
    fenders: accessory(src.fenders),
    kickstand: accessory(src.kickstand),
    basket: accessory(src.basket),
    childSeat: accessory(src.childSeat),
    computer: accessory(src.computer),
    otherEquipment: text(src.otherEquipment, 300),
  };
}

function hydrateMarks(src: UnknownRecord): ReportDraft['marks'] {
  return {
    stickers: text(src.stickers, 500),
    engravings: text(src.engravings, 500),
    scratches: text(src.scratches, 500),
    repaint: text(src.repaint, 500),
    customParts: text(src.customParts, 500),
    photos: text(src.photos, 2000),
  };
}

function hydrateAntiTheft(src: UnknownRecord): ReportDraft['antiTheft'] {
  return {
    code: text(src.code, 40),
    codeRegistered: bool(src.codeRegistered),
    antivolMain: text(src.antivolMain, 120),
    antivolSecondary: text(src.antivolSecondary, 120),
    gpsTracker: bool(src.gpsTracker),
    gpsBrand: text(src.gpsBrand, 80),
    insurance: bool(src.insurance),
    insuranceRef: text(src.insuranceRef, 120),
  };
}

/** Mélange les données reçues avec un dossier vierge, en filtrant tout le reste. */
export function hydrateDraft(payload: unknown): ReportDraft {
  const src = asRecord(payload);
  const draft = emptyDraft();
  return {
    contact: hydrateContact(asRecord(src.contact)),
    location: hydrateLocation(asRecord(src.location)),
    identity: hydrateIdentity(asRecord(src.identity)),
    appearance: hydrateAppearance(asRecord(src.appearance)),
    marks: hydrateMarks(asRecord(src.marks)),
    antiTheft: hydrateAntiTheft(asRecord(src.antiTheft)),
    consent: bool(src.consent),
    notify: src.notify === undefined ? draft.notify : bool(src.notify),
  };
}

export function toRecord(draft: ReportDraft, reference: string): ReportRecord {
  return {
    reference,
    createdAt: new Date().toISOString(),
    status: 'nouveau',
    contact: draft.contact,
    location: draft.location,
    identity: draft.identity,
    appearance: draft.appearance,
    marks: draft.marks,
    antiTheft: draft.antiTheft,
    notify: draft.notify,
  };
}

export interface SubmissionResult {
  readonly record: ReportRecord;
  readonly plan: SearchPlan;
}

/** Valide et enregistre une déclaration. Renvoie les erreurs de champs sinon. */
export function submitReport(
  payload: unknown,
): { ok: true } & SubmissionResult | { ok: false; errors: FieldErrors } {
  const draft = hydrateDraft(payload);
  const errors = validateDraft(draft);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const reference = generateReference();
  const record = toRecord(draft, reference);
  insertReport(record);

  return { ok: true, record, plan: buildSearchPlan(record) };
}

export function findReport(reference: string): ReportRecord | null {
  if (!isValidReference(reference)) return null;
  return getReport(normalizeReference(reference));
}

/** Ce que la page publique d'un dossier est autorisée à afficher. */
export function publicDossier(record: ReportRecord) {
  const { contact, ...rest } = record;
  void contact;
  return rest;
}

export function dossierFor(record: ReportRecord): { record: ReturnType<typeof publicDossier>; plan: SearchPlan } {
  return { record: publicDossier(record), plan: buildSearchPlan(record) };
}
