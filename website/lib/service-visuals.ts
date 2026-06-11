export type ServiceScene =
  | "care"
  | "elder"
  | "patient"
  | "cleaning"
  | "driver"
  | "chef"
  | "house"
  | "laundry"
  | "consultation";

export type ServiceVisual = {
  scene: ServiceScene;
  badge: string;
  note: string;
  variant: number;
};

const defaultVisual: ServiceVisual = {
  scene: "consultation",
  badge: "Danışmanlık",
  note: "Aileye özel eşleştirme",
  variant: 0
};

const visualBySlug: Record<string, Omit<ServiceVisual, "variant">> = {
  "yatili-dadi": { scene: "house", badge: "Aile odaklı", note: "Yatılı bakım eşleşmesi" },
  "gunduzlu-dadi": { scene: "care", badge: "Gündüz desteği", note: "Rutin ve uyum odaklı" },
  "bebek-bakicisi": { scene: "care", badge: "Bebek bakımı", note: "Nazik ve güvenli yaklaşım" },
  "yenidogan-bakimi": { scene: "patient", badge: "Yeni doğan", note: "Hassas dönem desteği" },
  "oyun-ablasi": { scene: "consultation", badge: "Gelişim", note: "Oyun ve gelişim eşleşmesi" },
  "egitimli-dadi": { scene: "consultation", badge: "Eğitimli profil", note: "Pedagojik yaklaşım" },
  "yabanci-dil-bilen-dadi": { scene: "consultation", badge: "Dil desteği", note: "Uluslararası uyum" },
  "ikiz-cocuk-bakimi": { scene: "care", badge: "Çoğul bakım", note: "Yoğun rutin yönetimi" },
  "seyahat-uyumlu-dadi": { scene: "driver", badge: "Seyahat uyumu", note: "Esnek ve hareketli düzen" },
  "donemsel-dadi": { scene: "consultation", badge: "Dönemsel destek", note: "Kısa dönemli planlama" },
  "acil-dadi-ihtiyaci": { scene: "consultation", badge: "Acil eşleşme", note: "Hızlı danışman yönlendirmesi" },
  "cocuk-bakicisi": { scene: "care", badge: "Çocuk bakımı", note: "Okul ve rutin desteği" },
  "gece-dadisi": { scene: "house", badge: "Gece desteği", note: "Sessiz ve kontrollü bakım" },
  "yasli-bakicisi": { scene: "elder", badge: "Bakım desteği", note: "Sakin ve güven veren yaklaşım" },
  "refakatci": { scene: "patient", badge: "Refakat", note: "Hastane ve günlük eşlik" },
  "evde-bakim": { scene: "elder", badge: "Evde bakım", note: "Uzun dönemli destek" },
  "ameliyat-sonrasi-destek": { scene: "patient", badge: "İyileşme", note: "Taburculuk sonrası destek" },
  "gunluk-temizlik": { scene: "cleaning", badge: "Temizlik", note: "Hijyen ve düzen" },
  "haftalik-temizlik": { scene: "cleaning", badge: "Periyodik temizlik", note: "Planlı ev düzeni" },
  "ofis-temizligi": { scene: "cleaning", badge: "Ofis temizliği", note: "Profesyonel iş ortamı" },
  "villa-temizligi": { scene: "cleaning", badge: "Geniş alan", note: "Kapsamlı temizlik planı" },
  "aile-soforu": { scene: "driver", badge: "Aile şoförü", note: "Güvenli ulaşım" },
  "ozel-sofor": { scene: "driver", badge: "Özel şoför", note: "Profesyonel sürüş" },
  "makam-soforu": { scene: "driver", badge: "Makam şoförü", note: "Temsil ve gizlilik" },
  "asci": { scene: "chef", badge: "Ev mutfağı", note: "Günlük yemek desteği" },
  "kahya": { scene: "house", badge: "Ev yönetimi", note: "Koordinasyon ve düzen" },
  "ev-yardimcisi": { scene: "house", badge: "Ev desteği", note: "Günlük operasyon" },
  "camasirci": { scene: "laundry", badge: "Tekstil düzeni", note: "Ütü ve çamaşır desteği" }
};

const sceneByKeyword: Array<{ match: RegExp; scene: ServiceScene; badge: string; note: string }> = [
  { match: /(sofor|şoför)/i, scene: "driver", badge: "Güvenli ulaşım", note: "Profesyonel sürüş deneyimi" },
  { match: /(asci|aşçı)/i, scene: "chef", badge: "Ev mutfağı", note: "Premium mutfak desteği" },
  { match: /(camasirci|ütü|utü|laundry)/i, scene: "laundry", badge: "Tekstil düzeni", note: "Temiz ve derli toplu ev akışı" },
  { match: /(temizlik|clean)/i, scene: "cleaning", badge: "Temiz yaşam alanı", note: "Düzenli ve hijyenik sonuç" },
  { match: /(yasli|refakat|evde-bakim|bakim|bakım|hasta|ameliyat)/i, scene: "elder", badge: "Bakım desteği", note: "Sakin ve güven veren yaklaşım" },
  { match: /(kahya|ev-yardimcisi|ev yardimcisi)/i, scene: "house", badge: "Ev yönetimi", note: "Düzen ve koordinasyon" },
  { match: /(bebek|dadi|dadı|cocuk|çocuk|oyun|yenidogan|yenidoğan|gece-dadisi|gece dadisi)/i, scene: "care", badge: "Aile odaklı", note: "Güvenli bakım eşleşmesi" },
  { match: /(seyahat|acil|donem|dönem|dil|ikiz|egitimli|eğitimli)/i, scene: "consultation", badge: "Özel eşleştirme", note: "İhtiyaca göre danışmanlık" }
];

function hashSlug(slug: string): number {
  let hash = 7;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function getServiceVisual(slug: string): ServiceVisual {
  const normalized = slug.toLowerCase();
  const explicit = visualBySlug[normalized];
  if (explicit) {
    return {
      ...explicit,
      variant: hashSlug(normalized) % 5
    };
  }

  const matched = sceneByKeyword.find((entry) => entry.match.test(normalized));

  if (!matched) {
    return {
      ...defaultVisual,
      variant: hashSlug(normalized) % 5
    };
  }

  return {
    scene: matched.scene,
    badge: matched.badge,
    note: matched.note,
    variant: hashSlug(normalized) % 5
  };
}
