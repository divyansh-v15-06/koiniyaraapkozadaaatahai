package response

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/institute-portal/backend/internal/platform/httperr"
	"github.com/institute-portal/backend/internal/platform/logger"
)

type SuccessEnvelope struct {
	Success bool `json:"success"`
	Data    any  `json:"data"`
	Meta    any  `json:"meta,omitempty"`
}

type ErrorEnvelope struct {
	Success bool             `json:"success"`
	Error   *httperr.AppError `json:"error"`
}

func JSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(SuccessEnvelope{
		Success: true,
		Data:    data,
	})
}

func JSONWithMeta(w http.ResponseWriter, statusCode int, data any, meta any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(SuccessEnvelope{
		Success: true,
		Data:    data,
		Meta:    meta,
	})
}

func Error(w http.ResponseWriter, r *http.Request, err error) {
	var appErr *httperr.AppError
	if errors.As(err, &appErr) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(appErr.StatusCode)
		_ = json.NewEncoder(w).Encode(ErrorEnvelope{
			Success: false,
			Error:   appErr,
		})
		return
	}

	log := logger.FromContext(r.Context())
	log.Error("Unhandled internal error", "error", err)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusInternalServerError)
	_ = json.NewEncoder(w).Encode(ErrorEnvelope{
		Success: false,
		Error:   httperr.Internal("An unexpected error occurred. Please try again later."),
	})
}
