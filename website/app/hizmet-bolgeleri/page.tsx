import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "../../components/structured-data";
import { serviceCategories, locations } from "../../lib/site";

export const metadata: Metadata = {
  title: "Hizmet Bölgeleri | Dadı Kapıda",
  description:
    "İstanbul, Ankara, İzmir ve Türkiye genelinde dadı, bakıcı, temizlik, şoför, aşçı ve ev yardımcısı hizmetleri için şehir bazlı sayfaları inceleyin.",
  alternates: { canonical: "https://dadikapida.com/hizmet-bolgeleri" }
};

export default function ServiceRegionsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Hizmet Bölgeleri", url: "https://dadikapida.com/hizmet-bolgeleri" }
        ]}
      />

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-trust transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="font-medium text-navy">Hizmet Bölgeleri</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Hizmet Bölgeleri</span>
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            Şehre göre hizmet sayfaları, daha net arama ve daha güçlü SEO için hazırlandı
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-muted">
            Her şehir için ayrı bir landing page, her hizmet için şehir bazlı detay sayfası ve aile başvurusu
            akışına doğrudan bağlanan sade bir yapı kurduk.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/hizmetlerimiz" className="btn-outline">
              Hizmetleri Gör
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Şehirler</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locations.map((city) => (
              <Link
                key={city.slug}
                href={`/hizmet-bolgeleri/${city.slug}`}
                className="surface group rounded-[22px] border border-line p-6 transition hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-soft"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Şehir Sayfası</p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">{city.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{city.description}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition group-hover:tracking-[0.22em]">
                  Şehir bazlı sayfayı incele
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Hizmet Kategorileri</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="surface rounded-[22px] border border-line p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">{category.icon}</p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold text-navy">{category.title}</h2>
                  </div>
                  <Link href="/aile-basvurusu" className="btn-outline shrink-0 px-4 py-2 text-xs">
                    Başvur
                  </Link>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {category.services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/hizmetlerimiz/${service.slug}`}
                      className="rounded-full border border-line bg-white px-4 py-2 text-sm text-navy transition hover:border-trust hover:text-trust"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Şehre göre ayrı landing page’lerde bu hizmetler için detaylı açıklama, değerlendirme kriteri ve başvuru
                  bağlantısı sunuyoruz.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
