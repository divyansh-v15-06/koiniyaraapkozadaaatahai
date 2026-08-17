package httperr

import "net/http"

type AppError struct {
	StatusCode int      `json:"-"`
	Code       string   `json:"code"`
	Message    string   `json:"message"`
	Details    []string `json:"details,omitempty"`
}

func (e *AppError) Error() string {
	return e.Message
}

func New(statusCode int, code, message string, details ...string) *AppError {
	return &AppError{
		StatusCode: statusCode,
		Code:       code,
		Message:    message,
		Details:    details,
	}
}

func BadRequest(message string, details ...string) *AppError {
	return New(http.StatusBadRequest, "BAD_REQUEST", message, details...)
}

func Unauthorized(message string, details ...string) *AppError {
	return New(http.StatusUnauthorized, "UNAUTHORIZED", message, details...)
}

func Forbidden(message string, details ...string) *AppError {
	return New(http.StatusForbidden, "FORBIDDEN", message, details...)
}

func NotFound(message string, details ...string) *AppError {
	return New(http.StatusNotFound, "NOT_FOUND", message, details...)
}

func Conflict(message string, details ...string) *AppError {
	return New(http.StatusConflict, "RESOURCE_CONFLICT", message, details...)
}

func Internal(message string, details ...string) *AppError {
	return New(http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", message, details...)
}
