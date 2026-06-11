import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "../../../components/faq-accordion";
import { ServiceVisual } from "../../../components/service-visual";
import { BreadcrumbSchema } from "../../../components/structured-data";
import { blogPosts } from "../../../lib/blog";
import { getServiceContent, servicesContent } from "../../../lib/services-content";

export function generateStaticParams() {
  return servicesContent.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceContent(slug);
  if (!service) return {};

  return {
    title: `${service.title} | Dadı Kapıda`,
    description: service.shortDescription,
    alternates: { canonical: `https://dadikapida.com/hizmetlerimiz/${service.slug}` }
  };
}

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

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceContent(slug);

  if (!service) return notFound();

  const relatedPosts = blogPosts.slice(0, 2);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Hizmetlerimiz", url: "https://dadikapida.com/hizmetlerimiz" },
          { name: service.title, url: `https://dadikapida.com/hizmetlerimiz/${service.slug}` }
        ]}
      />

      <section className="relative overflow-hidden border-b border-line bg-white py-16 lg:py-24">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-bg lg:block" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-green transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <Link href="/hizmetlerimiz" className="hover:text-green transition-colors">
              Hizmetlerimiz
            </Link>
            <span>/</span>
            <span className="text-ink font-medium">{service.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div className="max-w-2xl">
              <SectionLabel>Hizmet Detayı</SectionLabel>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-[3.8rem]">
                {service.title}
              </h1>
              <p className="mt-4 text-lg font-medium text-gold/80">{service.tagline}</p>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-7 text-muted">{service.shortDescription}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow />
                </Link>
                <Link href="/iletisim" className="btn-outline">
                  Danışmanla Görüş
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Referans kontrolü",
                  "Aileye özel eşleştirme",
                  "Yerleştirme sonrası takip"
                ].map((item) => (
                  <div key={item} className="surface rounded-[18px] px-4 py-3">
                    <p className="text-sm font-medium text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <ServiceVisual slug={service.slug} title={service.title} className="min-h-[440px]" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="space-y-12">
            <div className="surface rounded-[30px] p-6 lg:p-8">
              <SectionLabel>Hakkında</SectionLabel>
              <p className="mt-4 text-base leading-8 text-muted">{service.longDescription}</p>
            </div>

            <div>
              <SectionLabel>Kimler İçin</SectionLabel>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-ink">Bu hizmet kimler için uygundur?</h2>
              <div className="mt-5 grid gap-3">
                {service.whoIsItFor.map((item) => (
                  <div key={item} className="surface flex items-start gap-3 rounded-[22px] p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8C5368]/10">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l2.5 2.5 5.5-5.5" stroke="#8C5368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-sm font-medium text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Değerlendirme</SectionLabel>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-ink">Adaylarda neyi değerlendiriyoruz?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.whatWeEvaluate.map((item, index) => (
                  <div key={item} className="surface flex items-start gap-3 rounded-[22px] p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/12 font-heading text-[10px] font-bold text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] bg-green p-6 lg:p-8">
              <SectionLabel>Aranan Profil</SectionLabel>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-white">Aradığımız nitelikler</h2>
              <div className="mt-5 grid gap-3">
                {service.candidateQualities.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/6 px-4 py-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <p className="text-sm text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {service.faqs.length > 0 ? (
              <div>
                <SectionLabel>SSS</SectionLabel>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-ink">Sık sorulan sorular</h2>
                <div className="mt-5">
                  <FaqAccordion faqs={service.faqs} />
                </div>
              </div>
            ) : null}

            {relatedPosts.length > 0 ? (
              <div>
                <SectionLabel>Rehberler</SectionLabel>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-ink">İlgili içerikler</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group surface rounded-[24px] p-5 transition hover:-translate-y-0.5"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-trust">
                        {post.category}
                      </span>
                      <p className="mt-1.5 font-heading text-base font-semibold text-ink">{post.title}</p>
                      <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-gold transition group-hover:gap-3">
                        Oku <Arrow />
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[28px] bg-navy p-6">
                <SectionLabel>Başvuru Yap</SectionLabel>
                <p className="mt-3 font-heading text-2xl font-semibold leading-tight text-white">
                  Ailenize uygun adayları birlikte bulalım
                </p>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  Başvuru 4-6 dakikada tamamlanır. Danışman ekibimiz sizinle iletişime geçer.
                </p>
                <div className="mt-5 space-y-2">
                  <Link href="/aile-basvurusu" className="btn-gold w-full justify-center">
                    Aile Başvurusu Yap
                  </Link>
                  <Link href="/iletisim" className="inline-flex w-full justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/72 transition hover:border-white/35 hover:text-white">
                    Önce Görüşelim
                  </Link>
                </div>
              </div>

              <div className="surface rounded-[28px] p-6">
                <SectionLabel>Diğer Hizmetler</SectionLabel>
                <div className="mt-4 space-y-1.5">
                  {servicesContent
                    .filter((entry) => entry.slug !== slug)
                    .slice(0, 5)
                    .map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/hizmetlerimiz/${entry.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-[#FAF5F7] hover:text-green"
                      >
                        {entry.title}
                      </Link>
                    ))}
                  <Link href="/hizmetlerimiz" className="block rounded-xl px-3 py-2 text-sm font-medium text-gold transition hover:bg-gold/8">
                    Tüm hizmetler →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <section className="bg-bg py-14 lg:py-16">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <SectionLabel>Hemen Başlayın</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            {service.title} konusunda doğru adayı bulmaya hazır mısınız?
          </h2>
          <p className="mt-3 text-base text-muted">
            Danışman ekibimiz ihtiyaç analizinden yerleştirme sonrası takibe kadar her adımda yanınızdadır.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap <Arrow />
            </Link>
            <Link href="/hizmetlerimiz" className="btn-outline">
              Tüm Hizmetler
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
