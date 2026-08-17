# Go Backend — Requirements and Functional Specification

## Purpose

Replace `tempcsebase/userService` with a Go modular monolith backed by the approved PostgreSQL department schema. The new service must preserve the useful CSE department workflows and data reads, while correcting its single-department assumptions, unauthorised writes, implicit IDs, free-text dates, and copied research records.

The CSE dataset is the first acceptance fixture. Before the backend is accepted, it must import into one seeded institution and CSE department and power the equivalent directory, portfolio, research, CMS, infrastructure, placement, dashboard, resume, and report reads.

## Scope and non-goals

- The public and staff-facing behaviours in the legacy routes are requirements; route spelling, numeric IDs, and legacy payload names are not.
- PostgreSQL UUIDs are the public resource identifiers. A `legacy_id_maps` record preserves source-table/ID traceability during import.
- All writes enforce authentication, role, department scope, ownership, validation, optimistic locking, audit logging, and soft deletion where the table is mutable.
- A temporary `/api/v1/legacy` adapter may translate legacy field names during cut-over. New frontend code uses only the canonical API below.

## Architecture

```text
HTTP handler → authentication and scope middleware → application service
             → repository/transaction → PostgreSQL
             → outbox/job queue → import, document, report, KPI workers
```

Recommended Go packages:

```text
cmd/api                 process startup and dependency wiring
internal/platform       configuration, auth, errors, logging, validation
internal/identity       users, roles, sessions, password reset
internal/organisation   institutions, departments, programmes, appointments
internal/faculty        profiles and CV
internal/research       publications, patents, projects, grants, supervision
internal/operations     students, staff, courses, events, facilities, placement
internal/cms            announcements, posts, pages, documents, slides
internal/reporting      public search, KPI reads, exports and generated reports
internal/imports        CSE CSV/database migration, ID maps and error review
migrations              PostgreSQL schema, views, seeds and verification tests
```

## Roles and authorisation

| Role | Read/write boundary |
|---|---|
| `INSTITUTE_ADMIN` | All departments, configuration, final publishing, imports and reports. |
| `RESEARCH_OFFICE` | Institute research verification, reconciliations, reports and metrics. |
| `DEPARTMENT_ADMIN` | Assigned department’s people, CMS, facilities, review, imports and operational records. |
| `REVIEWER` | Assigned department’s submitted records; may review/return but not configure. |
| `FACULTY` | Own profile/CV and own research drafts; may nominate collaborators but cannot self-publish. |
| Public | Published public read models only. |

The service derives department authority from active `faculty_appointments` and `role_department_scopes`; it never trusts a client-provided `department_id` alone.

## Canonical API

All canonical endpoints begin with `/api/v1`. List endpoints take `department_id`, `status`, date/year filters, pagination, and a stable sort where relevant. `DELETE` is a soft delete unless the resource is append-only.

| Module | Primary resources and operations |
|---|---|
| Identity | `POST /auth/login`, password-reset start/finish, session refresh/logout; `GET /me`; users and role grants for administrators. |
| Organisation | CRUD for institutions, departments, programmes and course catalogues; faculty appointment create/end/transfer. |
| Faculty | `GET/PATCH /faculty/{id}`, `GET/PATCH /faculty/{id}/profile`; CV collections for qualifications, teaching/admin experience, honours, exposures and expert talks. |
| Research | CRUD and submit/review/publish actions for publications, patents, projects, consultancies, supervisions and events; nested author/inventor/member/department attribution operations. |
| Research finance | Project grant instalments, with transactionally checked sanctioned/received/expenditure totals. |
| Teaching and people | Students, PhD scholars, staff, course offerings and instructor assignments. |
| CMS | Announcements, posts, about sections, programme cards, Q&A, HOD messages, slides, syllabus/calendar document listings and file metadata. |
| Facilities | Labs, equipment and placement statistics. |
| Reporting | Published research catalogue, faculty portfolios, department/institute KPI views, CSV exports, resume generation and annual reports. |
| Import | Create/validate/run an import job; list import errors; resolve retained source-value warnings. |

Example workflow endpoints:

```text
POST  /publications
PATCH /publications/{id}
POST  /publications/{id}/submit
POST  /publications/{id}/reviews
POST  /publications/{id}/publish
GET   /research-catalogue?type=JOURNAL&department_id=...

POST  /imports/cse/validate
POST  /imports/cse/run
GET   /imports/{id}
GET   /imports/{id}/errors
```

## Legacy capability mapping

The old Express backend has CRUD/read paths for faculty, student, publications, patents, projects, consultancies, research supervision, courses, events, CV entries, announcements, posts, pages, documents, labs, equipment, staff, placement, PhD scholars, aggregates, resume, and reports. The new backend retains all of those capabilities through resource-oriented endpoints.

Legacy quirks must be migrated as data or adapter behaviour, not retained as schema rules:

- `uniqueFacultyId` becomes `faculty.employee_code`; its legacy numeric `id` is stored in `legacy_id_maps`.
- `associatedFaculty`, `authorName`, `faculties`, and `Faculty` become explicit author/inventor/member rows. Original free text is retained in raw fields.
- `academicSession` becomes date-derived `academic_year_id` where possible; exceptional legacy strings are retained for import review.
- `pdfLink`, `photo`, `image`, and external URLs become `documents.source_url` and references to `documents`.
- Old public/private announcements become one announcements resource with a visibility field.
- Legacy `researchTypes` maps to `publication_type`; legacy `supervisionTypes` maps to a controlled supervision programme/type.

## CSE import and test requirements

1. Seed the institute, CSE department, system roles, reporting calendar, publication types, metric sources, and required programme rows.
2. Import each CSE source entity in dependency order: people/auth → appointments → CV → research + links → operations → CMS/documents → facilities/placement.
3. Normalize emails, dates, placeholder IDs/DOIs/reference numbers, and duplicate link rows. Do not create a fake course when the source data is absent.
4. Retain unresolvable source values in raw fields and `import_errors`; no row is silently dropped except explicit duplicate/test-row rules recorded by the import report.
5. Assert source/target counts, source-ID coverage, foreign-key validity, unique-key exceptions, and results of the public/backend query suite.

Required acceptance reads:

- faculty directory and every migrated faculty portfolio;
- published research filters by type, faculty, department, and year;
- projects/patents/consultancies/supervisions/events with linked faculty;
- announcements, posts, about content, programme cards, Q&A, documents, slides, labs, equipment, placement, students, staff, and PhD scholars;
- resume and annual-report source datasets;
- department KPI and institute KPI de-duplication queries.

## Operational requirements

- PostgreSQL transactions cover canonical record plus link rows, audit event, review decision, and import source-ID mapping.
- `updated_at` is database-trigger maintained. Clients send a version/ETag on updates; conflicting edits receive `409 Conflict`.
- File uploads validate MIME type and size, scan before public use, and store private object keys. Existing imported external URLs remain read-only source links until copied.
- Imports are asynchronous jobs with row-level validation/error reporting and idempotent source-ID mapping.
- KPI materialized views refresh nightly using `pg_cron` and `REFRESH MATERIALIZED VIEW CONCURRENTLY`; public reads never calculate editable counters.
- The service emits structured logs, request IDs, audit events, health/readiness checks, and metrics for failed auth, imports, documents, and report jobs.
