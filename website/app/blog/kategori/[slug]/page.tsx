import Link from "next/link";
import { notFound } from "next/navigation";
import { blogCategories, blogPosts } from "../../../../lib/blog";

export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = blogCategories.find((item) => item.slug === slug);
  if (!category) return notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <div className="surface rounded-[34px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-trust">Kategori</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">{category.title}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">Ailelerin seçim sürecinde işine yarayacak kısa ve net içerikler.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="surface rounded-[26px] p-6 transition hover:-translate-y-0.5">
            <p className="text-base font-semibold text-navy">{post.title}</p>
            <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
