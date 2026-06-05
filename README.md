# Dadi Kapida CRM

Internal operations CRM for Dadi Kapida.  
This repository is intentionally **not** multi-tenant and **not** external-portal based.

## Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind, Zustand, TanStack Query, React Hook Form, Zod
- Backend: NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, JWT, RBAC
- Infra: Docker, docker-compose

## Monorepo Structure

```txt
apps/
  web/
  api/
  worker/
packages/
  database/
  types/
  config/
  utils/
docs/
infra/
```

## Prerequisites

- Node.js 22+
- pnpm 10+
- Docker + Docker Compose

## Local Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy environment:
   ```bash
   cp .env.example .env
   ```
3. Start data services:
   ```bash
   docker compose -f infra/docker-compose.yml up -d postgres redis
   ```
4. Generate Prisma client and migrate:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```
5. Seed initial data:
   ```bash
   pnpm db:seed
   ```
6. Start all apps:
   ```bash
   pnpm dev
   ```

## One-Command Dev Bootstrap

To start PostgreSQL + Redis, run Prisma setup (generate/migrate/seed), and launch apps in one command:

```bash
pnpm dev:bootstrap
```

Only run infrastructure + Prisma setup without starting dev servers:

```bash
pnpm dev:bootstrap -- --setup-only
```

If Prisma `db:generate` shows a Windows `EPERM ... query_engine-windows.dll.node` lock error,
close running Node/Nest/Next processes and run the command again.

## Test Commands

- API unit tests: `pnpm --filter @dadi-kapida/api test:unit`
- API e2e tests: `pnpm --filter @dadi-kapida/api test:e2e`
- All workspace tests: `pnpm test`
- Pre-production smoke check: `pnpm smoke:preprod`

## Default Admin (Development Only)

- Email: `admin@dadikapida.local`
- Password: `admin123`

Change this password immediately in any real environment.

## Phase 1 Status

- Monorepo baseline: done
- Core docs: done
- Prisma schema and seed baseline: done
- NestJS foundation with auth + RBAC scaffolding: done
- Next.js login and protected shell: done
- Docker compose baseline: done

## Important Notes

- Do not commit secrets.
- `CandidateApplication` is the mandatory intake entry point for website forms.
- Keep migrations aligned with schema changes.
