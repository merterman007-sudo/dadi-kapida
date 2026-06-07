# Dadi Kapida CRM ve Web Sitesi Teslim / Kullanım Raporu

Bu rapor, Dadi Kapida web sitesi ve CRM sistemi için yapılan çalışmaları, mevcut iş akışlarını ve sistemin günlük kullanım şeklini özetlemek için hazırlandı. Amaç; sistemi teslim alacak ekibin hangi ekranı ne için kullanacağını, siteden gelen başvuruların CRM'de nereye düştüğünü ve SEO tarafında hangi altyapının kurulduğunu net şekilde anlatmaktır.

## 1. Genel Durum

Dadi Kapida için iki ana yapı kuruldu:

- Public web sitesi: `dadikapida.com`
- Operasyon ve yönetim paneli: `crm.dadikapida.com`

Web sitesi; aile başvurusu, personel başvurusu, iletişim talepleri, geri arama talepleri, hizmet sayfaları, şehir bazlı SEO sayfaları, blog, SSS, yasal sayfalar ve canlı destek akışlarını kapsar.

CRM paneli; başvuru yönetimi, aile yönetimi, personel profilleri, talepler, eşleştirme, görüşmeler, görevler, evraklar, referanslar, yerleştirmeler, finans, mesajlar, raporlar, site/CMS ayarları ve kullanıcı/rol yönetimini kapsar.

## 2. Web Sitesinden CRM'e Gelen Akışlar

### Personel Başvurusu

Web sitesindeki `Personel Başvurusu` formu doldurulduğunda kayıt CRM'de `Başvurular` ekranına düşer.

Kullanım akışı:

1. CRM panelinde `Başvurular` ekranına girilir.
2. `Personel Başvuruları` sekmesi açılır.
3. Başvuru incelenir.
4. Uygunsa `Adaya Dönüştür` aksiyonu kullanılır.
5. Kayıt artık `Personel Profilleri` ekranında detaylı personel profili olarak görünür.
6. Personel profilinde çalışma tercihleri, deneyim, dil bilgisi, referanslar, evraklar ve yerleştirme geçmişi takip edilir.

Bu akışın amacı, siteden gelen her personel başvurusunun kalıcı olarak CRM'de izlenebilmesini sağlamaktır. Başvuru dönüştürüldükten sonra personel profili operasyonel havuza alınır.

### Aile Başvurusu

Web sitesindeki `Aile Başvurusu` formu doldurulduğunda CRM'de aile lead kaydı ve aile talebi oluşur.

Kullanım akışı:

1. CRM panelinde `Başvurular` ekranına girilir.
2. `Aile Başvuruları` sekmesi açılır.
3. Başvuru detayına `Detay` butonuyla gidilir.
4. Oluşan aile kaydı `Aileler` ekranında görünür.
5. Ailenin ihtiyacı `Talepler` ekranında açık talep olarak takip edilir.
6. Danışman bu talep üzerinden uygun personelleri kısa listeye alır, görüşme planlar ve yerleştirme sürecini yürütür.

Aile başvurusunda ad soyad, telefon, şehir, hizmet türü, çalışma saatleri, maaş bütçesi ve not alanları CRM'e aktarılır.

### İletişim Formu / Mesaj Gönderme

Web sitesindeki `İletişim` sayfasından mesaj gönderildiğinde kayıt CRM içinde görünür hale getirildi.

Kullanım akışı:

1. CRM panelinde `Mesajlar` ekranına girilir.
2. Üst bölümde `Web Sitesi Talepleri` alanı görülür.
3. İletişim formu, geri arama talebi ve online görüşme talepleri burada listelenir.
4. Kayıtta ad soyad, telefon, e-posta, uygun zaman ve mesaj içeriği görüntülenir.
5. Operasyon ekibi bu bilgiyi kullanarak müşteriye dönüş yapar.

Aynı kayıtlar ayrıca `Site` ekranındaki `Son Web Başvuruları` bölümünde de arşiv olarak görülebilir.

### Geri Arama ve Online Görüşme Talepleri

Geri arama ve online görüşme talepleri de web form kaydı olarak alınır.

Kullanım akışı:

1. CRM panelinde `Mesajlar` ekranı açılır.
2. `Web Sitesi Talepleri` bölümünden talep incelenir.
3. Uygun danışman müşteriyi arar veya görüşme randevusu oluşturur.
4. Gerekirse `Görüşmeler` ekranından görüşme kaydı açılır.
5. Takip gerekiyorsa `Görevler` ekranında danışmana görev atanır.

### Tawk.to Canlı Destek

Tawk.to canlı destek web sitesine entegre edildi. Ziyaretçi siteden canlı destek başlatabilir.

Kullanım akışı:

1. Tawk.to paneli açık tutulur.
2. Gelen canlı mesaj Tawk.to panelinden yanıtlanır.
3. Müşteriden ad, telefon, şehir ve ihtiyaç bilgisi alınır.
4. Eğer başvuruya dönüştürülecekse CRM'de aile veya personel kaydı oluşturulur.

Not: Tawk.to kendi panelinde çalışır. CRM'e otomatik konuşma aktarımı şu aşamada yapılmadı. Gerekirse sonraki fazda Tawk webhook entegrasyonu eklenebilir.

## 3. CRM Ekranları ve Kullanım Amaçları

### Panel

Genel operasyon özetidir. Başvurular, aileler, talepler, finans ve son aktiviteler tek bakışta izlenir.

### Başvurular

Siteden gelen aile ve personel başvuruları burada takip edilir.

- Personel başvurusu uygun bulunursa personel profiline dönüştürülür.
- Aile başvurusu aile ve talep akışına taşınır.
- Reddedilen veya mükerrer kayıtlar ayrıca işaretlenebilir.

### Personel Profilleri

Personel havuzunun ana ekranıdır.

Personel profilinde şu bilgiler takip edilir:

- kimlik ve iletişim bilgileri
- şehir / ilçe / adres
- çalışabileceği şehirler
- eğitim bilgisi
- deneyim yılı
- maaş beklentisi
- sigara durumu
- ilk yardım sertifikası
- çalışma tercihleri
- yatılı / gündüzlü / gece / hafta sonu uygunluğu
- diller
- deneyim kayıtları
- referanslar
- evraklar
- yerleştirme geçmişi

Fotoğraf yükleme bilinçli olarak bu faza dahil edilmedi. İlk etapta operasyonel veri kalitesi önceliklendirildi.

### Aileler

Aile kayıtları burada tutulur. Ailenin iletişim bilgileri, statüsü ve ilişkili talepleri buradan takip edilir.

### Talepler

Ailelerin personel ihtiyacı burada takip edilir. Her talep için şehir, hizmet tipi, çalışma modeli, bütçe, notlar ve eşleşme süreci yönetilir.

### Kısa Liste

Aileye önerilecek adaylar burada gruplanır. Danışman, uygun personelleri talebe göre kısa listeye ekleyebilir.

### Görüşmeler

Aile görüşmeleri, personel görüşmeleri, referans aramaları ve takip görüşmeleri burada planlanır.

### Görevler

Danışmanların takip etmesi gereken işler burada tutulur. Örneğin:

- yeni aile başvurusunu arama
- eksik evrak hatırlatma
- referans kontrolü
- görüşme sonrası takip

### Evraklar

Personel belgeleri ve belge kontrol durumları burada izlenir.

### Referanslar

Personel referans kayıtları ve referans kontrol süreci burada takip edilir.

### Yerleştirmeler

Aile ve personel arasındaki kabul edilen iş ilişkileri burada tutulur. Yerleştirme aktif, tamamlandı, iptal edildi veya değişim gibi statülerle izlenebilir.

### Finans

Gelir, fatura, ödeme ve gider takibi için kullanılır. Adaya yapılan ödeme ve operasyonel giderler finans ekranında yönetilir.

### Mesajlar

Manuel mesaj kayıtları ve web sitesinden gelen iletişim talepleri burada izlenir.

### Site

Web sitesi yönetim ekranıdır. Buradan:

- logo
- marka adı
- telefon
- WhatsApp
- e-posta
- site görselleri
- sayfalar
- SEO başlık/açıklamaları
- web form kayıtları
- entegrasyon logları

yönetilebilir.

### Raporlar

Başvuru, personel, aile, talep, yerleştirme ve finans verileri raporlanır.

### Denetim Kaydı

Sistemdeki kritik işlemler loglanır. Bu ekran operasyon takibi ve güvenlik açısından önemlidir.

### Kullanıcı ve Yetki

Kullanıcılar, roller ve yetkiler yönetilir. CRM iç sistem olduğu için çok kiracılı bir yapı kurulmadı; tek şirket operasyonuna göre tasarlandı.

## 4. Web Sitesi Kapsamı

Web sitesinde şu ana yapılar hazırlandı:

- premium ana sayfa
- aile başvurusu
- personel başvurusu
- iletişim formu
- geri arama talebi
- online görüşme talebi
- hizmet sayfaları
- şehir bazlı hizmet sayfaları
- hizmet x şehir SEO sayfaları
- blog
- SSS
- hakkımızda
- güvenlik ve doğrulama
- süreç anlatımı
- neden biz
- KVKK
- gizlilik politikası
- çerez politikası
- kullanım şartları
- WhatsApp butonu
- Tawk.to canlı destek
- mobil CTA alanları

## 5. SEO Çalışmaları

SEO tarafında teknik altyapı kuruldu.

Yapılanlar:

- Google Search Console doğrulaması yapıldı.
- Sitemap üretimi aktif hale getirildi.
- `robots.txt` yapılandırıldı.
- Ana sayfa, hizmet sayfaları, blog sayfaları ve şehir sayfaları için metadata düzenlendi.
- Canonical URL yapısı kuruldu.
- Open Graph ve sosyal paylaşım metadata'sı eklendi.
- Hizmet x şehir sayfaları oluşturuldu.
- Eski şehir URL'leri yeni şehir sayfalarına kanonik olarak bağlandı.
- Sitemap içindeki tekrar ve kırık URL riskleri temizlendi.

SEO için devam edilmesi gerekenler:

- Search Console üzerinden `sitemap.xml` gönderilmeli.
- Ana sayfa ve önemli sayfalar için URL Inspection ile indeksleme istenmeli.
- Blog içerikleri düzenli artırılmalı.
- Her hizmet ve şehir sayfasına özgün metinler zamanla zenginleştirilmeli.
- Gerçek müşteri yorumları ve başarı hikayeleri eklenmeli.
- Görsellerin alt metinleri içeriklere göre güçlendirilmeli.
- Yerel SEO için Google Business Profile kurulmalı veya optimize edilmeli.
- Düzenli olarak Search Console'dan sorgu, tıklama, gösterim ve indeks hataları takip edilmeli.

Not: SEO bir anda zirve garantisi veren bir çalışma değildir. Teknik altyapı doğru kuruldu; kalıcı sonuç için içerik, yerel otorite, gerçek kullanıcı sinyali ve düzenli takip gerekir.

## 6. Günlük Operasyon Önerisi

Her gün yapılması önerilen kontroller:

1. `Başvurular` ekranından yeni aile ve personel başvurularını kontrol etmek.
2. `Mesajlar` ekranından web sitesi iletişim taleplerini kontrol etmek.
3. Tawk.to panelinde kaçırılan canlı destek mesajı var mı bakmak.
4. Yeni aile taleplerini danışmana atamak.
5. Uygun personel profillerini kısa listeye almak.
6. Eksik evrak ve referans kontrollerini `Görevler` üzerinden takip etmek.
7. Yerleştirme sonrası finans ve ödeme kayıtlarını güncellemek.

## 7. Sistemde Bulunan Güvenlik ve Operasyon Kontrolleri

- CRM giriş sistemi vardır.
- Yetki bazlı endpoint koruması uygulanmıştır.
- Public formlarda rate limit vardır.
- Honeypot ve hızlı gönderim kontrolü vardır.
- Hassas IP bilgisi doğrudan tutulmaz, hashlenir.
- Audit log yapısı vardır.
- CRM alanı public site dışında ayrı subdomain altında çalışır.
- Search Console ve SEO hedefi sadece public site içindir; CRM indekslenmemelidir.

## 8. Bilinçli Olarak Sonraki Fazlara Bırakılanlar

İlk teslimde operasyonel omurga önceliklendirildi. Aşağıdaki işler sonraki fazlarda planlanabilir:

- Tawk.to konuşmalarını otomatik CRM'e aktarma
- e-posta / SMS / WhatsApp otomatik bildirim entegrasyonu
- personel fotoğraf yükleme ve galeri yönetimi
- daha gelişmiş belge saklama ve signed URL akışı
- gelişmiş muhasebe veya banka entegrasyonu
- gelişmiş dashboard KPI ekranları
- gelişmiş mobil CRM deneyimi
- gelişmiş içerik editörü
- Search Console verilerinin CRM paneline rapor olarak çekilmesi

## 9. Teslim Özeti

Bu çalışmayla Dadi Kapida için sadece bir web sitesi değil, başvurudan yerleştirmeye kadar operasyonu takip edebilen bir CRM altyapısı kuruldu.

Siteden gelen aile başvuruları aile ve talep akışına, personel başvuruları başvuru ve personel profili akışına, iletişim/geri arama talepleri ise mesaj ve site başvuruları alanına düşmektedir.

CRM paneli; aile, personel, talep, eşleştirme, görüşme, görev, evrak, referans, yerleştirme, finans, mesaj, rapor ve site yönetimi süreçlerini tek merkezde toplamaktadır.

SEO tarafında temel teknik altyapı hazırdır. Search Console kurulumu yapılmış, sitemap/robots/canonical/metadata yapısı hazırlanmış ve şehir-hizmet sayfalarıyla arama motoru görünürlüğü için güçlü bir temel oluşturulmuştur.
