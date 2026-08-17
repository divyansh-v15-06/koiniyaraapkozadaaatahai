-- ============================================================================
-- 000002_materialized_views.up.sql
-- Materialized Views for Faculty, Department, and Institute Analytics & KPIs
-- ============================================================================

-- 1. Faculty KPIs
CREATE MATERIALIZED VIEW v_faculty_kpis AS
WITH pub_counts AS (
    SELECT 
        pa.faculty_id,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'JOURNAL') AS journal_count,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'CONFERENCE') AS conference_count,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'BOOK') AS book_count,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'BOOK_CHAPTER') AS book_chapter_count,
        COUNT(DISTINCT p.id) AS total_publications
    FROM publication_authors pa
    JOIN publications p ON p.id = pa.publication_id
    WHERE pa.faculty_id IS NOT NULL AND p.deleted_at IS NULL
    GROUP BY pa.faculty_id
),
patent_counts AS (
    SELECT 
        pi.faculty_id,
        COUNT(DISTINCT pat.id) AS patent_count
    FROM patent_inventors pi
    JOIN patents pat ON pat.id = pi.patent_id
    WHERE pi.faculty_id IS NOT NULL AND pat.deleted_at IS NULL
    GROUP BY pi.faculty_id
),
project_counts AS (
    SELECT 
        pm.faculty_id,
        COUNT(DISTINCT prj.id) FILTER (WHERE prj.status = 'Ongoing') AS ongoing_projects,
        COUNT(DISTINCT prj.id) FILTER (WHERE prj.status = 'Completed') AS completed_projects,
        COALESCE(SUM(prj.total_sanctioned_amount), 0) AS total_funding
    FROM project_members pm
    JOIN projects prj ON prj.id = pm.project_id
    WHERE pm.faculty_id IS NOT NULL AND prj.deleted_at IS NULL
    GROUP BY pm.faculty_id
),
supervision_counts AS (
    SELECT 
        ss.faculty_id,
        COUNT(DISTINCT s.id) AS total_supervisions
    FROM supervision_supervisors ss
    JOIN supervisions s ON s.id = ss.supervision_id
    WHERE ss.faculty_id IS NOT NULL AND s.deleted_at IS NULL
    GROUP BY ss.faculty_id
),
event_counts AS (
    SELECT 
        ec.faculty_id,
        COUNT(DISTINCT e.id) AS total_events
    FROM event_coordinators ec
    JOIN events e ON e.id = ec.event_id
    WHERE ec.faculty_id IS NOT NULL AND e.deleted_at IS NULL
    GROUP BY ec.faculty_id
),
scopus_metric AS (
    SELECT DISTINCT ON (fms.faculty_id)
        fms.faculty_id,
        fms.h_index AS scopus_h_index,
        fms.citations AS scopus_citations
    FROM faculty_metric_snapshots fms
    JOIN metric_sources ms ON ms.id = fms.metric_source_id
    WHERE ms.code = 'SCOPUS'
    ORDER BY fms.faculty_id, fms.captured_at DESC
),
scholar_metric AS (
    SELECT DISTINCT ON (fms.faculty_id)
        fms.faculty_id,
        fms.h_index AS scholar_h_index,
        fms.citations AS scholar_citations
    FROM faculty_metric_snapshots fms
    JOIN metric_sources ms ON ms.id = fms.metric_source_id
    WHERE ms.code = 'GOOGLE_SCHOLAR'
    ORDER BY fms.faculty_id, fms.captured_at DESC
)
SELECT 
    f.id AS faculty_id,
    f.full_name AS faculty_name,
    f.employee_code,
    f.designation,
    COALESCE(pc.journal_count, 0) AS journal_count,
    COALESCE(pc.conference_count, 0) AS conference_count,
    COALESCE(pc.book_count, 0) AS book_count,
    COALESCE(pc.book_chapter_count, 0) AS book_chapter_count,
    COALESCE(pc.total_publications, 0) AS total_publications,
    COALESCE(patc.patent_count, 0) AS patent_count,
    COALESCE(prjc.ongoing_projects, 0) AS ongoing_projects,
    COALESCE(prjc.completed_projects, 0) AS completed_projects,
    COALESCE(prjc.total_funding, 0.00) AS total_funding,
    COALESCE(sc.total_supervisions, 0) AS total_supervisions,
    COALESCE(ec.total_events, 0) AS total_events,
    COALESCE(sm.scopus_h_index, 0) AS scopus_h_index,
    COALESCE(sm.scopus_citations, 0) AS scopus_citations,
    COALESCE(gm.scholar_h_index, 0) AS scholar_h_index,
    COALESCE(gm.scholar_citations, 0) AS scholar_citations,
    NOW() AS calculated_at
FROM faculty f
LEFT JOIN pub_counts pc ON pc.faculty_id = f.id
LEFT JOIN patent_counts patc ON patc.faculty_id = f.id
LEFT JOIN project_counts prjc ON prjc.faculty_id = f.id
LEFT JOIN supervision_counts sc ON sc.faculty_id = f.id
LEFT JOIN event_counts ec ON ec.faculty_id = f.id
LEFT JOIN scopus_metric sm ON sm.faculty_id = f.id
LEFT JOIN scholar_metric gm ON gm.faculty_id = f.id
WHERE f.deleted_at IS NULL;

CREATE UNIQUE INDEX idx_mv_faculty_kpis_id ON v_faculty_kpis(faculty_id);

-- 2. Department KPIs
CREATE MATERIALIZED VIEW v_department_kpis AS
WITH dept_faculty AS (
    SELECT 
        fa.department_id,
        COUNT(DISTINCT fa.faculty_id) AS faculty_count
    FROM faculty_appointments fa
    JOIN faculty f ON f.id = fa.faculty_id
    WHERE fa.end_date IS NULL AND fa.deleted_at IS NULL AND f.deleted_at IS NULL
    GROUP BY fa.department_id
),
dept_staff AS (
    SELECT department_id, COUNT(*) AS staff_count
    FROM staff WHERE deleted_at IS NULL
    GROUP BY department_id
),
dept_students AS (
    SELECT 
        department_id,
        COUNT(*) AS total_students,
        COUNT(*) FILTER (WHERE p.level = 'UG') AS ug_students,
        COUNT(*) FILTER (WHERE p.level = 'PG') AS pg_students
    FROM students s
    JOIN programmes p ON p.id = s.programme_id
    WHERE s.deleted_at IS NULL
    GROUP BY department_id
),
dept_phd AS (
    SELECT 
        department_id,
        COUNT(*) FILTER (WHERE status = 'pursuing') AS pursuing_phd_count,
        COUNT(*) FILTER (WHERE status = 'passed') AS passed_phd_count
    FROM phd_scholars WHERE deleted_at IS NULL
    GROUP BY department_id
),
dept_pubs AS (
    SELECT 
        pd.department_id,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'JOURNAL') AS journal_count,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'CONFERENCE') AS conference_count,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'BOOK') AS book_count,
        COUNT(DISTINCT p.id) FILTER (WHERE p.publication_type = 'BOOK_CHAPTER') AS book_chapter_count,
        COUNT(DISTINCT p.id) AS total_publications
    FROM publication_departments pd
    JOIN publications p ON p.id = pd.publication_id
    WHERE p.deleted_at IS NULL
    GROUP BY pd.department_id
),
dept_patents AS (
    SELECT 
        patd.department_id,
        COUNT(DISTINCT pat.id) AS patent_count
    FROM patent_departments patd
    JOIN patents pat ON pat.id = patd.patent_id
    WHERE pat.deleted_at IS NULL
    GROUP BY patd.department_id
),
dept_projects AS (
    SELECT 
        pd.department_id,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'Ongoing') AS ongoing_projects,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'Completed') AS completed_projects,
        COALESCE(SUM(p.total_sanctioned_amount), 0) AS total_sanctioned_amount,
        COALESCE(SUM(p.total_amount_received), 0) AS total_amount_received
    FROM project_departments pd
    JOIN projects p ON p.id = pd.project_id
    WHERE p.deleted_at IS NULL
    GROUP BY pd.department_id
),
dept_events AS (
    SELECT department_id, COUNT(*) AS event_count
    FROM events WHERE deleted_at IS NULL
    GROUP BY department_id
),
dept_consultancies AS (
    SELECT department_id, COUNT(*) AS consultancy_count, COALESCE(SUM(sanctioned_amount), 0) AS consultancy_funding
    FROM consultancies WHERE deleted_at IS NULL
    GROUP BY department_id
)
SELECT 
    d.id AS department_id,
    d.institution_id,
    d.name AS department_name,
    d.slug AS department_slug,
    d.code AS department_code,
    COALESCE(df.faculty_count, 0) AS faculty_count,
    COALESCE(ds.staff_count, 0) AS staff_count,
    COALESCE(dst.total_students, 0) AS total_students,
    COALESCE(dst.ug_students, 0) AS ug_students,
    COALESCE(dst.pg_students, 0) AS pg_students,
    COALESCE(dphd.pursuing_phd_count, 0) AS pursuing_phd_count,
    COALESCE(dphd.passed_phd_count, 0) AS passed_phd_count,
    COALESCE(dp.journal_count, 0) AS journal_count,
    COALESCE(dp.conference_count, 0) AS conference_count,
    COALESCE(dp.book_count, 0) AS book_count,
    COALESCE(dp.book_chapter_count, 0) AS book_chapter_count,
    COALESCE(dp.total_publications, 0) AS total_publications,
    COALESCE(dpat.patent_count, 0) AS patent_count,
    COALESCE(dprj.ongoing_projects, 0) AS ongoing_projects,
    COALESCE(dprj.completed_projects, 0) AS completed_projects,
    COALESCE(dprj.total_sanctioned_amount, 0.00) AS total_sanctioned_amount,
    COALESCE(dprj.total_amount_received, 0.00) AS total_amount_received,
    COALESCE(dev.event_count, 0) AS event_count,
    COALESCE(dcon.consultancy_count, 0) AS consultancy_count,
    COALESCE(dcon.consultancy_funding, 0.00) AS consultancy_funding,
    NOW() AS calculated_at
FROM departments d
LEFT JOIN dept_faculty df ON df.department_id = d.id
LEFT JOIN dept_staff ds ON ds.department_id = d.id
LEFT JOIN dept_students dst ON dst.department_id = d.id
LEFT JOIN dept_phd dphd ON dphd.department_id = d.id
LEFT JOIN dept_pubs dp ON dp.department_id = d.id
LEFT JOIN dept_patents dpat ON dpat.department_id = d.id
LEFT JOIN dept_projects dprj ON dprj.department_id = d.id
LEFT JOIN dept_events dev ON dev.department_id = d.id
LEFT JOIN dept_consultancies dcon ON dcon.department_id = d.id
WHERE d.deleted_at IS NULL;

CREATE UNIQUE INDEX idx_mv_dept_kpis_id ON v_department_kpis(department_id);

-- 3. Institute Collective KPIs (Deduplicated canonical records)
CREATE MATERIALIZED VIEW v_institute_kpis AS
SELECT 
    i.id AS institution_id,
    i.name AS institution_name,
    i.slug AS institution_slug,
    COUNT(DISTINCT d.id) AS department_count,
    COUNT(DISTINCT f.id) AS faculty_count,
    (SELECT COUNT(DISTINCT p.id) FROM publications p WHERE p.deleted_at IS NULL) AS canonical_publications_count,
    (SELECT COUNT(DISTINCT pat.id) FROM patents pat WHERE pat.deleted_at IS NULL) AS canonical_patents_count,
    (SELECT COUNT(DISTINCT prj.id) FROM projects prj WHERE prj.deleted_at IS NULL) AS canonical_projects_count,
    (SELECT COALESCE(SUM(prj.total_sanctioned_amount), 0.00) FROM projects prj WHERE prj.deleted_at IS NULL) AS total_sanctioned_funding,
    (SELECT COALESCE(SUM(prj.total_amount_received), 0.00) FROM projects prj WHERE prj.deleted_at IS NULL) AS total_received_funding,
    NOW() AS calculated_at
FROM institutions i
LEFT JOIN departments d ON d.institution_id = i.id AND d.deleted_at IS NULL
LEFT JOIN faculty_appointments fa ON fa.department_id = d.id AND fa.end_date IS NULL AND fa.deleted_at IS NULL
LEFT JOIN faculty f ON f.id = fa.faculty_id AND f.deleted_at IS NULL
WHERE i.deleted_at IS NULL
GROUP BY i.id, i.name, i.slug;

CREATE UNIQUE INDEX idx_mv_inst_kpis_id ON v_institute_kpis(institution_id);
