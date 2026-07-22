import Link from "next/link";
import { ArrowRight, Sparkles, Palette, Zap } from "lucide-react";
import FadeIn from "@/app/components/FadeIn";
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

const features = [
  {
    icon: Sparkles,
    title: "ภาพ AI คุณภาพสูง",
    desc: "สร้างสรรค์ด้วยโมเดล AI ล่าสุด",
  },
  {
    icon: Palette,
    title: "สไตล์หลากหลาย",
    desc: "ปรับแต่งตามความต้องการของคุณ",
  },
  {
    icon: Zap,
    title: "บริการรวดเร็ว",
    desc: "ตอบสนองและส่งมอบทันใจ",
  },
];

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24 lg:py-32">
      <FadeIn>
        {settings?.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={settings.title}
            className="mb-8 h-20 w-auto object-contain sm:h-24"
          />
        ) : null}
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-5xl lg:text-6xl">
          {settings?.title || "F-Secret AI Art"}
        </h1>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
          {settings?.description ||
            "รับสร้างภาพ AI คุณภาพสูง ตามสไตล์ที่คุณต้องการ"}
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/gallery"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))] transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-amber-500/20"
          >
            เข้าชม Gallery
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-transparent px-6 py-3 text-sm font-semibold text-[hsl(var(--foreground))] shadow-sm transition-all hover:bg-[hsl(var(--card))] hover:border-[hsl(var(--muted-foreground))]"
          >
            ติดต่อเรา
          </Link>
        </div>
      </FadeIn>

      <div className="mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
        {features.map((item, index) => (
          <FadeIn key={item.title} delay={0.4 + index * 0.1}>
            <div className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-[hsl(var(--muted-foreground))] hover:shadow-lg hover:shadow-black/20">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] transition-colors group-hover:bg-[hsl(var(--primary))]/20">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                {item.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
