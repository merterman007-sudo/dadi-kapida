import type { MetadataRoute } from "next";
import { blogPosts, blogCategories } from "../lib/blog";
import { locations, services } from "../lib/site";

const pages = [
  "/",
  "/aile-basvurusu",
  "/dadi-basvurusu",
  "/geri-aranma-talebi",
  "/online-gorusme-talebi",
  "/aileler-icin",
  "/aileler-icin/nasil-calisir",
  "/aileler-icin/ihtiyac-analizi",
  "/aileler-icin/aday-secim-sureci",
  "/aileler-icin/yerlestirme-sonrasi-takip",
  "/aileler-icin/sik-sorulan-sorular",
  "/aileler-icin/guvenlik-ve-dogrulama",
  "/dadilar-icin",
  "/dadilar-icin/basvuru-sureci",
  "/dadilar-icin/aranan-nitelikler",
  "/dadilar-icin/profesyonel-dadi-rehberi",
  "/dadilar-icin/sik-sorulan-sorular",
  "/dadilar-icin/acik-pozisyonlar",
  "/iletisim",
  "/randevu",
  "/aile-destek",
  "/aday-destek",
  "/sikayet-ve-oneri",
  "/sik-sorulan-sorular",
  "/hakkimizda",
  "/ekibimiz",
  "/neden-dadi-kapida",
  "/sorumluluk-ve-degerlerimiz",
  "/guvenlik-ve-dogrulama",
  "/referanslar",
  "/basari-hikayeleri",
  "/basinda-biz",
  "/is-ortaklari",
  "/hizmetlerimiz",
  "/hizmet-bolgeleri",
  "/blog",
  "/rehberler",
  "/rehberler/dadi-secme-rehberi",
  "/rehberler/yatili-dadi-rehberi",
  "/rehberler/gunduzlu-dadi-rehberi",
  "/rehberler/bebek-bakicisi-secme-rehberi",
  "/rehberler/dadi-maaslari",
  "/rehberler/evde-bakici-sigorta-rehberi",
  "/kvkk-aydinlatma-metni",
  "/acik-riza-metni",
  "/gizlilik-politikasi",
  "/cerez-politikasi",
  "/kullanim-sartlari",
  "/basvuru-sartlari",
  "/aday-aydinlatma-metni",
  "/aile-aydinlatma-metni",
  "/veri-sahibi-basvuru-formu",
  "/yasal-bilgilendirme"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.WEBSITE_PUBLIC_URL ?? "http://localhost:3002";
  const staticRoutes = pages.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
  const serviceRoutes = services.map((item) => ({ url: `${baseUrl}/hizmetlerimiz/${item.slug}`, lastModified: new Date() }));
  const rootLocationRoutes = locations
    .filter((item) => ["istanbul", "ankara", "izmir", "antalya"].includes(item.slug))
    .map((item) => ({ url: `${baseUrl}/${item.slug}-dadi`, lastModified: new Date() }));
  const districtRoutes = locations
    .filter((item) => !["istanbul", "ankara", "izmir", "antalya"].includes(item.slug))
    .map((item) => ({ url: `${baseUrl}/istanbul/${item.slug}-dadi`, lastModified: new Date() }));
  const blogRoutes = blogPosts.map((item) => ({ url: `${baseUrl}/blog/${item.slug}`, lastModified: new Date() }));
  const categoryRoutes = blogCategories.map((item) => ({ url: `${baseUrl}/blog/kategori/${item.slug}`, lastModified: new Date() }));

  return [...staticRoutes, ...serviceRoutes, ...rootLocationRoutes, ...districtRoutes, ...blogRoutes, ...categoryRoutes];
}
