.PHONY: dev start stop build migrate

dev:
	@./dev.sh

start:
	@./dev.sh

stop:
	@lsof -ti:8080 | xargs kill -9 2>/dev/null || true
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@echo "All services stopped."

build:
	@cd frontend && npm run build

migrate:
	@python3 backend/scripts/migrate_legacy.py
	@python3 backend/scripts/seed_all_departments.py
	@python3 backend/scripts/extract_faculty_profiles.py
	@echo "All migrations and seeds applied."
