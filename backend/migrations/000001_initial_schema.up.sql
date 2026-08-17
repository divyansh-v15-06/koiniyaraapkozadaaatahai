-- ============================================================================
-- 000001_initial_schema.up.sql
-- Canonical Institute & Department Portal PostgreSQL Schema (UUID-based, normalized)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automatic timestamp trigger
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. REFERENCE & ORGANISATION HIERARCHY
-- ----------------------------------------------------------------------------

CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    domain TEXT UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER set_timestamp_institutions
BEFORE UPDATE ON institutions
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE RESTRICT,
    parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    code VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    about_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_departments_inst_slug ON departments(institution_id, slug) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_departments_inst_code ON departments(institution_id, code) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_departments
BEFORE UPDATE ON departments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(institution_id, label)
);

CREATE TABLE financial_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(institution_id, label)
);

CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    level VARCHAR(50) NOT NULL, -- e.g., 'UG', 'PG', 'PhD', 'DualDegree'
    duration_years INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_programmes_dept_code ON programmes(department_id, code) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_programmes
BEFORE UPDATE ON programmes
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE metric_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'SCOPUS', 'GOOGLE_SCHOLAR', 'ORCID', 'CROSSREF', 'MANUAL_VERIFIED'
    name TEXT NOT NULL,
    api_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    storage_key TEXT NOT NULL,
    source_url TEXT,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL DEFAULT 0,
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC', -- 'PUBLIC', 'RESTRICTED', 'INTERNAL'
    malware_scan_state VARCHAR(30) NOT NULL DEFAULT 'CLEAN', -- 'PENDING', 'CLEAN', 'INFECTED'
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_documents_dept ON documents(department_id) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_documents
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 2. IDENTITY, AUTHENTICATION & ACCESS CONTROL
-- ----------------------------------------------------------------------------

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'INSTITUTE_ADMIN', 'RESEARCH_OFFICE', 'DEPARTMENT_ADMIN', 'REVIEWER', 'FACULTY', 'PUBLIC'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    first_login BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

CREATE TABLE role_department_scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role_id, department_id)
);

CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. FACULTY, APPOINTMENTS & CV SATELLITES
-- ----------------------------------------------------------------------------

CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) NOT NULL,
    official_email VARCHAR(255) NOT NULL,
    full_name TEXT NOT NULL,
    designation VARCHAR(100) NOT NULL,
    is_permanent BOOLEAN NOT NULL DEFAULT TRUE,
    phone VARCHAR(50),
    photo_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    photo_url TEXT,
    portfolio_slug VARCHAR(100),
    sort_order INT DEFAULT 0,
    research_interests TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_faculty_emp_code ON faculty(employee_code) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_faculty_official_email ON faculty(official_email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_faculty_slug ON faculty(portfolio_slug) WHERE portfolio_slug IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_faculty_sort ON faculty(sort_order) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_faculty
BEFORE UPDATE ON faculty
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    designation VARCHAR(100) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- At most one active primary appointment per faculty member
CREATE UNIQUE INDEX idx_faculty_active_primary_appointment 
ON faculty_appointments(faculty_id) 
WHERE is_primary = TRUE AND end_date IS NULL AND deleted_at IS NULL;

CREATE INDEX idx_faculty_appointments_dept ON faculty_appointments(department_id) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_faculty_appointments
BEFORE UPDATE ON faculty_appointments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL UNIQUE REFERENCES faculty(id) ON DELETE CASCADE,
    biography TEXT,
    date_of_birth DATE,
    date_of_joining DATE,
    google_scholar_url TEXT,
    google_scholar_id VARCHAR(100),
    scopus_url TEXT,
    scopus_author_id VARCHAR(100),
    orcid VARCHAR(50),
    publons_url TEXT,
    research_gate_url TEXT,
    vidwan_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_faculty_profiles
BEFORE UPDATE ON faculty_profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    degree VARCHAR(100) NOT NULL,
    specialization TEXT,
    institution TEXT NOT NULL,
    completion_year INT NOT NULL,
    certificate_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_fac_qual_faculty ON faculty_qualifications(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_faculty_qualifications BEFORE UPDATE ON faculty_qualifications FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_teaching_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    designation VARCHAR(100) NOT NULL,
    organization TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_fac_teach_faculty ON faculty_teaching_experiences(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_faculty_teaching_experiences BEFORE UPDATE ON faculty_teaching_experiences FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_administrative_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    role_title VARCHAR(150) NOT NULL,
    organization TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_fac_admin_faculty ON faculty_administrative_experiences(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_faculty_administrative_experiences BEFORE UPDATE ON faculty_administrative_experiences FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_honors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    awarding_body TEXT NOT NULL,
    award_date DATE,
    award_year INT,
    supporting_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_fac_honors_faculty ON faculty_honors(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_faculty_honors BEFORE UPDATE ON faculty_honors FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_exposures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    organizer TEXT,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_fac_exposures_faculty ON faculty_exposures(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_faculty_exposures BEFORE UPDATE ON faculty_exposures FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE expert_talks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    host_organization TEXT NOT NULL,
    venue TEXT,
    talk_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_expert_talks_faculty ON expert_talks(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_expert_talks BEFORE UPDATE ON expert_talks FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE faculty_metric_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    metric_source_id UUID NOT NULL REFERENCES metric_sources(id) ON DELETE CASCADE,
    h_index INT NOT NULL DEFAULT 0,
    citations INT NOT NULL DEFAULT 0,
    i10_index INT DEFAULT 0,
    raw_payload JSONB,
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_fac_metric_faculty ON faculty_metric_snapshots(faculty_id, captured_at DESC);

-- ----------------------------------------------------------------------------
-- 4. CANONICAL RESEARCH ENGINE (PUBLICATIONS, PATENTS, PROJECTS, ETC.)
-- ----------------------------------------------------------------------------

CREATE TYPE publication_types AS ENUM ('JOURNAL', 'CONFERENCE', 'BOOK', 'BOOK_CHAPTER');
CREATE TYPE workflow_statuses AS ENUM ('DRAFT', 'SUBMITTED', 'DEPARTMENT_VERIFIED', 'PUBLISHED', 'RETURNED', 'ARCHIVED');

CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    publication_type publication_types NOT NULL,
    doi VARCHAR(255),
    isbn VARCHAR(50),
    venue TEXT,
    publisher TEXT,
    volume VARCHAR(50),
    issue VARCHAR(50),
    pages VARCHAR(50),
    published_date DATE,
    year INT NOT NULL,
    indexing VARCHAR(100), -- 'SCI', 'Scopus', 'Web of Science', etc.
    quartile VARCHAR(10),  -- 'Q1', 'Q2', 'Q3', 'Q4'
    status workflow_statuses NOT NULL DEFAULT 'DRAFT',
    source_url TEXT,
    raw_authors TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_publications_doi ON publications(LOWER(doi)) WHERE doi IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_publications_status_type ON publications(status, publication_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_publications_year ON publications(year DESC) WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_publications
BEFORE UPDATE ON publications
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE publication_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_order INT NOT NULL,
    is_corresponding BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(publication_id, author_order)
);
CREATE INDEX idx_pub_authors_fac ON publication_authors(faculty_id);

CREATE TABLE publication_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(publication_id, department_id)
);
CREATE INDEX idx_pub_depts_dept ON publication_departments(department_id);

CREATE TABLE publication_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    decision VARCHAR(50) NOT NULL, -- 'VERIFIED', 'RETURNED', 'PUBLISHED', 'ARCHIVED'
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE publication_metric_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    metric_source_id UUID NOT NULL REFERENCES metric_sources(id) ON DELETE CASCADE,
    citation_count INT NOT NULL DEFAULT 0,
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Patents
CREATE TABLE patents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    patent_type VARCHAR(50) NOT NULL DEFAULT 'INVENTION',
    status VARCHAR(50) NOT NULL, -- 'Filed', 'Published', 'Granted'
    application_number VARCHAR(100),
    publication_number VARCHAR(100),
    grant_number VARCHAR(100),
    jurisdiction VARCHAR(100) NOT NULL DEFAULT 'India',
    patent_office VARCHAR(100),
    filing_date DATE,
    publication_date DATE,
    grant_date DATE,
    year INT NOT NULL,
    applicant_name TEXT,
    raw_inventors TEXT,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    workflow_status workflow_statuses NOT NULL DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_patents_status ON patents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_patents_workflow ON patents(workflow_status) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_patents BEFORE UPDATE ON patents FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE patent_inventors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patent_id UUID NOT NULL REFERENCES patents(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    inventor_name TEXT NOT NULL,
    inventor_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(patent_id, inventor_order)
);
CREATE INDEX idx_patent_inv_faculty ON patent_inventors(faculty_id);

CREATE TABLE patent_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patent_id UUID NOT NULL REFERENCES patents(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(patent_id, department_id)
);
CREATE INDEX idx_patent_depts_dept ON patent_departments(department_id);

CREATE TABLE patent_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patent_id UUID NOT NULL REFERENCES patents(id) ON DELETE CASCADE,
    reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    decision VARCHAR(50) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Sponsored Projects & Grants
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    project_number VARCHAR(100),
    sponsor TEXT NOT NULL,
    scheme TEXT,
    status VARCHAR(50) NOT NULL, -- 'Ongoing', 'Completed'
    start_date DATE,
    end_date DATE,
    year INT NOT NULL,
    total_sanctioned_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_amount_received NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    lead_department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    raw_investigators TEXT,
    workflow_status workflow_statuses NOT NULL DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_lead_dept ON projects(lead_department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_projects BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    member_name TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'PI', -- 'PI', 'Co-PI', 'Investigator'
    member_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_project_members_fac ON project_members(faculty_id);

CREATE TABLE project_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    is_lead BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, department_id)
);
CREATE INDEX idx_proj_depts_dept ON project_departments(department_id);

CREATE TABLE grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    financial_year_id UUID REFERENCES financial_years(id) ON DELETE SET NULL,
    sanction_order_number VARCHAR(100),
    sanctioned_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    received_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    expenditure_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    received_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_grants_project ON grants(project_id);
CREATE TRIGGER set_timestamp_grants BEFORE UPDATE ON grants FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE project_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    decision VARCHAR(50) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Consultancies
CREATE TABLE consultancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    consultancy_number VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Ongoing',
    sanctioned_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    year INT NOT NULL,
    raw_faculty TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_consultancies_dept ON consultancies(department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_consultancies BEFORE UPDATE ON consultancies FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE consultancy_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultancy_id UUID NOT NULL REFERENCES consultancies(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    member_name TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Consultant',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_consultancy_members_fac ON consultancy_members(faculty_id);

-- Research Supervisions
CREATE TABLE supervisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    programme_level VARCHAR(50) NOT NULL, -- 'MTech', 'PhD'
    scholar_name TEXT NOT NULL,
    roll_number VARCHAR(50),
    thesis_title TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'Ongoing', 'Submitted', 'Awarded'
    registration_date DATE,
    submission_date DATE,
    award_date DATE,
    raw_supervisors TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_supervisions_dept ON supervisions(department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_supervisions BEFORE UPDATE ON supervisions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE supervision_supervisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervision_id UUID NOT NULL REFERENCES supervisions(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    supervisor_name TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Supervisor', -- 'Supervisor', 'Co-Supervisor'
    supervisor_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_supervision_supervisors_fac ON supervision_supervisors(faculty_id);

-- Events Organised
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'STC', 'E-STC', 'Workshop', 'Conference', 'Seminar', 'FDP'
    venue TEXT,
    sponsor TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    year INT NOT NULL,
    raw_coordinators TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_events_dept ON events(department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_events BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE event_coordinators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    coordinator_name TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Coordinator',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_event_coordinators_fac ON event_coordinators(faculty_id);

-- Courses & Faculty Teaching
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    credits NUMERIC(3,1) NOT NULL DEFAULT 3.0,
    semester INT,
    course_level VARCHAR(50), -- 'UG', 'PG', 'Doctoral'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX idx_courses_dept_code ON courses(department_id, code) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_courses BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE course_offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    semester INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_course_offerings_faculty ON course_offerings(faculty_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_course_offerings BEFORE UPDATE ON course_offerings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 5. DEPARTMENT OPERATIONS (STUDENTS, STAFF, LABS, PLACEMENT)
-- ----------------------------------------------------------------------------

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    programme_id UUID NOT NULL REFERENCES programmes(id) ON DELETE RESTRICT,
    roll_number VARCHAR(50) NOT NULL,
    full_name TEXT NOT NULL,
    admission_year INT NOT NULL,
    current_semester INT,
    email VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX idx_students_roll ON students(department_id, admission_year, roll_number) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_students BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE phd_scholars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    roll_number VARCHAR(50),
    registration_date DATE,
    dissertation_title TEXT,
    supervisor_name TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pursuing', -- 'pursuing', 'passed'
    email VARCHAR(255),
    contact_number VARCHAR(50),
    time_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_phd_scholars_dept_status ON phd_scholars(department_id, status) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_phd_scholars BEFORE UPDATE ON phd_scholars FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    designation VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    photo_url TEXT,
    time_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_staff_dept ON staff(department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_staff BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    in_charge_faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    raw_in_charge_name TEXT,
    technician_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_labs_dept ON labs(department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_labs BEFORE UPDATE ON labs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    lab_id UUID REFERENCES labs(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    asset_tag VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    stock_in_use INT NOT NULL DEFAULT 1,
    purchase_value NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    purchase_date DATE,
    vendor_name TEXT,
    invoice_number VARCHAR(100),
    indenter_name TEXT,
    contact_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_equipment_dept ON equipment(department_id) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_equipment BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE placement_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    year INT NOT NULL,
    programme_branch VARCHAR(100) NOT NULL,
    graduating_count INT NOT NULL DEFAULT 0,
    placed_count INT NOT NULL DEFAULT 0,
    jobs_offered_count INT NOT NULL DEFAULT 0,
    highest_package_lpa NUMERIC(6,2),
    average_package_lpa NUMERIC(6,2),
    median_package_lpa NUMERIC(6,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX idx_placement_stats_unique ON placement_stats(department_id, year, programme_branch) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_placement_stats BEFORE UPDATE ON placement_stats FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 6. CMS & DEPARTMENT CONTENT
-- ----------------------------------------------------------------------------

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE, -- NULL = Institute-wide
    title TEXT NOT NULL,
    body TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    attached_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_announcements_dept_pub ON announcements(department_id, publish_date DESC) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_announcements BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'Achievement', 'AcademicsNews', 'ResearchNews'
    title TEXT NOT NULL,
    slug VARCHAR(255),
    body TEXT NOT NULL,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    feature_image_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    attached_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_posts_dept_cat ON posts(department_id, category, publish_date DESC) WHERE deleted_at IS NULL;
CREATE TRIGGER set_timestamp_posts BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE about_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_about_sections BEFORE UPDATE ON about_sections FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE programmes_offered (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_programmes_offered BEFORE UPDATE ON programmes_offered FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE qna (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_qna BEFORE UPDATE ON qna FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE hod_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    hod_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_hod_messages BEFORE UPDATE ON hod_messages FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE home_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255),
    link_url TEXT,
    image_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_home_slides BEFORE UPDATE ON home_slides FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE syllabus_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_syllabus_documents BEFORE UPDATE ON syllabus_documents FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE calendar_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE TRIGGER set_timestamp_calendar_documents BEFORE UPDATE ON calendar_documents FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 7. GOVERNANCE, AUDIT & MIGRATION TRACEABILITY
-- ----------------------------------------------------------------------------

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'REVIEW', 'LOGIN', 'IMPORT'
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

CREATE TABLE legacy_id_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_table VARCHAR(100) NOT NULL,
    legacy_int_id INT NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_uuid UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(source_table, legacy_int_id)
);
CREATE INDEX idx_legacy_map_target ON legacy_id_maps(target_table, target_uuid);

CREATE TABLE import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'MYSQL_DUMP', 'CSV', 'API_SYNC'
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    total_rows INT DEFAULT 0,
    imported_rows INT DEFAULT 0,
    failed_rows INT DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE import_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID NOT NULL REFERENCES import_jobs(id) ON DELETE CASCADE,
    source_table VARCHAR(100) NOT NULL,
    source_id VARCHAR(100),
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    raw_payload JSONB,
    resolution_status VARCHAR(50) NOT NULL DEFAULT 'UNRESOLVED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
