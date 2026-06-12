import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogCategories, blogPosts } from "../../../../lib/blog";
import { Arrow, SectionHeading, SectionLabel } from "../../../../components/page-chrome";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = blogCategories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: category.title,
    description: `${category.title} kategorisindeki Dadı Kapıda rehber yazıları.`,
    alternates: {
      canonical: `https://dadikapida.com/blog/kategori/${category.slug}`
    }
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = blogCategories.find((item) => item.slug === slug);
  if (!category) return notFound();
  const categoryPosts = blogPosts.filter((post) => post.category === category.title);

  return (
    <section className="bg-bg py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="surface rounded-[32px] p-8 lg:p-10">
          <SectionLabel>Kategori</SectionLabel>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-ink">{category.title}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">Ailelerin seçim sürecinde işine yarayacak kısa ve net içerikler.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {categoryPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="surface rounded-[28px] p-6 transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(28,16,21,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-trust">{post.category}</p>
              <p className="mt-2 font-heading text-lg font-semibold text-ink">{post.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{post.excerpt}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gold">
                Oku <Arrow />
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/blog" className="btn-outline">
            Tüm blog yazıları
          </Link>
        </div>
      </div>
    </section>
  );
}
