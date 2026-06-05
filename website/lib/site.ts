export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
};

export type LocationItem = {
  slug: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const services: ServiceItem[] = [
  { slug: "yatili-dadi", title: "Yatılı Dadı", description: "Gece ve gündüz devam eden bakım ihtiyacı için özenli aday seçimi." },
  { slug: "gunduzlu-dadi", title: "Gündüzlü Dadı", description: "Ev düzenine ve çocuk rutinine uyum sağlayan profesyonel gündüz desteği." },
  { slug: "bebek-bakicisi", title: "Bebek Bakıcısı", description: "Bebek bakımında deneyim, referans ve sakin iletişimi birlikte değerlendiririz." },
  { slug: "yenidogan-bakimi", title: "Yenidoğan Bakımı", description: "İlk ayların hassas düzenine uygun, dikkatli ve kontrollü bakım desteği." },
  { slug: "oyun-ablasi", title: "Oyun Ablası", description: "Gelişim odaklı, yaratıcı ve çocuğun yaşına uygun eşlik." },
  { slug: "egitimli-dadi", title: "Eğitimli Dadı", description: "Çocuk gelişimi, eğitim ve iletişim becerisi güçlü aday profilleri." },
  { slug: "yabanci-dil-bilen-dadi", title: "Yabancı Dil Bilen Dadı", description: "Dil gelişimini destekleyen ve aile beklentisine uyumlu adaylar." },
  { slug: "ikiz-cocuk-bakimi", title: "İkiz Çocuk Bakımı", description: "Çoklu çocuk rutinlerinde deneyimli, planlı ve sabırlı destek." },
  { slug: "seyahat-uyumlu-dadi", title: "Seyahat Uyumlu Dadı", description: "Ailenin seyahat düzenine eşlik edebilecek esnek adaylar." },
  { slug: "donemsel-dadi", title: "Dönemsel Dadı", description: "Yazlık, kısa süreli veya geçici ihtiyaçlar için hızlı ön değerlendirme." },
  { slug: "acil-dadi-ihtiyaci", title: "Acil Dadı İhtiyacı", description: "Zaman hassasiyeti yüksek durumlarda kontrollü ve hızlı süreç yönetimi." }
];

export const locations: LocationItem[] = [
  { slug: "istanbul", title: "İstanbul", description: "İstanbul genelinde ailelere özel yerleştirme danışmanlığı." },
  { slug: "ankara", title: "Ankara", description: "Ankara'da güvenilir aday seçimi ve aile görüşme süreci." },
  { slug: "izmir", title: "İzmir", description: "İzmir merkez ve çevresinde aileye özel aday değerlendirmesi." },
  { slug: "antalya", title: "Antalya", description: "Dönemsel veya kalıcı bakım ihtiyaçları için Antalya hizmet ağı." },
  { slug: "besiktas", title: "Beşiktaş", description: "Beşiktaş ve çevresinde profesyonel dadı arayan aileler için." },
  { slug: "kadikoy", title: "Kadıköy", description: "Kadıköy aileleri için gündüzlü ve yatılı aday değerlendirmesi." },
  { slug: "sariyer", title: "Sarıyer", description: "Sarıyer bölgesinde aile düzenine uygun aday desteği." },
  { slug: "uskudar", title: "Üsküdar", description: "Üsküdar ve çevresinde güven odaklı yerleştirme." },
  { slug: "atasehir", title: "Ataşehir", description: "Ataşehir aileleri için danışman eşliğinde aday süreci." },
  { slug: "bakirkoy", title: "Bakırköy", description: "Bakırköy bölgesinde profesyonel çocuk bakımı desteği." },
  { slug: "beylikduzu", title: "Beylikdüzü", description: "Beylikdüzü ve çevresinde aileye özel eşleştirme." },
  { slug: "maslak", title: "Maslak", description: "Maslak bölgesinde yoğun aile düzenlerine uygun adaylar." },
  { slug: "nisantasi", title: "Nişantaşı", description: "Nişantaşı aileleri için güvenilir danışmanlık süreci." },
  { slug: "etiler", title: "Etiler", description: "Etiler ve çevresinde premium yerleştirme danışmanlığı." }
];

export const faqs: FaqItem[] = [
  { question: "Başvuru ne kadar sürer?", answer: "Ortalama 4 ila 6 dakika arasında tamamlanır." },
  { question: "Adayları nasıl değerlendiriyorsunuz?", answer: "Referans, deneyim, iletişim, çalışma geçmişi ve aile uyumu birlikte değerlendirilir." },
  { question: "Başvuru sonrası ne olur?", answer: "Danışman ekibimiz ihtiyacı netleştirir, uygun aday profillerini belirler ve görüşme sürecini planlar." }
];

export const trustStatements = [
  "Referans kontrolü",
  "Aileye özel eşleştirme",
  "Gizlilik ve KVKK",
  "Yerleştirme sonrası takip"
];

export const visualAssets = {
  hero: "/images/site/premium-hero.png",
  familyCare: "/images/site/premium-process.png",
  nurturing: "/images/site/premium-trust.png",
  process: "/images/site/premium-process.png",
  trust: "/images/site/premium-trust.png"
} as const;

export const featureStats = [
  { value: "4-6 dk", label: "Başvuru süresi" },
  { value: "1:1", label: "Danışman takibi" },
  { value: "2 aşama", label: "Ön değerlendirme" },
  { value: "Takip", label: "Yerleştirme sonrası" }
];

export const serviceAngles = [
  {
    title: "İhtiyaç analizi",
    description: "Aile düzeni, çalışma saatleri, çocuk yaşı ve beklenti setini birlikte netleştiriyoruz."
  },
  {
    title: "Referans ve geçmiş",
    description: "Adayın deneyim, referans, belge ve iletişim profilini aynı tabloda inceliyoruz."
  },
  {
    title: "Uyum takibi",
    description: "İlk yerleştirme sonrası kısa kontrollerle sürecin doğru yürüdüğünden emin oluyoruz."
  }
];

export const testimonialCards = [
  {
    quote: "Adaylar sadece CV olarak gelmedi, aile yapımıza uyum açısından da gerçekten süzülerek sunuldu.",
    author: "Kadıköy Ailesi"
  },
  {
    quote: "İlk görüşmeden yerleştirmeye kadar süreç sakin ve kontrollü ilerledi; iletişim çok rahattı.",
    author: "Beşiktaş Ailesi"
  },
  {
    quote: "Aday kodu ve geçmiş takibi, CRM tarafında aradığımız netliği bize sağladı.",
    author: "Operasyon Ekibi"
  }
];

export const homepageSteps = [
  "Başvurunuzu alırız",
  "Danışman görüşmesi yaparız",
  "Uygun aday profilini belirleriz",
  "Görüşmeleri planlarız",
  "Karar ve yerleştirme sürecini destekleriz",
  "Yerleştirme sonrası takip yaparız"
];
