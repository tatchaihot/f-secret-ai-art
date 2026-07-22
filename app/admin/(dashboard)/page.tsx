"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  ImageIcon,
  Upload,
  Settings,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  _count: {
    images: number;
  };
}

interface DashboardStats {
  catalogCount: number;
  imageCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    catalogCount: 0,
    imageCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [catalogsRes, imagesRes] = await Promise.all([
          fetch("/api/catalogs"),
          fetch("/api/images"),
        ]);

        if (!catalogsRes.ok) throw new Error("Failed to fetch catalogs");
        if (!imagesRes.ok) throw new Error("Failed to fetch images");

        const catalogs: Catalog[] = await catalogsRes.json();
        const images = await imagesRes.json();

        setStats({
          catalogCount: catalogs.length,
          imageCount: Array.isArray(images) ? images.length : 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const quickLinks = [
    { href: "/admin/catalogs", label: "จัดการ Catalogs", icon: FolderOpen },
    { href: "/admin/images", label: "จัดการรูปภาพ", icon: ImageIcon },
    { href: "/admin/upload", label: "อัปโหลดรูป", icon: Upload },
    { href: "/admin/settings", label: "ตั้งค่าเว็บ", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          ภาพรวมระบบจัดการเว็บไซต์
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--muted))]">
                  <FolderOpen className="h-5 w-5 text-[hsl(var(--foreground))]" />
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    จำนวน Catalog
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    {stats.catalogCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--muted))]">
                  <ImageIcon className="h-5 w-5 text-[hsl(var(--foreground))]" />
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    จำนวนรูปทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    {stats.imageCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[hsl(var(--foreground))]">
              ลิงก์เร็ว
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-colors hover:border-[hsl(var(--muted-foreground))]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                      <span className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {link.label}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
