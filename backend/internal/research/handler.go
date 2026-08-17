package research

import (
	"encoding/json"
	"net/http"
	"strconv"

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
	// Publications
	r.Route("/api/v1/publications", func(r chi.Router) {
		r.Get("/", h.ListPublications)
		r.Get("/{id}", h.GetPublication)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreatePublication)
			r.Post("/{id}/submit", h.SubmitPublication)
			r.Post("/{id}/reviews", h.ReviewPublication)
		})
	})

	// Patents
	r.Route("/api/v1/patents", func(r chi.Router) {
		r.Get("/", h.ListPatents)
		r.Get("/{id}", h.GetPatent)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreatePatent)
			r.Post("/{id}/submit", h.SubmitPatent)
			r.Post("/{id}/reviews", h.ReviewPatent)
		})
	})

	// Projects
	r.Route("/api/v1/projects", func(r chi.Router) {
		r.Get("/", h.ListProjects)
		r.Get("/{id}", h.GetProject)
		r.Get("/{id}/grants", h.ListGrants)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateProject)
			r.Post("/{id}/grants", h.CreateGrant)
		})
	})

	// Consultancies
	r.Route("/api/v1/consultancies", func(r chi.Router) {
		r.Get("/", h.ListConsultancies)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateConsultancy)
		})
	})

	// Supervisions
	r.Route("/api/v1/supervisions", func(r chi.Router) {
		r.Get("/", h.ListSupervisions)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateSupervision)
		})
	})

	// Events
	r.Route("/api/v1/events", func(r chi.Router) {
		r.Get("/", h.ListEvents)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateEvent)
		})
	})

	// Courses
	r.Route("/api/v1/courses", func(r chi.Router) {
		r.Get("/", h.ListCourses)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware)
			r.Post("/", h.CreateCourse)
		})
	})
}

// ----------------------------------------------------------------------------
// PUBLICATIONS HANDLERS
// ----------------------------------------------------------------------------

func (h *Handler) ListPublications(w http.ResponseWriter, r *http.Request) {
	typeFilter := r.URL.Query().Get("type")
	deptID := r.URL.Query().Get("department_id")
	facultyID := r.URL.Query().Get("faculty_id")
	status := r.URL.Query().Get("status")
	indexing := r.URL.Query().Get("indexing")
	search := r.URL.Query().Get("query")

	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	limit := 50
	if lStr := r.URL.Query().Get("limit"); lStr != "" {
		if l, err := strconv.Atoi(lStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	offset := 0
	if oStr := r.URL.Query().Get("offset"); oStr != "" {
		if o, err := strconv.Atoi(oStr); err == nil && o >= 0 {
			offset = o
		}
	}

	list, err := h.service.ListPublications(r.Context(), typeFilter, deptID, facultyID, year, status, indexing, search, limit, offset)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) GetPublication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	p, err := h.service.GetPublication(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, p)
}

func (h *Handler) CreatePublication(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreatePublicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	p, err := h.service.CreatePublication(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, p)
}

func (h *Handler) SubmitPublication(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.SubmitPublication(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Publication submitted for review successfully"})
}

func (h *Handler) ReviewPublication(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if !authUser.HasRole("INSTITUTE_ADMIN", "RESEARCH_OFFICE", "DEPARTMENT_ADMIN", "REVIEWER") {
		response.Error(w, r, httperr.Forbidden("Only designated reviewers or administrators can review publications"))
		return
	}

	id := chi.URLParam(r, "id")
	var req ReviewDecisionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	if err := h.service.ReviewPublication(r.Context(), id, authUser.UserID, &req); err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Review decision recorded successfully"})
}

// ----------------------------------------------------------------------------
// PATENTS HANDLERS
// ----------------------------------------------------------------------------

func (h *Handler) ListPatents(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	deptID := r.URL.Query().Get("department_id")
	facultyID := r.URL.Query().Get("faculty_id")
	search := r.URL.Query().Get("query")

	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	limit := 50
	offset := 0
	list, err := h.service.ListPatents(r.Context(), status, deptID, facultyID, year, search, limit, offset)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) GetPatent(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	p, err := h.service.GetPatent(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, p)
}

func (h *Handler) CreatePatent(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreatePatentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	p, err := h.service.CreatePatent(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, p)
}

func (h *Handler) SubmitPatent(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.service.SubmitPatent(r.Context(), id); err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, map[string]string{"message": "Patent submitted for review successfully"})
}

func (h *Handler) ReviewPatent(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	if !authUser.HasRole("INSTITUTE_ADMIN", "RESEARCH_OFFICE", "DEPARTMENT_ADMIN", "REVIEWER") {
		response.Error(w, r, httperr.Forbidden("Only designated reviewers or administrators can review patents"))
		return
	}

	id := chi.URLParam(r, "id")
	var req ReviewDecisionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	if err := h.service.ReviewPatent(r.Context(), id, authUser.UserID, &req); err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Review decision recorded successfully"})
}

// ----------------------------------------------------------------------------
// PROJECTS & GRANTS HANDLERS
// ----------------------------------------------------------------------------

func (h *Handler) ListProjects(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	deptID := r.URL.Query().Get("department_id")
	facultyID := r.URL.Query().Get("faculty_id")
	search := r.URL.Query().Get("query")

	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	limit := 50
	offset := 0
	list, err := h.service.ListProjects(r.Context(), status, deptID, facultyID, year, search, limit, offset)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) GetProject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	p, err := h.service.GetProject(r.Context(), id)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, p)
}

func (h *Handler) CreateProject(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	p, err := h.service.CreateProject(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, p)
}

func (h *Handler) CreateGrant(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "id")
	var req CreateGrantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	g, err := h.service.CreateGrant(r.Context(), projectID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, g)
}

func (h *Handler) ListGrants(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "id")
	list, err := h.service.ListGrants(r.Context(), projectID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

// ----------------------------------------------------------------------------
// CONSULTANCIES, SUPERVISIONS, EVENTS, COURSES
// ----------------------------------------------------------------------------

func (h *Handler) ListConsultancies(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	facultyID := r.URL.Query().Get("faculty_id")
	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	list, err := h.service.ListConsultancies(r.Context(), deptID, facultyID, year)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateConsultancy(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreateConsultancyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	c, err := h.service.CreateConsultancy(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, c)
}

func (h *Handler) ListSupervisions(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	facultyID := r.URL.Query().Get("faculty_id")
	status := r.URL.Query().Get("status")
	level := r.URL.Query().Get("level")

	list, err := h.service.ListSupervisions(r.Context(), deptID, facultyID, status, level)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateSupervision(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreateSupervisionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	s, err := h.service.CreateSupervision(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, s)
}

func (h *Handler) ListEvents(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	facultyID := r.URL.Query().Get("faculty_id")
	eventType := r.URL.Query().Get("type")
	var year *int
	if yStr := r.URL.Query().Get("year"); yStr != "" {
		if y, err := strconv.Atoi(yStr); err == nil {
			year = &y
		}
	}

	list, err := h.service.ListEvents(r.Context(), deptID, facultyID, eventType, year)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	authUser := middleware.GetAuthUser(r.Context())
	var req CreateEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	e, err := h.service.CreateEvent(r.Context(), authUser.UserID, &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, e)
}

func (h *Handler) ListCourses(w http.ResponseWriter, r *http.Request) {
	deptID := r.URL.Query().Get("department_id")
	programmeID := r.URL.Query().Get("programme_id")

	list, err := h.service.ListCourses(r.Context(), deptID, programmeID)
	if err != nil {
		response.Error(w, r, err)
		return
	}
	response.JSON(w, http.StatusOK, list)
}

func (h *Handler) CreateCourse(w http.ResponseWriter, r *http.Request) {
	var req CreateCourseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, r, httperr.BadRequest("Invalid JSON body"))
		return
	}

	if err := validator.Validate(req); err != nil {
		response.Error(w, r, err)
		return
	}

	c, err := h.service.CreateCourse(r.Context(), &req)
	if err != nil {
		response.Error(w, r, err)
		return
	}

	response.JSON(w, http.StatusCreated, c)
}
