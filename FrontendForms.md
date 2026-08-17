# Frontend Form Inventory — CSE Carry-forward to the New Department Portal

This is the form contract to carry forward from `tempcsebase`. Names below are canonical frontend names; a temporary legacy adapter may accept old keys such as `uniqueFacultyId`, `pdfLink`, `filledDate`, `vender`, and `authorName` only during cut-over.

## Shared rules

- Every mutating form has department context, server-returned field errors, optimistic-lock version, save-draft where workflow applies, and unsaved-change warning.
- UUIDs are selected from API data; users never type internal IDs.
- File fields create a `documents` row first, then submit its UUID with the owning form.
- Dates use ISO `YYYY-MM-DD`; money uses decimal INR values; a blank optional identifier is submitted as `null`, never `NA` or `-`.

## Identity, faculty, and CV

| Form | Required fields | Optional / controlled fields |
|---|---|---|
| Login | identifier, password | Remember-session control. |
| Password reset | official email | Reset token and new password on completion. |
| Faculty master | employee code, official email, full name, employment status | Photo/document, phone, public slug, sort order. Admin only. |
| Faculty profile | biography, research areas | Date of birth/joining, ORCID, Scopus/Scholar/Web-of-Science/ResearchGate/Vidwan/LinkedIn links. |
| Appointment | faculty, department, designation, start date | Primary toggle and end date; UI must show any existing primary appointment. |
| Qualification | degree, institution, completion year | Specialisation/document. |
| Teaching experience | designation, organisation/department, start date | End date or “current”. |
| Administrative experience | role title | Organisation and dates. |
| Honour | title, awarding body, award date/year | Supporting document. |
| Exposure | title | Organiser, dates, description. |
| Expert talk | title | Host/venue, dates, description. |

## Research and teaching

| Form | Required fields | Optional / controlled fields |
|---|---|---|
| Publication | title, publication type, at least one department attribution | DOI, ISBN, venue, publisher, volume/issue/pages, publication date, indexing, quartile, raw author string, ordered authors, internal faculty links. DOI is normalized before submission. |
| Patent | title, status, at least one department attribution | Application/publication/grant numbers, jurisdiction, office, filing/publication/grant dates, applicant/assignee, raw inventor string, ordered inventors. |
| Project | title, status, lead department | Project number, sponsor, scheme, dates, sanctioned amount, PI raw text, project members and department roles. |
| Grant instalment | project, financial year | Sanction order, sanctioned/received/expenditure amounts and dates. |
| Consultancy | title, department, status | Client, reference number, amount, dates, member roles. |
| Supervision | department, programme/type, scholar name | Roll number, title/topic, status, milestone dates, supervisor/co-supervisor roles. |
| Event | department, title, event type | Category, venue, sponsor, dates, raw convenor/coordinator text, participating faculty. |
| Course catalogue | department, code, title, credits | Programme, semester, course level and description. |
| Course offering | course, academic year, term, instructor(s) | Instructor role and workload. |

## Department operations and CMS

| Form | Required fields | Optional / controlled fields |
|---|---|---|
| Student | department, programme, full name, roll number, batch/admission year | Email, photo, semester, status. |
| PhD scholar | department, full name, status | Roll number, registration date, dissertation, raw supervisor text and profile links. |
| Staff | department, full name, designation, official email | Phone, photo, legacy time/office-hours note. |
| Announcement | department, title, publish date, visibility | Body, expiry, attached document. |
| Post | department, category, title, body | Slug, publish date, feature image, attached document. |
| About section | department, body | Title, display order, publication status. |
| Programme card | department, title, body | Linked programme and display order. |
| Q&A | department, question, answer | Display order and status. |
| HOD message | department, body | Faculty author, display name, image, publish date. |
| Slide | department, image document | Title, link, display order, publish window. |
| Syllabus/calendar listing | department, title, document | Programme and academic year where applicable. |
| Lab | department, name, description | Location, image, selected in-charge plus preserved raw name, technician. |
| Equipment | department, name, quantity, stock, value | Lab, asset tag, purchase date, invoice, vendor, indenter, contact details. |
| Placement statistics | department, academic year, programme/branch, graduating count, placed count, jobs offered | Highest/average/median package. Percentages are read-only calculated values. |

## Governance and imports

| Form | Required fields | Behaviour |
|---|---|---|
| Review decision | decision | Review comment; only a scoped reviewer/admin can submit it. |
| Document upload | file, visibility | File validation, malware scan state, title/document kind. |
| CSE/CSV import | source file/type and department | Preview, validation errors, duplicate strategy, confirmed asynchronous job. |
| Import-error resolution | selected error and resolution | Records correction/skip/remap audit trail; never silently erases the source row. |

## Validation and test coverage

- Implement each form with React Hook Form + Zod (or equivalent) using the canonical API contract.
- Test required fields, enum/select values, date ranges, amount precision, DOI normalization, unique conflict rendering, file rejection, department-scope denial, and optimistic-lock conflict recovery.
- Seeded CSE data must open successfully in every corresponding edit/detail screen; this is the UI acceptance test for the migration.
