export const defaultSiteImages = {
  hero: "/images/site/premium-hero.png",
  process: "/images/site/premium-process.png",
  trust: "/images/site/premium-trust.png",
  blogDefault: "/images/site/premium-process.png"
} as const;

export type SiteImageKey = keyof typeof defaultSiteImages;
export type SiteImages = Record<SiteImageKey, string>;

export type WebsiteImageSettings = Partial<Record<SiteImageKey, string>>;

export type WebsiteSettingsWithImages = {
  "website.images"?: WebsiteImageSettings;
};

function cleanImagePath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

export function resolveSiteImages(settings?: WebsiteSettingsWithImages): SiteImages {
  const configured = settings?.["website.images"] ?? {};

  return {
    hero: cleanImagePath(configured.hero) ?? defaultSiteImages.hero,
    process: cleanImagePath(configured.process) ?? defaultSiteImages.process,
    trust: cleanImagePath(configured.trust) ?? defaultSiteImages.trust,
    blogDefault: cleanImagePath(configured.blogDefault) ?? defaultSiteImages.blogDefault
  };
}
