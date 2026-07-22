import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageGrid from "@/app/components/ImageGrid";
import { getBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CatalogImage {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
  sortOrder: number;
}

interface Catalog {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  images: CatalogImage[];
}

async function getCatalog(id: string): Promise<Catalog | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/catalogs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch catalog");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return null;
  }
}

interface CatalogDetailPageProps {
  params: { id: string };
}

export default async function CatalogDetailPage({
  params,
}: CatalogDetailPageProps) {
  const catalog = await getCatalog(params.id);

  if (!catalog) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          ไม่พบแคตตาล็อก
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          แคตตาล็อกที่คุณกำลังมองหาอาจถูกลบไปแล้ว
        </p>
        <Link
          href="/gallery"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับไป Gallery
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/gallery"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไป Gallery
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {catalog.name}
        </h1>
        {catalog.description ? (
          <p className="mt-2 text-sm text-[var(--muted-foreground)] sm:text-base">
            {catalog.description}
          </p>
        ) : null}
      </div>

      <ImageGrid images={catalog.images} />
    </main>
  );
}
