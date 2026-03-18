#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Oracle Cloud Instance Bootstrap Script
# Run this on a fresh Ubuntu 22.04+ instance:
#   ssh ubuntu@<YOUR_IP> 'bash -s' < deploy.sh
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

echo "==> Configuring firewall (iptables)..."
# Oracle Linux uses iptables by default — open HTTP/HTTPS
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 7 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || sudo sh -c "iptables-save > /etc/iptables/rules.v4" 2>/dev/null || true

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
