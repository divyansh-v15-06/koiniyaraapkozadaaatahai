.PHONY: dev start stop build migrate deploy

dev:
	@./dev.sh

start:
	@./dev.sh

stop:
	@lsof -ti:8080 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@echo "All services stopped."

build:
	@cd backend && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o api ./cmd/api
	@cd frontend && npm run build

deploy:
	@bash deploy/deploy-local.sh

migrate:
	@python3 backend/scripts/migrate_legacy.py
	@python3 backend/scripts/seed_all_departments.py
	@python3 backend/scripts/extract_faculty_profiles.py
	@echo "All migrations and seeds applied."

