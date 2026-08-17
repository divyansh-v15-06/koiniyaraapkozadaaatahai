package organisation

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/middleware"
	"github.com/institute-portal/backend/internal/platform/response"
	"github.com/institute-portal/backend/internal/platform/validator"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(r chi.Router, authMiddleware func(http.Handler) http.Handler) {
	r.Route("/api/v1/institutions", func(r chi.Router) {
		r.Get("/", h.ListInstitutions)
		r.Get("/{id}", h.GetInstitution)
	})

	r.Route("/api/v1/departments", func(r chi.Router) {
		r.Get("/", h.ListDepartments)
		r.Get("/{idOrSlug}", h.GetDepartment)
		r.Get("/{departmentId}/programmes", h.ListProgrammes)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Use(middleware.RequireDepartmentScope)
			r.Post("/{departmentId}/programmes", h.CreateProgramme)
		})
	})

	r.Route("/api/v1/academic-years", func(r chi.Router) {
		r.Get("/", h.ListAcademicYears)
	})

	r.Route("/api/v1/financial-years", func(r chi.Router) {
		r.Get("/", h.ListFinancialYears)
	})
}

func (h *Handler) ListInstitutions(w http.ResponseWriter, r *http.Request) {
	list, err := h.service.ListInstitutions(r.Context())
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) GetInstitution(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	inst, err := h.service.GetInstitution(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, inst)
}

func (h *Handler) ListDepartments(w http.ResponseWriter, r *http.Request) {
	instID := r.URL.Query().Get("institution_id")
	list, err := h.service.ListDepartments(r.Context(), instID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) GetDepartment(w http.ResponseWriter, r *http.Request) {
	idOrSlug := chi.URLParam(r, "idOrSlug")
	dept, err := h.service.GetDepartment(r.Context(), idOrSlug)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, dept)
}

func (h *Handler) ListProgrammes(w http.ResponseWriter, r *http.Request) {
	deptID := chi.URLParam(r, "departmentId")
	list, err := h.service.ListProgrammes(r.Context(), deptID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateProgramme(w http.ResponseWriter, r *http.Request) {
	deptID := chi.URLParam(r, "departmentId")
	var req CreateProgrammeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	p, err := h.service.CreateProgramme(r.Context(), deptID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, p)
}

func (h *Handler) ListAcademicYears(w http.ResponseWriter, r *http.Request) {
	instID := r.URL.Query().Get("institution_id")
	list, err := h.service.ListAcademicYears(r.Context(), instID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) ListFinancialYears(w http.ResponseWriter, r *http.Request) {
	instID := r.URL.Query().Get("institution_id")
	list, err := h.service.ListFinancialYears(r.Context(), instID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}
