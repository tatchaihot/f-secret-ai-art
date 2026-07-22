import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

interface SiteSetting {
  id: string;
  title: string;
  description: string;
  logoUrl: string | null;
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

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24 lg:py-32">
      {settings?.logoUrl ? (
        <img
          src={settings.logoUrl}
          alt={settings.title}
          className="mb-8 h-20 w-auto object-contain sm:h-24"
        />
      ) : null}

      <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
        {settings?.title || "F-Secret AI Art"}
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
        {settings?.description ||
          "รับสร้างภาพ AI คุณภาพสูง ตามสไตล์ที่คุณต้องการ"}
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          เข้าชม Gallery
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--card)]"
        >
          ติดต่อเรา
        </Link>
      </div>

      <div className="mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
        {[
          { title: "ภาพ AI คุณภาพสูง", desc: "สร้างสรรค์ด้วยโมเดล AI ล่าสุด" },
          { title: "สไตล์หลากหลาย", desc: "ปรับแต่งตามความต้องการของคุณ" },
          { title: "บริการรวดเร็ว", desc: "ตอบสนองและส่งมอบทันใจ" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-left"
          >
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
