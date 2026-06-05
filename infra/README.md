# Production deployment

Bu klasor VPS uzerindeki production kurulumunu toplar.

## Gereken dosyalar

- `.env.production` dosyasini repo kokune koy
- `infra/Caddyfile` aynen kalsin

Ornek dosyadan cikarmak icin:

```bash
cp .env.production.example .env.production
```

## Calistirma

```bash
docker compose -f infra/docker-compose.prod.yml up -d --build
```

## Beklenen domainler

- `dadikapida.com`
- `www.dadikapida.com`
- `crm.dadikapida.com`
- `api.dadikapida.com`

## Notlar

- `web` paneli CRM icin kullanilir.
- Public site `website` servisinden gelir.
- Tarayici isteklerinde CRM icin `/crm-api/*`, ortak API icin `/api/v1/*` kullanilir.
- CRM icindeki `website-media` yukleme route'u Next app icinde kalir.
- Ilk kurulumda `api` container'i migration calistirir.
