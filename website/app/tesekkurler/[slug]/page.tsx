import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SectionLabel, SectionHeading } from "../../../components/page-chrome";

type PageConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
  steps: string[];
};

const pageConfig: Record<string, PageConfig> = {
  "aile-basvurusu": {
    eyebrow: "Başvurunuz Alındı",
    title: "Aile başvurunuz başarıyla tamamlandı.",
    subtitle:
      "Danışman ekibimiz başvurunuzu inceleyip en kısa sürede iletişime geçecek. Süreç, danışman eşliğinde sakin ve kontrollü biçimde ilerleyecek.",
    primaryAction: { label: "Ana Sayfaya Dön", href: "/" },
    secondaryAction: { label: "Blog Yazılarına Bak", href: "/blog" },
    steps: [
      "Danışmanımız başvurunuzu inceleyecek",
      "İhtiyaç analizi için sizinle iletişime geçecek",
      "Uygun aday profilleri belirlenecek",
      "Görüşmeler planlanacak",
      "Yerleştirme sonrası takip sağlanacak"
    ]
  },
  "dadi-basvurusu": {
    eyebrow: "Başvurunuz Alındı",
    title: "Personel başvurunuz değerlendirme sürecine alındı.",
    subtitle:
      "Başvurunuz danışman ekibimiz tarafından incelenecek. Uygun aile eşleşmeleri için değerlendirme tamamlandıktan sonra sizinle iletişime geçilecek.",
    primaryAction: { label: "Ana Sayfaya Dön", href: "/" },
    secondaryAction: { label: "Personel Rehberi", href: "/dadilar-icin" },
    steps: [
      "Başvurunuz danışman ekibimizce incelenecek",
      "Profil değerlendirmesi yapılacak",
      "Uygun aile eşleşmeleri araştırılacak",
      "Görüşme planlandığında bildirim yapılacak"
    ]
  },
  iletisim: {
    eyebrow: "Mesajınız Alındı",
    title: "Mesajınız ekibimize ulaştı.",
    subtitle:
      "Danışman ekibimiz mesajınızı inceleyip en kısa sürede geri dönüş yapacak. Ortalama yanıt süresi 1 iş günüdür.",
    primaryAction: { label: "Ana Sayfaya Dön", href: "/" },
    secondaryAction: { label: "Aile Başvurusu Yap", href: "/aile-basvurusu" },
    steps: [
      "Mesajınız danışmanımıza iletildi",
      "En kısa sürede size dönüş yapılacak",
      "Herhangi bir sorunuz için tekrar ulaşabilirsiniz"
    ]
  }
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = pageConfig[slug];
  if (!config) return {};
  return {
    title: `${config.eyebrow} | Dadı Kapıda`,
    robots: "noindex"
  };
}

export default async function ThanksPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = pageConfig[slug];
  if (!config) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <div className="surface rounded-[32px] p-6 md:p-8 lg:p-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-ivory shadow-soft">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <path d="M8 18l6 6 14-14" stroke="#8C5368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="mt-6">
            <SectionLabel>{config.eyebrow}</SectionLabel>
            <SectionHeading
              title={config.title}
              subtitle={config.subtitle}
              centered
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4">
          <div className="surface rounded-[28px] p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-trust">Bundan Sonra</p>
            <div className="mt-4 space-y-3">
              {config.steps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8C5368]/10 font-heading text-[11px] font-bold text-[#8C5368]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-navy">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={config.primaryAction.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-trust"
            >
              {config.primaryAction.label}
              <Arrow white />
            </Link>
            <Link
              href={config.secondaryAction.href}
              className="inline-flex items-center justify-center rounded-full border border-line bg-white px-7 py-3.5 text-sm font-medium text-navy transition hover:border-navy"
            >
              {config.secondaryAction.label}
            </Link>
          </div>

          <p className="text-center text-xs text-muted/60">
            Herhangi bir sorunuz için{" "}
            <Link href="/iletisim" className="underline underline-offset-2 hover:text-navy">
              iletişim sayfamızı
            </Link>{" "}
            ziyaret edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
