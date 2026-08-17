package reporting

import "time"

type FacultyKPI struct {
	FacultyID         string    `json:"faculty_id"`
	FacultyName       string    `json:"faculty_name"`
	EmployeeCode      string    `json:"employee_code"`
	Designation       string    `json:"designation"`
	JournalCount      int       `json:"journal_count"`
	ConferenceCount   int       `json:"conference_count"`
	BookCount         int       `json:"book_count"`
	BookChapterCount  int       `json:"book_chapter_count"`
	TotalPublications int       `json:"total_publications"`
	PatentCount       int       `json:"patent_count"`
	OngoingProjects   int       `json:"ongoing_projects"`
	CompletedProjects int       `json:"completed_projects"`
	TotalFunding      float64   `json:"total_funding"`
	TotalSupervisions int       `json:"total_supervisions"`
	TotalEvents       int       `json:"total_events"`
	ScopusHIndex      int       `json:"scopus_h_index"`
	ScopusCitations   int       `json:"scopus_citations"`
	ScholarHIndex     int       `json:"scholar_h_index"`
	ScholarCitations  int       `json:"scholar_citations"`
	CalculatedAt      time.Time `json:"calculated_at"`
}

type DepartmentKPI struct {
	DepartmentID          string    `json:"department_id"`
	InstitutionID         string    `json:"institution_id"`
	DepartmentName        string    `json:"department_name"`
	DepartmentSlug        string    `json:"department_slug"`
	DepartmentCode        string    `json:"department_code"`
	FacultyCount          int       `json:"faculty_count"`
	StaffCount            int       `json:"staff_count"`
	TotalStudents         int       `json:"total_students"`
	UGStudents            int       `json:"ug_students"`
	PGStudents            int       `json:"pg_students"`
	PursuingPhdCount      int       `json:"pursuing_phd_count"`
	PassedPhdCount        int       `json:"passed_phd_count"`
	JournalCount          int       `json:"journal_count"`
	ConferenceCount       int       `json:"conference_count"`
	BookCount             int       `json:"book_count"`
	BookChapterCount      int       `json:"book_chapter_count"`
	TotalPublications     int       `json:"total_publications"`
	PatentCount           int       `json:"patent_count"`
	OngoingProjects       int       `json:"ongoing_projects"`
	CompletedProjects     int       `json:"completed_projects"`
	TotalSanctionedAmount float64   `json:"total_sanctioned_amount"`
	TotalAmountReceived   float64   `json:"total_amount_received"`
	EventCount            int       `json:"event_count"`
	ConsultancyCount      int       `json:"consultancy_count"`
	ConsultancyFunding    float64   `json:"consultancy_funding"`
	CalculatedAt          time.Time `json:"calculated_at"`
}

type InstituteKPI struct {
	InstitutionID              string    `json:"institution_id"`
	InstitutionName            string    `json:"institution_name"`
	InstitutionSlug            string    `json:"institution_slug"`
	DepartmentCount            int       `json:"department_count"`
	FacultyCount               int       `json:"faculty_count"`
	CanonicalPublicationsCount int       `json:"canonical_publications_count"`
	CanonicalPatentsCount      int       `json:"canonical_patents_count"`
	CanonicalProjectsCount     int       `json:"canonical_projects_count"`
	TotalSanctionedFunding     float64   `json:"total_sanctioned_funding"`
	TotalReceivedFunding       float64   `json:"total_received_funding"`
	CalculatedAt               time.Time `json:"calculated_at"`
}

type LegacyCountsResponse struct {
	Staff               int `json:"staff"`
	Faculty             int `json:"faculty"`
	BachelorStudent     int `json:"bachelorStudent"`
	Publication         int `json:"publication"`
	Patent              int `json:"Patent"`
	Project             int `json:"Project"`
	Event               int `json:"Event"`
	PursuingPhdScholar  int `json:"pursuingPhdScholar"`
	PassedPhdScholar    int `json:"passedPhdScholar"`
	MasterStudent       int `json:"masterStudent"`
	DualdegreeStudent   int `json:"dualdegreeStudent"`
}

type LegacyAnalyticsFaculty struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type LegacyAnalyticsPublication struct {
	Year       *int   `json:"year"`
	FacultyIDs []int  `json:"facultyIds"`
	Type       string `json:"type"`
	Indexing   string `json:"indexing"`
}

type LegacyAnalyticsPatent struct {
	Year       *int   `json:"year"`
	Status     string `json:"status"`
	ID         string `json:"id"`
	FacultyIDs []int  `json:"facultyIds"`
}

type LegacyAnalyticsProject struct {
	Year       *int    `json:"year"`
	Status     string  `json:"status"`
	ID         string  `json:"id"`
	FacultyIDs []int   `json:"facultyIds"`
	Funding    float64 `json:"funding"`
}

type LegacyAnalyticsEvent struct {
	Year       *int   `json:"year"`
	FacultyIDs []int  `json:"facultyIds"`
	Type       string `json:"type"`
}

type LegacyAnalyticsResponse struct {
	FacultyData      []LegacyAnalyticsFaculty      `json:"facultyData"`
	PublicationsData []LegacyAnalyticsPublication  `json:"publicationsData"`
	PatentsData      []LegacyAnalyticsPatent       `json:"patentsData"`
	ProjectsData     []LegacyAnalyticsProject      `json:"projectsData"`
	EventsData       []LegacyAnalyticsEvent        `json:"eventsData"`
}

// ----------------------------------------------------------------------------
// RESUME & ANNUAL REPORT REPORTING DATA STRUCTURES
// ----------------------------------------------------------------------------

type ResumePublicationSessionItem struct {
	Data string  `json:"data"`
	DOI  *string `json:"doi,omitempty"`
}

type ResumePublicationGroup struct {
	AcademicSession string                         `json:"academicSession"`
	Publications    []ResumePublicationSessionItem `json:"publications"`
}

type ResumeQualificationItem struct {
	NameOfDegree   string `json:"nameOfDegree"`
	UniversityName string `json:"universityName"`
	PassingYear    int    `json:"passingYear"`
}

type ResumeTeachingExpItem struct {
	Position   string `json:"position"`
	Department string `json:"department"`
	From       string `json:"from"`
	To         string `json:"to"`
}

type ResumeProjectItem struct {
	Index           int     `json:"index"`
	ProjectTitle    string  `json:"projectTitle"`
	FundingAgency   string  `json:"fundingAgency"`
	FinancialOutlay float64 `json:"financialOutlay"`
	StartYear       *int    `json:"startYear"`
	EndYear         *int    `json:"endYear"`
	Role            string  `json:"role"`
}

type ResumePatentItem struct {
	Index       int    `json:"index"`
	PatentTitle string `json:"patentTitle"`
	Status      string `json:"status"`
	Year        int    `json:"year"`
}

type ResumeSupervisionItem struct {
	Index         int    `json:"index"`
	ScholarName   string `json:"scholarName"`
	ResearchTopic string `json:"researchTopic"`
	Status        string `json:"status"`
	Year          *int   `json:"year,omitempty"`
}

type ResumeEventItem struct {
	Index      int     `json:"index"`
	EventTitle string  `json:"eventTitle"`
	Role       string  `json:"role"`
	Type       string  `json:"type"`
	StartDate  string  `json:"startDate"`
	EndDate    *string `json:"endDate,omitempty"`
	Sponsor    *string `json:"sponsor,omitempty"`
}

type ResumeHonorItem struct {
	Index          int     `json:"index"`
	HonorTitle     string  `json:"honorTitle"`
	AwardingAgency string  `json:"awardingAgency"`
	Year           *int    `json:"year,omitempty"`
}

type ResumeConsultancyItem struct {
	Index              int     `json:"index"`
	Title              string  `json:"title"`
	ClientOrganisation string  `json:"clientOrganisation"`
	FinancialOutlay    float64 `json:"financialOutlay"`
	StartYear          *int    `json:"startYear,omitempty"`
	EndYear            *int    `json:"endYear,omitempty"`
}

type FacultyResumeData struct {
	FacultyName                  string                    `json:"facultyName"`
	PhoneNo                      string                    `json:"phoneNo"`
	EmailID                      string                    `json:"emailId"`
	Image                        string                    `json:"image"`
	GoogleScholar                string                    `json:"googleScholar"`
	ResearchArea                 string                    `json:"researchArea"`
	Qualifications               []ResumeQualificationItem `json:"qualifications"`
	TotalExperience              string                    `json:"totalExperience"`
	TeachingExp                  []ResumeTeachingExpItem   `json:"teachingExp"`
	GroupedByAcademicSessionpub  []ResumePublicationGroup  `json:"groupedByAcademicSessionpub"`
	GroupedByAcademicSessioncon  []ResumePublicationGroup  `json:"groupedByAcademicSessioncon"`
	GroupedByAcademicSessionbook []ResumePublicationGroup  `json:"groupedByAcademicSessionbook"`
	Projects                     []ResumeProjectItem       `json:"projects"`
	Patents                      []ResumePatentItem        `json:"patents"`
	ResearchSupervisions         []ResumeSupervisionItem   `json:"researchSupervisions"`
	Events                       []ResumeEventItem         `json:"events"`
	Honors                       []ResumeHonorItem         `json:"honors"`
	Consultancies                []ResumeConsultancyItem   `json:"consultancies"`
}

type AnnualReportPubCount struct {
	AcademicYear     string `json:"AcademicYear"`
	JournalSCIE      int    `json:"JournalSCIE"`
	JournalScopus    int    `json:"JournalScopus"`
	JournalOthers    int    `json:"JournalOthers"`
	Conference       int    `json:"Conference"`
	Book             int    `json:"Book"`
	BookChapter      int    `json:"BookChapter"`
	TotalPublication int    `json:"TotalPublication"`
}

type AnnualReportStaffItem struct {
	Index    int    `json:"index"`
	Name     string `json:"name"`
	Position string `json:"position"`
}

type AnnualReportEquipmentItem struct {
	Index         int     `json:"index"`
	Name          string  `json:"name"`
	Lab           string  `json:"lab"`
	Quantity      int     `json:"quantity"`
	InUse         int     `json:"inUse"`
	PurchaseValue float64 `json:"purchaseValue"`
	InvoiceNumber string  `json:"invoiceNumber"`
	Date          string  `json:"date"`
	Indenter      string  `json:"indenter"`
}

type DepartmentAnnualReportData struct {
	Professors        []string                    `json:"professors"`
	AssociateProfs    []string                    `json:"assoprofessors"`
	AssistantProfs    []string                    `json:"assiprofessors"`
	Staff             []AnnualReportStaffItem     `json:"staff"`
	PublicationCounts []AnnualReportPubCount      `json:"publicationcounts"`
	Projects          []ResumeProjectItem         `json:"projects"`
	Supervisions      []ResumeSupervisionItem     `json:"supervisions"`
	Consultancies     []ResumeConsultancyItem     `json:"consultancies"`
	Events            []ResumeEventItem           `json:"events"`
	Equipment         []AnnualReportEquipmentItem `json:"equipment"`
}
