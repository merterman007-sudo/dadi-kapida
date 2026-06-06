import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchPublic } from "../../lib/api";
import { blogPosts, blogCategories } from "../../lib/blog";
import { resolveSiteImages, type WebsiteSettingsWithImages } from "../../lib/images";

export const metadata: Metadata = {
  title: "Blog — Aileler için Rehber İçerikler",
  description: "Dadı seçme, güvenlik ve çalışma modeli üzerine güncel rehberler. Karar sürecinizi kolaylaştıracak pratik içerikler.",
  alternates: { canonical: "https://dadikapida.com/blog" }
};

export default async function BlogPage() {
  const siteSettings = await fetchPublic<WebsiteSettingsWithImages>("/api/v1/public/site-settings", {});
  const siteImages = resolveSiteImages(siteSettings);
  const featuredImage = blogPosts[0]?.image ?? siteImages.blogDefault;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="relative overflow-hidden rounded-[28px] bg-[#8C5368] p-8 shadow-md">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-white/6" />
          <div className="relative flex items-center gap-2.5">
            <span className="h-px w-6 bg-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Blog</span>
          </div>
          <h1 className="relative mt-4 font-heading text-3xl font-semibold text-white md:text-4xl">
            Aileler için rehber içerikler
          </h1>
          <p className="relative mt-4 text-sm leading-7 text-white/80">
            Dadı seçme rehberi, güvenlik ve çalışma modeli üzerine güncel içerikler.
          </p>
          <div className="relative mt-6 flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/kategori/${category.slug}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-gold/50 hover:text-gold"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[28px] shadow-premium">
          <Image
            src={featuredImage}
            alt={blogPosts[0]?.title ?? "Blog"}
            width={1400}
            height={900}
            className="h-full min-h-[320px] w-full object-cover"
          />
        </div>
      </div>

      {/* Posts grid */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-[20px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-premium"
          >
            <div className="overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={380}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-trust">{post.category}</span>
                <span className="text-[10px] text-muted/50">·</span>
                <span className="text-[10px] text-muted/60">{post.readingTime} dk</span>
              </div>
              <p className="font-heading text-base font-semibold text-navy">{post.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
              <p className="mt-4 text-xs font-semibold text-gold">Devamını oku →</p>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-[24px] border border-gold/25 bg-navy p-8 text-center">
        <p className="font-heading text-2xl font-semibold text-white">Doğru dadıyı bulmak için başvuru yapın</p>
        <p className="mt-2 text-sm text-white/75">Danışman ekibimiz ihtiyaç analizinden yerleştirmeye kadar her adımda yanınızdadır.</p>
        <Link href="/aile-basvurusu" className="mt-5 inline-flex rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition hover:bg-[#d4b36a]">
          Aile Başvurusu Yap
        </Link>
      </div>
    </div>
  );
}
