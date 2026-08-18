# 🏛️ NIT Hamirpur Multi-Department Portal

A unified, full-stack institutional web portal and research management platform for National Institute of Technology Hamirpur.

---

## 🏗️ Architecture Stack

- **Backend**: Go 1.23+ (Chi Router, Pgx PostgreSQL connection pool, JWT Authentication, Zerolog)
- **Frontend**: Next.js 14 (React 19, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI)
- **Database**: PostgreSQL 16 (Relational Schema, Materialized Views for KPI analytics)
- **Cache**: Redis 7 (Session caching and performance optimization)
- **Gateway & Proxy**: Nginx 1.25 (Gzip compression, security headers, reverse proxy)
- **CI/CD**: GitHub Actions (Automated testing, building, and SSH-based zero-downtime deployment)

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Go 1.23+](https://golang.org)
- [Node.js 20+](https://nodejs.org)
- [Docker](https://www.docker.com) & Docker Compose

### 1. Launch Everything with One Command
```bash
./start.sh
```
This automatically starts:
- PostgreSQL (`5432`) and Redis (`6379`) via Docker
- Go Backend API at `http://localhost:8080`
- Next.js Frontend at `http://localhost:3000`

### 2. Manual Development Commands

**Backend:**
```bash
cd backend
go run cmd/api/main.go
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 📦 Production Deployment & CI/CD

For detailed deployment instructions, server provisioning scripts, and GitHub Actions SSH configuration, see the [Deployment Guide](file:///home/divyansh/Development/Projects/koiniyaraapkozadaaatahai/deploy/README.md).

### Quick Production Launch with Docker Compose:
```bash
cp .env.production.example .env
docker compose -f docker-compose.prod.yml up -d --build
```