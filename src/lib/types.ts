export type ReportStatus = 'nouveau' | 'en_cours' | 'recupere' | 'clos';

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Location {
  postalCode: string;
  city: string;
  address: string;
  placeType: string;
  stolenAt: string;
  /** Heure approximative, quand l’heure exacte du vol est inconnue. */
  timeApprox: boolean;
  departement: string;
  wasLocked: boolean;
  lockType: string;
  policeReport: string;
}

export interface BikeIdentity {
  category: string;
  brand: string;
  model: string;
  frameNumber: string;
  frameNumberHidden: boolean;
  year: string;
  purchasePrice: string;
  purchasePlace: string;
  invoiceAvailable: boolean;
  ownerNameOnInvoice: string;
}

export interface BikeAppearance {
  colorMain: string;
  colorSecondary: string;
  frameMaterial: string;
  frameSize: string;
  wheelSize: string;
  gender: string;
  speed: string;
  brakes: string;
  lights: string;
  bell: string;
  rack: string;
  fenders: string;
  kickstand: string;
  basket: string;
  childSeat: string;
  computer: string;
  otherEquipment: string;
}

export interface BikeMarks {
  stickers: string;
  engravings: string;
  scratches: string;
  repaint: string;
  customParts: string;
  photos: string;
}

export interface AntiTheft {
  code: string;
  codeRegistered: boolean;
  antivolMain: string;
  antivolSecondary: string;
  gpsTracker: boolean;
  gpsBrand: string;
  insurance: boolean;
  insuranceRef: string;
}

export interface ReportDraft {
  contact: Contact;
  location: Location;
  identity: BikeIdentity;
  appearance: BikeAppearance;
  marks: BikeMarks;
  antiTheft: AntiTheft;
  consent: boolean;
  notify: boolean;
}

export interface ReportRecord {
  reference: string;
  createdAt: string;
  status: ReportStatus;
  contact: Contact;
  location: Location;
  identity: BikeIdentity;
  appearance: BikeAppearance;
  marks: BikeMarks;
  antiTheft: AntiTheft;
  notify: boolean;
}

export interface Criterion {
  label: string;
  value: string;
  weight: number;
  note: string;
}

export interface LbcQuery {
  label: string;
  hint: string;
  url: string;
}

export interface SearchPlan {
  reference: string;
  keywords: string[];
  criteria: Criterion[];
  scoreMax: number;
  scoreThreshold: number;
  queries: LbcQuery[];
  priceMin: number | null;
  priceMax: number | null;
}

export const emptyDraft = (): ReportDraft => ({
  contact: { firstName: '', lastName: '', email: '', phone: '' },
  location: {
    postalCode: '',
    city: '',
    address: '',
    placeType: '',
    stolenAt: '',
    timeApprox: false,
    departement: '',
    wasLocked: false,
    lockType: '',
    policeReport: '',
  },
  identity: {
    category: '',
    brand: '',
    model: '',
    frameNumber: '',
    frameNumberHidden: false,
    year: '',
    purchasePrice: '',
    purchasePlace: '',
    invoiceAvailable: false,
    ownerNameOnInvoice: '',
  },
  appearance: {
    colorMain: '',
    colorSecondary: '',
    frameMaterial: '',
    frameSize: '',
    wheelSize: '',
    gender: '',
    speed: '',
    brakes: '',
    lights: '',
    bell: '',
    rack: '',
    fenders: '',
    kickstand: '',
    basket: '',
    childSeat: '',
    computer: '',
    otherEquipment: '',
  },
  marks: {
    stickers: '',
    engravings: '',
    scratches: '',
    repaint: '',
    customParts: '',
    photos: '',
  },
  antiTheft: {
    code: '',
    codeRegistered: false,
    antivolMain: '',
    antivolSecondary: '',
    gpsTracker: false,
    gpsBrand: '',
    insurance: false,
    insuranceRef: '',
  },
  consent: false,
  notify: true,
});
