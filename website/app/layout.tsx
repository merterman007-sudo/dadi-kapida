import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "../components/site-shell";
import { WhatsAppButton } from "../components/whatsapp-button";
import { CookieConsent } from "../components/cookie-consent";
import { MobileCta } from "../components/mobile-cta";
import { OrganizationSchema } from "../components/structured-data";
import { TawkChat } from "../components/tawk-chat";
import { fetchPublic } from "../lib/api";
import { defaultContact } from "../lib/contact";

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
  keywords: [
    "dadı kapıda",
    "dadı",
    "bebek bakıcısı",
    "çocuk bakıcısı",
    "yaşlı bakıcısı",
    "hasta bakıcısı",
    "temizlikçi",
    "şoför",
    "ev yardımcısı",
    "personel yerleştirme"
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dadikapida.com"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "Dadı Kapıda | Profesyonel Ev Hizmetleri Danışmanlığı",
    description:
      "Dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlikçi, şoför ve ev yardımcısı için güvenilir personel yerleştirme danışmanlığı.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dadikapida.com",
    siteName: "Dadı Kapıda",
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Dadı Kapıda | Profesyonel Ev Hizmetleri Danışmanlığı",
    description:
      "Dadı, bebek bakıcısı, yaşlı bakıcısı, hasta bakıcısı, temizlikçi, şoför ve ev yardımcısı için güvenilir personel yerleştirme."
  },
  other: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      }
    : undefined
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

  const whatsapp = siteSettings["global.contact"]?.whatsapp?.trim() || defaultContact.whatsapp;

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
        <TawkChat />
      </body>
    </html>
  );
}

