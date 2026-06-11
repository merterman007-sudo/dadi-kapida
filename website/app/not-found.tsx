import Link from "next/link";
import { Arrow, SectionLabel, SectionHeading } from "../components/page-chrome";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 lg:px-8">
      <div className="surface w-full rounded-[32px] p-6 md:p-8 lg:p-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-ivory shadow-soft">
            <span className="font-heading text-3xl font-semibold text-[#8C5368]">404</span>
          </div>

          <div className="mt-6">
            <SectionLabel>Sayfa Bulunamadı</SectionLabel>
            <SectionHeading
              title="Aradığınız sayfa bulunamadı."
              subtitle="Sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir. Ana sayfaya dönerek devam edebilirsiniz."
              centered
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-trust"
            >
              Ana Sayfaya Dön
              <Arrow white />
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-navy transition hover:border-navy"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
