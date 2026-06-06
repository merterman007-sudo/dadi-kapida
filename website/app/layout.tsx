import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "../components/site-shell";
import { WhatsAppButton } from "../components/whatsapp-button";
import Script from "next/script";
import { CookieConsent } from "../components/cookie-consent";
import { MobileCta } from "../components/mobile-cta";
import { OrganizationSchema } from "../components/structured-data";
import { fetchPublic } from "../lib/api";

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
  "homepage.trust"?: {
    items?: string[];
  };
};

type NavigationResponse = {
  items: Array<{ label: string; href: string }>;
};

const defaultNavigation = [
  { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
  { label: "Süreç", href: "/aileler-icin/nasil-calisir" },
  { label: "Neden Biz", href: "/neden-dadi-kapida" },
  { label: "Blog", href: "/blog" },
  { label: "SSS", href: "/sik-sorulan-sorular" },
  { label: "İletişim", href: "/iletisim" }
];

const bodyFont = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body"
});

const headingFont = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dadikapida.com"),
  title: {
    default: "Dadı Kapıda | Profesyonel Ev Hizmetleri Danışmanlığı",
    template: "%s | Dadı Kapıda"
  },
  description: "Dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlikçi, şoför ve ev yardımcısı için güvenilir, referanslı ve aileye özel personel yerleştirme danışmanlığı. Türkiye genelinde hizmet.",
  openGraph: {
    siteName: "Dadı Kapıda",
    locale: "tr_TR",
    type: "website"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, navigation] = await Promise.all([
    fetchPublic<SiteSettings>("/api/v1/public/site-settings", {}),
    fetchPublic<NavigationResponse>("/api/v1/public/navigation", {
      items: defaultNavigation
    })
  ]);

  const navigationItems = [
    ...navigation.items,
    ...defaultNavigation.filter((defaultItem) => !navigation.items.some((item) => item.href === defaultItem.href))
  ];

  const whatsapp = siteSettings["global.contact"]?.whatsapp ?? "";

  return (
    <html lang="tr">
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans text-[var(--ink)]`}>
        <OrganizationSchema />
        <SiteHeader navigation={navigationItems} siteSettings={siteSettings} />
        <main className="pb-[72px] lg:pb-0">{children}</main>
        <SiteFooter siteSettings={siteSettings} />
        <MobileCta />
        {whatsapp ? <WhatsAppButton whatsapp={whatsapp} /> : null}
        <CookieConsent />
        {/* Canlı chat — Tawk.to (ID'yi CRM'den yapılandırın) */}
        {process.env.TAWKTO_PROPERTY_ID ? (
          <Script
            id="tawkto"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                (function(){
                  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                  s1.async=true;
                  s1.src='https://embed.tawk.to/${process.env.TAWKTO_PROPERTY_ID}/default';
                  s1.charset='UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1,s0);
                })();
              `
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
