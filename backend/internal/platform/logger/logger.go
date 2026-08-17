package logger

import (
	"context"
	"log/slog"
	"os"
)

type ctxKey string

const RequestIDKey ctxKey = "request_id"

var Default *slog.Logger

func Init(env string) *slog.Logger {
	var handler slog.Handler
	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}

	if env == "development" {
		opts.Level = slog.LevelDebug
		handler = slog.NewTextHandler(os.Stdout, opts)
	} else {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	}

	Default = slog.New(handler)
	slog.SetDefault(Default)
	return Default
}

func FromContext(ctx context.Context) *slog.Logger {
	if ctx == nil {
		return Default
	}
	if reqID, ok := ctx.Value(RequestIDKey).(string); ok && reqID != "" {
		return Default.With("request_id", reqID)
	}
	return Default
}
