# Dadi Kapida CRM - Architecture

## Frontend Architecture

- Framework: Next.js App Router + React + TypeScript strict
- Styling: Tailwind CSS + Shadcn UI
- State:
  - Zustand for UI/session local state
  - TanStack Query for server state and caching
- Forms: React Hook Form + Zod validation
- Routing:
  - Public: `/login`
  - Protected app routes under authenticated layout
- UI patterns:
  - Data tables with filters/search/pagination
  - Detail pages with tabs
  - Dialog/Sheet for quick actions

## Backend Architecture

- Framework: NestJS + TypeScript strict
- API style: REST + Swagger/OpenAPI
- Module boundaries:
  - Auth, Users, Roles, Dashboard, Applications, Candidates, Families, FamilyRequests, Matching, Shortlists, Meetings, Tasks, Notes, Documents, References, Placements, Contracts, Finance, Messages, Reports, Settings, AuditLogs, Health
- Cross-cutting:
  - Central exception filter
  - Unified response interceptor (`{ data, meta, error }`)
  - Validation pipe
  - Winston-based logging

## Database Architecture

- PostgreSQL + Prisma ORM
- UUID primary keys
- Soft delete (`deleted_at`) in key domain entities
- AuditLog table for critical actions
- Index strategy on high-frequency filters (status, owner, created_at, location, phone)
- No `tenant_id` (single internal organization)

## Auth Architecture

- Access token: short-lived JWT
- Refresh token: rotation model per session
- Refresh token hash stored in `UserSession`
- Logout revokes current session
- `/auth/me` returns profile + roles + permissions

## RBAC Architecture

- Core tables: `Role`, `Permission`, `UserRole`, `RolePermission`
- NestJS guards/decorators:
  - `JwtAuthGuard`
  - `PermissionsGuard`
  - `@CurrentUser()`
  - `@RequirePermissions(...)`
- Permissions are action-oriented and composable.

## Public Application API Architecture

- Endpoint: `POST /public/applications`
- No auth
- Hardened with:
  - payload validation
  - rate limiting
  - basic spam checks
  - duplicate detection by phone and recency window
- Raw payload and UTM fields persisted for traceability.

## Matching Engine Architecture

- Deterministic, rule-based scoring (no LLM in v1)
- Pipeline:
  1. Load `FamilyRequest`
  2. Candidate pre-filter
  3. Hard filters/business rules
  4. Weighted sub-score computation
  5. Final score 0-100
  6. Persist `MatchRun` + `CandidateMatch` + explanation JSON

## Queue Architecture

- Redis + BullMQ
- Dedicated `worker` app
- Initial queue targets:
  - notifications
  - periodic recalculation jobs
  - async report tasks

## File Storage Architecture

- Storage abstraction interface
- Driver-based strategy:
  - `local` (default for local development)
  - `s3-compatible` (future: Cloudflare R2 / AWS S3)
- Private document access by default

## Logging

- Winston logger with request correlation support
- Structured logs for API, domain events, and job processing
- Sensitive fields masked/redacted

## Monitoring and Observability

- Health check endpoint
- Sentry-ready exception capture hooks
- Metrics integration points (phase expansion)

## Error Handling

- Centralized exception filter
- Domain error codes mapped to consistent response shape
- Validation errors normalized

## Docker Architecture

- `postgres`
- `redis`
- `api` (NestJS)
- `worker` (BullMQ processors)
- `web` (Next.js)
- Shared network and environment-based configuration
