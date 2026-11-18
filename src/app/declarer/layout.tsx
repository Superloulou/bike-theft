import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Déclarer un vol',
  description:
    'Déclarez le vol de votre vélo en quatre étapes : l’identité et l’apparence du vélo, les circonstances du vol, vos coordonnées, puis le récapitulatif. Maquette de démonstration — aucune donnée n’est transmise ni enregistrée.',
  alternates: { canonical: '/declarer' },
};

export default function DeclarerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
