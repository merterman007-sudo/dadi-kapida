import type { Metadata } from "next";
import Link from "next/link";
import { ServiceVisual } from "../../components/service-visual";
import { BreadcrumbSchema } from "../../components/structured-data";
import { servicesContent } from "../../lib/services-content";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Dadı Kapıda",
  description:
    "Yatılı dadı, gündüzlü dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlik, şoför, aşçı, kahya ve ev yardımcısı için profesyonel personel çözümleri.",
  alternates: { canonical: "https://dadikapida.com/hizmetlerimiz" }
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold flex items-center gap-2">
      <span className="h-px w-5 bg-current opacity-60" />
      {children}
    </p>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServicesPage() {
  const serviceCount = `${servicesContent.length}+`;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Hizmetlerimiz", url: "https://dadikapida.com/hizmetlerimiz" }
        ]}
      />

      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-green transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="font-medium text-ink">Hizmetlerimiz</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div className="max-w-2xl">
              <SectionLabel>Hizmetlerimiz</SectionLabel>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Ailenizin ihtiyacına göre profesyonel personel çözümleri
              </h1>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-7 text-muted">
                Her hizmet kategorisi için ayrı görsel, ayrı anlatım ve daha net bir danışmanlık akışı kullanıyoruz. Bu sayfa,
                ailelerin hizmeti hızlıca ayırt edebilmesi için düzenlendi.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow />
                </Link>
                <Link href="/iletisim" className="btn-outline">
                  Danışmanla Görüş
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: serviceCount, label: "Hizmet grubu" },
                { value: "1:1", label: "Danışman takibi" },
                { value: "Türkiye geneli", label: "Talep alımı" },
                { value: "Güven", label: "Öncelikli yaklaşım" }
              ].map((item) => (
                <div key={item.label} className="surface rounded-[24px] p-5">
                  <p className="font-heading text-[1.55rem] font-semibold text-green">{item.value}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <SectionLabel>Hizmet Kartları</SectionLabel>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-[2.2rem]">
                Her hizmet için ayrı görsel ve net açıklama
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {servicesContent.map((service) => (
              <Link
                key={service.slug}
                href={`/hizmetlerimiz/${service.slug}`}
                className="group block overflow-hidden rounded-[30px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(28,16,21,0.08)]"
              >
                <ServiceVisual slug={service.slug} title={service.title} compact framed={false} className="rounded-none" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-[1.15rem] font-semibold text-ink">{service.title}</h3>
                      <p className="mt-1 text-[11px] font-medium italic text-gold/80">{service.tagline}</p>
                    </div>
                    <span className="rounded-full bg-[#FAF5F7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green">
                      Premium
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted">{service.shortDescription}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.whoIsItFor.slice(0, 2).map((item) => (
                      <span key={item} className="rounded-full border border-line bg-bg px-3 py-1 text-[11px] font-medium text-muted">
                        {item}
                      </span>
                    ))}
                  </div>

                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gold transition group-hover:gap-3">
                    Detaylı incele <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <SectionLabel>Hemen Başlayın</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            Hangi hizmete ihtiyacınız olduğundan emin değil misiniz?
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Danışman ekibimiz, ailenizin ihtiyacını analiz ederek en doğru hizmet modelini netleştirmenize yardımcı olur.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap <Arrow />
            </Link>
            <Link href="/iletisim" className="btn-outline">
              Danışmanla Görüş
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
