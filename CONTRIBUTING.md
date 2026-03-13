# Contributing to p2pme-notifiers

Thanks for your interest. Here’s how to run, test, and deploy so you can contribute or run your own instance.

## Running locally

- **With Docker:** See [README – Quick Start (Local)](README.md#quick-start-local): copy `.env.example` to `.env`, then run `./test.sh`. Health: `GET http://localhost:8000/healthz`.
- **Without Docker:** Install Node 20, run Redis (e.g. `docker run -d -p 6379:6379 redis:7-alpine`), copy `.env.example` to `.env` and fill it, then `npm install` and `npm run dev` (or `npm run build && npm run start`). Health: `GET http://localhost:8000/healthz`.

## Testing

- Ensure Redis is running and `.env` has at least core variables (and one currency’s Telegram vars if you want notifications).
- Start the app (Docker or Node). Hit `GET http://localhost:8000/healthz` to confirm it’s up.
- On-chain events will enqueue jobs; with valid Telegram/Push config, notifications will be sent. For minimal testing, health check is enough.

## Deploying to Akash

1. Build and push your image (use your own registry): `IMAGE_NAME=youruser/p2pme-notifiers TAG=v1.0.0 ./build_and_push.sh`.
2. Update `deploy.yml`: set the `image:` for the `notifiers` service to match your image and tag; adjust `placement` and `pricing` for your provider.
3. Generate SDL: `./generate_deploy.sh` (reads `.env`, writes `deploy.final.yml`).
4. Upload `deploy.final.yml` in the Akash UI to create/update the deployment.

## Pull requests

- Describe what you changed and why.
- Do **not** commit `.env`, `deploy.final.yml`, or any file containing real API keys, tokens, or secrets. Use `.env.example` as a template only.
