# Dadi Kapida CRM - API Design

## API Conventions

- Base path: `/api`
- Response shape (success):
  ```json
  { "data": {}, "meta": { "requestId": "uuid", "timestamp": "ISO_DATE" }, "error": null }
  ```
- Response shape (error):
  ```json
  { "data": null, "meta": { "requestId": "uuid", "timestamp": "ISO_DATE" }, "error": { "code": "ERROR_CODE", "message": "Readable message" } }
  ```
- Correlation header:
  - `x-request-id` request header kabul edilir, yoksa API üretir ve response header'a yazar.
- Pagination query fields:
  - `page`, `limit`, `sortBy`, `sortOrder`, `search`, filter params

## Auth

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/change-password`

## Public Applications

- `POST /public/applications`

## Applications

- `GET /applications`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `POST /applications/:id/convert-to-candidate`
- `POST /applications/:id/reject`
- `POST /applications/:id/mark-duplicate`

## Candidates

- `GET /candidates`
- `POST /candidates`
- `GET /candidates/:id`
- `PATCH /candidates/:id`
- `DELETE /candidates/:id`
- `POST /candidates/:id/status`
- `GET /candidates/:id/timeline`
- `GET /candidates/:id/matches`
- `GET /candidates/:id/placements`

### Candidate Documents

- `GET /candidates/:id/documents`
- `POST /candidates/:id/documents`
- `PATCH /candidate-documents/:id/verify`
- `PATCH /candidate-documents/:id/reject`

### Candidate References

- `GET /candidates/:id/references`
- `POST /candidates/:id/references`
- `PATCH /candidate-references/:id`
- `POST /candidate-references/:id/checks`
- `GET /candidate-references/:id/checks`

### Candidate Interviews

- `GET /candidates/:id/interviews`
- `POST /candidates/:id/interviews`
- `PATCH /candidate-interviews/:id`
- `POST /candidate-interviews/:id/complete`

## Families

- `GET /families`
- `POST /families`
- `GET /families/:id`
- `PATCH /families/:id`
- `DELETE /families/:id`
- `GET /families/:id/timeline`
- `GET /families/:id/requests`
- `GET /families/:id/placements`

### Family Members

- `GET /families/:id/members`
- `POST /families/:id/members`
- `PATCH /family-members/:id`
- `DELETE /family-members/:id`

### Family Addresses

- `GET /families/:id/addresses`
- `POST /families/:id/addresses`
- `PATCH /family-addresses/:id`
- `DELETE /family-addresses/:id`

## Family Requests

- `GET /family-requests`
- `POST /family-requests`
- `GET /family-requests/:id`
- `PATCH /family-requests/:id`
- `DELETE /family-requests/:id`
- `POST /family-requests/:id/status`
- `GET /family-requests/:id/matches`
- `GET /family-requests/:id/shortlists`

## Matching

- `POST /family-requests/:id/run-matching`
- `GET /match-runs/:id`
- `GET /match-runs/:id/results`
- `GET /candidate-matches/:id`
- `PATCH /candidate-matches/:id/status`

## Shortlists

- `GET /shortlists`
- `POST /shortlists`
- `GET /shortlists/:id`
- `PATCH /shortlists/:id`
- `DELETE /shortlists/:id`
- `POST /shortlists/:id/items`
- `PATCH /shortlist-items/:id`
- `DELETE /shortlist-items/:id`

## Meetings

- `GET /meetings`
- `POST /meetings`
- `GET /meetings/:id`
- `PATCH /meetings/:id`
- `DELETE /meetings/:id`
- `POST /meetings/:id/complete`
- `POST /meetings/:id/cancel`

## Tasks

- `GET /tasks`
- `POST /tasks`
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/complete`
- `POST /tasks/:id/reopen`
- `GET /tasks/my`

## Notes

- `GET /notes`
- `POST /notes`
- `PATCH /notes/:id`
- `DELETE /notes/:id`
- `POST /notes/:id/pin`

## Placements

- `GET /placements`
- `POST /placements`
- `GET /placements/:id`
- `PATCH /placements/:id`
- `POST /placements/:id/status`
- `POST /placements/:id/terminate`
- `POST /placements/:id/replacement-request`

## Contracts

- `GET /contract-templates`
- `POST /contract-templates`
- `PATCH /contract-templates/:id`
- `DELETE /contract-templates/:id`
- `GET /contracts`
- `POST /contracts`
- `GET /contracts/:id`
- `PATCH /contracts/:id`
- `POST /contracts/:id/mark-signed`
- `POST /contracts/:id/cancel`

## Finance

- `GET /invoices`
- `POST /invoices`
- `PATCH /invoices/:id`
- `POST /invoices/:id/mark-paid`
- `GET /payments`
- `POST /payments`
- `PATCH /payments/:id`
- `POST /payments/:id/refund`

## Reports

- `GET /reports/dashboard`
- `GET /reports/candidates`
- `GET /reports/applications`
- `GET /reports/family-requests`
- `GET /reports/placements`
- `GET /reports/finance`
- `GET /reports/staff-performance`

## Settings / Security / Health

- `GET /settings/*` (domain-specific settings modules)
- `GET /audit-logs`
- `GET /health`
