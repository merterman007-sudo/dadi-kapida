import { notFound } from "next/navigation";

export default async function BlogTagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <div className="surface rounded-[34px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-trust">Etiket</p>
        <h1 className="mt-3 text-4xl font-semibold text-navy">{slug.replaceAll("-", " ")}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Bu başlık altındaki rehber içerikler, ailelerin karar sürecinde ihtiyaç duyduğu temel bilgileri bir araya getirir.
        </p>
      </div>
    </div>
  );
}
