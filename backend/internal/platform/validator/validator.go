package validator

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/institute-portal/backend/internal/platform/httperr"
)

var validate = validator.New()

func Validate(val any) error {
	err := validate.Struct(val)
	if err == nil {
		return nil
	}

	var details []string
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, fieldErr := range validationErrors {
			details = append(details, fmt.Sprintf("Field '%s' failed validation on rule '%s'", fieldErr.Field(), fieldErr.Tag()))
		}
		return httperr.BadRequest(strings.Join(details, "; "), details...)
	}

	return httperr.BadRequest("Validation failed: " + err.Error())
}
