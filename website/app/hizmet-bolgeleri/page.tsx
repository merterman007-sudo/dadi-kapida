import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, SectionHeading, SectionLabel } from "../../components/page-chrome";
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
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div className="surface rounded-[32px] p-8 lg:p-10">
              <SectionLabel>Türkiye Geneli Hizmet</SectionLabel>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Türkiye genelinde ailelere güvenilir ev hizmetleri danışmanlığı
              </h1>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-muted">
                Dadı, bebek bakıcısı, çocuk bakıcısı, yaşlı ve hasta bakımı, temizlik, şoför, aşçı, kahya ve ev yardımcısı ihtiyaçları için
                Türkiye genelinde başvuru alıyoruz.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow white />
                </Link>
                <Link href="/hizmetlerimiz" className="btn-outline">
                  Hizmetleri Gör
                </Link>
              </div>
            </div>

            <div className="surface rounded-[32px] p-6 lg:p-8">
              <SectionHeading
                title="Tek akış, tek kalite"
                subtitle="Şehir ve hizmet ne olursa olsun, süreç aynı kurumsal standartla ilerler."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { value: "81 il", label: "Talep alımı" },
                  { value: `${serviceCategories.length}+`, label: "Ana kategori" },
                  { value: "1:1", label: "Danışman takibi" }
                ].map((item) => (
                  <div key={item.label} className="rounded-[18px] border border-line bg-bg px-4 py-3">
                    <p className="font-heading text-[1.5rem] font-semibold text-green">{item.value}</p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            title="Öne çıkan şehir sayfaları"
            subtitle="Marka kapsamı Türkiye geneldir. Bu liste, en çok aranan şehirlerde hizmet ve başvuru akışını hızlandırmak için hazırlandı."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {locations.map((city) => (
              <Link
                key={city.slug}
                href={`/hizmet-bolgeleri/${city.slug}`}
                className="surface group rounded-[28px] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(28,16,21,0.08)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Öne Çıkan Şehir</p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-ink">{city.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{city.description}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition group-hover:gap-3">
                  Şehir sayfası <Arrow />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            title="Hizmet kategorileri"
            subtitle="Ailelerin ihtiyacını tek bakışta ayırabilmesi için kategori yapısını net tutuyoruz."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="surface rounded-[28px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">{category.icon}</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">{category.title}</h3>
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
                      className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink transition hover:border-trust hover:text-trust"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Bu hizmetler için Türkiye genelinde başvuru alıyoruz. Şehir sayfaları, ailelerin aradığı hizmeti daha hızlı bulması için hazırlandı.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

