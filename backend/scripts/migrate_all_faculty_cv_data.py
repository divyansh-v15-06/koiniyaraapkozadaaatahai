#!/usr/bin/env python3
"""
Comprehensive migration script to extract ALL real faculty CV & Portfolio data from live_export.sql
"""

import re
import json

DUMP_PATH = "/Users/shlok/tempcsebase/schema-design/live_export.sql"
DATABASE_SEED_PATH = "/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json"

def extract_rows(sql, table_name):
    m = re.search(rf"INSERT INTO `{table_name}` VALUES (.*?);", sql, re.DOTALL)
    if not m:
        return []
    content = m.group(1).strip()
    
    # Custom SQL value parser
    rows = []
    i = 0
    n = len(content)
    while i < n:
        while i < n and content[i] != '(':
            i += 1
        if i >= n:
            break
        i += 1 # skip '('
        
        row = []
        cur = []
        in_str = False
        escape = False
        
        while i < n:
            c = content[i]
            if escape:
                cur.append(c)
                escape = False
            elif c == '\\':
                escape = True
            elif c == "'":
                in_str = not in_str
            elif c == ',' and not in_str:
                val = "".join(cur).strip()
                if val == 'NULL':
                    row.append(None)
                elif val.startswith("'") and val.endswith("'"):
                    row.append(val[1:-1])
                else:
                    try:
                        row.append(int(val))
                    except ValueError:
                        row.append(val)
                cur = []
            elif c == ')' and not in_str:
                val = "".join(cur).strip()
                if val == 'NULL':
                    row.append(None)
                elif val.startswith("'") and val.endswith("'"):
                    row.append(val[1:-1])
                else:
                    try:
                        row.append(int(val))
                    except ValueError:
                        row.append(val)
                rows.append(row)
                i += 1
                break
            else:
                cur.append(c)
            i += 1
    return rows

def main():
    with open(DUMP_PATH, "r", encoding="utf-8") as f:
        sql = f.read()

    with open(DATABASE_SEED_PATH, "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    # 1. Faculty Qualifications
    raw_qual = extract_rows(sql, "faculty_qualifications")
    qual_by_fac = {}
    for r in raw_qual:
        if len(r) >= 5:
            fac_id = r[1]
            deg = r[2]
            inst = r[3]
            yr = r[4]
            if fac_id not in qual_by_fac:
                qual_by_fac[fac_id] = []
            qual_by_fac[fac_id].append({
                "degree": deg,
                "institute": inst,
                "year": yr,
            })
    print(f"Extracted qualifications for {len(qual_by_fac)} faculty members (total {len(raw_qual)} items)")

    # 2. Faculty Teaching Experiences
    raw_teach = extract_rows(sql, "faculty_teaching_experiences")
    teach_by_fac = {}
    for r in raw_teach:
        if len(r) >= 5:
            fac_id = r[1]
            pos = r[2]
            dept = r[3]
            start = str(r[4]) if r[4] else ""
            end = str(r[5]) if r[5] else "Present"
            if fac_id not in teach_by_fac:
                teach_by_fac[fac_id] = []
            teach_by_fac[fac_id].append({
                "position": pos,
                "organization": "National Institute of Technology Hamirpur",
                "department": dept,
                "start_date": start[:4] if len(start) >= 4 else start,
                "end_date": "Present" if not r[5] else (str(r[5])[:4] if len(str(r[5])) >= 4 else str(r[5])),
                "full_start": start,
                "full_end": end,
            })
    print(f"Extracted teaching exp for {len(teach_by_fac)} faculty members (total {len(raw_teach)} items)")

    # 3. Faculty Administrative Experiences
    raw_admin = extract_rows(sql, "faculty_administrative_experiences")
    admin_by_fac = {}
    for r in raw_admin:
        if len(r) >= 4:
            fac_id = r[1]
            pos = r[2]
            org = r[3] or "National Institute of Technology Hamirpur"
            start = str(r[4]) if len(r) > 4 and r[4] else ""
            end = str(r[5]) if len(r) > 5 and r[5] else "Present"
            if fac_id not in admin_by_fac:
                admin_by_fac[fac_id] = []
            admin_by_fac[fac_id].append({
                "position": pos,
                "organization": org,
                "start_date": start[:4] if len(start) >= 4 else start,
                "end_date": "Present" if (len(r) <= 5 or not r[5]) else (str(r[5])[:4] if len(str(r[5])) >= 4 else str(r[5])),
                "full_start": start,
                "full_end": end,
            })
    print(f"Extracted admin exp for {len(admin_by_fac)} faculty members (total {len(raw_admin)} items)")

    # 4. Faculty Honors & Awards
    raw_honors = extract_rows(sql, "faculty_honors")
    honors_by_fac = {}
    for r in raw_honors:
        if len(r) >= 5:
            fac_id = r[1]
            title = r[2]
            given_by = r[3]
            yr = r[4]
            if fac_id not in honors_by_fac:
                honors_by_fac[fac_id] = []
            honors_by_fac[fac_id].append({
                "title": title,
                "organization": given_by,
                "year": yr,
            })
    print(f"Extracted honors for {len(honors_by_fac)} faculty members (total {len(raw_honors)} items)")

    # 5. Faculty Exposures / Foreign Visits
    raw_expo = extract_rows(sql, "faculty_exposures")
    expo_by_fac = {}
    for r in raw_expo:
        if len(r) >= 4:
            fac_id = r[1]
            title = r[2]
            desc = r[3]
            if fac_id not in expo_by_fac:
                expo_by_fac[fac_id] = []
            expo_by_fac[fac_id].append({
                "title": title,
                "description": desc,
            })
    print(f"Extracted exposures for {len(expo_by_fac)} faculty members (total {len(raw_expo)} items)")

    # 6. Expert Talks
    raw_talks = extract_rows(sql, "expert_talks")
    talks_by_fac = {}
    for r in raw_talks:
        if len(r) >= 3:
            fac_id = r[1]
            title = r[2]
            venue = r[3] if len(r) > 3 and r[3] else "National Institute of Technology Hamirpur"
            start = str(r[4]) if len(r) > 4 and r[4] else ""
            desc = r[7] if len(r) > 7 and r[7] else ""
            if fac_id not in talks_by_fac:
                talks_by_fac[fac_id] = []
            talks_by_fac[fac_id].append({
                "title": title,
                "venue": venue,
                "date": start,
                "description": desc,
            })
    print(f"Extracted expert talks for {len(talks_by_fac)} faculty members (total {len(raw_talks)} items)")

    # 7. Research Supervisions
    raw_sup = extract_rows(sql, "research_supervisions")
    sup_map = {}
    for r in raw_sup:
        if len(r) >= 6:
            sup_id = r[0]
            type_id = r[1]
            s_name = r[2]
            roll_no = r[3] or ""
            topic = r[4] or "Research Thesis"
            status = r[5] or "Completed"
            yr = r[6] or ""
            co_sup = r[8] if len(r) > 8 else None
            sup_map[sup_id] = {
                "id": sup_id,
                "level": "Ph.D." if type_id == 2 else "M.Tech / PG",
                "student_name": s_name,
                "roll_number": roll_no,
                "thesis_title": topic,
                "status": status,
                "year": yr,
                "co_supervisor": co_sup,
            }
    
    raw_frs = extract_rows(sql, "faculty_research_supervisions")
    sup_by_fac = {}
    for r in raw_frs:
        if len(r) >= 2:
            sup_id = r[0]
            fac_id = r[1]
            if sup_id in sup_map:
                if fac_id not in sup_by_fac:
                    sup_by_fac[fac_id] = []
                sup_by_fac[fac_id].append(sup_map[sup_id])
    print(f"Extracted research supervisions for {len(sup_by_fac)} faculty members (total {len(raw_frs)} links)")

    # 8. Faculty Profiles
    raw_prof = extract_rows(sql, "faculty_profiles")
    prof_by_fac = {}
    for r in raw_prof:
        if len(r) >= 9:
            fac_id = r[1]
            prof_by_fac[fac_id] = {
                "scholar_url": r[4],
                "scopus_url": r[5],
                "scopus_id": r[5].split("=")[-1] if r[5] and "=" in r[5] else (r[5].split("/")[-1] if r[5] else ""),
                "publons_url": r[6],
                "orcid": r[7],
                "research_gate_url": r[8],
                "vidwan_url": r[9] if len(r) > 9 else None,
                "linkedin_url": r[10] if len(r) > 10 else None,
            }
    print(f"Extracted extended profiles for {len(prof_by_fac)} faculty members")

    # Embed all this real data into seed_data["faculty"]
    for fac in seed_data.get("faculty", []):
        legacy_id = fac.get("legacy_id")
        if legacy_id:
            if legacy_id in qual_by_fac:
                fac["qualifications"] = qual_by_fac[legacy_id]
            if legacy_id in teach_by_fac:
                fac["teaching_experiences"] = teach_by_fac[legacy_id]
            if legacy_id in admin_by_fac:
                fac["admin_experiences"] = admin_by_fac[legacy_id]
            if legacy_id in honors_by_fac:
                fac["honors"] = honors_by_fac[legacy_id]
            if legacy_id in expo_by_fac:
                fac["exposures"] = expo_by_fac[legacy_id]
            if legacy_id in talks_by_fac:
                fac["expert_talks"] = talks_by_fac[legacy_id]
            if legacy_id in sup_by_fac:
                fac["supervisions"] = sup_by_fac[legacy_id]
            if legacy_id in prof_by_fac:
                ext = prof_by_fac[legacy_id]
                if "profile" not in fac:
                    fac["profile"] = {}
                fac["profile"].update(ext)

    # Save to database-seed.json
    with open(DATABASE_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)

    print(f"Successfully integrated ALL real faculty portfolio data into {DATABASE_SEED_PATH}!")

if __name__ == "__main__":
    main()
