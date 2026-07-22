import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { getBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

interface SiteSetting {
  id: string;
  title: string;
  lineId: string;
  lineQrUrl: string | null;
}

async function getSettings(): Promise<SiteSetting | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const settings = await getSettings();
  const lineId = settings?.lineId || "tatchaihot";
  const lineUrl = `https://line.me/ti/p/~${encodeURIComponent(lineId)}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับไปหน้าแรก
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
        ติดต่อเรา
      </h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        สนใจสร้างภาพ AI หรือสอบถามข้อมูล ติดต่อเราได้ทาง Line
      </p>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] text-white">
            <MessageCircle className="h-7 w-7" />
          </div>

          <div>
            <p className="text-sm text-[var(--muted-foreground)]">Line ID</p>
            <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {lineId}
            </p>
          </div>

          {settings?.lineQrUrl ? (
            <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white p-2">
              <img
                src={settings.lineQrUrl}
                alt="Line QR Code"
                className="h-48 w-48 object-contain"
              />
            </div>
          ) : null}

          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            แอด Line เพื่อติดต่อ
          </a>
        </div>
      </div>
    </main>
  );
}
