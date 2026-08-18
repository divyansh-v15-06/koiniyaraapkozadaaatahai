#!/usr/bin/env bash

# ==============================================================================
# NIT Hamirpur Unified Portal - One-Command Development Launcher
# Starts Docker Containers (Postgres + Redis), Go Backend API, and Next.js Frontend
# ==============================================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}  🏛️  NIT Hamirpur Multi-Department Portal Launcher   ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Check & Start Docker Services (PostgreSQL + Redis)
echo -e "\n${YELLOW}[1/3] Checking Docker Containers (PostgreSQL & Redis)...${NC}"
if command -v docker &> /dev/null; then
    if ! docker info &> /dev/null; then
        echo -e "${RED}⚠️ Docker is not running. Please start Docker Desktop and re-run this script.${NC}"
    else
        cd "$BACKEND_DIR"
        docker compose up -d
        echo -e "${GREEN}✓ Docker containers are up and running.${NC}"
    fi
else
    echo -e "${RED}⚠️ Docker CLI not found. Please ensure PostgreSQL is running on port 5432.${NC}"
fi

# 2. Function to kill child processes on exit (Ctrl+C)
cleanup() {
    echo -e "\n\n${YELLOW}🛑 Shutting down backend and frontend servers...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    # Also kill any orphaned processes on port 8080 and 3000
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ All services stopped cleanly. Good day!${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Kill any existing processes on port 8080 or 3000 before starting
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 3. Start Go Backend API
echo -e "\n${YELLOW}[2/3] Starting Go Backend API (http://localhost:8080)...${NC}"
cd "$BACKEND_DIR"
go run cmd/api/main.go &
BACKEND_PID=$!

# Wait for backend health
sleep 2

# 4. Start Next.js Frontend
echo -e "\n${YELLOW}[3/3] Starting Next.js Frontend (http://localhost:3000)...${NC}"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}======================================================${NC}"
echo -e "${GREEN}  🚀 Both Services are Live & Running!               ${NC}"
echo -e "${BLUE}  • Public Portal:    ${GREEN}http://localhost:3000${NC}"
echo -e "${BLUE}  • Faculty Portal:   ${GREEN}http://localhost:3000/faculty/login${NC}"
echo -e "${BLUE}  • Admin Portal:     ${GREEN}http://localhost:3000/admin/login${NC}"
echo -e "${BLUE}  • Go Backend API:   ${GREEN}http://localhost:8080/health${NC}"
echo -e "${YELLOW}  Press [Ctrl+C] anytime to stop all servers.         ${NC}"
echo -e "${GREEN}======================================================${NC}\n"

# Wait for background processes
wait "$BACKEND_PID" "$FRONTEND_PID"
