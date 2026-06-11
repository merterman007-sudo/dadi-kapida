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
  const normalized = slug.toLowerCase();
  const exactMatch = servicePhotos[normalized];
  if (exactMatch) {
    return exactMatch;
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
  return matchedRule?.photo ?? null;
}
