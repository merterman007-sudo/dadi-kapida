import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SectionHeading, SectionLabel } from "../../../components/page-chrome";
import { BreadcrumbSchema } from "../../../components/structured-data";
import { serviceCategories } from "../../../lib/site";
import { buildCityParams, findCityBySlug } from "../../../lib/service-region-pages";

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
    title: `${location.title} Ev Hizmetleri | Dadı Kapıda`,
    description: `${location.title} ve Türkiye genelinde dadı, bakıcı, temizlik, şoför, aşçı ve ev yardımcısı ihtiyaçları için danışmanlık alın.`,
    alternates: { canonical: `https://dadikapida.com/hizmet-bolgeleri/${location.slug}` }
  };
}

export default async function ServiceRegionCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const location = findCityBySlug(city);
  if (!location) return notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Türkiye Geneli Hizmet", url: "https://dadikapida.com/hizmet-bolgeleri" },
          { name: location.title, url: `https://dadikapida.com/hizmet-bolgeleri/${location.slug}` }
        ]}
      />

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div className="surface rounded-[32px] p-8 lg:p-10">
              <SectionLabel>Öne Çıkan Şehir</SectionLabel>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                {location.title} dadı ve ev hizmetleri danışmanlığı
              </h1>
              <p className="mt-4 text-[0.98rem] leading-7 text-muted">
                {location.description} Ailenin ihtiyacına göre hizmet tiplerini birlikte netleştiriyoruz.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow white />
                </Link>
                <Link href="/hizmet-bolgeleri" className="btn-outline">
                  Şehir listesi
                </Link>
              </div>
            </div>

            <div className="surface rounded-[32px] p-6 lg:p-8">
              <SectionHeading
                title="Aynı sistem, aynı kalite"
                subtitle="Şehir ne olursa olsun süreç aynı kurumsal standartla ilerler."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Dadı & bebek bakımı",
                  "Yaşlı ve hasta bakımı",
                  "Temizlik ve düzen",
                  "Şoför ve ev desteği"
                ].map((item) => (
                  <div key={item} className="rounded-[18px] border border-line bg-bg px-4 py-3 text-sm text-ink">
                    {item}
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
            title="Bu şehirde hangi hizmetlere bakıyoruz?"
            subtitle="Kategorileri ayrı sayfalara bölerek daha net içerik ve daha güçlü iç bağlantı yapısı kuruyoruz."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="surface rounded-[28px] p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">{category.icon}</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">{category.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{location.title} için uygun aday ve hizmet sayfaları.</p>
                  </div>
                  <Link href="/aile-basvurusu" className="btn-outline shrink-0 px-4 py-2 text-xs">
                    Kategoride başvur
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <SectionLabel>Sonraki Adım</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            {location.title} için doğru hizmeti birlikte netleştirelim
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Hizmet tipi belli değilse bile başvuruyu bırakın; danışman ekibimiz sizi doğru kategoriye yönlendirsin.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap <Arrow white />
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

