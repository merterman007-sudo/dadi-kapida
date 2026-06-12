import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.WEBSITE_PUBLIC_URL ?? "https://dadikapida.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
