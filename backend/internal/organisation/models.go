package organisation

import "time"

type Institution struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Domain    *string   `json:"domain,omitempty"`
	LogoURL   *string   `json:"logo_url,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Department struct {
	ID                 string    `json:"id"`
	InstitutionID      string    `json:"institution_id"`
	ParentDepartmentID *string   `json:"parent_department_id,omitempty"`
	Name               string    `json:"name"`
	Slug               string    `json:"slug"`
	Code               string    `json:"code"`
	ContactEmail       *string   `json:"contact_email,omitempty"`
	ContactPhone       *string   `json:"contact_phone,omitempty"`
	AboutText          *string   `json:"about_text,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Programme struct {
	ID            string    `json:"id"`
	DepartmentID  string    `json:"department_id"`
	Code          string    `json:"code"`
	Name          string    `json:"name"`
	Level         string    `json:"level"`
	DurationYears int       `json:"duration_years"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type AcademicYear struct {
	ID            string    `json:"id"`
	InstitutionID string    `json:"institution_id"`
	Label         string    `json:"label"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
	IsCurrent     bool      `json:"is_current"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type FinancialYear struct {
	ID            string    `json:"id"`
	InstitutionID string    `json:"institution_id"`
	Label         string    `json:"label"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
	IsCurrent     bool      `json:"is_current"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type FacultyAppointment struct {
	ID             string    `json:"id"`
	FacultyID      string    `json:"faculty_id"`
	DepartmentID   string    `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	DepartmentSlug string    `json:"department_slug,omitempty"`
	Designation    string    `json:"designation"`
	IsPrimary      bool      `json:"is_primary"`
	StartDate      string    `json:"start_date"`
	EndDate        *string   `json:"end_date,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type CreateProgrammeRequest struct {
	Code          string `json:"code" validate:"required"`
	Name          string `json:"name" validate:"required"`
	Level         string `json:"level" validate:"required"`
	DurationYears int    `json:"duration_years" validate:"required,min=1"`
}
