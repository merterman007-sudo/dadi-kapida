export type LegalSection = {
  heading: string;
  body: string;
};

export type LegalPage = {
  sections: LegalSection[];
  lastUpdated: string;
};

export const legalContent: Record<string, LegalPage> = {
  "kvkk-aydinlatma-metni": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "1. Veri Sorumlusu",
        body: `Dadı Kapıda olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz. Bu metin, sitemizi ziyaret eden, aile veya dadı başvurusu gerçekleştiren kişileri bilgilendirmek amacıyla hazırlanmıştır.`
      },
      {
        heading: "2. İşlenen Kişisel Veriler",
        body: `Hizmetlerimiz kapsamında aşağıdaki kişisel veriler işlenebilmektedir:\n\n• Kimlik bilgileri: ad, soyad\n• İletişim bilgileri: telefon numarası, e-posta adresi\n• Konum bilgileri: şehir, ilçe\n• Başvuru içeriği: hizmet talebi, çocuk sayısı, tercih edilen çalışma düzeni\n• Deneyim bilgileri (dadı adayları için): çalışma geçmişi, referans bilgisi, eğitim durumu\n• Teknik veriler: IP adresi, tarayıcı bilgisi, çerez verileri`
      },
      {
        heading: "3. Kişisel Verilerin İşlenme Amacı",
        body: `Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:\n\n• Hizmet talebinizin alınması ve değerlendirilmesi\n• Danışmanlarımız tarafından sizinle iletişime geçilmesi\n• Uygun aday veya aile eşleştirmesinin yapılması\n• Yerleştirme sürecinin yönetilmesi\n• Yasal yükümlülüklerin yerine getirilmesi\n• Hizmet kalitesinin iyileştirilmesi`
      },
      {
        heading: "4. Kişisel Verilerin Aktarılması",
        body: `Kişisel verileriniz; hizmet sürecinde ilgili taraflarla (eşleştirme yapılacak aile veya dadı adayı), hizmet aldığımız teknik altyapı sağlayıcılarıyla ve yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarıyla paylaşılabilmektedir. Yurt dışına veri aktarımı yapılmamaktadır.`
      },
      {
        heading: "5. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi",
        body: `Kişisel verileriniz; web sitemiz üzerindeki başvuru formları, telefon ve e-posta yoluyla, açık rızanıza veya sözleşmenin kurulması ve ifası için gerekli olması hukuki sebeplerine dayanılarak toplanmaktadır.`
      },
      {
        heading: "6. Veri Sahibi Olarak Haklarınız",
        body: `KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:\n\n• Kişisel verilerinizin işlenip işlenmediğini öğrenme\n• İşlenmişse buna ilişkin bilgi talep etme\n• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme\n• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme\n• Eksik veya yanlış işlenmişse düzeltilmesini isteme\n• Silinmesini veya yok edilmesini isteme\n• Yapılan işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme\n• Münhasıran otomatik sistemlerle analiz edilmesi suretiyle ortaya çıkan sonuca itiraz etme\n• Hukuka aykırı işlenmesi nedeniyle uğradığı zararın giderilmesini talep etme\n\nBu haklarınızı kullanmak için info@dadikapida.com adresine yazılı olarak başvurabilirsiniz.`
      }
    ]
  },

  "gizlilik-politikasi": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "1. Genel Bilgi",
        body: `Dadı Kapıda olarak gizliliğinize büyük önem vermekteyiz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizden yararlandığınızda kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklamaktadır.`
      },
      {
        heading: "2. Topladığımız Bilgiler",
        body: `Web sitemizi kullanmanız sırasında aşağıdaki bilgileri toplayabiliriz:\n\n• Başvuru formu aracılığıyla bize ilettiğiniz ad, soyad, telefon, e-posta, şehir ve hizmet talebi bilgileri\n• Sitemizi ziyaret ettiğinizde otomatik olarak oluşan teknik veriler (IP adresi, tarayıcı türü, hangi sayfaları ne kadar süre ziyaret ettiğiniz)\n• Çerezler aracılığıyla toplanan tercih ve kullanım verileri`
      },
      {
        heading: "3. Bilgilerin Kullanımı",
        body: `Topladığımız bilgileri yalnızca şu amaçlarla kullanırız:\n\n• Başvurunuzu değerlendirmek ve sizinle iletişim kurmak\n• Size özel hizmet ve eşleştirme önerileri sunmak\n• Hizmet kalitemizi ölçmek ve geliştirmek\n• Yasal yükümlülüklerimizi yerine getirmek\n\nVerilerinizi üçüncü taraflara satmaz veya ticari amaçla paylaşmayız.`
      },
      {
        heading: "4. Veri Güvenliği",
        body: `Kişisel verileriniz, yetkisiz erişime karşı teknik ve idari güvenlik önlemleriyle korunmaktadır. Verileriniz şifreli bağlantılar (HTTPS) üzerinden iletilmekte, sunucularımızda güvenli ortamlarda saklanmaktadır. Veri ihlali durumunda yasal yükümlülükler çerçevesinde tarafınıza ve ilgili otoritelere bildirim yapılacaktır.`
      },
      {
        heading: "5. Veri Saklama Süresi",
        body: `Kişisel verileriniz, hizmet ilişkimiz devam ettiği süre boyunca ve akabinde yasal saklama yükümlülükleri kapsamında saklanır. Aktif bir hizmet ilişkisi bulunmayan kişilere ait veriler, 2 yılın sonunda silinir veya anonim hale getirilir.`
      },
      {
        heading: "6. Üçüncü Taraf Bağlantılar",
        body: `Web sitemiz üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından sorumlu değiliz. Bağlantı verdiğimiz sitelerin kendi gizlilik politikalarını incelemenizi öneririz.`
      },
      {
        heading: "7. İletişim",
        body: `Gizlilik politikamız hakkında sorularınız için info@dadikapida.com adresinden bize ulaşabilirsiniz.`
      }
    ]
  },

  "cerez-politikasi": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "1. Çerezler Nedir?",
        body: `Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. Sitemizi ziyaret ettiğinizde çerezler cihazınıza kaydedilir ve sonraki ziyaretlerinizde sizi tanımamızı sağlar.`
      },
      {
        heading: "2. Kullandığımız Çerez Türleri",
        body: `• Zorunlu Çerezler: Sitenin temel işlevlerini (oturum yönetimi, güvenlik) sürdürmek için gereklidir. Bu çerezler olmadan site düzgün çalışmaz ve devre dışı bırakılamaz.\n\n• Analitik Çerezler: Ziyaretçi sayısı, popüler sayfalar ve kullanım alışkanlıkları gibi istatistiksel verileri anlamamıza yardımcı olur. Kimlik tespitine olanak tanımaz.\n\n• Tercih Çerezleri: Dil ve görüntüleme tercihleriniz gibi seçimlerinizi hatırlamamızı sağlar.`
      },
      {
        heading: "3. Çerezleri Nasıl Kontrol Edebilirsiniz?",
        body: `Tarayıcı ayarlarınızdan çerezleri reddedebilir veya silebilirsiniz. Ancak zorunlu çerezlerin devre dışı bırakılması sitenin işlevselliğini olumsuz etkileyebilir.\n\nPopüler tarayıcılarda çerez ayarları:\n• Chrome: Ayarlar → Gizlilik ve güvenlik → Çerezler\n• Firefox: Seçenekler → Gizlilik ve Güvenlik\n• Safari: Tercihler → Gizlilik`
      },
      {
        heading: "4. Çerez Saklama Süresi",
        body: `Oturum çerezleri tarayıcınızı kapattığınızda silinir. Kalıcı çerezler ise belirli bir süre (genellikle 1–12 ay) boyunca cihazınızda kalır. Her çerez için süre, ilgili hizmetin gerekliliğine göre belirlenir.`
      }
    ]
  },

  "basvuru-sartlari": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "Genel Bilgilendirme",
        body: `Dadı Kapıda üzerinden gerçekleştireceğiniz başvuru, hizmetlerimizden yararlanmak için ilk adımı oluşturmaktadır. Başvurunuzun değerlendirilebilmesi için aşağıdaki koşulların sağlanması gerekmektedir.`
      },
      {
        heading: "Aile Başvuruları",
        body: `• Başvurunuzu eksiksiz ve doğru bilgilerle doldurmanız gerekmektedir.\n• Başvuru bilgilerinin doğruluğundan başvuruyu yapan kişi sorumludur.\n• Başvuru sonrası danışmanımız sizinle en kısa sürede iletişime geçecektir.\n• Hizmet ücreti, ihtiyaç analizi görüşmesi sonrasında netleştirilir ve taraflarca yazılı olarak onaylanır.\n• Dadı Kapıda, uygun aday bulma konusunda azami gayreti gösterse de belirli bir süre içinde yerleştirme garantisi vermez.`
      },
      {
        heading: "Dadı Adayı Başvuruları",
        body: `• Başvuruda verilen bilgiler (deneyim, referans, eğitim) doğru ve eksiksiz olmalıdır.\n• Yanlış veya yanıltıcı bilgi verilmesi başvurunun reddedilmesine neden olur.\n• Başvurusu değerlendirilen adaylar, danışman görüşmesine davet edilebilir.\n• Referans bilgilerinizin doğrulanabileceğini kabul etmiş olursunuz.\n• Yerleştirme gerçekleşmeden önce aile ile tanışma görüşmesi yapılır; bu görüşmenin sonucu taraflarca değerlendirilir.`
      },
      {
        heading: "Gizlilik",
        body: `Her iki tarafın (aile ve dadı adayı) kişisel bilgileri yalnızca eşleştirme süreci kapsamında ve karşılıklı onay dahilinde paylaşılır. Dadı Kapıda, tarafların kişisel verilerini KVKK hükümleri çerçevesinde işler ve korur.`
      },
      {
        heading: "Değişiklik Hakkı",
        body: `Dadı Kapıda, başvuru şartlarını önceden haber vermeksizin güncelleyebilir. Güncel şartlar her zaman bu sayfada yayımlanır.`
      }
    ]
  },

  "aday-aydinlatma-metni": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "1. Amaç",
        body: `Bu aydınlatma metni, Dadı Kapıda'ya dadı adayı olarak başvuran kişilerin kişisel verilerinin nasıl işlendiğini KVKK kapsamında açıklamak amacıyla hazırlanmıştır.`
      },
      {
        heading: "2. İşlenen Kişisel Veriler",
        body: `Ad, soyad, telefon, e-posta, doğum tarihi, şehir/ilçe bilgisi, iş deneyimi, referans kişi bilgileri, eğitim durumu, sağlık beyanı (ilk yardım sertifikası vb.), sigara kullanım durumu ve beklenen ücret bilgileri işlenebilmektedir.`
      },
      {
        heading: "3. İşleme Amacı ve Hukuki Sebebi",
        body: `Verileriniz; başvurunuzun değerlendirilmesi, uygun aile ile eşleştirme yapılması ve yerleştirme sürecinin yürütülmesi amacıyla, sözleşmenin kurulması ve ifası ile açık rıza hukuki sebeplerine dayanılarak işlenmektedir.`
      },
      {
        heading: "4. Veri Aktarımı",
        body: `Verileriniz yalnızca hizmet sürecindeki ilgili aileyle ve teknik altyapı sağlayıcılarımızla paylaşılır. Üçüncü taraflara ticari amaçla aktarım yapılmaz.`
      },
      {
        heading: "5. Haklarınız",
        body: `KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için info@dadikapida.com adresine başvurabilirsiniz.`
      }
    ]
  },

  "aile-aydinlatma-metni": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "1. Amaç",
        body: `Bu aydınlatma metni, Dadı Kapıda'ya aile başvurusu yapan veya hizmetimizden yararlanan kişilerin kişisel verilerinin nasıl işlendiğini KVKK kapsamında açıklamak amacıyla hazırlanmıştır.`
      },
      {
        heading: "2. İşlenen Kişisel Veriler",
        body: `Ad, soyad, telefon, e-posta, şehir/ilçe bilgisi, hizmet talebi içeriği (çocuk sayısı, tercih edilen çalışma düzeni, başlangıç tarihi) ve iletişim tercihleriniz işlenebilmektedir.`
      },
      {
        heading: "3. İşleme Amacı ve Hukuki Sebebi",
        body: `Verileriniz; hizmet talebinizin alınması, danışmanlık sürecinin yürütülmesi ve uygun dadı adayıyla eşleştirme yapılması amacıyla, sözleşmenin kurulması ve ifası ile meşru menfaat hukuki sebeplerine dayanılarak işlenmektedir.`
      },
      {
        heading: "4. Veri Aktarımı",
        body: `Verileriniz yalnızca eşleştirme sürecinde ilgili dadı adayıyla ve teknik altyapı sağlayıcılarımızla paylaşılır. Üçüncü taraflara ticari amaçla aktarım yapılmaz.`
      },
      {
        heading: "5. Haklarınız",
        body: `KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için info@dadikapida.com adresine başvurabilirsiniz.`
      }
    ]
  },

  "acik-riza-metni": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "Açık Rıza Beyanı",
        body: `Dadı Kapıda'ya başvuru yaparak veya hizmetlerinden yararlanarak aşağıdaki konularda açık rızanızı vermiş sayılırsınız:\n\n• Kişisel verilerinizin yukarıda belirtilen amaçlarla işlenmesi\n• Hizmet sürecinde ilgili taraflarla paylaşılması\n• Tanıtım ve bilgilendirme amaçlı elektronik ileti gönderilmesi (yalnızca bu seçeneği başvuru formunda onaylayanlar için)\n\nBu rızanızı dilediğiniz zaman info@dadikapida.com adresine yazılı bildirimle geri çekebilirsiniz. Rızanızın geri çekilmesi, geri çekme tarihinden önceki işlemlerin hukuka aykırı olduğu anlamına gelmez.`
      }
    ]
  },

  "kullanim-sartlari": {
    lastUpdated: "Haziran 2025",
    sections: [
      {
        heading: "1. Kabul",
        body: `Bu web sitesini kullanarak aşağıdaki kullanım şartlarını kabul etmiş olursunuz. Şartları kabul etmiyorsanız siteyi kullanmayınız.`
      },
      {
        heading: "2. Hizmetin Kapsamı",
        body: `Dadı Kapıda, aileler ile dadı adayları arasında danışmanlık ve eşleştirme hizmeti sunan bir platformdur. Site üzerinden gerçekleştirilen başvurular, hizmet sürecinin başlangıcını oluşturur; doğrudan istihdam ilişkisi kurulmaz.`
      },
      {
        heading: "3. Kullanıcı Yükümlülükleri",
        body: `• Siteyi yalnızca yasal amaçlarla kullanmayı kabul edersiniz.\n• Yanlış, yanıltıcı veya eksik bilgi vermemeyi taahhüt edersiniz.\n• Site altyapısına zarar verecek eylemlerden kaçınırsınız.\n• Başkalarının kişisel verilerini izinsiz paylaşmazsınız.`
      },
      {
        heading: "4. Fikri Mülkiyet",
        body: `Sitedeki tüm içerik (metin, görsel, logo, tasarım) Dadı Kapıda'ya aittir ve izinsiz kopyalanamaz, dağıtılamaz veya ticari amaçla kullanılamaz.`
      },
      {
        heading: "5. Sorumluluk Sınırı",
        body: `Dadı Kapıda, site kullanımından kaynaklanabilecek dolaylı zararlardan sorumlu tutulamaz. Bilgilerin güncelliği ve doğruluğu için azami özen gösterilmekle birlikte kesinlik garanti edilmez.`
      },
      {
        heading: "6. Değişiklikler",
        body: `Kullanım şartları önceden haber verilmeksizin güncellenebilir. Güncellenen şartlar yayımlandığı andan itibaren geçerlidir.`
      },
      {
        heading: "7. Uygulanacak Hukuk",
        body: `Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.`
      }
    ]
  }
};
