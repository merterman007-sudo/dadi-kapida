# Production Deployment Checklist

Bu liste production yayını öncesi, yayın anı ve sonrası adımları standartlaştırır.

## 1) Yayın Öncesi (T-1)
- [ ] `pnpm typecheck` başarılı
- [ ] `pnpm lint` başarılı
- [ ] `pnpm test` başarılı
- [ ] `pnpm build` başarılı
- [ ] `pnpm smoke:preprod -- --api-url <api-url>` başarılı
- [ ] Son migration dosyaları gözden geçirildi
- [ ] `docs/backup-restore-runbook.md` doğrulandı
- [ ] Güncel DB backup alındı
- [ ] Release notları hazırlandı

## 2) Konfigürasyon ve Güvenlik
- [ ] Production `.env` doğrulandı; secret değerleri vault veya güvenli secret store üzerinden yönetiliyor
- [ ] `JWT_ACCESS_SECRET` ve `JWT_REFRESH_SECRET` güçlü değerlerle set edildi
- [ ] `CORS_ORIGIN` production domain ile sınırlandı
- [ ] Debug/test credential bırakılmadı
- [ ] PII loglanmıyor doğrulandı; request body veya kişisel veri loglanmıyor

## 3) Deploy Adımları
- [ ] API image build/push
- [ ] Web image build/push
- [ ] Worker image build/push
- [ ] API rollout
- [ ] Worker rollout
- [ ] Web rollout
- [ ] Migration uygulandı: `prisma migrate deploy` veya kurum standardı

## 4) Yayın Sonrası Doğrulama
- [ ] `/health` endpoint 200
- [ ] `/auth/login` başarılı
- [ ] Dashboard yükleniyor
- [ ] Kritik endpoint smoke:
  - [ ] `/candidates`
  - [ ] `/families`
  - [ ] `/family-requests`
  - [ ] `/reports/dashboard`
- [ ] Audit log akışı çalışıyor
- [ ] Hata oranı ve latency normal aralıkta

## 5) Rollback Planı
- [ ] Son stabil image tag hazır
- [ ] Rollback komutu/prosedürü testli
- [ ] DB restore adımı net
- [ ] Sorumlu kişiler ve iletişim kanalı net

## 6) Kapanış
- [ ] Yayın sonucu ekip kanalıyla paylaşıldı
- [ ] Açık kalan risk/aksiyonlar ticket'landı
- [ ] Deployment tarihi/saati ve versiyon kaydedildi
