const servicePhotos: Record<string, string> = {
  "yatili-dadi": "/images/photo-bank/egitimli-dadi.png",
  "bebek-bakicisi": "/images/photo-bank/yeni-dogan-bakimi.png",
  "yasli-bakicisi": "/images/photo-bank/yasli-bakici.jpg",
  "hasta-bakicisi": "/images/photo-bank/hasta-bakici.jpg",
  "gunluk-temizlik": "/images/photo-bank/kurumsal-temizlik.png",
  "ozel-sofor": "/images/photo-bank/ozel-sofor.png",
  asci: "/images/photo-bank/asci.png",
  "ev-yardimcisi": "/images/photo-bank/aile-soforu.png",
  refakatci: "/images/photo-bank/ameliyat-sonrasi-destek.png",
  kahya: "/images/photo-bank/kahya.png",
  camasirci: "/images/photo-bank/camasirci.png"
};

export function getServicePhoto(slug: string): string | null {
  return servicePhotos[slug.toLowerCase()] ?? null;
}
