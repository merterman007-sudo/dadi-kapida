# Dadi Kapida CRM - Database Design

## Design Principles

- Single-organization relational model (no `tenant_id`)
- UUID primary keys (`@db.Uuid`)
- `created_at`, `updated_at` on all operational tables
- `deleted_at` on soft-delete entities
- Referential integrity with clear ownership
- Indexes for high-frequency filtering/reporting

## Core Enums

- `UserStatus`: ACTIVE, INVITED, DISABLED
- `CandidateApplicationStatus`: NEW, CONTACTED, CONVERTED_TO_CANDIDATE, REJECTED, DUPLICATE
- `CandidateStatus`: NEW, PRE_SCREEN, INTERVIEW, REFERENCE_CHECK, DOCUMENT_PENDING, APPROVED, PASSIVE, REJECTED, BLACKLISTED
- `FamilyStatus`: LEAD, QUALIFIED, ACTIVE, PASSIVE, BLACKLISTED
- `FamilyRequestStatus`: DRAFT, OPEN, MATCHING, SHORTLISTED, INTERVIEWING, OFFER, PLACED, CANCELLED, LOST
- `WorkType`: LIVE_IN, DAYTIME, NIGHT, PART_TIME, FULL_TIME
- `MeetingStatus`: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
- `TaskStatus`: TODO, IN_PROGRESS, DONE, CANCELLED
- `DocumentStatus`: PENDING, VERIFIED, REJECTED, EXPIRED
- `ReferenceStatus`: NEW, CONTACTED, VERIFIED, NEGATIVE, UNREACHABLE
- `MatchStatus`: SUGGESTED, SHORTLISTED, REJECTED, SENT_TO_FAMILY, INTERVIEW_REQUESTED, PLACED
- `PlacementStatus`: OFFERED, ACCEPTED, ACTIVE, COMPLETED, CANCELLED, TERMINATED, REPLACEMENT
- `ContractStatus`: DRAFT, SENT, SIGNED, CANCELLED, EXPIRED
- `PaymentStatus`: PENDING, PAID, FAILED, REFUNDED

## Auth and User Management

## User

Internal staff account record. Includes profile, status, password hash, and security metadata.

## Role

Role definition (`Owner`, `Admin`, `Staff`, `Finance`, `ReadOnly`).

## Permission

Granular permission key registry (e.g. `candidates.read`, `settings.manage`).

## UserRole

Many-to-many assignment between users and roles.

## RolePermission

Many-to-many mapping between roles and permissions.

## UserSession

Refresh token rotation/session table with hashed refresh token, expiry, and revocation fields.

## AuditLog

Immutable operational audit trail: actor, action, entity, metadata, ip/user-agent.

## Application Intake

## CandidateApplication

Stores raw web-form submissions before qualification.

Key fields:
- Identity/contact: `first_name`, `last_name`, `phone`, `email`
- Location/profile: `city`, `district`, `birth_date`, `experience_years`
- Compensation/work pref: `expected_salary_min`, `expected_salary_max`, `work_type_preference`, `can_live_in`
- Flags/context: `has_first_aid_certificate`, `smoking_status`, `notes`, `source`
- Marketing: `utm_source`, `utm_medium`, `utm_campaign`
- Traceability: `raw_payload` (JSONB)
- Workflow: `status`, optional `candidate_id`

## Candidate Domain

## Candidate

Primary candidate entity used in matching and placement.

## CandidateAddress

Candidate address history/normalized location records.

## CandidateWorkPreference

Work style, schedule, live-in, shift preferences.

## CandidateExperience

Structured employment and care experience entries.

## CandidateSkill

Candidate-to-skill join with optional proficiency/notes.

## CandidateCertification

Candidate-to-certification join with validity and evidence details.

## CandidateLanguage

Language capability records and level.

## CandidateDocument

Private document metadata/status lifecycle (verification workflow).

## CandidateReference

Reference contacts and status tracking.

## ReferenceCheck

Reference call outcomes with structured scoring and notes.

## CandidateInterview

Interview records, score, interviewer, and outcome.

## CandidateStatusHistory

Candidate status transition log for timeline and auditability.

## CandidateBlacklistRecord

Reasoned blacklist records with severity and reviewer context.

## Family Domain

## Family

Primary family/customer entity and ownership.

## FamilyMember

Household member details relevant to care context.

## FamilyAddress

Address and location records.

## FamilyRequest

Operational demand for nanny placement with requirements and budget.

## RequestScheduleRule

Structured schedule constraints per request.

## RequestRequiredSkill

Required skills for a given family request.

## RequestRequiredCertification

Required certifications for a given family request.

## Matching Domain

## MatchRun

Execution record for one matching run, includes parameters and summary stats.

## CandidateMatch

Per-candidate match result, scores, explanation JSON, and workflow status.

## Shortlist

Family request shortlist container managed by staff.

## ShortlistItem

Candidate entries inside shortlist with consultant notes and feedback markers.

## Operations Domain

## Meeting

Meeting schedule and outcomes (intake/interview/follow-up/reference call).

## Task

Generic task record linked to arbitrary entity (`entity_type`, `entity_id`).

## Note

Generic internal notes linked to arbitrary entity, with pinning metadata.

## Notification

Internal notification dispatch and read-state tracking.

## Placement Domain

## Placement

Core placement agreement between family request and candidate.

## PlacementStatusHistory

Placement lifecycle changes over time.

## ContractTemplate

Reusable contract templates for placement workflows.

## Contract

Contract instances linked to family/candidate/placement.

## Invoice

Invoice records for service fee and related billing.

## Payment

Payment transactions and status updates/refund markers.

## Messaging Domain

## Message

Operational communication log (email/phone/whatsapp notes where applicable).

## MessageTemplate

Reusable message templates by context and language.

## Taxonomy Domain

## ServiceCategory

Service taxonomy starting with `Dadi` but extensible.

## Skill

Master skill list used in candidate and request matching.

## Certification

Master certification definitions.

## Language

Master language definitions used by candidate/request relations.

## Tag

Generic tagging taxonomy for operational categorization.

## System Domain

## Setting

Configuration key-value store with scope and type metadata.

## Integration

External integration records and credentials metadata (no secrets in plain text).

## WebhookEvent

Inbound/outbound webhook event logs with delivery state.

## KVKK / Compliance Domain

## ConsentRecord

Consent and disclosure records with policy version and capture source.

## DataErasureRequest

Data subject erasure workflow tracking and final disposition.

## Indexing Strategy (Initial)

- `CandidateApplication(phone, created_at desc)`
- `Candidate(status, city, district)`
- `Candidate(owner_user_id, status)`
- `Family(status, city, district)`
- `FamilyRequest(status, work_type, city, district, created_at desc)`
- `CandidateMatch(family_request_id, total_score desc)`
- `Task(assignee_user_id, status, due_at)`
- `Meeting(start_at, status)`
- `Placement(status, start_date)`
- `AuditLog(entity_type, entity_id, created_at desc)`
