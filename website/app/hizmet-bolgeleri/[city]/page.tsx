import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-trust transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/hizmet-bolgeleri" className="hover:text-trust transition-colors">
              Türkiye Geneli Hizmet
            </Link>
            <span>/</span>
            <span className="font-medium text-navy">{location.title}</span>
          </nav>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Öne Çıkan Şehir</span>
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-navy sm:text-5xl">
            {location.title} ve Türkiye geneli için güvenilir ev hizmetleri
          </h1>
          <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-muted">
            {location.description} Dadı Kapıda yalnızca bu şehirle sınırlı değildir; Türkiye genelinde ailelerin bakım,
            temizlik, şoför ve ev destek taleplerini danışman ekibiyle değerlendirir.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/iletisim" className="btn-outline">
              Danışmanla Görüş
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold text-navy">Bu şehirde hangi hizmetlere bakıyoruz?</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              {location.title} sayfası öne çıkan şehir aramaları için hazırlanmıştır. Bulunduğunuz şehir farklıysa da
              başvuru bırakabilirsiniz; danışman ekibimiz hizmet türü ve çalışma düzenine göre sizi yönlendirir.
            </p>
          </div>

          <div className="space-y-6">
            {serviceCategories.map((category) => (
              <div key={category.slug} className="surface rounded-[24px] border border-line p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">{category.icon}</p>
                    <h3 className="mt-2 font-heading text-2xl font-semibold text-navy">{category.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {location.title} ve Türkiye geneli taleplerde bu kategorideki ihtiyaçları ayrı ayrı değerlendiriyoruz.
                    </p>
                  </div>
                  <Link href="/aile-basvurusu" className="btn-outline shrink-0 px-4 py-2 text-xs">
                    Kategoride başvur
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/hizmet-bolgeleri/${location.slug}/${service.slug}`}
                      className="group rounded-[18px] border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-soft"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Detay Sayfası</p>
                      <h4 className="mt-2 font-heading text-lg font-semibold text-navy">{service.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-muted">{service.description}</p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-trust transition group-hover:tracking-[0.2em]">
                        {location.title} için incele
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-5 bg-[#B8860B]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">Hemen Başlayın</span>
            <span className="h-px w-5 bg-[#B8860B]" />
          </div>
          <h2 className="font-heading text-3xl font-semibold text-navy sm:text-4xl">
            {location.title} için doğru hizmeti birlikte netleştirelim
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Hizmet türü belli değilse bile başvuruyu bırakın; danışman ekibimiz sizi doğru kategoriye yönlendirir.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap
            </Link>
            <Link href="/hizmet-bolgeleri" className="btn-outline">
              Öne Çıkan Şehirler
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
