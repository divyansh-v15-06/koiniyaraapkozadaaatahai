#!/usr/bin/env bash

# ==============================================================================
# Institute Portal - One-Click Local Build & Remote Server Deployment
# Builds backend & frontend locally, uploads package, and restarts containers.
# Usage:
#   bash deploy/deploy-local.sh [SERVER_HOST] [SSH_USER] [SSH_PASS] [PORT]
#   make deploy
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$SCRIPT_DIR"

SERVER_HOST="${1:-${DEPLOY_HOST:-14.139.56.17}}"
SERVER_USER="${2:-${DEPLOY_USER:-web}}"
SERVER_PASS="${3:-${DEPLOY_PASS:-nit#@cc@1234}}"
SERVER_PORT="${4:-${DEPLOY_PORT:-22}}"
DEPLOY_PATH="/var/www/institute-portal"

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}  🚀 One-Click Build & Deploy ➔ ${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}     ${NC}"
echo -e "${BLUE}================================================================${NC}"

# 1. Compile Backend Binary locally
echo -e "\n${YELLOW}[1/4] Compiling Go Backend for Linux (AMD64)...${NC}"
cd backend
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o api ./cmd/api
cd ..
echo -e "${GREEN}✓ Backend binary compiled successfully.${NC}"

# 2. Compile Frontend Standalone Bundle locally
echo -e "\n${YELLOW}[2/4] Building Next.js Standalone Frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend bundle compiled successfully.${NC}"

# 3. Create Deployment Archive
echo -e "\n${YELLOW}[3/4] Packaging deployment archive (deploy.tar.gz)...${NC}"
tar -czf deploy.tar.gz \
  docker-compose.prod.yml \
  .env.production.example \
  nginx \
  backend/api \
  backend/migrations \
  backend/Dockerfile.prod \
  frontend/.dockerignore \
  frontend/.next/standalone \
  frontend/.next/static \
  frontend/public \
  frontend/Dockerfile.prod \
  deploy
echo -e "${GREEN}✓ Package created ($(ls -lh deploy.tar.gz | awk '{print $5}')).${NC}"

# 4. Upload & Execute on Remote Server
echo -e "\n${YELLOW}[4/4] Uploading package & launching production containers on ${SERVER_HOST}...${NC}"
sshpass -p "$SERVER_PASS" scp \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  -o KexAlgorithms=+diffie-hellman-group14-sha1 \
  -O -P "$SERVER_PORT" \
  deploy.tar.gz "$SERVER_USER@$SERVER_HOST:/tmp/deploy.tar.gz"

sshpass -p "$SERVER_PASS" ssh -n \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedKeyTypes=+ssh-rsa \
  -o KexAlgorithms=+diffie-hellman-group14-sha1 \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=10 \
  -p "$SERVER_PORT" \
  "$SERVER_USER@$SERVER_HOST" \
  "mkdir -p $DEPLOY_PATH && \
   tar -xzf /tmp/deploy.tar.gz -C $DEPLOY_PATH && \
   rm -f /tmp/deploy.tar.gz && \
   cd $DEPLOY_PATH && \
   SUDO_PASS='$SERVER_PASS' bash deploy/deploy.sh --prebuilt"

rm -f deploy.tar.gz

echo -e "\n${GREEN}================================================================${NC}"
echo -e "${GREEN}  ✨ Deployment Successfully Completed!                        ${NC}"
echo -e "${BLUE}================================================================${NC}"
echo -e "  🌐 Portal URL:   ${GREEN}http://${SERVER_HOST}${NC}"
echo -e "  🩺 Health API:   ${GREEN}http://${SERVER_HOST}/health${NC}\n"
