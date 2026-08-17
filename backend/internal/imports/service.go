package imports

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Service interface {
	CreateJob(ctx context.Context, departmentID, sourceType, userID string) (*ImportJob, error)
	GetJob(ctx context.Context, jobID string) (*ImportJob, error)
	ListErrors(ctx context.Context, jobID string) ([]ImportError, error)
	RecordError(ctx context.Context, jobID, sourceTable, sourceID, errorType, errorMsg string, raw any) error
	RecordLegacyMapping(ctx context.Context, sourceTable string, legacyIntID int, targetTable string, targetUUID string) error
	GetTargetUUID(ctx context.Context, sourceTable string, legacyIntID int) (*string, error)
}

type service struct {
	pool *pgxpool.Pool
}

func NewService(pool *pgxpool.Pool) Service {
	return &service{pool: pool}
}

func (s *service) CreateJob(ctx context.Context, departmentID, sourceType, userID string) (*ImportJob, error) {
	var createdBy *string
	if userID != "" {
		createdBy = &userID
	}
	querySQL := `
		INSERT INTO import_jobs (department_id, source_type, status, created_by)
		VALUES ($1, $2, 'PENDING', $3)
		RETURNING id, department_id, source_type, status, total_rows, imported_rows, failed_rows, created_by, created_at, completed_at
	`
	var j ImportJob
	err := s.pool.QueryRow(ctx, querySQL, departmentID, sourceType, createdBy).Scan(
		&j.ID, &j.DepartmentID, &j.SourceType, &j.Status, &j.TotalRows, &j.ImportedRows, &j.FailedRows, &j.CreatedBy, &j.CreatedAt, &j.CompletedAt,
	)
	if err != nil {
		return nil, err
	}
	return &j, nil
}

func (s *service) GetJob(ctx context.Context, jobID string) (*ImportJob, error) {
	querySQL := `
		SELECT id, department_id, source_type, status, total_rows, imported_rows, failed_rows, created_by, created_at, completed_at
		FROM import_jobs
		WHERE id = $1
	`
	var j ImportJob
	err := s.pool.QueryRow(ctx, querySQL, jobID).Scan(
		&j.ID, &j.DepartmentID, &j.SourceType, &j.Status, &j.TotalRows, &j.ImportedRows, &j.FailedRows, &j.CreatedBy, &j.CreatedAt, &j.CompletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &j, nil
}

func (s *service) ListErrors(ctx context.Context, jobID string) ([]ImportError, error) {
	querySQL := `
		SELECT id, import_job_id, source_table, source_id, error_type, error_message, resolution_status, created_at
		FROM import_errors
		WHERE import_job_id = $1
		ORDER BY created_at DESC
	`
	rows, err := s.pool.Query(ctx, querySQL, jobID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []ImportError
	for rows.Next() {
		var e ImportError
		if err := rows.Scan(&e.ID, &e.ImportJobID, &e.SourceTable, &e.SourceID, &e.ErrorType, &e.ErrorMessage, &e.ResolutionStatus, &e.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, e)
	}
	return list, rows.Err()
}

func (s *service) RecordError(ctx context.Context, jobID, sourceTable, sourceID, errorType, errorMsg string, raw any) error {
	querySQL := `
		INSERT INTO import_errors (import_job_id, source_table, source_id, error_type, error_message, raw_payload)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := s.pool.Exec(ctx, querySQL, jobID, sourceTable, sourceID, errorType, errorMsg, raw)
	return err
}

func (s *service) RecordLegacyMapping(ctx context.Context, sourceTable string, legacyIntID int, targetTable string, targetUUID string) error {
	querySQL := `
		INSERT INTO legacy_id_maps (source_table, legacy_int_id, target_table, target_uuid)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (source_table, legacy_int_id) DO UPDATE SET target_uuid = EXCLUDED.target_uuid
	`
	_, err := s.pool.Exec(ctx, querySQL, sourceTable, legacyIntID, targetTable, targetUUID)
	return err
}

func (s *service) GetTargetUUID(ctx context.Context, sourceTable string, legacyIntID int) (*string, error) {
	querySQL := `SELECT target_uuid FROM legacy_id_maps WHERE source_table = $1 AND legacy_int_id = $2`
	var targetUUID string
	err := s.pool.QueryRow(ctx, querySQL, sourceTable, legacyIntID).Scan(&targetUUID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &targetUUID, nil
}

// CleanEmail normalizes legacy obfuscated email (e.g. name[at]nith[dot]ac[dot]in -> name@nith.ac.in)
func CleanEmail(raw string) string {
	e := strings.TrimSpace(raw)
	e = strings.ReplaceAll(e, "[at]", "@")
	e = strings.ReplaceAll(e, "[dot]", ".")
	e = strings.ReplaceAll(e, " ", "")
	return strings.ToLower(e)
}

// CleanDOI strips url prefixes and converts to lowercase
func CleanDOI(raw string) *string {
	d := strings.TrimSpace(raw)
	if d == "" || d == "NA" || d == "-" || d == "N/A" || d == "null" {
		return nil
	}
	d = strings.TrimPrefix(d, "https://doi.org/")
	d = strings.TrimPrefix(d, "http://doi.org/")
	d = strings.TrimPrefix(d, "doi:")
	d = strings.ToLower(strings.TrimSpace(d))
	return &d
}

// ParseLegacyDate parses multiple common date patterns found in legacy CSVs
func ParseLegacyDate(raw string) *time.Time {
	val := strings.TrimSpace(raw)
	if val == "" || val == "---" || val == "NA" || val == "Present" {
		return nil
	}

	formats := []string{
		"2006-01-02",
		"02/01/2006",
		"2/1/2006",
		"02-01-2006",
		"January 2006",
		"2006",
	}

	for _, f := range formats {
		if t, err := time.Parse(f, val); err == nil {
			return &t
		}
	}

	return nil
}

func FormatDateForSQL(t *time.Time) *string {
	if t == nil {
		return nil
	}
	s := fmt.Sprintf("%04d-%02d-%02d", t.Year(), t.Month(), t.Day())
	return &s
}
