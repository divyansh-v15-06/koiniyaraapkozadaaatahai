#!/usr/bin/env python3
"""
Complete Student & PhD Scholar Migration & Seeder
"""

import re
import json
import subprocess
import uuid

DUMP_PATH = "/Users/shlok/tempcsebase/schema-design/live_export.sql"
OUTPUT_SQL = "/tmp/students_phd_seed.sql"

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
    out.append("-- Seeding all 591 Students and 105 PhD Scholars")

    # 1. STUDENTS (591 records)
    student_list = []
    for row in insert_blocks.get("students", []):
        if len(row) < 8:
            continue
        name = clean_sql(row[1])
        roll = clean_sql(row[2])
        email = clean_sql(row[3])
        photo_url = clean_sql(row[4])
        pid = int(row[5]) if row[5] and str(row[5]).isdigit() else 1
        sem = int(row[6]) if row[6] and str(row[6]).isdigit() else 1
        adm_year = int(row[7]) if row[7] and str(row[7]).isdigit() else 2024

        prog_uuid = BTECH_PROG_ID
        prog_name = "B.Tech CSE"
        if pid == 2:
            prog_uuid = MTECH_PROG_ID
            prog_name = "M.Tech CSE"
        elif pid == 3:
            prog_uuid = DUAL_PROG_ID
            prog_name = "Dual Degree CSE"
        elif pid == 4:
            prog_uuid = MTECH_PROG_ID
            prog_name = "M.Tech AI"

        raw_roll = (row[2] or "").strip()
        raw_name = (row[1] or "").strip()
        raw_email = (row[3] or "").strip()

        student_list.append({
            "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"student-{raw_roll}")),
            "department_id": DEPARTMENT_ID,
            "programme_id": prog_uuid,
            "programme_name": prog_name,
            "roll_number": raw_roll,
            "name": raw_name,
            "email": raw_email,
            "admission_year": adm_year,
            "current_semester": sem,
        })

        out.append(f"""
        INSERT INTO students (department_id, programme_id, roll_number, full_name, admission_year, current_semester, email, photo_url)
        VALUES ('{DEPARTMENT_ID}', '{prog_uuid}', {roll}, {name}, {adm_year}, {sem}, {email}, {photo_url})
        ON CONFLICT DO NOTHING;
        """)

    # 2. PHD SCHOLARS (105 records)
    phd_list = []
    for row in insert_blocks.get("phd_scholars", []):
        if len(row) < 7:
            continue
        leg_id = int(row[0])
        name = clean_sql(row[1])
        roll = clean_sql(row[2])
        email = clean_sql(row[3])
        sup = clean_sql(row[4])
        co_sup = clean_sql(row[5])
        status = "pursuing" if "pursu" in str(row[6] or "").lower() else "passed"
        reg_yr = clean_sql(row[7])
        topic = clean_sql(row[8] if len(row) > 8 and row[8] else (row[10] if len(row) > 10 else "Computer Science & Engineering"))
        last_qual = clean_sql(row[9]) if len(row) > 9 else "NULL"
        research_area = clean_sql(row[10]) if len(row) > 10 else "NULL"
        end_date = clean_sql(row[11]) if len(row) > 11 else "NULL"
        photo_url = clean_sql(row[13]) if len(row) > 13 else "NULL"
        linkedin = clean_sql(row[15]) if len(row) > 15 else "NULL"
        scholar = clean_sql(row[16]) if len(row) > 16 else "NULL"
        scopus = clean_sql(row[17]) if len(row) > 17 else "NULL"

        phd_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"phd-{leg_id}"))

        phd_list.append({
            "id": phd_uuid,
            "department_id": DEPARTMENT_ID,
            "name": (row[1] or "").strip(),
            "roll_number": (row[2] or "").strip(),
            "email": (row[3] or "").strip(),
            "supervisor": (row[4] or "").strip(),
            "co_supervisor": (row[5] or "").strip(),
            "status": status,
            "registration_year": (row[7] or "").strip(),
            "topic": (row[8] or row[10] or "Computer Science & Engineering").strip(),
            "last_qualification": (row[9] or "").strip() if len(row) > 9 else "",
            "research_area": (row[10] or "").strip() if len(row) > 10 else "",
            "end_date": (row[11] or "").strip() if len(row) > 11 else "",
            "photo_url": (row[13] or "").strip() if len(row) > 13 else "",
            "linkedin_url": (row[15] or "").strip() if len(row) > 15 else "",
            "google_scholar_url": (row[16] or "").strip() if len(row) > 16 else "",
            "scopus_url": (row[17] or "").strip() if len(row) > 17 else "",
        })

        out.append(f"""
        INSERT INTO phd_scholars (id, department_id, full_name, roll_number, dissertation_title, supervisor_name, status, email)
        VALUES ('{phd_uuid}', '{DEPARTMENT_ID}', {name}, {roll}, {topic}, {sup}, '{status}', {email})
        ON CONFLICT (id) DO NOTHING;
        """)

    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("\n".join(out))

    print(f"Generated SQL with {len(student_list)} students and {len(phd_list)} PhD scholars.")

    # Read current seed and update
    with open("/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json", "r", encoding="utf-8") as f:
        curr_seed = json.load(f)

    curr_seed["students"] = student_list
    curr_seed["phd_scholars"] = phd_list

    with open("/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json", "w", encoding="utf-8") as f:
        json.dump(curr_seed, f, indent=2)

    print("Updated database-seed.json with all 591 students and 105 PhD scholars!")

if __name__ == "__main__":
    main()
