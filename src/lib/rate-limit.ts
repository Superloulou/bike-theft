import 'server-only';

/**
 * Limiteur en mémoire, par instance et par fenêtre glissante.
 * Suffisant pour freiner le dépôt automatisé de déclarations ; à compléter par
 * une limite appliquée en périphérie (nginx `limit_req`) en production.
 */
type Bucket = { count: number; resetAt: number };

const MAX_PER_WINDOW = 8;
const WINDOW_MS = 10 * 60 * 1000;

const store = ((globalThis as { __vsRate?: Map<string, Bucket> }).__vsRate ??= new Map<
  string,
  Bucket
>());

export interface RateResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string): RateResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    prune(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function prune(now: number) {
  if (store.size < 5000) return;
  for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
}

/** Identifiant client au plus proche : IP réelle derrière une reverse proxy. */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'local';
  return ip;
}
