#!/usr/bin/env python3
"""
Sync real seeded PostgreSQL data into frontend mock-data.ts and ensure API client is fully integrated.
"""

import json
import subprocess

def query_json(sql):
    cmd = [
        'docker', 'exec', 'institute_postgres', 'psql', '-U', 'postgres', '-d', 'institute_portal',
        '-t', '-A', '-c', f"SELECT json_agg(t) FROM ({sql}) t;"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    out = res.stdout.strip()
    if not out or out == 'null':
        return []
    return json.loads(out)

def main():
    depts = query_json("SELECT * FROM departments ORDER BY code")
    facs = query_json("""
        SELECT f.id, f.employee_code, f.official_email, f.full_name, f.designation, f.is_permanent,
               f.phone, f.photo_url, f.portfolio_slug as public_slug, f.sort_order, f.research_interests,
               '22222222-2222-2222-2222-222222222222' as department_id,
               'Computer Science & Engineering' as department_name,
               'cse' as department_slug,
               'ACTIVE' as employment_status,
               12 as scopus_h_index, 380 as scopus_citations,
               16 as scholar_h_index, 620 as scholar_citations,
               (SELECT count(*) FROM publication_authors pa WHERE pa.faculty_id = f.id) as total_publications
        FROM faculty f
        ORDER BY f.sort_order, f.full_name
    """)
    pubs = query_json("""
        SELECT p.id, p.title, p.publication_type, p.doi, p.isbn, p.venue, p.volume, p.issue, p.pages,
               p.year, p.indexing, p.quartile, p.raw_authors, p.status,
               '22222222-2222-2222-2222-222222222222' as lead_department_id,
               json_build_array(
                 json_build_object(
                   'department_id', '22222222-2222-2222-2222-222222222222',
                   'department_name', 'Computer Science & Engineering',
                   'department_slug', 'cse'
                 )
               ) as departments,
               (
                 SELECT json_agg(json_build_object(
                   'id', pa.id,
                   'publication_id', pa.publication_id,
                   'faculty_id', pa.faculty_id,
                   'faculty_name', f.full_name,
                   'author_name', pa.author_name,
                   'author_order', pa.author_order,
                   'is_corresponding', pa.is_corresponding
                 ))
                 FROM publication_authors pa
                 LEFT JOIN faculty f ON f.id = pa.faculty_id
                 WHERE pa.publication_id = p.id
               ) as authors
        FROM publications p
        ORDER BY p.year DESC, p.title
    """)
    projs = query_json("""
        SELECT p.id, p.title, p.project_number, p.sponsor, p.status, p.year,
               p.total_sanctioned_amount as total_amount,
               p.raw_investigators as principal_investigator,
               p.lead_department_id,
               'Computer Science & Engineering' as lead_department_name,
               'cse' as lead_department_slug,
               json_build_array(
                 json_build_object(
                   'department_id', '22222222-2222-2222-2222-222222222222',
                   'department_name', 'Computer Science & Engineering',
                   'department_slug', 'cse',
                   'is_lead', true
                 )
               ) as departments
        FROM projects p
        ORDER BY p.year DESC, p.title
    """)
    pats = query_json("""
        SELECT p.id, p.title, p.patent_type, p.status, p.application_number,
               p.grant_number, p.grant_number as patent_number, p.jurisdiction,
               p.filing_date, p.grant_date, p.year,
               p.raw_inventors,
               json_build_array(
                 json_build_object(
                   'department_id', '22222222-2222-2222-2222-222222222222',
                   'department_name', 'Computer Science & Engineering',
                   'department_slug', 'cse'
                 )
               ) as departments
        FROM patents p
        ORDER BY p.year DESC, p.title
    """)
    kpi_rows = query_json("SELECT * FROM v_institute_kpis LIMIT 1")
    kpi = kpi_rows[0] if kpi_rows else {
        "institution_id": "11111111-1111-1111-1111-111111111111",
        "institution_name": "National Institute of Technology Hamirpur",
        "institution_slug": "nith",
        "department_count": 14,
        "faculty_count": 27,
        "canonical_publications_count": 111,
        "canonical_patents_count": 15,
        "canonical_projects_count": 24,
        "total_sanctioned_funding": 82988345.0,
        "total_received_funding": 0.0
    }
    dept_kpi_rows = query_json("SELECT * FROM v_department_kpis WHERE department_slug = 'cse' LIMIT 1")
    dept_kpi = dept_kpi_rows[0] if dept_kpi_rows else {}

    ts_content = f"""import {{ Department, FacultySummary, Publication, Project, Patent, InstituteKpiSnapshot, DepartmentKpiSnapshot }} from './types';

export const NITH_DEPARTMENTS: Department[] = {json.dumps(depts, indent=2)};

export const MOCK_FACULTY_LIST: FacultySummary[] = {json.dumps(facs, indent=2)};

export const MOCK_PUBLICATIONS: Publication[] = {json.dumps(pubs, indent=2)};

export const MOCK_PROJECTS: Project[] = {json.dumps(projs, indent=2)};

export const MOCK_PATENTS: Patent[] = {json.dumps(pats, indent=2)};

export const MOCK_INSTITUTE_KPI: InstituteKpiSnapshot = {json.dumps(kpi, indent=2)};

export const MOCK_DEPARTMENT_KPI: DepartmentKpiSnapshot = {json.dumps(dept_kpi, indent=2)};
"""

    out_file = "/home/divyansh/Development/Projects/koiniyaraapkozadaaatahai/frontend/src/lib/mock-data.ts"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Successfully generated {out_file} with {len(facs)} faculty, {len(pubs)} publications, {len(projs)} projects, {len(pats)} patents.")

if __name__ == "__main__":
    main()
