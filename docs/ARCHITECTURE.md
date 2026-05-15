# Architecture — XOps Conference Website

> React 18 single-page application for the X-Ops Conference series.
> Built with Vite, Tailwind CSS v4, Bootstrap 5, and i18next.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 18.3 |
| Build Tool | Vite | 6.3 |
| Language | JavaScript (JSX) + TypeScript (adapters/api) | Mixed |
| CSS | Tailwind CSS v4 + Bootstrap 5.3 + Custom CSS | — |
| Routing | React Router DOM | 6.27 |
| i18n | i18next + react-i18next | 25.x / 16.x |
| SEO | react-helmet-async | 2.x |
| Icons | react-icons + react-bootstrap | — |
| Animations | AOS (Animate On Scroll) | 2.3 |
| Local Storage | Dexie (IndexedDB wrapper) | 4.3 |
| Validation | ajv + ajv-formats | 8.x |
| Testing | Vitest + Testing Library | 1.x |
| Linting | ESLint 9 (with security plugin) | — |
| Deployment | Docker (nginx) | — |

---

## Directory Structure

```
xopsmainpage-react/
├── public/                    # Static assets, sw.js, manifest
├── src/
│   ├── adapters/
│   │   └── triskelgate/       # TriskelGate API adapter (circuit breaker)
│   │       ├── client.ts      # API client class + browser singleton
│   │       ├── circuitBreaker.ts  # Circuit breaker implementation
│   │       ├── types.ts       # TypeScript interfaces for API responses
│   │       ├── mapTicket.ts   # TG → internal ticket schema mapper
│   │       └── index.ts       # Barrel export
│   ├── api/
│   │   └── tickets.ts         # BFF-style API handlers (getTickets, createCheckout, etc.)
│   ├── assets/                # Images, logos
│   ├── components/
│   │   ├── SEO.jsx            # <Helmet> wrapper for meta tags & structured data
│   │   ├── Header.jsx         # Reusable navbar (used by some sub-pages)
│   │   ├── XOpsSection.jsx    # "What is X-Ops?" landing section
│   │   ├── AddToHomeScreen.jsx # PWA install banner
│   │   ├── AnimationWrapper.jsx # AOS animation wrapper
│   │   ├── CookieConsentBanner.jsx # GDPR cookie consent
│   │   ├── CookiePreferencesManager.jsx # Cookie preferences modal
│   │   ├── ScriptManager.jsx  # Conditional 3rd-party script loading
│   │   ├── Analytics.tsx      # Analytics component
│   │   ├── NotFound.jsx       # 404 page
│   │   ├── Events/            # Event listing components
│   │   ├── Summit/            # Summit sub-components (Hero, TicketTier, etc.)
│   │   ├── Networking/        # Networking feature components
│   │   ├── sophia/            # Sophia-branded UI components
│   │   ├── tickets/           # Ticket-related UI components
│   │   ├── wallet/            # Wallet components (WalletGuard)
│   │   └── ui/                # Generic UI primitives
│   ├── contexts/
│   │   └── ConsentContext.jsx  # Cookie consent state provider
│   ├── contracts/             # JSON Schema contracts (v1)
│   │   ├── ticket.v1.json
│   │   ├── speaker.v1.json
│   │   ├── sponsor.v1.json
│   │   └── talk.v1.json
│   ├── dal/                   # Data access layer
│   ├── data/                  # Static data files
│   ├── hooks/
│   │   ├── usePWA.js          # PWA install prompt management
│   │   ├── useAgenda.ts       # Agenda data hook
│   │   ├── useSpeakers.ts     # Speakers data hook
│   │   ├── useSponsors.ts     # Sponsors data hook
│   │   ├── useFavorites.ts    # Favorites/bookmarks
│   │   ├── useMeetings.js     # Meetings management
│   │   ├── useNotifications.ts # Push notification management
│   │   └── useAnalyticsEvents.ts # Analytics event tracking
│   ├── i18n/
│   │   ├── index.js           # i18next configuration
│   │   └── locales/
│   │       ├── en.json        # English translations
│   │       ├── es.json        # Spanish translations
│   │       └── email-templates.json # Email template strings
│   ├── pages/                 # Route-level page components
│   │   ├── Home.jsx           # Landing page
│   │   ├── Tickets.jsx        # Ticket purchase (TriskelGate integration)
│   │   ├── Summit.jsx         # X-Ops Summit Barcelona 2026
│   │   ├── TicketSuccess.jsx  # Ticket purchase confirmation
│   │   ├── Agenda.tsx         # Conference agenda
│   │   ├── Speaker.tsx        # Individual speaker page
│   │   ├── MyAgenda.tsx       # Personal agenda builder
│   │   ├── Organizer.jsx      # Organizer info
│   │   ├── Sponsor.jsx        # Sponsor info
│   │   ├── Analytics.tsx      # Analytics dashboard
│   │   ├── PostEventPage.tsx  # Post-event content
│   │   ├── PrivacyPolicy.jsx  # Privacy policy
│   │   ├── sophia/            # Sophia Metapolis pages
│   │   ├── tickets/           # Ticket sub-pages (checkout, event detail)
│   │   ├── wallet/            # Wallet pages (login, dashboard)
│   │   └── archive/           # Past edition archives (2023, 2024, 2025)
│   ├── services/              # Service layer
│   ├── storage/               # Storage utilities
│   ├── styles/                # Global CSS files
│   │   ├── Custom.css
│   │   ├── PricingTable.css
│   │   ├── Summit.css
│   │   └── theme.css
│   ├── test/                  # Test files
│   ├── utils/                 # Utility functions
│   ├── App.jsx                # Root component (routes, navbar, footer)
│   ├── App.css                # Root styles
│   ├── main.jsx               # React entry point (BrowserRouter, SW registration)
│   ├── index.js               # Alternate entry point
│   ├── ScrollHandler.jsx      # Scroll restoration / hash navigation
│   └── serviceWorker.ts       # SW cache config (DATA_URLS, DATA_CACHE)
├── Dockerfile                 # Multi-stage: node builder → nginx runner
├── nginx.conf                 # Nginx SPA config
├── vite.config.js             # Vite plugins, sitemap, chunking
├── package.json               # Dependencies & scripts
├── .env.example               # Environment variable template
└── docs/                      # This documentation
```

---

## Routing Architecture

All routes are defined in `src/App.jsx` using React Router v6 `<Routes>` / `<Route>`. The `App` component renders a persistent navbar + hero + footer around the routed content.

### Route Map

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with sections |
| `/summit` `/Summit` | `Summit` | X-Ops Summit Barcelona 2026 |
| `/tickets` | `Tickets` | Ticket purchase page (TriskelGate) |
| `/tickets/success` | `TicketSuccess` | Purchase confirmation |
| `/Organizer` `/Organizadores` `/Team` `/Equipo` | `Organizer` | Organizer page (multilingual aliases) |
| `/Sponsor` `/Patrocina` | `Sponsor` | Sponsor page |
| `/agenda` | `Agenda` | Conference agenda |
| `/speaker/:id` | `SpeakerPage` | Individual speaker profile |
| `/mi-agenda` | `MyAgenda` | Personal agenda builder |
| `/post-event` | `PostEventPage` | Post-event content |
| `/analytics` | `AnalyticsPage` | Analytics dashboard |
| `/politica-de-privacidad` | `PrivacyPolicy` | Privacy policy |
| `/sophia` | `SophiaHome` | Sophia Metapolis home |
| `/sophia/about` | `SophiaAbout` | Sophia governance info |
| `/sophia/postulate` | `SophiaPostulate` | Citizenship postulation form |
| `/sophia/postulate/status` | `SophiaPostulateStatus` | Postulation status checker |
| `/wallet/login` | `WalletLogin` | Wallet login (magic link / OAuth) |
| `/wallet` | `WalletDashboard` | Wallet dashboard (guarded) |
| `/checkout/success` | `CheckoutSuccess` | Stripe checkout success (polls status) |
| `/checkout/cancel` | `CheckoutCancel` | Stripe checkout cancelled |
| `/events/x-ops-conference-dubai-2026` | `XOpsEventDetail` | Dubai 2026 event detail |
| `/events/x-ops-conference-dubai-2026/buy` | `Tickets` | Ticket purchase for Dubai 2026 |
| `/archive/2025/Speakers2025` | `Speakers2025` | 2025 speakers archive |
| `/archive/2025/Events2025` | `Events2025` | 2025 events archive |
| `/archive/2024/Speakers2024` | `Speakers2024` | 2024 speakers archive |
| `/archive/2024/Events2024` | `Events2024` | 2024 events archive |
| `/archive/2024/Sponsor2024` | `Sponsor2024` | 2024 sponsors archive |
| `/archive/2023/Speakers2023` | `Speakers2023` | 2023 speakers archive |
| `*` | `NotFound` | 404 catch-all |

---

## Adapter Pattern

External API calls are isolated behind the **adapter** layer in `src/adapters/`. Currently the only adapter is **TriskelGate** (ticketing platform).

```
Pages / Components
       │
       ▼
  TriskelGateClient  (src/adapters/triskelgate/client.ts)
       │
       ├── CircuitBreaker  (src/adapters/triskelgate/circuitBreaker.ts)
       │        States: CLOSED → OPEN → HALF_OPEN
       │        Threshold: 5 failures
       │        Reset timeout: 30s
       │
       └── fetch()  →  TriskelGate API
```

**Key design decisions:**
- Each adapter method wraps its call in `this.breaker.execute()`
- A **browser singleton** (`triskelGateClient`) is created at module load time, reading `VITE_TRISKELGATE_URL` or `VITE_TRISKELL_API_BASE_URL`
- A **server singleton** (`getDefaultClient()`) reads `process.env.TRISKELGATE_BASE_URL` for SSR/BFF use
- The `mapTicket.ts` module converts TriskelGate types to the internal `TicketV1` schema (defined in `contracts/ticket.v1.json`)
- All adapter types are in `types.ts`; barrel-exported from `index.ts`

See [INTEGRATIONS.md](./INTEGRATIONS.md) for detailed adapter documentation.

---

## i18n Architecture

- **Library:** i18next + react-i18next
- **Configuration:** `src/i18n/index.js`
- **Active languages:** Spanish (`es`), English (`en`)
- **Default language:** Spanish (`es`)
- **Fallback:** Spanish (`es`)
- **Persistence:** `localStorage.getItem('language')`
- **Translation files:** `src/i18n/locales/{en,es}.json`
- **Email templates:** `src/i18n/locales/email-templates.json`

Language toggle in the navbar cycles between `es` ↔ `en`. Some routes have multilingual aliases (e.g., `/Organizer` and `/Organizadores` render the same component).

All user-facing strings use `t('key.path')` via the `useTranslation()` hook.

---

## PWA Setup

| Piece | Location | Description |
|-------|----------|-------------|
| Service Worker registration | `src/main.jsx` | Registers `/sw.js` on window load |
| SW cache config | `src/serviceWorker.ts` | Exports `DATA_URLS` (`/api/agenda`, `/api/ponentes`) and `DATA_CACHE` name |
| Install prompt hook | `src/hooks/usePWA.js` | Captures `beforeinstallprompt`, manages user rejection state |
| Install banner | `src/components/AddToHomeScreen.jsx` | UI for PWA install prompt |
| App.jsx integration | `src/App.jsx` | Renders `<AddToHomeScreen />` and install button in hero if `canPrompt` is true |

The PWA install prompt remembers user rejection in `localStorage('pwa-install-rejected')`.

---

## Build & Deploy

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `vite` | Local development server |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run preview` | `vite preview` | Preview production build |
| `npm test` | `vitest` | Run tests |
| `npm run test:run` | `vitest run` | Single-run tests |
| `npm run test:coverage` | `vitest run --coverage` | Coverage report |
| `npm run lint` | `eslint .` | Lint codebase |

### Vite Configuration

- **Plugins:** `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-plugin-sitemap`
- **Code splitting:** Manual chunks for `vendor` (react, react-dom, react-router-dom) and `bootstrap` (bootstrap, react-bootstrap)
- **Sitemap:** Auto-generated for all defined routes at build time
- **Source maps:** Disabled in production (`sourcemap: false`)

### Docker

Multi-stage Dockerfile:
1. **Builder stage** (`node:20-bookworm-slim`): `npm ci` → `npm run build`
2. **Runner stage** (`nginx:1.27-alpine`): Copies `dist/` and `nginx.conf`
3. **Health check:** `wget -qO- http://localhost/index.html` every 30s
4. **Exposed port:** 80 (mapped to 3006 via Docker Compose)
5. **Build args:** `VITE_API_BASE_URL`, `VITE_TRISKELGATE_URL`, `VITE_AGORAPASS_URL`

See [SETUP.md](./SETUP.md) for full Docker and local development instructions.

---

## Cookie Consent & Analytics

- `ConsentContext` (React context) manages user consent preferences
- `CookieConsentBanner` shows the GDPR-compliant banner
- `CookiePreferencesManager` allows granular cookie preferences
- `ScriptManager` conditionally loads third-party scripts based on consent
- `Analytics` component handles analytics tracking

---

## SEO

The `SEO` component (`src/components/SEO.jsx`) wraps `react-helmet-async` to provide:
- Title, description, keywords, author, robots meta tags
- Canonical URL generation
- Open Graph and Twitter Card meta tags
- `hreflang` alternate links for i18n
- JSON-LD structured data injection
