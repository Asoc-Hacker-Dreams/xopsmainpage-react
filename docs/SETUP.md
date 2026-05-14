# Setup — XOps Conference Website

> Local development, Docker, environment variables, and testing.

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+
- **Docker** (optional, for containerized deployment)

---

## Local Development

```bash
cd xopsmainpage-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs on `http://localhost:5173` by default (Vite).

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# TriskelGate API base URL
VITE_TRISKELL_API_BASE_URL=http://localhost:3001

# Active event ID in TriskelGate
VITE_TRISKELL_EVENT_ID=1
```

### All Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_TRISKELL_API_BASE_URL` | Yes | `http://localhost:3001` | TriskelGate API server URL |
| `VITE_TRISKELL_EVENT_ID` | No | `1` | Active event ID for ticket pages |
| `VITE_TRISKELGATE_URL` | No | — | Alias for TriskelGate URL (takes priority over `VITE_TRISKELL_API_BASE_URL` in client.ts) |
| `VITE_AGORAPASS_URL` | No | `https://app.agorapass.io` | AgoraPass wallet platform URL |
| `VITE_API_BASE_URL` | No | `https://api.xopsconference.com` | General API base URL |

> **Note:** All `VITE_*` variables are embedded at build time by Vite and available via `import.meta.env`.

---

## Docker

### Build & Run (Standalone)

```bash
cd xopsmainpage-react

# Build the image
docker build -t xops-web .

# Run on port 3006
docker run -p 3006:80 xops-web
```

### Docker Compose (from HSM root)

```bash
cd /path/to/HSM

# Start with xops profile
docker compose --profile xops up -d
```

This starts the XOps website container, mapped to port **3006**.

### Dockerfile Details

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `builder` | `node:20-bookworm-slim` | Install deps, build production bundle |
| `runner` | `nginx:1.27-alpine` | Serve static files |

**Build Args** (overridable at build time):

```dockerfile
ARG VITE_API_BASE_URL=https://api.xopsconference.com
ARG VITE_TRISKELGATE_URL=https://tickets.xopsconference.com
ARG VITE_AGORAPASS_URL=https://app.agorapass.io
```

**Health Check:** `wget -qO- http://localhost/index.html` every 30s, timeout 5s.

**Nginx:** Serves from `/usr/share/nginx/html` with custom `nginx.conf` for SPA routing.

---

## Build

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

Output goes to `dist/`. Vite is configured with:
- Manual chunks: `vendor` (react, react-dom, react-router-dom), `bootstrap` (bootstrap, react-bootstrap)
- Auto-generated sitemap (`dist/sitemap.xml`)
- No source maps in production

---

## Testing

```bash
# Run all tests (watch mode)
npm test

# Single run
npm run test:run

# With coverage
npm run test:coverage

# UI mode
npm run test:ui

# Unit tests only (excludes integration)
npm run test:unit

# Integration tests only
npm run test:integration
```

**Stack:** Vitest + Testing Library (React) + jsdom

### Test Files

Tests are co-located with components or in `src/test/`:
- `src/App.test.jsx`
- `src/pages/PrivacyPolicy.test.jsx`
- `src/components/Benefits.test.jsx`
- `src/components/Collaborators.test.jsx`
- `src/components/CookieConsentBanner.test.jsx`
- `src/components/Hero.test.jsx`
- `src/components/AddToHomeScreen.test.jsx`
- `src/contexts/ConsentContext.test.jsx`
- `src/test/integration.test.jsx`
- etc.

---

## Linting & Security

```bash
# Lint
npm run lint

# Security audit
npm run security:audit

# License check (MIT, Apache-2.0, BSD, ISC, CC0 only)
npm run security:license-check

# Security-focused ESLint
npm run security:eslint

# Generate SBOM (CycloneDX)
npm run sbom:generate
```

---

## OSDO Pipeline Scripts

```bash
# Run tests via OSDO
npm run osdo:test

# Software Composition Analysis
npm run osdo:sca

# Static Application Security Testing
npm run osdo:sast
```

---

## Integrated Services for Local Development

To fully test the ticket purchase flow locally, you need **TriskelGate** running:

| Service | Default URL | Purpose |
|---------|-------------|---------|
| TriskelGate | `http://localhost:3001` | Ticketing + payment backend |
| AgoraPass | `http://localhost:8080` | Wallet/identity (mock ready, API optional) |

### TriskelGate

The TriskelGate backend should expose:
- `GET /api/events` — List events
- `GET /api/events/:id/ticket-types` — List ticket types
- `POST /api/payment/create-session` — Create Stripe checkout
- `GET /api/checkout/sessions/:id/status` — Check payment status
- `GET /api/orders/:id` — Get order details
- `POST /api/validate` — Validate ticket QR code
- `GET /api/citizenship/postulations/:handle/status` — Check postulation status

### Without TriskelGate

The website loads and renders fully without TriskelGate. The ticket purchase flow will show errors, but all other pages work with static content.

---

## Quick Reference

```bash
# Full local stack
npm install && npm run dev                    # Frontend on :5173

# Docker (standalone)
docker build -t xops-web . && docker run -p 3006:80 xops-web

# Docker Compose (HSM monorepo)
docker compose --profile xops up -d           # Frontend on :3006
```
