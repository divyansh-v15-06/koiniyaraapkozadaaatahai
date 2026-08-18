# Frontend Flow — Institute Research Portal

## 0. Core principle

There is **one department template**, not N separate department frontends. The CSE page you already have (temp CSE) becomes `DepartmentTemplate`, parameterized by `department_id`/`slug`. Every department — ECE, ME, whatever — renders through the same template, fed by the same `v_department_kpis` view. You never hand-build a second department page.

The institute home page is a **separate, higher-level template** (`InstituteTemplate`) that aggregates across all departments via `v_institute_kpis`. It is not "CSE page but bigger" — it has its own layout, because institute-level data (top faculty across depts, cross-department publications, institute rankings) doesn't exist at department scope.

---

## 1. Site map

```
/                                → Institute home (institute-wide stats)
/departments                     → Department directory + dropdown/search
/departments/[slug]              → Department page (same template as temp CSE)
/departments/[slug]/faculty      → Department faculty directory
/faculty/[slug]                  → Individual faculty portfolio
/research/journals               → Institute-wide journal catalogue (filterable by dept)
/research/conferences            → same, conference papers
/research/books                  → same, books
/research/book-chapters          → same, book chapters
/projects                        → Institute-wide + filterable by department
/projects/[id]                   → Project detail
/patents                         → Institute-wide + filterable by department
/patents/[id]                    → Patent detail
```

Admin/auth routes (`/admin/*`, `/faculty/portal/*`) are out of scope for this doc — this covers the **public read flow** only, matching your stated ask.

---

## 2. Page 1 — Institute home (`/`)

**Purpose:** the "yk" net stats page — total institute picture, then a way down into any department.

### Sections, top to bottom

1. **Hero / institute banner** — institution name, tagline, hero stat strip (total faculty, total publications, total patents, total funded amount) pulled from `v_institute_kpis`.
2. **Department selector** — this is the dropdown you asked for. Not buried in nav — a prominent selector component (`<DepartmentSelector />`) that:
   - Lists all departments (`GET /api/v1/departments`)
   - On selection, routes to `/departments/[slug]`
   - Optionally shows a mini stat preview on hover/select before navigating (nice-to-have, not required for v1)
3. **Institute KPI grid** — publications by type (journal/conf/book/chapter), active projects, total sanctioned funding, patents by status, faculty count. Same shape as department KPI grid (see Page 2) but institute-scoped and deduplicated (`COUNT(DISTINCT publication.id)` etc. — already handled server-side by the view, frontend just renders numbers).
4. **Top faculty / leaderboard** — by citations or h-index, institute-wide, cross-department.
5. **Latest research feed** — most recent published publications/projects/patents institute-wide, each tagged with its department(s) (a joint CSE-ECE paper shows both badges).
6. **Department cards grid** — visual alternative to the dropdown; each department as a card with a headline stat (faculty count, publication count) linking to `/departments/[slug]`. This is the "browse" path; the dropdown is the "jump directly" path. Both lead to the same place.
7. **Footer** — standard.

### Data source
`GET /api/v1/dashboard?scope=institute&academicYear=current`

---

## 3. Page 2 — Department directory (`/departments`)

Lightweight page: full list/grid of departments with search-as-you-type filtering. Exists mainly as a landing target for the "Departments" nav item and for the dropdown's "view all" fallback. Each entry links to `/departments/[slug]`.

**Data source:** `GET /api/v1/departments`

---

## 4. Page 3 — Department page (`/departments/[slug]`) — THE TEMPLATE

This is temp CSE, genericized. Every section below currently exists in your CSE mock; the only change is that every query becomes `WHERE department_id = :resolvedFromSlug` instead of hardcoded CSE.

### Sections, top to bottom (mirrors temp CSE 1:1)

1. **Department header** — name, HOD/chair, short description, contact, department logo/banner.
2. **Department KPI strip** — faculty count, active students, publications by type, funded projects, sanctioned/received amount, patents by status. Source: `v_department_kpis` row for this `department_id`.
3. **Faculty highlights** — top faculty by metric within this department, "view all faculty →" link to `/departments/[slug]/faculty`.
4. **Programmes offered** — from `programmes` table, scoped to department.
5. **Research output tabs** — Journals / Conferences / Books / Book chapters, each a filtered slice of the institute catalogue (`/research/journals?department=slug` etc.), embedded inline (paginated, ~5-10 rows) with "view all →" linking out to the full catalogue page pre-filtered.
6. **Active projects & funding** — table/cards of `project_departments`-attributed projects, with sanctioned/received amounts.
7. **Patents** — list attributed to this department via `patent_inventors`/patent-department attribution.
8. **Labs & facilities** — from `labs`/`equipment`, department-scoped, descriptive only (not part of KPI totals — matches your earlier schema note).
9. **Placement stats** (if applicable to the department) — from `placement_stats`.
10. **Department announcements/news** — from `documents`/`posts` scoped to `department_id`.

### Data source
`GET /api/v1/dashboard?scope=department&id=:departmentId&academicYear=current`
Plus targeted calls for programmes, labs, announcements if not bundled into the dashboard payload.

### Routing detail
`[slug]` resolves to `department_id` via a lightweight lookup (`GET /api/v1/departments/:slug/overview` or a client-side cache of the department list fetched on `/departments`). Handle 404 cleanly if slug doesn't resolve.

---

## 5. Shared components (build once, reuse everywhere)

| Component | Used on | Notes |
|---|---|---|
| `<DepartmentSelector />` | Institute home, global nav | Dropdown; institute home version is prominent, nav version is compact |
| `<KpiGrid />` | Institute home, department page, faculty page | Takes a stats object + labels; scope-agnostic |
| `<ResearchOutputTabs />` | Department page, research catalogue pages | Journal/Conference/Book/Book-chapter tab switcher, accepts a `department` filter prop (optional) |
| `<FacultyCard />` | Department faculty list, institute leaderboard | |
| `<ProjectCard />` / `<PatentCard />` | Department page, `/projects`, `/patents` | |
| `<DepartmentBadge />` | Publication/project/patent list items | Renders one badge per attributed department — critical for showing joint CSE-ECE work correctly on both department pages |
| `<StatCard />` | Everywhere a single number+label needs display | |

Building `DepartmentTemplate` as a composition of these components (rather than one monolithic page file) is what lets the institute page reuse `<KpiGrid />` and `<ResearchOutputTabs />` without duplicating logic.

---

## 6. State / data-fetching approach

- Next.js App Router: department page is `app/departments/[slug]/page.tsx`, server component, fetches via the NestJS API at request/build time (ISR — revalidate periodically, since KPIs update via nightly matview refresh, not real-time).
- `academicYear` defaults to `current` but should be a URL search param (`?year=2025-26`) so users can view historical snapshots — matches your `academic_years.is_current` design.
- Department dropdown itself is a small client component (needs interactivity) hydrated with a server-fetched department list — don't refetch the list on every keystroke.

---

## 7. Build order

1. Build `<KpiGrid />`, `<DepartmentBadge />`, `<StatCard />` as pure presentational components against mock data.
2. Build `DepartmentTemplate` (Page 3) wired to real API, using CSE as the first live department — this validates the template against real data before any other department exists.
3. Build `<DepartmentSelector />` and wire routing.
4. Build institute home (Page 1) — now `<KpiGrid />` and `<DepartmentBadge />` are already proven, this is mostly composition + the institute-scope dashboard call.
5. Build `/departments` directory page — trivial once the department list endpoint and cards exist.
6. Build catalogue pages (`/research/*`, `/projects`, `/patents`) — reuse `<ResearchOutputTabs />` filter logic already built for the department page.

This order means CSE stays your one working reference implementation the whole way through, and every other department "just appears" once seeded — no second frontend to build.