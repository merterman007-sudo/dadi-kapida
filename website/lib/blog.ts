export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readingTime: number;
  publishedAt: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "yatili-dadi-secerken-nelere-dikkat-edilmeli",
    title: "Yatılı Dadı Seçerken Nelere Dikkat Edilmeli?",
    excerpt: "Ailelerin yatılı dadı kararı vermeden önce göz önünde bulundurması gereken temel başlıklar.",
    image: "/images/uploads/dadi-process-755049.jpg",
    category: "Dadı Seçme Rehberi",
    readingTime: 6,
    publishedAt: "2026-05-15",
    content: `
<h2>Yatılı Dadı Nedir, Kimler İçin Uygundur?</h2>
<p>Yatılı dadı, evin içinde ikamet ederek tam zamanlı çocuk bakımı ve ev desteği sağlayan profesyonel bir çalışandır. Özellikle her iki ebeveynin yoğun çalışma temposuna sahip olduğu, uzun mesai gerektiren mesleklerin icra edildiği ya da anne-babanın seyahat yoğunluğunun yüksek olduğu ailelerde tercih edilir. Yenidoğan döneminde gece bakımına ihtiyaç duyan aileler için de yatılı çalışma modeli son derece avantajlı bir seçenektir.</p>

<h2>Referans Kontrolü Neden Vazgeçilmezdir?</h2>
<p>Yatılı bir çalışanı evinize kabul etmek, gündüzlü bir düzenlemeye kıyasla çok daha kapsamlı bir güven değerlendirmesi gerektirir. Daha önce hangi ailelerde çalıştığı, bu ailelerle ne kadar süre birlikte olduğu ve ayrılış nedenlerinin ne olduğu gibi sorular referans görüşmeleri sırasında mutlaka sorgulanmalıdır. Referans verecek kişinin adayı yakından tanıması ve somut geri bildirim verebilecek bir pozisyonda olması önemlidir.</p>

<blockquote>İyi bir referans görüşmesi, adayın sadece ne yaptığını değil, nasıl bir insan olduğunu da ortaya koyar.</blockquote>

<h2>Ev İçi Kural ve Sınırların Belirlenmesi</h2>
<p>Yatılı çalışma modelinde özel alanın nerede başlayıp nerede bittiğini, yemek düzenini, dinlenme günlerini ve ev içinde uygulanacak kuralları başlangıçta net bir şekilde belirlemek gerekir. Bu konuları baştan konuşmak hem adayın hem de ailenin beklentilerini hizalayarak uzun vadeli bir uyum zemini oluşturur. İlişkinin sağlıklı sürmesi büyük ölçüde bu ilk kurulum aşamasına bağlıdır.</p>

<h2>Deneyim ile Aile Uyumu Arasındaki Denge</h2>
<p>Yılların verdiği deneyim değerlidir; ancak aile kültürü, ev düzeni ve çocuğun kişiliğiyle uyum bundan daha az önemli değildir. Bazı aileler için deneyimli ama farklı bir ev anlayışından gelen bir aday, daha kısa deneyimli ancak aile değerleriyle örtüşen bir adaydan daha uyumsuz olabilir. Bu nedenle değerlendirme sürecinin hem deneyimi hem de kişilik uyumunu birlikte ele alması gerekir.</p>

<h2>Yasal ve Mali Yükümlülükler</h2>
<p>Yatılı dadıyla çalışmak, yasal bir istihdam ilişkisi doğurur. Sigorta, ücret, fazla mesai ve izin haklarının belirlendiği yazılı bir iş sözleşmesi hazırlamak hem aile hem de çalışan için koruyucu bir çerçeve oluşturur. Sözleşme olmadan yürütülen ilişkilerde anlaşmazlık riskinin arttığı bilinmektedir.</p>

<h2>Sonuç</h2>
<p>Yatılı dadı seçimi; referans kontrolü, kişilik uyumu, ev sınırlarının netleştirilmesi ve yasal çerçevenin kurulması gibi birbirine bağlı adımlardan oluşur. Bu süreci doğru yönetmek, uzun vadeli ve sağlıklı bir çalışma ilişkisinin temelini atar.</p>
    `
  },
  {
    slug: "gunduzlu-dadi-ile-calismanin-avantajlari",
    title: "Gündüzlü Dadı ile Çalışmanın Avantajları",
    excerpt: "Ev düzenine ve çocukların günlük akışına uyum sağlayan gündüzlü çalışma modelinin avantajları.",
    image: "/images/uploads/dadi-hero-6951492.jpg",
    category: "Gündüzlü Dadı",
    readingTime: 5,
    publishedAt: "2026-05-22",
    content: `
<h2>Gündüzlü Dadı Modeli Nasıl İşler?</h2>
<p>Gündüzlü dadı, genellikle sabah belirli bir saatte eve gelir ve akşam çalışma saatinin sonunda ayrılır. Bu düzenleme, ebeveynlerin tam zamanlı çalışırken çocuklarının bakımını profesyonel ellere bırakmasına olanak tanır. Hafta içi tam zamanlı, hafta içi yarım gün ya da belirli günlerle sınırlı olmak üzere farklı sıklık ve süre seçenekleriyle uygulanabilir.</p>

<h2>Ev Sınırlarının Korunması</h2>
<p>Yatılı çalışma modelinin aksine, gündüzlü düzende çalışan günün sonunda eve döner. Bu durum ailenin özel alanını büyük ölçüde korumasını sağlar. Çocukların ebeveynlerinin yokluğunda düzenli bakım almasını mümkün kılarken ev ortamı üzerinde kontrol tamamen ailede kalır.</p>

<h2>Çocuk Rutinine Uyum</h2>
<p>Düzenli saatlerde eve gelen ve ayrılan bir çalışan, çocuğun günlük rutinini oluşturmak açısından da olumlu bir etki yaratır. Uyku düzeni, öğünler, oyun zamanları ve ev içi kurallar tutarlı biçimde uygulandığında çocukların gelişim süreçleri üzerinde olumlu sonuçlar görülür. Gündüzlü dadının bu rutinin aktif bir parçası olması, başarılı bir uyum için kritik önem taşır.</p>

<blockquote>Düzenliliğin çocuk gelişimine katkısı uzun süreli araştırmalarla desteklenmektedir. Tutarlı bakım veren varlığı bu düzenin en önemli unsurudur.</blockquote>

<h2>Maliyet Avantajı</h2>
<p>Yatılı çalışmaya kıyasla gündüzlü çalışma genellikle daha düşük maliyetlidir; zira barınma ve üç öğün yemek gibi ek kalemler bulunmaz. Bu nedenle özellikle çocuğu büyük olmayan ya da gece bakımına ihtiyaç duymayan aileler için gündüzlü model hem pratik hem de ekonomik bir tercih olabilir.</p>

<h2>Kimler İçin Uygundur?</h2>
<p>Gündüzlü dadı modeli; çalışma saatleri öngörülebilir olan, eve birinin her gece dönmesinin zorunlu olmadığı ve çocukların gece bakımına ihtiyaç duymadığı aileler için idealdir. Özellikle okul çağındaki çocukların okul sonrası bakımını üstlenecek biri aranıyorsa gündüzlü model esnekliği nedeniyle öne çıkar.</p>
    `
  },
  {
    slug: "dadi-referans-kontrolu-nasil-yapilir",
    title: "Dadı Referans Kontrolü Nasıl Yapılır?",
    excerpt: "Güvenli yerleştirme için referans kontrolünün önemi ve doğru sorular.",
    image: "/images/uploads/dadi-trust-1116050.jpg",
    category: "Güvenlik ve Referans Kontrolü",
    readingTime: 7,
    publishedAt: "2026-05-28",
    content: `
<h2>Referans Kontrolü Neden Bu Kadar Önemlidir?</h2>
<p>Referans kontrolü, bir adayın yalnızca özgeçmişindeki bilgilerin doğrulanmasından ibaret değildir. Adayın gerçek çalışma biçimini, çocuklarla kurduğu ilişkiyi, sorunlarla başa çıkma yöntemlerini ve aile içi iletişim tarzını anlamamızı sağlayan en değerli süreçlerden biridir. Referans görüşmesi yapılmadan alınan kararlar, sonradan düzeltilmesi güç uyumsuzluklara yol açabilir.</p>

<h2>Kimden Referans İstenmeli?</h2>
<p>Referans verecek kişinin adayı profesyonel bağlamda doğrudan tanıması gerekmektedir. Daha önceki iş verenler, özellikle adayın bakımını üstlendiği çocukların aileleri, en güvenilir referans kaynakları arasında yer alır. Yakın aile üyeleri ya da kişisel arkadaşlar bu süreçte güvenilir kaynak sayılmaz.</p>

<blockquote>Gerçek bir referans görüşmesinde somut bir örnek istenmesi, adayın gerçek davranış biçimini ortaya koymanın en etkili yoludur.</blockquote>

<h2>Referans Görüşmesinde Sorulması Gereken Sorular</h2>
<ul>
  <li>Adayla ne kadar süre birlikte çalıştınız ve bu süreç nasıl sonlandı?</li>
  <li>Adayı tekrar işe alır mıydınız? Neden ya da neden almaz?</li>
  <li>Çocuklarla nasıl bir ilişki kurdu?</li>
  <li>Zor bir durum yaşandığında nasıl davrandı?</li>
  <li>Zaman yönetimi ve güvenilirliği konusunda deneyiminiz nedir?</li>
  <li>Ailenize karşı iletişimi nasıldı? Sorunları açıkça paylaştı mı?</li>
</ul>

<h2>Referans Vermeyen Adaylarla Nasıl Hareket Edilmeli?</h2>
<p>Hiç referans gösteremeyen ya da yalnızca kişisel referans sunabilen adaylarla dikkatli ilerlenmesi önerilir. Bu durumun bazı makul nedenleri olabilir; ancak bu nedenlerin aday tarafından açıkça açıklanması beklenir. Açıklayıcı bir gerekçe yoksa referans eksikliği bir uyarı işareti olarak değerlendirilmelidir.</p>

<h2>Belge Doğrulama ile Referans Kontrolünü Birleştirin</h2>
<p>Kimlik belgesi, daha önceki iş sözleşmeleri ya da sağlık belgeleri gibi dokümanların incelenmesi, referans kontrolüyle birlikte tamamlayıcı bir güven çerçevesi oluşturur. Bu iki adımın bir arada yürütülmesi, yerleştirme kararının sağlıklı temeller üstüne oturmasını sağlar.</p>
    `
  },
  {
    slug: "bebek-bakicisi-secerken-sorulmasi-gereken-sorular",
    title: "Bebek Bakıcısı Seçerken Sorulması Gereken Sorular",
    excerpt: "Bebek bakımında deneyim, rutin ve iletişim kalitesini anlamaya yardımcı sorular.",
    image: "/images/uploads/dadi-trust-1116050.jpg",
    category: "Bebek Bakımı",
    readingTime: 6,
    publishedAt: "2026-06-01",
    content: `
<h2>Bebek Bakıcısı Seçimi Neden Özeldir?</h2>
<p>Bebekler, çocuğun büyüme dönemlerinin en hassas evresini temsil eder. Bu dönemde çocuk tamamen başkasının bakımına muhtaçtır ve yanlış bir tercih, hem bebek hem de aile için ciddi sonuçlar doğurabilir. Bu nedenle bebek bakıcısı seçiminde sorulacak sorular ve değerlendirme kriterleri daha ileri yaştaki çocuklar için geçerli olanlardan farklılaşır.</p>

<h2>Deneyim ve Spesifik Bilgi</h2>
<p>Daha önce kaç aylık ya da kaç yaşındaki bebeklere baktığını, uyku eğitimi konusundaki yaklaşımını, emzirme sürecinde nasıl destek olduğunu ve yenidoğan bakımına özgü uygulamaları ne ölçüde bildiğini sormak bu değerlendirmenin temelini oluşturur. İlk yardım ve CPR (kalp masajı) eğitimi almış olmak küçük bir artı değil, kritik bir niteliktir.</p>

<blockquote>Bir bebek bakıcısının "Ne yaparsınız?" sorusuna verdiği yanıtlar, teorik bilgisini yansıtır. "Geçmişte nasıl yaptınız?" sorusu ise gerçek deneyimi ortaya çıkarır.</blockquote>

<h2>Bakıcının Kendi Yaklaşımı</h2>
<ul>
  <li>Bebek ağladığında ilk tepkiniz ne olur?</li>
  <li>Uyku rutini oluşturmaya nasıl yaklaşırsınız?</li>
  <li>Beslenme günlüğü tutar mısınız?</li>
  <li>Herhangi bir tıbbi durum yaşansaydı ne yapardınız?</li>
  <li>Ailelerle iletişimi ne sıklıkta ve nasıl sürdürürsünüz?</li>
</ul>

<h2>Pratik ve Lojistik Sorular</h2>
<p>Çalışma saatleri, fazla mesai esnekliği, hastalık durumunda politikası ve çocukla dışarı çıkma kuralları hakkında net beklentiler oluşturmak, bakıcı-aile uyumunu baştan sağlar. Özellikle gece bakımı gerektirecekse bu konuların ayrıntılı biçimde ele alınması şarttır.</p>

<h2>Deneme Süreci Önerilir</h2>
<p>Bebek bakıcısı seçiminde görüşmeler kadar kısa bir deneme dönemi de değerlidir. Bebeğin adayla nasıl etkileşime girdiğini, adayın ani bir durumda nasıl tepki verdiğini ve ailenin güven düzeyini yerinde gözlemlemek, en doğru kararı vermenize yardımcı olur.</p>
    `
  },
  {
    slug: "ilk-kez-dadi-calistiracak-aileler-icin-baslangic-rehberi",
    title: "İlk Kez Dadı Çalıştıracak Aileler İçin Başlangıç Rehberi",
    excerpt: "Beklentileri netleştirme, görev tanımı ve ilk görüşme hazırlığı için pratik rehber.",
    image: "/images/uploads/dadi-process-755049.jpg",
    category: "Aileler İçin Rehber",
    readingTime: 8,
    publishedAt: "2026-06-03",
    content: `
<h2>Başlamadan Önce: İhtiyacınızı Netleştirin</h2>
<p>İlk kez dadı arayacak bir aile için sürecin en kritik adımı, neye ihtiyaç duyduğunuzu içten bir değerlendirmeyle ortaya koymaktır. Yatılı mı, gündüzlü mü? Çocukların yaş aralığı ne? Yalnızca çocuk bakımı mı, yoksa ev desteği de dahil mi? Şehir içi seyahat beklentisi var mı? Bu soruların net yanıtı olmadan doğru adayı bulmak ve değerlendirmek çok daha zorlaşır.</p>

<h2>Görev Tanımını Yazılı Hale Getirin</h2>
<p>Dadıyla net bir çalışma çerçevesi oluşturabilmek için görev tanımını yazılı olarak hazırlamak büyük kolaylık sağlar. Çalışma saatleri, günlük sorumluluklar, hangi görevlerin kapsam içinde hangilerin dışında olduğu, tatil ve hastalık politikası gibi konular baştan belirlenmeli ve taraflarca okunarak imzalanmalıdır.</p>

<blockquote>Belirsizlik, çalışma ilişkisindeki uyumsuzlukların en büyük kaynağıdır. Yazılı bir çerçeve bu belirsizliği en aza indirir.</blockquote>

<h2>Görüşmeye Nasıl Hazırlanılır?</h2>
<p>İlk görüşme hem adayı hem de ailenin beklentilerini değerlendirme fırsatıdır. Görüşme öncesinde adayın özgeçmişini dikkatlice inceleyin, referans isimlerini not edin ve sormak istediğiniz soruları yazılı olarak hazırlayın. Görüşme sırasında adayın çocuklarla nasıl etkileşime girdiğini, sizi dinleyip dinlemediğini ve sorularını nasıl yanıtladığını gözlemleyin.</p>

<h2>Çocuklarla Tanışma Süreci</h2>
<p>Adayı seçtikten sonra, çalışmaya başlamadan önce çocuklarla kısa bir tanışma seansı düzenlemek büyük fayda sağlar. Bu süreçte aday, çocuğun kişiliğini ve rutinini öğrenir; çocuk ise yeni kişiyle aile ortamında tanışır. Aniden başlayan bir çalışma ilişkisi yerine bu geçiş dönemi, uyum sürecini hem çocuk hem de çalışan için çok daha kolay hale getirir.</p>

<h2>İlk Haftada Dikkat Edilmesi Gerekenler</h2>
<ul>
  <li>Günlük iletişimi kısa notlarla destekleyin (ne yedi, ne zaman uyudu, nasıl geçti).</li>
  <li>Beklenmedik durumlar için iletişim protokolü belirleyin.</li>
  <li>Çocukla ilgili önemli bilgileri (alerji, sağlık durumu, rutin) liste halinde verin.</li>
  <li>İlk haftanın sonunda kısa bir değerlendirme görüşmesi yapın.</li>
</ul>

<h2>Uzun Vadeli İlişkinin Temelleri</h2>
<p>Başarılı bir dadı-aile ilişkisi tek seferlik doğru seçimle değil, süregelen açık iletişimle kurulur. Düzenli geri bildirim, ücret artışları ve çalışma koşullarının zaman zaman gözden geçirilmesi bu ilişkinin sürdürülebilirliğini destekler.</p>
    `
  },
  {
    slug: "istanbulda-yatili-dadi-arayan-aileler-icin-rehber",
    title: "İstanbul'da Yatılı Dadı Arayan Aileler İçin Rehber",
    excerpt: "İstanbul'da yatılı çalışma düzeni, bölge beklentileri ve aday değerlendirme adımları.",
    image: "/images/uploads/dadi-hero-6951492.jpg",
    category: "İstanbul Dadı Rehberi",
    readingTime: 7,
    publishedAt: "2026-06-03",
    content: `
<h2>İstanbul'da Yatılı Dadı Piyasası</h2>
<p>İstanbul, Türkiye'nin en büyük şehri olarak dadı yerleştirme açısından hem en aktif talep hem de en geniş aday havuzuna sahip konumdadır. Özellikle Beşiktaş, Şişli, Kadıköy, Sarıyer ve Ataşehir gibi ilçelerde yoğunlaşan orta-üst segment aileler için yatılı dadı talebi giderek artmaktadır. Bu durum hem fırsatlar hem de rekabet açısından seçici davranmayı zorunlu kılar.</p>

<h2>İstanbul'da Yatılı Çalışma Koşulları</h2>
<p>İstanbul'da yatılı dadı çalıştırmanın temel koşulları arasında ev içinde özel oda ve banyoya sahip yaşam alanı sağlanması yer alır. Bu durum, aday profili açısından belirleyici bir faktördür. Yeterli kişisel alan sağlanmayan ortamlarda uzun süreli çalışma ilişkisi kurmanın güçleştiği bilinmektedir. Gizlilik, odalarda kişisel eşyaların güvenliği ve ev içi kuralların baştan netleştirilmesi de bu sürecin ayrılmaz parçalarıdır.</p>

<blockquote>İstanbul'da yatılı dadı ile kurulacak ilişki; sadece bir istihdam değil, uzun süre aynı evi paylaşacak bir birliktelik anlamına gelir. Bu gerçek, seçim sürecini daha dikkatli yönetmeyi gerektirir.</blockquote>

<h2>Bölgeye Göre Aday Tercihleri</h2>
<p>Beşiktaş, Sarıyer ve Levent gibi ilçelerde yaşayan aileler genellikle şehrin farklı bölgelerinden gelen adaylarla çalışmaya açık olduğu için aday havuzu daha geniş tutulabilir. Anadolu yakasındaki ailelerde ise çevre ilçelerde ikamet eden adaylara öncelik verme eğilimi daha belirgindir. Bölgenin sağladığı ulaşım kolaylığı, adayın şehir içindeki hareketliliğini ve günlük rahatlığını doğrudan etkiler.</p>

<h2>Maaş ve Yasal Haklar</h2>
<p>İstanbul'da yatılı dadı maaşları deneyim, barınma koşulları, görev kapsamı ve ilçeye göre önemli farklılıklar gösterir. Güncel asgari ücret düzenlemeleri, sigorta yükümlülükleri ve yıllık izin haklarının bilinmesi ailelerin yasal risklere karşı korunmasını sağlar. Resmi istihdam çerçevesi dışında yürütülen ilişkiler her iki taraf için de güvencesizlik yaratır.</p>

<h2>Profesyonel Danışmanlığın Önemi</h2>
<p>Kendi ağınız aracılığıyla yürütülen aday araştırmaları, referans kontrolü ve belge doğrulama adımlarını çoğu zaman atlama ya da eksik yapma riskini beraberinde getirir. Profesyonel bir danışman eşliğinde yürütülen süreç, bu adımların sistematik biçimde tamamlanmasını sağlar ve ailenin zaman maliyetini önemli ölçüde düşürür.</p>
    `
  },
  {
    slug: "dadi-maasi-ne-kadar-olmali-2026",
    title: "2026'da Dadı Maaşı Ne Kadar Olmalı?",
    excerpt: "Yatılı ve gündüzlü dadı maaşları, deneyim ve çalışma koşullarına göre nasıl şekillenir? Güncel rehber.",
    image: "/images/uploads/dadi-trust-1116050.jpg",
    category: "Maaş ve Çalışma Düzeni",
    readingTime: 5,
    publishedAt: "2026-06-02",
    content: `
<h2>Dadı Maaşını Belirleyen Faktörler</h2>
<p>Dadı maaşı; çalışma modeli (yatılı/gündüzlü), deneyim yılı, çalıştığı şehir ve ilçe, sorumluluk kapsamı ve çocuk sayısı gibi birbirine bağlı değişkenlere göre şekillenir. Bu nedenle "standart bir dadı maaşı" yerine aile özeline göre değerlendirme yapmak daha sağlıklıdır.</p>

<h2>Yatılı vs. Gündüzlü Fark</h2>
<p>Yatılı dadılar evin içinde ikamet ettiğinden barınma ve yemek gideri aileden karşılanır. Bu durum brüt maaşı düşürmez; ancak toplam çalışma saatleri ve esneklik beklentisi nedeniyle gündüzlüye kıyasla farklı bir hesaplama yapılır. Gündüzlü çalışmada; gidiş-dönüş ulaşım, yemek ve ek giderler de değerlendirmeye katılmalıdır.</p>

<blockquote>Ücret yalnızca rakamdan oluşmaz. Sigortanın varlığı, yazılı sözleşme ve çalışma koşullarının netliği uzun vadeli bir ilişki için en az maaş kadar önemlidir.</blockquote>

<h2>Deneyim ve Nitelik Faktörü</h2>
<p>Beş yıl üzeri deneyimi olan, doğrulanabilir referanslara sahip ve özel sertifikaları bulunan (ilk yardım, çocuk gelişimi) adaylar daha yüksek ücret talep edebilir ve bu beklenti makul karşılanmalıdır. Deneyimsiz ya da sertifikasız adaylar için deneme süreci ücret belirlenmesinde yol gösterici olabilir.</p>

<h2>İstanbul'da Bölgesel Farklılıklar</h2>
<p>Beşiktaş, Nişantaşı, Sarıyer, Etiler gibi üst segment ilçelerde hem aile beklentileri hem de aday talepleri daha yüksek seyretme eğilimindedir. Anadolu yakasında ise belirli ilçelerde farklı bir dengeleme söz konusu olabilir. Bölgesel faktörler ücret müzakerelerinde göz önünde bulundurulmalıdır.</p>

<h2>Yasal Yükümlülükler</h2>
<p>SGK kaydı, yıllık izin, fazla mesai karşılığı ve ihbar süreleri yasal zorunluluklardır. Bu konuları bir hukuk danışmanı ya da muhasebeci ile değerlendirmeniz, olası uyuşmazlıkları önlemenin en etkili yoludur.</p>

<h2>Sonuç</h2>
<p>Dadı maaşını asgari ücretle değil, iş kapsamı ve ilişkinin değeriyle belirlemenizi öneririz. Adil bir ücret teklifi, nitelikli adayların uzun süre aynı ailede çalışmasının en önemli güvencesidir.</p>
    `
  },
  {
    slug: "dadi-ile-ilk-gorusme-nasil-yapilir",
    title: "Dadı ile İlk Görüşme Nasıl Yapılır?",
    excerpt: "İlk görüşmede sorulacak doğru sorular ve dikkat edilmesi gerekenler. Pratik bir rehber.",
    image: "/images/uploads/dadi-process-755049.jpg",
    category: "Dadı Seçme Rehberi",
    readingTime: 6,
    publishedAt: "2026-06-01",
    content: `
<h2>Görüşme Öncesi Hazırlık</h2>
<p>İlk görüşmeye hazırlıklı girmek, hem sizin hem de adayın zamanını verimli kullanır. Görüşme öncesinde aile olarak neyin öncelikli olduğunu belirleyin: çocukların yaşı ve rutin ihtiyaçları, çalışma saatleri, özel gereksinimler (dil bilgisi, sürücü belgesi, diyet kısıtlamaları) ve ev ortamı hakkında adayın bilmesi gerekenler bunların başında gelir.</p>

<h2>Görüşme Ortamı</h2>
<p>Mümkünse görüşmeyi evde yapın. Adayın çocuklarla ve ev ortamıyla ilk etkileşimini gözlemlemek, kağıt üstündeki bilgilerin ötesinde değerli bir izlenim sunar. Çevrimiçi görüşme yapıyorsanız, en az bir kez yüz yüze buluşmayı ihmal etmeyin.</p>

<blockquote>İlk 10 dakikadaki gözleminize güvenin. Adayın çocuklarla nasıl göz teması kurduğu, sizi nasıl dinlediği ve sorularını nasıl sorduğu çok şey anlatır.</blockquote>

<h2>Sorulması Gereken Temel Sorular</h2>
<ul>
  <li>Daha önce hangi yaş grubundaki çocuklara baktınız?</li>
  <li>Bu ailelerden birini referans olarak verebilir misiniz?</li>
  <li>Çocuk ağlamaya başladığında ilk tepkiniz ne olur?</li>
  <li>Ekstra görev (ufak ev işi, öğün hazırlama) konusunda esnekliğiniz nasıl?</li>
  <li>Uzun vadeli bir çalışma ilişkisi için beklentileriniz neler?</li>
</ul>

<h2>Dikkat Edilmesi Gerekenler</h2>
<p>Adayın sorularınıza verdiği yanıtlara olduğu kadar, size sorduğu sorulara da dikkat edin. Çalışma koşulları, çocukların rutini ve beklentiler hakkında soru soran bir aday, işi ciddiye aldığının sinyalini verir. Hiç soru sormayan ya da yalnızca maaşa odaklanan adaylara karşı daha dikkatli olunabilir.</p>

<h2>Görüşme Sonrası Değerlendirme</h2>
<p>Görüşmenin ardından 24-48 saat bekleyin. İlk izlenimin yanı sıra; referans kontrolünün sonuçlarını, belge doğrulamasını ve pratik lojistik uyumu birlikte değerlendirin. Aceleci karar vermekten kaçının.</p>
    `
  },
  {
    slug: "yatili-dadi-ev-kurallari-nasil-belirlenir",
    title: "Yatılı Dadı için Ev Kuralları Nasıl Belirlenir?",
    excerpt: "Yatılı çalışmada başarılı bir ilişki kurmak için ev sınırlarını baştan netleştirmenin önemi.",
    image: "/images/uploads/dadi-hero-6951492.jpg",
    category: "Yatılı Dadı",
    readingTime: 7,
    publishedAt: "2026-05-30",
    content: `
<h2>Neden Baştan Netleştirmek Gerekir?</h2>
<p>Yatılı bir çalışan aynı evi paylaşır. Bu durum, olağan bir işveren-çalışan ilişkisinin ötesine geçen dinamikler yaratır. Özel alanın nerede başlayıp nerede bittiği, aile bireylerinin hangi zamanlarda eve girip çıktığı, ortak alanların nasıl kullanılacağı gibi konular baştan belirlenmezse küçük anlaşmazlıklar zamanla ilişkiyi zedeleyebilir.</p>

<h2>Kişisel Alan ve Gizlilik</h2>
<p>Adayın kullanacağı oda ve banyo, kişisel eşyaların güvenliği ve özel zamanlara saygı — bunlar yatılı çalışmanın sağlıklı sürmesi için temel unsurlardır. Adaya tahsis edilen odanın yeterli büyüklükte, kilitlenebilir ve konforlu olması hem pratik hem de ilişkiye saygı açısından önemlidir.</p>

<blockquote>Sınırlar ilişkiyi kısıtlamaz; aksine, her iki tarafın da uzun vadede rahat olmasını sağlar. Net bir çerçeve kurmak güvensizlik değil, profesyonellik göstergesidir.</blockquote>

<h2>Çalışma Saatleri ve Molalar</h2>
<p>Yatılı çalışmada "mesai bitti" noktası belirsizleşebilir. Bu nedenle haftalık izin günleri, gece bakımı beklentileri, tatil ve bayram düzenlemeleri ile olağanüstü durumlardaki çalışma koşulları yazılı sözleşmeye yansıtılmalıdır.</p>

<h2>Ev İçi Davranış Kuralları</h2>
<p>Misafir kabul etme, ev içinde telefon kullanımı, sosyal medyada çocuklara ait içerik paylaşımı yasağı ve gece saatlerindeki davranış normları her aile için farklılık gösterebilir. Bu konuları kibarca ama açıkça görüşmek, ileride doğabilecek gerginlikleri önler.</p>

<h2>Deneme Sürecinin Değeri</h2>
<p>Yatılı yerleştirmelerde 1-2 haftalık deneme süreci son derece değerlidir. Bu süreçte hem aile hem de aday birbirlerini ev ortamında tanır, beklentiler netleşir ve varsa uyumsuzluklar büyük bir ayrılık olmadan giderilebilir.</p>

<h2>Yazılı Sözleşme Şart</h2>
<p>Tüm bu kuralların yazılı bir sözleşmeye yansıtılması, taraflara eşit güvence sağlar. Sözleşme; çalışma saatlerini, maaşı, izin haklarını, deneme süresini ve fesih koşullarını kapsamalıdır.</p>
    `
  }
];

export const blogCategories = [
  { slug: "dadi-secme-rehberi", title: "Dadı Seçme Rehberi" },
  { slug: "yatili-dadi", title: "Yatılı Dadı" },
  { slug: "gunduzlu-dadi", title: "Gündüzlü Dadı" },
  { slug: "bebek-bakimi", title: "Bebek Bakımı" },
  { slug: "yenidogan-bakimi", title: "Yenidoğan Bakımı" },
  { slug: "cocuk-gelisimi", title: "Çocuk Gelişimi" },
  { slug: "aileler-icin-rehber", title: "Aileler İçin Rehber" },
  { slug: "dadilar-icin-rehber", title: "Dadılar İçin Rehber" },
  { slug: "ev-hizmetleri-ve-yasal-bilgilendirme", title: "Ev Hizmetleri ve Yasal Bilgilendirme" },
  { slug: "guvenlik-ve-referans-kontrolu", title: "Güvenlik ve Referans Kontrolü" },
  { slug: "istanbul-dadi-rehberi", title: "İstanbul Dadı Rehberi" },
  { slug: "maas-ve-calisma-duzeni", title: "Maaş ve Çalışma Düzeni" }
];
