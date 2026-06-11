const servicePhotos: Record<string, string> = {
  "yatili-dadi": "/images/photo-bank/yatili-dadi.png",
  "gunduzlu-dadi": "/images/photo-bank/egitimli-dadi.png",
  "bebek-bakicisi": "/images/photo-bank/bebek-bakicisi.png",
  "yenidogan-bakimi": "/images/photo-bank/yeni-dogan-bakimi.png",
  "oyun-ablasi": "/images/photo-bank/oyun-ablasi.png",
  "egitimli-dadi": "/images/photo-bank/egitimli-dadi.png",
  "yabanci-dil-bilen-dadi": "/images/photo-bank/egitimli-dadi.png",
  "ikiz-cocuk-bakimi": "/images/photo-bank/ikiz-cocuk-bakimi.png",
  "seyahat-uyumlu-dadi": "/images/photo-bank/seyahat-uyumlu-dadi.png",
  "donemsel-dadi": "/images/photo-bank/oyun-ablasi.png",
  "acil-dadi-ihtiyaci": "/images/photo-bank/egitimli-dadi.png",
  "cocuk-bakicisi": "/images/photo-bank/cocuk-bakicisi.png",
  "gece-dadisi": "/images/photo-bank/yeni-dogan-bakimi.png",
  "yasli-bakicisi": "/images/photo-bank/yasli-bakici.jpg",
  "hasta-bakicisi": "/images/photo-bank/hasta-bakici.jpg",
  "evde-bakim": "/images/photo-bank/yasli-bakici.jpg",
  "ameliyat-sonrasi-destek": "/images/photo-bank/ameliyat-sonrasi-destek.png",
  "gunluk-temizlik": "/images/photo-bank/kurumsal-temizlik.png",
  "haftalik-temizlik": "/images/photo-bank/kurumsal-temizlik.png",
  "ofis-temizligi": "/images/photo-bank/ofis-temizligi.png",
  "villa-temizligi": "/images/photo-bank/villa-temizligi.png",
  "aile-soforu": "/images/photo-bank/aile-soforu.png",
  "ozel-sofor": "/images/photo-bank/ozel-sofor.png",
  "makam-soforu": "/images/photo-bank/makam-soforu.png",
  asci: "/images/photo-bank/asci.png",
  "ev-yardimcisi": "/images/photo-bank/aile-soforu.png",
  refakatci: "/images/photo-bank/ameliyat-sonrasi-destek.png",
  kahya: "/images/photo-bank/kahya.png",
  camasirci: "/images/photo-bank/camasirci.png"
};

const PHOTO_VERSION = "20260611d";

function withVersion(path: string) {
  return `${path}?v=${PHOTO_VERSION}`;
}

export function getServicePhoto(slug: string): string | null {
  const normalized = slug.toLowerCase();
  const exactMatch = servicePhotos[normalized];
  if (exactMatch) {
    return withVersion(exactMatch);
  }

  const fallbackRules: Array<{ test: RegExp; photo: string }> = [
    { test: /(gunduzlu|egitimli|yabanci-dil|oyun|cocuk)/, photo: "/images/photo-bank/egitimli-dadi.png" },
    { test: /(yenidogan|gece-dadisi|gece)/, photo: "/images/photo-bank/yeni-dogan-bakimi.png" },
    { test: /(ikiz|cogul)/, photo: "/images/photo-bank/ikiz-cocuk-bakimi.png" },
    { test: /(seyahat|donemsel|acil)/, photo: "/images/photo-bank/seyahat-uyumlu-dadi.png" },
    { test: /(refakat|ameliyat|hasta|bakim|yasli|evde-bakim)/, photo: "/images/photo-bank/hasta-bakici.jpg" },
    { test: /(temizlik|clean)/, photo: "/images/photo-bank/kurumsal-temizlik.png" },
    { test: /(sofor|soforu)/, photo: "/images/photo-bank/ozel-sofor.png" },
    { test: /(asci)/, photo: "/images/photo-bank/asci.png" },
    { test: /(kahya|ev-yardimcisi|ev yardimcisi)/, photo: "/images/photo-bank/kahya.png" },
    { test: /(camasir|utu|laundry)/, photo: "/images/photo-bank/camasirci.png" }
  ];

  const matchedRule = fallbackRules.find((rule) => rule.test.test(normalized));
  return matchedRule ? withVersion(matchedRule.photo) : null;
}
