import Link from "next/link";

const SITE_NAME = "Vélo Signalé";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Le service",
    links: [
      { href: "/declarer", label: "Déclarer un vol" },
      { href: "/guide", label: "Guide après un vol" },
      { href: "/tarification", label: "Tarifs" },
    ],
  },
  {
    title: "Comprendre",
    links: [
      { href: "/guide#porter-plainte", label: "Porter plainte" },
      { href: "/guide#marquage", label: "Marquage BICYCODE" },
      { href: "/guide#constater", label: "Constat de vol" },
      { href: "/fonctionnalites", label: "Fonctionnalités à venir" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="text-base font-semibold tracking-tight text-zinc-900">
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
              Un signalement structuré et complet après un vol de vélo. La recherche automatique
              d&apos;annonces en ligne est une fonctionnalité à venir.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-900">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-indigo-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-[13px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME} — Service indépendant, sans lien avec la FUB ou BICYCODE.
          </p>
          <p>
            Maquette de démonstration : aucune déclaration n&apos;est transmise et aucune donnée
            n&apos;est enregistrée.
          </p>
        </div>
      </div>
    </footer>
  );
}
