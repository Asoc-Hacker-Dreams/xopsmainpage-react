# AI Agent Working Instructions — XOps Conference Website

> Guidelines for AI agents working on this codebase.

---

## Project Overview

This is a React 18 SPA for the **X-Ops Conference** series — a technology conference focused on DevOps, DevSecOps, AIOps, MLOps, and BizDevOps. The site covers multiple events (Madrid 2025, Barcelona 2026, Dubai 2026) and integrates with the **Sophia Metapolis** digital nation concept.

---

## Conventions

### File Organization

- **Pages** go in `src/pages/`. Sub-sections (sophia, wallet, tickets, archive) have their own subdirectories.
- **Components** go in `src/components/`. Sub-sections mirror the page structure.
- **Adapters** go in `src/adapters/{service-name}/`. Each adapter has its own directory with `client.ts`, `types.ts`, and `index.ts`.
- **API handlers** go in `src/api/`. These are BFF-style pure async functions.
- **Hooks** go in `src/hooks/`.
- **Contracts** go in `src/contracts/` as JSON Schema files (v1 versioned).
- **Translations** go in `src/i18n/locales/{lang}.json`.
- **Styles** go in `src/styles/` for global CSS, or co-located CSS files for component-specific styles.

### Language Mix

- **Pages and components:** JavaScript (`.jsx`)
- **Adapters, API handlers, hooks:** TypeScript (`.ts`, `.tsx`)
- **Config files:** JavaScript (`.js`)

When creating new files:
- Adapters and API code → **TypeScript**
- UI components → **JSX** (to match existing patterns)
- Hooks → **TypeScript**

### Naming

- Component files: PascalCase (`SophiaHome.jsx`, `WalletDashboard.jsx`)
- Hook files: camelCase with `use` prefix (`usePWA.js`, `useAgenda.ts`)
- Adapter files: camelCase (`client.ts`, `circuitBreaker.ts`)
- CSS files: Match component name or kebab-case (`SophiaHome.css`, `theme.css`)
- Contract files: kebab-case with version (`ticket.v1.json`)

### Routing

All routes are defined in `src/App.jsx` in the `<Routes>` block. Some pages have multilingual route aliases (e.g., `/Organizer` and `/Organizadores` → same component).

### i18n

- All user-facing strings must use `t('key.path')` via `useTranslation()`.
- Add translations to both `src/i18n/locales/en.json` and `src/i18n/locales/es.json`.
- Default language is Spanish (`es`), fallback is Spanish.

### SEO

- Every page should use the `SEO` component from `src/components/SEO.jsx`.
- Include title, description, path at minimum.
- Add `structuredData` (JSON-LD) for event pages.

---

## Known Mocks & Stubs

These features use simulated/hardcoded data and are **not yet connected to real APIs**:

| Feature | File(s) | Mock Type |
|---------|---------|-----------|
| Sophia Postulation submit | `pages/sophia/SophiaPostulate.jsx` | `setTimeout` simulates API call |
| Sophia Postulation status | `pages/sophia/SophiaPostulateStatus.jsx` | Falls back to mock data on API failure |
| Wallet Login (magic link) | `pages/wallet/WalletLogin.jsx` | `setTimeout` simulates email send |
| Wallet Login (OAuth) | `pages/wallet/WalletLogin.jsx` | Buttons present, not wired |
| Wallet Dashboard data | `pages/wallet/WalletDashboard.jsx` | Hardcoded identity, stamps, communities |
| XOpsEventDetail agenda | `pages/tickets/XOpsEventDetail.jsx` | Hardcoded agenda array in component |
| XOpsEventDetail speakers | `pages/tickets/XOpsEventDetail.jsx` | TBA placeholder entries |

### What IS connected to a real API

| Feature | Integration | Status |
|---------|-------------|--------|
| Ticket type listing | TriskelGate `listTicketTypes()` | ✅ Live |
| Checkout session creation | TriskelGate `createCheckout()` | ✅ Live |
| Payment status polling | TriskelGate `getCheckoutSessionStatus()` | ✅ Live |
| Ticket validation | TriskelGate `validateTicket()` | ✅ Available |
| Order retrieval | TriskelGate `getOrder()` | ✅ Available |

---

## Common Tasks

### Adding a New Page

1. Create the component in `src/pages/` (use `.jsx`)
2. Import it in `src/App.jsx`
3. Add a `<Route>` in the `<Routes>` block
4. Add the `SEO` component with appropriate meta tags
5. Add route to `vite.config.js` `dynamicRoutes` for sitemap generation
6. Add translation keys to both `en.json` and `es.json`

### Adding a New Integration

1. Create an adapter directory: `src/adapters/{service-name}/`
2. Add `client.ts` (with circuit breaker if external), `types.ts`, `index.ts`
3. Add BFF handlers in `src/api/{domain}.ts` if needed
4. Add contract schema in `src/contracts/{entity}.v{n}.json`
5. Add env var to `.env.example` and `Dockerfile`

### Replacing a Mock with Real API

1. Locate the mock in the table above
2. Replace `setTimeout`/hardcoded data with the actual API call
3. Add proper error handling (try/catch, loading states, error states)
4. Add the adapter method if needed
5. Test both success and failure paths

### Adding Translations

```bash
# 1. Add key to both files
# src/i18n/locales/en.json
# src/i18n/locales/es.json

# 2. Use in component
const { t } = useTranslation();
<h1>{t('section.title')}</h1>
```

---

## Integration Testing

### Ticket Flow E2E

1. Start TriskelGate on `localhost:3001`
2. Set `VITE_TRISKELL_API_BASE_URL=http://localhost:3001` in `.env`
3. Start dev server: `npm run dev`
4. Navigate to `/tickets`
5. Click a ticket tier → enter name/email → should redirect to Stripe
6. Use Stripe test card `4242 4242 4242 4242`
7. Should redirect to `/checkout/success?session_id=XXX`
8. Page should poll and show confirmation

### Without Backend

The site renders fully without any backend running. Only the ticket purchase flow requires TriskelGate. All other pages use static content or mocked data.

### Running Tests

```bash
npm run test:run          # All tests
npm run test:unit         # Unit only
npm run test:integration  # Integration only
npm run test:coverage     # With coverage
```

---

## Architecture Decisions to Be Aware Of

1. **App.jsx renders navbar + hero globally** — The main navbar and hero section are rendered at the top of `App.jsx` for ALL routes. Sub-pages (Sophia, Wallet) have their own nav bars inside their components.

2. **Mixed JS/TS codebase** — Pages are JSX, adapters/API are TypeScript. Don't try to convert everything to TS; follow the existing pattern per layer.

3. **Browser singleton pattern** — `triskelGateClient` is created at module load time. Don't create new instances in components; import the singleton.

4. **Circuit breaker is per-client** — Each `TriskelGateClient` instance has its own circuit breaker. The browser singleton shares one breaker across all frontend calls.

5. **No state management library** — State is managed via React hooks (`useState`, `useEffect`) and Context (`ConsentContext`). No Redux/Zustand/Jotai.

6. **Bootstrap + Tailwind coexist** — Both are used. Bootstrap via `react-bootstrap` for layout/components, Tailwind via `@tailwindcss/vite` for utility classes.

7. **ConsentContext gates analytics** — Always check consent before adding tracking scripts. Use `ScriptManager` for third-party scripts.

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — System overview, directory structure, tech stack
- [COMPONENTS.md](./COMPONENTS.md) — All pages and components
- [INTEGRATIONS.md](./INTEGRATIONS.md) — TriskelGate adapter, circuit breaker, data flows
- [SETUP.md](./SETUP.md) — Local dev, Docker, environment variables
