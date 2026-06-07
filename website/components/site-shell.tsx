"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  { label: "Hizmet Bölgeleri", href: "/hizmet-bolgeleri" },
  { label: "Personel Başvurusu", href: "/personel-basvurusu" },
  { label: "Blog", href: "/blog" },
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

/* ─── Header ────────────────────────────────────────── */
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
  const phone = contact.phone?.trim();
  const email = contact.supportEmail ?? "iletisim@dadikapida.com";
  const whatsapp = contact.whatsapp?.trim();
  const brand = siteSettings["website.brand"] ?? {};
  const brandName = brand.brandName?.trim() || "Dadı Kapıda";
  const tagline = brand.tagline?.trim() || "Güven odaklı yerleştirme";
  const logoUrl = brand.logoUrl?.trim();
  const mobileNavigation = navigation.some((item) => item.href === "/hizmet-bolgeleri")
    ? navigation
    : [{ label: "Hizmet Bölgeleri", href: "/hizmet-bolgeleri" }, ...navigation];

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* route değişince menüyü kapat */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* menü açıkken body scroll'u engelle */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-[0_1px_0_#DDE6E1,0_2px_12px_rgba(0,0,0,0.06)]" : "border-b border-line"
        }`}
      >
        {/* Üst bilgi bandı */}
        <div className="bg-green">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs text-white/80 lg:px-8">
            <span className="hidden tracking-widest sm:block">PROFESYONEL EV HİZMETLERİ DANIŞMANLIĞI</span>
            <div className="flex items-center gap-5">
              {phone && (
                <a href={`tel:${phone.replace(/\D/g,"")}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              )}
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Ana nav */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-green text-white font-heading text-sm font-semibold shrink-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                "DK"
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-green leading-none">{brandName}</p>
              <p className="text-[11px] text-muted leading-none mt-0.5">{tagline}</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Hizmetlerimiz dropdown */}
            <div className="group relative">
              <Link
                href="/hizmetlerimiz"
                className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-sm transition-colors ${
                  isActive("/hizmetlerimiz") ? "bg-[#FAF5F7] font-semibold text-green" : "text-body hover:text-green hover:bg-[#FAF5F7]"
                }`}
              >
                Hizmetlerimiz
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </Link>
              <div className="invisible absolute left-0 top-full z-50 mt-1 w-56 rounded-2xl border border-line bg-white p-2 shadow-lg opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                {[
                  { label: "Dadı & Bebek Bakıcısı", href: "/hizmetlerimiz/yatili-dadi" },
                  { label: "Yaşlı Bakıcısı", href: "/hizmetlerimiz/yasli-bakicisi" },
                  { label: "Hasta Bakıcısı", href: "/hizmetlerimiz/hasta-bakicisi" },
                  { label: "Temizlik Hizmetleri", href: "/hizmetlerimiz/gunluk-temizlik" },
                  { label: "Özel Şoför", href: "/hizmetlerimiz/ozel-sofor" },
                  { label: "Ev Yardımcısı / Aşçı", href: "/hizmetlerimiz/ev-yardimcisi" },
                  { label: "Tüm Hizmetler →", href: "/hizmetlerimiz" },
                ].map(sub => (
                  <Link key={sub.href} href={sub.href} className="block rounded-xl px-3 py-2 text-sm text-body transition hover:bg-[#FAF5F7] hover:text-green">
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>

            {navigation.filter(item => item.href !== "/hizmetlerimiz").map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-full text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-[#FAF5F7] font-semibold text-green"
                    : "text-body hover:text-green hover:bg-[#FAF5F7]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/hizmet-bolgeleri"
              className={`px-3.5 py-2 rounded-full text-sm transition-colors ${
                isActive("/hizmet-bolgeleri")
                  ? "bg-[#FAF5F7] font-semibold text-green"
                  : "text-body hover:text-green hover:bg-[#FAF5F7]"
              }`}
            >
              Hizmet Bölgeleri
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2 lg:flex">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g,"")}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline py-2 px-4 text-xs"
              >
                WhatsApp
              </a>
            )}
            <Link href="/personel-basvurusu" className="btn-outline py-2 px-4 text-xs">
              Personel Başvurusu
            </Link>
            <Link href="/aile-basvurusu" className="btn-primary py-2 px-5 text-xs">
              Aile Başvurusu
            </Link>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen(p => !p)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body transition hover:border-green hover:text-green lg:hidden"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="2" y1="5" x2="14" y2="5"/><line x1="2" y1="9" x2="14" y2="9"/><line x1="2" y1="13" x2="14" y2="13"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-white font-heading text-sm font-semibold">DK</div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-green">Dadı Kapıda</p>
            </Link>
            <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-body hover:border-green">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-0.5 overflow-y-auto px-4 py-5">
            {mobileNavigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors ${
                  isActive(item.href) ? "bg-[#F7FAF8] text-green font-semibold" : "text-body hover:bg-[#F7FAF8]"
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
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g,"")}`}
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full justify-center text-sm"
              >
                WhatsApp ile Yazın
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Footer ────────────────────────────────────────── */
export function SiteFooter({ siteSettings }: { siteSettings: SiteSettings }) {
  const contact = siteSettings["global.contact"] ?? {};
  const email = contact.supportEmail ?? "iletisim@dadikapida.com";
  const phone = contact.phone?.trim();
  const whatsapp = contact.whatsapp?.trim();
  const brand = siteSettings["website.brand"] ?? {};
  const brandName = brand.brandName?.trim() || "Dadı Kapıda";
  const tagline = brand.tagline?.trim() || "Güven odaklı yerleştirme";
  const logoUrl = brand.logoUrl?.trim();
  const trustItems = siteSettings["homepage.trust"]?.items ?? [
    "Referans Kontrolü",
    "Aileye Özel Eşleştirme",
    "Gizlilik ve KVKK",
    "Yerleştirme Sonrası Takip"
  ];

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* Ana footer grid */}
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green text-white font-heading text-sm font-semibold shrink-0">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={brandName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  "DK"
                )}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-green leading-none">{brandName}</p>
                <p className="text-[11px] text-muted mt-0.5">{tagline}</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted max-w-xs">
              Aileler için güvenilir, referanslı ve aileye özel dadı yerleştirme danışmanlığı. Türkiye genelinde hizmet.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {trustItems.slice(0, 4).map(item => (
                <span key={item} className="rounded-full border border-line bg-bg px-2.5 py-1 text-[10px] font-medium text-muted">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink mb-3">Hizmetler</p>
            <div className="space-y-2 text-sm text-muted">
              {footerServices.map(({ label, href }) => (
                <Link key={href} href={href} className="block hover:text-green transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink mb-3">Kurumsal</p>
            <div className="space-y-2 text-sm text-muted">
              {footerCorporate.map(({ label, href }) => (
                <Link key={href} href={href} className="block hover:text-green transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* İletişim */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink mb-3">İletişim</p>
            <div className="space-y-2 text-sm text-muted">
              <a href={`mailto:${email}`} className="block hover:text-green transition-colors">{email}</a>
              {phone && <a href={`tel:${phone.replace(/\D/g,"")}`} className="block hover:text-green transition-colors">{phone}</a>}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="block hover:text-green transition-colors">
                  WhatsApp
                </a>
              )}
            </div>
            <div className="mt-5 space-y-2">
              <Link href="/aile-basvurusu" className="btn-primary w-full justify-center text-xs py-2.5 px-4">
                Aile Başvurusu
              </Link>
              <Link href="/personel-basvurusu" className="btn-outline w-full justify-center text-xs py-2.5 px-4">
                Personel Başvurusu
              </Link>
            </div>
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="mt-10 border-t border-line pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} Dadı Kapıda. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap gap-4">
            {footerPages.map(p => (
              <Link key={p.href} href={p.href} className="hover:text-green transition-colors">{p.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
