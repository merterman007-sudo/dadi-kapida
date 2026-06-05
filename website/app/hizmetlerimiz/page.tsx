import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "../../components/structured-data";
import { servicesContent } from "../../lib/services-content";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Dadı Kapıda",
  description: "Yatılı dadı, gündüzlü dadı, bebek bakıcısı ve daha fazlası. Ailenizin ihtiyacına özel profesyonel dadı çözümleri.",
  alternates: { canonical: "https://dadikapida.com/hizmetlerimiz" }
};

export default function ServicesPage() {
  const symbols = ["✦","◈","❋","◉","✧","⬡","◇","✦","◆","⬥","✩"];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Ana Sayfa", url: "https://dadikapida.com" },
        { name: "Hizmetlerimiz", url: "https://dadikapida.com/hizmetlerimiz" }
      ]} />

      {/* Hero */}
      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-green transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-ink font-medium">Hizmetlerimiz</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Hizmetlerimiz</span>
          </div>
          <h1 className="font-heading text-4xl font-semibold text-ink sm:text-5xl max-w-2xl leading-tight">
            Ailenizin ihtiyacına göre profesyonel dadı çözümleri
          </h1>
          <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-muted">
            Yatılı veya gündüzlü bakım, bebek bakıcısı, yabancı dil bilen dadı ve daha fazlası — her ihtiyaç için özel değerlendirme ve danışman eşliğinde yerleştirme süreci.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/iletisim" className="btn-outline">Danışmanla görüş</Link>
          </div>
        </div>
      </section>

      {/* Hizmetler grid */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {servicesContent.map((svc, i) => (
              <Link
                key={svc.slug}
                href={`/hizmetlerimiz/${svc.slug}`}
                className="card card-hover group block p-6"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-bg text-green text-lg transition-colors group-hover:border-green/20 group-hover:bg-[#8C5368]/5">
                    {symbols[i % symbols.length]}
                  </div>
                  <span className="font-heading text-4xl font-semibold text-ink/6 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-ink">{svc.title}</h2>
                <p className="mt-1 text-[11px] font-medium text-[#B8860B]/80 italic">{svc.tagline}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{svc.shortDescription}</p>

                {/* Kim için */}
                <div className="mt-4 space-y-1.5">
                  {svc.whoIsItFor.slice(0, 2).map(item => (
                    <div key={item} className="flex items-start gap-2 text-xs text-muted">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 mt-0.5">
                        <path d="M2 6.5l2.5 2.5 5.5-5" stroke="#8C5368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-green group-hover:gap-3 transition-all">
                  Detaylı İncele
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Alt CTA */}
      <section className="border-t border-line py-14 bg-white">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Hemen Başlayın</span>
            <span className="h-px w-5 bg-[#B8860B]" />
          </div>
          <h2 className="font-heading text-3xl font-semibold text-ink sm:text-4xl">
            Hangi hizmete ihtiyaç duyduğunuzdan emin değil misiniz?
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Danışmanlarımız ailenizin ihtiyaçlarını birlikte analiz ederek en uygun hizmet modelini belirlemenize yardımcı olur.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">Aile Başvurusu Yap</Link>
            <Link href="/iletisim" className="btn-outline">Danışmanla Görüş</Link>
          </div>
        </div>
      </section>
    </>
  );
}
