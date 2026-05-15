#!/usr/bin/env bash
# deploy-local.sh — fast local deploy for xops-web
# Builds with npm locally (fast), then packages into a tiny nginx image.
# ~15s total vs ~10min with --no-cache Docker build.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Building frontend (vite)..."
cd "$WEB_DIR"
npm run build

echo "▶ Building Docker image (dist-only, no npm in Docker)..."
cd "$REPO_ROOT"
docker build \
  -f xopsmainpage-react/Dockerfile.local \
  -t hsm-xops-web:latest \
  xopsmainpage-react/

echo "▶ Restarting container..."
docker compose --profile xops up -d --no-build xops-web

echo "✅ Done — http://localhost:3006"
