#!/usr/bin/env python3
"""
Extract and Migrate Department Achievements and Faculty Honors from tempcse live_export.sql
"""

import re
import json
import uuid
import subprocess

EXPORT_PATH = "/Users/shlok/tempcsebase/schema-design/live_export.sql"
DATABASE_SEED_PATH = "/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json"
CSE_DEPT_ID = "22222222-2222-2222-2222-222222222222"

def parse_sql_values(content):
    # Parse SQL tuples
    rows = []
    # Match tuple patterns like (1, 'val', ...)
    matches = re.findall(r"\(([^)]+)\)", content)
    for m in matches:
        # split by comma, ignoring commas inside quotes
        tokens = []
        current = []
        in_quotes = False
        quote_char = None
        for char in m:
            if char in ("'", '"'):
                if not in_quotes:
                    in_quotes = True
                    quote_char = char
                elif quote_char == char:
                    in_quotes = False
                    quote_char = None
                current.append(char)
            elif char == ',' and not in_quotes:
                tokens.append("".join(current).strip())
                current = []
            else:
                current.append(char)
        if current:
            tokens.append("".join(current).strip())
        
        # Clean tokens
        clean = []
        for t in tokens:
            if t == 'NULL':
                clean.append(None)
            elif (t.startswith("'") and t.endswith("'")) or (t.startswith('"') and t.endswith('"')):
                clean.append(t[1:-1].replace("\\'", "'").replace('\\"', '"'))
            else:
                try:
                    clean.append(int(t))
                except ValueError:
                    clean.append(t)
        rows.append(clean)
    return rows

def main():
    with open(EXPORT_PATH, "r", encoding="utf-8") as f:
        sql = f.read()

    # 1. Parse posts table
    m_posts = re.search(r"INSERT INTO `posts` VALUES (.*?);", sql, re.DOTALL)
    achievements = []
    if m_posts:
        raw_tuples = re.findall(r"\((.*?)\)(?:,|$)", m_posts.group(1).strip(), re.DOTALL)
        for t in raw_tuples:
            # Tokenize properly
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
            
            clean_tokens = []
            for tok in tokens:
                if tok == 'NULL':
                    clean_tokens.append(None)
                elif tok.startswith("'") and tok.endswith("'"):
                    clean_tokens.append(tok[1:-1].replace("\\'", "'"))
                else:
                    clean_tokens.append(tok)

            if len(clean_tokens) >= 7:
                post_id = clean_tokens[0]
                category = clean_tokens[1]
                title = clean_tokens[2]
                description = clean_tokens[3]
                photo_url = clean_tokens[4]
                pdf_url = clean_tokens[5]
                published_on = clean_tokens[6] or "2025-06-01"

                item = {
                    "id": str(uuid.uuid5(uuid.NAMESPACE_DNS, f"achievement-{post_id}-{title}")),
                    "legacy_id": post_id,
                    "department_id": CSE_DEPT_ID,
                    "category": category or "achievement",
                    "title": title,
                    "description": description,
                    "photo_url": photo_url,
                    "pdf_url": pdf_url,
                    "publish_date": published_on[:10],
                }
                achievements.append(item)

    print(f"Extracted {len(achievements)} achievements from live_export.sql!")

    # 2. Insert into PostgreSQL
    psql_statements = []
    for a in achievements:
        title_esc = a['title'].replace("'", "''")
        desc_esc = a['description'].replace("'", "''")
        psql_statements.append(f"""
        INSERT INTO posts (id, department_id, category, title, body, publish_date)
        VALUES ('{a['id']}', '{a['department_id']}', '{a['category']}', '{title_esc}', '{desc_esc}', '{a['publish_date']}')
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            body = EXCLUDED.body,
            publish_date = EXCLUDED.publish_date;
        """)

    cmd = ['docker', 'exec', '-i', 'institute_postgres', 'psql', '-U', 'postgres', '-d', 'institute_portal', '-f', '-']
    res = subprocess.run(cmd, input="\n".join(psql_statements), text=True, capture_output=True)
    print("PostgreSQL Result:", res.stdout if res.returncode == 0 else res.stderr)

    # 3. Update database-seed.json
    with open(DATABASE_SEED_PATH, "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    seed_data["achievements"] = achievements

    with open(DATABASE_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)

    print(f"Updated {DATABASE_SEED_PATH} with {len(achievements)} achievements!")

if __name__ == "__main__":
    main()
