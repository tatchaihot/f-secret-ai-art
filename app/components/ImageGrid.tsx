"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";

interface GridImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
  publicId?: string;
}

interface ImageGridProps {
  images: GridImage[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  }, [images.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeLightbox();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrev, goToNext]);

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-12 text-center shadow-sm">
        <p className="text-[hsl(var(--muted-foreground))]">ยังไม่มีรูปภาพในแคตตาล็อกนี้</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 md:columns-4 lg:gap-4">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--foreground))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))] lg:mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={`รูปที่ ${index + 1}`}
              loading="lazy"
              className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                ดูรูปใหญ่
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={selectedIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}
