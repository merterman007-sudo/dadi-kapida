import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SectionHeading, SectionLabel } from "../../components/page-chrome";
import { BreadcrumbSchema } from "../../components/structured-data";
import { serviceCategories } from "../../lib/site";
import { buildCityParams, findCityBySlug } from "../../lib/service-region-pages";

function normalizeCitySlug(slug: string) {
  return slug.endsWith("-dadi") ? slug.replace(/-dadi$/, "") : slug;
}

function resolveCityParam(params: Record<string, string | undefined>) {
  const rawValue = Object.values(params).find((value): value is string => typeof value === "string" && value.length > 0);
  return rawValue ?? "";
}

export function generateStaticParams() {
  return buildCityParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const location = findCityBySlug(normalizeCitySlug(resolveCityParam(resolvedParams)));
  if (!location) return {};

  return {
    title: `${location.title} Dadı | Dadı Kapıda`,
    description: `${location.title} içinde dadı, bakıcı, temizlik, şoför ve ev yardımcısı personel yerleştirme danışmanlığı.`,
    alternates: { canonical: `https://dadikapida.com/${location.slug}-dadi` },
    robots: { index: false, follow: true }
  };
}

export default async function CityLandingPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const location = findCityBySlug(normalizeCitySlug(resolveCityParam(resolvedParams)));
  if (!location) return notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: location.title, url: `https://dadikapida.com/${location.slug}-dadi` }
        ]}
      />

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div className="surface rounded-[32px] p-8 lg:p-10">
              <SectionLabel>Hizmet Bölgesi</SectionLabel>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                {location.title} dadı ve ev hizmetleri danışmanlığı
              </h1>
              <p className="mt-4 text-sm leading-7 text-muted">
                {location.description} Ailenin ihtiyacına göre dadı, bakıcı, temizlik, şoför ve ev yardımcısı seçeneklerini birlikte netleştiriyoruz.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow white />
                </Link>
                <Link href={`/hizmet-bolgeleri/${location.slug}`} className="btn-outline">
                  Şehir detaylarına git
                </Link>
              </div>
            </div>

            <div className="surface rounded-[32px] p-6 lg:p-8">
              <SectionHeading
                title="Tek bir standart, aynı güven"
                subtitle="Şehir ne olursa olsun süreç, kalite ve iletişim yaklaşımı aynı kalır."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Dadı & bebek bakımı",
                  "Temizlik hizmetleri",
                  "Şoför ve ulaşım",
                  "Ev destek personeli"
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

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="surface rounded-[28px] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">{category.icon}</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">{category.title}</h3>
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
                      className="block rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink transition hover:border-trust hover:text-trust"
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
            {location.title} için doğru personeli birlikte seçelim
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Aile başvurusu bırakın, danışman ekibimiz sizi uygun kategoriye ve uygun adaya yönlendirsin.
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

