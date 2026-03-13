#!/usr/bin/env bash
set -euo pipefail

echo "Building TypeScript..."
npm run build

echo "Building Docker image p2pme-notifiers:local..."
docker build -t p2pme-notifiers:local .

echo "Starting with docker compose (foreground)..."
echo "Press Ctrl+C to stop"

docker compose -f deploy/local/docker-compose.yml up --build
