# **p2pme-notifiers**

Lightweight, event-driven + scheduled notification system for **P2P.me**.
Listens to on-chain events, schedules periodic price updates, and sends **Telegram** + **Push** notifications using **ethers.js**, **BullMQ**, **Redis** and **Express**.

Deployable locally (Docker Compose), on any **VPS** (SurferCloud, DigitalOcean, Hetzner, etc.), or on **Akash**.

---

## **Table of Contents**

* [What it does](#what-it-does)
* [How it works](#how-it-works)
* [Architecture](#architecture)
* [Prerequisites](#prerequisites)
* [Quick Start (Local)](#quick-start-local)
* [Environment Variables](#environment-variables)
* [Deployment (VPS / Cloud)](#deployment-vps--cloud)
* [Deployment (Akash)](#deployment-akash)
* [License](#license)

---

## **What it does**

### **1. Blockchain event listening**

Subscribes to the Diamond contract on Base via WebSocket.

Handled events:

* `OrderPlaced`
* `MerchantsReAssigned`
* `OrderAccepted`
* `BuyOrderPaid`
* `SellOrderUpiSet`
* `OrderCompleted`
* `OrderCancelledBy`
* `OrderDispute`
* `OnlineOfflineToggled`

### **2. Scheduled price updates**

Fetches price data on-chain on a schedule and sends Telegram alerts.

### **3. Queue-driven processing**

* Listener receives event → parses payload → enqueues job into Redis
* Worker consumes job → executes handler → sends notification

### **4. Notifications**

* Per-currency Telegram order channels
* Per-currency Telegram price channels
* Push notifications to merchants
* OnFail fallback Telegram alerts on handler errors

---

## **How it works**

[![](https://mermaid.ink/img/pako:eNpdk8tu00AUhl_laFaplIQ2dhrHQki50ItU2qROZYm6i4l9Ug9xZqLxGChtd-yLaCVEWSB2LLpAYsPz8ALwCMx4GtpkVp5zvv8_l5HPSSwSJD6ZZOJNnFKpYNSPOOjT7VWOI_L7y_WfX1fQpTlCNxPxVEOMQ5_RmeAJ9ARXksYqIidrEbfCvBifSjpPoTMYgLb4-_XDT-BCsQlDmUOsJdoCpdZYgTkJkxgrJjjsHT5Ew6DUX3-DEMeBro4K9liucFUe9HZMs1c_IIhTTIpMV1oChsfW6Q66RZa9GMKwwAI18ogJjcXtZzNvKOR0pUQYQK32DIZLRU3oIiJzyWKEV2Ksi148RoalJrQB5MliR4fP-7vBccW09Om9KXiICdPitZMFMdqulB1_vIMRZqg3OrNLNsnBUbBj0zc3MCjyFPbL_cbUrDB_AA_2tzq7exa9_Q4HfIuyDDp6PUtP1u3dDyJ4zT4wvkauymnCwDJDeGqZXAmJ8AQmqOLUEOUwFgoXPjJB-chktL2c7xZnBwYZUJZAgFlW3o7mLEBleDPgssKumJrOVx3r963DhHGawUSPWEg0kB2fVMmpZAnxlSywSmYoZ9RcybmxiIhKcaZxX38mVE4jEvFLrZlT_lKI2UImRXGaEn9Cs1zfinlCFerfwDzM_6jUT4yyJwquiO94bmlC_HPylvgbzVa95biO6za9Tddpujp7psNeo95uuV7TW9_wHG-97VxWybuy7np902m3dLDZbjQb7Ua7dfkPw_0rfA?type=png)](https://mermaid.live/edit#pako:eNpdk8tu00AUhl_laFaplIQ2dhrHQki50ItU2qROZYm6i4l9Ug9xZqLxGChtd-yLaCVEWSB2LLpAYsPz8ALwCMx4GtpkVp5zvv8_l5HPSSwSJD6ZZOJNnFKpYNSPOOjT7VWOI_L7y_WfX1fQpTlCNxPxVEOMQ5_RmeAJ9ARXksYqIidrEbfCvBifSjpPoTMYgLb4-_XDT-BCsQlDmUOsJdoCpdZYgTkJkxgrJjjsHT5Ew6DUX3-DEMeBro4K9liucFUe9HZMs1c_IIhTTIpMV1oChsfW6Q66RZa9GMKwwAI18ogJjcXtZzNvKOR0pUQYQK32DIZLRU3oIiJzyWKEV2Ksi148RoalJrQB5MliR4fP-7vBccW09Om9KXiICdPitZMFMdqulB1_vIMRZqg3OrNLNsnBUbBj0zc3MCjyFPbL_cbUrDB_AA_2tzq7exa9_Q4HfIuyDDp6PUtP1u3dDyJ4zT4wvkauymnCwDJDeGqZXAmJ8AQmqOLUEOUwFgoXPjJB-chktL2c7xZnBwYZUJZAgFlW3o7mLEBleDPgssKumJrOVx3r963DhHGawUSPWEg0kB2fVMmpZAnxlSywSmYoZ9RcybmxiIhKcaZxX38mVE4jEvFLrZlT_lKI2UImRXGaEn9Cs1zfinlCFerfwDzM_6jUT4yyJwquiO94bmlC_HPylvgbzVa95biO6za9Tddpujp7psNeo95uuV7TW9_wHG-97VxWybuy7np902m3dLDZbjQb7Ua7dfkPw_0rfA)

---

## **Architecture**

```
.
├── src/
│   ├── listeners/              # On-chain WebSocket listeners
│   │   ├── handlers/           # One file per event (OrderPlaced, etc.)
│   │   ├── lib/                # Listener utilities
│   │   ├── notifier.ts         # processLog() → enqueue job
│   │   └── index.ts            # startListeners()
│   │
│   ├── schedulers/             # BullMQ job schedulers
│   │   ├── handlers/           # PriceNotify handler
│   │   ├── lib/                # Scheduler utilities
│   │   └── index.ts            # startSchedulers()
│   │
│   ├── queue/                  # BullMQ queue + worker
│   │   ├── index.ts            # Queue instance (notificationQueue)
│   │   ├── worker.ts           # Worker consuming jobs
│   │   └── handlers.ts         # Registry: eventName → handler function
│   │
│   ├── helpers/                # Shared: ABI, providers, utils
│   └── index.ts                # Bootstrap: listeners + schedulers + worker + Express
│
└── deploy/
    ├── local/
    │   └── docker-compose.yml  # Builds from source, used by ./test.sh
    ├── vps/
    │   ├── docker-compose.yml  # Pulls published image, use on any Ubuntu VPS
    │   ├── .env.example        # Copy to server as .env and fill values
    │   ├── install_docker.sh   # Run once on a fresh Ubuntu server
    │   └── DEPLOY.md           # Step-by-step VPS deployment guide
    └── akash/
        ├── deploy.yml          # Akash SDL template
        └── generate_deploy.sh  # Injects .env secrets → deploy.final.yml
```

**One container handles everything:** Express health server, WebSocket listeners, schedulers, and the queue worker.

**Redis** is a sidecar — used only as the BullMQ queue store. Queue name: `notifications`.

---

## **Prerequisites**

* **Node.js** 20+ (local dev / building)
* **Docker** (local stack + building image)
* Redis is included automatically via Docker Compose

---

## **Quick Start (Local)**

### 1. Copy env file and fill values

```bash
cp .env.example .env
# edit .env — fill in at least ALCHEMY_API_KEY, DIAMOND_ADDRESS, and one currency's Telegram vars
```

### 2. Run

```bash
./test.sh
```

This builds TypeScript, builds the Docker image, and starts the full stack (Redis + notifiers) in the foreground. Press **Ctrl+C** to stop.

### 3. Health check

```
GET http://localhost:8000/healthz
```

### Run without Docker

```bash
# Start Redis separately
docker run -d -p 6379:6379 redis:7-alpine

# Install and run
npm install
npm run dev
```

---

## **Environment Variables**

Copy `.env.example` to `.env` and fill in values. Never commit `.env`.

### Core

```
ALCHEMY_API_KEY=        # Alchemy API key (Base chain)
DIAMOND_ADDRESS=        # P2P.me Diamond contract address on Base
PUSH_NOTIF_X_SECRET_KEY=  # Shared secret for push notification endpoint
```

### OnFail Telegram

```
TELEGRAM_ONFAIL_BOT_TOKEN=
TELEGRAM_ONFAIL_CHANNEL_ID=
TELEGRAM_ONFAIL_TOPIC_ID=
```

### Per-currency Telegram config

Supported currencies: **INR / IDR / BRL / ARS / MEX / VEN**

Each currency needs:

```
TELEGRAM_{CURRENCY}_ALERTS_BOT_TOKEN=
TELEGRAM_{CURRENCY}_BUY_ORDER_BOT_TOKEN=
TELEGRAM_{CURRENCY}_SELL_ORDER_BOT_TOKEN=
TELEGRAM_{CURRENCY}_PAY_ORDER_BOT_TOKEN=
TELEGRAM_{CURRENCY}_REPORT_BOT_TOKEN=
TELEGRAM_{CURRENCY}_ORDER_UPDATES_CHANNEL_ID=
TELEGRAM_{CURRENCY}_ORDER_UPDATES_TOPIC_ID=
TELEGRAM_{CURRENCY}_DISPUTE_TOPIC_ID=
TELEGRAM_{CURRENCY}_REPORT_TOPIC_ID=
TELEGRAM_{CURRENCY}_PRICE_UPDATES_CHANNEL_ID=
TELEGRAM_{CURRENCY}_PRICE_UPDATES_TOPIC_ID=
```

See `.env.example` for the full list.

### Where to get credentials

* **ALCHEMY_API_KEY** — [Alchemy](https://www.alchemy.com/) (Base chain)
* **DIAMOND_ADDRESS** — The P2P.me Diamond contract on Base
* **PUSH_NOTIF_X_SECRET_KEY** — shared secret for your push notification endpoint
* **TELEGRAM_*** — Create bots with [BotFather](https://t.me/BotFather); use your channel/group IDs and topic IDs for threads

---

## **Deployment (VPS / Cloud)**

Full guide: [deploy/vps/DEPLOY.md](deploy/vps/DEPLOY.md)

**Quick summary:**

1. Build and push your image: `IMAGE_NAME=youruser/p2pme-notifiers TAG=v0.1.0 ./build_and_push.sh`
2. SSH into your server, run `deploy/vps/install_docker.sh` once
3. Copy `deploy/vps/docker-compose.yml` to `~/notifiers/docker-compose.yml` on the server (update image tag)
4. Copy `deploy/vps/.env.example` to `~/notifiers/.env` on the server and fill values
5. `cd ~/notifiers && docker compose up -d`

---

## **Deployment (Akash)**

### 1. Build and push your Docker image

```bash
IMAGE_NAME=youruser/p2pme-notifiers TAG=v0.1.0 ./build_and_push.sh
```

### 2. Update `deploy/akash/deploy.yml`

Set the `image:` field to match your pushed image. Adjust `placement` and `pricing` for your chosen Akash provider.

### 3. Generate SDL with your secrets

```bash
cp .env.example .env
# fill in .env
./deploy/akash/generate_deploy.sh
```

This produces `deploy.final.yml` at the repo root. **Do not commit this file** — it contains your secrets.

### 4. Deploy via Akash UI

Upload `deploy.final.yml` to the Akash Console to create your deployment.

---

## **Troubleshooting**

| Symptom | Cause | Fix |
|---------|-------|-----|
| `socket hang up` | Temporary network blip | Auto-retries, safe to ignore |
| `Missing lock` in logs | Redis lock race on startup | Safe to ignore |
| Duplicate notifications | Two instances running with same bot tokens | Check for parallel deployments (Akash + VPS simultaneously) |
| Telegram delays | Telegram API timeout | Worker retries automatically |

---

## **License**

MIT. See [LICENSE](LICENSE). For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
