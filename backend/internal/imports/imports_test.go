package imports_test

import (
	"testing"

	"github.com/institute-portal/backend/internal/imports"
)

func TestCleanEmail(t *testing.T) {
	cases := []struct {
		input    string
		expected string
	}{
		{"name[at]nith[dot]ac[dot]in", "name@nith.ac.in"},
		{"  john.doe[at]nith[dot]ac[dot]in  ", "john.doe@nith.ac.in"},
		{"admin@nith.ac.in", "admin@nith.ac.in"},
	}

	for _, c := range cases {
		res := imports.CleanEmail(c.input)
		if res != c.expected {
			t.Errorf("CleanEmail(%q) = %q; want %q", c.input, res, c.expected)
		}
	}
}

func TestCleanDOI(t *testing.T) {
	cases := []struct {
		input    string
		expected *string
	}{
		{"", nil},
		{"NA", nil},
		{"-", nil},
		{"https://doi.org/10.1007/s12345-021-00123-x", strPtr("10.1007/s12345-021-00123-x")},
		{"doi:10.1109/TPAMI.2023.1234567", strPtr("10.1109/tpami.2023.1234567")},
		{" 10.1016/j.neucom.2022.01.001 ", strPtr("10.1016/j.neucom.2022.01.001")},
	}

	for _, c := range cases {
		res := imports.CleanDOI(c.input)
		if (res == nil && c.expected != nil) || (res != nil && c.expected == nil) {
			t.Errorf("CleanDOI(%q) mismatch; got %v, want %v", c.input, res, c.expected)
		} else if res != nil && c.expected != nil && *res != *c.expected {
			t.Errorf("CleanDOI(%q) = %q; want %q", c.input, *res, *c.expected)
		}
	}
}

func TestParseLegacyDate(t *testing.T) {
	if d := imports.ParseLegacyDate("2023-08-15"); d == nil || d.Year() != 2023 {
		t.Errorf("expected 2023-08-15 to parse correctly")
	}
	if d := imports.ParseLegacyDate("15/08/2023"); d == nil || d.Year() != 2023 || d.Month() != 8 || d.Day() != 15 {
		t.Errorf("expected 15/08/2023 to parse correctly")
	}
	if d := imports.ParseLegacyDate("Present"); d != nil {
		t.Errorf("expected Present to parse to nil")
	}
}

func strPtr(s string) *string {
	return &s
}
