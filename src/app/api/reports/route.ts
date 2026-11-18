import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Maquette de démonstration : cette route ne lit et n’écrit rien en base de
 * données. Les modules `@/lib/service`, `@/lib/db` et `@/lib/rate-limit` restent
 * dans le dépôt pour une version ultérieure, mais ne sont plus branchés ici.
 */
function indisponible() {
  return NextResponse.json(
    {
      error: "Cette démonstration n’enregistre aucune déclaration.",
      demonstration: true,
    },
    { status: 410 },
  );
}

/** Dépôt d'une déclaration : volontairement désactivé dans la maquette. */
export async function POST() {
  return indisponible();
}

/** Consultation d'un dossier : volontairement désactivé dans la maquette. */
export async function GET() {
  return indisponible();
}
