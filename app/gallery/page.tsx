import CatalogCard from "@/app/components/CatalogCard";
import { getBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

interface Catalog {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  images: {
    id: string;
    url: string;
    thumbnailUrl: string;
  }[];
  _count: {
    images: number;
  };
}

async function getCatalogs(): Promise<Catalog[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/catalogs`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch catalogs");
    return res.json();
  } catch (error) {
    console.error("Error fetching catalogs:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const catalogs = await getCatalogs();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
          Gallery
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] sm:text-base">
          ผลงานภาพ AI จาก F-Secret AI Art
        </p>
      </div>

      {catalogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">ยังไม่มีแคตตาล็อก</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogs.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </div>
      )}
    </main>
  );
}
