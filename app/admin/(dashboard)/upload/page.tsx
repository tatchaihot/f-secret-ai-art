"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  ImageIcon,
  AlertCircle,
} from "lucide-react";

interface Catalog {
  id: string;
  name: string;
}

interface FilePreview {
  file: File;
  id: string;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export default function AdminUploadPage() {
  const router = useRouter();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedCatalog, setSelectedCatalog] = useState<string>("");
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const res = await fetch("/api/catalogs");
        if (!res.ok) throw new Error("Failed to fetch catalogs");
        const data = await res.json();
        setCatalogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoadingCatalogs(false);
      }
    }

    loadCatalogs();
  }, []);

  function createPreview(file: File): FilePreview {
    return {
      file,
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      preview: URL.createObjectURL(file),
      status: "pending",
    };
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles
      .filter((file) => file.type.startsWith("image/"))
      .map(createPreview);

    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles
      .filter((file) => file.type.startsWith("image/"))
      .map(createPreview);

    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  }, []);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }

  async function handleUpload() {
    if (!selectedCatalog) {
      setError("กรุณาเลือก Catalog ปลายทาง");
      return;
    }
    if (files.length === 0) {
      setError("กรุณาเลือกรูปภาพก่อน");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setOverallProgress(0);

    const pendingFiles = files.filter((f) => f.status !== "done");
    let completed = 0;

    const uploadResults = await Promise.all(
      pendingFiles.map(async (filePreview) => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === filePreview.id ? { ...f, status: "uploading" } : f
          )
        );

        const formData = new FormData();
        formData.append("catalogId", selectedCatalog);
        formData.append("files", filePreview.file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Upload failed");
          }

          setFiles((prev) =>
            prev.map((f) =>
              f.id === filePreview.id ? { ...f, status: "done" } : f
            )
          );
          return { status: "done" as const };
        } catch (err) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === filePreview.id
                ? {
                    ...f,
                    status: "error",
                    error: err instanceof Error ? err.message : "Upload failed",
                  }
                : f
            )
          );
          return { status: "error" as const };
        } finally {
          completed++;
          setOverallProgress(Math.round((completed / pendingFiles.length) * 100));
        }
      })
    );

    setIsUploading(false);

    const successCount = uploadResults.filter((r) => r.status === "done").length;
    const failedCount = uploadResults.filter((r) => r.status === "error").length;

    if (failedCount === 0 && successCount > 0) {
      setSuccess(`อัปโหลดสำเร็จ ${successCount} รูป กำลังเปลี่ยนหน้า...`);
      setTimeout(() => {
        router.push("/admin/images");
      }, 1500);
    } else if (successCount > 0) {
      setSuccess(`อัปโหลดสำเร็จ ${successCount} รูป ล้มเหลว ${failedCount} รูป`);
    } else {
      setError("อัปโหลดล้มเหลวทั้งหมด กรุณาลองใหม่อีกครั้ง");
    }
  }

  function clearAll() {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setOverallProgress(0);
    setError(null);
    setSuccess(null);
  }

  if (loadingCatalogs) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          Upload
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          อัปโหลดรูปภาพเข้า Catalog
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <label
          htmlFor="uploadCatalog"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Catalog ปลายทาง <span className="text-red-400">*</span>
        </label>
        <select
          id="uploadCatalog"
          value={selectedCatalog}
          onChange={(e) => setSelectedCatalog(e.target.value)}
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

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-[var(--foreground)] bg-[var(--muted)]"
            : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]"
        }`}
      >
        <input
          type="file"
          id="fileInput"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
            <Upload className="h-6 w-6 text-[var(--foreground)]" />
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
            ลากรูปมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            รองรับไฟล์รูปภาพหลายไฟล์
          </p>
        </label>
      </div>

      {files.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              รูปที่เลือก ({files.length})
            </h2>
            <button
              onClick={clearAll}
              disabled={isUploading}
              className="text-sm font-medium text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
            >
              ล้างทั้งหมด
            </button>
          </div>

          {isUploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--foreground)]">
                  กำลังอัปโหลด...
                </span>
                <span className="text-[var(--muted-foreground)]">
                  {overallProgress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((filePreview) => (
              <div
                key={filePreview.id}
                className="group relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="aspect-square">
                  <img
                    src={filePreview.preview}
                    alt={filePreview.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {filePreview.status === "uploading" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                ) : null}

                {filePreview.status === "done" ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                ) : null}

                {filePreview.status === "error" ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-2 text-center">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                    <p className="mt-1 text-xs text-red-200">
                      {filePreview.error || "Error"}
                    </p>
                  </div>
                ) : null}

                <button
                  onClick={() => removeFile(filePreview.id)}
                  disabled={isUploading}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="truncate p-2 text-xs text-[var(--muted-foreground)]">
                  {filePreview.file.name}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedCatalog}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            อัปโหลด {files.length} รูป
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-[var(--muted-foreground)]" />
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            ยังไม่ได้เลือกรูปภาพ
          </p>
        </div>
      )}
    </div>
  );
}
