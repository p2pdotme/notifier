#!/bin/bash
# Injects secrets from .env (repo root) into deploy.yml → deploy.final.yml
# Run from the repo root: ./deploy/akash/generate_deploy.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
INPUT_YAML="$(dirname "$0")/deploy.yml"
OUTPUT_YAML="$REPO_ROOT/deploy.final.yml"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env not found at $ENV_FILE"
  exit 1
fi

cp "$INPUT_YAML" "$OUTPUT_YAML"

while IFS='=' read -r key value; do
  if [[ -n "$key" && ! "$key" =~ ^# ]]; then
    safe_value=$(printf '%s\n' "$value" | sed -e 's/[\/&]/\\&/g')
    sed -i.bak "s|\${$key}|$safe_value|g" "$OUTPUT_YAML"
  fi
done < "$ENV_FILE"

rm -f "$OUTPUT_YAML.bak"

echo "Generated $OUTPUT_YAML — do not commit this file (contains secrets)."
