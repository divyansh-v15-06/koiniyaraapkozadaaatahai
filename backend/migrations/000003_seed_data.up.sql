-- ============================================================================
-- 000003_seed_data.up.sql
-- Seed Core Reference Data, System Roles, Metric Sources, Institution & CSE Dept
-- ============================================================================

-- 1. System Roles
INSERT INTO roles (id, name, description) VALUES
('00000000-0000-0000-0000-000000000001', 'INSTITUTE_ADMIN', 'Full administrative authority across all departments and institution settings'),
('00000000-0000-0000-0000-000000000002', 'RESEARCH_OFFICE', 'Institute-wide research verification, metrics sync and compliance'),
('00000000-0000-0000-0000-000000000003', 'DEPARTMENT_ADMIN', 'Department head / administrator with authority over department content and members'),
('00000000-0000-0000-0000-000000000004', 'REVIEWER', 'Department research and content reviewer'),
('00000000-0000-0000-0000-000000000005', 'FACULTY', 'Teaching and research faculty member managing personal CV and drafts'),
('00000000-0000-0000-0000-000000000006', 'PUBLIC', 'Anonymous public viewer')
ON CONFLICT (name) DO NOTHING;

-- 2. Metric Sources
INSERT INTO metric_sources (id, code, name) VALUES
('00000000-0000-0000-0000-000000000011', 'SCOPUS', 'Elsevier Scopus API'),
('00000000-0000-0000-0000-000000000012', 'GOOGLE_SCHOLAR', 'Google Scholar Profile'),
('00000000-0000-0000-0000-000000000013', 'ORCID', 'ORCID Open Researcher Contributor ID'),
('00000000-0000-0000-0000-000000000014', 'CROSSREF', 'Crossref Metadata API'),
('00000000-0000-0000-0000-000000000015', 'MANUAL_VERIFIED', 'Verified by Department / Research Office')
ON CONFLICT (code) DO NOTHING;

-- 3. Institution
INSERT INTO institutions (id, name, slug, domain) VALUES
('11111111-1111-1111-1111-111111111111', 'National Institute of Technology', 'nit', 'nith.ac.in')
ON CONFLICT (slug) DO NOTHING;

-- 4. CSE Department
INSERT INTO departments (id, institution_id, name, slug, code, contact_email, about_text) VALUES
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'cse', 'CSE', 'head.cse@nith.ac.in', 'The Department of Computer Science & Engineering offers undergraduate, postgraduate and doctoral programmes with emphasis on contemporary computing research.')
ON CONFLICT (institution_id, slug) DO NOTHING;

-- 5. Academic & Financial Years
INSERT INTO academic_years (institution_id, label, start_date, end_date, is_current) VALUES
('11111111-1111-1111-1111-111111111111', '2023-2024', '2023-07-01', '2024-06-30', FALSE),
('11111111-1111-1111-1111-111111111111', '2024-2025', '2024-07-01', '2025-06-30', FALSE),
('11111111-1111-1111-1111-111111111111', '2025-2026', '2025-07-01', '2026-06-30', FALSE),
('11111111-1111-1111-1111-111111111111', '2026-2027', '2026-07-01', '2027-06-30', TRUE)
ON CONFLICT (institution_id, label) DO NOTHING;

INSERT INTO financial_years (institution_id, label, start_date, end_date, is_current) VALUES
('11111111-1111-1111-1111-111111111111', '2023-2024', '2023-04-01', '2024-03-31', FALSE),
('11111111-1111-1111-1111-111111111111', '2024-2025', '2024-04-01', '2025-03-31', FALSE),
('11111111-1111-1111-1111-111111111111', '2025-2026', '2025-04-01', '2026-03-31', FALSE),
('11111111-1111-1111-1111-111111111111', '2026-2027', '2026-04-01', '2027-03-31', TRUE)
ON CONFLICT (institution_id, label) DO NOTHING;

-- 6. Default Programmes
INSERT INTO programmes (department_id, code, name, level, duration_years) VALUES
('22222222-2222-2222-2222-222222222222', 'BTECH_CSE', 'B.Tech Computer Science & Engineering', 'UG', 4),
('22222222-2222-2222-2222-222222222222', 'MTECH_CSE', 'M.Tech Computer Science & Engineering', 'PG', 2),
('22222222-2222-2222-2222-222222222222', 'DUAL_CSE', 'Dual Degree B.Tech & M.Tech CSE', 'DualDegree', 5),
('22222222-2222-2222-2222-222222222222', 'MTECH_AI', 'M.Tech Artificial Intelligence', 'PG', 2),
('22222222-2222-2222-2222-222222222222', 'PHD_CSE', 'Ph.D Computer Science & Engineering', 'PhD', 5)
ON CONFLICT (department_id, code) DO NOTHING;

-- 7. Default Admin User (Password: Admin@123456 -> $2a$10$7Z8s0kU3eQJz.N9g0Z5Z1e1fXk0eM0z0uK8m4m2k9rX4h8h.Z0g6u)
-- We will insert a bcrypt hash for 'Admin@123456'
INSERT INTO users (id, email, password_hash, full_name, is_active, first_login) VALUES
('33333333-3333-3333-3333-333333333333', 'admin@nith.ac.in', '$2a$10$wE99qW.37m3oG2j4oM5i3uQZJkC0pXlT61E7e38IeE4/FmSjE7V.u', 'System Administrator', TRUE, FALSE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role_id) VALUES
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (user_id, role_id) DO NOTHING;

INSERT INTO role_department_scopes (user_id, role_id, department_id) VALUES
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (user_id, role_id, department_id) DO NOTHING;
