#!/usr/bin/env python3
"""
Seed all 13 Academic Departments of NIT Hamirpur into PostgreSQL
"""

import subprocess
import json

INSTITUTION_ID = "11111111-1111-1111-1111-111111111111"

DEPARTMENTS = [
    {
        "id": "22222222-2222-2222-2222-222222222222",
        "code": "CSE",
        "name": "Computer Science & Engineering",
        "hindi_name": "संगणक विज्ञान एवं अभियांत्रिकी विभाग",
        "slug": "cse",
        "contact_email": "head.cse@nith.ac.in",
        "contact_phone": "+91-1972-254400",
        "about": "Established to provide cutting-edge education and foster high-impact research in artificial intelligence, distributed systems, networks, and data science.",
        "hod_name": "Dr. Naveen Chauhan",
    },
    {
        "id": "22222222-2222-2222-2222-222222222223",
        "code": "ECE",
        "name": "Electronics & Communication Engineering",
        "hindi_name": "इलेक्ट्रॉनिक्स एवं संचार अभियांत्रिकी विभाग",
        "slug": "ece",
        "contact_email": "head.ece@nith.ac.in",
        "contact_phone": "+91-1972-254300",
        "about": "Pioneering education and research in VLSI design, wireless communications, signal processing, optical networks, and embedded systems.",
        "hod_name": "Dr. Gargi Khanna",
    },
    {
        "id": "22222222-2222-2222-2222-222222222224",
        "code": "EE",
        "name": "Electrical Engineering",
        "hindi_name": "विद्युत अभियांत्रिकी विभाग",
        "slug": "ee",
        "contact_email": "head.ee@nith.ac.in",
        "contact_phone": "+91-1972-254500",
        "about": "Focusing on smart grid technologies, renewable energy integration, power electronics, high voltage engineering, and control systems.",
        "hod_name": "Dr. R. K. Jarial",
    },
    {
        "id": "22222222-2222-2222-2222-222222222225",
        "code": "ME",
        "name": "Mechanical Engineering",
        "hindi_name": "यांत्रिक अभियांत्रिकी विभाग",
        "slug": "me",
        "contact_email": "head.me@nith.ac.in",
        "contact_phone": "+91-1972-254600",
        "about": "Excellence in thermal engineering, advanced manufacturing, robotics, computational fluid dynamics, and materials characterization.",
        "hod_name": "Dr. Sunand Kumar",
    },
    {
        "id": "22222222-2222-2222-2222-222222222226",
        "code": "CE",
        "name": "Civil Engineering",
        "hindi_name": "सिविल अभियांत्रिकी विभाग",
        "slug": "ce",
        "contact_email": "head.ce@nith.ac.in",
        "contact_phone": "+91-1972-254700",
        "about": "Delivering sustainable infrastructure solutions in structural engineering, geotechnical analysis, environmental engineering, and water resources.",
        "hod_name": "Dr. R. K. Sharma",
    },
    {
        "id": "22222222-2222-2222-2222-222222222227",
        "code": "CHE",
        "name": "Chemical Engineering",
        "hindi_name": "रासायनिक अभियांत्रिकी विभाग",
        "slug": "che",
        "contact_email": "head.che@nith.ac.in",
        "contact_phone": "+91-1972-254800",
        "about": "Advancing process optimization, biochemical systems, membrane separation, catalysis, and green energy technology.",
        "hod_name": "Dr. Arvind Kumar",
    },
    {
        "id": "22222222-2222-2222-2222-222222222228",
        "code": "MSE",
        "name": "Materials Science & Engineering",
        "hindi_name": "पदार्थ विज्ञान एवं अभियांत्रिकी विभाग",
        "slug": "mse",
        "contact_email": "head.mse@nith.ac.in",
        "contact_phone": "+91-1972-254900",
        "about": "Specializing in nanomaterials, biomaterials, smart coatings, energy storage materials, and functional composites.",
        "hod_name": "Dr. Vishal Singh",
    },
    {
        "id": "22222222-2222-2222-2222-222222222229",
        "code": "ARCH",
        "name": "Department of Architecture & Planning",
        "hindi_name": "वास्तुकला एवं योजना विभाग",
        "slug": "arch",
        "contact_email": "head.arch@nith.ac.in",
        "contact_phone": "+91-1972-254200",
        "about": "Nurturing creative architects and urban planners with focus on sustainable hill architecture, climate-responsive design, and smart city planning.",
        "hod_name": "Dr. Bhanu M. Marwaha",
    },
    {
        "id": "22222222-2222-2222-2222-222222222230",
        "code": "MATH",
        "name": "Mathematics & Scientific Computing",
        "hindi_name": "गणित एवं वैज्ञानिक संगणना विभाग",
        "slug": "maths",
        "contact_email": "head.math@nith.ac.in",
        "contact_phone": "+91-1972-254150",
        "about": "High-level computational mathematics, numerical simulation, cryptography, graph theory, and operations research.",
        "hod_name": "Dr. R. K. Vats",
    },
    {
        "id": "22222222-2222-2222-2222-222222222231",
        "code": "PHY",
        "name": "Physics & Photonics Science",
        "hindi_name": "भौतिकी एवं फोटोनिक्स विज्ञान विभाग",
        "slug": "physics",
        "contact_email": "head.phy@nith.ac.in",
        "contact_phone": "+91-1972-254160",
        "about": "Research in quantum photonics, condensed matter physics, laser physics, and semiconductor device modeling.",
        "hod_name": "Dr. Subhash Chand",
    },
    {
        "id": "22222222-2222-2222-2222-222222222232",
        "code": "CHEM",
        "name": "Chemistry & Chemical Sciences",
        "hindi_name": "रसायन विज्ञान विभाग",
        "slug": "chemistry",
        "contact_email": "head.chem@nith.ac.in",
        "contact_phone": "+91-1972-254170",
        "about": "Frontier research in synthetic organic chemistry, computational catalysis, polymer chemistry, and environmental monitoring.",
        "hod_name": "Dr. Pamita Awasthi",
    },
    {
        "id": "22222222-2222-2222-2222-222222222233",
        "code": "HSS",
        "name": "Humanities & Social Sciences",
        "hindi_name": "मानविकी एवं सामाजिक विज्ञान विभाग",
        "slug": "hss",
        "contact_email": "head.hss@nith.ac.in",
        "contact_phone": "+91-1972-254180",
        "about": "Cultivating humanistic perspectives, professional communication, linguistics, technical ethics, and developmental economics.",
        "hod_name": "Dr. Manoj Sharma",
    },
    {
        "id": "22222222-2222-2222-2222-222222222234",
        "code": "DOMS",
        "name": "Department of Management Studies",
        "hindi_name": "प्रबंधन अध्ययन विभाग",
        "slug": "doms",
        "contact_email": "head.doms@nith.ac.in",
        "contact_phone": "+91-1972-254190",
        "about": "Fostering strategic leadership, technology management, supply chain optimization, business analytics, and entrepreneurial ventures.",
        "hod_name": "Dr. Somesh Sharma",
    },
]

def main():
    sql = []
    sql.append("-- Seeding All 13 Academic Departments of NIT Hamirpur")
    for d in DEPARTMENTS:
        about_clean = d['about'].replace("'", "''")
        name_clean = d['name'].replace("'", "''")
        sql.append(f"""
        INSERT INTO departments (id, institution_id, code, name, slug, contact_email, contact_phone, about_text)
        VALUES ('{d['id']}', '{INSTITUTION_ID}', '{d['code']}', '{name_clean}', '{d['slug']}', '{d['contact_email']}', '{d['contact_phone']}', '{about_clean}')
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            code = EXCLUDED.code,
            slug = EXCLUDED.slug,
            contact_email = EXCLUDED.contact_email,
            contact_phone = EXCLUDED.contact_phone,
            about_text = EXCLUDED.about_text;
        """)

    sql_content = "\n".join(sql)
    cmd = ['docker', 'exec', '-i', 'institute_postgres', 'psql', '-U', 'postgres', '-d', 'institute_portal', '-f', '-']
    res = subprocess.run(cmd, input=sql_content, text=True, capture_output=True)
    print("Database Result:", res.stdout if res.returncode == 0 else res.stderr)

    # Save to frontend registry
    with open("/Users/shlok/koiniyaraapkozadaaatahai/frontend/src/lib/departments-registry.json", "w", encoding="utf-8") as f:
        json.dump(DEPARTMENTS, f, indent=2)

    print(f"Successfully seeded all {len(DEPARTMENTS)} departments into PostgreSQL and generated frontend/src/lib/departments-registry.json!")

if __name__ == "__main__":
    main()
