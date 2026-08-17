package imports

import "time"

type ImportJob struct {
	ID           string     `json:"id"`
	DepartmentID string     `json:"department_id"`
	SourceType   string     `json:"source_type"`
	Status       string     `json:"status"` // 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
	TotalRows    int        `json:"total_rows"`
	ImportedRows int        `json:"imported_rows"`
	FailedRows   int        `json:"failed_rows"`
	CreatedBy    *string    `json:"created_by,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	CompletedAt  *time.Time `json:"completed_at,omitempty"`
}

type ImportError struct {
	ID               string    `json:"id"`
	ImportJobID      string    `json:"import_job_id"`
	SourceTable      string    `json:"source_table"`
	SourceID         *string   `json:"source_id,omitempty"`
	ErrorType        string    `json:"error_type"`
	ErrorMessage     string    `json:"error_message"`
	RawPayload       any       `json:"raw_payload,omitempty"`
	ResolutionStatus string    `json:"resolution_status"`
	CreatedAt        time.Time `json:"created_at"`
}

type RunImportRequest struct {
	DepartmentID string `json:"department_id" validate:"required"`
	SourceType   string `json:"source_type" validate:"required"` // 'LEGACY_CSE_MYSQL', 'CSV'
}

type ImportSummaryResponse struct {
	JobID        string `json:"job_id"`
	Status       string `json:"status"`
	TotalRows    int    `json:"total_rows"`
	ImportedRows int    `json:"imported_rows"`
	FailedRows   int    `json:"failed_rows"`
}
