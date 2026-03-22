#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Hetzner Cloud Instance Bootstrap Script
# Run this on a fresh Ubuntu 24.04 instance:
#   ssh root@<YOUR_IP> 'bash -s' < deploy.sh
# =============================================================================

echo "==> Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

echo "==> Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Adding current user to docker group..."
sudo usermod -aG docker "$USER"

echo "==> Creating app directory..."
sudo mkdir -p /opt/ecclesia
sudo chown "$USER:$USER" /opt/ecclesia

echo ""
echo "============================================"
echo "  Instance is ready!"
echo ""
echo "  Next steps:"
echo "  1. Copy project files to /opt/ecclesia/"
echo "  2. Create /opt/ecclesia/.env with your secrets"
echo "  3. cd /opt/ecclesia && docker compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "  NOTE: Log out and back in for docker group to take effect,"
echo "  or run: newgrp docker"
echo "============================================"
