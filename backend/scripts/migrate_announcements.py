#!/usr/bin/env python3
"""
Migrate all Announcements from tempcse live_export.sql into PostgreSQL and database-seed.json
"""

import json
import uuid
import subprocess

DATABASE_SEED_PATH = "/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/database-seed.json"
CSE_DEPT_ID = "22222222-2222-2222-2222-222222222222"

ANNOUNCEMENTS = [
    {
        "id": "22222222-aaaa-aaaa-aaaa-000000000001",
        "department_id": CSE_DEPT_ID,
        "category": "Conference",
        "title": "International Conference on Artificial Intelligence, Machine Learning & Intelligent Systems (ICAMS-2025)",
        "body": "Department of CSE, NIT Hamirpur is organizing a two-day International Conference on Artificial Intelligence, Machine Learning and Intelligent Systems (ICAMS-2025). Researchers, scholars, and industry professionals are invited to submit papers.",
        "link_url": "https://sites.google.com/nith.ac.in/icams2025",
        "publish_date": "2025-02-07",
        "is_new": True,
    },
    {
        "id": "22222222-aaaa-aaaa-aaaa-000000000002",
        "department_id": CSE_DEPT_ID,
        "category": "Curriculum",
        "title": "New Course Curriculum as per NEP-2020 for B.Tech in Computer Science and Engineering",
        "body": "Department of CSE has implemented the updated NEP-2020 curriculum with multidisciplinary electives, industry internships, AI/ML core tracks, and flexible credit transfers w.e.f. Academic Session 2024-25.",
        "link_url": "https://nith.ac.in/uploads/topics/new-nep-cse-syllabus17222307132912.pdf",
        "publish_date": "2024-09-06",
        "is_new": False,
    },
    {
        "id": "22222222-aaaa-aaaa-aaaa-000000000003",
        "department_id": CSE_DEPT_ID,
        "category": "Curriculum",
        "title": "Minor Degree Programme in Computer Science and Engineering for Non-CSE Branches",
        "body": "Department of CSE has launched a Minor Degree in Computer Science and Engineering under NEP-2020 for students from other engineering disciplines desiring minors in software engineering and algorithms.",
        "link_url": "https://nith.ac.in/uploads/topics/syllabus-cse-minor-degree17216260326071.pdf",
        "publish_date": "2024-09-06",
        "is_new": False,
    },
    {
        "id": "22222222-aaaa-aaaa-aaaa-000000000004",
        "department_id": CSE_DEPT_ID,
        "category": "Curriculum",
        "title": "Revised Curriculum for M.Tech CSE, M.Tech AI, and Dual Degree (B.Tech & M.Tech)",
        "body": "Proposed specialized postgraduate curriculum for M.Tech in Computer Science & Engineering, M.Tech in Artificial Intelligence, and 5-Year Integrated Dual Degree with specialized thesis research.",
        "link_url": "",
        "publish_date": "2024-09-06",
        "is_new": False,
    },
    {
        "id": "22222222-aaaa-aaaa-aaaa-000000000005",
        "department_id": CSE_DEPT_ID,
        "category": "Admissions",
        "title": "Call for Applications: Full-Time & Part-Time Ph.D. Admissions (Autumn 2026-2027)",
        "body": "Applications are invited from prospective scholars for Ph.D. admissions across AI, Quantum Computing, Cryptography, Blockchain, Medical Imaging, and IoT. Institutional fellowships available for GATE-qualified candidates.",
        "link_url": "https://nith.ac.in",
        "publish_date": "2026-05-10",
        "is_new": True,
    },
    {
        "id": "22222222-aaaa-aaaa-aaaa-000000000006",
        "department_id": CSE_DEPT_ID,
        "category": "Academic",
        "title": "Schedule for Final Year Major Project Demonstrations & Capstone Defense",
        "body": "All final year B.Tech and M.Tech candidates must present their working prototypes, submit similarity reports (Turnitin), and undergo external panel evaluation in Lab 3.",
        "link_url": "",
        "publish_date": "2026-05-02",
        "is_new": True,
    },
]

def main():
    # 1. Update PostgreSQL announcements
    psql_stmts = []
    for a in ANNOUNCEMENTS:
        title_esc = a['title'].replace("'", "''")
        body_esc = a['body'].replace("'", "''")
        psql_stmts.append(f"""
        INSERT INTO announcements (id, department_id, title, body, publish_date, is_private)
        VALUES ('{a['id']}', '{a['department_id']}', '{title_esc}', '{body_esc}', '{a['publish_date']}', false)
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            body = EXCLUDED.body,
            publish_date = EXCLUDED.publish_date;
        """)

    cmd = ['docker', 'exec', '-i', 'institute_postgres', 'psql', '-U', 'postgres', '-d', 'institute_portal', '-f', '-']
    res = subprocess.run(cmd, input="\n".join(psql_stmts), text=True, capture_output=True)
    print("PostgreSQL Result:", res.stdout if res.returncode == 0 else res.stderr)

    # 2. Update database-seed.json
    with open(DATABASE_SEED_PATH, "r", encoding="utf-8") as f:
        seed_data = json.load(f)

    seed_data["announcements"] = ANNOUNCEMENTS

    with open(DATABASE_SEED_PATH, "w", encoding="utf-8") as f:
        json.dump(seed_data, f, indent=2)

    print(f"Successfully updated announcements in PostgreSQL and {DATABASE_SEED_PATH}!")

if __name__ == "__main__":
    main()
