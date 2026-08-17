#!/usr/bin/env python3
"""
Legacy MySQL to PostgreSQL Migration & Seeder Script
Transforms live_export.sql from tempcsebase into normalized PostgreSQL records
matching the exact schema of institute_portal database.
"""

import re
import sys
import uuid

DUMP_PATH = "/Users/shlok/tempcsebase/schema-design/live_export.sql"
OUTPUT_SQL = "/tmp/transformed_seed.sql"

INSTITUTION_ID = "11111111-1111-1111-1111-111111111111"
DEPARTMENT_ID = "22222222-2222-2222-2222-222222222222"
BTECH_PROG_ID = "66666666-6666-6666-6666-666666666661"
MTECH_PROG_ID = "66666666-6666-6666-6666-666666666662"
DUAL_PROG_ID = "66666666-6666-6666-6666-666666666663"
PHD_PROG_ID = "66666666-6666-6666-6666-666666666665"

def clean_sql(val):
    if val is None or val == "NULL" or val == "null" or val == "":
        return "NULL"
    val = str(val).strip()
    if val.startswith("'") and val.endswith("'"):
        val = val[1:-1]
    val = val.replace("'", "''")
    val = val.replace("\\'", "''")
    val = val.replace('\\"', '"')
    return f"'{val}'"

def parse_tuples(text):
    rows = []
    pattern = re.compile(r"\((.*?)\)(?:,|;)", re.DOTALL)
    for match in pattern.finditer(text):
        row_str = match.group(1).strip()
        fields = []
        current = []
        in_quote = False
        quote_char = None
        escape = False

        for char in row_str:
            if escape:
                current.append(char)
                escape = False
            elif char == "\\":
                escape = True
                current.append(char)
            elif in_quote:
                if char == quote_char:
                    in_quote = False
                    current.append(char)
                else:
                    current.append(char)
            else:
                if char in ("'", '"'):
                    in_quote = True
                    quote_char = char
                    current.append(char)
                elif char == ",":
                    fields.append("".join(current).strip())
                    current = []
                else:
                    current.append(char)
        if current:
            fields.append("".join(current).strip())

        cleaned_fields = []
        for f in fields:
            f = f.strip()
            if f.startswith("'") and f.endswith("'"):
                f = f[1:-1].replace("\\'", "'").replace('\\"', '"')
            elif f.startswith('"') and f.endswith('"'):
                f = f[1:-1].replace('\\"', '"').replace("\\'", "'")
            elif f.upper() == "NULL":
                f = None
            cleaned_fields.append(f)
        rows.append(cleaned_fields)
    return rows

def main():
    print("Reading dump from:", DUMP_PATH)
    with open(DUMP_PATH, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    insert_blocks = {}
    pattern = re.compile(r"INSERT INTO `([^`]+)` VALUES\s*(.*?);", re.DOTALL)
    for match in pattern.finditer(content):
        tname = match.group(1)
        body = match.group(2)
        insert_blocks[tname] = parse_tuples(body)

    out = []
    out.append("-- Auto-generated legacy migration seed from live_export.sql")

    faculty_map = {}
    pub_map = {}
    patent_map = {}
    project_map = {}

    # 1. FACULTY & USERS & PROFILES
    print(f"Processing {len(insert_blocks.get('faculty', []))} faculty records...")
    for row in insert_blocks.get("faculty", []):
        if len(row) < 11:
            continue
        leg_id = int(row[0])
        fac_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"faculty-{leg_id}"))
        user_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"user-{leg_id}"))
        faculty_map[leg_id] = fac_uuid

        code = row[1] or f"CS{leg_id:02d}"
        name = row[2] or "Faculty Member"
        pos = row[3] or "Faculty"
        is_perm = "TRUE" if str(row[4]) == "1" else "FALSE"
        phone = row[5] or ""
        email = row[6] or f"cs{leg_id}@nith.ac.in"
        portfolio_url = row[7] or ""
        photo_url = row[8] or ""
        sort_order = int(row[9]) if row[9] and str(row[9]).isdigit() else leg_id
        research_interests = row[10] or ""

        out.append(f"""
        INSERT INTO users (id, email, password_hash, full_name, is_active, first_login)
        VALUES ('{user_uuid}', {clean_sql(email)}, '$2a$10$OF2qNgMWFGZcWB170lgAP.7U7y1nJvF82SUXenNa8n1rLHO0eAyye', {clean_sql(name)}, TRUE, FALSE)
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO user_roles (user_id, role_id)
        VALUES ('{user_uuid}', '00000000-0000-0000-0000-000000000005')
        ON CONFLICT DO NOTHING;

        INSERT INTO role_department_scopes (user_id, role_id, department_id)
        VALUES ('{user_uuid}', '00000000-0000-0000-0000-000000000005', '{DEPARTMENT_ID}')
        ON CONFLICT DO NOTHING;

        INSERT INTO faculty (id, user_id, employee_code, official_email, full_name, designation, is_permanent, phone, photo_url, sort_order, research_interests)
        VALUES ('{fac_uuid}', '{user_uuid}', {clean_sql(code)}, {clean_sql(email)}, {clean_sql(name)}, {clean_sql(pos)}, {is_perm}, {clean_sql(phone)}, {clean_sql(photo_url)}, {sort_order}, {clean_sql(research_interests)})
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO faculty_appointments (faculty_id, department_id, is_primary)
        VALUES ('{fac_uuid}', '{DEPARTMENT_ID}', TRUE)
        ON CONFLICT DO NOTHING;

        INSERT INTO faculty_profiles (faculty_id, specializations, personal_website)
        VALUES ('{fac_uuid}', {clean_sql(research_interests)}, {clean_sql(portfolio_url)})
        ON CONFLICT (faculty_id) DO NOTHING;

        INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid)
        VALUES ('faculty', {leg_id}, 'faculty', '{fac_uuid}')
        ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
        """)

    # 2. FACULTY PROFILES EXTENDED
    for row in insert_blocks.get("faculty_profiles", []):
        if len(row) < 8:
            continue
        fac_leg_id = int(row[1]) if row[1] and str(row[1]).isdigit() else None
        if fac_leg_id and fac_leg_id in faculty_map:
            fac_uuid = faculty_map[fac_leg_id]
            scholar = clean_sql(row[4])
            scopus = clean_sql(row[5])
            orcid = clean_sql(row[7])
            out.append(f"""
            UPDATE faculty_profiles
            SET google_scholar_id = {scholar}, scopus_id = {scopus}, orcid = {orcid}
            WHERE faculty_id = '{fac_uuid}';
            """)

    # 3. FACULTY QUALIFICATIONS
    print(f"Processing {len(insert_blocks.get('faculty_qualifications', []))} qualifications...")
    for row in insert_blocks.get("faculty_qualifications", []):
        if len(row) < 5:
            continue
        fac_leg_id = int(row[1]) if row[1] and str(row[1]).isdigit() else None
        if fac_leg_id and fac_leg_id in faculty_map:
            fac_uuid = faculty_map[fac_leg_id]
            degree = clean_sql(row[2])
            univ = clean_sql(row[3])
            yr = int(row[4]) if row[4] and str(row[4]).isdigit() else 2000
            out.append(f"""
            INSERT INTO faculty_qualifications (faculty_id, degree, institution, completion_year)
            VALUES ('{fac_uuid}', {degree}, {univ}, {yr});
            """)

    # 4. PUBLICATIONS
    print(f"Processing {len(insert_blocks.get('publications', []))} publications...")
    for row in insert_blocks.get("publications", []):
        if len(row) < 14:
            continue
        leg_id = int(row[0])
        pub_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"pub-{leg_id}"))
        pub_map[leg_id] = pub_uuid

        title = clean_sql(row[1])
        venue = clean_sql(row[2])
        vol = clean_sql(row[3])
        issue = clean_sql(row[4])
        pages = clean_sql(row[5])
        yr = int(row[6]) if row[6] and str(row[6]).isdigit() else 2020
        doi = clean_sql(row[9])
        indexing = clean_sql(row[11])
        author_text = clean_sql(row[13])

        pub_type = "JOURNAL"
        v_upper = str(row[2] or "").upper()
        if "CONFERENCE" in v_upper or "PROCEEDINGS" in v_upper or "SYMPOSIUM" in v_upper or "IEEE" in v_upper:
            pub_type = "CONFERENCE"
        elif "CHAPTER" in v_upper:
            pub_type = "BOOK_CHAPTER"
        elif "BOOK" in v_upper:
            pub_type = "BOOK"

        out.append(f"""
        INSERT INTO publications (id, title, publication_type, venue, volume, issue, pages, year, doi, indexing, raw_authors, status)
        VALUES ('{pub_uuid}', {title}, '{pub_type}', {venue}, {vol}, {issue}, {pages}, {yr}, {doi}, {indexing}, {author_text}, 'PUBLISHED')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO publication_departments (publication_id, department_id)
        VALUES ('{pub_uuid}', '{DEPARTMENT_ID}')
        ON CONFLICT DO NOTHING;

        INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid)
        VALUES ('publications', {leg_id}, 'publications', '{pub_uuid}')
        ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
        """)

    # Link publication authors
    for row in insert_blocks.get("faculty_publications", []):
        if len(row) < 2:
            continue
        pub_leg_id = int(row[0]) if row[0] and str(row[0]).isdigit() else None
        fac_leg_id = int(row[1]) if row[1] and str(row[1]).isdigit() else None
        if pub_leg_id in pub_map and fac_leg_id in faculty_map:
            p_uuid = pub_map[pub_leg_id]
            f_uuid = faculty_map[fac_leg_id]
            out.append(f"""
            INSERT INTO publication_authors (publication_id, faculty_id, author_name, author_order, is_corresponding)
            SELECT '{p_uuid}', '{f_uuid}', f.full_name, 1, TRUE
            FROM faculty f WHERE f.id = '{f_uuid}'
            ON CONFLICT DO NOTHING;
            """)

    # 5. PATENTS
    print(f"Processing {len(insert_blocks.get('patents', []))} patents...")
    for row in insert_blocks.get("patents", []):
        if len(row) < 11:
            continue
        leg_id = int(row[0])
        pat_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"pat-{leg_id}"))
        patent_map[leg_id] = pat_uuid

        title = clean_sql(row[1])
        status_raw = str(row[2] or "Filed").capitalize()
        status = "Granted" if "Grant" in status_raw else ("Published" if "Pub" in status_raw else "Filed")
        app_no = clean_sql(row[3])
        yr = int(row[4]) if row[4] and str(row[4]).isdigit() else 2023
        place = clean_sql(row[6])
        f_date = clean_sql(row[7])
        g_date = clean_sql(row[8])
        author_text = clean_sql(row[10])

        out.append(f"""
        INSERT INTO patents (id, title, patent_type, status, application_number, jurisdiction, patent_office, filing_date, grant_date, year, raw_inventors, workflow_status)
        VALUES ('{pat_uuid}', {title}, 'INVENTION', '{status}', {app_no}, 'India', {place}, {f_date}, {g_date}, {yr}, {author_text}, 'PUBLISHED')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO patent_departments (patent_id, department_id)
        VALUES ('{pat_uuid}', '{DEPARTMENT_ID}')
        ON CONFLICT DO NOTHING;

        INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid)
        VALUES ('patents', {leg_id}, 'patents', '{pat_uuid}')
        ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
        """)

    # 6. PROJECTS
    print(f"Processing {len(insert_blocks.get('projects', []))} projects...")
    for row in insert_blocks.get("projects", []):
        if len(row) < 10:
            continue
        leg_id = int(row[0])
        prj_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"prj-{leg_id}"))
        project_map[leg_id] = prj_uuid

        title = clean_sql(row[1])
        status = "Ongoing" if "Ong" in str(row[2]) else "Completed"
        ref_no = clean_sql(row[3])
        agency = clean_sql(row[4] or "Government of India")
        amount = float(row[5]) if row[5] and str(row[5]).replace('.', '', 1).isdigit() else 0.0
        yr = int(row[7]) if row[7] and str(row[7]).isdigit() else 2023
        pi = clean_sql(row[10]) if len(row) > 10 else "NULL"

        out.append(f"""
        INSERT INTO projects (id, title, project_number, sponsor, status, year, total_sanctioned_amount, total_amount_received, lead_department_id, raw_investigators, workflow_status)
        VALUES ('{prj_uuid}', {title}, {ref_no}, {agency}, '{status}', {yr}, {amount}, {amount}, '{DEPARTMENT_ID}', {pi}, 'PUBLISHED')
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO project_departments (project_id, department_id)
        VALUES ('{prj_uuid}', '{DEPARTMENT_ID}')
        ON CONFLICT DO NOTHING;

        INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid)
        VALUES ('projects', {leg_id}, 'projects', '{prj_uuid}')
        ON CONFLICT (source_table, legacy_int_id) DO NOTHING;
        """)

    print(f"Writing transformed SQL to {OUTPUT_SQL}...")
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    print("Migration script generated successfully!")

if __name__ == "__main__":
    main()
