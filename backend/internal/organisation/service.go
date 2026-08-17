package organisation

import (
	"context"

	"github.com/institute-portal/backend/internal/platform/httperr"
)

type Service interface {
	ListInstitutions(ctx context.Context) ([]Institution, error)
	GetInstitution(ctx context.Context, id string) (*Institution, error)
	ListDepartments(ctx context.Context, institutionID string) ([]Department, error)
	GetDepartment(ctx context.Context, idOrSlug string) (*Department, error)
	ListProgrammes(ctx context.Context, departmentID string) ([]Programme, error)
	CreateProgramme(ctx context.Context, departmentID string, req *CreateProgrammeRequest) (*Programme, error)
	ListAcademicYears(ctx context.Context, institutionID string) ([]AcademicYear, error)
	ListFinancialYears(ctx context.Context, institutionID string) ([]FinancialYear, error)
	ListFacultyAppointments(ctx context.Context, facultyID string) ([]FacultyAppointment, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListInstitutions(ctx context.Context) ([]Institution, error) {
	return s.repo.ListInstitutions(ctx)
}

func (s *service) GetInstitution(ctx context.Context, id string) (*Institution, error) {
	inst, err := s.repo.GetInstitutionByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if inst == nil {
		return nil, httperr.NotFound("Institution not found")
	}
	return inst, nil
}

func (s *service) ListDepartments(ctx context.Context, institutionID string) ([]Department, error) {
	return s.repo.ListDepartments(ctx, institutionID)
}

func (s *service) GetDepartment(ctx context.Context, idOrSlug string) (*Department, error) {
	dept, err := s.repo.GetDepartmentBySlug(ctx, idOrSlug)
	if err != nil {
		return nil, err
	}
	if dept == nil {
		dept, err = s.repo.GetDepartmentByID(ctx, idOrSlug)
		if err != nil {
			return nil, err
		}
	}
	if dept == nil {
		return nil, httperr.NotFound("Department not found")
	}
	return dept, nil
}

func (s *service) ListProgrammes(ctx context.Context, departmentID string) ([]Programme, error) {
	return s.repo.ListProgrammes(ctx, departmentID)
}

func (s *service) CreateProgramme(ctx context.Context, departmentID string, req *CreateProgrammeRequest) (*Programme, error) {
	return s.repo.CreateProgramme(ctx, departmentID, req)
}

func (s *service) ListAcademicYears(ctx context.Context, institutionID string) ([]AcademicYear, error) {
	return s.repo.ListAcademicYears(ctx, institutionID)
}

func (s *service) ListFinancialYears(ctx context.Context, institutionID string) ([]FinancialYear, error) {
	return s.repo.ListFinancialYears(ctx, institutionID)
}

func (s *service) ListFacultyAppointments(ctx context.Context, facultyID string) ([]FacultyAppointment, error) {
	return s.repo.ListAppointmentsByFaculty(ctx, facultyID)
}
