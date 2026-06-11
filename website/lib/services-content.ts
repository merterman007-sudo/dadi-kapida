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

const serviceContentEntries: ServiceContent[] = [
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
  },
  {
    slug: "cocuk-bakicisi",
    title: "Çocuk Bakıcısı",
    tagline: "Okul çağındaki çocuklara güvenilir, düzenli ve enerjik bakım",
    shortDescription: "Okul sonrası rutin, ödev takibi, oyun ve günlük bakım desteği için çocuk bakıcısı profilleri.",
    longDescription: "Çocuk bakıcısı hizmeti; okul çağındaki çocukların günlük düzenini desteklemek, güvenli ve sıcak bir ortam sağlamak için tasarlanmıştır. Adaylarda iletişim, sabır, enerji ve aile düzenine uyum öncelikli olarak değerlendirilir.",
    whoIsItFor: [
      "Okul sonrası çocuk bakımı arayan aileler",
      "Ödev ve rutin desteği isteyen ebeveynler",
      "Kısa süreli gündüz desteği arayan aileler"
    ],
    whatWeEvaluate: [
      "Çocuk yaş grubuna uygun bakım deneyimi",
      "Ödev ve rutin yönetimi",
      "Sabır ve iletişim becerisi",
      "Aile kurallarına uyum"
    ],
    candidateQualities: [
      "Referanslı çocuk bakımı geçmişi",
      "Enerjik ve sabırlı yaklaşım",
      "Sorumluluk bilinci"
    ],
    faqs: [
      {
        question: "Çocuk bakıcısı ile oyun ablası arasındaki fark nedir?",
        answer: "Çocuk bakıcısı günlük bakım ve düzen sorumluluğunu daha geniş kapsar; oyun ablası ise oyun ve gelişim odaklı destek verir."
      }
    ]
  },
  {
    slug: "gece-dadisi",
    title: "Gece Dadısı",
    tagline: "Gece rutinleri ve uyku düzeni için destek",
    shortDescription: "Gece beslenme, uyku takibi ve geceye özel bakım için deneyimli gece dadısı çözümleri.",
    longDescription: "Gece dadısı, özellikle yenidoğan döneminde veya gece desteğine ihtiyaç duyan ailelerde güvenli ve sakin bir bakım düzeni kurar. Adayların gece çalışma deneyimi, dikkat seviyesi ve aileyle iletişimi titizlikle değerlendirilir.",
    whoIsItFor: [
      "Gece destek isteyen yenidoğan aileleri",
      "Uyku düzeni kurmak isteyen ebeveynler",
      "Gece vardiyası nedeniyle ek destek arayan aileler"
    ],
    whatWeEvaluate: [
      "Gece vardiyası deneyimi",
      "Uyku ve beslenme rutini bilgisi",
      "Dikkat ve güvenilirlik",
      "Acil durum farkındalığı"
    ],
    candidateQualities: [
      "Gece çalışmaya uyumlu",
      "Sakin ve dikkatli",
      "Yenidoğan veya bebek deneyimli"
    ],
    faqs: [
      {
        question: "Gece dadısı kaç saat çalışır?",
        answer: "İhtiyaca göre değişir; genelde 8-12 saatlik gece vardiyaları planlanır."
      }
    ]
  },
  {
    slug: "refakatci",
    title: "Refakatçi",
    tagline: "Doktor ve sosyal süreçlerde güvenli eşlik",
    shortDescription: "Yaşlı bireylere, hastane süreçlerine veya günlük dışarı çıkışlara eşlik eden refakatçi desteği.",
    longDescription: "Refakatçi; sosyal destek, doktor ziyaretleri, kısa yürüyüşler ve gündelik dış aktivitelerde eşlik eder. Tıbbi müdahale yapmaz; güvenli, saygılı ve dikkatli bir eşlik rolü üstlenir.",
    whoIsItFor: [
      "Hastane randevularında eşlik ihtiyacı olan aileler",
      "Yaşlı bireyler için sosyal destek arayanlar",
      "Kısa süreli refakat desteği isteyen aileler"
    ],
    whatWeEvaluate: [
      "Eşlik ve iletişim becerisi",
      "Sabır ve güvenilirlik",
      "Temel yönlendirme ve destek kapasitesi",
      "Aile ile uyum"
    ],
    candidateQualities: [
      "Saygılı ve dikkatli",
      "İletişimi güçlü",
      "Sorumluluk sahibi"
    ],
    faqs: [
      {
        question: "Refakatçi tıbbi işlem yapabilir mi?",
        answer: "Hayır. Refakatçi yalnızca eşlik ve destek sağlar; tıbbi müdahale gerektiren işlemler sağlık profesyonelleri tarafından yapılmalıdır."
      }
    ]
  },
  {
    slug: "yasli-bakicisi",
    title: "Yaşlı Bakıcısı",
    tagline: "Günlük bakım, ilaç takibi ve güvenli ev desteği",
    shortDescription: "Yaşlı bireylerin günlük rutinlerini kolaylaştıran, güvenilir ve deneyimli yaşlı bakıcısı hizmeti.",
    longDescription: "Yaşlı bakıcısı; günlük bakım, ilaç düzeni takibi, yeme-içme desteği ve güvenli ev ortamının korunmasında yardımcı olur. Adaylarda sabır, iletişim ve süreklilik çok önemlidir.",
    whoIsItFor: [
      "Günlük bakım desteği isteyen aileler",
      "İlaç ve rutin takibi gereken yaşlı bireyler",
      "Evde uzun süreli destek arayanlar"
    ],
    whatWeEvaluate: [
      "Yaşlı bakım deneyimi",
      "İlaç ve rutin takibi bilgisi",
      "Sabır ve güvenilirlik",
      "Aile iletişimi"
    ],
    candidateQualities: [
      "Deneyimli ve referanslı",
      "Sabırlı ve şefkatli",
      "Sorumluluk sahibi"
    ],
    faqs: [
      {
        question: "Yaşlı bakıcısı gece kalabilir mi?",
        answer: "Evet, ihtiyaç varsa yatılı veya gece destekli seçenekler değerlendirilebilir."
      }
    ]
  },
  {
    slug: "hasta-bakicisi",
    title: "Hasta Bakıcısı",
    tagline: "İyileşme sürecinde güvenli ve düzenli destek",
    shortDescription: "Kronik hastalık, taburculuk ve kısa/uzun dönem bakım ihtiyaçları için hasta bakıcısı hizmeti.",
    longDescription: "Hasta bakıcısı, evde bakım sürecinde düzen, gözlem ve aile desteği sağlar. Tıbbi müdahale yapmaz; bakım, yönlendirme ve günlük yaşam desteğine odaklanır.",
    whoIsItFor: [
      "Taburculuk sonrası destek arayan aileler",
      "Kronik bakım ihtiyacı olan bireyler",
      "Kısa süreli iyileşme desteği isteyenler"
    ],
    whatWeEvaluate: [
      "Hasta bakım deneyimi",
      "İletişim ve sabır",
      "Düzen ve gözlem becerisi",
      "Aile ile uyum"
    ],
    candidateQualities: [
      "Referanslı bakım geçmişi",
      "Sakin ve dikkatli",
      "Sorumluluk sahibi"
    ],
    faqs: [
      {
        question: "Hasta bakıcısı ilaç verebilir mi?",
        answer: "Doktorun/ailenin belirlediği rutinler doğrultusunda yardımcı olabilir; ancak tıbbi karar ve müdahaleler sağlık profesyonellerine aittir."
      }
    ]
  },
  {
    slug: "gunluk-temizlik",
    title: "Günlük Temizlik",
    tagline: "Düzenli ve pratik ev temizliği desteği",
    shortDescription: "Günlük veya periyodik ev düzeni için güvenilir temizlik personeli eşleştirmesi.",
    longDescription: "Günlük temizlik hizmeti; evin temiz, düzenli ve yaşanabilir kalmasına yardımcı olur. Adayların hız, dikkat ve detay odaklı çalışma tarzı değerlendirilir.",
    whoIsItFor: [
      "Düzenli ev temizliği arayan aileler",
      "Yoğun çalışan ebeveynler",
      "Ev düzenini korumak isteyenler"
    ],
    whatWeEvaluate: [
      "Temizlik deneyimi",
      "Detay ve hız dengesi",
      "Güvenilirlik",
      "Ev düzenine uyum"
    ],
    candidateQualities: [
      "Deneyimli ve referanslı",
      "Titiz ve düzenli",
      "Dakik"
    ],
    faqs: [
      {
        question: "Temizlik malzemelerini kim sağlar?",
        answer: "Bu detay başvuruda netleştirilir; çoğu durumda aile sağlar."
      }
    ]
  },
  {
    slug: "ozel-sofor",
    title: "Özel Şoför",
    tagline: "Bireysel kullanım için güvenilir sürücü desteği",
    shortDescription: "Günlük ulaşım, özel kullanım ve esnek rota planlaması için özel şoför çözümleri.",
    longDescription: "Özel şoför; bireysel ihtiyaçlara göre planlanan ulaşım desteğidir. Araç kullanımı, güvenli sürüş ve zaman yönetimi temel değerlendirme başlıklarıdır.",
    whoIsItFor: [
      "Bireysel ulaşım desteği isteyenler",
      "Yoğun programı olan aile bireyleri",
      "Esnek saatlerde şoför arayanlar"
    ],
    whatWeEvaluate: [
      "Güvenli sürüş deneyimi",
      "Zaman yönetimi",
      "İletişim ve gizlilik",
      "Şehir içi rota hakimiyeti"
    ],
    candidateQualities: [
      "Ehliyet ve deneyim",
      "Güvenilir sürüş alışkanlığı",
      "Esnek çalışma düzeni"
    ],
    faqs: [
      {
        question: "Araç aileye mi ait olur?",
        answer: "Genellikle aile aracını kullanır; detaylar başvuruda netleştirilir."
      }
    ]
  },
  {
    slug: "ev-yardimcisi",
    title: "Ev Yardımcısı",
    tagline: "Ev işlerinde genel destek ve düzen",
    shortDescription: "Ev içi düzen, yemek, toparlama ve günlük işlerde yardımcı olacak güvenilir ev yardımcısı profilleri.",
    longDescription: "Ev yardımcısı; ev işlerinin hafifletilmesi, günlük düzenin korunması ve aileye operasyonel destek sağlanması için değerlendirilir. Geniş görev tanımı önceden netleştirilir.",
    whoIsItFor: [
      "Ev düzeninde destek isteyen aileler",
      "Çoklu görev desteği arayanlar",
      "Günlük iş yükünü azaltmak isteyenler"
    ],
    whatWeEvaluate: [
      "Genel ev işi deneyimi",
      "Sorumluluk ve düzen",
      "İletişim",
      "Aile beklentisine uyum"
    ],
    candidateQualities: [
      "Pratik ve düzenli",
      "Güvenilir",
      "Çoklu göreve uyumlu"
    ],
    faqs: [
      {
        question: "Ev yardımcısı yemek de yapar mı?",
        answer: "İhtiyaca göre görev kapsamına eklenebilir; başvuruda netleştirilir."
      }
    ]
  },
  {
    slug: "cocuk-bakicisi",
    title: "Çocuk Bakıcısı",
    tagline: "Okul çağı ve günlük rutinlerde güvenilir destek",
    shortDescription: "Okul çağı çocukların rutinini, güvenliğini ve günlük akışını destekleyen deneyimli çocuk bakıcısı hizmeti.",
    longDescription: "Çocuk bakıcısı profilleri; okul sonrası destek, ders takibi, oyun düzeni, beslenme ve güvenli ev içi bakım konularında deneyimli adaylardan seçilir. Ailenin çalışma düzeni ve çocuğun yaş grubuna göre eşleştirme yapılır.",
    whoIsItFor: [
      "Okul çağı çocuğu olan aileler",
      "Okul sonrası bakım desteği isteyenler",
      "Evde güvenilir günlük rutin desteği arayanlar"
    ],
    whatWeEvaluate: [
      "Çocuk rutini yönetimi",
      "Yaşa uygun iletişim ve oyun yaklaşımı",
      "Güvenilirlik ve dakiklik",
      "Aile ile şeffaf iletişim"
    ],
    candidateQualities: [
      "Çocuklarla uzun süreli çalışma deneyimi",
      "Sabırlı ve sorumluluk sahibi",
      "Aile kurallarına uyumlu"
    ],
    faqs: [
      {
        question: "Çocuk bakıcısı ile oyun ablası arasındaki fark nedir?",
        answer: "Çocuk bakıcısı günlük bakım, güvenlik ve rutin yönetimine daha geniş ölçekte destek olur. Oyun ablası ise daha çok oyun, gelişim ve etkinlik odaklıdır."
      }
    ]
  },
  {
    slug: "gece-dadisi",
    title: "Gece Dadısı",
    tagline: "Gece uyku düzeninde ve yenidoğan döneminde özel destek",
    shortDescription: "Gece beslenme, uyku takibi ve ebeveyn dinlenmesini destekleyen deneyimli gece dadısı hizmeti.",
    longDescription: "Gece dadısı; özellikle yenidoğan dönemi, sık uyanan bebekler ve gece vardiyası ihtiyacı olan aileler için planlanan profesyonel destek modelidir. Gece boyunca düzen, güvenlik ve aile konforunu birlikte yönetir.",
    whoIsItFor: [
      "Yenidoğan dönemi yaşayan aileler",
      "Gece uyanmaları yoğun bebekler",
      "Ebeveynin dinlenmeye ihtiyacı olduğu dönemler"
    ],
    whatWeEvaluate: [
      "Gece bakımı deneyimi",
      "Sabır ve dikkat",
      "Uyku rutini yönetimi",
      "Acil durumda doğru yönlendirme"
    ],
    candidateQualities: [
      "Gece çalışmasına uyumlu",
      "Sakin ve güven veren",
      "Bebek bakımında deneyimli"
    ],
    faqs: [
      {
        question: "Gece dadısı yatılı olmak zorunda mı?",
        answer: "Hayır, gece dadısı yatılı çalışabilir ya da belirli gece saatlerinde hizmet verebilir. Düzen aile ihtiyacına göre belirlenir."
      }
    ]
  },
  {
    slug: "yasli-bakicisi",
    title: "Yaşlı Bakıcısı",
    tagline: "Günlük bakımda sabır, düzen ve güvenli destek",
    shortDescription: "Yaşlı bireylerin günlük ihtiyaçları, ilaç takibi ve ev içi düzeni için deneyimli yaşlı bakıcısı hizmeti.",
    longDescription: "Yaşlı bakıcısı; evde yaşam kalitesini korumak, günlük rutinleri desteklemek ve aileye güven vermek için planlanır. Bakımın kapsamı, sağlık durumu ve günlük ihtiyaçlara göre netleştirilir.",
    whoIsItFor: [
      "Günlük yaşam desteği arayan aileler",
      "Hareket kısıtlılığı olan yaşlı bireyler",
      "Ev içi düzen ve refakat ihtiyacı olanlar"
    ],
    whatWeEvaluate: [
      "Yaşlı bakım deneyimi",
      "Sabır ve empati",
      "Rutin takibi",
      "Aile ile net iletişim"
    ],
    candidateQualities: [
      "Referanslı bakım deneyimi",
      "Şefkatli ve dikkatli",
      "Uzun soluklu çalışmaya uygun"
    ],
    faqs: [
      {
        question: "Yaşlı bakıcısı gece destek verir mi?",
        answer: "İhtiyaca göre gece kalabilen ya da belirli saatlerde destek veren adaylar değerlendirilebilir."
      }
    ]
  },
  {
    slug: "refakatci",
    title: "Refakatçi",
    tagline: "Hastane, doktor ve günlük takip süreçlerinde eşlik",
    shortDescription: "Randevu, hastane ve günlük eşlik ihtiyacı için güvenilir refakatçi hizmeti.",
    longDescription: "Refakatçi, tıbbi müdahale yapmadan kişiye günlük yaşamda eşlik eder; randevu takibi, yolculuk desteği ve bekleme süreçlerinde yardımcı olur. Özellikle hasta ve yaşlı yakınlarının yükünü hafifletir.",
    whoIsItFor: [
      "Hastane süreçlerinde eşlik ihtiyacı olanlar",
      "Doktor randevularında destek arayanlar",
      "Günlük dışarı çıkışlarda refakat gerekenler"
    ],
    whatWeEvaluate: [
      "Güvenilirlik",
      "İletişim ve sakinlik",
      "Zaman yönetimi",
      "Eşlik deneyimi"
    ],
    candidateQualities: [
      "Dikkatli ve sorumluluk sahibi",
      "Yol ve süreç takibinde iyi",
      "İletişimi kuvvetli"
    ],
    faqs: [
      {
        question: "Refakatçi ilaç takibi yapar mı?",
        answer: "Ailenin belirlediği rutini takip edebilir; ancak tıbbi karar ve uygulamalar sağlık profesyonellerine aittir."
      }
    ]
  },
  {
    slug: "evde-bakim",
    title: "Evde Bakım",
    tagline: "Uzun dönemli ev içi bakım ve günlük destek",
    shortDescription: "Yaşlı veya desteğe ihtiyaç duyan bireyler için evde bakım hizmeti ve düzenli günlük takip.",
    longDescription: "Evde bakım hizmeti, kişinin kendi evinde konforunu korurken gerekli günlük desteği almasını sağlar. Bakım planı; hareket, beslenme, temizlik ve eşlik ihtiyaçlarına göre şekillenir.",
    whoIsItFor: [
      "Uzun dönemli destek ihtiyacı olan aileler",
      "Evden ayrılmak istemeyen yaşlı bireyler",
      "Günlük bakım planı gerektiren durumlar"
    ],
    whatWeEvaluate: [
      "Bakım planına uyum",
      "Sürekli çalışma deneyimi",
      "Güven ve düzen",
      "Aile ile koordinasyon"
    ],
    candidateQualities: [
      "Sorumluluk sahibi",
      "Uzun süreli bakım tecrübesi",
      "Şefkatli yaklaşım"
    ],
    faqs: [
      {
        question: "Evde bakım ile yaşlı bakıcısı aynı şey mi?",
        answer: "Benzer alanlar olsa da evde bakım genelde daha geniş ve uzun dönemli bir bakım çerçevesi sunar."
      }
    ]
  },
  {
    slug: "ameliyat-sonrasi-destek",
    title: "Ameliyat Sonrası Destek",
    tagline: "Taburculuk sonrası iyileşme sürecinde düzenli ev desteği",
    shortDescription: "Ameliyat sonrası dönemde dinlenme, günlük bakım ve refakat için profesyonel destek.",
    longDescription: "Ameliyat sonrası destek; iyileşme döneminde güvenlik, düzen ve eşlik sağlar. Adaylar, aileye hem fiziksel yardım hem de süreç takibi açısından destek olur.",
    whoIsItFor: [
      "Taburculuk sonrası iyileşme sürecinde olanlar",
      "Evde geçici bakım ihtiyacı duyanlar",
      "Günlük hareketlerde destek gerekenler"
    ],
    whatWeEvaluate: [
      "İyileşme sürecine uygun bakım deneyimi",
      "Dikkat ve düzen",
      "Refakat becerisi",
      "Aile ile koordinasyon"
    ],
    candidateQualities: [
      "Sakin ve dikkatli",
      "Güvenilir",
      "Yönlendirmeye açık"
    ],
    faqs: [
      {
        question: "Ameliyat sonrası destek tıbbi bakım içerir mi?",
        answer: "Hayır. Bu hizmet günlük yaşam desteği ve refakat odaklıdır; tıbbi işlemler sağlık profesyonellerine aittir."
      }
    ]
  },
  {
    slug: "haftalik-temizlik",
    title: "Haftalık Temizlik",
    tagline: "Periyodik düzen için planlı ev temizliği",
    shortDescription: "Haftalık ya da iki haftada bir yapılan düzenli temizlik ihtiyaçları için planlı personel eşleştirmesi.",
    longDescription: "Haftalık temizlik hizmeti; evin düzenini sürdürülebilir şekilde korumak isteyen aileler için hazırlanmıştır. Program, evin büyüklüğüne ve temizlik beklentisine göre planlanır.",
    whoIsItFor: [
      "Düzenli temizlik isteyen aileler",
      "İş yoğunluğu sebebiyle zaman ayıramayanlar",
      "Periyodik ev düzeni arayanlar"
    ],
    whatWeEvaluate: [
      "Temizlik deneyimi",
      "Planlı çalışma",
      "Detaylara dikkat",
      "Güvenilirlik"
    ],
    candidateQualities: [
      "Düzenli ve titiz",
      "Referanslı",
      "Programlı çalışmaya uygun"
    ],
    faqs: [
      {
        question: "Haftalık temizlikte görev kapsamı değişebilir mi?",
        answer: "Evet, evin ihtiyacına göre mutfak, banyo, ütü veya toparlama gibi alanlar baştan netleştirilebilir."
      }
    ]
  },
  {
    slug: "ofis-temizligi",
    title: "Ofis Temizliği",
    tagline: "İş yerleri için düzenli ve profesyonel temizlik",
    shortDescription: "Ofis, çalışma alanı ve küçük işletmeler için planlı temizlik personeli hizmeti.",
    longDescription: "Ofis temizliği; iş ortamında düzeni, hijyeni ve profesyonel görünümü korumayı amaçlar. İş saatlerine, alan büyüklüğüne ve beklentiye göre uygun personel planlanır.",
    whoIsItFor: [
      "Ofis veya stüdyo sahipleri",
      "Düzenli temizlik programı isteyen işletmeler",
      "Çalışma alanını profesyonel tutmak isteyen ekipler"
    ],
    whatWeEvaluate: [
      "İş yeri deneyimi",
      "Zamanlama ve disiplin",
      "Detay odaklı çalışma",
      "Güvenilirlik"
    ],
    candidateQualities: [
      "Düzenli ve dakik",
      "İş yeri deneyimli",
      "Esnek programa uyumlu"
    ],
    faqs: [
      {
        question: "Ofis temizliği mesai saatleri dışında yapılabilir mi?",
        answer: "Evet, iş akışını etkilemeyecek saatlerde temizlik planlanabilir."
      }
    ]
  },
  {
    slug: "villa-temizligi",
    title: "Villa Temizliği",
    tagline: "Geniş yaşam alanları için kapsamlı temizlik planı",
    shortDescription: "Geniş ev ve villa tipleri için ekip ya da tekil personelle planlanan kapsamlı temizlik hizmeti.",
    longDescription: "Villa temizliği, büyük metrekareli alanlarda düzenli ve derinlemesine temizlik gereksinimini karşılamak için planlanır. Oda sayısı, dış alanlar ve periyot ihtiyacına göre personel seçilir.",
    whoIsItFor: [
      "Geniş ev ve villa sahipleri",
      "Sezonluk veya düzenli temizlik arayanlar",
      "Ekip ile temizlik tercih edenler"
    ],
    whatWeEvaluate: [
      "Büyük alan deneyimi",
      "Takım çalışması",
      "Detay ve hız dengesi",
      "Güvenilirlik"
    ],
    candidateQualities: [
      "Yoğun temizlik deneyimi",
      "Fiziksel dayanıklılık",
      "Düzenli çalışma alışkanlığı"
    ],
    faqs: [
      {
        question: "Villa temizliği ekip halinde mi olur?",
        answer: "İhtiyaca göre tek personel ya da birden fazla kişiyle planlanabilir."
      }
    ]
  },
  {
    slug: "aile-soforu",
    title: "Aile Şoförü",
    tagline: "Aile rutinine uyumlu güvenli ulaşım desteği",
    shortDescription: "Çocuk servisi, günlük transfer ve aile programına uyum sağlayan güvenilir aile şoförü hizmeti.",
    longDescription: "Aile şoförü; okul, aktivite, alışveriş ve günlük ulaşım akışını güvenli ve düzenli şekilde yürütür. Rota bilgisi, araç kullanımı ve aile programına uyum temel değerlendirme başlıklarıdır.",
    whoIsItFor: [
      "Günlük ulaşım desteği arayan aileler",
      "Çocuk servisi ihtiyacı olanlar",
      "Esnek programla çalışan aile bireyleri"
    ],
    whatWeEvaluate: [
      "Güvenli sürüş",
      "Zaman yönetimi",
      "Gizlilik",
      "Şehir içi rota hakimiyeti"
    ],
    candidateQualities: [
      "Deneyimli sürücü",
      "Aile düzenine uyumlu",
      "Esnek çalışma saatlerine uygun"
    ],
    faqs: [
      {
        question: "Aile şoförü kendi aracını mı kullanır?",
        answer: "Genellikle aile aracını kullanır; detaylar başvuruda netleştirilir."
      }
    ]
  },
  {
    slug: "makam-soforu",
    title: "Makam Şoförü",
    tagline: "Temsil ve güven gerektiren transferler için profesyonel sürücü",
    shortDescription: "Kurumsal, protokol ve özel transferler için deneyimli makam şoförü hizmeti.",
    longDescription: "Makam şoförü profilleri, temsil gücü, gizlilik anlayışı ve yüksek dikkat gerektiren sürüş düzeniyle seçilir. Kurumsal veya özel kullanım senaryolarında güvenilir bir çözüm sunar.",
    whoIsItFor: [
      "Kurumsal transfer ihtiyacı olanlar",
      "Protokol ve temsil gerektiren kullanım",
      "Gizlilik ve disiplin arayanlar"
    ],
    whatWeEvaluate: [
      "Profesyonel sürüş deneyimi",
      "Gizlilik ve temsil",
      "Planlı çalışma",
      "Şehir içi ve uzun yol deneyimi"
    ],
    candidateQualities: [
      "Tecrübeli ve dikkatli",
      "Temsil kabiliyeti güçlü",
      "Disiplinli"
    ],
    faqs: [
      {
        question: "Makam şoföründe özel güvenlik kontrolü var mı?",
        answer: "Pozisyona göre ek referans ve güvenlik değerlendirmesi yapılabilir."
      }
    ]
  },
  {
    slug: "asci",
    title: "Aşçı",
    tagline: "Ev mutfağında günlük yemek ve özel menü desteği",
    shortDescription: "Aile düzenine uygun, günlük yemek ve mutfak organizasyonu sağlayan profesyonel aşçı hizmeti.",
    longDescription: "Aşçı profilleri; günlük aile yemeği, özel menü, diyet uyumu ve mutfak düzeni konularında deneyimli adaylardan seçilir. Menü alışkanlıkları ve çalışma temposu baştan netleştirilir.",
    whoIsItFor: [
      "Evinde düzenli yemek hazırlatmak isteyen aileler",
      "Özel menü veya diyet desteği arayanlar",
      "Mutfak organizasyonunu profesyonelleştirmek isteyenler"
    ],
    whatWeEvaluate: [
      "Mutfak deneyimi",
      "Menü planlama",
      "Hijyen ve düzen",
      "Aile damak zevkine uyum"
    ],
    candidateQualities: [
      "Deneyimli ve temiz çalışkan",
      "Menüye uyum sağlayabilen",
      "Ev mutfağında rahat"
    ],
    faqs: [
      {
        question: "Aşçı sadece yemek mi yapar?",
        answer: "Görev kapsamı ihtiyaca göre mutfak düzeni, alışveriş listesi ve menü planlamayı da kapsayabilir."
      }
    ]
  },
  {
    slug: "kahya",
    title: "Kahya",
    tagline: "Büyük hanelerde düzen, koordinasyon ve operasyon yönetimi",
    shortDescription: "Kahya profilleri; ev içi operasyon, personel koordinasyonu ve düzenli takibi üstlenen deneyimli adaylardan oluşur.",
    longDescription: "Kahya, büyük evlerde ve çoklu personel yapısında işleri koordine eden, stok takibi, programlama ve günlük düzeni yöneten profesyonel destek rolüdür.",
    whoIsItFor: [
      "Büyük hane veya villa sahibi aileler",
      "Birden fazla personel koordinasyonu gereken evler",
      "Operasyonel düzen isteyen aileler"
    ],
    whatWeEvaluate: [
      "Ev yönetimi deneyimi",
      "Koordinasyon becerisi",
      "Takip ve sorumluluk",
      "Gizlilik"
    ],
    candidateQualities: [
      "Organize",
      "Sorumluluk sahibi",
      "Çoklu görev yönetimine uygun"
    ],
    faqs: [
      {
        question: "Kahya günlük olarak ne yapar?",
        answer: "Ev düzenini, görev dağılımını, stok ve temel koordinasyonu takip eder; detay görev kapsamı aileye göre belirlenir."
      }
    ]
  },
  {
    slug: "camasirci",
    title: "Çamaşırcı",
    tagline: "Çamaşır, ütü ve tekstil düzeninde yardımcı destek",
    shortDescription: "Çamaşır yıkama, kurutma, ütü ve giyim düzeni için uzman destek personeli.",
    longDescription: "Çamaşırcı hizmeti, kıyafet ve ev tekstili düzeninin pratik şekilde sürdürülmesine yardımcı olur. Evde tekstil yoğunluğu fazla olan aileler için ideal bir destek modelidir.",
    whoIsItFor: [
      "Çamaşır ve ütü yükü fazla olan aileler",
      "Düzenli tekstil bakımı isteyenler",
      "Ev işlerini hafifletmek isteyenler"
    ],
    whatWeEvaluate: [
      "Ütü ve kumaş bilgisi",
      "Düzen ve hız",
      "Güvenilirlik",
      "Titizlik"
    ],
    candidateQualities: [
      "Titiz ve düzenli",
      "Tekstil bakımına dikkatli",
      "Ev düzenine uyumlu"
    ],
    faqs: [
      {
        question: "Çamaşırcı sadece ütü mü yapar?",
        answer: "Hayır. Çamaşır yıkama, ayırma, ütü ve düzenleme görevleri ihtiyaca göre birlikte planlanabilir."
      }
    ]
  }
];

export const servicesContent: ServiceContent[] = Array.from(
  new Map(serviceContentEntries.map((service) => [service.slug, service])).values()
);

export function getServiceContent(slug: string): ServiceContent | undefined {
  return servicesContent.find((s) => s.slug === slug);
}
