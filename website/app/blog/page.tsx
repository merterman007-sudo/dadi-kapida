import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchPublic } from "../../lib/api";
import { blogPosts, blogCategories } from "../../lib/blog";
import { resolveSiteImages, type WebsiteSettingsWithImages } from "../../lib/images";
import { Arrow, SectionHeading, SectionLabel } from "../../components/page-chrome";

export const metadata: Metadata = {
  title: "Blog | Dadı Kapıda",
  description: "Dadı seçme, güvenlik ve çalışma modeli üzerine güncel rehber içerikler.",
  alternates: { canonical: "https://dadikapida.com/blog" }
};

type HomeSiteSettings = WebsiteSettingsWithImages;

export default async function BlogPage() {
  const siteSettings = await fetchPublic<HomeSiteSettings>("/api/v1/public/site-settings", {});
  const siteImages = resolveSiteImages(siteSettings);
  const featuredImage = blogPosts[0]?.image ?? siteImages.blogDefault;

  return (
    <>
      <section className="border-b border-line bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
            <div className="surface rounded-[32px] p-8 lg:p-10">
              <SectionLabel>Blog</SectionLabel>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Aileler için rehber içerikler
              </h1>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-muted">
                Dadı seçme rehberi, güvenlik, çalışma modeli ve yerleştirme süreçleri üzerine sade ve uygulanabilir içerikler.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog/kategori/${category.slug}`}
                    className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-medium text-ink transition hover:border-green hover:text-green"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>

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
                <Image src={featuredImage} alt={blogPosts[0]?.title ?? "Blog"} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1015]/55 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="surface rounded-[24px] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-green">Öne çıkan yazı</p>
                    <p className="mt-2 font-heading text-xl font-semibold text-ink">{blogPosts[0]?.title ?? "Blog"}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{blogPosts[0]?.excerpt ?? ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bg py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              title="Son rehber içerikler"
              subtitle="Kısa, net ve uygulaması kolay içeriklerle karar sürecini kolaylaştırıyoruz."
            />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-[28px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(28,16,21,0.08)]"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1015]/35 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-[10px] text-muted">
                    <span>{post.readingTime} dk</span>
                    <span>·</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <p className="font-heading text-lg font-semibold text-ink">{post.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gold transition group-hover:gap-3">
                    Devamını oku <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <SectionLabel>Sonraki Adım</SectionLabel>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-ink sm:text-4xl">
            Doğru dadıyı bulmak için başvuru yapın
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Danışman ekibimiz ihtiyaç analizinden yerleştirme sonrası takibe kadar her adımda yanınızdadır.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap <Arrow white />
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

