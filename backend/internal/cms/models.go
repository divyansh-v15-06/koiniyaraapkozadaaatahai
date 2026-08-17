package cms

import "time"

type Announcement struct {
	ID                 string    `json:"id"`
	DepartmentID       *string   `json:"department_id,omitempty"` // NULL = Institute-wide
	DepartmentName     string    `json:"department_name,omitempty"`
	Title              string    `json:"title"`
	Body               *string   `json:"body,omitempty"`
	PublishDate        string    `json:"publish_date"`
	ExpiryDate         *string   `json:"expiry_date,omitempty"`
	IsPrivate          bool      `json:"is_private"`
	AttachedDocumentID *string   `json:"attached_document_id,omitempty"`
	DocumentURL        *string   `json:"document_url,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type Post struct {
	ID                    string    `json:"id"`
	DepartmentID          *string   `json:"department_id,omitempty"`
	DepartmentName        string    `json:"department_name,omitempty"`
	Category              string    `json:"category"` // 'Achievement', 'AcademicsNews', 'ResearchNews'
	Title                 string    `json:"title"`
	Slug                  *string   `json:"slug,omitempty"`
	Body                  string    `json:"body"`
	PublishDate           string    `json:"publish_date"`
	FeatureImageDocID     *string   `json:"feature_image_document_id,omitempty"`
	FeatureImageURL       *string   `json:"feature_image_url,omitempty"`
	AttachedDocumentID    *string   `json:"attached_document_id,omitempty"`
	DocumentURL           *string   `json:"document_url,omitempty"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}

type AboutSection struct {
	ID           string    `json:"id"`
	DepartmentID string    `json:"department_id"`
	Title        string    `json:"title"`
	Body         string    `json:"body"`
	SortOrder    int       `json:"sort_order"`
	IsPublished  bool      `json:"is_published"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ProgrammeOffered struct {
	ID           string    `json:"id"`
	DepartmentID string    `json:"department_id"`
	ProgrammeID  *string   `json:"programme_id,omitempty"`
	Title        string    `json:"title"`
	Body         string    `json:"body"`
	SortOrder    int       `json:"sort_order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type QnA struct {
	ID           string    `json:"id"`
	DepartmentID string    `json:"department_id"`
	Question     string    `json:"question"`
	Answer       string    `json:"answer"`
	SortOrder    int       `json:"sort_order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type HODMessage struct {
	ID             string    `json:"id"`
	DepartmentID   string    `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	FacultyID      *string   `json:"faculty_id,omitempty"`
	HODName        string    `json:"hod_name"`
	Message        string    `json:"message"`
	ImageURL       *string   `json:"image_url,omitempty"`
	PublishDate    string    `json:"publish_date"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type HomeSlide struct {
	ID           string    `json:"id"`
	DepartmentID *string   `json:"department_id,omitempty"`
	Title        *string   `json:"title,omitempty"`
	LinkURL      *string   `json:"link_url,omitempty"`
	ImageURL     *string   `json:"image_url,omitempty"`
	SortOrder    int       `json:"sort_order"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type SyllabusDoc struct {
	ID             string    `json:"id"`
	DepartmentID   string    `json:"department_id"`
	ProgrammeID    *string   `json:"programme_id,omitempty"`
	ProgrammeName  string    `json:"programme_name,omitempty"`
	AcademicYearID *string   `json:"academic_year_id,omitempty"`
	Title          string    `json:"title"`
	DocumentID     string    `json:"document_id"`
	DocumentURL    *string   `json:"document_url,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type CalendarDoc struct {
	ID             string    `json:"id"`
	DepartmentID   string    `json:"department_id"`
	AcademicYearID *string   `json:"academic_year_id,omitempty"`
	Title          string    `json:"title"`
	DocumentID     string    `json:"document_id"`
	DocumentURL    *string   `json:"document_url,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Request types
type CreateAnnouncementRequest struct {
	DepartmentID       *string `json:"department_id"`
	Title              string  `json:"title" validate:"required"`
	Body               *string `json:"body"`
	PublishDate        string  `json:"publish_date"`
	ExpiryDate         *string `json:"expiry_date"`
	IsPrivate          bool    `json:"is_private"`
	AttachedDocumentID *string `json:"attached_document_id"`
}

type CreatePostRequest struct {
	DepartmentID          *string `json:"department_id"`
	Category              string  `json:"category" validate:"required,oneof=Achievement AcademicsNews ResearchNews"`
	Title                 string  `json:"title" validate:"required"`
	Slug                  *string `json:"slug"`
	Body                  string  `json:"body" validate:"required"`
	PublishDate           string  `json:"publish_date"`
	FeatureImageDocID     *string `json:"feature_image_document_id"`
	AttachedDocumentID    *string `json:"attached_document_id"`
}

type CreateAboutSectionRequest struct {
	DepartmentID string `json:"department_id" validate:"required"`
	Title        string `json:"title" validate:"required"`
	Body         string `json:"body" validate:"required"`
	SortOrder    int    `json:"sort_order"`
	IsPublished  bool   `json:"is_published"`
}

type CreateProgrammeOfferedRequest struct {
	DepartmentID string  `json:"department_id" validate:"required"`
	ProgrammeID  *string `json:"programme_id"`
	Title        string  `json:"title" validate:"required"`
	Body         string  `json:"body" validate:"required"`
	SortOrder    int     `json:"sort_order"`
}

type CreateQnARequest struct {
	DepartmentID string `json:"department_id" validate:"required"`
	Question     string `json:"question" validate:"required"`
	Answer       string `json:"answer" validate:"required"`
	SortOrder    int    `json:"sort_order"`
}

type CreateHODMessageRequest struct {
	DepartmentID string  `json:"department_id" validate:"required"`
	FacultyID    *string `json:"faculty_id"`
	HODName      string  `json:"hod_name" validate:"required"`
	Message      string  `json:"message" validate:"required"`
	ImageURL     *string `json:"image_url"`
	PublishDate  string  `json:"publish_date"`
}

type CreateHomeSlideRequest struct {
	DepartmentID *string `json:"department_id"`
	Title        *string `json:"title"`
	LinkURL      *string `json:"link_url"`
	ImageURL     *string `json:"image_url"`
	SortOrder    int     `json:"sort_order"`
	IsActive     bool    `json:"is_active"`
}
