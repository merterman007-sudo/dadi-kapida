import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SectionHeading, SectionLabel } from "../../../../components/page-chrome";

export default async function BlogTagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  return (
    <section className="bg-bg py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="surface rounded-[32px] p-8 lg:p-10">
          <SectionLabel>Etiket</SectionLabel>
          <h1 className="mt-4 font-heading text-4xl font-semibold text-ink">{slug.replaceAll("-", " ")}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            Bu başlık altındaki rehber içerikler, ailelerin karar sürecinde ihtiyaç duyduğu temel bilgileri bir araya getirir.
          </p>
          <div className="mt-8">
            <SectionHeading
              title="İlgili içerikleri keşfedin"
              subtitle="Blog ana sayfasından daha fazla rehber içeriğe ulaşabilirsiniz."
            />
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/blog" className="btn-primary">
                Bloga Dön <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
