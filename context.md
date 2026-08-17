# Context — Institute Research, Department & Faculty Portfolio Platform

## Purpose

Build a new, standardised platform for all institute departments. It must retain the complete functional coverage of the existing CSE application in `tempcsebase`, while becoming a clean foundation for institute-wide research discovery, reporting and administration.

The platform has three connected public levels:

```text
Institute collective view
  └── Department / centre view
        └── Individual faculty portfolio
```

All three views are generated from the same canonical data. A faculty member updates a portfolio once; approved records appear in the relevant department and institute views automatically.

## Current baseline: `tempcsebase`

The existing CSE system is the functional reference—not the data-model boundary.

### Existing capabilities that the new platform must retain

| Area | Existing CSE features to preserve |
|---|---|
| Public department site | home carousel, about/HOD, programmes, syllabus/calendar, labs, placements, announcements, achievements/news, faculty/staff/student/PhD directories |
| Public research | publications, patents, projects, consultancies, events, individual faculty research/CV pages |
| Faculty workspace | login/password reset, personal profile, qualifications, teaching/admin experience, honours, exposures, expert talks, publications, patents, projects, consultancies, supervision, events, course assignments, analytics, resume export |
| Department administration | manage people, credentials, content, notices, research, labs/equipment, courses, reports, CSV imports and dashboard analytics |
| Backend operations | image uploads, CSV bulk imports, email-based password reset, DOCX faculty resume and annual report generation |

The current stack is Next.js 14, Express/Sequelize, MySQL 8, Docker Compose and Nginx. Its clean 41-table CSE schema is valuable migration input, but the new design must not copy its CSE-only assumptions (one implicit department, direct faculty ownership everywhere, manual academic-session strings, and legacy URL conventions).

## Required extension beyond the existing site

### Institute and department scope

- One institute landing page listing departments/centres and institute-wide research/faculty totals.
- Separate public department pages and dashboards.
- Individual faculty portfolios that can be viewed in public, faculty, department-admin and institute-admin contexts.
- Support current, historical, primary and joint faculty appointments across departments/centres.
- Institute totals must count a canonical publication/project once, even if it is attributed to multiple departments.

### Research catalogue and portfolios

- Separate searchable pages and separate add/update/delete workflows for **journals**, **conferences**, **books**, and **book chapters**.
- Research output needs canonical records plus ordered author/inventor/member links; do not duplicate the same publication for each faculty member.
- Expanded patent records: title, type, status, application/publication/grant numbers, jurisdiction, patent office, applicant/assignee, inventor order, filing/publication/grant dates, document and source URLs.
- Projects need sponsor/scheme, status, dates, sanctioned/received/expenditure values, grant instalments, lead department and PI/Co-PI membership.
- Preserve consultancies, research supervision, events, courses, qualifications, experience, honours, exposure and expert-talk records.

### Research metrics

For each faculty profile show:

- H-index (Scopus)
- Citations (Scopus)
- H-index (Google Scholar)
- Citations (Google Scholar)

These values are source-specific, timestamped snapshots—not editable profile fields. Store each faculty member's Scopus Author ID, Google Scholar ID and ORCID. Public pages show the current verified value, its source and its last-updated time.

### Automation and governance

- Institute, department and faculty dashboards calculate counts and funding from approved canonical records.
- New research records follow `DRAFT → SUBMITTED → DEPARTMENT_VERIFIED → PUBLISHED` (or `RETURNED`/`ARCHIVED`).
- Institute and department admins receive exception queues: duplicate DOI/patent number, unassigned department, incomplete required fields, stale metrics, failed import and pending review.
- Every create/update/delete/review action is auditable.
- Academic years and financial years are generated automatically from institute calendar settings; records use real event dates and derive their reporting period.
- Reports must support institute, department and faculty scope, plus academic-year and financial-year filters.

## Architecture direction

Start as a modular monolith:

```text
Next.js application
    ↕ authenticated REST API
NestJS modules + background workers
    ↕
PostgreSQL + Redis queue + S3/R2 private object storage
```

PostgreSQL is the target database for the new product. It provides robust full-text search, materialized KPI views, typed JSON import payloads, strong transactional constraints and extensibility for a multi-department system. The existing MySQL schema remains the migration source only.

## Roles and ownership

| Role | Scope | Main responsibility |
|---|---|---|
| Institute administrator | whole institute | configuration, user/department administration, final publishing, reports |
| Research office | whole institute | research verification, duplicate reconciliation, metric imports, reporting |
| Department administrator | assigned departments | department CMS, people and research review within scope |
| Reviewer | assigned departments | review/return records, no configuration authority |
| Faculty | own portfolio | create and maintain drafts, nominate collaborators |
| Public visitor | published records | search/read public content |

## First delivery: reusable clean department database boilerplate

Do **not** begin by rebuilding every page or by implementing cross-institute dashboards. The first deliverable is a production-quality department database package that every department can use as its isolated deployment and that can later be attached to the institute collective.

### Boilerplate boundary

The first schema includes a mandatory `departments` table even in a single-department deployment. Seed one department during installation. This avoids a second destructive migration when departments become collective participants.

It also includes `institutions` from day one, but the initial application is configured for exactly one institution and one department.

### First schema modules

1. **Organisation and access**
   - `institutions`, `departments`, `programmes`
   - `faculty`, `faculty_appointments`, `faculty_profiles`
   - `users`, `roles`, `user_roles`, `role_department_scopes`
2. **Faculty CV**
   - qualifications, teaching experience, administrative experience, honours, exposures, expert talks
3. **Research**
   - `publications`, `publication_authors`, `publication_departments`
   - `patents`, `patent_inventors`
   - `projects`, `project_members`, `project_departments`, `grants`
   - consultancies, supervision, events and courses with their member links
4. **Metrics and time**
   - metric sources, faculty/publication metric snapshots
   - academic years, financial years and institute calendar settings
5. **CMS and department operations**
   - announcements, posts, HOD message, programmes offered, documents, slides, labs, equipment, placement stats, staff, students and PhD scholars
6. **Governance**
   - review history, audit log, import jobs/errors and documents/media metadata

### Database rules for the boilerplate

- Use PostgreSQL 16+ and UUID primary keys.
- Include `created_at`, `updated_at`, creator/updater identities, `status`, `published_at` and `archived_at` where applicable.
- Do not hard-delete research or audit-relevant records.
- DOI must be normalized and unique when present; missing/placeholder DOI is `NULL`, never `NA`, `-` or an empty string.
- Faculty membership is through `faculty_appointments`; do not put a lone `department_id` on faculty.
- Research author/member joins retain person order and role and permit external collaborators without creating fake faculty rows.
- Dates determine academic/financial reporting periods; free-text session columns are prohibited.
- Amounts use `NUMERIC(14,2)` and currencies are explicit.
- All public counts derive from approved/published records through views; they are never editable counters.
- Apply row-level or service-level scoped authorization to every mutation.

### Boilerplate outputs

The database-design stage will produce:

1. PostgreSQL DDL and migration files.
2. Prisma schema (or equivalent ORM schema) that matches the DDL exactly.
3. ER diagram and data dictionary.
4. Seed data for one institute, one department, roles, publication types and reporting-calendar settings.
5. Constraint/index specification and automated schema tests.
6. CSE-to-new-schema migration map, including legacy-data cleansing.

## Explicit design decisions

- The existing CSE site's pages and workflows are feature requirements; its legacy route names and data shapes are not required to survive.
- The department boilerplate is the first build target. Institute collective pages come after the department schema is stable.
- A department deployment must work independently, then register/sync with the institute collective through the same schema/API contract.
- Public data appears only after the required verification stage.
- Metric integrations are subject to provider access/licensing. Preserve source ID, timestamp and imported raw response/checksum for every value.

## Open decisions before writing database migrations

1. Is the collective a single central database for all departments, or do independent department databases synchronise to a central institute index?
2. What are the institute's official academic-year start month and financial-year rules?
3. Is department verification sufficient to publish faculty research, or must the research office provide a final approval?
4. Which project financial figures are mandatory: sanctioned, received, expenditure, or all three?
5. Which existing CSE content (students, placement, labs, CMS) must be mandatory in the first boilerplate release versus an optional module?

## Reference material

- `Architecture.md`: original CSE-only architecture blueprint.
- `InstituteArchitecture.md`: target institute-wide architecture proposal.
- `tempcsebase/`: implementation and migration reference for the current CSE system.
- `tempcsebase/schema-design/SUMMARY.md`: current clean MySQL schema and legacy-data migration analysis.
