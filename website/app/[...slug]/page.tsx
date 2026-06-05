import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WebsiteRequestForm } from "../../components/website-request-form";
import { fetchPublic } from "../../lib/api";
import { faqs, genericPageData, locations, services } from "../../lib/content";
import { legalContent } from "../../lib/legal-content";
import { resolveSiteImages, type WebsiteSettingsWithImages } from "../../lib/images";

type CmsPage = {
  slug: string;
  title: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  payload?: {
    sections?: Array<{
      type?: string;
      title?: string;
      body?: string;
    }>;
  };
};

function slugToKey(slug: string[]) {
  return slug.join("/");
}

const eyebrowByPrefix: Record<string, string> = {
  "aileler-icin": "Aileler İçin",
  "dadilar-icin": "Dadılar İçin",
  hizmetlerimiz: "Hizmetlerimiz",
  "hizmet-bolgeleri": "Hizmet Bölgeleri",
  istanbul: "Hizmet Bölgeleri",
  rehberler: "Rehberler",
  hakkimizda: "Hakkımızda",
  ekibimiz: "Ekibimiz",
  referanslar: "Referanslar",
  "basari-hikayeleri": "Başarı Hikayeleri",
  "basinda-biz": "Basında Biz",
  "is-ortaklari": "İş Ortakları",
  iletisim: "İletişim",
  "geri-aranma-talebi": "İletişim",
  "online-gorusme-talebi": "İletişim",
  randevu: "İletişim",
  "sikayet-ve-oneri": "İletişim",
  "aile-destek": "Destek",
  "aday-destek": "Destek",
  "sik-sorulan-sorular": "Sık Sorulan Sorular",
  "neden-dadi-kapida": "Neden Biz",
  "guvenlik-ve-dogrulama": "Güvenlik",
  "sorumluluk-ve-degerlerimiz": "Değerlerimiz",
  "kvkk-aydinlatma-metni": "Yasal",
  "gizlilik-politikasi": "Yasal",
  "cerez-politikasi": "Yasal",
  "acik-riza-metni": "Yasal",
  "kullanim-sartlari": "Yasal",
  "basvuru-sartlari": "Yasal",
  "aday-aydinlatma-metni": "Yasal",
  "aile-aydinlatma-metni": "Yasal",
  "veri-sahibi-basvuru-formu": "Yasal",
  "yasal-bilgilendirme": "Yasal",
  "ankara-dadi": "Hizmet Bölgeleri",
  "izmir-dadi": "Hizmet Bölgeleri",
  "antalya-dadi": "Hizmet Bölgeleri",
  "istanbul-dadi": "Hizmet Bölgeleri",
};

function getEyebrow(key: string): string {
  if (eyebrowByPrefix[key]) return eyebrowByPrefix[key];
  const prefix = key.split("/")[0];
  return prefix ? eyebrowByPrefix[prefix] ?? "Dadı Kapıda" : "Dadı Kapıda";
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const key = slugToKey(resolvedParams.slug);
  const item = genericPageData[key as keyof typeof genericPageData];
  if (!item) {
    const cmsPage = await fetchPublic<CmsPage | null>(`/api/v1/public/pages/${key}`, null);
    if (!cmsPage) return {};
    return {
      title: cmsPage.seo_title ?? cmsPage.title,
      description: cmsPage.meta_description ?? cmsPage.hero_subtitle ?? cmsPage.title
    };
  }
  return {
    title: item.title,
    description: item.subtitle
  };
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const key = slugToKey(resolvedParams.slug);
  const siteSettings = await fetchPublic<WebsiteSettingsWithImages>("/api/v1/public/site-settings", {});
  const siteImages = resolveSiteImages(siteSettings);

  const item =
    genericPageData[key as keyof typeof genericPageData] ??
    genericPageData[resolvedParams.slug[0] as keyof typeof genericPageData];

  if (!item) {
    const cmsPage = await fetchPublic<CmsPage | null>(`/api/v1/public/pages/${key}`, null);
    if (cmsPage) {
      const sections = cmsPage.payload?.sections ?? [];
      return (
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <div className="relative overflow-hidden rounded-[24px] bg-[#0F1921] p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-gold/10" />
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-px w-6 bg-gold/60" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">Dadi Kapida</span>
            </div>
            <h1 className="relative font-heading text-3xl font-semibold text-white md:text-4xl">
              {cmsPage.hero_title ?? cmsPage.title}
            </h1>
            {cmsPage.hero_subtitle ? (
              <p className="relative mt-3 text-sm leading-7 text-white/75">{cmsPage.hero_subtitle}</p>
            ) : null}
          </div>

          {sections.length > 0 ? (
            <div className="mt-8 space-y-4 rounded-[20px] border border-line bg-white p-8">
              {sections.map((section, index) => (
                <section key={`${section.type ?? "section"}-${index}`} className="space-y-2">
                  {section.title ? <h2 className="font-heading text-2xl font-semibold text-navy">{section.title}</h2> : null}
                  {section.body ? <p className="text-sm leading-8 text-muted">{section.body}</p> : null}
                </section>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/aile-basvurusu" className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-trust">
              Aile Başvurusu Yap
            </Link>
            <Link href="/" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-navy transition hover:border-navy">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      );
    }

    if (resolvedParams.slug[0] === "hizmetlerimiz" && resolvedParams.slug[1]) {
      const service = services.find((entry) => entry.slug === resolvedParams.slug[1]);
      if (!service) return notFound();
      return (
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="surface rounded-[34px] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-trust">Hizmetlerimiz</p>
              <h1 className="mt-3 text-4xl font-semibold text-navy">{service.title}</h1>
              <p className="mt-4 text-sm leading-7 text-muted">{service.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-white">
                  Aile Başvurusu Yap
                </Link>
                <Link href="/hizmetlerimiz" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-navy">
                  Hizmetlere dön
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-[34px] border border-line bg-white shadow-soft">
              <Image src={siteImages.trust} alt={service.title} width={1400} height={1000} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      );
    }

    if (resolvedParams.slug[0] === "istanbul" && resolvedParams.slug[1]) {
      const location = locations.find((entry) =>
        entry.slug === "istanbul"
          ? resolvedParams.slug[1] === "dadi" || resolvedParams.slug[1] === "istanbul-dadi"
          : `${entry.slug}-dadi` === resolvedParams.slug[1]
      );
      if (!location) return notFound();
      return (
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="surface rounded-[34px] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-trust">Hizmet Bölgeleri</p>
              <h1 className="mt-3 text-4xl font-semibold text-navy">{location.title} dadı hizmetleri</h1>
              <p className="mt-4 text-sm leading-7 text-muted">{location.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-white">
                  Aile Başvurusu Yap
                </Link>
                <Link href="/hizmet-bolgeleri" className="rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-navy">
                  Bölgelere dön
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-[34px] border border-line bg-white shadow-soft">
              <Image src={siteImages.process} alt={location.title} width={1400} height={1000} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      );
    }

    return notFound();
  }

  const requestFormKind =
    key === "geri-aranma-talebi"
      ? "callback"
      : key === "online-gorusme-talebi"
        ? "online"
        : ["iletisim", "randevu", "sikayet-ve-oneri", "aile-destek", "aday-destek"].includes(key)
          ? "contact"
          : null;

  const eyebrow = getEyebrow(key);

  const isLegalPage = ["kvkk-aydinlatma-metni","gizlilik-politikasi","cerez-politikasi","acik-riza-metni","kullanim-sartlari","basvuru-sartlari","aday-aydinlatma-metni","aile-aydinlatma-metni","veri-sahibi-basvuru-formu","yasal-bilgilendirme"].includes(key);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#6D3D51] p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
        <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[#8C5368]/40" />
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-px w-6 bg-gold/60" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/80">{eyebrow}</span>
        </div>
        <h1 className="relative font-heading text-3xl font-semibold text-white md:text-4xl">{item.title}</h1>
        <p className="relative mt-3 text-sm leading-7 text-white/80">{item.subtitle}</p>
        {isLegalPage ? (
          <p className="relative mt-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold/90">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2l.9 5.4h4.6L9.1 10l1.8 4.4L8 12l-2.9 2.4 1.8-4.4L2.5 7.4H7L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            Bu sayfa hukuki danışmanlık gerektirmektedir. Resmi metin değildir.
          </p>
        ) : null}
      </div>

      {/* İçerik grid */}
      {!requestFormKind && !isLegalPage ? (
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {services.slice(0, 4).map((service) => (
            <Link
              key={service.slug}
              href={`/hizmetlerimiz/${service.slug}`}
              className="group rounded-[18px] border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_8px_24px_rgba(22,32,42,0.08)]"
            >
              <p className="font-heading text-base font-semibold text-navy">{service.title}</p>
              <p className="mt-1.5 text-sm leading-6 text-muted">{service.description}</p>
              <p className="mt-3 text-xs font-semibold text-gold transition group-hover:translate-x-0.5">Detaylı bilgi →</p>
            </Link>
          ))}
          {faqs.slice(0, 4).map((faq) => (
            <div key={faq.question} className="rounded-[18px] border border-line bg-white p-5">
              <p className="font-semibold text-navy">{faq.question}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      ) : null}

      {/* İletişim formu */}
      {requestFormKind ? <WebsiteRequestForm kind={requestFormKind} /> : null}

      {/* Legal content */}
      {isLegalPage ? (
        <div className="mt-8 space-y-4">
          {legalContent[key]?.sections.map((section) => (
            <div key={section.heading} className="rounded-[20px] border border-line bg-white p-8">
              <h2 className="mb-3 font-heading text-base font-semibold text-navy">{section.heading}</h2>
              <p className="whitespace-pre-line text-sm leading-8 text-muted">{section.body}</p>
            </div>
          )) ?? (
            <div className="rounded-[20px] border border-line bg-white p-8">
              <p className="text-sm leading-8 text-muted">
                Bu sayfa içeriği yakında güncellenecektir.
              </p>
            </div>
          )}
          {legalContent[key] && (
            <p className="text-xs text-muted/60 px-2">Son güncelleme: {legalContent[key].lastUpdated}</p>
          )}
          <div className="rounded-[20px] bg-[#FDFAF5] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-trust mb-2">Sorularınız mı var?</p>
            <Link href="/iletisim" className="text-sm font-medium text-navy underline underline-offset-2 hover:text-trust">
              Danışmanlarımızla iletişime geçin →
            </Link>
          </div>
        </div>
      ) : null}

      {/* Her sayfada CTA */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/aile-basvurusu" className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-trust">
          Aile Başvurusu Yap
        </Link>
        <Link href="/" className="rounded-full border border-line px-6 py-3 text-sm font-medium text-navy transition hover:border-navy">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
