package reporting

import (
	"context"

	"github.com/institute-portal/backend/internal/platform/httperr"
)

type Service interface {
	GetFacultyKPI(ctx context.Context, facultyID string) (*FacultyKPI, error)
	GetDepartmentKPI(ctx context.Context, deptID string) (*DepartmentKPI, error)
	GetInstituteKPI(ctx context.Context, instID string) (*InstituteKPI, error)
	RefreshKPIs(ctx context.Context) error
	GetLegacyCounts(ctx context.Context, deptID string) (*LegacyCountsResponse, error)
	GetLegacyAnalytics(ctx context.Context, deptID, facultyName, facultyCode string) (*LegacyAnalyticsResponse, error)
	GetFacultyResumeData(ctx context.Context, facultyIDOrCode string) (*FacultyResumeData, error)
	GetDepartmentAnnualReportData(ctx context.Context, deptID string, startYear, endYear int) (*DepartmentAnnualReportData, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetFacultyKPI(ctx context.Context, facultyID string) (*FacultyKPI, error) {
	k, err := s.repo.GetFacultyKPI(ctx, facultyID)
	if err != nil {
		return nil, err
	}
	if k == nil {
		return nil, httperr.NotFound("Faculty KPI metrics not found")
	}
	return k, nil
}

func (s *service) GetDepartmentKPI(ctx context.Context, deptID string) (*DepartmentKPI, error) {
	k, err := s.repo.GetDepartmentKPI(ctx, deptID)
	if err != nil {
		return nil, err
	}
	if k == nil {
		return nil, httperr.NotFound("Department KPI metrics not found")
	}
	return k, nil
}

func (s *service) GetInstituteKPI(ctx context.Context, instID string) (*InstituteKPI, error) {
	k, err := s.repo.GetInstituteKPI(ctx, instID)
	if err != nil {
		return nil, err
	}
	if k == nil {
		return nil, httperr.NotFound("Institute KPI metrics not found")
	}
	return k, nil
}

func (s *service) RefreshKPIs(ctx context.Context) error {
	return s.repo.RefreshMaterializedViews(ctx)
}

func (s *service) GetLegacyCounts(ctx context.Context, deptID string) (*LegacyCountsResponse, error) {
	return s.repo.GetLegacyCounts(ctx, deptID)
}

func (s *service) GetLegacyAnalytics(ctx context.Context, deptID, facultyName, facultyCode string) (*LegacyAnalyticsResponse, error) {
	return s.repo.GetLegacyAnalytics(ctx, deptID, facultyName, facultyCode)
}

func (s *service) GetFacultyResumeData(ctx context.Context, facultyIDOrCode string) (*FacultyResumeData, error) {
	res, err := s.repo.GetFacultyResumeData(ctx, facultyIDOrCode)
	if err != nil {
		return nil, err
	}
	if res == nil {
		return nil, httperr.NotFound("Faculty not found for resume generation")
	}
	return res, nil
}

func (s *service) GetDepartmentAnnualReportData(ctx context.Context, deptID string, startYear, endYear int) (*DepartmentAnnualReportData, error) {
	return s.repo.GetDepartmentAnnualReportData(ctx, deptID, startYear, endYear)
}
