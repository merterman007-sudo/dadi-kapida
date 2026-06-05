# Dadi Kapida CRM - A'dan Z'ye Çalışır Sistem Checklist

Bu liste "tam çalışan sistem" hedefine adım adım ilerlemek için hazırlanmıştır.

## 0. Altyapı ve Stabilite
- [x] Docker ile PostgreSQL + Redis ayakta
- [x] `db:generate`, `db:migrate`, `db:seed` çalışıyor
- [x] Login akışı çalışıyor (`/auth/login`)
- [x] Ana ekran ve modül sayfaları gerçek API bağlantısında
- [x] Türkçe metin/encoding temizliği tüm ekranlarda tamamlandı
- [x] Tek komutla temiz açılış scripti (dev bootstrap)

## 1. Aday Yönetimi (Candidates)
- [x] API: Aday listeleme (`GET /candidates`)
- [x] API: Aday detay (`GET /candidates/:id`)
- [x] API: Aday oluşturma (`POST /candidates`)
- [x] API: Aday güncelleme (`PATCH /candidates/:id`)
- [x] API: Aday silme (soft delete) (`DELETE /candidates/:id`)
- [x] Web: Adaylar listesi gerçek API'ye bağlı
- [x] Web: Yeni aday formu çalışır
- [x] Web: Aday detay sayfası + durum güncelleme + silme

## 2. Aile Yönetimi (Families)
- [x] API: Liste/detay/oluştur/güncelle
- [x] Web: Liste/form/detay ekranları
- [x] Doğrulama ve hata mesajları

## 3. Aile Talebi (Family Requests)
- [x] API: Liste/detay/oluştur/güncelle
- [x] Web: Liste/form/detay ekranları
- [x] Talep durum akışı yönetimi (temel)

## 4. Başvurular (Applications)
- [x] Web: Liste ekranı gerçek API ile
- [x] Web: Detay ekranı gerçek API ile
- [x] Web: Dönüştür/Reddet/Mükerrer aksiyonları
- [x] Başvuru -> Aday geçişi UI üstünden tamam

## 5. Eşleştirme ve Shortlist
- [x] Matching API gerçek hesaplama akışı
- [x] Family Request üzerinden eşleştirme çalıştırma
- [x] Sonuç listeleme ve shortlist'e ekleme
- [x] Shortlist yönetim ekranı

## 6. Operasyon Akışı
- [x] Meetings modülü (liste/oluştur/güncelle/durum)
- [x] Tasks modülü (liste/oluştur/güncelle/durum)
- [x] Notes modülü (liste/ekle/pin/güncelle/sil)
- [x] Documents modülü (aday evrak liste/ekle/doğrula/reddet)
- [x] References modülü (aday referans + kontrol akışı)
- [x] Messages modülü (liste/ekle/güncelle)

## 7. Yerleştirme ve Ticari Akış
- [x] Placements modülü (liste/detay/oluştur/durum)
- [x] Contracts modülü (template + contract temel akış)
- [x] Finance (invoice/payment) modülü temel akış

## 8. Yönetim ve Raporlama
- [x] Dashboard KPI kartları gerçek veriye bağlı
- [x] Reports ekranı gerçek veri endpointlerine bağlı
- [x] Settings (users/roles/categories) gerçek API ile bağlı
- [x] Audit log görünürlüğü (liste + filtre)

## 9. Kalite, Güvenlik, Yayına Hazırlık
- [x] API birim testleri (modül bazlı)
- [x] Kritik akışlar için e2e testleri
- [x] Yetki matrisi testleri (RBAC)
- [x] Hata takibi/log standardı sertleştirme
- [x] Yedekleme/geri dönüş runbook
- [x] Üretim dağıtım checklist'i
