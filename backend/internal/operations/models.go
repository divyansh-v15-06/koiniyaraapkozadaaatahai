package operations

import "time"

type Student struct {
	ID              string    `json:"id"`
	DepartmentID    string    `json:"department_id"`
	DepartmentName  string    `json:"department_name,omitempty"`
	ProgrammeID     string    `json:"programme_id"`
	ProgrammeName   string    `json:"programme_name,omitempty"`
	ProgrammeCode   string    `json:"programme_code,omitempty"`
	RollNumber      string    `json:"roll_number"`
	FullName        string    `json:"full_name"`
	AdmissionYear   int       `json:"admission_year"`
	CurrentSemester *int      `json:"current_semester,omitempty"`
	Email           *string   `json:"email,omitempty"`
	PhotoURL        *string   `json:"photo_url,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type PhdScholar struct {
	ID                string    `json:"id"`
	DepartmentID      string    `json:"department_id"`
	DepartmentName    string    `json:"department_name,omitempty"`
	FullName          string    `json:"full_name"`
	RollNumber        *string   `json:"roll_number,omitempty"`
	RegistrationDate  *string   `json:"registration_date,omitempty"`
	DissertationTitle *string   `json:"dissertation_title,omitempty"`
	SupervisorName    *string   `json:"supervisor_name,omitempty"`
	Status            string    `json:"status"` // 'pursuing', 'passed'
	Email             *string   `json:"email,omitempty"`
	ContactNumber     *string   `json:"contact_number,omitempty"`
	TimeNote          *string   `json:"time_note,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type Staff struct {
	ID             string    `json:"id"`
	DepartmentID   string    `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	FullName       string    `json:"full_name"`
	Designation    string    `json:"designation"`
	Email          *string   `json:"email,omitempty"`
	Phone          *string   `json:"phone,omitempty"`
	PhotoURL       *string   `json:"photo_url,omitempty"`
	TimeNote       *string   `json:"time_note,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Lab struct {
	ID               string    `json:"id"`
	DepartmentID     string    `json:"department_id"`
	DepartmentName   string    `json:"department_name,omitempty"`
	Name             string    `json:"name"`
	Description      *string   `json:"description,omitempty"`
	Location         *string   `json:"location,omitempty"`
	ImageURL         *string   `json:"image_url,omitempty"`
	InChargeFacultyID *string  `json:"in_charge_faculty_id,omitempty"`
	RawInChargeName  *string   `json:"raw_in_charge_name,omitempty"`
	TechnicianName   *string   `json:"technician_name,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Equipment struct {
	ID             string    `json:"id"`
	DepartmentID   string    `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	LabID          *string   `json:"lab_id,omitempty"`
	LabName        *string   `json:"lab_name,omitempty"`
	Name           string    `json:"name"`
	AssetTag       *string   `json:"asset_tag,omitempty"`
	Quantity       int       `json:"quantity"`
	StockInUse     int       `json:"stock_in_use"`
	PurchaseValue  float64   `json:"purchase_value"`
	PurchaseDate   *string   `json:"purchase_date,omitempty"`
	VendorName     *string   `json:"vendor_name,omitempty"`
	InvoiceNumber  *string   `json:"invoice_number,omitempty"`
	IndenterName   *string   `json:"indenter_name,omitempty"`
	ContactDetails *string   `json:"contact_details,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type PlacementStat struct {
	ID                string    `json:"id"`
	DepartmentID      string    `json:"department_id"`
	DepartmentName    string    `json:"department_name,omitempty"`
	AcademicYearID    *string   `json:"academic_year_id,omitempty"`
	Year              int       `json:"year"`
	ProgrammeBranch   string    `json:"programme_branch"`
	GraduatingCount   int       `json:"graduating_count"`
	PlacedCount       int       `json:"placed_count"`
	JobsOfferedCount  int       `json:"jobs_offered_count"`
	PlacementPercent  float64   `json:"placement_percent"`
	HighestPackageLPA *float64  `json:"highest_package_lpa,omitempty"`
	AveragePackageLPA *float64  `json:"average_package_lpa,omitempty"`
	MedianPackageLPA  *float64  `json:"median_package_lpa,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// Request types
type CreateStudentRequest struct {
	DepartmentID    string  `json:"department_id" validate:"required"`
	ProgrammeID     string  `json:"programme_id" validate:"required"`
	RollNumber      string  `json:"roll_number" validate:"required"`
	FullName        string  `json:"full_name" validate:"required"`
	AdmissionYear   int     `json:"admission_year" validate:"required,min=1950,max=2100"`
	CurrentSemester *int    `json:"current_semester"`
	Email           *string `json:"email"`
	PhotoURL        *string `json:"photo_url"`
}

type CreatePhdScholarRequest struct {
	DepartmentID      string  `json:"department_id" validate:"required"`
	FullName          string  `json:"full_name" validate:"required"`
	RollNumber        *string `json:"roll_number"`
	RegistrationDate  *string `json:"registration_date"`
	DissertationTitle *string `json:"dissertation_title"`
	SupervisorName    *string `json:"supervisor_name"`
	Status            string  `json:"status" validate:"required,oneof=pursuing passed"`
	Email             *string `json:"email"`
	ContactNumber     *string `json:"contact_number"`
	TimeNote          *string `json:"time_note"`
}

type CreateStaffRequest struct {
	DepartmentID string  `json:"department_id" validate:"required"`
	FullName     string  `json:"full_name" validate:"required"`
	Designation  string  `json:"designation" validate:"required"`
	Email        *string `json:"email"`
	Phone        *string `json:"phone"`
	PhotoURL     *string `json:"photo_url"`
	TimeNote     *string `json:"time_note"`
}

type CreateLabRequest struct {
	DepartmentID      string  `json:"department_id" validate:"required"`
	Name              string  `json:"name" validate:"required"`
	Description       *string `json:"description"`
	Location          *string `json:"location"`
	InChargeFacultyID *string `json:"in_charge_faculty_id"`
	RawInChargeName   *string `json:"raw_in_charge_name"`
	TechnicianName    *string `json:"technician_name"`
}

type CreateEquipmentRequest struct {
	DepartmentID   string   `json:"department_id" validate:"required"`
	LabID          *string  `json:"lab_id"`
	Name           string   `json:"name" validate:"required"`
	AssetTag       *string  `json:"asset_tag"`
	Quantity       int      `json:"quantity" validate:"min=1"`
	StockInUse     int      `json:"stock_in_use"`
	PurchaseValue  float64  `json:"purchase_value"`
	PurchaseDate   *string  `json:"purchase_date"`
	VendorName     *string  `json:"vendor_name"`
	InvoiceNumber  *string  `json:"invoice_number"`
	IndenterName   *string  `json:"indenter_name"`
	ContactDetails *string  `json:"contact_details"`
}

type CreatePlacementStatRequest struct {
	DepartmentID      string   `json:"department_id" validate:"required"`
	AcademicYearID    *string  `json:"academic_year_id"`
	Year              int      `json:"year" validate:"required,min=1950,max=2100"`
	ProgrammeBranch   string   `json:"programme_branch" validate:"required"`
	GraduatingCount   int      `json:"graduating_count" validate:"min=0"`
	PlacedCount       int      `json:"placed_count" validate:"min=0"`
	JobsOfferedCount  int      `json:"jobs_offered_count" validate:"min=0"`
	HighestPackageLPA *float64 `json:"highest_package_lpa"`
	AveragePackageLPA *float64 `json:"average_package_lpa"`
	MedianPackageLPA  *float64 `json:"median_package_lpa"`
}
