"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Trash2,
  MoveRight,
  ImageIcon,
  CheckSquare,
  Square,
} from "lucide-react";

interface Catalog {
  id: string;
  name: string;
}

interface ImageItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
  sortOrder: number;
  catalogId: string;
  catalog: Catalog;
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<string>("");
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set()
  );
  const [targetCatalogId, setTargetCatalogId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedCatalog
        ? `/api/images?catalogId=${selectedCatalog}`
        : "/api/images";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setImages(data);
      setSelectedImageIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }, [selectedCatalog]);

  useEffect(() => {
    loadCatalogs();
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function loadCatalogs() {
    try {
      const res = await fetch("/api/catalogs");
      if (!res.ok) throw new Error("Failed to fetch catalogs");
      const data = await res.json();
      setCatalogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    }
  }

  function toggleImageSelection(id: string) {
    setSelectedImageIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedImageIds.size === images.length && images.length > 0) {
      setSelectedImageIds(new Set());
    } else {
      setSelectedImageIds(new Set(images.map((img) => img.id)));
    }
  }

  async function handleMove() {
    if (selectedImageIds.size === 0) {
      setError("กรุณาเลือกรูปภาพก่อน");
      return;
    }
    if (!targetCatalogId) {
      setError("กรุณาเลือก Catalog เป้าหมาย");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/images/batch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selectedImageIds),
          catalogId: targetCatalogId,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to move images");
      }

      setSuccess(`ย้ายรูปภาพ ${selectedImageIds.size} รูปสำเร็จ`);
      setSelectedImageIds(new Set());
      setTargetCatalogId("");
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setProcessing(false);
    }
  }

  async function handleDelete() {
    if (selectedImageIds.size === 0) return;

    try {
      setProcessing(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedImageIds) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete images");
      }

      setSuccess(`ลบรูปภาพ ${selectedImageIds.size} รูปสำเร็จ`);
      setSelectedImageIds(new Set());
      setShowDeleteConfirm(false);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Images
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            จัดการรูปภาพทั้งหมด
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-400">
          {success}
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="filterCatalog"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              กรองตาม Catalog
            </label>
            <select
              id="filterCatalog"
              value={selectedCatalog}
              onChange={(e) => setSelectedCatalog(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
            >
              <option value="">ทั้งหมด</option>
              {catalogs.map((catalog) => (
                <option key={catalog.id} value={catalog.id}>
                  {catalog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="targetCatalog"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Catalog เป้าหมาย (สำหรับย้าย)
            </label>
            <select
              id="targetCatalog"
              value={targetCatalogId}
              onChange={(e) => setTargetCatalogId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
            >
              <option value="">เลือก Catalog</option>
              {catalogs.map((catalog) => (
                <option key={catalog.id} value={catalog.id}>
                  {catalog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleMove}
              disabled={processing || selectedImageIds.size === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:flex-none"
            >
              <MoveRight className="h-4 w-4" />
              ย้าย
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={processing || selectedImageIds.size === 0}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:flex-none"
            >
              <Trash2 className="h-4 w-4" />
              ลบ
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          เลือก {selectedImageIds.size} รูป จาก {images.length} รูป
        </p>
        <button
          onClick={toggleSelectAll}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--muted-foreground)]"
        >
          {selectedImageIds.size === images.length && images.length > 0 ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          {selectedImageIds.size === images.length && images.length > 0
            ? "ยกเลิกเลือกทั้งหมด"
            : "เลือกทั้งหมด"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-[var(--muted-foreground)]" />
          <p className="mt-4 text-[var(--muted-foreground)]">
            ไม่พบรูปภาพใน Catalog นี้
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image) => {
            const isSelected = selectedImageIds.has(image.id);
            return (
              <div
                key={image.id}
                onClick={() => toggleImageSelection(image.id)}
                className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-[var(--card)] transition-colors ${
                  isSelected
                    ? "border-[var(--foreground)] ring-2 ring-[var(--foreground)] ring-offset-2 ring-offset-[var(--background)]"
                    : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute left-2 top-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      isSelected
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--primary-foreground)]"
                        : "border-[var(--border)] bg-[var(--background)]/80"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="h-3.5 w-3.5" />
                    ) : null}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="truncate text-xs text-white">
                    {image.catalog.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              ยืนยันการลบ
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพที่เลือก{" "}
              <span className="font-medium text-[var(--foreground)]">
                {selectedImageIds.size} รูป
              </span>
              ? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={processing}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                ลบ
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
