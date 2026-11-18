import { Info } from "lucide-react";

/**
 * Bandeau permanent : rappelle que le site est une maquette.
 * Aucune déclaration n'est transmise, aucune donnée n'est enregistrée.
 */
export function DemoBanner() {
  return (
    <div
      role="status"
      className="border-b border-indigo-950/40 bg-indigo-950 text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-center text-[13px] leading-snug sm:px-6 lg:px-8">
        <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Démonstration</strong> — aucune
          déclaration n&apos;est transmise et aucune donnée n&apos;est
          enregistrée.
        </p>
      </div>
    </div>
  );
}
