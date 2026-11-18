import Link from "next/link";
import { Bike } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/declarer", label: "Déclarer un vol" },
  { href: "/guide", label: "Guide" },
  { href: "/tarification", label: "Tarifs" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors duration-200 group-hover:bg-indigo-600">
            <Bike className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            Vélo Signalé
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/guide"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-zinc-600 hover:text-zinc-900 lg:inline-flex",
            )}
          >
            Retrouver mon vélo
          </Link>
          <Link href="/declarer" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
            Déclarer un vol
          </Link>
        </div>
      </div>

      <nav
        aria-label="Navigation mobile"
        className="flex items-center gap-1 overflow-x-auto border-t border-zinc-200/80 px-4 py-2 md:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
