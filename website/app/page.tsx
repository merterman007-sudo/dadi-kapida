import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "../components/faq-accordion";
import { QuickApply } from "../components/quick-apply";
import { blogPosts } from "../lib/blog";
import { fetchPublic } from "../lib/api";
import { resolveSiteImages, type WebsiteSettingsWithImages } from "../lib/images";
import {
  differenceCards, faqs, locationsPreview,
  processPreview, securityCards, servicesPreview
} from "../lib/content";
import { serviceAngles, testimonialCards } from "../lib/site";

export const metadata: Metadata = {
  title: "Dadı Kapıda | Profesyonel Dadı Yerleştirme Danışmanlığı",
  description: "Yatılı ve gündüzlü dadı arayan aileler için güvenilir, referanslı ve aileye özel profesyonel yerleştirme danışmanlığı. İstanbul ve Türkiye genelinde hizmet.",
};

/* ──────────────────────────────────────────────────
   Yardımcı bileşenler
────────────────────────────────────────────────── */

function Label({ t, light }: { t: string; light?: boolean }) {
  return (
    <p className={`text-[10px] font-bold uppercase tracking-[0.28em] flex items-center gap-2 ${light ? "text-[#B8860B]/80" : "text-[#B8860B]"}`}>
      <span className="h-px w-5 bg-current opacity-60" />{t}
    </p>
  );
}

function H({
  size = 2,
  children,
  light,
  className = ""
}: {
  size?: 1 | 2 | 3;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  const cls = `font-heading font-semibold leading-tight ${light ? "text-white" : "text-ink"} ${
    size === 1 ? "text-4xl sm:text-5xl lg:text-[3.5rem]" :
    size === 2 ? "text-3xl sm:text-[2.2rem]" :
    "text-xl sm:text-2xl"
  } ${className}`;
  if (size === 1) return <h1 className={cls}>{children}</h1>;
  if (size === 2) return <h2 className={cls}>{children}</h2>;
  return <h3 className={cls}>{children}</h3>;
}

function Arrow({ white }: { white?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2 7h10M8 3l4 4-4 4" stroke={white ? "white" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Check({ green }: { green?: boolean }) {
  return (
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${green ? "bg-[#8C5368]/10" : "bg-[#B8860B]/12"}`}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.5l2.5 2.5 5.5-5" stroke={green ? "#8C5368" : "#B8860B"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

/* ──────────────────────────────────────────────────
   SAYFA
────────────────────────────────────────────────── */
export default async function HomePage() {
  const siteSettings = await fetchPublic<WebsiteSettingsWithImages>("/api/v1/public/site-settings", {});
  const siteImages = resolveSiteImages(siteSettings);

  return (
    <>
      {/* ═══════ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        {/* Arka plan fotoğrafı — sağ yarı */}
        <div className="absolute right-0 top-0 hidden h-full w-[48%] lg:block">
          <Image
            src={siteImages.hero}
            alt="Profesyonel dadı danışmanlığı"
            fill
            priority
            sizes="48vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
        </div>

        {/* İçerik */}
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="max-w-xl">
            <Label t="Dadı Kapıda · Profesyonel Yerleştirme" />
            <H size={1} className="mt-5">
              Aileniz için{" "}
              <span className="text-green relative">
                güvenilir
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#B8860B] rounded-full" />
              </span>
              , referanslı<br />dadıyı birlikte bulalım.
            </H>
            <p className="mt-5 text-[1rem] leading-8 text-muted max-w-md">
              Yatılı veya gündüzlü dadı ihtiyacınızda; deneyim, referans ve aile dinamiğinize göre adayları değerlendiriyor, süreci danışman eşliğinde yönetiyoruz.
            </p>

            {/* Trust rozetler */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["Referans Kontrolü", "Aileye Özel Eşleşme", "Süreç Takibi", "KVKK Uyumlu"].map(t => (
                <span key={t} className="flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-[11px] font-medium text-muted">
                  <Check green /> {t}
                </span>
              ))}
            </div>

            {/* CTA butonlar */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/aile-basvurusu" className="btn-primary">
                Aile Başvurusu Yap <Arrow white />
              </Link>
              <Link href="/dadi-basvurusu" className="btn-outline">
                Dadı Başvurusu
              </Link>
              <Link href="/iletisim" className="hidden items-center gap-1.5 py-3 text-sm text-muted hover:text-green transition-colors lg:flex">
                Önce danışmanla görüşeyim →
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-muted/60">
              Başvuru 4–6 dk sürer. Danışman ekibimiz sizinle iletişime geçer.
            </p>
          </div>

          {/* Hızlı başvuru formu */}
          <div className="mt-10 max-w-3xl">
            <QuickApply />
          </div>
        </div>
      </section>

      {/* ═══════ İSTATİSTİK ════════════════════════════ */}
      <div className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-line sm:grid-cols-4">
            {[
              { v: "4–6 dk", l: "Başvuru süresi" },
              { v: "1:1",    l: "Danışman takibi" },
              { v: "2 Adım", l: "Ön değerlendirme" },
              { v: "∞",      l: "Yerleştirme sonrası" },
            ].map(s => (
              <div key={s.l} className="px-5 py-6 text-center">
                <p className="font-heading text-[1.6rem] font-semibold text-green">{s.v}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-muted">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ FARK YARATANLAR ═══════════════════════ */}
      <section className="py-20 lg:py-28 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Metin */}
            <div>
              <Label t="Fark" />
              <H size={2} className="mt-3">
                Dadı bulmak değil, doğru kişiyi ailenize kazandırmak önemlidir.
              </H>
              <p className="mt-4 text-[0.95rem] leading-7 text-muted">
                Her başvuru ardında ihtiyaç analizi, referans kontrolü ve yerleştirme sonrası takip yer alır.
              </p>
              <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {differenceCards.map((item, i) => (
                  <div key={item} className="card flex items-start gap-3 p-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green font-heading text-[10px] font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium leading-6 text-ink">{item}</p>
                  </div>
                ))}
              </div>
              <Link href="/aile-basvurusu" className="btn-primary mt-7 inline-flex">
                Aile Başvurusu Yap <Arrow white />
              </Link>
            </div>

            {/* Fotoğraf grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[460px]">
              {/* Büyük sol */}
              <div className="relative row-span-2 overflow-hidden rounded-xl2 shadow-md">
                <Image src={siteImages.process} alt="Dadı danışmanlık süreci" fill sizes="250px" className="object-cover" />
                {/* Üstüne bilgi kartı */}
                <div className="absolute bottom-4 left-4 right-4 card p-3 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5">
                    <Check green />
                    <div>
                      <p className="text-[11px] font-bold text-green">Referans doğrulandı</p>
                      <p className="text-[10px] text-muted">Her aday için yapılır</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sağ üst */}
              <div className="relative overflow-hidden rounded-xl2 shadow-sm">
                <Image src={siteImages.hero} alt="Aile danışman görüşmesi" fill sizes="200px" className="object-cover" />
              </div>
              {/* Sağ alt — yeşil panel */}
              <div className="flex flex-col justify-between rounded-xl2 bg-green p-5">
                <Label t="Güven" light />
                <div>
                  <p className="font-heading text-base font-semibold text-white leading-snug">
                    İstanbul ve Türkiye genelinde profesyonel hizmet
                  </p>
                  <p className="mt-1 text-[11px] text-white/75">Danışman eşliğinde süreç</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SÜREÇ ═════════════════════════════════ */}
      <section className="section-dark-deeper py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[280px_1fr] lg:items-start">
            {/* Sol */}
            <div className="lg:sticky lg:top-24">
              <Label t="Süreç" light />
              <H size={2} light className="mt-3">
                Aileler için süreç nasıl ilerler?
              </H>
              <p className="mt-3 text-sm leading-7 text-white/75">Her adım danışman eşliğinde, sakin ve kontrollü biçimde ilerler.</p>
              <Link href="/aile-basvurusu" className="btn-gold mt-6 inline-flex">
                Şimdi Başvur <Arrow />
              </Link>
            </div>
            {/* Timeline */}
            <div className="relative space-y-2 pl-8">
              <div className="absolute left-3 top-4 bottom-4 w-px bg-gradient-to-b from-[#B8860B]/60 via-[#B8860B]/20 to-transparent" />
              {processPreview.map((step, i) => (
                <div key={step} className="relative flex items-start gap-5 rounded-xl2 border border-white/8 bg-white/5 p-4 hover:border-[#B8860B]/20 transition-colors">
                  <span className="absolute -left-[22px] flex h-4 w-4 items-center justify-center rounded-full border border-[#B8860B]/40 bg-[#6D3D51]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
                  </span>
                  <span className="font-heading text-2xl font-semibold text-[#E5B84B] w-7 shrink-0 leading-none pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-medium text-white/72 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HİZMETLER ═════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label t="Hizmetlerimiz" />
              <H size={2} className="mt-3">Ailenizin ihtiyacına göre dadı çözümleri</H>
            </div>
            <Link href="/hizmetlerimiz" className="btn-outline self-start sm:self-auto shrink-0">
              Tüm hizmetler →
            </Link>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {servicesPreview.slice(0, 8).map((svc, i) => {
              const symbols = ["✦","◈","❋","◉","✧","⬡","◇","✦"];
              return (
                <Link key={svc.slug} href={`/hizmetlerimiz/${svc.slug}`}
                  className="card card-hover group block p-5"
                >
                  <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg text-green text-sm transition-colors group-hover:border-green/20 group-hover:bg-[#8C5368]/5">
                    {symbols[i % symbols.length]}
                  </div>
                  <p className="font-heading text-[0.92rem] font-semibold text-ink">{svc.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted">{svc.description}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#B8860B] group-hover:gap-2.5 transition-all">
                    Detaylı bilgi <Arrow />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ AİLE CTA — FOTOĞRAFLI ════════════════ */}
      <section className="py-12 lg:py-16 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid overflow-hidden rounded-xl3 border border-line shadow-lg lg:grid-cols-[1fr_1.1fr]">
            {/* Fotoğraf */}
            <div className="relative min-h-[300px]">
              <Image src={siteImages.trust} alt="Güvenilir dadı seçimi" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#8C5368]/55 to-transparent" />
              <div className="absolute bottom-6 left-6 max-w-[200px]">
                <p className="font-heading text-xl font-semibold text-white leading-tight">
                  Güven odaklı,<br />danışman eşliğinde.
                </p>
              </div>
            </div>

            {/* İçerik */}
            <div className="bg-white p-7 lg:p-10">
              <Label t="İlk Adım" />
              <H size={2} className="mt-3">Doğru adayı bulmak için önce ailenizi tanımamız gerekir.</H>
              <p className="mt-3 text-sm leading-7 text-muted">İhtiyaç analizi, aday değerlendirmesi ve süreç takibi — her adım danışman eşliğinde ilerler.</p>
              <div className="mt-5 space-y-2">
                {serviceAngles.map(a => (
                  <div key={a.title} className="flex items-start gap-3 rounded-card border border-line bg-bg p-3.5">
                    <Check green />
                    <div>
                      <p className="text-sm font-semibold text-ink">{a.title}</p>
                      <p className="text-xs leading-5 text-muted">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/aile-basvurusu" className="btn-primary">Aile Başvurusu Yap <Arrow white /></Link>
                <Link href="/iletisim" className="btn-outline">Görüşme iste</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ GÜVENLİK ══════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <Label t="Güven" />
            <H size={2} className="mt-3">Seçim sürecinde neye baktığımızı saklamıyoruz.</H>
            <p className="mt-3 text-sm leading-7 text-muted">Kayıt, referans ve iletişim kalitesini görünür hale getiriyoruz.</p>
          </div>
          <div className="mx-auto mt-9 grid max-w-3xl gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {securityCards.map(item => (
              <div key={item} className="card flex items-center gap-3 p-4">
                <Check green />
                <p className="text-sm font-medium text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REFERANSLAR ═══════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#FAF5F7]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-6 bg-gold/60" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/80">Referanslar</span>
          </div>
          <H size={2} className="max-w-lg">Ailelerle kurulan ilişkiler uzun solukludur.</H>
          <p className="mt-3 max-w-lg text-sm leading-7 text-muted">Bize duydukları güveni, kendi sözleriyle aktarıyorlar.</p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonialCards.map((item, i) => (
              <blockquote
                key={item.author}
                className="relative flex flex-col rounded-[20px] border border-[#EAD0D9] bg-white p-7 shadow-sm"
              >
                {/* Tırnak işareti - dekoratif */}
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF5F7] border border-[#EAD0D9]">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M0 12V7.2C0 5.04 0.56 3.28 1.68 1.92 2.8 0.64 4.32 0 6.24 0v2.4C5.28 2.4 4.56 2.72 4.08 3.36 3.6 3.92 3.36 4.72 3.36 5.76H6.24V12H0ZM9.76 12V7.2C9.76 5.04 10.32 3.28 11.44 1.92 12.56 0.64 14.08 0 16 0v2.4C15.04 2.4 14.32 2.72 13.84 3.36 13.36 3.92 13.12 4.72 13.12 5.76H16V12H9.76Z" fill="#8C5368" fillOpacity="0.25"/>
                  </svg>
                </div>

                <p className="flex-1 font-heading text-[1.05rem] leading-[1.75] text-ink italic">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <footer className="mt-6 flex items-center gap-3 border-t border-[#EAD0D9] pt-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8C5368] font-heading text-sm font-bold text-white">
                    {item.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">{item.author}</p>
                    <p className="text-[10px] text-muted mt-0.5">Doğrulanmış müşteri</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} width="10" height="10" viewBox="0 0 10 10" fill="#B8860B"><path d="M5 0l1.12 3.44H9.76l-2.94 2.13 1.12 3.44L5 7 2.06 9.01l1.12-3.44L.24 3.44H3.88z"/></svg>
                    ))}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Güven rozeti */}
          <div className="mt-10 flex flex-wrap items-center gap-6 rounded-[16px] border border-[#EAD0D9] bg-white px-6 py-4">
            <p className="text-xs font-semibold text-ink">Gizlilik odaklı çalışma</p>
            <span className="h-4 w-px bg-[#EAD0D9]" />
            <p className="text-xs text-muted">Tüm müşteri bilgileri gizli tutulmaktadır. Paylaşılan yorumlar, bilgi değişimi için aile onayı alınarak yer almaktadır.</p>
          </div>
        </div>
      </section>

      {/* ═══════ DADILAR İÇİN ══════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid overflow-hidden rounded-xl3 border border-line shadow-lg lg:grid-cols-[0.6fr_1fr]">
            <div className="relative min-h-[260px]">
              <Image src={siteImages.hero} alt="Profesyonel dadı adayları" fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-green/60 to-transparent" />
            </div>
            <div className="bg-white p-7 lg:p-10">
              <Label t="Dadılar İçin" />
              <H size={2} className="mt-3">Saygılı ve net bir başvuru süreci</H>
              <p className="mt-3 text-sm leading-7 text-muted">Deneyiminizi, referanslarınızı ve çalışma beklentinizi paylaşın. Uygun aile eşleşmeleri için değerlendirme başlasın.</p>
              <p className="mt-1.5 text-xs text-muted/60">Başvurular değerlendirme sürecine alınır. İşe yerleşme garantisi oluşturmaz.</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {["Referans ve çalışma geçmişi", "Belge ve kimlik doğrulama", "İletişim kalitesi", "Aile uyum analizi"].map(s => (
                  <div key={s} className="flex items-center gap-2 rounded-card border border-line bg-bg p-3">
                    <Check green />
                    <p className="text-xs font-medium text-ink">{s}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/dadi-basvurusu" className="btn-primary">Dadı Başvurusu Yap <Arrow white /></Link>
                <Link href="/dadilar-icin" className="btn-outline">Süreci incele</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BLOG ══════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label t="Rehberler" />
              <H size={2} className="mt-3">Aileler ve adaylar için pratik içerikler</H>
            </div>
            <Link href="/blog" className="btn-outline self-start sm:self-auto shrink-0">Tüm yazılar →</Link>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {blogPosts.slice(0, 3).map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover group block overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill sizes="400px" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-green backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-heading text-[0.92rem] font-semibold text-ink">{post.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#B8860B] group-hover:gap-2.5 transition-all">
                    Devamını oku <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SSS ═══════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <Label t="SSS" />
              <H size={2} className="mt-3">Ailelerin en çok sorduğu sorular</H>
              <p className="mt-3 text-sm leading-7 text-muted">Daha fazlası için SSS sayfamızı ziyaret edebilirsiniz.</p>
              <Link href="/sik-sorulan-sorular" className="btn-outline mt-5 inline-flex">Tüm sorular →</Link>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ═══════ LOKASYONLAR ════════════════════════════ */}
      <section className="border-y border-line py-12 lg:py-16 bg-bg">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Label t="Hizmet Bölgeleri" />
          <H size={2} className="mt-3 mb-7">İstanbul ve çevresinde hizmet ağımız</H>
          <div className="flex flex-wrap gap-2">
            {locationsPreview.map(loc => (
              <Link
                key={loc.slug}
                href={`/istanbul/${loc.slug === "istanbul" ? "dadi" : `${loc.slug}-dadi`}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-green hover:text-green hover:bg-green/5 transition-colors"
              >
                {loc.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-xl3 bg-green p-10 lg:p-16">
            {/* Dekor */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/5" />
            <div className="pointer-events-none absolute right-10 top-10 h-32 w-32 rounded-full border border-white/4" />

            <div className="divider-gold mb-10" />
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Label t="Başlayalım" light />
                <H size={2} light className="mt-3">
                  Aileniz için doğru dadıyı profesyonel bir süreçle bulmaya başlayın.
                </H>
              </div>
              <div className="flex shrink-0 flex-col gap-3">
                <Link href="/aile-basvurusu" className="btn-gold">
                  Aile Başvurusu Yap <Arrow />
                </Link>
                <Link href="/geri-aranma-talebi" className="rounded-full border border-white/40 bg-white/10 px-8 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/16">
                  Geri Aranma Talebi
                </Link>
              </div>
            </div>
            <div className="divider-gold mt-10" />
          </div>
        </div>
      </section>
    </>
  );
}
