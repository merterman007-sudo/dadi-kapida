export type ServiceContent = {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  whoIsItFor: string[];
  whatWeEvaluate: string[];
  candidateQualities: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const servicesContent: ServiceContent[] = [
  {
    slug: "yatili-dadi",
    title: "Yatılı Dadı",
    tagline: "Gece ve gündüz devamlı bakım için özenli aday seçimi",
    shortDescription: "Evinizde ikamet ederek tam zamanlı çocuk bakımı ve destek sağlayan profesyonel yatılı dadı hizmetleri.",
    longDescription: "Yatılı dadı modeli; her iki ebeveynin yoğun çalışma temposuna sahip olduğu, gece bakımına ihtiyaç duyulan ya da seyahat yoğunluğunun yüksek olduğu aileler için tasarlanmıştır. Aday değerlendirmemiz; referans kontrolü, belge doğrulama, kişilik uyumu ve aile dinamiği analizi adımlarını kapsar. Yerleştirme sonrası takip hizmetimiz ilk uyum dönemini destekler.",
    whoIsItFor: [
      "Her iki ebeveynin tam zamanlı çalıştığı aileler",
      "Gece bakımına ihtiyaç duyan yenidoğan aileleri",
      "Seyahat yoğunluğu yüksek ebeveynler",
      "Birden fazla çocuğu olan aileler",
      "Uzun mesai gerektiren mesleklerde çalışanlar"
    ],
    whatWeEvaluate: [
      "Referans kişi görüşmeleri ve geçmiş aile deneyimleri",
      "Kimlik ve belge doğrulaması",
      "Yatılı çalışma deneyimi ve uyum kapasitesi",
      "İletişim tarzı ve problem çözme becerileri",
      "Çocuk yaş grubuna özgü bakım yetkinliği",
      "Aile değerleri ve yaşam tarzıyla uyum"
    ],
    candidateQualities: [
      "En az 2 yıl yatılı ev deneyimi",
      "Doğrulanabilir referanslar",
      "Sabırlı ve güvenilir iletişim tarzı",
      "Ev sınırlarına saygılı yaklaşım",
      "Fiziksel ve duygusal dayanıklılık"
    ],
    faqs: [
      {
        question: "Yatılı dadı için ev içinde ne tür alan gerekir?",
        answer: "Adayın kendi odası ve banyosu olması ya da özel yaşam alanı sağlanması önerilir. Bu durum uzun vadeli uyumu ve iş sürekliliğini önemli ölçüde destekler."
      },
      {
        question: "Yatılı dadının yasal hakları nelerdir?",
        answer: "Yatılı dadı yasal bir istihdam ilişkisi gerektirir. Sigorta, ücret, fazla mesai ve izin hakları yazılı sözleşmeyle belirlenmelidir. Danışmanlarımız bu konuda yönlendirme sağlar."
      },
      {
        question: "Yerleştirme süreci ne kadar sürer?",
        answer: "İhtiyaç analizi, aday değerlendirmesi ve görüşme sürecini kapsayan ortalama süre 1–3 haftadır. Bu süre aile beklentileri ve aday havuzuna göre değişebilir."
      }
    ]
  },
  {
    slug: "gunduzlu-dadi",
    title: "Gündüzlü Dadı",
    tagline: "Ev düzeninizi koruyan, çocuk rutinine uyumlu profesyonel destek",
    shortDescription: "Belirli saatler arasında evinizde çalışan, çocuğunuzun gündüz bakımını üstlenen profesyonel gündüzlü dadı hizmeti.",
    longDescription: "Gündüzlü çalışma modeli; ebeveynlerin iş saatlerinde çocuklarının güvenli ve düzenli bakımını sağlarken aile özel alanını korumasına olanak tanır. Aday seçimimizde çocuk yaşına uygun bakım deneyimi, rutine uyum kapasitesi ve aile iletişim tarzını ön planda tutarız.",
    whoIsItFor: [
      "Çalışma saatleri düzenli olan ebeveynler",
      "Okul öncesi ya da okul çağı çocuğu olan aileler",
      "Ev özel alanını korumak isteyen aileler",
      "Part-time veya esnek bakım ihtiyacı olan aileler"
    ],
    whatWeEvaluate: [
      "Gündüzlü çalışma deneyimi ve sürekliliği",
      "Çocuk yaş grubuna özgü aktivite ve gelişim bilgisi",
      "Zaman yönetimi ve güvenilirlik",
      "Aile ile açık iletişim kurabilme kapasitesi",
      "Ev sınırlarına saygı ve profesyonel tutum"
    ],
    candidateQualities: [
      "Deneyimli çocuk bakımı geçmişi",
      "Doğrulanabilir referanslar",
      "Dakiklik ve güvenilirlik",
      "Çocukla sağlıklı sınır kurabilen tutum",
      "Aile iletişimine açık ve şeffaf yaklaşım"
    ],
    faqs: [
      {
        question: "Gündüzlü dadı hangi saatler arasında çalışır?",
        answer: "Çalışma saatleri ailenin ihtiyacına göre belirlenir. Genellikle 08:00–18:00 aralığı tercih edilmekle birlikte yarım gün, okul sonrası ya da özel saatlerle de düzenlenebilir."
      },
      {
        question: "Gündüzlü dadının görev kapsamı nedir?",
        answer: "Temel görev çocuk bakımıdır. Çocukla ilgili ev içi düzen, öğün hazırlama, aktivite planlama ve okul hazırlığı da görev kapsamına dahil edilebilir. Bu detaylar baştan netleştirilir."
      }
    ]
  },
  {
    slug: "bebek-bakicisi",
    title: "Bebek Bakıcısı",
    tagline: "Bebek bakımında deneyim, referans ve sakin iletişim bir arada",
    shortDescription: "0–2 yaş dönemindeki bebeklerin özel bakım ihtiyaçlarına yönelik, deneyimli ve güvenilir bebek bakıcısı hizmeti.",
    longDescription: "Bebek dönemi, bakım veren kişinin yetkinliğinin en kritik olduğu evredir. Besleme, uyku rutini, hijyen, gelişimsel uyarım ve acil durum yönetimi konularında deneyim sahibi adayları aile beklentisiyle eşleştiriyoruz. İlk yardım ve CPR eğitimi almış adaylara öncelik veriyoruz.",
    whoIsItFor: [
      "0–2 yaş bebeği olan aileler",
      "Yenidoğan döneminde destek arayan ebeveynler",
      "Çalışmaya geri dönen anneler",
      "İkiz ya da çoğul bebek aileleri"
    ],
    whatWeEvaluate: [
      "Bebek bakımı özel deneyimi",
      "İlk yardım ve CPR sertifikası",
      "Uyku rutini oluşturma bilgisi",
      "Sakin ve güvenilir iletişim tarzı",
      "Acil durum farkındalığı ve doğru tepki kapasitesi"
    ],
    candidateQualities: [
      "Bebek bakımında kanıtlanmış deneyim",
      "Sabırlı ve sakin kişilik yapısı",
      "İlk yardım eğitimi (tercihen CPR)",
      "Düzenli ve rutin oluşturmaya yatkınlık",
      "Aile ile sık ve açık iletişim"
    ],
    faqs: [
      {
        question: "Bebek bakıcısı ile yatılı dadı arasındaki fark nedir?",
        answer: "Bebek bakıcısı özellikle 0–2 yaş dönemine odaklanır ve bebek bakımı konusunda daha spesifik deneyime sahiptir. Yatılı veya gündüzlü olarak çalışabilir, odak noktası bebeğin gelişimsel ihtiyaçlarıdır."
      },
      {
        question: "Gece bakımı için nasıl bir düzenleme yapılır?",
        answer: "Yatılı bebek bakıcısı gece beslenme ve uyandırma rutinleri için idealdir. Gündüzlü model seçilmişse gece bakımı için ayrı bir düzenleme gerekebilir."
      }
    ]
  },
  {
    slug: "yenidogan-bakimi",
    title: "Yenidoğan Bakımı",
    tagline: "İlk ayların hassas düzenine uygun, dikkatli ve kontrollü bakım",
    shortDescription: "Doğumdan ilk 3 aya kadar uzanan hassas dönem için özel deneyimli bakıcı ve doula hizmeti.",
    longDescription: "Yenidoğan dönemi, hem bebeğin hem de ailenin en yoğun uyum sürecini yaşadığı zamandır. Bu dönem için seçilen bakıcıların; emzirme desteği, cilt bakımı, göbek bakımı, uyku güvenliği ve ebeveyn rehberliği konularında deneyimli olması kritik önem taşır.",
    whoIsItFor: [
      "İlk kez ebeveyn olan aileler",
      "Doğum sonrası toparlanma dönemindeki anneler",
      "Erken doğum yapan aileler",
      "İkiz yenidoğan aileleri"
    ],
    whatWeEvaluate: [
      "Yenidoğan dönemi özel deneyimi",
      "Emzirme ve formül besleme bilgisi",
      "Bebek uyku güvenliği farkındalığı",
      "Ebeveyne destek ve rehberlik kapasitesi",
      "Sağlık durumlarını fark etme ve doğru yönlendirme"
    ],
    candidateQualities: [
      "Belgelenmiş yenidoğan deneyimi",
      "Sakin ve güven verici kişilik",
      "Uzun saatler ve gece bakımına uyumluluk",
      "Aile ile şeffaf iletişim"
    ],
    faqs: [
      {
        question: "Yenidoğan bakıcısı ne kadar süre çalışır?",
        answer: "Genellikle doğumdan 6–12. haftaya kadar yoğun destek verilir. Süre ailenin ihtiyacına göre esnekleştirilebilir."
      },
      {
        question: "Gece vardiyası nasıl organize edilir?",
        answer: "Yenidoğan bakımında gece vardiyası çok önemlidir. Yatılı model tercih edilmemesi durumunda gece-gündüz olarak iki bakıcıyla çalışmak da mümkündür."
      }
    ]
  },
  {
    slug: "oyun-ablasi",
    title: "Oyun Ablası",
    tagline: "Gelişim odaklı, yaratıcı ve çocuğun yaşına uygun eşlik",
    shortDescription: "Çocuğun oyun, gelişim ve sosyal becerilerini destekleyen eğitimli eşlikçi hizmeti.",
    longDescription: "Oyun ablası modeli; çocuğun günlük rutininde yaratıcı oyun, keşif ve sosyal gelişime odaklanan, ebeveynin yokluğunda güvenilir bir eşlikçi arayan aileler için idealdir. Çocuk gelişimi bilgisine sahip, dinamik ve oyun temelli yaklaşım benimseyen adaylarla çalışıyoruz.",
    whoIsItFor: [
      "2–8 yaş aralığındaki çocukları olan aileler",
      "Çocuğun sosyal gelişimini desteklemek isteyen ebeveynler",
      "Kısa süreli ya da part-time destek arayan aileler"
    ],
    whatWeEvaluate: [
      "Yaş grubuna uygun oyun ve aktivite bilgisi",
      "Çocukla bağ kurma kapasitesi",
      "Yaratıcı ve enerjik kişilik yapısı",
      "Sınır koyma ve olumlu disiplin anlayışı"
    ],
    candidateQualities: [
      "Çocuk gelişimi ya da eğitim alanında bilgi birikimi",
      "Oyun temelli yaklaşım",
      "Enerjik ve sabırlı kişilik",
      "Aile kurallarına uyum sağlama esnekliği"
    ],
    faqs: [
      {
        question: "Oyun ablası ile dadı arasındaki fark nedir?",
        answer: "Oyun ablası öncelikli olarak çocuğun gelişimsel ihtiyaçlarına odaklanır. Çocuk bakımı da dahildir ancak temel odak oyun, sosyal ve bilişsel gelişimdir."
      }
    ]
  },
  {
    slug: "egitimli-dadi",
    title: "Eğitimli Dadı",
    tagline: "Çocuk gelişimi, eğitim ve iletişim becerisi güçlü aday profilleri",
    shortDescription: "Çocuk gelişimi eğitimi almış, pedagojik bilgisiyle fark yaratan profesyonel dadı hizmeti.",
    longDescription: "Eğitimli dadı profili; çocuk gelişimi, erken çocukluk eğitimi ya da pedagoji alanında resmi eğitim almış adayları kapsar. Bu profildeki adaylar, çocuğun yaş dönemine özgü gelişimsel ihtiyaçlarını anlayarak bakım yaklaşımını buna göre şekillendirir.",
    whoIsItFor: [
      "Çocuğunun erken gelişimine önem veren aileler",
      "Özel eğitim gereksinimi olan çocukları olan aileler",
      "Ev ortamında yapılandırılmış öğrenme isteyen aileler"
    ],
    whatWeEvaluate: [
      "Eğitim belgesi ve bölümü",
      "Uygulamalı deneyim ve referanslar",
      "Gelişimsel bakış açısı ve uygulama örnekleri",
      "Aile iletişimi ve işbirliği kapasitesi"
    ],
    candidateQualities: [
      "Çocuk gelişimi, okul öncesi eğitim ya da ilgili diploma",
      "Uygulamalı aile deneyimi",
      "Sabırlı, yapılandırılmış ve yaratıcı yaklaşım"
    ],
    faqs: [
      {
        question: "Eğitimli dadı ile öğretmen arasındaki fark nedir?",
        answer: "Eğitimli dadı ev ortamında, bireysel çocuk odaklı çalışır. Grup sınıfı yerine aile dinamiğine ve çocuğun kişisel ihtiyaçlarına göre şekillenir."
      }
    ]
  },
  {
    slug: "yabanci-dil-bilen-dadi",
    title: "Yabancı Dil Bilen Dadı",
    tagline: "Dil gelişimini destekleyen ve aile beklentisine uyumlu adaylar",
    shortDescription: "İngilizce, Fransızca veya başka bir dili ana ya da ileri seviyede konuşan, çocuğun dil gelişimine katkı sağlayan dadı hizmeti.",
    longDescription: "Çocuğun erken yaşta ikinci dil edinimi için evin içinde dil maruziyeti sağlamak isteyen aileler için yabancı dil bilen dadı profilleri sunuyoruz. Dil yetkinliği belgeleme ve referanslarla doğrulanır.",
    whoIsItFor: [
      "Çocuğunun erken yaşta İngilizce öğrenmesini isteyen aileler",
      "Yurt dışı yaşamı planlayan aileler",
      "Uluslararası okula hazırlık aşamasındaki çocuklar"
    ],
    whatWeEvaluate: [
      "Dil yetkinlik belgesi veya referansı",
      "Dili çocukla doğal ortamda kullanma kapasitesi",
      "Bakım deneyimi ve güvenilirlik",
      "Aile iletişim tarzıyla uyum"
    ],
    candidateQualities: [
      "Hedef dilde akıcı ya da anadil düzeyinde konuşma",
      "Çocuklarla dil kullanım deneyimi",
      "Sabırlı ve tutarlı dil maruziyeti yaklaşımı"
    ],
    faqs: [
      {
        question: "Kaç yaşından itibaren başlanmalı?",
        answer: "Dil edinimi için en verimli dönem 0–7 yaş aralığıdır. Erken başlamak uzun vadeli dil gelişimine en büyük katkıyı sağlar."
      }
    ]
  },
  {
    slug: "ikiz-cocuk-bakimi",
    title: "İkiz Çocuk Bakımı",
    tagline: "Çoklu çocuk rutinlerinde deneyimli, planlı ve sabırlı destek",
    shortDescription: "İkiz ya da çoğul çocuk bakımının gerektirdiği özel deneyime sahip, planlı ve sabırlı dadı profilleri.",
    longDescription: "İkiz ya da üçüz bakımı, tek çocuk bakımına kıyasla çok daha yoğun organizasyon, çoklu rutin yönetimi ve yüksek fiziksel dayanıklılık gerektirir. Adaylarımızın bu deneyime sahip olması ve referanslarla doğrulanması temel kriterlerimizdandır.",
    whoIsItFor: [
      "İkiz ya da üçüz çocuğu olan aileler",
      "Yaşları birbirine yakın birden fazla küçük çocuğu olan aileler"
    ],
    whatWeEvaluate: [
      "İkiz veya çoğul çocuk bakımı özel deneyimi",
      "Çoklu rutin yönetme kapasitesi",
      "Fiziksel dayanıklılık ve yüksek enerji",
      "Sakin ve organize kişilik yapısı"
    ],
    candidateQualities: [
      "Çoğul çocuk bakımında kanıtlanmış deneyim",
      "Yüksek organizasyon becerisi",
      "Stres altında sakin kalabilme"
    ],
    faqs: [
      {
        question: "İkiz bakımı için tek bakıcı yeterli midir?",
        answer: "Yenidoğan ya da bebek dönemindeki ikizler için genellikle iki bakıcı önerilir. Yürüme çağı sonrasında tek deneyimli bakıcı yönetilebilir."
      }
    ]
  },
  {
    slug: "seyahat-uyumlu-dadi",
    title: "Seyahat Uyumlu Dadı",
    tagline: "Ailenin seyahat düzenine eşlik edebilecek esnek adaylar",
    shortDescription: "Yurt içi ve yurt dışı seyahatlerde ailenize eşlik edebilen, esnek ve deneyimli seyahat dadısı hizmeti.",
    longDescription: "Seyahat uyumlu dadı; yoğun iş seyahati olan ya da tatil dönemlerinde çocuklarının bakımını sürdürmek isteyen aileler için değerlidir. Pasaport, vize durumu, farklı ortamlara uyum kapasitesi ve seyahat deneyimi temel değerlendirme kriterleridir.",
    whoIsItFor: [
      "Sık iş seyahati olan ebeveynler",
      "Uzun tatil dönemlerinde destek arayan aileler",
      "Yurt dışı yaşamı olan aileler"
    ],
    whatWeEvaluate: [
      "Seyahat deneyimi ve uyum kapasitesi",
      "Pasaport ve vize durumu",
      "Yeni ortamlara hızlı uyum",
      "Bağımsız karar verme yetkinliği"
    ],
    candidateQualities: [
      "Geçerli pasaport",
      "Seyahat deneyimi",
      "Esneklik ve uyum kapasitesi",
      "Güvenilir ve bağımsız çalışma becerisi"
    ],
    faqs: [
      {
        question: "Yurt dışı seyahatlerde yasal düzenlemeler ne gerektiriyor?",
        answer: "Bazı ülkelere giriş için vize gerekebilir. Bu konular aile ve danışman tarafından baştan netleştirilmeli, gerekli belgeler hazırlanmalıdır."
      }
    ]
  },
  {
    slug: "donemsel-dadi",
    title: "Dönemsel Dadı",
    tagline: "Yazlık, kısa süreli veya geçici ihtiyaçlar için hızlı süreç",
    shortDescription: "Yazlık dönem, hastalık, ebeveyn yokluğu veya geçici ihtiyaçlar için esnek süreli dadı hizmeti.",
    longDescription: "Dönemsel dadı; belirli bir süre için destek arayan ailelere yönelik, hızlı değerlendirme ve yerleştirme süreciyle çalışır. Yaz tatili, doğum izni dönüşü, hastalık ya da ebeveynin iş yoğunluğu gibi durumlarda pratik bir çözüm sunar.",
    whoIsItFor: [
      "Yaz dönemi için ek destek arayan aileler",
      "Kısa süreli hastalık ya da toparlanma dönemindekiler",
      "Ebeveynin iş yoğunluğunun geçici olarak arttığı durumlar"
    ],
    whatWeEvaluate: [
      "Kısa süreli çalışmaya uyumluluk",
      "Hızlı uyum kapasitesi",
      "Referans ve güvenilirlik",
      "Esnek çalışma saatlerine yatkınlık"
    ],
    candidateQualities: [
      "Dönemsel çalışma deneyimi",
      "Hızlı uyum sağlama",
      "Güvenilir ve referanslı profil"
    ],
    faqs: [
      {
        question: "Minimum süre nedir?",
        answer: "Minimum 2 haftalık dönemsel yerleştirme yapılmaktadır. Daha kısa süreli ihtiyaçlar için iletişime geçin."
      }
    ]
  },
  {
    slug: "acil-dadi-ihtiyaci",
    title: "Acil Dadı İhtiyacı",
    tagline: "Zaman hassasiyeti yüksek durumlarda kontrollü ve hızlı süreç",
    shortDescription: "Beklenmedik durumlarda 48–72 saat içinde güvenilir dadı desteği sağlamaya yönelik hızlandırılmış yerleştirme süreci.",
    longDescription: "Acil dadı ihtiyacı; mevcut bakıcının aniden ayrılması, ebeveyn hastalığı ya da beklenmedik bir durum nedeniyle kısa sürede çözüm gereken aileler için hızlandırılmış bir değerlendirme süreciyle yürütülür. Temel doğrulama adımlarından ödün vermeksizin hız önceliklidir.",
    whoIsItFor: [
      "Mevcut bakıcının aniden ayrıldığı durumlar",
      "Ebeveyn hastalığı ya da acil yokluğu",
      "Beklenmedik çalışma zorunlulukları"
    ],
    whatWeEvaluate: [
      "Hazır aday havuzundan hızlı eşleştirme",
      "Temel referans ve kimlik doğrulaması",
      "Acil çalışmaya uyumluluk",
      "Aile dinamiğiyle temel uyum"
    ],
    candidateQualities: [
      "Hızlı başlayabilecek müsait profil",
      "Güvenilir temel referans",
      "Esnek ve uyumlu kişilik"
    ],
    faqs: [
      {
        question: "Acil süreçte kalite güvencesi sağlanır mı?",
        answer: "Evet. Temel kimlik, referans ve uyumluluk kontrolü acil süreçlerde de yapılır. Ancak kapsamlı değerlendirme için normal süreç önerilir."
      },
      {
        question: "Acil yerleştirme için nasıl başvurulur?",
        answer: "Doğrudan WhatsApp ya da telefon ile danışmanlarımıza ulaşmanız en hızlı yoldur."
      }
    ]
  }
];

export function getServiceContent(slug: string): ServiceContent | undefined {
  return servicesContent.find((s) => s.slug === slug);
}
