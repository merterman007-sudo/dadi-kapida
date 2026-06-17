import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, SectionHeading, SectionLabel } from "../../components/page-chrome";
import { ServiceVisual } from "../../components/service-visual";
import { WebsiteRequestForm } from "../../components/website-request-form";
import { fetchPublic } from "../../lib/api";
import { faqs, genericPageData, locations, services } from "../../lib/content";
import { legalContent } from "../../lib/legal-content";
import { defaultSiteImages, resolveSiteImages, type WebsiteSettingsWithImages } from "../../lib/images";

type CmsPage = {
  slug: string;
  title: string;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
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
  "dadilar-icin": "Personel İçin",
  hizmetlerimiz: "Hizmetlerimiz",
  "hizmet-bolgeleri": "Türkiye Geneli Hizmet",
  istanbul: "Türkiye Geneli Hizmet",
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
  "ankara-dadi": "Türkiye Geneli Hizmet",
  "izmir-dadi": "Türkiye Geneli Hizmet",
  "antalya-dadi": "Türkiye Geneli Hizmet",
  "istanbul-dadi": "Türkiye Geneli Hizmet",
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
      description: cmsPage.meta_description ?? cmsPage.hero_subtitle ?? cmsPage.title,
      alternates: {
        canonical: cmsPage.canonical_url ?? `https://dadikapida.com/${key}`
      }
    };
  }
  return {
    title: item.title,
    description: item.subtitle,
    alternates: {
      canonical: `https://dadikapida.com/${key}`
    }
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
        <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
          <div className="surface rounded-[32px] p-6 md:p-8 lg:p-10">
            <div className="max-w-3xl">
              <SectionLabel>Dadı Kapıda</SectionLabel>
              <SectionHeading
                title={cmsPage.hero_title ?? cmsPage.title}
                subtitle={cmsPage.hero_subtitle ?? undefined}
              />
            </div>
          </div>

          {sections.length > 0 ? (
            <div className="mt-8 space-y-4 rounded-[20px] border border-line bg-white p-8">
              {sections.map((section, index) => (
                <section key={`${section.type ?? "section"}-${index}`} className="space-y-2">
                  {section.title ? <h2 className="font-heading text-2xl font-semibold text-ink">{section.title}</h2> : null}
                  {section.body ? <p className="text-sm leading-8 text-muted">{section.body}</p> : null}
                </section>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/aile-basvurusu" className="btn-primary">
              Aile Başvurusu Yap
              <Arrow white />
            </Link>
            <Link href="/" className="btn-outline">
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Hizmetlerimiz</p>
              <h1 className="mt-3 text-4xl font-semibold text-ink">{service.title}</h1>
              <p className="mt-4 text-sm leading-7 text-muted">{service.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap
                </Link>
                <Link href="/hizmetlerimiz" className="btn-outline">
                  Hizmetlere dön
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-[34px] border border-line bg-white shadow-soft">
              <ServiceVisual slug={service.slug} title={service.title} framed={false} className="min-h-[360px] rounded-none" />
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
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green">Türkiye Geneli Hizmet</p>
              <h1 className="mt-3 text-4xl font-semibold text-ink">{location.title} dadı hizmetleri</h1>
              <p className="mt-4 text-sm leading-7 text-muted">{location.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap
                </Link>
                <Link href="/hizmet-bolgeleri" className="btn-outline">
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
  const heroImage =
    key.includes("guven") || key === "neden-dadi-kapida"
      ? siteImages.trust
      : key.includes("nasil-calisir") || key.includes("surec")
        ? siteImages.process
        : siteImages.hero;

  return (
    <div className={`mx-auto px-5 py-10 lg:px-8 lg:py-14 ${key === "neden-dadi-kapida" ? "max-w-6xl" : "max-w-5xl"}`}>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[34px] border border-line bg-white shadow-[0_28px_80px_rgba(7,27,58,0.10)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(233,24,91,0.11),transparent_28%),linear-gradient(90deg,#ffffff_0%,#ffffff_58%,#fff3f7_100%)]" />
        <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:p-10">
          <div>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="h-px w-6 bg-green/65" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-green">{eyebrow}</span>
            </div>
            <h1 className="font-heading text-4xl font-semibold leading-[1.02] text-ink md:text-5xl">{item.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{item.subtitle}</p>
            {!isLegalPage ? (
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap
                  <Arrow white />
                </Link>
                <Link href="/personel-basvurusu" className="btn-outline">
                  Personel Başvurusu
                </Link>
              </div>
            ) : null}
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_22px_58px_rgba(233,24,91,0.14)]">
            <Image
              src={heroImage}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/18 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/80 bg-white/92 p-4 backdrop-blur-md">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-green">Güven odaklı danışmanlık</p>
              <p className="mt-1 font-heading text-xl font-semibold leading-tight text-ink">
                Doğru insan, doğru aile, mutlu yaşam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Süreç sayfası için özel içerik */}
      {!requestFormKind && !isLegalPage && key === "aileler-icin/nasil-calisir" ? (
        <div className="mt-8 space-y-3">
          {[
            { n: "01", title: "Başvuruyu yapın", desc: "Aile başvuru formunu 4–6 dakikada doldurun. İhtiyacınızı, çalışma düzeninizi ve beklentilerinizi paylaşın." },
            { n: "02", title: "Danışman görüşmesi", desc: "Ekibimiz sizi arar, ihtiyaç analizini detaylandırır ve süreç hakkında bilgi verir. İlk görüşme tamamen ücretsizdir." },
            { n: "03", title: "Aday profilleri", desc: "Deneyim, referans ve aile uyumuna göre seçilen aday profillerini sizinle paylaşırız. Hiçbir aday referans kontrolü yapılmadan önerilmez." },
            { n: "04", title: "Görüşme ve tanışma", desc: "Beğendiğiniz adayla tanışma görüşmesi planlanır. İstersen biz de bu sürece dahil oluruz." },
            { n: "05", title: "Yerleştirme ve takip", desc: "Yerleştirme sonrası ilk haftalarda sizi takip ederiz. Süreç sorunsuz ilerlene kadar yanınızdayız." }
          ].map((step) => (
            <div key={step.n} className="flex gap-5 rounded-[24px] border border-line bg-white p-5 shadow-[0_14px_36px_rgba(7,27,58,0.06)]">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green font-heading text-sm font-bold text-white shadow-[0_12px_28px_rgba(233,24,91,0.20)]">{step.n}</div>
              <div>
                <p className="font-heading text-lg font-semibold text-ink">{step.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 flex flex-wrap gap-3 pt-2">
            <Link href="/aile-basvurusu" className="btn-primary">
              Başvuru Yap
              <Arrow white />
            </Link>
            <Link href="/iletisim" className="btn-outline">
              Önce Danışmanla Görüş
            </Link>
          </div>
        </div>
      ) : null}

      {/* Neden Dadı Kapıda sayfası için özel içerik */}
      {!requestFormKind && !isLegalPage && key === "neden-dadi-kapida" ? (
        <div className="mt-8 space-y-8">
          <section className="grid overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_24px_65px_rgba(28,16,21,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[390px] lg:min-h-[470px]">
              <Image
                src={defaultSiteImages.process}
                alt="Aileye özel personel değerlendirme görüşmesi"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#E9185B]/62 via-[#E9185B]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F0C969]">Aileye özel değerlendirme</p>
                <p className="mt-3 max-w-xl font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                  Doğru personeli bulmak, önce doğru soruları sormakla başlar.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center bg-[#FFFDFD] p-7 sm:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Profesyonel danışmanlık</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight text-ink">
                Aday havuzu değil, yönetilen bir yerleştirme süreci
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                İhtiyaç analizi, aday ön değerlendirmesi, referans doğrulaması ve görüşme planlaması tek bir danışmanlık
                akışında ilerler. Böylece aile yalnızca seçenek görmez; karar verirken profesyonel destek alır.
              </p>

              <div className="mt-7 divide-y divide-line border-y border-line">
                {[
                  "İhtiyaca göre hazırlanan aday kısa listesi",
                  "Kontrollü görüşme ve karar süreci",
                  "Yerleştirme sonrasında düzenli takip"
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 py-4">
                    <span className="font-heading text-xl font-semibold text-gold">0{index + 1}</span>
                    <p className="text-sm font-semibold text-ink">{item}</p>
                  </div>
                ))}
              </div>

              <Link href="/aile-basvurusu" className="btn-primary mt-7 self-start">
                İhtiyacınızı Paylaşın
                <Arrow white />
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_22px_62px_rgba(7,27,58,0.08)]">
            <div className="border-b border-line bg-[#FFF3F7] px-6 py-5 sm:px-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-green">Dadı Kapıda yaklaşımı</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-ink">Rakamlarla hizmet kapsamımız</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
                Farklı ihtiyaçları aynı danışmanlık standardı, kontrollü değerlendirme ve düzenli takip yaklaşımıyla karşılıyoruz.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: `${services.length}+`, label: "Hizmet modeli", detail: "Bakım, ev desteği ve profesyonel personel" },
                { value: `${locations.length}`, label: "Öne çıkan şehir", detail: "Şehir ve hizmet bazlı ulaşılabilir sayfalar" },
                { value: "6", label: "Kontrol başlığı", detail: "Kimlikten referansa uzanan değerlendirme" },
                { value: "1:1", label: "Danışman takibi", detail: "İhtiyaç analizinden yerleştirme sonrasına" }
              ].map((stat) => (
                <div key={stat.label} className="border-b border-line p-6 last:border-b-0 sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r lg:last:border-r-0">
                  <p className="font-heading text-4xl font-semibold text-green">{stat.value}</p>
                  <p className="mt-2 text-sm font-bold text-ink">{stat.label}</p>
                  <p className="mt-2 text-xs leading-6 text-muted">{stat.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              { icon: "✓", title: "Referans kontrolü şart", desc: "Hiçbir aday referansları doğrulanmadan önerilmez. Geçmiş iş yerlerinden bilgi alır, deneyimi teyit ederiz." },
              { icon: "✓", title: "Aileye özel eşleştirme", desc: "Standart bir liste değil, senin düzenine, çocuğuna ve beklentine göre özelleştirilmiş aday önerisi." },
              { icon: "✓", title: "Yerleştirme sonrası takip", desc: "İşin bittiği yer bizim için başlangıçtır. İlk haftalar boyunca süreci takip eder, sorunları birlikte çözeriz." },
              { icon: "✓", title: "Gizlilik ve KVKK uyumu", desc: "Aile ve aday bilgileri yalnızca eşleştirme sürecinde ve karşılıklı onay dahilinde paylaşılır." },
              { icon: "✓", title: "Ücretsiz ilk görüşme", desc: "Ücret yalnızca başarılı yerleştirme gerçekleştiğinde geçerlidir. İlk danışmanlık görüşmesi tamamen ücretsiz." },
              { icon: "✓", title: "Türkiye geneli hizmet", desc: "İstanbul, Ankara, İzmir, Antalya ve tüm büyük şehirlerde aynı kalite ve standartla hizmet veriyoruz." }
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-[18px] border border-line bg-white p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-sm font-bold text-green">{item.icon}</div>
                <div>
                  <p className="font-heading text-base font-semibold text-ink">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/aile-basvurusu" className="btn-primary">
              Ücretsiz Danışmanlık Al
              <Arrow white />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Güvenlik ve Doğrulama sayfası */}
      {!requestFormKind && !isLegalPage && (key === "guvenlik-ve-dogrulama" || key === "guven") ? (
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🪪", title: "Kimlik Kontrolü", desc: "Tüm adayların nüfus cüzdanı veya pasaport bilgileri doğrulanır. Sahte belge riski sıfırlanır." },
              { icon: "🔍", title: "Adli Sicil Araştırması", desc: "Her adaydan güncel adli sicil belgesi talep edilir ve değerlendirme sürecine dahil edilir." },
              { icon: "📞", title: "Referans Kontrolü", desc: "Önceki işverenler aranarak adayın çalışma performansı, güvenilirliği ve iletişimi teyit edilir." },
              { icon: "🗣", title: "Mülakat Süreci", desc: "Her aday kapsamlı bir mülakattan geçer. Deneyim, motivasyon ve aile uyumu değerlendirilir." },
              { icon: "⏱", title: "Deneme Süreci", desc: "İstenen hizmetlerde deneme dönemi planlanabilir. Uyumsuzluk durumunda yeni süreç başlatılır." },
              { icon: "📋", title: "Sürekli Takip", desc: "Yerleştirme sonrası ilk haftalar düzenli olarak takip edilir. Sorun yaşanırsa hızlı müdahale edilir." }
            ].map(item => (
              <div key={item.title} className="rounded-[18px] border border-line bg-white p-6">
                <div className="mb-3 text-2xl">{item.icon}</div>
                <p className="font-heading text-base font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[18px] border border-[#EAD0D9] bg-[#FAF5F7] p-6">
            <p className="font-heading text-base font-semibold text-ink">Neden bu süreç önemli?</p>
            <p className="mt-2 text-sm leading-7 text-muted">Ev içinde çalışacak bir personele güven duymak, yalnızca referansa değil sistematik bir değerlendirme sürecine dayanmalıdır. Tüm bu adımları eksiksiz uyguluyoruz çünkü ailenizin güvenliği bizim sorumluluğumuzdur.</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/aile-basvurusu" className="btn-primary">
              Başvuru Yap
              <Arrow white />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Hakkımızda sayfası */}
      {!requestFormKind && !isLegalPage && key === "hakkimizda" ? (
        <div className="mt-8 space-y-4">
          <div className="rounded-[18px] border border-line bg-white p-7">
            <p className="font-heading text-lg font-semibold text-ink">Hikayemiz</p>
            <p className="mt-3 text-sm leading-8 text-muted">Dadı Kapıda, ailelerin ev hizmetleri personeli bulma sürecindeki güven açığını kapatmak amacıyla kurulmuştur. Referans doğrulaması yapılmadan, yüz yüze görüşme gerçekleştirilmeden yapılan yerleştirmelerin yarattığı riskleri ortadan kaldırmak için sistematik bir değerlendirme modeli geliştirdik.</p>
            <p className="mt-3 text-sm leading-8 text-muted">Bugün dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlikçi, şoför ve ev yardımcısı kategorilerinde Türkiye genelinde hizmet veriyoruz. Her yerleştirme, bir danışman eşliğinde ve belirlenmiş kalite standartları çerçevesinde gerçekleştirilir.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Misyonumuz", desc: "Aileler ile güvenilir ev hizmetleri personeli arasındaki köprüyü, şeffaf ve sistematik bir süreçle kurmak." },
              { title: "Vizyonumuz", desc: "Türkiye'nin en güvenilir ev hizmetleri danışmanlık platformu olmak; her aileye ihtiyacına özel, doğrulanmış personel sağlamak." },
              { title: "Değerlerimiz", desc: "Güven, şeffaflık, gizlilik ve aile odaklı hizmet. Her adımda hem aileyi hem de personeli eşit özenle değerlendiririz." }
            ].map(item => (
              <div key={item.title} className="rounded-[18px] border border-line bg-white p-6">
                <p className="font-heading text-base font-semibold text-green">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/aile-basvurusu" className="btn-primary">
              Ücretsiz Görüşme Al
              <Arrow white />
            </Link>
            <Link href="/iletisim" className="btn-outline">İletişime Geç</Link>
          </div>
        </div>
      ) : null}

      {/* SSS sayfası */}
      {!requestFormKind && !isLegalPage && key === "sik-sorulan-sorular" ? (
        <div className="mt-8 space-y-3">
          {faqs.map(faq => (
            <div key={faq.question} className="rounded-[18px] border border-line bg-white p-5">
              <p className="font-heading text-base font-semibold text-ink">{faq.question}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{faq.answer}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/aile-basvurusu" className="btn-primary">
              Başvuru Yap
              <Arrow white />
            </Link>
            <Link href="/iletisim" className="btn-outline">Sormak İstedikleriniz İçin</Link>
          </div>
        </div>
      ) : null}

      {/* Genel sayfalar için içerik grid */}
      {!requestFormKind && !isLegalPage && key !== "aileler-icin/nasil-calisir" && key !== "neden-dadi-kapida" ? (
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {services.slice(0, 4).map((service) => (
            <Link
              key={service.slug}
              href={`/hizmetlerimiz/${service.slug}`}
              className="group rounded-[18px] border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_8px_24px_rgba(22,32,42,0.08)]"
            >
              <p className="font-heading text-base font-semibold text-ink">{service.title}</p>
              <p className="mt-1.5 text-sm leading-6 text-muted">{service.description}</p>
              <p className="mt-3 text-xs font-semibold text-gold transition group-hover:translate-x-0.5">Detaylı bilgi →</p>
            </Link>
          ))}
          {faqs.slice(0, 4).map((faq) => (
            <div key={faq.question} className="rounded-[18px] border border-line bg-white p-5">
            <p className="font-semibold text-ink">{faq.question}</p>
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
              <h2 className="mb-3 font-heading text-base font-semibold text-ink">{section.heading}</h2>
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
          <div className="surface rounded-[20px] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green mb-2">Sorularınız mı var?</p>
            <Link href="/iletisim" className="inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-2 hover:text-green">
              Danışmanlarımızla iletişime geçin
              <Arrow />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Her sayfada CTA */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/aile-basvurusu" className="btn-primary">
          Aile Başvurusu Yap
          <Arrow white />
        </Link>
        <Link href="/" className="btn-outline">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
