"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface CatalogImage {
  id: string;
  url: string;
  thumbnailUrl: string;
}

interface CatalogCardProps {
  catalog: {
    id: string;
    name: string;
    description: string | null;
    images: CatalogImage[];
    _count: {
      images: number;
    };
  };
}

export default function CatalogCard({ catalog }: CatalogCardProps) {
  const previewImages = catalog.images.slice(0, 4);
  const imageCount = catalog._count.images;

  return (
    <Link
      href={`/gallery/${catalog.id}`}
      className="group block overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-colors hover:border-[hsl(var(--muted-foreground))]"
    >
      <div className="grid aspect-square grid-cols-2 gap-0.5 bg-[hsl(var(--border))]">
        {previewImages.length > 0 ? (
          previewImages.map((image, index) => (
            <div
              key={image.id}
              className="relative overflow-hidden bg-[hsl(var(--card))]"
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt={`${catalog.name} ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 flex items-center justify-center bg-[hsl(var(--card))]">
            <ImageIcon className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
          </div>
        )}

        {previewImages.length === 1 && (
          <>
            <div className="flex items-center justify-center bg-[hsl(var(--card))]">
              <ImageIcon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="flex items-center justify-center bg-[hsl(var(--card))]">
              <ImageIcon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="flex items-center justify-center bg-[hsl(var(--card))]">
              <ImageIcon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
          </>
        )}

        {previewImages.length === 2 && (
          <>
            <div className="flex items-center justify-center bg-[hsl(var(--card))]">
              <ImageIcon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div className="flex items-center justify-center bg-[hsl(var(--card))]">
              <ImageIcon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
            </div>
          </>
        )}

        {previewImages.length === 3 && (
          <div className="flex items-center justify-center bg-[hsl(var(--card))]">
            <ImageIcon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-[hsl(var(--foreground))]">
          {catalog.name}
        </h3>
        {catalog.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-[hsl(var(--muted-foreground))]">
            {catalog.description}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">
          {imageCount} รูป
        </p>
      </div>
    </Link>
  );
}
