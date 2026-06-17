"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultContact } from "../lib/contact";
import { footerPages } from "../lib/content";

type NavItem = { label: string; href: string };

const footerServices: NavItem[] = [
  { label: "Dadı & Bebek Bakıcısı", href: "/hizmetlerimiz/yatili-dadi" },
  { label: "Yaşlı Bakıcısı", href: "/hizmetlerimiz/yasli-bakicisi" },
  { label: "Hasta Bakıcısı", href: "/hizmetlerimiz/hasta-bakicisi" },
  { label: "Temizlik Hizmetleri", href: "/hizmetlerimiz/gunluk-temizlik" },
  { label: "Özel Şoför", href: "/hizmetlerimiz/ozel-sofor" },
  { label: "Ev Yardımcısı / Aşçı", href: "/hizmetlerimiz/ev-yardimcisi" },
  { label: "Tüm Hizmetler →", href: "/hizmetlerimiz" }
];

const footerCorporate: NavItem[] = [
  { label: "Aileler İçin", href: "/aileler-icin" },
  { label: "Türkiye Geneli Hizmet", href: "/hizmet-bolgeleri" },
  { label: "Personel Başvurusu", href: "/personel-basvurusu" },
  { label: "Blog", href: "/blog" },
  { label: "SSS", href: "/sik-sorulan-sorular" },
  { label: "İletişim", href: "/iletisim" }
];

const familyPages: NavItem[] = [
  { label: "Nasıl Çalışır", href: "/aileler-icin/nasil-calisir" },
  { label: "İhtiyaç Analizi", href: "/aileler-icin/ihtiyac-analizi" },
  { label: "Aday Seçim Süreci", href: "/aileler-icin/aday-secim-sureci" },
  { label: "Yerleştirme Sonrası Takip", href: "/aileler-icin/yerlestirme-sonrasi-takip" },
  { label: "Güvenlik ve Doğrulama", href: "/aileler-icin/guvenlik-ve-dogrulama" },
  { label: "SSS", href: "/aileler-icin/sik-sorulan-sorular" }
];

const desktopNavigationItems: NavItem[] = [
  { label: "Süreç", href: "/aileler-icin/nasil-calisir" },
  { label: "Neden Biz", href: "/neden-dadi-kapida" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "SSS", href: "/sik-sorulan-sorular" },
  { label: "İletişim", href: "/iletisim" }
];

type SiteSettings = {
  "global.contact"?: {
    phone?: string;
    whatsapp?: string;
    callbackLabel?: string;
    supportEmail?: string;
  };
  "website.brand"?: {
    brandName?: string;
    tagline?: string;
    logoUrl?: string;
  };
  "homepage.trust"?: { items?: string[] };
};

function normalizePhoneLink(value?: string) {
  return value?.replace(/\D/g, "") ?? "";
}

function BrandLockup({
  brandName,
  logoUrl,
  compact = false
}: {
  brandName: string;
  logoUrl?: string | undefined;
  compact?: boolean;
}) {
  const source = logoUrl?.trim() || "/images/brand/dadi-kapida-logo.svg";

  return (
    <span className="flex items-center">
      <Image
        src={source}
        alt={`${brandName} logosu`}
        width={compact ? 205 : 230}
        height={compact ? 55 : 61}
        priority={!compact}
        unoptimized
        className={`block w-auto object-contain transition-transform duration-200 group-hover:scale-[1.015] ${
          compact ? "h-11 max-w-[205px]" : "h-14 max-w-[230px]"
        }`}
      />
    </span>
  );
}

export function SiteHeader({
  navigation,
  siteSettings
}: {
  navigation: NavItem[];
  siteSettings: SiteSettings;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const contact = siteSettings["global.contact"] ?? {};
  const whatsapp = contact.whatsapp?.trim() || defaultContact.whatsapp;
  const email = contact.supportEmail?.trim() || defaultContact.supportEmail;
  const brand = siteSettings["website.brand"] ?? {};
  const brandName = brand.brandName?.trim() || "Dadı Kapıda";
  const logoUrl = brand.logoUrl?.trim();
  const supportHours = "Pzt-Cmt 09:00-19:00";
  const coverage = "Türkiye geneli";

  const normalizedNavigation = navigation.map((item) =>
    item.href === "/hizmet-bolgeleri" ? { ...item, label: "Türkiye Geneli Hizmet" } : item
  );
  const mobileNavigation = normalizedNavigation.some((item) => item.href === "/hizmet-bolgeleri")
    ? normalizedNavigation
    : [{ label: "Türkiye Geneli Hizmet", href: "/hizmet-bolgeleri" }, ...normalizedNavigation];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white/96 backdrop-blur-xl transition-shadow duration-200 ${
          scrolled ? "shadow-[0_1px_0_#F0D8E2,0_10px_30px_rgba(7,27,58,0.07)]" : "border-b border-line"
        }`}
      >
        <div className="hidden border-b border-line bg-bg/95">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2 text-[11px] text-muted lg:px-8">
            <span className="hidden tracking-[0.22em] text-ink/70 sm:block">
              PROFESYONEL EV HİZMETLERİ DANIŞMANLIĞI
            </span>

            <div className="flex items-center gap-4 lg:gap-5">
              {whatsapp ? (
                <a
                  href={`https://wa.me/${normalizePhoneLink(whatsapp)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green transition-colors"
                >
                  WhatsApp
                </a>
              ) : null}
              <a href={`mailto:${email}`} className="hidden hover:text-green transition-colors md:inline-flex">
                {email}
              </a>
              <span className="hidden lg:inline-flex">{supportHours}</span>
              <span className="hidden xl:inline-flex">{coverage}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="group shrink-0" aria-label={`${brandName} ana sayfa`}>
            <BrandLockup brandName={brandName} logoUrl={logoUrl} />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            <Link
              href="/"
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive("/") ? "text-green" : "text-body hover:text-green"
              }`}
            >
              Ana Sayfa
            </Link>

            <div className="group relative">
              <Link
                href="/hizmetlerimiz"
                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm transition-colors ${
                  isActive("/hizmetlerimiz")
                    ? "font-semibold text-green"
                    : "text-body hover:text-green"
                }`}
              >
                Hizmetlerimiz
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
              <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 rounded-2xl border border-line bg-white p-2 shadow-lg opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                {[
                  { label: "Dadı & Bebek Bakıcısı", href: "/hizmetlerimiz/yatili-dadi" },
                  { label: "Yaşlı Bakıcısı", href: "/hizmetlerimiz/yasli-bakicisi" },
                  { label: "Hasta Bakıcısı", href: "/hizmetlerimiz/hasta-bakicisi" },
                  { label: "Temizlik Hizmetleri", href: "/hizmetlerimiz/gunluk-temizlik" },
                  { label: "Özel Şoför", href: "/hizmetlerimiz/ozel-sofor" },
                  { label: "Ev Yardımcısı / Aşçı", href: "/hizmetlerimiz/ev-yardimcisi" },
                  { label: "Tüm Hizmetler →", href: "/hizmetlerimiz" }
                ].map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="block whitespace-nowrap rounded-xl px-3 py-2 text-sm text-body transition hover:bg-[#FFF3F7] hover:text-green"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>

            {desktopNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors ${
                  isActive(item.href)
                    ? "font-semibold text-green"
                    : "text-body hover:text-green"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <Link href="/personel-basvurusu" className="btn-outline px-3.5 py-2.5 text-[11px]">
              Personel Başvurusu
            </Link>
            <Link href="/aile-basvurusu" className="btn-primary px-4 py-2.5 text-[11px]">
              Aile Başvurusu
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body transition hover:border-green hover:text-green xl:hidden"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="2" y1="5" x2="14" y2="5" />
                <line x1="2" y1="9" x2="14" y2="9" />
                <line x1="2" y1="13" x2="14" y2="13" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white xl:hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <Link href="/" className="flex items-center gap-3" aria-label={`${brandName} ana sayfa`}>
              <BrandLockup brandName={brandName} logoUrl={logoUrl} compact />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body hover:border-green"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-0.5 overflow-y-auto px-4 py-5">
            {mobileNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors ${
                  isActive(item.href) ? "bg-[#F7FAF8] font-semibold text-green" : "text-body hover:bg-[#F7FAF8]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-2.5 border-t border-line px-4 py-5">
            <Link href="/aile-basvurusu" className="btn-primary w-full justify-center text-sm">
              Aile Başvurusu Yap
            </Link>
            <Link href="/personel-basvurusu" className="btn-outline w-full justify-center text-sm">
              Personel Başvurusu Yap
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function SiteFooter({ siteSettings }: { siteSettings: SiteSettings }) {
  const contact = siteSettings["global.contact"] ?? {};
  const email = contact.supportEmail?.trim() || defaultContact.supportEmail;
  const phone = contact.phone?.trim() || defaultContact.phone;
  const whatsapp = contact.whatsapp?.trim() || defaultContact.whatsapp;
  const brand = siteSettings["website.brand"] ?? {};
  const brandName = brand.brandName?.trim() || "Dadı Kapıda";
  const logoUrl = brand.logoUrl?.trim();
  const trustItems = siteSettings["homepage.trust"]?.items ?? [
    "Referans Kontrolü",
    "Aileye Özel Eşleştirme",
    "Gizlilik ve KVKK",
    "Yerleştirme Sonrası Takip"
  ];

  const supportHours = "Pzt-Cmt 09:00-19:00";
  const coverage = "Türkiye geneli";

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <BrandLockup brandName={brandName} logoUrl={logoUrl} compact />
            </div>
            <p className="max-w-xs text-sm leading-7 text-muted">
              Aileler için güvenilir, referanslı ve aileye özel dadı yerleştirme danışmanlığı. Türkiye genelinde hizmet.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted">
              <span className="rounded-full border border-line bg-bg px-3 py-1">{supportHours}</span>
              <span className="rounded-full border border-line bg-bg px-3 py-1">{coverage}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {trustItems.slice(0, 4).map((item) => (
                <span key={item} className="rounded-full border border-line bg-bg px-2.5 py-1 text-[10px] font-medium text-muted">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink">Hizmetler</p>
            <div className="space-y-2 text-sm text-muted">
              {footerServices.map(({ label, href }) => (
                <Link key={href} href={href} className="block transition-colors hover:text-green">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink">Kurumsal</p>
            <div className="space-y-2 text-sm text-muted">
              {footerCorporate.map(({ label, href }) => (
                <Link key={href} href={href} className="block transition-colors hover:text-green">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-ink">İletişim</p>
            <div className="space-y-2 text-sm text-muted">
              <a href={`mailto:${email}`} className="block transition-colors hover:text-green">
                {email}
              </a>
              {phone ? <span className="block">{phone}</span> : null}
              {whatsapp ? (
                <a
                  href={`https://wa.me/${normalizePhoneLink(whatsapp)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition-colors hover:text-green"
                >
                  WhatsApp
                </a>
              ) : null}
              <p className="pt-1 text-xs text-muted/70">{supportHours}</p>
            </div>
            <div className="mt-5 space-y-2">
              <Link href="/aile-basvurusu" className="btn-primary w-full justify-center px-4 py-2.5 text-xs">
                Aile Başvurusu
              </Link>
              <Link href="/personel-basvurusu" className="btn-outline w-full justify-center px-4 py-2.5 text-xs">
                Personel Başvurusu
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Dadı Kapıda. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4">
            {footerPages.map((page) => (
              <Link key={page.href} href={page.href} className="transition-colors hover:text-green">
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
