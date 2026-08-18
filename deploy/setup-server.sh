#!/usr/bin/env bash

# ==============================================================================
# Institute Portal - Server Provisioning & Initial Setup Script
# Works on: Ubuntu 20.04+, Ubuntu 22.04+, Ubuntu 24.04+, Debian 11/12
# Run as root or with sudo: bash setup-server.sh
# ==============================================================================

set -euo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}  🏛️  NIT Hamirpur Portal - Automated Server Setup Script       ${NC}"
echo -e "${BLUE}================================================================${NC}"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${RED}Error: This script must be run as root or with sudo.${NC}"
    exit 1
fi

DEPLOY_USER="${SUDO_USER:-$USER}"
DEPLOY_DIR="/var/www/institute-portal"

echo -e "\n${YELLOW}[1/5] Updating system packages...${NC}"
apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git ufw lsof ca-certificates gnupg lsb-release

echo -e "\n${YELLOW}[2/5] Installing Docker and Docker Compose plugin...${NC}"
if ! command -v docker &> /dev/null; then
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
    
    UBUNTU_CODENAME="$(lsb_release -cs || echo 'jammy')"
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME} stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✓ Docker installed successfully.${NC}"
else
    echo -e "${GREEN}✓ Docker is already installed.${NC}"
fi

echo -e "\n${YELLOW}[3/5] Configuring user permissions for Docker...${NC}"
usermod -aG docker "$DEPLOY_USER" || true

echo -e "\n${YELLOW}[4/5] Setting up deployment directory ($DEPLOY_DIR)...${NC}"
mkdir -p "$DEPLOY_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"

echo -e "\n${YELLOW}[5/5] Configuring firewall (UFW)...${NC}"
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw --force enable || true

echo -e "\n${GREEN}================================================================${NC}"
echo -e "${GREEN}  ✨ Server Setup Completed Successfully!                       ${NC}"
echo -e "${BLUE}================================================================${NC}"
echo -e "  • Deploy Directory: ${GREEN}${DEPLOY_DIR}${NC}"
echo -e "  • Deploy User:      ${GREEN}${DEPLOY_USER}${NC}"
echo -e "  • Docker Status:    ${GREEN}$(docker --version)${NC}"
echo -e "  • Compose Status:   ${GREEN}$(docker compose version)${NC}"
echo -e "\n${YELLOW}NOTE: If you logged in as non-root, log out and log back in for Docker group changes to take effect.${NC}\n"
