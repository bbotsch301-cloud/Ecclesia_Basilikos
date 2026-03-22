#!/usr/bin/env bash
set -euo pipefail

# Remote host — update this with your Hetzner Cloud instance IP
REMOTE_HOST="${DEPLOY_HOST:-root@<YOUR_IP>}"
REMOTE_DIR="${DEPLOY_DIR:-/opt/ecclesia}"

echo "Deploying to ${REMOTE_HOST}:${REMOTE_DIR}..."
ssh "$REMOTE_HOST" "cd ${REMOTE_DIR} && git pull && docker compose -f docker-compose.prod.yml up -d --build"
echo "Deploy complete."
