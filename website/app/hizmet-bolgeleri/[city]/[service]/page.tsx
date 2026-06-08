import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "../../../../components/faq-accordion";
import { BreadcrumbSchema, FaqSchema } from "../../../../components/structured-data";
import { locations } from "../../../../lib/site";
import {
  buildServiceCityParams,
  findCityBySlug,
  findServiceBySlug,
  findServiceContentBySlug
} from "../../../../lib/service-region-pages";

export function generateStaticParams() {
  return buildServiceCityParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ city: string; service: string }>;
}): Promise<Metadata> {
  const { city, service } = await params;
  const location = findCityBySlug(city);
  const serviceItem = findServiceBySlug(service);
  if (!location || !serviceItem) return {};

  const serviceContent = findServiceContentBySlug(serviceItem.slug);
  const description =
    serviceContent?.shortDescription ??
    serviceItem.description ??
    `${location.title} için ${serviceItem.title.toLowerCase()} hizmeti.`;

  return {
    title: `${location.title} ${serviceItem.title} | Dadı Kapıda`,
    description,
    alternates: { canonical: `https://dadikapida.com/hizmet-bolgeleri/${location.slug}/${serviceItem.slug}` }
  };
}

export default async function ServiceRegionServicePage({
  params
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  const { city, service } = await params;
  const location = findCityBySlug(city);
  const serviceItem = findServiceBySlug(service);
  if (!location || !serviceItem) return notFound();

  const serviceContent = findServiceContentBySlug(serviceItem.slug);
  const whoIsItFor =
    serviceContent?.whoIsItFor ?? [`${location.title} bölgesindeki ailelerin ihtiyaç analizi sonrası önerilir.`];
  const whatWeEvaluate =
    serviceContent?.whatWeEvaluate ?? [
      "Şehir ve ulaşım uyumu",
      "Çalışma düzenine uygunluk",
      "Referans ve geçmiş kontrolü",
      "Maaş beklentisi ve rol uyumu"
    ];
  const candidateQualities =
    serviceContent?.candidateQualities ?? [
      "Doğrulanabilir referanslar",
      "İletişim ve uyum becerisi",
      "Esnek çalışma düzenine yatkınlık"
    ];
  const faqs = serviceContent?.faqs ?? [];
  const otherCities = locations.filter((item) => item.slug !== location.slug).slice(0, 6);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Türkiye Geneli Hizmet", url: "https://dadikapida.com/hizmet-bolgeleri" },
          { name: location.title, url: `https://dadikapida.com/hizmet-bolgeleri/${location.slug}` },
          {
            name: serviceItem.title,
            url: `https://dadikapida.com/hizmet-bolgeleri/${location.slug}/${serviceItem.slug}`
          }
        ]}
      />
      {faqs.length > 0 ? <FaqSchema faqs={faqs} /> : null}

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-trust transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/hizmet-bolgeleri" className="hover:text-trust transition-colors">
              Türkiye Geneli Hizmet
            </Link>
            <span>/</span>
            <Link href={`/hizmet-bolgeleri/${location.slug}`} className="hover:text-trust transition-colors">
              {location.title}
            </Link>
            <span>/</span>
            <span className="font-medium text-navy">{serviceItem.title}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-5 bg-[#B8860B]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">
                  Şehir + Hizmet Sayfası
                </span>
              </div>
              <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-navy sm:text-5xl">
                {location.title} için {serviceItem.title}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-muted">
                {serviceContent?.tagline ?? serviceItem.description}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
                Bu sayfa, {location.title} aramasını kolaylaştırmak için hazırlanmıştır. Dadı Kapıda aynı hizmet için
                Türkiye genelinde talep alır; bulunduğunuz şehir farklıysa aile başvuru formundan bize ulaşabilirsiniz.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href={`/hizmet-bolgeleri/${location.slug}`} className="btn-outline">
                  Şehir sayfası
                </Link>
              </div>
            </div>

            <div className="surface rounded-[24px] border border-line p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Kısa Özet</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Şehir</p>
                  <p className="mt-1 text-sm font-medium text-navy">{location.title}</p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Hizmet</p>
                  <p className="mt-1 text-sm font-medium text-navy">{serviceItem.title}</p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Danışmanlık</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    İhtiyaç analizi, aday eşleştirmesi, görüşme planlama ve yerleştirme sonrası takip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="surface rounded-[24px] border border-line p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Kimler İçin</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">Bu hizmet hangi ailelere uygun?</h2>
              <div className="mt-4 space-y-3">
                {whoIsItFor.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                    <p className="text-sm leading-6 text-muted">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-[24px] border border-line p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Değerlendirme</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">Adaylarda neyi kontrol ediyoruz?</h2>
              <div className="mt-4 space-y-3">
                {whatWeEvaluate.map((item, index) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-6 text-muted">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-[24px] border border-line p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Aday Profili</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">Aradığımız temel nitelikler</h2>
              <div className="mt-4 space-y-3">
                {candidateQualities.map((item) => (
                  <div key={item} className="rounded-2xl border border-line bg-white p-4">
                    <p className="text-sm leading-6 text-muted">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 ? (
        <section className="border-t border-line bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="h-px w-5 bg-[#B8860B]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">SSS</span>
            </div>
            <h2 className="font-heading text-3xl font-semibold text-navy">Sık sorulan sorular</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              {location.title} ve {serviceItem.title.toLowerCase()} için en çok sorulan birkaç soruyu aşağıda topladık.
            </p>
            <div className="mt-6">
              <FaqAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface rounded-[24px] border border-line p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Aynı Hizmetin Diğer Şehirleri</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">Bu hizmeti başka şehirlerde de görün</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {otherCities.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/hizmet-bolgeleri/${item.slug}/${serviceItem.slug}`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-sm text-navy transition hover:border-trust hover:text-trust"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface rounded-[24px] border border-line p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-trust">Hızlı Aksiyon</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-navy">Başvuruyu şimdi bırakalım</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Hizmet tipi net değilse bile sorun değil. Aile başvurusu ile şehir, bütçe ve çalışma düzenini bize bırakın;
                danışman ekibimiz yönlendirsin.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap
                </Link>
                <Link href="/hizmet-bolgeleri" className="btn-outline">
                  Öne Çıkan Şehirler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
