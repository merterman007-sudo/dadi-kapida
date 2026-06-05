import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
        {/* Hero */}
        <div className="relative h-72 overflow-hidden bg-navy md:h-96">
          <Image src={post.image} alt={post.title} fill className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
            <div className="mx-auto max-w-4xl">
              <Link href="/blog" className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold/80 hover:text-gold">
                ← Blog
              </Link>
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-white/75">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-gold/80">{post.category}</span>
                <span>{post.readingTime} dk okuma</span>
                <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <h1 className="font-heading text-2xl font-semibold text-white md:text-4xl">{post.title}</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
            {/* Article body */}
            <div className="min-w-0">
              <p className="mb-8 rounded-2xl border border-gold/25 bg-gold/5 px-5 py-4 text-sm leading-7 text-muted italic">
                {post.excerpt}
              </p>
              <div
                className="prose-dk"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* CTA in article */}
              <div className="mt-10 rounded-[20px] border border-gold/30 bg-navy p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Dadı Kapıda</p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">
                  Aileniz için doğru dadıyı profesyonel bir süreçle bulmaya hazır mısınız?
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Danışman ekibimiz ihtiyaç analizinden yerleştirme sonrası takibe kadar her adımda yanınızdadır.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/aile-basvurusu" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-[#d4b36a]">
                    Aile Başvurusu Yap
                  </Link>
                  <Link href="/iletisim" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:text-white">
                    Danışmanla Görüş
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden space-y-4 lg:block">
              {/* Author box */}
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-trust">Yazar</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                    <span className="text-sm font-semibold text-navy">DK</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">Dadı Kapıda</p>
                    <p className="text-xs text-muted">Danışmanlık Ekibi</p>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-trust">Hızlı Linkler</p>
                <div className="mt-3 space-y-2">
                  <Link href="/aile-basvurusu" className="block rounded-xl bg-navy px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-trust">
                    Aile Başvurusu
                  </Link>
                  <Link href="/dadi-basvurusu" className="block rounded-xl border border-line px-4 py-2.5 text-center text-sm font-medium text-navy transition hover:border-navy">
                    Dadı Başvurusu
                  </Link>
                  <Link href="/iletisim" className="block rounded-xl border border-line px-4 py-2.5 text-center text-sm font-medium text-navy transition hover:border-navy">
                    İletişim
                  </Link>
                </div>
              </div>

              {/* Tags/category */}
              <div className="rounded-[20px] border border-line bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-trust">Kategori</p>
                <div className="mt-3">
                  <span className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-navy">
                    {post.category}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 ? (
          <div className="bg-ivory py-12">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-trust">Devam Edin</p>
              <h2 className="mt-2 font-heading text-xl font-semibold text-navy">İlgili İçerikler</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group overflow-hidden rounded-[18px] border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-soft"
                  >
                    <div className="overflow-hidden">
                      <Image src={item.image} alt={item.title} width={400} height={240} className="h-36 w-full object-cover transition duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-trust">{item.category}</p>
                      <p className="mt-1.5 text-sm font-semibold text-navy leading-6">{item.title}</p>
                      <p className="mt-2 text-xs font-medium text-gold">Oku →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
