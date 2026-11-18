const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomBlock(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

/** Référence lisible du type VS-8K4M-2Q7P, utilisée pour suivre un dossier. */
export function generateReference(): string {
  return `VS-${randomBlock(4)}-${randomBlock(4)}`;
}

export function normalizeReference(input: string): string {
  return input.trim().toUpperCase().replace(/[\s_]/g, '-');
}

export function isValidReference(input: string): boolean {
  return /^VS-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalizeReference(input));
}
