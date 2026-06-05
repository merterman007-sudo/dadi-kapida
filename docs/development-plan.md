# Dadi Kapida CRM - Development Plan

## Phase 1 - Foundation

- Monorepo setup (`apps`, `packages`, `docs`, `infra`)
- Docker and docker-compose setup
- PostgreSQL + Redis local stack
- Prisma schema baseline and initial migration
- Auth and RBAC foundation
- Admin shell layout scaffold (web)
- Users and roles baseline endpoints
- Basic dashboard metrics endpoint stub

Acceptance:
- Local environment boots with `web`, `api`, `worker`, `postgres`, `redis`
- Login + protected route guard works
- Roles/permissions seed available

## Phase 2 - Intake and Candidate Core

- Public application intake endpoint
- Duplicate detection workflow
- Applications admin list/detail/actions
- Candidate CRUD and status management
- Candidate notes and tasks integration

Acceptance:
- Website form submissions land as `CandidateApplication`
- Conversion to candidate is operational and audited

## Phase 3 - Family and Matching

- Family CRUD and household management
- Family request lifecycle
- Deterministic matching engine
- Match runs and score breakdown persistence
- Shortlist creation and management

Acceptance:
- Staff can run matching on a family request
- Ranked candidates are visible and actionable

## Phase 4 - Execution Workflow

- Meetings module
- References and reference checks
- Candidate documents and verification
- Placements and status lifecycle

Acceptance:
- End-to-end flow from request to active placement is trackable

## Phase 5 - Commercial + Quality

- Contracts module (with PDF placeholder service)
- Finance basics (invoice/payment)
- Reports expansion
- Audit log hardening
- UX polish and validation improvements
- Automated tests (unit + e2e skeleton completion)

Acceptance:
- Operational dashboard reflects key business KPIs
- Critical workflows covered by tests and audit events
