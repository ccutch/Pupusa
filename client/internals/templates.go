package internals

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"io"
	"strings"

	"github.com/pkg/errors"
)

var (
	//go:embed all:templates
	templateFiles embed.FS

	// Parse HTML files with funcs
	t, err = template.New("").
		Funcs(template.FuncMap{
			"inc": func(n int) int { return n + 1 },
			"dec": func(n int) int { return n - 1 },
		}).
		ParseFS(templateFiles, "templates/*.html")

	// Create ready to use Templates
	templates = template.Must(t, err)
)

func (*Context) Render(name string, props any) (string, error) {
	var buf bytes.Buffer
	err := WriteTemplate(&buf, name, props)
	return buf.String(), errors.Wrap(err, "Failed to render")
}

func WriteTemplate(w io.Writer, name string, data any) error {
	var buf bytes.Buffer
	if err := templates.ExecuteTemplate(&buf, name, data); err != nil {
		return errors.Wrap(err, "failed to execute template")
	}
	_, err := fmt.Fprint(w, strings.ReplaceAll(buf.String(), "\n", ""))
	return errors.Wrap(err, "failed to write result string")
}
