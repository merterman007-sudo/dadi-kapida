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
    "Dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlikçi, şoför, aşçı, kahya ve ev yardımcısı için güvenilir, referanslı ve aileye özel personel yerleştirme danışmanlığı.",
  alternates: {
    canonical: "/"
  }
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

const heroServiceCards = [
  { title: "Bebek ve Çocuk Bakımı", href: "/hizmetlerimiz/bebek-bakicisi", icon: "baby" },
  { title: "Yaşlı Bakımı", href: "/hizmetlerimiz/yasli-bakicisi", icon: "elder" },
  { title: "Hasta Bakımı", href: "/hizmetlerimiz/hasta-bakicisi", icon: "care" },
  { title: "Temizlik Hizmetleri", href: "/hizmetlerimiz/gunluk-temizlik", icon: "clean" },
  { title: "Özel Şoför", href: "/hizmetlerimiz/ozel-sofor", icon: "driver" },
  { title: "Yemek ve Ev Destek Hizmetleri", href: "/hizmetlerimiz/asci", icon: "home" }
];

const heroTrustItems = [
  { title: "Güvenilir Hizmet", icon: "shield" },
  { title: "Deneyimli ve Referanslı Personel", icon: "people" },
  { title: "Danışman Takibi", icon: "support" }
];

function LineIcon({ name, className = "h-8 w-8" }: { name: string; className?: string }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none"
  };

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {name === "shield" ? (
        <>
          <path {...common} d="M24 5l15 6v11c0 9.5-6.4 16.8-15 21-8.6-4.2-15-11.5-15-21V11l15-6z" />
          <path {...common} d="M17 24l5 5 10-11" />
        </>
      ) : null}
      {name === "people" ? (
        <>
          <circle {...common} cx="18" cy="18" r="5" />
          <circle {...common} cx="31" cy="17" r="4" />
          <path {...common} d="M8 38c1.8-7 7.3-10 10-10s8.2 3 10 10" />
          <path {...common} d="M27 28c4.5.4 8.6 3.4 10 9" />
        </>
      ) : null}
      {name === "support" ? (
        <>
          <path {...common} d="M11 26v-3a13 13 0 0 1 26 0v3" />
          <path {...common} d="M11 26h6v11h-6a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3zM37 26h-6v11h6a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3z" />
          <path {...common} d="M31 38c-1.6 3-4 4-7 4" />
        </>
      ) : null}
      {name === "baby" ? (
        <>
          <circle {...common} cx="24" cy="24" r="13" />
          <path {...common} d="M17 20h.1M31 20h.1M19 30c3 2.4 7 2.4 10 0M14 15l-4-4M34 15l4-4" />
        </>
      ) : null}
      {name === "elder" ? (
        <>
          <circle {...common} cx="24" cy="14" r="7" />
          <path {...common} d="M12 42c1.4-9 6-15 12-15s10.6 6 12 15M17 28c2 3 12 3 14 0M17 15c1.5-4 12.5-4 14 0" />
        </>
      ) : null}
      {name === "care" ? (
        <>
          <path {...common} d="M24 40S8 30 8 18a8 8 0 0 1 14-5 8 8 0 0 1 14 5c0 12-16 22-16 22z" />
          <path {...common} d="M18 24h12M24 18v12" />
        </>
      ) : null}
      {name === "clean" ? (
        <>
          <path {...common} d="M30 6l12 12-5 5-12-12 5-5zM25 13L8 30l10 10 17-17" />
          <path {...common} d="M10 38l-4 4M17 41l-2 4M6 31l-3 2" />
        </>
      ) : null}
      {name === "driver" ? (
        <>
          <circle {...common} cx="24" cy="24" r="16" />
          <circle {...common} cx="24" cy="24" r="5" />
          <path {...common} d="M9 24h10M29 24h10M24 29v10" />
        </>
      ) : null}
      {name === "home" ? (
        <>
          <path {...common} d="M10 23l14-13 14 13" />
          <path {...common} d="M14 21v19h20V21" />
          <path {...common} d="M20 40V28h8v12" />
        </>
      ) : null}
    </svg>
  );
}

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
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--rose)]/10">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.5l2.5 2.5 5.5-5" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(233,24,91,0.12),transparent_28%),linear-gradient(90deg,#ffffff_0%,#ffffff_45%,#fff5f8_100%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block">
          <Image
            src={siteImages.hero}
            alt="Profesyonel ev hizmetleri danışmanlığı"
            fill
            priority
            sizes="48vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/35 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-12 lg:px-8 lg:pb-10 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-green">
                <span className="text-lg leading-none">♥</span>
                Sevdikleriniz bize emanet
              </p>
              <h1 className="mt-6 max-w-2xl font-heading text-5xl font-semibold leading-[0.98] text-ink sm:text-6xl lg:text-[5.45rem]">
                Doğru Destek,
                <span className="block text-green">Huzurlu Yaşam.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-body">
                Deneyimli, referanslı ve güvenilir personellerimizle ihtiyaçlarınıza özel çözümler sunuyoruz.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${phone.replace(/\D/g, "")}`} className="btn-primary">
                  <span className="text-base">☎</span>
                  Hemen Arayın
                </a>
                <Link href="/hizmetlerimiz" className="btn-outline">
                  Hizmetlerimizi İnceleyin <Arrow />
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
                {heroTrustItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-3 border-r border-line pr-4 last:border-r-0">
                    <LineIcon name={item.icon} className="h-9 w-9 shrink-0 text-green" />
                    <p className="text-sm font-bold leading-5 text-ink">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative lg:min-h-[560px]">
              <div className="relative ml-auto overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_28px_80px_rgba(7,27,58,0.14)] sm:rounded-[42px] lg:w-[92%]">
                <div className="relative h-[310px] sm:min-h-[500px]">
                  <Image
                    src={siteImages.hero}
                    alt="Aile ve ev hizmetleri danışmanlığı"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071B3A]/28 via-transparent to-transparent" />
                </div>

                <div className="relative bg-white p-5 sm:absolute sm:bottom-0 sm:right-0 sm:w-[72%] sm:bg-transparent sm:p-0">
                  <div className="bg-ink p-6 text-white shadow-[0_24px_60px_rgba(7,27,58,0.24)] sm:rounded-tl-[26px]">
                    <p className="font-heading text-2xl font-semibold leading-tight text-white">
                      Aileniz için en iyisini bizimle bulun.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/82">
                      Profesyonel destek, mutlu yarınlar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 bottom-10 hidden rounded-full border border-line bg-white px-5 py-3 shadow-[0_16px_42px_rgba(7,27,58,0.10)] lg:block">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green">Güven odaklı yerleştirme</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {heroServiceCards.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group min-h-[150px] rounded-[20px] border border-line bg-white p-5 shadow-[0_18px_50px_rgba(7,27,58,0.08)] transition hover:-translate-y-1 hover:border-green/45 hover:shadow-[0_24px_70px_rgba(7,27,58,0.13)]"
              >
                <LineIcon name={service.icon} className="h-11 w-11 text-green" />
                <p className="mt-5 min-h-[44px] text-base font-extrabold leading-snug text-ink">{service.title}</p>
                <span className="mt-4 inline-flex text-2xl leading-none text-green transition group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-11 flex items-center justify-center gap-6 text-center">
            <span className="hidden h-px w-48 bg-green/35 sm:block" />
            <p className="font-heading text-3xl font-semibold text-ink">
              Doğru insan, doğru aile, <span className="text-green">mutlu yaşam.</span>
            </p>
            <span className="hidden h-px w-48 bg-green/35 sm:block" />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#FFF3F7]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPills.map((item, index) => (
              <div key={item} className="flex items-center gap-3 border-l-2 border-green bg-white px-4 py-3 shadow-sm">
                <span className="font-heading text-xl font-semibold text-gold">0{index + 1}</span>
                <p className="text-sm font-semibold text-ink">{item}</p>
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
              title="İhtiyacınızı ilk bakışta bulabileceğiniz hizmetler"
              subtitle="Her hizmet alanını kendi çalışma ortamı ve uzmanlığıyla gösteriyor, doğru kategoriye hızlıca ulaşmanızı sağlıyoruz."
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
                className="group block overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_8px_28px_rgba(7,27,58,0.06)] transition hover:-translate-y-1 hover:border-green/45 hover:shadow-[0_22px_52px_rgba(7,27,58,0.13)]"
              >
                <ServiceVisual slug={service.slug} title={service.title} framed={false} className="min-h-[310px] rounded-none sm:min-h-[340px]" />
                <div className="border-t border-line p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-heading text-[1.15rem] font-semibold text-ink">{service.title}</p>
                    <span className="rounded-full bg-[#FFF3F7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-green">
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

      <section className="overflow-hidden bg-bg py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative min-h-[430px] overflow-hidden rounded-[28px] shadow-[0_28px_70px_rgba(7,27,58,0.16)]">
              <Image
                src={siteImages.trust}
                alt="Güvenli ve düzenli ev hizmetleri danışmanlığı"
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071B3A]/80 via-[#071B3A]/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F0C969]">Kontrollü değerlendirme</p>
                <p className="mt-3 max-w-lg font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                  Güven, yalnızca söylenen değil her adımda doğrulanan bir süreçtir.
                </p>
              </div>
            </div>

            <div>
              <SectionTitle
                eyebrow="Neden Dadı Kapıda?"
                title="Aday listesinden fazlasını sunuyoruz"
                subtitle="Ailenizin ihtiyacını anlayan, adayları değerlendiren ve yerleştirme sonrasını takip eden profesyonel bir ekip süreci yönetir."
              />

              <div className="mt-8 divide-y divide-line border-y border-line">
                {whyItems.map((item, index) => (
                  <div key={item.title} className="grid grid-cols-[42px_1fr] gap-4 py-5">
                    <span className="font-heading text-2xl font-semibold text-gold">0{index + 1}</span>
                    <div>
                      <p className="font-heading text-xl font-semibold text-ink">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/guvenlik-ve-dogrulama" className="btn-primary">
                  Kontrol Sürecini İncele <Arrow white />
                </Link>
                <Link href="/hakkimizda" className="btn-outline">
                  Bizi Tanıyın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark-deeper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Nasıl Çalışır?"
              title="İlk görüşmeden yerleştirme sonrasına kadar yanınızdayız"
              subtitle="Her aşamanın sorumlusu, amacı ve sonraki adımı bellidir."
              light
            />
            <Link
              href="/aileler-icin/aday-secim-sureci"
              className="inline-flex self-start items-center gap-2 border-b border-white/55 pb-1 text-sm font-semibold text-white transition hover:border-white"
            >
              Tüm süreci görün <Arrow white />
            </Link>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="group relative min-h-[270px] bg-[#071B3A] p-6 transition hover:bg-[#10284D]">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-4xl font-semibold text-[#F0C969]">{item.step}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition group-hover:bg-white group-hover:text-green">
                    <Arrow />
                  </span>
                </div>
                <div className="mt-14">
                  <p className="font-heading text-xl font-semibold text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/80">{item.description}</p>
                </div>
              </div>
            ))}
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#E9185B]/50 to-transparent" />
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

      <section className="border-y border-line bg-[#FFF3F7] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Ailelerin Deneyimi"
              title="Güven, süreç boyunca kurulan iletişimle başlar"
              subtitle="Ailelerin değerlendirme ve yerleştirme sürecindeki deneyimlerini dinliyoruz."
            />
            <div className="flex items-center gap-3 border-l-2 border-gold pl-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <svg key={index} width="15" height="15" viewBox="0 0 10 10" fill="#B8860B">
                    <path d="M5 0l1.12 3.44H9.76l-2.94 2.13 1.12 3.44L5 7 2.06 9.01l1.12-3.44L.24 3.44H3.88z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink">Danışmanlık deneyimi</p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.author} className="flex min-h-[320px] flex-col border-t-4 border-green bg-white p-6 shadow-[0_14px_38px_rgba(7,27,58,0.08)]">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3F7]">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path
                      d="M0 12V7.2C0 5.04 0.56 3.28 1.68 1.92 2.8 0.64 4.32 0 6.24 0v2.4C5.28 2.4 4.56 2.72 4.08 3.36 3.6 3.92 3.36 4.72 3.36 5.76H6.24V12H0ZM9.76 12V7.2C9.76 5.04 10.32 3.28 11.44 1.92 12.56 0.64 14.08 0 16 0v2.4C15.04 2.4 14.32 2.72 13.84 3.36 13.36 3.92 13.12 4.72 13.12 5.76H16V12H9.76Z"
                      fill="#E9185B"
                      fillOpacity="0.25"
                    />
                  </svg>
                </div>

                <p className="flex-1 font-heading text-[1.05rem] leading-[1.75] text-ink italic">&ldquo;{item.quote}&rdquo;</p>

                <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green font-heading text-sm font-bold text-white">
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
