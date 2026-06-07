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
  { label: "SÃ¼reÃ§", href: "/aileler-icin/nasil-calisir" },
  { label: "Neden Biz", href: "/neden-dadi-kapida" },
  { label: "Blog", href: "/blog" },
  { label: "SSS", href: "/sik-sorulan-sorular" },
  { label: "Ä°letiÅŸim", href: "/iletisim" }
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
    default: "DadÄ± KapÄ±da | Profesyonel Ev Hizmetleri DanÄ±ÅŸmanlÄ±ÄŸÄ±",
    template: "%s | DadÄ± KapÄ±da"
  },
  description: "DadÄ±, bebek bakÄ±cÄ±sÄ±, yaÅŸlÄ± bakÄ±cÄ±sÄ±, hasta bakÄ±cÄ±sÄ±, temizlikÃ§i, ÅŸofÃ¶r ve ev yardÄ±mcÄ±sÄ± iÃ§in gÃ¼venilir, referanslÄ± ve aileye Ã¶zel personel yerleÅŸtirme danÄ±ÅŸmanlÄ±ÄŸÄ±. TÃ¼rkiye genelinde hizmet.",
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
    title: "DadÄ± KapÄ±da | Profesyonel Ev Hizmetleri DanÄ±ÅŸmanlÄ±ÄŸÄ±",
    description:
      "DadÄ±, bebek bakÄ±cÄ±sÄ±, yaÅŸlÄ± bakÄ±cÄ±sÄ±, hasta bakÄ±cÄ±sÄ±, temizlikÃ§i, ÅŸofÃ¶r ve ev yardÄ±mcÄ±sÄ± iÃ§in gÃ¼venilir personel yerleÅŸtirme danÄ±ÅŸmanlÄ±ÄŸÄ±.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dadikapida.com",
    siteName: "DadÄ± KapÄ±da",
    locale: "tr_TR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DadÄ± KapÄ±da | Profesyonel Ev Hizmetleri DanÄ±ÅŸmanlÄ±ÄŸÄ±",
    description:
      "DadÄ±, bebek bakÄ±cÄ±sÄ±, yaÅŸlÄ± bakÄ±cÄ±sÄ±, hasta bakÄ±cÄ±sÄ±, temizlikÃ§i, ÅŸofÃ¶r ve ev yardÄ±mcÄ±sÄ± iÃ§in gÃ¼venilir personel yerleÅŸtirme."
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
        {/* Tawk.to canlÄ± chat */}
        <Script
          id="tawkto"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6a2478aef81b7b1c2d8ac579/1jqf7eqv3';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `
          }}
        />
      </body>
    </html>
  );
}

