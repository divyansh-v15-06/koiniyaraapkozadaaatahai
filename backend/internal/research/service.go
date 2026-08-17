package research

import (
	"context"

	"github.com/institute-portal/backend/internal/platform/httperr"
)

type Service interface {
	// Publications
	ListPublications(ctx context.Context, typeFilter, deptID, facultyID string, year *int, status, indexing, search string, limit, offset int) ([]Publication, error)
	GetPublication(ctx context.Context, id string) (*Publication, error)
	CreatePublication(ctx context.Context, userID string, req *CreatePublicationRequest) (*Publication, error)
	SubmitPublication(ctx context.Context, id string) error
	ReviewPublication(ctx context.Context, id, reviewerUserID string, req *ReviewDecisionRequest) error

	// Patents
	ListPatents(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Patent, error)
	GetPatent(ctx context.Context, id string) (*Patent, error)
	CreatePatent(ctx context.Context, userID string, req *CreatePatentRequest) (*Patent, error)
	SubmitPatent(ctx context.Context, id string) error
	ReviewPatent(ctx context.Context, id, reviewerUserID string, req *ReviewDecisionRequest) error

	// Projects
	ListProjects(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Project, error)
	GetProject(ctx context.Context, id string) (*Project, error)
	CreateProject(ctx context.Context, userID string, req *CreateProjectRequest) (*Project, error)
	CreateGrant(ctx context.Context, projectID string, req *CreateGrantRequest) (*Grant, error)
	ListGrants(ctx context.Context, projectID string) ([]Grant, error)

	// Consultancies
	ListConsultancies(ctx context.Context, deptID, facultyID string, year *int) ([]Consultancy, error)
	CreateConsultancy(ctx context.Context, userID string, req *CreateConsultancyRequest) (*Consultancy, error)

	// Supervisions
	ListSupervisions(ctx context.Context, deptID, facultyID, status, level string) ([]Supervision, error)
	CreateSupervision(ctx context.Context, userID string, req *CreateSupervisionRequest) (*Supervision, error)

	// Events
	ListEvents(ctx context.Context, deptID, facultyID, eventType string, year *int) ([]Event, error)
	CreateEvent(ctx context.Context, userID string, req *CreateEventRequest) (*Event, error)

	// Courses
	ListCourses(ctx context.Context, deptID, programmeID string) ([]Course, error)
	CreateCourse(ctx context.Context, req *CreateCourseRequest) (*Course, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListPublications(ctx context.Context, typeFilter, deptID, facultyID string, year *int, status, indexing, search string, limit, offset int) ([]Publication, error) {
	return s.repo.ListPublications(ctx, typeFilter, deptID, facultyID, year, status, indexing, search, limit, offset)
}

func (s *service) GetPublication(ctx context.Context, id string) (*Publication, error) {
	p, err := s.repo.GetPublicationByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, httperr.NotFound("Publication not found")
	}
	return p, nil
}

func (s *service) CreatePublication(ctx context.Context, userID string, req *CreatePublicationRequest) (*Publication, error) {
	return s.repo.CreatePublication(ctx, userID, req)
}

func (s *service) SubmitPublication(ctx context.Context, id string) error {
	p, err := s.GetPublication(ctx, id)
	if err != nil {
		return err
	}
	if p.Status != "DRAFT" && p.Status != "RETURNED" {
		return httperr.BadRequest("Only draft or returned publications can be submitted for review")
	}
	return s.repo.UpdatePublicationStatus(ctx, id, "SUBMITTED")
}

func (s *service) ReviewPublication(ctx context.Context, id, reviewerUserID string, req *ReviewDecisionRequest) error {
	var nextStatus string
	switch req.Decision {
	case "VERIFIED":
		nextStatus = "DEPARTMENT_VERIFIED"
	case "PUBLISHED":
		nextStatus = "PUBLISHED"
	case "RETURNED":
		nextStatus = "RETURNED"
	case "ARCHIVED":
		nextStatus = "ARCHIVED"
	default:
		return httperr.BadRequest("Invalid review decision. Allowed values: VERIFIED, PUBLISHED, RETURNED, ARCHIVED")
	}

	if err := s.repo.CreatePublicationReview(ctx, id, reviewerUserID, req.Decision, req.Comments); err != nil {
		return err
	}
	return s.repo.UpdatePublicationStatus(ctx, id, nextStatus)
}

func (s *service) ListPatents(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Patent, error) {
	return s.repo.ListPatents(ctx, status, deptID, facultyID, year, search, limit, offset)
}

func (s *service) GetPatent(ctx context.Context, id string) (*Patent, error) {
	p, err := s.repo.GetPatentByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, httperr.NotFound("Patent not found")
	}
	return p, nil
}

func (s *service) CreatePatent(ctx context.Context, userID string, req *CreatePatentRequest) (*Patent, error) {
	return s.repo.CreatePatent(ctx, userID, req)
}

func (s *service) SubmitPatent(ctx context.Context, id string) error {
	p, err := s.GetPatent(ctx, id)
	if err != nil {
		return err
	}
	if p.WorkflowStatus != "DRAFT" && p.WorkflowStatus != "RETURNED" {
		return httperr.BadRequest("Only draft or returned patents can be submitted for review")
	}
	return s.repo.UpdatePatentWorkflow(ctx, id, "SUBMITTED")
}

func (s *service) ReviewPatent(ctx context.Context, id, reviewerUserID string, req *ReviewDecisionRequest) error {
	var nextStatus string
	switch req.Decision {
	case "VERIFIED":
		nextStatus = "DEPARTMENT_VERIFIED"
	case "PUBLISHED":
		nextStatus = "PUBLISHED"
	case "RETURNED":
		nextStatus = "RETURNED"
	case "ARCHIVED":
		nextStatus = "ARCHIVED"
	default:
		return httperr.BadRequest("Invalid review decision")
	}

	if err := s.repo.CreatePatentReview(ctx, id, reviewerUserID, req.Decision, req.Comments); err != nil {
		return err
	}
	return s.repo.UpdatePatentWorkflow(ctx, id, nextStatus)
}

func (s *service) ListProjects(ctx context.Context, status, deptID, facultyID string, year *int, search string, limit, offset int) ([]Project, error) {
	return s.repo.ListProjects(ctx, status, deptID, facultyID, year, search, limit, offset)
}

func (s *service) GetProject(ctx context.Context, id string) (*Project, error) {
	p, err := s.repo.GetProjectByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, httperr.NotFound("Project not found")
	}
	return p, nil
}

func (s *service) CreateProject(ctx context.Context, userID string, req *CreateProjectRequest) (*Project, error) {
	return s.repo.CreateProject(ctx, userID, req)
}

func (s *service) CreateGrant(ctx context.Context, projectID string, req *CreateGrantRequest) (*Grant, error) {
	return s.repo.CreateGrant(ctx, projectID, req)
}

func (s *service) ListGrants(ctx context.Context, projectID string) ([]Grant, error) {
	return s.repo.ListGrants(ctx, projectID)
}

func (s *service) ListConsultancies(ctx context.Context, deptID, facultyID string, year *int) ([]Consultancy, error) {
	return s.repo.ListConsultancies(ctx, deptID, facultyID, year)
}

func (s *service) CreateConsultancy(ctx context.Context, userID string, req *CreateConsultancyRequest) (*Consultancy, error) {
	return s.repo.CreateConsultancy(ctx, userID, req)
}

func (s *service) ListSupervisions(ctx context.Context, deptID, facultyID, status, level string) ([]Supervision, error) {
	return s.repo.ListSupervisions(ctx, deptID, facultyID, status, level)
}

func (s *service) CreateSupervision(ctx context.Context, userID string, req *CreateSupervisionRequest) (*Supervision, error) {
	return s.repo.CreateSupervision(ctx, userID, req)
}

func (s *service) ListEvents(ctx context.Context, deptID, facultyID, eventType string, year *int) ([]Event, error) {
	return s.repo.ListEvents(ctx, deptID, facultyID, eventType, year)
}

func (s *service) CreateEvent(ctx context.Context, userID string, req *CreateEventRequest) (*Event, error) {
	return s.repo.CreateEvent(ctx, userID, req)
}

func (s *service) ListCourses(ctx context.Context, deptID, programmeID string) ([]Course, error) {
	return s.repo.ListCourses(ctx, deptID, programmeID)
}

func (s *service) CreateCourse(ctx context.Context, req *CreateCourseRequest) (*Course, error) {
	return s.repo.CreateCourse(ctx, req)
}
