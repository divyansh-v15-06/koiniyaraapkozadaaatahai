package reporting

import (
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/institute-portal/backend/internal/platform/middleware"
	"github.com/institute-portal/backend/internal/platform/response"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	// KPIs & Analytics
	r.Route("/api/v1/kpi", func(r chi.Router) {
		r.Get("/institute", h.GetInstituteKPI)
		r.Get("/department/{departmentId}", h.GetDepartmentKPI)
		r.Get("/faculty/{facultyId}", h.GetFacultyKPI)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/refresh", h.RefreshKPIs)
		})
	})

	// Legacy aggregates compatibility
	r.Route("/api/v1/aggregates", func(r chi.Router) {
		r.Get("/count", h.GetLegacyCounts)
		r.Get("/analytics", h.GetLegacyAnalytics)
	})

	// Direct legacy paths mapping
	r.Get("/api/v1/count/get", h.GetLegacyCounts)
	r.Get("/api/v1/analytics/get", h.GetLegacyAnalytics)

	// Document Generators (Resume & Annual Report)
	r.Route("/api/v1/reports", func(r chi.Router) {
		r.Get("/resume/{facultyId}", h.GetFacultyResumeData)
		r.Get("/annual-report", h.GetDepartmentAnnualReportData)
	})

	r.Get("/api/v1/resume/download-resume", h.GetLegacyResumeDownload)
	r.Get("/api/v1/report/download-report", h.GetLegacyReportDownload)
}

func (h *Handler) GetInstituteKPI(w http.ResponseWriter, r *http.Request) {
	instID := r.URL.Query().Get("institution_id")
	k, err := h.service.GetInstituteKPI(r.Context(), instID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, k)
}

func (h *Handler) GetDepartmentKPI(w http.ResponseWriter, r *http.Request) {
	deptID := chi.URLParam(r, "departmentId")
	k, err := h.service.GetDepartmentKPI(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, k)
}

func (h *Handler) GetFacultyKPI(w http.ResponseWriter, r *http.Request) {
	facultyID := chi.URLParam(r, "facultyId")
	k, err := h.service.GetFacultyKPI(r.Context(), facultyID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, k)
}

func (h *Handler) RefreshKPIs(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if !authUser.HasRole("INSTITUTE_ADMIN", "RESEARCH_OFFICE") {
		response.Error(w, r, nil)
		return
	}

	if err := h.service.RefreshKPIs(r.Context()); err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "KPI Materialized views refreshed successfully"})
}

func (h *Handler) GetLegacyCounts(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	counts, err := h.service.GetLegacyCounts(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, counts)
}

func (h *Handler) GetLegacyAnalytics(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	facultyName := r.URL.Query().Get("name")
	facultyCode := r.URL.Query().Get("id")

	analytics, err := h.service.GetLegacyAnalytics(r.Context(), deptID, facultyName, facultyCode)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, analytics)
}

func (h *Handler) GetFacultyResumeData(w http.ResponseWriter, r *http.Request) {
	facultyID := chi.URLParam(r, "facultyId")
	data, err := h.service.GetFacultyResumeData(r.Context(), facultyID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, data)
}

func (h *Handler) GetLegacyResumeDownload(w http.ResponseWriter, r *http.Request) {
	uniqueID := r.URL.Query().Get("uniqueId")
	if uniqueID == "" {
		uniqueID = r.URL.Query().Get("faculty_id")
	}
	data, err := h.service.GetFacultyResumeData(r.Context(), uniqueID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, data)
}

func (h *Handler) GetDepartmentAnnualReportData(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	startYear, _ := strconv.Atoi(r.URL.Query().Get("startYear"))
	endYear, _ := strconv.Atoi(r.URL.Query().Get("endYear"))
	if startYear == 0 {
		startYear = 2020
	}
	if endYear == 0 {
		endYear = 2024
	}

	data, err := h.service.GetDepartmentAnnualReportData(r.Context(), deptID, startYear, endYear)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, data)
}

func (h *Handler) GetLegacyReportDownload(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	startYear, _ := strconv.Atoi(r.URL.Query().Get("startYear"))
	endYear, _ := strconv.Atoi(r.URL.Query().Get("endYear"))
	if startYear == 0 {
		startYear = 2020
	}
	if endYear == 0 {
		endYear = 2024
	}

	data, err := h.service.GetDepartmentAnnualReportData(r.Context(), deptID, startYear, endYear)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, data)
}
