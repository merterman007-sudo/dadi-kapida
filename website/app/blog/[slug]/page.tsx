import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SectionHeading, SectionLabel } from "../../../components/page-chrome";
import { ArticleSchema, BreadcrumbSchema } from "../../../components/structured-data";
import { blogPosts } from "../../../lib/blog";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
      publishedTime: post.publishedAt
    },
    alternates: {
      canonical: `https://dadikapida.com/blog/${post.slug}`
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={`https://dadikapida.com/blog/${post.slug}`}
        image={`https://dadikapida.com${post.image}`}
        datePublished={post.publishedAt}
      />
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "https://dadikapida.com" },
          { name: "Blog", url: "https://dadikapida.com/blog" },
          { name: post.title, url: `https://dadikapida.com/blog/${post.slug}` }
        ]}
      />

      <article>
        <section className="border-b border-line bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-center">
              <div className="surface rounded-[32px] p-8 lg:p-10">
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold/80">
                  ← Blog
                </Link>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted">
                  <span className="rounded-full border border-line bg-bg px-3 py-1 text-green">{post.category}</span>
                  <span>{post.readingTime} dk okuma</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
                <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-muted">{post.excerpt}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/aile-basvurusu" className="btn-primary">
                    Aile Başvurusu Yap <Arrow white />
                  </Link>
                  <Link href="/iletisim" className="btn-outline">
                    Danışmanla Görüş
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[32px] border border-line bg-white shadow-lg">
                <div className="relative min-h-[340px]">
                  <Image src={post.image} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1015]/55 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="surface rounded-[24px] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green">Yazı Özeti</p>
                      <p className="mt-2 font-heading text-xl font-semibold text-ink">{post.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-bg py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
              <div className="min-w-0">
                <div className="surface rounded-[28px] p-6 lg:p-8">
                  <div
                    className="prose-dk"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                <div className="mt-8 rounded-[28px] bg-green p-6 lg:p-8">
                  <SectionLabel>Sonraki Adım</SectionLabel>
                  <h2 className="mt-3 font-heading text-2xl font-semibold text-white">
                    Aileniz için doğru eşleşmeyi birlikte yapalım
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/75">
                    Danışman ekibimiz ihtiyaç analizi, aday değerlendirmesi ve yerleştirme sonrası takip sürecinde yanınızdadır.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/aile-basvurusu" className="btn-gold">
                      Aile Başvurusu Yap <Arrow />
                    </Link>
                    <Link href="/iletisim" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/35 hover:text-white">
                      Danışmanla Görüş
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="surface rounded-[28px] p-6">
                  <SectionLabel>Yazar</SectionLabel>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8C5368]/10">
                      <span className="text-sm font-semibold text-green">DK</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Dadı Kapıda</p>
                      <p className="text-xs text-muted">Danışmanlık Ekibi</p>
                    </div>
                  </div>
                </div>

                <div className="surface rounded-[28px] p-6">
                  <SectionLabel>Hızlı Linkler</SectionLabel>
                  <div className="mt-4 space-y-2">
                    <Link href="/aile-basvurusu" className="btn-primary w-full justify-center">
                      Aile Başvurusu
                    </Link>
                    <Link href="/personel-basvurusu" className="btn-outline w-full justify-center">
                      Personel Başvurusu
                    </Link>
                    <Link href="/iletisim" className="btn-outline w-full justify-center">
                      İletişim
                    </Link>
                  </div>
                </div>

                <div className="surface rounded-[28px] p-6">
                  <SectionLabel>Kategori</SectionLabel>
                  <div className="mt-4">
                    <span className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-ink">
                      {post.category}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-line bg-white py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <SectionHeading
                title="İlgili içerikler"
                subtitle="Konuyla bağlantılı yazılara göz atarak karar sürecinizi genişletebilirsiniz."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group block overflow-hidden rounded-[28px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(28,16,21,0.08)]"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1015]/35 to-transparent" />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-trust">{item.category}</p>
                      <p className="mt-1.5 text-sm font-semibold text-ink leading-6">{item.title}</p>
                      <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-gold transition group-hover:gap-3">
                        Oku <Arrow />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}

