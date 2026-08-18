#!/usr/bin/env python3
"""
Extract full research publications with indexing, journal quartiles, academic sessions,
venues, and exact fields matching tempcse schema, fixing faculty relations.
"""

import re
import json
import uuid

EXPORT_PATH = "/Users/shlok/tempcsebase/schema-design/live_export.sql"
DATABASE_SEED_PATH = "/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json"

RESEARCH_TYPE_MAP = {
    1: "Journal",
    2: "Conference",
    3: "Book",
    4: "BookChapter"
}

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
    with open(EXPORT_PATH, "r", encoding="utf-8") as f:
        sql = f.read()

    # 1. Parse faculty mappings (publication_id is row[0], faculty_id is row[1])
    m_fac_pubs = re.search(r"INSERT INTO `faculty_publications` VALUES (.*?);", sql, re.DOTALL)
    pub_to_faculty = {}
    if m_fac_pubs:
        for row in parse_tuples(m_fac_pubs.group(1)):
            if len(row) >= 2:
                p_id, f_id = row[0], row[1]
                pub_to_faculty.setdefault(p_id, []).append(f_id)

    # 2. Parse publications
    m_pubs = re.search(r"INSERT INTO `publications` VALUES (.*?);", sql, re.DOTALL)
    publications = []
    if m_pubs:
        rows = parse_tuples(m_pubs.group(1))
        for r in rows:
            if len(r) >= 14:
                pub_id = r[0]
                title = r[1]
                venue_name = r[2] or ""
                volume = str(r[3]) if r[3] is not None else ""
                issue = str(r[4]) if r[4] is not None else ""
                page_range = str(r[5]) if r[5] is not None else ""
                year = r[6]
                month = r[7]
                academic_session = r[8] or (f"{year}-{year+1}" if year else "")
                doi = r[9] or ""
                research_type_id = r[10] or 1
                indexing = r[11] or "Other"
                journal_quartile = r[12] or "T"
                author_text = r[13] or ""
                isbn = r[14] if len(r) > 14 and r[14] else ""

                pub_type = RESEARCH_TYPE_MAP.get(research_type_id, "Journal")

                fac_leg_ids = pub_to_faculty.get(pub_id, [])

                pub_obj = {
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"pub-{pub_id}-{title}")),
                    "legacy_id": pub_id,
                    "title": title,
                    "venue_name": venue_name,
                    "journal_or_conference_name": venue_name,
                    "volume": volume,
                    "issue": issue,
                    "page_range": page_range,
                    "pages": page_range,
                    "year": year,
                    "month": month,
                    "academic_session": academic_session,
                    "doi": doi,
                    "research_type_id": research_type_id,
                    "publication_type": pub_type,
                    "indexing": indexing,
                    "journal_quartile": journal_quartile,
                    "author_text": author_text,
                    "raw_authors": author_text,
                    "isbn": isbn,
                    "is_sci": indexing == "SCI(E)",
                    "is_scopus": indexing in ("Scopus", "SCI(E)"),
                    "faculty_legacy_ids": fac_leg_ids,
                }
                publications.append(pub_obj)

    print(f"Parsed {len(publications)} exact publications with fixed faculty mappings!")

    # 3. Update database-seed.json
    with open(DATABASE_SEED_PATH, "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    seed_data["publications"] = publications

    # Link publications to faculty objects in database-seed.json
    for fac in seed_data.get("faculty", []):
        f_leg_id = fac.get("legacy_id")
        fac_pubs = [p for p in publications if f_leg_id in p.get("faculty_legacy_ids", [])]
        fac["publications"] = fac_pubs
        print(f"Faculty #{f_leg_id} ({fac['full_name']}): {len(fac_pubs)} mapped publications")

    with open(DATABASE_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)

    print(f"Successfully updated {DATABASE_SEED_PATH}!")

if __name__ == "__main__":
    main()
