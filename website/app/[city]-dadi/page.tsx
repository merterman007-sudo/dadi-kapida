import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "../../components/structured-data";
import { serviceCategories } from "../../lib/site";
import { buildCityParams, findCityBySlug } from "../../lib/service-region-pages";

export function generateStaticParams() {
  return buildCityParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const location = findCityBySlug(city);
  if (!location) return {};

  return {
    title: `${location.title} Dadı | Dadı Kapıda`,
    description: `${location.title} içinde dadı, bakıcı, temizlik, şoför ve ev yardımcısı personel yerleştirme danışmanlığı.`,
    alternates: { canonical: `https://dadikapida.com/${location.slug}-dadi` }
  };
}

export default async function CityLandingPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const location = findCityBySlug(city);
  if (!location) return notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: location.title, url: `https://dadikapida.com/${location.slug}-dadi` }
        ]}
      />

      <section className="relative overflow-hidden bg-[#0F1921] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 to-[#0F1921]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full border border-gold/10 translate-x-1/2 -translate-y-1/3" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-px w-7 bg-gold/70" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold/80">Hizmet Bölgesi</span>
            </div>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
              {location.title} dadı ve ev hizmetleri danışmanlığı
            </h1>
            <p className="mt-4 text-base leading-7 text-white/75">
              {location.description} Ailenin ihtiyacına göre dadı, bakıcı, temizlik, şoför ve ev yardımcısı seçeneklerini
              birlikte netleştiriyoruz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/aile-basvurusu"
                className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-[#d4b36a]"
              >
                Aile Başvurusu Yap
              </Link>
              <Link
                href={`/hizmet-bolgeleri/${location.slug}`}
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Şehir detaylarına git
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold text-navy">Bu şehirde hangi hizmetlere bakıyoruz?</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Kategorileri ayrı sayfalara bölerek daha net içerik ve daha güçlü iç bağlantı yapısı kuruyoruz.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="surface rounded-[22px] border border-line p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">{category.icon}</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-navy">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{location.title} için uygun aday ve hizmet sayfaları.</p>
                  </div>
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {category.services.length}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {category.services.slice(0, 4).map((service) => (
                    <Link
                      key={service.slug}
                      href={`/hizmet-bolgeleri/${location.slug}/${service.slug}`}
                      className="block rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-navy transition hover:border-gold/30 hover:text-trust"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="font-heading text-3xl font-semibold text-navy">{location.title} için doğru personeli birlikte seçelim</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Aile başvurusu bırakın, danışman ekibimiz sizi uygun kategoriye ve uygun adaya yönlendirsin.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap
            </Link>
            <Link href="/hizmet-bolgeleri" className="btn-outline">
              Tüm şehirler
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
