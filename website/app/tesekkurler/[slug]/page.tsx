import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    subtitle: "Danışman ekibimiz başvurunuzu inceleyip en kısa sürede iletişime geçecek. Süreç tamamen danışman eşliğinde, sakin ve kontrollü biçimde ilerleyecek.",
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
    subtitle: "Başvurunuz danışman ekibimiz tarafından incelenecek. Uygun aile eşleşmeleri için değerlendirme tamamlandıktan sonra sizinle iletişime geçilecek.",
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
    subtitle: "Danışman ekibimiz mesajınızı inceleyip en kısa sürede geri dönüş yapacak. Ortalama yanıt süresi 1 iş günüdür.",
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
    <div className="min-h-[80vh] bg-[#FDFAF5] py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Başarı ikonu */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-ping opacity-30" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-navy">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18l6 6 14-14" stroke="#C4A45A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Başlık */}
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <span className="h-px w-7 bg-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">{config.eyebrow}</span>
            <span className="h-px w-7 bg-gold" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
            {config.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">{config.subtitle}</p>
        </div>

        {/* Sonraki adımlar */}
        <div className="mt-10 rounded-[22px] border border-line bg-white p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-trust">Bundan Sonra</p>
          <div className="space-y-2">
            {config.steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/12 font-heading text-[11px] font-bold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-navy">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA butonları */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={config.primaryAction.href}
            className="flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-trust"
          >
            {config.primaryAction.label}
          </Link>
          <Link
            href={config.secondaryAction.href}
            className="flex items-center justify-center rounded-full border border-line bg-white px-7 py-3.5 text-sm font-medium text-navy transition hover:border-navy"
          >
            {config.secondaryAction.label}
          </Link>
        </div>

        {/* Alt not */}
        <p className="mt-8 text-center text-xs text-muted/50">
          Herhangi bir sorunuz için{" "}
          <Link href="/iletisim" className="underline hover:text-navy">
            iletişim sayfamızı
          </Link>{" "}
          ziyaret edebilirsiniz.
        </p>
      </div>
    </div>
  );
}
