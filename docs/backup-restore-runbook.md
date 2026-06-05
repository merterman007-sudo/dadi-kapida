# Backup & Restore Runbook (PostgreSQL)

Bu runbook Dadi Kapida CRM için PostgreSQL yedekleme ve geri dönüş adımlarını tanımlar.

## Kapsam
- Kritik veri kaynağı: PostgreSQL (`dadi_kapida_crm`)
- Redis kalıcı iş verisi için kaynak sistem değildir (cache/queue), bu nedenle bu runbook DB odaklıdır.

## Ön Koşullar
- Docker erişimi
- `dadi-kapida-postgres` container'ı çalışıyor olmalı
- Operasyonu yapan kişi prod erişim yetkisine sahip olmalı

## 1) Yedek Alma

### 1.1 Full backup (custom format)
```powershell
$ts = Get-Date -Format "yyyyMMdd-HHmmss"
$name = "dadi_kapida_crm-$ts.dump"
docker exec dadi-kapida-postgres sh -lc "pg_dump -U postgres -d dadi_kapida_crm -Fc -f /tmp/$name"
docker cp "dadi-kapida-postgres:/tmp/$name" ".\backups\$name"
docker exec dadi-kapida-postgres sh -lc "rm -f /tmp/$name"
```

### 1.2 Bütünlük kontrolü
```powershell
docker exec dadi-kapida-postgres sh -lc "pg_restore -l /tmp/$name"  # container içinde test için
```

Not: `docker cp` sonrası dosya geri container'a alınarak test edilebilir.

## 2) Geri Dönüş (Restore)

### 2.1 Kesinti penceresi başlat
- API/worker write trafiğini durdur.
- Aktif operasyon ekibine bilgilendirme geç.

### 2.2 Restore dosyasını container'a taşı
```powershell
docker cp ".\backups\<backup-file>.dump" "dadi-kapida-postgres:/tmp/restore.dump"
```

### 2.3 Restore uygula
```powershell
docker exec dadi-kapida-postgres sh -lc "pg_restore -U postgres -d dadi_kapida_crm --clean --if-exists /tmp/restore.dump"
```

### 2.4 Son kontrol
```powershell
pnpm --filter @dadi-kapida/database db:migrate
pnpm --filter @dadi-kapida/database db:seed
```

Not: `db:seed` idempotent veri için güvenlidir; production politikası gereği opsiyonel tutulabilir.

## 3) Doğrulama Kontrolü
- `/health` 200 dönüyor
- `/auth/login` çalışıyor
- Kritik modüllerden en az birer okuma sorgusu başarılı (`/dashboard`, `/candidates`, `/families`)
- `pnpm smoke:preprod -- --api-url <api-url>` başarılı
- Son 24 saat kayıtları tutarlı

## 4) RPO / RTO Hedefi
- RPO hedefi: 24 saat (günlük backup)
- RTO hedefi: 60 dakika

## 5) Operasyon Notları
- Backup dosyaları şifreli saklanmalı (kurumsal vault/storage policy)
- Backup dosyası erişimi sadece yetkili operasyon ekibinde olmalı
- Yılda en az 2 kez restore tatbikatı yapılmalı
