package imports

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
	r.Route("/api/v1/imports", func(r chi.Router) {
		r.Use(authMiddleware)
		r.Use(middleware.RequireRoles("INSTITUTE_ADMIN", "DEPARTMENT_ADMIN"))

		r.Post("/job", h.CreateImportJob)
		r.Get("/job/{id}", h.GetImportJob)
		r.Get("/job/{id}/errors", h.ListImportErrors)
	})
}

func (h *Handler) CreateImportJob(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req RunImportRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	job, err := h.service.CreateJob(r.Context(), req.DepartmentID, req.SourceType, authUser.UserID)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusAccepted, job)
}

func (h *Handler) GetImportJob(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	job, err := h.service.GetJob(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	if job == nil {
		response.Error(w, r, httperr.NotFound("Import job not found"))
		return
	}
	response.JSON(w, http.StatusOK, job)
}

func (h *Handler) ListImportErrors(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	errorsList, err := h.service.ListErrors(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, errorsList)
}
