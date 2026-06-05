# Dadı Kapıda Website Build Plan

## 1. Existing Architecture Summary

- Monorepo uses `pnpm` with workspaces under `apps/*` and `packages/*`.
- Existing production CRM stack:
  - `apps/api`: NestJS + Prisma + PostgreSQL + JWT + RBAC + throttling.
  - `apps/web`: Next.js 15 App Router admin panel for CRM users.
  - `apps/worker`: background worker.
  - `packages/database`: Prisma schema, migrations, seed data.
  - `packages/utils`, `packages/config`, `packages/types`: shared workspace packages.
- Admin auth already exists and is reusable for website management.
- CRM already has core entities for candidates, families, requests, placements, finance, reports, audit logs, documents, messages, tasks, notes, and settings.
- Docker compose is in `infra/docker-compose.yml`.
- `apps/web` is the CRM panel, so the new public website should live in a separate `website` app, while website CMS/admin can be integrated into the existing CRM panel.

## 2. Integration Strategy

- Keep the current CRM intact.
- Add a new `website` Next.js app for the public marketing/application site.
- Add website CMS/admin screens inside the existing CRM admin panel under a `Website Yönetimi` area.
- Add website-related modules to NestJS API using the current auth/RBAC system.
- Keep all public form submissions server-side and persist them through the API.
- Reuse existing CRM entities where possible:
  - family application -> candidate/family lead/job request flow
  - nanny application -> candidate + experiences/references/documents flow
- Keep the same PostgreSQL database, with website models namespaced clearly in Prisma.

## 3. Database Changes

- Add website CMS and form models to Prisma.
- Keep CRM models unchanged unless a direct mapping is needed.
- Planned website models:
  - `WebsitePage`, `WebsitePageRevision`
  - `SiteSetting`, `WhatsAppSetting`, `NavigationMenu`
  - `BlogPost`, `BlogCategory`, `BlogTag`, `BlogPostTag`
  - `FAQ`, `Testimonial`, `CaseStudy`
  - `ServicePage`, `LocationPage`
  - `MediaAsset`
  - `FormSubmission`, `ConsentLog`
  - `Redirect`, `IntegrationLog`
- Add or map CRM-facing intake models only if missing.
- Keep migrations in sync with schema changes.
- Use `local` storage fallback for dev and R2-compatible storage abstraction for production.

## 4. API Plan

- Add public website API endpoints under `/api/v1/public/*`.
- Add protected admin website API endpoints under `/api/v1/admin/website/*`.
- Public forms:
  - family application
  - nanny application
  - contact request
  - callback request
  - newsletter subscription
  - uploads presign/complete
- Admin features:
  - dashboard
  - pages
  - homepage
  - services
  - locations
  - blog posts, categories, tags
  - FAQs
  - testimonials
  - case studies
  - media
  - settings
  - WhatsApp settings
  - redirects
  - form submissions
  - integration logs
- Add server-side validation, dedupe, rate limiting, consent logging, audit logs, and idempotency keys.

## 5. Frontend Route Plan

- Create public website under `/website`.
- Public routes will cover:
  - homepage
  - family application
  - nanny application
  - contact/callback forms
  - services
  - service areas
  - blog
  - legal pages
  - FAQ and support pages
- Keep the UX family-first with `Aile Başvurusu` as the primary CTA.
- Add secondary `Dadı Başvurusu` CTA.
- Build SEO-friendly layouts, metadata, sitemap, robots, canonical URLs, OG tags, and structured data.

## 6. CMS / Admin Plan

- Reuse the existing CRM admin UI for website management.
- Add a `Website Yönetimi` section with screens for:
  - dashboard
  - pages
  - homepage
  - services
  - locations
  - blog
  - FAQs
  - testimonials
  - case studies
  - media
  - settings
  - WhatsApp
  - SEO redirects
  - form submissions
  - integration logs
- Use structured JSON content blocks rather than a freeform untyped editor.
- Make all sensitive content, phone numbers, hero text, footer text, and WhatsApp copy CMS-driven.

## 7. Security Plan

- Use existing JWT auth and RBAC for admin.
- Add protected admin guards for all CMS routes.
- Public forms:
  - DTO validation on server
  - honeypot
  - minimum completion time
  - rate limiting
  - optional Turnstile verification
  - idempotency key support
  - duplicate prevention
  - consent logging
- File uploads:
  - presigned upload flow
  - R2-compatible storage
  - local dev fallback
  - private vs public file visibility
  - size/MIME validation
- Admin edits should write audit logs.

## 8. Build / Test Plan

- Implement backend modules first.
- Add Prisma migrations and seed data.
- Add public website app.
- Add CRM admin CMS screens.
- Run:
  - `pnpm install` if workspace links need refresh
  - `pnpm db:generate`
  - `pnpm db:migrate` or `pnpm --filter @dadi-kapida/database db:deploy`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm test`
  - app-specific smoke checks
- Verify Docker compose still starts API, web, worker, Postgres, and Redis cleanly.

## 9. Initial Delivery Order

1. Add Prisma models and migrations.
2. Add website API modules and validation.
3. Add shared storage and upload abstraction.
4. Build public `website` app shell and homepage.
5. Build family and nanny forms.
6. Build CRM website admin screens.
7. Add content seeds and SEO pages.
8. Run full validation and smoke tests.
