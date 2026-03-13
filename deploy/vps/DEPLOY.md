# Deploy on Any VPS (SurferCloud / DigitalOcean / Hetzner / etc.)

> Tested on Ubuntu 24.04 LTS — 2 vCPU / 4 GB RAM.
> Recommended minimum: 2 CPU, 2 GB RAM.

---

## Step 0 — Build and push your Docker image (from your local machine)

```bash
IMAGE_NAME=youruser/p2pme-notifiers TAG=v0.1.0 ./build_and_push.sh
```

Then update the `image:` line in `deploy/vps/docker-compose.yml` to match.

---

## Step 1 — SSH into your server

```bash
ssh ubuntu@YOUR_SERVER_IP
```

---

## Step 2 — Install Docker (run once on a fresh server)

```bash
nano /home/ubuntu/install_docker.sh
# Paste contents of deploy/vps/install_docker.sh
# Save: Ctrl+O  Enter  Ctrl+X

bash /home/ubuntu/install_docker.sh
newgrp docker

# Verify
docker --version
docker compose version
```

---

## Step 3 — Create the notifiers folder and files

```bash
mkdir -p /home/ubuntu/notifiers
```

**docker-compose.yml:**

```bash
nano /home/ubuntu/notifiers/docker-compose.yml
# Paste contents of deploy/vps/docker-compose.yml
# Update the image: line to your pushed image
# Save: Ctrl+O  Enter  Ctrl+X
```

**.env:**

```bash
nano /home/ubuntu/notifiers/.env
# Paste contents of deploy/vps/.env.example, then fill in all values
# Save: Ctrl+O  Enter  Ctrl+X
```

---

## Step 4 — Pull image and start

```bash
cd /home/ubuntu/notifiers
docker compose pull
docker compose up -d
```

---

## Step 5 — Verify

```bash
# Both containers should be running
docker compose ps

# Watch logs
docker compose logs -f notifiers

# Health check
curl http://localhost:8000/healthz
```

You should see the WebSocket listener connected and schedulers started.

---

## Common commands

| Action | Command |
|--------|---------|
| Stop | `docker compose down` |
| Restart notifiers | `docker compose restart notifiers` |
| View logs | `docker compose logs -f notifiers` |
| Update to new image | `docker compose pull && docker compose up -d` |

---

## Updating to a new version

1. From your local machine: `./build_and_push.sh`
2. On the server, update the image tag:
   ```bash
   nano /home/ubuntu/notifiers/docker-compose.yml
   # update the image: tag
   ```
3. Pull and restart:
   ```bash
   cd /home/ubuntu/notifiers
   docker compose pull
   docker compose up -d
   ```

---

## Notes

- Redis data is ephemeral — on restart, queues are empty. Listeners re-subscribe and new events queue normally.
- Logs are capped at 50 MB × 3 files to protect disk.
- The notifiers container restarts automatically on crash (`restart: always`).
- Port 8000 is exposed on the public IP — firewall it if you don't need it public.
- **Never run two instances with the same Telegram bot tokens** — both will post to the same channels, causing duplicate notifications.
