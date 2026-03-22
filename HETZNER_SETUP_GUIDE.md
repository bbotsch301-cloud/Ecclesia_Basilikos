# Hetzner Cloud Setup Guide

Deploy **Ecclesia Basilikos** to a Hetzner Cloud CAX11 ARM instance at `ecclesiabasilikos.org`.

---

## Prerequisites

- A Hetzner Cloud account
- A domain (`ecclesiabasilikos.org`) with DNS access
- Your Neon PostgreSQL `DATABASE_URL`
- SSH key pair on your local machine (`~/.ssh/id_rsa.pub`)

---

## 1. Create a Hetzner Cloud Account

1. Sign up at [https://console.hetzner.cloud](https://console.hetzner.cloud)
2. Create a new project (e.g., "Ecclesia")

## 2. Create a CAX11 ARM Server

1. In your project, click **Add Server**
2. Configure:
   - **Location**: Ashburn (`ash`) — best latency for US-based users
   - **Image**: Ubuntu 24.04
   - **Type**: CAX11 (Arm64, 2 vCPU, 4 GB RAM, 40 GB disk)
   - **SSH key**: Click "Add SSH Key" and paste your `~/.ssh/id_rsa.pub`
   - **Name**: `ecclesia-prod`
3. Click **Create & Buy Now**
4. Copy the **IP address** from the server list

> **Firewall (optional):** Hetzner doesn't block ports by default. If you want an extra layer, go to **Firewalls** in the Hetzner Console and create a firewall allowing inbound TCP ports 22, 80, and 443, then attach it to your server.

## 3. Point DNS to the Server

At your domain registrar (or DNS provider), create:

| Type | Name                        | Value         | TTL |
|------|-----------------------------|---------------|-----|
| A    | `ecclesiabasilikos.org`     | `<YOUR_IP>`   | 300 |
| A    | `www.ecclesiabasilikos.org` | `<YOUR_IP>`   | 300 |

Verify propagation:
```bash
dig +short ecclesiabasilikos.org
# Should return your Hetzner server IP
```

> Caddy needs DNS to be resolvable before it can provision the TLS certificate. Do this step before deploying.

## 4. Bootstrap the Server

Run the included bootstrap script from your **local machine**:

```bash
ssh root@<YOUR_IP> 'bash -s' < deploy.sh
```

This installs Docker and creates `/opt/ecclesia`.

After it finishes, **log out and back in** (or run `newgrp docker`) so the docker group takes effect:

```bash
ssh root@<YOUR_IP>
docker --version   # Verify docker works
```

## 5. Clone the Repository

On the server:

```bash
cd /opt/ecclesia

# Option A: Clone via HTTPS
git clone https://github.com/<YOUR_ORG>/ecclesia-basilikos.git .

# Option B: If the repo is private, set up a deploy key first
#   ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
#   cat ~/.ssh/deploy_key.pub  # Add this to GitHub > Repo > Settings > Deploy keys
#   GIT_SSH_COMMAND="ssh -i ~/.ssh/deploy_key" git clone git@github.com:<YOUR_ORG>/ecclesia-basilikos.git .
```

## 6. Create the .env File

```bash
nano /opt/ecclesia/.env
```

Paste and fill in your values:

```env
# --- Required ---
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/dbname?sslmode=require
SESSION_SECRET=<generate with: openssl rand -hex 32>
BASE_URL=https://ecclesiabasilikos.org

# --- Email ---
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# --- File Storage (Docker volume mounted at /data) ---
PUBLIC_OBJECT_SEARCH_PATHS=/data/public
PRIVATE_OBJECT_DIR=/data/private

# --- Square Payments (optional) ---
# SQUARE_ACCESS_TOKEN=EAAAl...
# SQUARE_LOCATION_ID=L...
# SQUARE_WEBHOOK_SIGNATURE_KEY=...
# SQUARE_ENVIRONMENT=production

# --- AI Features (optional) ---
# ANTHROPIC_API_KEY=sk-ant-...
```

## 7. Build and Launch

```bash
cd /opt/ecclesia
docker compose -f docker-compose.prod.yml up -d --build
```

First build takes a few minutes on ARM. Watch the logs:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

You should see:
- `ecclesia-app` pass its health check
- `ecclesia-caddy` obtain a TLS certificate from Let's Encrypt

## 8. Verify

```bash
# From the server
curl -f http://localhost:5000/health    # => {"status":"ok"}
curl -f http://localhost:5000/ready     # => {"ready":true}

# From your local machine (once DNS propagates)
curl -I https://ecclesiabasilikos.org   # => HTTP/2 200, with security headers
```

Visit `https://ecclesiabasilikos.org` in your browser. You should see the app with a valid TLS certificate.

## 9. Run Database Migrations

If this is the first deploy and you need to push the schema to your Neon database:

```bash
# Run drizzle-kit push from inside the container
docker compose -f docker-compose.prod.yml exec app npx drizzle-kit push
```

Or from your local machine (if you have `DATABASE_URL` set locally):

```bash
npm run db:push
```

---

## Operations

### Redeploy After Code Changes

From your local machine:

```bash
# Quick redeploy (uses redeploy.sh)
DEPLOY_HOST=root@<YOUR_IP> ./redeploy.sh

# Or manually
ssh root@<YOUR_IP>
cd /opt/ecclesia
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Just the app
docker compose -f docker-compose.prod.yml logs -f app

# Just Caddy
docker compose -f docker-compose.prod.yml logs -f caddy
```

### Restart Services

```bash
docker compose -f docker-compose.prod.yml restart app
```

### Check Disk Usage

```bash
# Docker volumes
docker system df

# App data volume
docker volume inspect ecclesia_app_data
```

### Backup App Data

```bash
# Backup the /data volume to a tarball
docker run --rm -v ecclesia_app_data:/data -v /tmp:/backup alpine \
  tar czf /backup/app-data-$(date +%Y%m%d).tar.gz -C /data .

# Download locally
scp root@<YOUR_IP>:/tmp/app-data-*.tar.gz ./backups/
```

### Restore App Data

```bash
scp ./backups/app-data-20260321.tar.gz root@<YOUR_IP>:/tmp/

docker compose -f docker-compose.prod.yml down
docker run --rm -v ecclesia_app_data:/data -v /tmp:/backup alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/app-data-20260321.tar.gz -C /data"
docker compose -f docker-compose.prod.yml up -d
```

### Renew TLS Certificate

Caddy handles this automatically. Certificates renew ~30 days before expiry. No action needed.

### Update System Packages

```bash
ssh root@<YOUR_IP>
apt-get update && apt-get upgrade -y
reboot   # If kernel was updated

# Containers auto-restart (restart: unless-stopped)
```

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Site unreachable | Is the server running? Check Hetzner Console. If using a Hetzner Firewall, ensure ports 80/443 are allowed. |
| Caddy "TLS handshake error" | DNS not pointed yet. Run `dig +short ecclesiabasilikos.org` — must return the server IP. |
| App container keeps restarting | `docker logs ecclesia-app` — likely missing env vars or DATABASE_URL unreachable. |
| "PRIVATE_OBJECT_DIR not set" | Ensure `.env` has `PRIVATE_OBJECT_DIR=/data/private`. |
| Upload fails | Check the `/data/private/uploads` dir exists inside the container: `docker exec ecclesia-app ls -la /data/private/uploads` |
| Out of disk space | CAX11 has 40 GB. Check usage with `df -h` and `docker system df`. Prune old images with `docker image prune -a`. |
| Slow first build | ARM builds are slower. Subsequent builds use Docker layer cache and are faster. |

---

## Architecture Overview

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │ Hetzner Cloud  │
              │ CAX11 (ARM)    │
              │ Ashburn (ash)  │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │  Caddy (443)   │  ← Auto TLS via Let's Encrypt
              │  ecclesia-caddy│
              └───────┬────────┘
                      │ reverse_proxy
              ┌───────▼────────┐
              │  Node.js (5000)│
              │  ecclesia-app  │
              └───────┬────────┘
                      │
          ┌───────────┼───────────┐
          ▼                       ▼
   ┌─────────────┐       ┌──────────────┐
   │ Neon Postgres│       │ Docker Volume │
   │ (external)   │       │ /data (files) │
   └─────────────┘       └──────────────┘
```

## Cost

| Resource | Spec | Cost |
|----------|------|------|
| Hetzner CAX11 | 2 vCPU ARM, 4 GB RAM, 40 GB disk | ~€3.79/mo |
| Neon Postgres | Free tier | $0 |
| Let's Encrypt TLS | Free | $0 |
| Domain name | varies | ~$10-15/yr |

**Total: ~€3.79/mo + domain**
