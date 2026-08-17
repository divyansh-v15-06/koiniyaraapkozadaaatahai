# Tasks — Institute Research, Department and Faculty Platform Rebuild

## Goal

Rebuild the current CSE platform as a clean institute-grade system using:

- Go backend
- PostgreSQL database
- department-first boilerplate architecture
- institute-wide collective reporting
- stronger security for institute-hosted deployment

The existing `tempcsebase` remains the functional reference. We must preserve its public site, faculty workspace, admin workflows, reporting, and especially the statistical/dashboard features that power faculty merit charts and aggregate research views.

This task list is divided into chunks so we can stop after database approval and continue implementation safely.

## Chunk 1 — Scope freeze and baseline extraction

Status: active planning

Objective:
Create the authoritative feature baseline from `tempcsebase` and the new institute-wide requirements.

Tasks:

- Freeze the feature inventory from `tempcsebase` public pages, faculty panel, admin panel, reports and imports.
- Extract all statistical and chart-driven features from the old CSE app.
- Separate "must preserve exactly" from "must redesign cleanly".
- Confirm the new target boundary: one reusable department schema that later powers the institute collective.

Deliverables:

- Approved feature inventory
- Approved architecture direction
- Confirmed dashboard/statistics carry-forward list

Notes:

- The old app has aggregate/statistical behavior in controllers such as `aggregate-controllers.js`; these must be treated as migration requirements, not optional extras.

## Chunk 2 — Database architecture approval

Status: next approval gate

Objective:
Design and approve the clean PostgreSQL data model that every department can use as a boilerplate.

Tasks:

- Finalize the multi-level ownership model: `institution -> department -> faculty -> canonical research`.
- Approve the rule that departments do not get separate copied tables like `cse_publications` or `ece_publications`.
- Finalize canonical entities for publications, patents, projects, consultancies, events, courses and supervision.
- Finalize attribution/link tables for author order, inventor order, project roles and department participation.
- Finalize faculty identity, appointments, profiles and source-metric snapshots.
- Finalize academic year and financial year automation tables.
- Finalize governance tables for audit, review history, imports and error logs.
- Finalize CMS and department operations tables required in phase 1.
- Review required indexes, unique constraints, soft-delete policy and reporting-view assumptions.

Deliverables:

- Approved ER model
- Approved row/column matrix
- Approved data dictionary
- Approved list of reporting views/materialized views

Approval gate:

- No backend implementation starts until this chunk is approved.

## Chunk 3 — Statistics and reporting model definition

Status: queued after DB approval

Objective:
Carry over all meaningful analytical behavior from `tempcsebase` into a clean reporting model.

Tasks:

- Identify every old chart, counter, summary card and ranking dataset.
- Map old aggregate APIs to new PostgreSQL views or materialized views.
- Separate department-level totals from institute-level deduplicated totals.
- Define faculty merit datasets using publication counts, patent counts, project totals, events, supervision and external metrics.
- Define time-based slices by academic year, financial year and calendar year where needed.
- Define public versus admin-only reporting outputs.

Deliverables:

- Reporting feature matrix
- KPI view list
- Chart dataset contract for frontend/API

Required carry-forward areas from `tempcsebase`:

- faculty analytics pages
- aggregate research counters
- department summary stats
- research output comparisons by faculty
- report-generation inputs for resumes and annual reports

## Chunk 4 — Go backend foundation

Status: queued after DB approval

Objective:
Set up the production backend foundation in Go around the approved schema.

Tasks:

- Choose the backend layout: modular monolith in Go.
- Select core libraries for router, config, logging, validation, auth, database access and migrations.
- Create module boundaries for auth, faculty, research, CMS, dashboard, imports and admin.
- Establish API versioning from day one.
- Create shared error handling, structured logging and request tracing.
- Add background job support for imports, metrics refresh and document/report generation.

Deliverables:

- Go service skeleton
- migration framework
- module layout
- API conventions document

## Chunk 5 — Security architecture

Status: queued but mandatory before deployment

Objective:
Design institute-grade security for an on-premise/institute-hosted deployment.

Tasks:

- Define authentication model for faculty, department admin, institute admin and reviewers.
- Define RBAC with department scoping and institute-wide override roles.
- Add secure password policy, reset flow, session/token rotation and forced reset handling.
- Define audit logging requirements for create, update, delete, review, login, reset and import actions.
- Add file upload protections: MIME validation, size limits, antivirus hook point, private object storage and signed access.
- Add database hardening assumptions: least-privilege roles, migration role, app role, read-only reporting role.
- Add API protections: rate limiting, CSRF strategy if cookie auth is used, CORS policy, request body limits and input validation.
- Add infra protections: reverse proxy, TLS, secure headers, secrets management, backup policy and restore drills.
- Add monitoring and incident visibility: auth failures, suspicious mutations, import failures and storage access logs.

Deliverables:

- Security checklist
- auth/RBAC design
- deployment hardening guide

Note:

- Security will be built into the architecture, but final production hardening review must happen before launch.

## Chunk 6 — PostgreSQL schema and migrations

Status: queued after DB approval

Objective:
Turn the approved model into production-quality PostgreSQL DDL and migration files.

Tasks:

- Write base schema migrations.
- Add enums or lookup tables only where operationally justified.
- Add constraints, indexes and partial unique indexes.
- Add reporting views/materialized views.
- Seed institution, one department, roles, metric sources and calendar settings.
- Add schema tests for critical constraints.

Deliverables:

- SQL migrations
- seed scripts
- schema verification tests

## Chunk 7 — Data migration plan from `tempcsebase`

Status: queued after DB approval

Objective:
Create a reliable migration path from the current CSE data into the new schema.

Tasks:

- Map every old table to its new canonical destination.
- Identify legacy assumptions that must be cleaned during migration.
- Normalize faculty identities and research links.
- Normalize DOI, patent numbers, project references and academic session values.
- Capture missing data, invalid dates, duplicate records and orphaned research rows.
- Define retryable import jobs and import error reporting.

Deliverables:

- migration mapping sheet
- cleansing rules
- import plan and validation checklist

## Chunk 8 — Department-first APIs and workflows

Status: queued after DB approval

Objective:
Implement the operational API surface for one department deployment.

Tasks:

- Build auth and user management APIs.
- Build faculty profile and CV APIs.
- Build CRUD and workflow APIs for publications, patents, projects, consultancies, events, courses and supervision.
- Build CMS APIs for announcements, posts, documents, labs, equipment and placements.
- Build review and publish workflow APIs.
- Build dashboard/reporting read APIs.

Deliverables:

- versioned REST API
- review workflow endpoints
- reporting endpoints

## Chunk 9 — Institute collective layer

Status: queued after department schema and APIs stabilize

Objective:
Expose institute-wide discovery and reporting without duplicating operational data.

Tasks:

- Build institute directory of departments and faculty.
- Build institute research catalogue with deduplicated canonical outputs.
- Build institute KPI dashboards and rankings.
- Add institute-level verification, reconciliation and duplicate-resolution tools.
- Add institute-scoped filters across department, faculty, research type and year.

Deliverables:

- institute collective APIs
- institute dashboard datasets
- deduplicated catalogue views

## Chunk 10 — Reports, exports and generated documents

Status: queued after core APIs

Objective:
Retain and improve the output/reporting behavior from the current system.

Tasks:

- Rebuild faculty resume generation.
- Rebuild department and institute annual reporting.
- Add CSV export/import flows with validation reports.
- Add filtered exports for faculty, research, projects, patents and placements.

Deliverables:

- resume/export services
- annual report generation
- CSV import/export package

## Chunk 11 — Validation, testing and launch hardening

Status: queued before rollout

Objective:
Make the system reliable enough for institute-hosted production use.

Tasks:

- Add unit, integration and migration tests.
- Add authorization tests across scoped roles.
- Add import regression tests using representative old CSE data.
- Add reporting accuracy tests for department and institute counters.
- Add performance tests for dashboard queries and public faculty search.
- Run security review and deployment checklist.
- Document backup, restore and operator procedures.

Deliverables:

- test suite
- release checklist
- production readiness notes

## Immediate next step

We stop at Chunk 2 for now.

The next artifact to approve is the database package:

- final entity list
- final row/column definitions
- final relationships
- final constraints and reporting-view assumptions

Once the DB is approved, we continue with PostgreSQL DDL and the Go backend foundation.
