import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          © {new Date().getFullYear()} F-Secret AI Art. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
          <Link
            href="/gallery"
            className="transition-colors hover:text-[hsl(var(--foreground))]"
          >
            Gallery
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-[hsl(var(--foreground))]"
          >
            ติดต่อ
          </Link>
        </div>
      </div>
    </footer>
  );
}
