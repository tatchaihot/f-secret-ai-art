import Link from "next/link";
import { getBaseUrl } from "@/lib/api";

interface SiteSetting {
  id: string;
  title: string;
  logoUrl: string | null;
}

async function getSettings(): Promise<SiteSetting | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function Navbar() {
  const settings = await getSettings();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.title || "F-Secret AI Art"}
              className="h-8 w-auto object-contain"
            />
          ) : null}
          <span className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
            {settings?.title || "F-Secret AI Art"}
          </span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium text-[hsl(var(--muted-foreground))] sm:flex">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-[hsl(var(--foreground))]"
            >
              หน้าแรก
            </Link>
          </li>
          <li>
            <Link
              href="/gallery"
              className="transition-colors hover:text-[hsl(var(--foreground))]"
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="transition-colors hover:text-[hsl(var(--foreground))]"
            >
              ติดต่อ
            </Link>
          </li>
        </ul>

        {/* Mobile menu placeholder - kept minimal, links visible on mobile via a simple row */}
        <div className="flex items-center gap-4 sm:hidden">
          <Link
            href="/gallery"
            className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            Gallery
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            ติดต่อ
          </Link>
        </div>
      </nav>
    </header>
  );
}
