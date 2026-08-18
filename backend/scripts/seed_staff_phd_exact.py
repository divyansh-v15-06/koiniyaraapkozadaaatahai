#!/usr/bin/env python3
"""
Seed complete Staff and PhD Scholars (Former & Present) from live_export.sql
"""

import re
import json
import uuid
import subprocess

DUMP_PATH = "/Users/shlok/tempcsebase/schema-design/live_export.sql"
DATABASE_SEED_PATH = "/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json"
CSE_DEPT_ID = "22222222-2222-2222-2222-222222222222"

def parse_tuples(text):
    tuples = []
    raw_tuples = re.findall(r"\((.*?)\)(?:,|$)", text.strip(), re.DOTALL)
    for t in raw_tuples:
        tokens = []
        cur = []
        in_q = False
        for c in t:
            if c == "'":
                in_q = not in_q
                cur.append(c)
            elif c == "," and not in_q:
                tokens.append("".join(cur).strip())
                cur = []
            else:
                cur.append(c)
        if cur:
            tokens.append("".join(cur).strip())
        
        clean = []
        for tok in tokens:
            if tok == 'NULL':
                clean.append(None)
            elif tok.startswith("'") and tok.endswith("'"):
                clean.append(tok[1:-1].replace("\\'", "'").replace('\\"', '"'))
            else:
                try:
                    clean.append(int(tok))
                except ValueError:
                    clean.append(tok)
        tuples.append(clean)
    return tuples

def main():
    with open(DUMP_PATH, "r", encoding="utf-8") as f:
        sql = f.read()

    # 1. Staff Members
    m_staff = re.search(r"INSERT INTO `staff` VALUES (.*?);", sql, re.DOTALL)
    staff_list = []
    if m_staff:
        for r in parse_tuples(m_staff.group(1)):
            if len(r) >= 6:
                staff_id = r[0]
                name = r[1]
                phone = str(r[2]) if r[2] else ""
                email = r[3]
                designation = r[4]
                photo_url = r[5] or ""
                staff_list.append({
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"staff-{staff_id}-{email}")),
                    "legacy_id": staff_id,
                    "department_id": CSE_DEPT_ID,
                    "name": name,
                    "full_name": name,
                    "phone": phone,
                    "email": email,
                    "designation": designation,
                    "photo_url": photo_url,
                    "image_url": photo_url,
                })
    print(f"Extracted {len(staff_list)} staff members")

    # 2. PhD Scholars
    m_phd = re.search(r"INSERT INTO `phd_scholars` VALUES (.*?);", sql, re.DOTALL)
    phd_list = []
    if m_phd:
        for r in parse_tuples(m_phd.group(1)):
            if len(r) >= 12:
                phd_id = r[0]
                name = r[1]
                roll_no = r[2] or f"PHD-{phd_id}"
                email = r[3] or ""
                supervisor = r[4] or "Faculty Supervisor"
                co_supervisor = r[5] or ""
                raw_status = (r[6] or "pursuing").lower()
                status = "passed" if "pass" in raw_status or "complete" in raw_status or "award" in raw_status else "pursuing"
                reg_year = str(r[7]) if r[7] else ""
                dissertation = r[8] or r[10] or "Advanced Computer Science Research"
                qualification = r[9] or ""
                research_area = r[10] or ""
                end_date = str(r[11]) if r[11] else ""
                photo_url = r[13] if len(r) > 13 and r[13] else ""
                google_scholar = r[16] if len(r) > 16 and r[16] else ""
                scopus = r[17] if len(r) > 17 and r[17] else ""

                phd_list.append({
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"phd-{phd_id}-{roll_no}")),
                    "legacy_id": phd_id,
                    "department_id": CSE_DEPT_ID,
                    "name": name,
                    "full_name": name,
                    "roll_no": roll_no,
                    "enrollment_number": roll_no,
                    "email": email,
                    "supervisor": supervisor,
                    "co_supervisor": co_supervisor,
                    "status": status,
                    "registration_year": reg_year,
                    "year_of_registration": int(reg_year) if reg_year.isdigit() else 2022,
                    "dissertation_title": dissertation,
                    "topic": dissertation,
                    "research_area": research_area,
                    "last_qualification": qualification,
                    "end_date": end_date,
                    "photo_url": photo_url,
                    "image_url": photo_url,
                    "google_scholar_url": google_scholar,
                    "scopus_url": scopus,
                })
    print(f"Extracted {len(phd_list)} PhD scholars (Pursuing: {len([p for p in phd_list if p['status']=='pursuing'])}, Alumni: {len([p for p in phd_list if p['status']=='passed'])})")

    # Update database-seed.json
    with open(DATABASE_SEED_PATH, "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    seed_data["staff"] = staff_list
    seed_data["phd_scholars"] = phd_list

    with open(DATABASE_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)

    print(f"Successfully updated {DATABASE_SEED_PATH}!")

if __name__ == "__main__":
    main()
