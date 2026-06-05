import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
        <span className="font-heading text-3xl font-semibold text-gold">404</span>
      </div>
      <h1 className="font-heading text-3xl font-semibold text-navy md:text-4xl">
        Sayfa Bulunamadı
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-muted">
        Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-trust">
          Ana Sayfaya Dön
        </Link>
        <Link href="/iletisim" className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-navy transition hover:border-navy">
          İletişime Geç
        </Link>
      </div>
    </div>
  );
}
