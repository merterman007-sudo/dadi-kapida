# Dadi Kapida CRM - Product Scope

## Product Definition

Dadi Kapida CRM is an internal operations platform used by business owners and staff to manage candidate intake, candidate evaluation, family demand, candidate-family matching, and placement lifecycle.

It is designed for daily operational use, not for external self-service users.

## What This Product Is Not

- Not a multi-tenant SaaS platform
- Not a white-label solution
- Not a public marketplace
- Not a candidate portal
- Not a family portal
- Not a self-service profile management app for external users

## Users and Roles

## Business Owner

- Monitors operations via dashboard and reports
- Oversees user/role management and process quality
- Tracks placements, financial status, and staff performance

## Staff

- Reviews incoming applications
- Converts qualified applications to candidates
- Maintains candidate records, references, interviews, and documents
- Creates and manages families and family requests
- Runs matching and prepares shortlists
- Coordinates interviews and follow-up tasks
- Completes placement workflow

## Application Intake Flow

1. Candidate submits a form on public website.
2. Form is received by `POST /public/applications`.
3. CRM stores raw entry in `CandidateApplication`.
4. Staff reviews and either:
   - marks duplicate/rejected, or
   - converts to `Candidate`.

## Candidate Management Flow

1. Candidate record is created manually or from application conversion.
2. Staff enriches profile (preferences, skills, references, interview scores, documents).
3. Candidate progresses through status pipeline.
4. Timeline, tasks, notes, and compliance records are tracked.

## Family Management Flow

1. Family is created by staff.
2. Contacts, addresses, members, notes are managed internally.
3. Family status and operational ownership is tracked.

## Family Request Flow

1. Staff opens a family request with requirements (location, work type, budget, preferences).
2. Request moves through lifecycle (open, matching, shortlist, interviewing, placed/cancelled).
3. Matching runs can be executed repeatedly as new candidates become available.

## Matching Flow

1. Deterministic matching engine applies hard filters.
2. Remaining candidates are scored using weighted factors.
3. Results are stored as `CandidateMatch` with explanation JSON.
4. Staff creates shortlist and manages family-facing progression.

## Placement Flow

1. Family accepts candidate.
2. Placement is created with commercial and operational fields.
3. Contract and payment follow-up is tracked.
4. Placement status history and operational notes are preserved.

## MVP Scope (V1)

- Internal auth and RBAC
- Public application intake endpoint
- Application review and convert-to-candidate flow
- Candidate management
- Family and family request management
- Deterministic matching engine
- Shortlist management
- Meetings, tasks, notes
- Placements, basic contracts, basic finance tracking
- Dashboard and operational reports
- Audit log and compliance-ready primitives

## Future Phases (Post-MVP)

- Advanced analytics and forecasting
- Automated reminders and omni-channel notifications
- Smarter ranking (hybrid deterministic + ML assistance)
- Contract PDF generation with e-sign integration
- Integration marketplace (CRM, messaging, ERP)
- Candidate/family external portals if explicitly approved later
