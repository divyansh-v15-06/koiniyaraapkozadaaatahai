-- ============================================================================
-- 000001_initial_schema.down.sql
-- ============================================================================

DROP TABLE IF EXISTS import_errors CASCADE;
DROP TABLE IF EXISTS import_jobs CASCADE;
DROP TABLE IF EXISTS legacy_id_maps CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

DROP TABLE IF EXISTS calendar_documents CASCADE;
DROP TABLE IF EXISTS syllabus_documents CASCADE;
DROP TABLE IF EXISTS home_slides CASCADE;
DROP TABLE IF EXISTS hod_messages CASCADE;
DROP TABLE IF EXISTS qna CASCADE;
DROP TABLE IF EXISTS programmes_offered CASCADE;
DROP TABLE IF EXISTS about_sections CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;

DROP TABLE IF EXISTS placement_stats CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS labs CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS phd_scholars CASCADE;
DROP TABLE IF EXISTS students CASCADE;

DROP TABLE IF EXISTS course_offerings CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS event_coordinators CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS supervision_supervisors CASCADE;
DROP TABLE IF EXISTS supervisions CASCADE;
DROP TABLE IF EXISTS consultancy_members CASCADE;
DROP TABLE IF EXISTS consultancies CASCADE;
DROP TABLE IF EXISTS project_reviews CASCADE;
DROP TABLE IF EXISTS grants CASCADE;
DROP TABLE IF EXISTS project_departments CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS patent_reviews CASCADE;
DROP TABLE IF EXISTS patent_departments CASCADE;
DROP TABLE IF EXISTS patent_inventors CASCADE;
DROP TABLE IF EXISTS patents CASCADE;
DROP TABLE IF EXISTS publication_metric_snapshots CASCADE;
DROP TABLE IF EXISTS publication_reviews CASCADE;
DROP TABLE IF EXISTS publication_departments CASCADE;
DROP TABLE IF EXISTS publication_authors CASCADE;
DROP TABLE IF EXISTS publications CASCADE;

DROP TYPE IF EXISTS workflow_statuses CASCADE;
DROP TYPE IF EXISTS publication_types CASCADE;

DROP TABLE IF EXISTS faculty_metric_snapshots CASCADE;
DROP TABLE IF EXISTS expert_talks CASCADE;
DROP TABLE IF EXISTS faculty_exposures CASCADE;
DROP TABLE IF EXISTS faculty_honors CASCADE;
DROP TABLE IF EXISTS faculty_administrative_experiences CASCADE;
DROP TABLE IF EXISTS faculty_teaching_experiences CASCADE;
DROP TABLE IF EXISTS faculty_qualifications CASCADE;
DROP TABLE IF EXISTS faculty_profiles CASCADE;
DROP TABLE IF EXISTS faculty_appointments CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;

DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS role_department_scopes CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS metric_sources CASCADE;
DROP TABLE IF EXISTS programmes CASCADE;
DROP TABLE IF EXISTS financial_years CASCADE;
DROP TABLE IF EXISTS academic_years CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;

DROP FUNCTION IF EXISTS trigger_set_timestamp() CASCADE;
