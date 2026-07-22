"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Settings2 } from "lucide-react";

interface SiteSetting {
  id: string;
  title: string;
  description: string;
  lineId: string;
  lineQrUrl: string;
  logoUrl: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting>({
    id: "default",
    title: "",
    description: "",
    lineId: "",
    lineQrUrl: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings({
          ...data,
          lineQrUrl: data.lineQrUrl || "",
          logoUrl: data.logoUrl || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: settings.title,
          description: settings.description,
          lineId: settings.lineId,
          lineQrUrl: settings.lineQrUrl || null,
          logoUrl: settings.logoUrl || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update settings");
      }

      const updated = await res.json();
      setSettings({
        ...updated,
        lineQrUrl: updated.lineQrUrl || "",
        logoUrl: updated.logoUrl || "",
      });
      setSuccess("บันทึกการตั้งค่าสำเร็จ");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          ตั้งค่าทั่วไปของเว็บไซต์
        </p>
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

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--muted))]">
            <Settings2 className="h-5 w-5 text-[hsl(var(--foreground))]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">
              ข้อมูลเว็บไซต์
            </h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              ข้อมูลเหล่านี้จะแสดงบนหน้าเว็บหลัก
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              ชื่อเว็บไซต์ (title)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={settings.title}
              onChange={handleChange}
              placeholder="F-Secret AI Art"
              className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              คำอธิบาย (description)
            </label>
            <textarea
              id="description"
              name="description"
              value={settings.description}
              onChange={handleChange}
              placeholder="รับสร้างภาพ AI คุณภาพสูง"
              rows={4}
              className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label
              htmlFor="lineId"
              className="block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              LINE ID
            </label>
            <input
              id="lineId"
              name="lineId"
              type="text"
              value={settings.lineId}
              onChange={handleChange}
              placeholder="เช่น @yourline"
              className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label
              htmlFor="lineQrUrl"
              className="block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              LINE QR Code URL
            </label>
            <input
              id="lineQrUrl"
              name="lineQrUrl"
              type="text"
              value={settings.lineQrUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label
              htmlFor="logoUrl"
              className="block text-sm font-medium text-[hsl(var(--foreground))]"
            >
              Logo URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="text"
              value={settings.logoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--foreground))]"
            />
            {settings.logoUrl ? (
              <div className="mt-3">
                <p className="mb-2 text-xs text-[hsl(var(--muted-foreground))]">
                  Preview:
                </p>
                <img
                  src={settings.logoUrl}
                  alt="Logo preview"
                  className="h-16 w-auto rounded-lg border border-[hsl(var(--border))] object-contain bg-[hsl(var(--background))]"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            บันทึกการตั้งค่า
          </button>
        </div>
      </form>
    </div>
  );
}
