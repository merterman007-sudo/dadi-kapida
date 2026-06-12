import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "../components/faq-accordion";
import { ServiceVisual } from "../components/service-visual";
import { WebsiteRequestForm } from "../components/website-request-form";
import { fetchPublic } from "../lib/api";
import { defaultContact } from "../lib/contact";
import { faqs } from "../lib/content";
import { resolveSiteImages, type WebsiteSettingsWithImages } from "../lib/images";
import { servicesContent } from "../lib/services-content";

export const metadata: Metadata = {
  title: "Dadı Kapıda | Profesyonel Ev Hizmetleri Danışmanlığı",
  description:
    "Dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlikçi, şoför, aşçı, kahya ve ev yardımcısı için güvenilir, referanslı ve aileye özel personel yerleştirme danışmanlığı."
};

const featuredServiceSlugs = [
  "yatili-dadi",
  "bebek-bakicisi",
  "yasli-bakicisi",
  "hasta-bakicisi",
  "gunluk-temizlik",
  "ozel-sofor",
  "asci",
  "ev-yardimcisi",
  "refakatci",
  "kahya",
  "camasirci"
];

type HomeSiteSettings = WebsiteSettingsWithImages & {
  "global.contact"?: {
    phone?: string;
    whatsapp?: string;
    supportEmail?: string;
  };
};

const trustPills = [
  "Referans kontrolü",
  "Aileye özel eşleştirme",
  "Gizlilik ve KVKK",
  "Yerleştirme sonrası takip"
];

const whyItems = [
  {
    title: "Referans ve geçmiş kontrolü",
    description: "Her adayın deneyimini, referanslarını ve çalışma geçmişini aileye sunmadan önce doğruluyoruz."
  },
  {
    title: "İhtiyaca göre eşleştirme",
    description: "Tek tip liste yerine, çalışma düzeni ve beklentilere göre uygun adayları seçip öneriyoruz."
  },
  {
    title: "Gizlilik ve net süreç",
    description: "KVKK hassasiyeti, açık iletişim ve kontrollü ilerleyen danışmanlık akışıyla güven sağlıyoruz."
  },
  {
    title: "Yerleştirme sonrası takip",
    description: "İlk haftalardaki uyumu düzenli kontrol ediyor, gerektiğinde süreci yeniden destekliyoruz."
  }
];

const howItWorks = [
  {
    step: "01",
    title: "İhtiyacınızı paylaşın",
    description: "Aile başvurusu ya da kısa iletişim formu ile beklentinizi ve çalışma düzeninizi bize iletin."
  },
  {
    step: "02",
    title: "Danışman analiz etsin",
    description: "Ekibimiz talebi inceler, doğru hizmet kategorisini netleştirir ve uygun aday havuzunu hazırlar."
  },
  {
    step: "03",
    title: "Adayları birlikte değerlendirelim",
    description: "Referans ve uyum açısından elenen adaylar arasından size en uygun seçenekleri paylaşırız."
  },
  {
    step: "04",
    title: "Yerleştirme ve takip",
    description: "Tanışma, karar ve yerleştirme sonrasında da süreci takip ederek uyumu destekleriz."
  }
];

const testimonials = [
  {
    quote:
      "Süreç sakin, net ve profesyoneldi. İhtiyacımızı doğru anladılar ve bize gerçekten uygun bir aday sundular.",
    author: "Aile Müşterisi",
    service: "Aşçı desteği"
  },
  {
    quote:
      "İletişim çok düzenliydi. İlk görüşmeden yerleştirmeye kadar her adımda ne olacağını biliyorduk.",
    author: "Kurumsal Aile",
    service: "Yatılı dadı"
  },
  {
    quote:
      "Özellikle referans ve güven tarafında çok titiz davrandılar. Bu bizim için belirleyici oldu.",
    author: "Anadolu Ailesi",
    service: "Yaşlı bakıcısı"
  }
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold flex items-center gap-2">
      <span className="h-px w-5 bg-current opacity-60" />
      {children}
    </p>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : ""}>
      {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
      <h2 className={`mt-3 font-heading text-3xl font-semibold leading-tight sm:text-[2.2rem] ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle ? <p className={`mt-3 text-sm leading-7 ${light ? "text-white/75" : "text-muted"}`}>{subtitle}</p> : null}
    </div>
  );
}

function Arrow({ white }: { white?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2 7h10M8 3l4 4-4 4" stroke={white ? "white" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8C5368]/10">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.5l2.5 2.5 5.5-5" stroke="#8C5368" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default async function HomePage() {
  const siteSettings = await fetchPublic<HomeSiteSettings>("/api/v1/public/site-settings", {});
  const siteImages = resolveSiteImages(siteSettings);
  const contact = siteSettings["global.contact"] ?? {};
  const phone = contact.phone?.trim() || defaultContact.phone;
  const whatsapp = contact.whatsapp?.trim() || defaultContact.whatsapp;
  const supportEmail = contact.supportEmail?.trim() || defaultContact.supportEmail;

  const featuredServices = featuredServiceSlugs
    .map((slug) => servicesContent.find((service) => service.slug === slug))
    .filter((service): service is (typeof servicesContent)[number] => Boolean(service));

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
          <Image
            src={siteImages.hero}
            alt="Profesyonel ev hizmetleri danışmanlığı"
            fill
            priority
            sizes="42vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/18 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <SectionLabel>Dadı Kapıda · Profesyonel Ev Hizmetleri</SectionLabel>
              <h1 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl lg:text-[3.9rem]">
                Eviniz için güvenilir ve profesyonel personel desteği
              </h1>
              <p className="mt-5 max-w-xl text-[1rem] leading-8 text-muted">
                Dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlik, şoför, aşçı ve ev yardımcısı ihtiyaçlarında;
                aileye özel değerlendirme, referans kontrolü ve danışman eşliğinde ilerleyen bir eşleştirme süreci sunuyoruz.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {trustPills.map((pill) => (
                  <span
                    key={pill}
                    className="flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 text-[11px] font-medium text-muted"
                  >
                    <Check />
                    {pill}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow white />
                </Link>
                <Link href="/iletisim" className="btn-outline">
                  Danışmanla Görüş
                </Link>
                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-green transition hover:bg-[#FAF5F7]"
                  >
                    WhatsApp&apos;tan Yaz <Arrow />
                  </a>
                ) : null}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Referans doğrulama",
                  "Aileye özel eşleştirme",
                  "Gizlilik ve KVKK",
                  "Yerleştirme sonrası takip"
                ].map((item) => (
                  <div key={item} className="surface flex items-start gap-3 rounded-[18px] p-4">
                    <Check />
                    <p className="text-sm font-medium leading-6 text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-line bg-white shadow-lg sm:rounded-[32px]">
                <div className="relative h-[290px] sm:min-h-[420px]">
                  <Image
                    src={siteImages.hero}
                    alt="Aileyle danışman görüşmesi"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 hidden bg-gradient-to-t from-[#1C1015]/55 via-transparent to-transparent sm:block" />
                </div>

                <div className="relative bg-white p-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:p-6">
                  <div className="rounded-[22px] border border-line/90 bg-white/95 p-4 shadow-[0_16px_40px_rgba(28,16,21,0.10)] backdrop-blur-md sm:rounded-[24px] sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-green sm:text-[11px] sm:tracking-[0.18em]">
                      <span className="rounded-full bg-bg px-3 py-1.5">Kurumsal yapı</span>
                      <span className="rounded-full bg-bg px-3 py-1.5">Aile odaklı süreç</span>
                    </div>
                    <p className="mt-4 font-heading text-[1.45rem] font-semibold leading-tight text-ink sm:text-[1.55rem]">
                      Doğru aday, doğru hizmet, kontrollü süreç
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Danışman ekibimiz ailelerin ihtiyacını netleştirir, güvenli ve profesyonel bir eşleştirme akışı yürütür.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { value: "Türkiye geneli", label: "Talep alımı" },
                  { value: "Ücretsiz", label: "İlk görüşme" },
                  { value: "1:1", label: "Danışman takibi" },
                  { value: "Takip", label: "Yerleştirme sonrası" }
                ].map((item) => (
                  <div key={item.label} className="surface min-w-0 rounded-[18px] p-3.5 sm:p-4">
                    <p className="font-heading text-lg font-semibold leading-tight text-green sm:text-[1.45rem]">{item.value}</p>
                    <p className="mt-1 text-[9px] font-medium uppercase leading-4 tracking-[0.14em] text-muted sm:text-[11px] sm:tracking-[0.18em]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPills.map((item) => (
              <div key={item} className="surface flex items-center gap-3 rounded-[18px] px-4 py-3">
                <Check />
                <p className="text-sm font-medium text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Hizmetler"
              title="Her hizmet için ayrı görsel, ayrı anlatım"
              subtitle="Hizmet kartlarında aynı görselin tekrar etmemesi için merkezi bir eşleşme kullanıyoruz."
            />
            <Link href="/hizmetlerimiz" className="btn-outline self-start sm:self-auto">
              Tüm hizmetler →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                href={`/hizmetlerimiz/${service.slug}`}
                className="group block overflow-hidden rounded-[30px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(28,16,21,0.08)]"
              >
                <ServiceVisual slug={service.slug} title={service.title} compact framed={false} className="rounded-none" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-heading text-[1.15rem] font-semibold text-ink">{service.title}</p>
                    <span className="rounded-full bg-[#FAF5F7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green">
                      Premium
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{service.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gold transition group-hover:gap-3">
                    Detaylı incele <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <SectionTitle
              eyebrow="Neden Dadı Kapıda?"
              title="Güven veren danışmanlık yaklaşımı"
              subtitle="Ailelerin yalnızca aday değil, süreci yöneten profesyonel bir ekip aradığını biliyoruz."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {whyItems.map((item) => (
                <div key={item.title} className="surface rounded-[24px] p-5">
                  <p className="font-heading text-lg font-semibold text-ink">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark-deeper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[280px_1fr] lg:items-start">
            <SectionTitle
              eyebrow="Nasıl Çalışır?"
              title="Süreç 4 adımda ilerler"
              subtitle="Açık, kontrollü ve danışman eşliğinde ilerleyen bir yapı kurduk."
              light
            />

            <div className="relative space-y-3 pl-8">
              <div className="absolute left-3 top-4 bottom-4 w-px bg-gradient-to-b from-[#B8860B]/60 via-[#B8860B]/20 to-transparent" />
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="relative flex items-start gap-5 rounded-[24px] border border-white/8 bg-white/6 p-5 transition hover:border-[#B8860B]/25"
                >
                  <span className="absolute -left-[22px] flex h-4 w-4 items-center justify-center rounded-full border border-[#B8860B]/40 bg-[#6D3D51]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                  </span>
                  <span className="font-heading text-2xl font-semibold text-[#E5B84B] w-7 shrink-0 leading-none pt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-7 text-white/72">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-[32px] border border-line bg-white shadow-lg">
              <div className="relative min-h-[320px]">
                <Image
                  src={siteImages.process}
                  alt="Danışmanlık ve yerleştirme süreci"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#8C5368]/50 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-green backdrop-blur-sm">
                  Güven odaklı süreç
                </div>
                <div className="absolute bottom-5 left-5 right-5 surface rounded-[24px] p-4">
                  <p className="font-heading text-lg font-semibold text-ink">Aileye özel danışman eşleşmesi</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    İhtiyaç analizinden yerleştirme sonrası takibe kadar her aşama tek bir düzen içinde ilerler.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <SectionTitle
                eyebrow="Öne Çıkan Hizmet"
                title="Doğru adayı bulmak için önce ailenizi iyi anlamamız gerekir"
                subtitle="Aday havuzu kadar, beklentinin doğru tanımlanması da sonucu belirler."
              />
              <div className="mt-6 space-y-3">
                {[
                  "Hizmet türü ve çalışma düzeni netleştirilir.",
                  "Referans, deneyim ve iletişim dengesi değerlendirilir.",
                  "Aileye uygun kısa liste danışman tarafından sunulur.",
                  "Yerleştirme sonrası ilk haftalarda düzenli takip yapılır."
                ].map((text) => (
                  <div key={text} className="surface flex items-start gap-3 rounded-[22px] p-4">
                    <Check />
                    <p className="text-sm leading-7 text-ink">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">
                  Aile Başvurusu Yap <Arrow white />
                </Link>
                <Link href="/iletisim" className="btn-outline">
                  Görüşme iste
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle
            eyebrow="Müşteri Yorumları"
            title="Süreçte en çok güven veren şey net iletişim"
            subtitle="Gerçekçi, sade ve güven odaklı geri bildirimleri önemsiyoruz."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.author} className="surface flex flex-col rounded-[24px] p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF5F7] border border-line">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path
                      d="M0 12V7.2C0 5.04 0.56 3.28 1.68 1.92 2.8 0.64 4.32 0 6.24 0v2.4C5.28 2.4 4.56 2.72 4.08 3.36 3.6 3.92 3.36 4.72 3.36 5.76H6.24V12H0ZM9.76 12V7.2C9.76 5.04 10.32 3.28 11.44 1.92 12.56 0.64 14.08 0 16 0v2.4C15.04 2.4 14.32 2.72 13.84 3.36 13.36 3.92 13.12 4.72 13.12 5.76H16V12H9.76Z"
                      fill="#8C5368"
                      fillOpacity="0.25"
                    />
                  </svg>
                </div>

                <p className="flex-1 font-heading text-[1.05rem] leading-[1.75] text-ink italic">&ldquo;{item.quote}&rdquo;</p>

                <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8C5368] font-heading text-sm font-bold text-white">
                    {item.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">{item.author}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{item.service}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <svg key={index} width="10" height="10" viewBox="0 0 10 10" fill="#B8860B">
                        <path d="M5 0l1.12 3.44H9.76l-2.94 2.13 1.12 3.44L5 7 2.06 9.01l1.12-3.44L.24 3.44H3.88z" />
                      </svg>
                    ))}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <SectionTitle
              eyebrow="Sık Sorulan Sorular"
              title="Ailelerin en çok sorduğu sorular"
              subtitle="Bilmeyi en çok önemsediğiniz noktaları açık ve sade şekilde yanıtlıyoruz."
            />
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <SectionTitle
                eyebrow="Başvuru / İletişim"
                title="Danışmanla hızlıca görüşmek ister misiniz?"
                subtitle="Kısa formu doldurun, ekibimiz uygun zamanda size dönüş yapsın."
              />
              <div className="surface rounded-[28px] p-6">
                <div className="space-y-3 text-sm text-muted">
                  {phone ? <p>Telefon: {phone}</p> : null}
                  {whatsapp ? <p>WhatsApp: {whatsapp}</p> : null}
                  <p>E-posta: {supportEmail}</p>
                  <p>Çalışma saatleri: Pazartesi - Cumartesi 09:00 - 19:00</p>
                  <p>Hizmet bölgesi: Türkiye geneli</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/aile-basvurusu" className="btn-primary">
                    Aile Başvurusu Yap <Arrow white />
                  </Link>
                  <Link href="/personel-basvurusu" className="btn-outline">
                    Personel Başvurusu Yap
                  </Link>
                </div>
              </div>
            </div>

            <WebsiteRequestForm kind="contact" />
          </div>
        </div>
      </section>
    </>
  );
}
