import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "../../../components/faq-accordion";
import { BreadcrumbSchema } from "../../../components/structured-data";
import { blogPosts } from "../../../lib/blog";
import { getServiceContent, servicesContent } from "../../../lib/services-content";

export function generateStaticParams() {
  return servicesContent.map((s) => ({ slug: s.slug }));
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F1921] py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 to-[#0F1921]" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full border border-gold/10 translate-x-1/2 -translate-y-1/3" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full border border-gold/6 translate-x-1/3 -translate-y-1/4" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs text-white/70">
            <Link href="/" className="hover:text-white/70 transition">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/hizmetlerimiz" className="hover:text-white/70 transition">Hizmetlerimiz</Link>
            <span>/</span>
            <span className="text-gold/70">{service.title}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-px w-7 bg-gold/70" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold/80">Hizmetlerimiz</span>
            </div>
            <h1 className="font-heading text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-4 text-lg text-gold/70 font-medium">{service.tagline}</p>
            <p className="mt-4 text-base leading-7 text-white/75">{service.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/aile-basvurusu"
                className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-navy transition hover:bg-[#d4b36a] shadow-[0_8px_32px_rgba(196,164,90,0.30)]"
              >
                Aile Başvurusu Yap
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/iletisim"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Danışmanla Görüş
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ana içerik */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Sol — içerik */}
          <div className="space-y-12">
            {/* Hakkında */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="h-px w-7 bg-gold" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">Hakkında</span>
              </div>
              <p className="text-base leading-8 text-muted">{service.longDescription}</p>
            </div>

            {/* Kimler için */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="h-px w-7 bg-gold" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">Kimler İçin</span>
              </div>
              <h2 className="font-heading text-xl font-semibold text-navy mb-5">Bu hizmet kimler için uygundur?</h2>
              <div className="space-y-2">
                {service.whoIsItFor.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0FBF4]">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l2.5 2.5 5.5-5.5" stroke="#2D7A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-navy">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Neyi değerlendiriyoruz */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="h-px w-7 bg-gold" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">Değerlendirme</span>
              </div>
              <h2 className="font-heading text-xl font-semibold text-navy mb-5">Adaylarda neyi değerlendiriyoruz?</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {service.whatWeEvaluate.map((item, i) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/12 font-heading text-[10px] font-bold text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-navy">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aday profili */}
            <div className="rounded-[22px] bg-[#0F1921] p-6 lg:p-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="h-px w-7 bg-gold/60" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold/70">Aday Profili</span>
              </div>
              <h2 className="font-heading text-xl font-semibold text-white mb-5">Aradığımız nitelikler</h2>
              <div className="space-y-2">
                {service.candidateQualities.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <p className="text-sm text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SSS */}
            {service.faqs.length > 0 ? (
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="h-px w-7 bg-gold" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">SSS</span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-navy mb-5">Sık sorulan sorular</h2>
                <FaqAccordion faqs={service.faqs} />
              </div>
            ) : null}

            {/* İlgili blog yazıları */}
            {relatedPosts.length > 0 ? (
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="h-px w-7 bg-gold" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">Rehberler</span>
                </div>
                <h2 className="font-heading text-xl font-semibold text-navy mb-5">İlgili içerikler</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group rounded-[18px] border border-line bg-white p-4 transition hover:border-gold/40 hover:shadow-[0_8px_24px_rgba(22,32,42,0.08)]"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-trust">{post.category}</span>
                      <p className="mt-1.5 font-heading text-sm font-semibold text-navy">{post.title}</p>
                      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-gold transition group-hover:gap-2">
                        Oku
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sağ sidebar */}
          <aside className="space-y-4">
            {/* CTA kartı */}
            <div className="sticky top-24 space-y-3">
              <div className="rounded-[20px] bg-navy p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70 mb-3">Başvuru Yap</p>
                <p className="font-heading text-lg font-semibold text-white leading-snug">
                  Ailenize doğru adayı birlikte bulalım
                </p>
                <p className="mt-2 text-xs text-white/70 leading-6">
                  Başvuru ortalama 4–6 dk sürer. Danışman ekibimiz sizinle iletişime geçer.
                </p>
                <div className="mt-4 space-y-2">
                  <Link href="/aile-basvurusu" className="flex items-center justify-center gap-2 w-full rounded-full bg-gold py-3 text-sm font-semibold text-navy transition hover:bg-[#d4b36a]">
                    Aile Başvurusu Yap
                  </Link>
                  <Link href="/iletisim" className="flex items-center justify-center w-full rounded-full border border-white/20 py-3 text-sm font-medium text-white/65 transition hover:text-white hover:border-white/35">
                    Önce Görüşelim
                  </Link>
                </div>
              </div>

              {/* Diğer hizmetler */}
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-trust mb-3">Diğer Hizmetler</p>
                <div className="space-y-1.5">
                  {servicesContent.filter((s) => s.slug !== slug).slice(0, 5).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/hizmetlerimiz/${s.slug}`}
                      className="block rounded-xl px-3 py-2 text-sm text-navy transition hover:bg-[#FDFAF5] hover:text-trust"
                    >
                      {s.title}
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

      {/* Bottom CTA */}
      <section className="bg-[#FDFAF5] py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="h-px w-7 bg-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold">Hemen Başlayın</span>
            <span className="h-px w-7 bg-gold" />
          </div>
          <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
            {service.title} konusunda doğru adayı bulmaya hazır mısınız?
          </h2>
          <p className="mt-3 text-base text-muted">
            Danışman ekibimiz ihtiyaç analizinden yerleştirme sonrası takibe kadar her adımda yanınızdadır.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-trust">
              Aile Başvurusu Yap
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/hizmetlerimiz" className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-navy transition hover:border-navy">
              Tüm Hizmetler
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
