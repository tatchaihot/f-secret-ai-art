"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
}

interface LightboxProps {
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleDragEnd(
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: { offset: { x: number; y: number }; velocity: { x: number; y: number } }
  ) {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      onNext();
    } else if (swipe > swipeConfidenceThreshold) {
      onPrev();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="ดูรูปภาพขนาดใหญ่"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="ปิด"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:left-4"
          aria-label="รูปก่อนหน้า"
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-4"
          aria-label="รูปถัดไป"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-h-[85vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentImage.id}
            src={currentImage.url}
            alt={`รูปที่ ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-md object-contain"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </AnimatePresence>
        <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-[hsl(var(--muted-foreground))]">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
