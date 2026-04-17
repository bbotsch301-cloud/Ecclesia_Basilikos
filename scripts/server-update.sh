#!/usr/bin/env bash
set -euo pipefail

# Weekly OS + Docker maintenance for the Hetzner host.
# Install to run every Sunday at 04:00 UTC:
#   sudo cp /opt/ecclesia/scripts/server-update.sh /usr/local/sbin/ecclesia-server-update
#   sudo chmod +x /usr/local/sbin/ecclesia-server-update
#   echo '0 4 * * 0 root /usr/local/sbin/ecclesia-server-update >> /var/log/ecclesia-update.log 2>&1' \
#     | sudo tee /etc/cron.d/ecclesia-server-update

LOG_PREFIX="[$(date -u +'%Y-%m-%dT%H:%M:%SZ')]"
log() { echo "$LOG_PREFIX $*"; }

log "Updating apt package index..."
DEBIAN_FRONTEND=noninteractive apt-get update

log "Upgrading packages..."
DEBIAN_FRONTEND=noninteractive apt-get -y \
  -o Dpkg::Options::="--force-confdef" \
  -o Dpkg::Options::="--force-confold" \
  upgrade

log "Removing unused packages..."
DEBIAN_FRONTEND=noninteractive apt-get -y autoremove --purge
DEBIAN_FRONTEND=noninteractive apt-get -y autoclean

log "Pruning unused Docker images..."
docker image prune -af --filter "until=168h"

log "Pruning unused Docker build cache..."
docker builder prune -af --filter "until=168h"

if [ -f /var/run/reboot-required ]; then
  log "Reboot required — scheduling reboot in 1 minute."
  shutdown -r +1 "Post-update reboot scheduled by ecclesia-server-update"
fi

log "Maintenance complete."
