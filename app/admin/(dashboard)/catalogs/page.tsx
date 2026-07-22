"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  FolderOpen,
} from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count: {
    images: number;
  };
}

export default function AdminCatalogsPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<Catalog | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCatalogs();
  }, []);

  async function loadCatalogs() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/catalogs");
      if (!res.ok) throw new Error("Failed to fetch catalogs");
      const data = await res.json();
      setCatalogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingCatalog(null);
    setFormName("");
    setFormDescription("");
    setFormSortOrder(0);
    setIsFormOpen(true);
  }

  function openEditForm(catalog: Catalog) {
    setEditingCatalog(catalog);
    setFormName(catalog.name);
    setFormDescription(catalog.description || "");
    setFormSortOrder(catalog.sortOrder);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingCatalog(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setError("กรุณากรอกชื่อ Catalog");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const url = editingCatalog
        ? `/api/catalogs/${editingCatalog.id}`
        : "/api/catalogs";
      const method = editingCatalog ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          sortOrder: formSortOrder,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save catalog");
      }

      setSuccess(editingCatalog ? "แก้ไข Catalog สำเร็จ" : "สร้าง Catalog สำเร็จ");
      closeForm();
      await loadCatalogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateSortOrder(catalog: Catalog, newSortOrder: number) {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch(`/api/catalogs/${catalog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: newSortOrder }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update sort order");
      }

      setSuccess("อัปเดตลำดับสำเร็จ");
      await loadCatalogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(catalog: Catalog) {
    try {
      setDeleting(true);
      setError(null);
      const res = await fetch(`/api/catalogs/${catalog.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete catalog");
      }

      setSuccess("ลบ Catalog สำเร็จ");
      setDeleteTarget(null);
      await loadCatalogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
            Catalogs
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
            จัดการแคตตาล็อกและลำดับการแสดงผล
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          สร้างใหม่
        </button>
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

      {isFormOpen ? (
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
              {editingCatalog ? "แก้ไข Catalog" : "สร้าง Catalog ใหม่"}
            </h2>
            <button
              onClick={closeForm}
              className="rounded-lg p-1 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="catalogName"
                  className="block text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  ชื่อ Catalog <span className="text-red-400">*</span>
                </label>
                <input
                  id="catalogName"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="เช่น ภาพบุคคล"
                  className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label
                  htmlFor="catalogSortOrder"
                  className="block text-sm font-medium text-[hsl(var(--foreground))]"
                >
                  ลำดับ
                </label>
                <input
                  id="catalogSortOrder"
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="catalogDescription"
                className="block text-sm font-medium text-[hsl(var(--foreground))]"
              >
                รายละเอียด
              </label>
              <textarea
                id="catalogDescription"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                rows={3}
                className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                บันทึก
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
        </div>
      ) : catalogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm p-12 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-[hsl(var(--muted-foreground))]" />
          <p className="mt-4 text-[hsl(var(--muted-foreground))]">
            ยังไม่มี Catalog กด &quot;สร้างใหม่&quot; เพื่อเริ่มต้น
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
              <tr>
                <th className="px-4 py-3 font-medium">ลำดับ</th>
                <th className="px-4 py-3 font-medium">ชื่อ</th>
                <th className="px-4 py-3 font-medium">รายละเอียด</th>
                <th className="px-4 py-3 font-medium">จำนวนรูป</th>
                <th className="px-4 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {catalogs.map((catalog) => (
                <tr key={catalog.id} className="hover:bg-[hsl(var(--muted))]/50">
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={catalog.sortOrder}
                      onBlur={(e) =>
                        handleUpdateSortOrder(catalog, Number(e.target.value))
                      }
                      className="w-20 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-2 py-1 text-sm text-[hsl(var(--foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">
                    {catalog.name}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-[hsl(var(--muted-foreground))]">
                    {catalog.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">
                    {catalog._count.images}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(catalog)}
                        className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                        title="แก้ไข"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(catalog)}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-400/10"
                        title="ลบ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm p-6">
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              ยืนยันการลบ
            </h3>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              คุณแน่ใจหรือไม่ว่าต้องการลบ Catalog{" "}
              <span className="font-medium text-[hsl(var(--foreground))]">
                {deleteTarget.name}
              </span>
              ? รูปภาพทั้งหมดใน Catalog นี้จะถูกลบไปด้วย
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-500/90 disabled:opacity-50"
              >
                {deleting ? (
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
