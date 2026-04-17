#!/usr/bin/env bash
set -euo pipefail

# Deploy the current main branch to the Hetzner server.
# Usage: DEPLOY_HOST=root@1.2.3.4 ./redeploy.sh

: "${DEPLOY_HOST:?Set DEPLOY_HOST, e.g. DEPLOY_HOST=root@1.2.3.4}"
REMOTE_DIR="${DEPLOY_DIR:-/opt/ecclesia}"
HEALTH_URL="${HEALTH_URL:-https://ecclesiabasilikos.org/health}"

echo "Deploying to ${DEPLOY_HOST}:${REMOTE_DIR}..."
ssh "$DEPLOY_HOST" bash -s <<EOF
set -euo pipefail
cd "${REMOTE_DIR}"
git fetch --prune origin
git checkout main
git reset --hard origin/main
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
EOF

echo "Waiting for health check at ${HEALTH_URL}..."
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 10 "$HEALTH_URL" > /dev/null; then
    echo "Deploy complete."
    exit 0
  fi
  echo "Attempt $i failed, retrying in 10s..."
  sleep 10
done

echo "Health check failed after deploy." >&2
exit 1
