package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/institute-portal/backend/internal/platform/middleware"
)

func TestAuthUser_HasRole(t *testing.T) {
	u := &middleware.AuthUser{
		UserID: "u1",
		Email:  "admin@nith.ac.in",
		Roles:  []string{"FACULTY", "DEPARTMENT_ADMIN"},
	}

	if !u.HasRole("FACULTY") {
		t.Error("expected user to have FACULTY role")
	}
	if !u.HasRole("DEPARTMENT_ADMIN") {
		t.Error("expected user to have DEPARTMENT_ADMIN role")
	}
	if u.HasRole("INSTITUTE_ADMIN") {
		t.Error("expected user NOT to have INSTITUTE_ADMIN role")
	}
}

func TestAuthUser_HasDepartmentScope(t *testing.T) {
	adminUser := &middleware.AuthUser{
		UserID: "u1",
		Roles:  []string{"INSTITUTE_ADMIN"},
	}
	if !adminUser.HasDepartmentScope("dept-any") {
		t.Error("INSTITUTE_ADMIN should have scope over any department")
	}

	scopedUser := &middleware.AuthUser{
		UserID:           "u2",
		Roles:            []string{"DEPARTMENT_ADMIN"},
		DepartmentScopes: []string{"dept-cse"},
	}
	if !scopedUser.HasDepartmentScope("dept-cse") {
		t.Error("scoped user should have access to dept-cse")
	}
	if scopedUser.HasDepartmentScope("dept-ece") {
		t.Error("scoped user should NOT have access to dept-ece")
	}
}

func TestRequestIDMiddleware(t *testing.T) {
	handler := middleware.RequestID(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))

	req := httptest.NewRequest(http.MethodGet, "/test", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	reqID := rec.Header().Get("X-Request-ID")
	if reqID == "" {
		t.Fatal("expected X-Request-ID header to be set")
	}
}
