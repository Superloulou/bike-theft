import type { Criterion, LbcQuery, ReportRecord, SearchPlan } from './types';

/** Catégorie « Vélos » de LeBonCoin. */
const LBC_CATEGORY = '15';
const LBC_BASE = 'https://www.leboncoin.fr/recherche';

const STOP_WORDS = new Set([
  'velo',
  'vélo',
  'ville',
  'vtt',
  'vae',
  'route',
  'enfant',
  'homme',
  'femme',
  'bon',
  'etat',
  'état',
  'tres',
  'très',
  'beau',
  'neuf',
  'occasion',
]);

function clean(value: string | undefined): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactPhrase(...parts: Array<string | undefined>): string {
  const seen = new Set<string>();
  const words: string[] = [];
  for (const part of parts) {
    for (const word of clean(part).split(' ')) {
      const lower = word.toLowerCase();
      if (!word || word.length < 2 || STOP_WORDS.has(lower) || seen.has(lower)) continue;
      seen.add(lower);
      words.push(word);
    }
  }
  return words.join(' ');
}

function lbcUrl(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  search.set('category', LBC_CATEGORY);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    search.set(key, String(value));
  }
  search.set('sort', 'date');
  return `${LBC_BASE}?${search.toString()}`;
}

function priceBand(purchasePrice: string | number): { min: number; max: number } {
  const value = typeof purchasePrice === 'number' ? purchasePrice : Number(purchasePrice);
  if (!Number.isFinite(value) || value <= 0) return { min: 0, max: 0 };
  // Un vélo volé d'occasion se revend typiquement 35 % à 105 % du prix d'achat.
  const min = Math.max(0, Math.round((value * 0.35) / 10) * 10);
  const max = Math.round((value * 1.05) / 10) * 10;
  return { min, max };
}

export function buildKeywords(record: ReportRecord): string[] {
  const { identity, appearance } = record;
  const phrase = compactPhrase(identity.brand, identity.model, appearance.colorMain, identity.category);
  return phrase ? phrase.split(' ') : [];
}

/**
 * Grille de critères pondérée utilisée pour trier les annonces ressemblantes.
 * Le total (scoreMax) sert de dénominateur au score de similarité.
 */
export function buildCriteria(record: ReportRecord): Criterion[] {
  const { identity, appearance, marks, location } = record;
  const criteria: Criterion[] = [];

  criteria.push({
    label: 'Marque',
    value: identity.brand,
    weight: 20,
    note: 'Le critère qui élimine le plus d’annonces.',
  });

  if (identity.model) {
    criteria.push({
      label: 'Modèle',
      value: identity.model,
      weight: 20,
      note: 'Cherche le modèle exact dans le titre et la description.',
    });
  }

  if (appearance.colorMain) {
    criteria.push({
      label: 'Couleur principale',
      value: appearance.colorMain,
      weight: 12,
      note: 'Souvent indiquée dans le titre de l’annonce.',
    });
  }

  if (identity.category) {
    criteria.push({
      label: 'Type de vélo',
      value: identity.category,
      weight: 10,
      note: 'VTT, VAE, route… doit correspondre à la catégorie annoncée.',
    });
  }

  if (appearance.frameSize) {
    criteria.push({
      label: 'Taille cadre',
      value: appearance.frameSize,
      weight: 8,
      note: 'Les vendeurs sérieux précisent la taille.',
    });
  }

  if (appearance.wheelSize) {
    criteria.push({
      label: 'Taille de roues',
      value: appearance.wheelSize,
      weight: 6,
      note: 'Utile surtout pour les vélos d’enfant.',
    });
  }

  if (identity.frameNumber) {
    criteria.push({
      label: 'N° de série',
      value: identity.frameNumber,
      weight: 25,
      note: 'Fais demander une photo du numéro sous le boîtier de pédalier.',
    });
  }

  if (marks.stickers) {
    criteria.push({
      label: 'Autocollants / stickers',
      value: marks.stickers,
      weight: 8,
      note: 'Signe distinctif difficile à masquer sur les photos.',
    });
  }

  if (marks.scratches) {
    criteria.push({
      label: 'Chocs et rayures',
      value: marks.scratches,
      weight: 8,
      note: 'Compare les zones abîmées sur les photos de l’annonce.',
    });
  }

  if (marks.customParts) {
    criteria.push({
      label: 'Pièces modifiées',
      value: marks.customParts,
      weight: 8,
      note: 'Selle, poignées, pédalier… souvent visibles en photo.',
    });
  }

  if (marks.repaint) {
    criteria.push({
      label: 'Recoloration',
      value: marks.repaint,
      weight: 10,
      note: 'Un vélo repinté change d’aspect : fie-toi au cadre et aux composants.',
    });
  }

  if (location.wasLocked && location.lockType) {
    criteria.push({
      label: 'Antivol utilisé',
      value: location.lockType,
      weight: 4,
      note: 'Un antivol cassé ou absent sur les photos est un indice.',
    });
  }

  return criteria;
}

export function buildQueries(
  record: ReportRecord,
  keywords: string[],
  priceMin: number,
  priceMax: number,
): LbcQuery[] {
  const { identity, appearance, location } = record;
  const queries: LbcQuery[] = [];

  const price =
    priceMin > 0 && priceMax > 0 ? { price_min: priceMin, price_max: priceMax } : {};

  queries.push({
    label: 'Marque + modèle',
    hint: 'La recherche la plus rentable. Ouvre l’onglet, trie par date et remonte 7 jours.',
    url: lbcUrl({ text: compactPhrase(identity.brand, identity.model), ...price }),
  });

  if (location.postalCode) {
    queries.push({
      label: `Rayon 25 km autour de ${location.postalCode}`,
      hint: 'Les vélos volés sont le plus souvent revendus près du lieu de vol.',
      url: lbcUrl({ text: 'velo', distance: 25, location: location.postalCode }),
    });

    queries.push({
      label: `Rayon 100 km, ${identity.brand || 'vélo'}`,
      hint: 'À lancer une fois par semaine : le vendeur peut avoir déménagé l’annonce.',
      url: lbcUrl({
        text: compactPhrase(identity.brand, identity.model) || 'velo',
        distance: 100,
        location: location.postalCode,
      }),
    });
  }

  if (appearance.colorMain) {
    queries.push({
      label: `Couleur « ${appearance.colorMain} »`,
      hint: 'Utile quand le modèle est courant et peu personnalisé.',
      url: lbcUrl({
        text: compactPhrase(identity.brand, appearance.colorMain) || appearance.colorMain,
        ...price,
      }),
    });
  }

  if (identity.frameNumber) {
    queries.push({
      label: 'Recherche du n° de série',
      hint: 'Rarement saisi dans les annonces, mais à tenter une fois : certains vendeurs le photographient.',
      url: lbcUrl({ text: identity.frameNumber }),
    });
  }

  return queries;
}

export function buildSearchPlan(record: ReportRecord): SearchPlan {
  const keywords = buildKeywords(record);
  const criteria = buildCriteria(record);
  const scoreMax = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const { min, max } = priceBand(record.identity.purchasePrice);

  return {
    reference: record.reference,
    keywords,
    criteria,
    scoreMax,
    scoreThreshold: Math.round(scoreMax * 0.6),
    queries: buildQueries(record, keywords, min, max),
    priceMin: min,
    priceMax: max,
  };
}

/**
 * Score de similarité entre un dossier et une annonce.
 * `adText` est le titre + la description copiés depuis LeBonCoin.
 */
export function scoreAd(plan: SearchPlan, adText: string): { score: number; matched: string[] } {
  const haystack = clean(adText).toLowerCase();
  const matched: string[] = [];
  let score = 0;

  for (const criterion of plan.criteria) {
    const needle = clean(criterion.value).toLowerCase();
    if (!needle) continue;
    const tokens = needle.split(' ').filter((token) => token.length >= 2);
    const hit = tokens.length > 0 && tokens.every((token) => haystack.includes(token));
    if (hit) {
      score += criterion.weight;
      matched.push(criterion.label);
    }
  }

  return { score, matched };
}
