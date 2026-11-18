// Liste volontairement courte, alignée sur le cahier des charges.
// Elle pourra être étendue (cargo, pliant, tricycle…) quand le moteur de
// rapprochement sera développé.
export const CATEGORIES = [
  'VTT',
  'Route',
  'Ville',
  'Électrique',
  'Gravel',
  'BMX',
  'Autre',
] as const;

export const COLORS = [
  'Noir',
  'Blanc',
  'Gris',
  'Argent',
  'Bleu',
  'Bleu nuit',
  'Cyan',
  'Vert',
  'Vert fluo',
  'Rouge',
  'Orange',
  'Jaune',
  'Rose',
  'Violet',
  'Marron',
  'Beige',
  'Multicolore',
] as const;

export const FRAME_MATERIALS = [
  'Aluminium',
  'Acier',
  'Carbone',
  'Titane',
  'Bois',
  'Inconnu',
] as const;

export const WHEEL_SIZES = ['12"', '14"', '16"', '20"', '24"', '26"', '27,5"', '28" / 700', 'Inconnue'] as const;

export const GENDERS = ['Homme', 'Femme', 'Enfant', 'Mixte', 'Non précisé'] as const;

export const SPEEDS = ['Simple vitesse', '3 vitesses', '7 vitesses', '8 vitesses', '9 vitesses', '10 vitesses', '11 vitesses', '12 vitesses', 'Automatique / Enviolo', 'Inconnu'] as const;

export const BRAKES = ['V-brake', 'Disque mécanique', 'Disque hydraulique', 'Rétropédalage', 'Jante (caliper)', 'Inconnu'] as const;

export const ACCESSORIES = ['Oui', 'Non', 'Inconnu'] as const;

export const PLACE_TYPES = [
  'Rue / trottoir',
  'Parking vélo',
  'Gare',
  'Domicile (cour, hall, cave)',
  'Balcon / terrasse',
  'Travail / établissement',
  'Université / école',
  'Commerce',
  'Espace public extérieur',
  'Autre',
] as const;

export const LOCK_TYPES = [
  'Antivol U',
  'Plaque / chaîne',
  'Câble',
  'Pliant',
  'Antivol de cadre',
  'Sans antivol',
  'Plusieurs antivols',
] as const;

export const MARKING_SYSTEMS = [
  'BICYCODE (FUB)',
  'Abe (Savigny-sur-Orge)',
  'Dataverso',
  'Engraved / gravé',
  'Autre système',
  'Aucun marquage',
] as const;

export const FRAME_POSITIONS = [
  'Sous le boîtier de pédalier',
  'Tube de selle',
  'Tube diagonal',
  'Fourche avant',
  'Base arrière',
  'Numéro masqué ou effacé',
] as const;
