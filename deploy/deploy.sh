#!/usr/bin/env bash

# ==============================================================================
# Institute Portal - Manual/Local Deployment Script
# Run directly on the server to pull and deploy the latest version:
#   cd /var/www/institute-portal && bash deploy/deploy.sh
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}  🚀 Deploying NIT Hamirpur Multi-Department Portal             ${NC}"
echo -e "${BLUE}================================================================${NC}"

# 1. Pull latest git commits if inside a git repository
if [ -d ".git" ]; then
    echo -e "\n${YELLOW}[1/4] Pulling latest code from origin/main...${NC}"
    git fetch origin main
    git reset --hard origin/main
else
    echo -e "\n${YELLOW}[1/4] Non-git environment; using local workspace files...${NC}"
fi

# 2. Check .env configuration
echo -e "\n${YELLOW}[2/4] Checking environment configuration (.env)...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.production.example" ]; then
        echo -e "${YELLOW}Creating default .env from .env.production.example...${NC}"
        cp .env.production.example .env
    else
        echo -e "${RED}Error: No .env or .env.production.example found!${NC}"
        exit 1
    fi
fi

# 3. Build & start containers
echo -e "\n${YELLOW}[3/4] Building and launching production containers...${NC}"
docker compose -f docker-compose.prod.yml down --remove-orphans || true
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

# 4. Verification & Status
echo -e "\n${YELLOW}[4/4] Verifying service health...${NC}"
sleep 8
docker compose -f docker-compose.prod.yml ps

# Cleanup unused images
echo -e "\n${YELLOW}Cleaning up dangling Docker images...${NC}"
docker image prune -f

echo -e "\n${GREEN}================================================================${NC}"
echo -e "${GREEN}  ✅ Deployment Finished! Services are live on Ports 80 / 443   ${NC}"
echo -e "${BLUE}================================================================${NC}\n"
