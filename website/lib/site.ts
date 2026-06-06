export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
};

export type ServiceCategory = {
  slug: string;
  title: string;
  icon: string;
  services: ServiceItem[];
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

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "dadi-hizmetleri",
    title: "Dadı Hizmetleri",
    icon: "👶",
    services: [
      { slug: "yatili-dadi", title: "Yatılı Dadı", description: "Gece ve gündüz devam eden bakım ihtiyacı için özenli aday seçimi.", category: "dadi-hizmetleri" },
      { slug: "gunduzlu-dadi", title: "Gündüzlü Dadı", description: "Ev düzenine ve çocuk rutinine uyum sağlayan profesyonel gündüz desteği.", category: "dadi-hizmetleri" },
      { slug: "bebek-bakicisi", title: "Bebek Bakıcısı", description: "Bebek bakımında deneyim, referans ve sakin iletişimi birlikte değerlendiririz.", category: "dadi-hizmetleri" },
      { slug: "cocuk-bakicisi", title: "Çocuk Bakıcısı", description: "Okul çağındaki çocuklar için güvenilir, eğitimle desteklenen bakım.", category: "dadi-hizmetleri" },
      { slug: "oyun-ablasi", title: "Oyun Ablası", description: "Gelişim odaklı, yaratıcı ve çocuğun yaşına uygun eşlik.", category: "dadi-hizmetleri" },
      { slug: "gece-dadisi", title: "Gece Dadısı", description: "Gece uyku düzeni ve yenidoğan bakımı için özel gece desteği.", category: "dadi-hizmetleri" },
      { slug: "yabanci-dil-bilen-dadi", title: "Yabancı Dil Bilen Dadı", description: "Dil gelişimini destekleyen ve aile beklentisine uyumlu adaylar.", category: "dadi-hizmetleri" },
    ]
  },
  {
    slug: "yasli-bakim",
    title: "Yaşlı Bakım Hizmetleri",
    icon: "🤝",
    services: [
      { slug: "refakatci", title: "Refakatçi", description: "Yaşlı bireylere sosyal destek, hastalık ve doktor süreçlerinde eşlik.", category: "yasli-bakim" },
      { slug: "yasli-bakicisi", title: "Yaşlı Bakıcısı", description: "Evde yaşayan yaşlılar için günlük bakım, ilaç takibi ve destek.", category: "yasli-bakim" },
      { slug: "evde-bakim", title: "Evde Bakım", description: "Uzun dönemli veya geçici evde bakım ihtiyaçları için deneyimli personel.", category: "yasli-bakim" },
    ]
  },
  {
    slug: "hasta-bakim",
    title: "Hasta Bakım Hizmetleri",
    icon: "🏥",
    services: [
      { slug: "hasta-bakicisi", title: "Hasta Bakıcısı", description: "Kronik hastalık veya iyileşme sürecindeki bireylere profesyonel bakım.", category: "hasta-bakim" },
      { slug: "ameliyat-sonrasi-destek", title: "Ameliyat Sonrası Destek", description: "Operasyon sonrası taburculuk döneminde kapsamlı evde bakım.", category: "hasta-bakim" },
    ]
  },
  {
    slug: "temizlik",
    title: "Temizlik Hizmetleri",
    icon: "✨",
    services: [
      { slug: "gunluk-temizlik", title: "Günlük Temizlik", description: "Düzenli aralıklarla yapılan kapsamlı ev temizlik hizmeti.", category: "temizlik" },
      { slug: "haftalik-temizlik", title: "Haftalık Temizlik", description: "Haftalık periyotta derin temizlik ve düzenleme.", category: "temizlik" },
      { slug: "ofis-temizligi", title: "Ofis Temizliği", description: "Profesyonel ofis ve iş yeri temizlik hizmeti.", category: "temizlik" },
      { slug: "villa-temizligi", title: "Villa Temizliği", description: "Büyük konutlar için ekip ile kapsamlı temizlik.", category: "temizlik" },
    ]
  },
  {
    slug: "sofor-hizmetleri",
    title: "Şoför Hizmetleri",
    icon: "🚗",
    services: [
      { slug: "aile-soforu", title: "Aile Şoförü", description: "Çocuk servisi, alışveriş ve günlük aile seyahatleri için güvenilir şoför.", category: "sofor-hizmetleri" },
      { slug: "ozel-sofor", title: "Özel Şoför", description: "Bireysel kullanım için tam zamanlı veya yarı zamanlı özel şoför.", category: "sofor-hizmetleri" },
      { slug: "makam-soforu", title: "Makam Şoförü", description: "Kurumsal ve protokol gerektiren transferler için tecrübeli şoför.", category: "sofor-hizmetleri" },
    ]
  },
  {
    slug: "ev-yardimcilari",
    title: "Ev Yardımcıları",
    icon: "🏠",
    services: [
      { slug: "ev-yardimcisi", title: "Ev Yardımcısı", description: "Genel ev işleri ve destek için güvenilir, referanslı yardımcı.", category: "ev-yardimcilari" },
      { slug: "asci", title: "Aşçı", description: "Ev yemekleri ve özel günler için profesyonel aşçı hizmeti.", category: "ev-yardimcilari" },
      { slug: "kahya", title: "Kahya", description: "Büyük haneler ve konutlar için tam kapsamlı ev yönetimi.", category: "ev-yardimcilari" },
      { slug: "camasirci", title: "Çamaşırcı", description: "Çamaşır yıkama, ütü ve giysi bakımı için uzman destek.", category: "ev-yardimcilari" },
    ]
  }
];

export const services: ServiceItem[] = serviceCategories.flatMap(c => c.services);

export const locations: LocationItem[] = [
  { slug: "istanbul", title: "İstanbul", description: "İstanbul genelinde ev hizmetleri personeli yerleştirme danışmanlığı." },
  { slug: "ankara", title: "Ankara", description: "Ankara'da güvenilir personel seçimi ve aile görüşme süreci." },
  { slug: "izmir", title: "İzmir", description: "İzmir merkez ve çevresinde aileye özel personel değerlendirmesi." },
  { slug: "antalya", title: "Antalya", description: "Dönemsel veya kalıcı hizmet ihtiyaçları için Antalya hizmet ağı." },
  { slug: "bursa", title: "Bursa", description: "Bursa'da ailelerin ihtiyacına göre özenle seçilmiş personel profilleri." },
  { slug: "gaziantep", title: "Gaziantep", description: "Gaziantep'te güvenilir ev hizmetleri personeli danışmanlığı." },
  { slug: "konya", title: "Konya", description: "Konya'da aile yapısına uygun personel değerlendirmesi." },
  { slug: "adana", title: "Adana", description: "Adana'da profesyonel ev hizmetleri danışmanlığı ve eşleştirmesi." },
  { slug: "mersin", title: "Mersin", description: "Mersin'de ailelere özel güvenilir yerleştirme danışmanlığı." },
  { slug: "kayseri", title: "Kayseri", description: "Kayseri'de referanslı ve deneyimli personel değerlendirmesi." },
  { slug: "eskisehir", title: "Eskişehir", description: "Eskişehir'de ev hizmetleri ihtiyacına özel profesyonel süreç." },
  { slug: "trabzon", title: "Trabzon", description: "Trabzon'da güvenilir ve referanslı personel yerleştirme danışmanlığı." },
  { slug: "samsun", title: "Samsun", description: "Samsun'da aile odaklı profesyonel danışmanlık hizmeti." },
  { slug: "bodrum", title: "Bodrum", description: "Bodrum'da tatil ve yıl boyu kalıcı bakım ihtiyaçlarına yönelik çözümler." }
];

export const faqs: FaqItem[] = [
  // GENEL
  { question: "Başvuru ne kadar sürer?", answer: "Ortalama 4 ila 6 dakika arasında tamamlanır. Danışmanımız başvurunuzu inceleyerek en kısa sürede sizinle iletişime geçer." },
  { question: "Hangi hizmetleri veriyorsunuz?", answer: "Dadı, bebek bakıcısı, çocuk bakıcısı, yaşlı bakıcısı, hasta bakıcısı, ev yardımcısı, aşçı, kahya, şoför ve temizlik hizmetleri sunuyoruz. Tüm kategorilerde referanslı ve doğrulanmış personel eşleştirmesi yapıyoruz." },
  { question: "Hizmet Türkiye genelinde mi?", answer: "Evet. İstanbul, Ankara, İzmir, Antalya ve Türkiye'nin tüm büyük şehirlerinde hizmet veriyoruz. Bulunduğunuz şehri başvuru sırasında belirtin." },
  { question: "İlk görüşme ücretli mi?", answer: "Hayır. İlk danışmanlık görüşmesi tamamen ücretsizdir. Hizmet bedeli yalnızca başarılı bir yerleştirme gerçekleştiğinde geçerlidir." },
  { question: "Ne kadar sürede personel bulabilirim?", answer: "İhtiyacınıza ve şehrinize göre genellikle birkaç iş günü içinde uygun aday profilleri sunulur. Acil ihtiyaçlar için öncelikli süreç başlatılabilir." },

  // GÜVENLİK
  { question: "Personeli nasıl değerlendiriyorsunuz?", answer: "Kimlik doğrulama, referans kontrolü, adli sicil araştırması, deneyim teyidi ve mülakat sürecinden geçen personel ailenizle buluşur. Hiçbir aday bu aşamalar tamamlanmadan önerilmez." },
  { question: "Adli sicil kontrolü yapılıyor mu?", answer: "Evet. Tüm personelden adli sicil belgesi talep edilmekte ve değerlendirme sürecinde dikkate alınmaktadır." },
  { question: "Referans kontrolü nasıl yapılıyor?", answer: "Adayın önceki işverenlerinin iletişim bilgileri alınır, telefon veya yazılı olarak referans teyidi yapılır. Referansı doğrulanamayan adaylar önerilmez." },
  { question: "Kimlik doğrulama yapılıyor mu?", answer: "Evet. Tüm adayların kimlik belgeleri incelenir, nüfus cüzdanı veya pasaport kopyası alınır." },
  { question: "Personel hakkında şikayetim olursa ne yapmalıyım?", answer: "Danışmanınızı arayın veya iletisim@dadikapida.com adresine yazın. Şikayetler 24 saat içinde değerlendirmeye alınır." },

  // SİGORTA & YASAL
  { question: "Sigortalı personel sağlıyor musunuz?", answer: "Evet. Türkiye iş kanunu kapsamında personelin SGK kaydının yapılmasını öneriyor ve bu konuda bilgilendirme yapıyoruz. Resmi istihdam her iki taraf için güvence sağlar." },
  { question: "Personel değişikliği yapılıyor mu?", answer: "Evet. Yerleştirme sonrası uyumsuzluk durumunda alternatif personel sürecini yeniden başlatırız. Yerleştirme sonrası takip hizmetimizin bir parçasıdır." },
  { question: "Deneme süreci var mı?", answer: "Evet. Bazı hizmet türlerinde deneme süreci planlanabilir. Detaylar için danışmanınızla görüşün." },
  { question: "Sözleşme yapılıyor mu?", answer: "Yazılı iş sözleşmesi hazırlanması şiddetle önerilir. Danışmanlarımız standart sözleşme konusunda rehberlik eder; ancak sözleşme hazırlamak hukuki danışmanlık hizmeti kapsamında değerlendirilemez." },
  { question: "Ev hizmetleri personeli için SGK zorunlu mu?", answer: "Evet. Aylık 10 günden fazla çalışan ev hizmetleri personeli için SGK kaydı zorunludur. 10 gün ve altında çalışanlar için prim yapısı farklılaşır." },

  // DADI & BEBEK
  { question: "Dadı ücretleri ne kadar?", answer: "Dadı maaşları deneyim, çalışma saatleri (gündüzlü/yatılı), görev kapsamı ve şehre göre değişir. Danışmanımız ihtiyaç analizi sonrası güncel aralık bilgisini paylaşır." },
  { question: "Yatılı dadı ile gündüzlü dadı arasındaki fark nedir?", answer: "Yatılı dadı ev içinde ikamet ederek gece dahil tam kapsamlı bakım sağlar. Gündüzlü dadı belirli saatlerde hizmet verip evine döner. Yatılı çalışmada barınma da sağlandığından ücret yapısı farklılaşır." },
  { question: "Yenidoğan bakımı için dadı tutulur mu?", answer: "Evet. Gece bakımı, emzirme/biberon rutini ve yenidoğan dönemine özel deneyimli adaylarımız mevcuttur. Gece dadısı olarak da çalıştırılabilir." },
  { question: "Yabancı dil bilen dadı bulabilir misiniz?", answer: "Evet. İngilizce başta olmak üzere yabancı dil bilen adaylarımız mevcuttur. Dil bilgisi teyidi aday değerlendirme sürecine dahildir." },
  { question: "Çocuğum dadıyı beğenmezse ne olur?", answer: "Deneme sürecinde uyumsuzluk yaşanırsa yeni aday sürecini başlatırız. Çocuğun uyumu bizim için de önceliklidir." },

  // YAŞLI & HASTA BAKIM
  { question: "Yaşlı bakıcısı ücretleri ne kadar?", answer: "Yaşlı bakım hizmetleri; bakım yoğunluğu, yatılı/gündüzlü çalışma düzeni ve lokasyona göre fiyatlanır. Ücretsiz görüşmede net bilgi alabilirsiniz." },
  { question: "Hasta bakıcısı ile refakatçi arasındaki fark nedir?", answer: "Refakatçi sosyal destek, doktor eşliği ve günlük aktivitelere yardım sağlar; tıbbi müdahale yapmaz. Hasta bakıcısı ise kronik hastalık veya iyileşme sürecindeki kişilere kapsamlı bakım sunar." },
  { question: "Ameliyat sonrası bakım için personel bulabilir misiniz?", answer: "Evet. Taburculuk sonrası iyileşme döneminde evde bakım için deneyimli adaylarımız mevcuttur. İhtiyacın başlangıç tarihini bildirmeniz yeterlidir." },
  { question: "Hasta bakıcısı tıbbi müdahale yapabilir mi?", answer: "Hasta bakıcıları tıbbi prosedürler uygulayamaz. İlaç takibi, pozisyon değiştirme ve günlük bakım konularında destek sağlarlar. Tıbbi müdahale gerektiren durumlar için sağlık profesyonelleriyle çalışılmalıdır." },

  // TEMİZLİK
  { question: "Temizlikçi ücretleri ne kadar?", answer: "Temizlik hizmeti fiyatları evin büyüklüğü, temizlik sıklığı ve hizmet kapsamına göre belirlenir. Günlük, haftalık veya periyodik temizlik seçenekleri mevcuttur." },
  { question: "Ofis temizliği de yapılıyor mu?", answer: "Evet. Küçük ofislerden büyük iş yerlerine, villa temizliğinden düzenli ofis temizliğine kadar farklı seçenekler mevcuttur." },
  { question: "Temizlik malzemeleri kim sağlıyor?", answer: "Bu detay işe başlamadan önce aile ve personel arasında netleştirilir. Genellikle aile sağlar; ancak farklı anlaşmalar da mümkündür." },
  { question: "Haftalık düzenli temizlik için sözleşme yapılabilir mi?", answer: "Evet. Periyodik temizlik için düzenli çalışma programı oluşturulabilir. Danışmanınız sizi doğru adaya yönlendirir." },

  // ŞOFÖR
  { question: "Şoför nasıl seçilir?", answer: "Şoför adayları ehliyet sicili, deneyim ve referans kontrolünden geçirilir. Makam şoförü için ek güvenlik araştırması yapılabilir." },
  { question: "Aile şoförü çocuk servisi yapabilir mi?", answer: "Evet. Okul servisi, aktivite transferleri ve aile seyahatleri için uygun adaylarımız mevcuttur. Çocuklarla deneyim ayrıca değerlendirilir." },
  { question: "Makam şoförü için özel nitelik aranıyor mu?", answer: "Evet. Temsil yeteneği, gizlilik anlayışı ve protokol bilgisi özellikle önem taşır. Bazı pozisyonlarda ek güvenlik araştırması talep edilebilir." },

  // EV YARDIMCILARI
  { question: "Ev yardımcısı ile kahya arasındaki fark nedir?", answer: "Ev yardımcısı günlük ev işlerini üstlenirken, kahya büyük hanelerin tüm yönetimini koordine eder; personel planlaması, stok takibi ve temsil görevleri de üstlenebilir." },
  { question: "Aşçı günlük kaç öğün yapıyor?", answer: "Bu personel ile işe başlamadan önce netleştirilir. Sabah kahvaltısından üç öğüne, özel günler için yapılan özel menülere kadar farklı düzenlemeler mümkündür." },
  { question: "Çamaşırcı ütü de yapıyor mu?", answer: "Genellikle evet, çamaşır yıkama ve ütüleme birlikte yürütülür. Görev kapsamı işe başlamadan yazılı olarak netleştirilmelidir." },
  { question: "Birden fazla hizmet türünü tek personel yapabilir mi?", answer: "Bazı adaylar birden fazla görevi üstlenebilir (örn. ev yardımcısı + çamaşırcı). Ancak fazla sorumluluk ücret ve iş yükü dengesini bozabilir; danışmanınızla değerlendirilmesi önerilir." },

  // SÜREÇ
  { question: "Başvuru sonrası ne olur?", answer: "Danışman ekibimiz ihtiyacınızı sizinle birlikte netleştirir, uygun aday profillerini belirler ve görüşme sürecini planlar. Süreç boyunca yanınızdayız." },
  { question: "Aday profilleri nasıl paylaşılıyor?", answer: "Uygun adayların profilleri (deneyim, referans özeti, çalışma beklentileri) danışmanınız aracılığıyla sizinle paylaşılır. Beğendiğiniz adayla tanışma görüşmesi planlanır." },
  { question: "Görüşme sürecinde danışman eşlik ediyor mu?", answer: "İstek halinde danışmanınız görüşmeye eşlik edebilir veya görüşme öncesinde sizi hazırlık konusunda yönlendirebilir." },
  { question: "Yerleştirme sonrası destek var mı?", answer: "Evet. İlk haftalarda uyum sürecini takip eder, sorun yaşanırsa müdahale ederiz. Uzun vadeli çalışma ilişkisi kurmak bizim önceliğimizdir." },
  { question: "Acil personel ihtiyacı için ne yapmalıyım?", answer: "Bizi arayın veya WhatsApp üzerinden mesaj gönderin. Acil talepler öncelikli sürece alınır; mevcut aday havuzuna göre hızlı yanıt verilir." },

  // FİYATLANDIRMA
  { question: "Hizmet bedeli ne zaman ödeniyor?", answer: "Hizmet bedeli yalnızca başarılı bir yerleştirme gerçekleştiğinde ödenir. İlk görüşme ve danışmanlık süreci ücretsizdir." },
  { question: "Fatura kesilliyor mu?", answer: "Evet. Tüm ödemeler için resmi fatura düzenlenmektedir." },
  { question: "Ödeme yöntemleri nelerdir?", answer: "Banka havalesi ve kredi kartı ile ödeme kabul edilmektedir. Detaylar için danışmanınızla görüşün." },

  // GİZLİLİK
  { question: "Kişisel bilgilerim güvende mi?", answer: "Evet. Tüm kişisel veriler KVKK kapsamında işlenir ve korunur. Aile ve personel bilgileri yalnızca eşleştirme sürecinde ve karşılıklı onay dahilinde paylaşılır." },
  { question: "Çocuğumun fotoğrafı paylaşılıyor mu?", answer: "Hayır. Aile bireylerinin kişisel bilgileri ve fotoğrafları hiçbir koşulda üçüncü taraflarla paylaşılmaz." }
];

export const trustStatements = [
  "Kimlik ve Belge Kontrolü",
  "Adli Sicil Araştırması",
  "Referans Doğrulama",
  "Mülakat ve Uyum Analizi",
  "KVKK Uyumlu Süreç",
  "Yerleştirme Sonrası Takip"
];

export const visualAssets = {
  hero: "/images/site/premium-hero.png",
  familyCare: "/images/site/premium-process.png",
  nurturing: "/images/site/premium-trust.png",
  process: "/images/site/premium-process.png",
  trust: "/images/site/premium-trust.png"
} as const;

export const featureStats = [
  { value: "6 Kategori", label: "Hizmet alanı" },
  { value: "1:1", label: "Danışman takibi" },
  { value: "Ücretsiz", label: "İlk görüşme" },
  { value: "Takip", label: "Yerleştirme sonrası" }
];

export const serviceAngles = [
  {
    title: "İhtiyaç analizi",
    description: "Hizmet türü, çalışma düzeni, beklenti ve bütçe doğrultusunda kişiselleştirilmiş değerlendirme."
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
    author: "Leyla A. — Kadıköy"
  },
  {
    quote: "İlk görüşmeden yerleştirmeye kadar süreç sakin ve kontrollü ilerledi; iletişim çok rahattı.",
    author: "Selin K. — Beşiktaş"
  },
  {
    quote: "Danışmanımız hem bizi hem de adayı çok iyi tanıdı. İlk görüşmede doğru eşleşmeyi bulduk.",
    author: "Ayşe M. — Ankara"
  }
];

export const homepageSteps = [
  "Başvurunuzu alırız",
  "Danışman görüşmesi yaparız",
  "Uygun personel profilini belirleriz",
  "Görüşmeleri planlarız",
  "Karar ve yerleştirme sürecini destekleriz",
  "Yerleştirme sonrası takip yaparız"
];
