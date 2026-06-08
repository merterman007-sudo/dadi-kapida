import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "../../components/structured-data";
import { serviceCategories, locations } from "../../lib/site";

export const metadata: Metadata = {
  title: "Türkiye Genelinde Hizmet | Dadı Kapıda",
  description:
    "Dadı Kapıda; dadı, bakıcı, yaşlı bakım, hasta bakım, temizlik, şoför, aşçı ve ev yardımcısı hizmetlerinde Türkiye genelinde ailelere danışmanlık verir.",
  alternates: { canonical: "https://dadikapida.com/hizmet-bolgeleri" }
};

export default function ServiceRegionsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Türkiye Geneli Hizmet", url: "https://dadikapida.com/hizmet-bolgeleri" }
        ]}
      />

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-trust transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="font-medium text-navy">Türkiye Geneli Hizmet</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Türkiye Geneli Hizmet</span>
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            Türkiye genelinde ailelere güvenilir ev hizmetleri danışmanlığı
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-muted">
            Dadı, bebek bakıcısı, çocuk bakıcısı, yaşlı ve hasta bakımı, temizlik, şoför, aşçı, kahya ve ev yardımcısı
            ihtiyaçları için Türkiye genelinde başvuru alıyoruz. Aşağıdaki şehirler arama kolaylığı için öne çıkarılan
            sayfalardır; bulunduğunuz şehir listede olmasa bile bizimle iletişime geçebilirsiniz.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-navy sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-bg px-4 py-3">
              <strong>81 il</strong>
              <span className="mt-1 block text-muted">Türkiye geneli talep alımı</span>
            </div>
            <div className="rounded-2xl border border-line bg-bg px-4 py-3">
              <strong>6 ana kategori</strong>
              <span className="mt-1 block text-muted">Bakım, temizlik, şoför ve ev destekleri</span>
            </div>
            <div className="rounded-2xl border border-line bg-bg px-4 py-3">
              <strong>Danışman eşleştirmesi</strong>
              <span className="mt-1 block text-muted">Şehir ve hizmete göre aday değerlendirme</span>
            </div>
          </div>
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
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Öne Çıkan Şehir Sayfaları</span>
          </div>
          <p className="mb-6 max-w-3xl text-sm leading-7 text-muted">
            Marka kapsamı Türkiye geneldir. Bu liste, en çok aranan şehirlerde hizmet ve başvuru akışını hızlandırmak için
            hazırlanmış örnek şehir sayfalarıdır.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locations.map((city) => (
              <Link
                key={city.slug}
                href={`/hizmet-bolgeleri/${city.slug}`}
                className="surface group rounded-[22px] border border-line p-6 transition hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-soft"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Öne Çıkan Şehir</p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">{city.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{city.description}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition group-hover:tracking-[0.22em]">
                  Şehir sayfasını incele
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
                  Bu hizmetler için Türkiye genelinde başvuru alıyoruz. Şehir sayfaları, ailelerin aradığı hizmeti daha
                  hızlı bulması ve danışman ekibimize net talep iletmesi için hazırlanmıştır.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
