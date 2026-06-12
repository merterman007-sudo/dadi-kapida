import { faqs as siteFaqs, homepageSteps, locations as siteLocations, services as siteServices, trustStatements } from "./site";

export const home = {
  eyebrow: "Dadı Kapıda | Profesyonel Dadı Yerleştirme Danışmanlığı",
  title: "Aileniz için güvenilir, referanslı ve ihtiyaçlarınıza uygun dadıyı birlikte bulalım.",
  subtitle:
    "Yatılı veya gündüzlü dadı ihtiyacınızda; deneyim, referans, çalışma düzeni, çocuk bakım beklentisi ve aile dinamiğinize göre adayları değerlendiriyor, süreci danışman eşliğinde yönetiyoruz.",
  ctas: {
    primary: { href: "/aile-basvurusu", label: "Aile Başvurusu Yap" },
    secondary: { href: "/personel-basvurusu", label: "Personel Başvurusu Yap" },
    tertiary: { href: "/iletisim", label: "Önce danışmanla görüşmek istiyorum" }
  }
};

export const quickNeeds = [
  "Yatılı Dadı",
  "Gündüzlü Dadı",
  "Bebek Bakıcısı",
  "Oyun Ablası",
  "Yabancı Dil Bilen Dadı",
  "Henüz emin değilim"
];

export const differenceCards = [
  "Detaylı ihtiyaç analizi",
  "Referans ve deneyim değerlendirmesi",
  "Aileye özel aday önerisi",
  "Görüşme ve karar süreci desteği",
  "Yerleştirme sonrası takip",
  "Gizlilik odaklı çalışma"
];

export const securityCards = [
  "Kimlik ve belge inceleme",
  "Referans bilgisi toplama",
  "Deneyim ve çalışma geçmişi",
  "Mülakat ve iletişim değerlendirmesi",
  "Aile beklentisiyle uyum analizi",
  "Gizlilik ve veri güvenliği"
];

export const footerPages = [
  { href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/basvuru-sartlari", label: "Başvuru Şartları" }
];

export const genericPageData = {
  "aileler-icin": {
    title: "Aileler için",
    subtitle: "Aileler için güven, açıklık ve düzenli danışmanlık."
  },
  "aileler-icin/nasil-calisir": {
    title: "Aileler için süreç nasıl çalışır?",
    subtitle: "Başvurudan yerleştirme sonrası takibe kadar her adım danışman eşliğinde ilerler."
  },
  "aileler-icin/ihtiyac-analizi": {
    title: "İhtiyaç Analizi",
    subtitle: "Ailenizin çalışma düzeni, çocuk bakım beklentisi ve önceliklerini birlikte netleştiririz."
  },
  "aileler-icin/aday-secim-sureci": {
    title: "Aday Seçim Süreci",
    subtitle: "Deneyim, referans, iletişim ve aile uyumu birlikte değerlendirilir."
  },
  "aileler-icin/yerlestirme-sonrasi-takip": {
    title: "Yerleştirme Sonrası Takip",
    subtitle: "İlk dönem uyumunu ve iletişimi düzenli kontrollerle destekleriz."
  },
  "aileler-icin/sik-sorulan-sorular": {
    title: "Aileler için Sık Sorulan Sorular",
    subtitle: "Başvuru, görüşme ve yerleştirme sürecine dair pratik yanıtlar."
  },
  "aileler-icin/guvenlik-ve-dogrulama": {
    title: "Güvenlik ve Doğrulama",
    subtitle: "Aday değerlendirmesinde kimlik, belge, referans ve iletişim kontrolleri önemlidir."
  },
  "dadilar-icin": {
    title: "Personel için",
    subtitle: "Profesyonel personel adayları için saygılı, şeffaf ve düzenli başvuru süreci."
  },
  "dadilar-icin/basvuru-sureci": {
    title: "Personel Başvuru Süreci",
    subtitle: "Başvuru, ön değerlendirme, referans ve uygun aile eşleşmesi adımlarını açıkça yönetiriz."
  },
  "dadilar-icin/aranan-nitelikler": {
    title: "Aranan Nitelikler",
    subtitle: "Deneyim, referans, iletişim, güvenilirlik ve görev uyumu birlikte değerlendirilir."
  },
  "dadilar-icin/profesyonel-dadi-rehberi": {
    title: "Profesyonel Personel Rehberi",
    subtitle: "Ailelerle uzun vadeli ve sağlıklı çalışma ilişkileri kurmak isteyen adaylar için rehber."
  },
  "dadilar-icin/sik-sorulan-sorular": {
    title: "Personel için Sık Sorulan Sorular",
    subtitle: "Başvuru, değerlendirme ve aile görüşmeleri hakkında merak edilenler."
  },
  "dadilar-icin/acik-pozisyonlar": {
    title: "Açık Pozisyonlar",
    subtitle: "Uygun aday profilleri için danışman ekibimizin değerlendirdiği çalışma fırsatları."
  },
  "hizmetlerimiz": {
    title: "Hizmetlerimiz",
    subtitle: "Ailenizin ihtiyacına göre profesyonel personel çözümleri."
  },
  "hizmet-bolgeleri": {
    title: "Türkiye Geneli Hizmet",
    subtitle: "81 ilde dadı, bakıcı, temizlik, şoför ve ev yardımcısı ihtiyaçları için danışmanlık."
  },
  hakkimizda: {
    title: "Hakkımızda",
    subtitle: "Aileler için güven veren, şeffaf ve profesyonel ev hizmetleri danışmanlığı."
  },
  ekibimiz: {
    title: "Ekibimiz",
    subtitle: "Süreçleri danışman, operasyon ve kalite ekibi birlikte yürütür."
  },
  "neden-dadi-kapida": {
    title: "Neden Dadı Kapıda?",
    subtitle: "Doğru aday, doğru süreç ve uzun vadeli güven."
  },
  "guvenlik-ve-dogrulama": {
    title: "Güvenlik ve Doğrulama",
    subtitle: "Kimlik, adli sicil, referans kontrolü ve mülakat — her aday için eksiksiz uygularız."
  },
  "sik-sorulan-sorular": {
    title: "Sık Sorulan Sorular",
    subtitle: "Dadı, bakıcı, temizlikçi, şoför ve ev yardımcısı hizmetleri hakkında merak edilen her şey."
  },
  "sorumluluk-ve-degerlerimiz": {
    title: "Sorumluluk ve Değerlerimiz",
    subtitle: "Gizlilik, özen ve aile odaklı hizmet anlayışı."
  },
  referanslar: {
    title: "Referanslar",
    subtitle: "Ailelerin deneyimleri ve geri bildirimleri."
  },
  "basari-hikayeleri": {
    title: "Başarı Hikayeleri",
    subtitle: "Uyumlu yerleştirme örnekleri ve sonuçlar."
  },
  "basinda-biz": {
    title: "Basında Biz",
    subtitle: "Marka görünürlüğü ve basın yansımaları."
  },
  "is-ortaklari": {
    title: "İş Ortakları",
    subtitle: "Güvenilir iş birlikleri ve ağ yapısı."
  },
  "istanbul-dadi": {
    title: "İstanbul Dadı",
    subtitle: "İstanbul genelinde aile ihtiyaçlarına göre profesyonel dadı danışmanlığı."
  },
  "ankara-dadi": {
    title: "Ankara Dadı",
    subtitle: "Ankara’da güvenilir dadı arayan aileler için danışmanlık süreci."
  },
  "izmir-dadi": {
    title: "İzmir Dadı",
    subtitle: "İzmir merkez ve çevresinde aileye özel aday değerlendirmesi."
  },
  "antalya-dadi": {
    title: "Antalya Dadı",
    subtitle: "Antalya’da dönemsel veya kalıcı bakım ihtiyaçları için destek."
  },
  rehberler: {
    title: "Rehberler",
    subtitle: "Dadı seçimi, çalışma düzeni ve aileler için bakım süreci rehberleri."
  },
  "rehberler/dadi-secme-rehberi": {
    title: "Dadı Seçme Rehberi",
    subtitle: "Doğru adayı seçerken dikkat edilmesi gereken temel başlıklar."
  },
  "rehberler/yatili-dadi-rehberi": {
    title: "Yatılı Dadı Rehberi",
    subtitle: "Yatılı çalışma modelinde beklenti, sınır ve düzen oluşturma rehberi."
  },
  "rehberler/gunduzlu-dadi-rehberi": {
    title: "Gündüzlü Dadı Rehberi",
    subtitle: "Gündüzlü çalışma düzeninde saat, görev ve iletişim planı."
  },
  "rehberler/bebek-bakicisi-secme-rehberi": {
    title: "Bebek Bakıcısı Seçme Rehberi",
    subtitle: "Bebek bakımında deneyim, rutin ve güven kriterleri."
  },
  "rehberler/dadi-maaslari": {
    title: "Dadı Maaşları",
    subtitle: "Çalışma modeli, deneyim ve beklentiye göre bütçe değerlendirmesi."
  },
  "rehberler/evde-bakici-sigorta-rehberi": {
    title: "Evde Bakıcı Sigorta Rehberi",
    subtitle: "Evde bakım hizmetlerinde sigorta sürecine ilişkin temel bilgiler."
  },
  "iletisim": {
    title: "İletişim",
    subtitle: "Kısa görüşme, geri aranma ve destek talepleri için bize ulaşın."
  },
  "geri-aranma-talebi": {
    title: "Geri Aranma Talebi",
    subtitle: "Danışman ekibimizin sizi uygun zamanda araması için kısa talep bırakın."
  },
  "online-gorusme-talebi": {
    title: "Online Görüşme Talebi",
    subtitle: "Aile ihtiyacınızı netleştirmek için online danışman görüşmesi talep edin."
  },
  "randevu": {
    title: "Randevu",
    subtitle: "Danışman görüşmesi planlamak için uygun bir zaman seçin."
  },
  "aile-destek": {
    title: "Aile Destek",
    subtitle: "Başvuru sonrası süreçte ailelere özel destek."
  },
  "aday-destek": {
    title: "Aday Destek",
    subtitle: "Dadı adaylarının başvuru ve değerlendirme sürecinde destek."
  },
  "sikayet-ve-oneri": {
    title: "Şikayet ve Öneri",
    subtitle: "Geri bildirimlerinizi bize iletebilirsiniz."
  },
  "kvkk-aydinlatma-metni": {
    title: "KVKK Aydınlatma Metni",
    subtitle: "Kişisel verilerinizin işlenmesi, korunması ve haklarınıza ilişkin bilgilendirme."
  },
  "gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    subtitle: "Kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi."
  },
  "cerez-politikasi": {
    title: "Çerez Politikası",
    subtitle: "Web sitemizde kullanılan çerezler ve tercihlerinizi yönetme seçenekleri."
  },
  "acik-riza-metni": {
    title: "Açık Rıza Metni",
    subtitle: "Kişisel verilerin işlenmesine ilişkin açık rıza ve tercihlerinize dair bilgilendirme."
  },
  "kullanim-sartlari": {
    title: "Kullanım Şartları",
    subtitle: "Web sitemizin ve hizmetlerimizin kullanımına ilişkin temel şartlar."
  },
  "basvuru-sartlari": {
    title: "Başvuru Şartları",
    subtitle: "Aile ve personel başvurularının değerlendirilmesine ilişkin koşullar."
  },
  "aday-aydinlatma-metni": {
    title: "Aday Aydınlatma Metni",
    subtitle: "Personel adaylarının kişisel verilerinin işlenmesine ilişkin bilgilendirme."
  },
  "aile-aydinlatma-metni": {
    title: "Aile Aydınlatma Metni",
    subtitle: "Aile başvurularında kişisel verilerin işlenmesine ilişkin bilgilendirme."
  },
  "veri-sahibi-basvuru-formu": {
    title: "Veri Sahibi Başvuru Formu",
    subtitle: "Kişisel verilerinize ilişkin taleplerinizi bize iletebileceğiniz başvuru kanalları."
  },
  "yasal-bilgilendirme": {
    title: "Yasal Bilgilendirme",
    subtitle: "Dadı Kapıda hizmetleri ve web sitesi kullanımına ilişkin yasal bilgiler."
  }
} as const;

export const services = siteServices;
export const locations = siteLocations;
export const faqs = siteFaqs;

export const servicesPreview = services.slice(0, 8);
export const locationsPreview = locations;
export const faqPreview = faqs;
export const trustPreview = trustStatements;
export const processPreview = homepageSteps;
