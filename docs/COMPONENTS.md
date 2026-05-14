# Components — XOps Conference Website

> All pages and key components documented from source code.

---

## Pages

### Home (`/`)

- **File:** `src/pages/Home.jsx`
- **Status:** ✅ Functional
- **Purpose:** Main landing page composing multiple sections.
- **Sub-components:**
  - `SEO` — Structured data for Event schema (X-Ops Conference Madrid 2025)
  - `XOpsSection` — "What is X-Ops?" overview with key components list
  - `Themes` — Conference themes/tracks
  - `Events` — Event schedule listing
  - `Ubication` — Venue location info
  - `LastEditionData` — Stats from previous editions
  - `Collaborators` — Partner logos
  - `SpeakersSection` — Featured speakers grid
- **Integration points:** None (static content + i18n)

---

### Summit (`/summit`)

- **File:** `src/pages/Summit.jsx`
- **Status:** ✅ Functional
- **Purpose:** X-Ops Summit Barcelona 2026 — executive event for CTOs/CISOs.
- **Sub-components:**
  - `SummitHero` — Hero banner
  - `ValueProposition` — Why attend
  - `ExecutiveAgenda` — Agenda overview
  - `TicketTier` — Pricing tiers
  - `SummitLocation` — Venue details
  - `SummitOrganizers` — Organizer information
- **SEO:** Full Helmet meta (title, description, OG tags)
- **Context:** Parallel event to HackBCN Con, 6-7 May 2026

---

### Tickets (`/tickets`, `/events/x-ops-conference-dubai-2026/buy`)

- **File:** `src/pages/Tickets.jsx`
- **Status:** ✅ Functional (live TriskelGate integration)
- **Purpose:** Ticket purchase page with three pricing tiers.
- **State:**
  - `loading` — Tracks which tier is being processed (`null | 'executive' | 'vip' | 'partner'`)
  - `error` — Error message string
- **Ticket Tiers:**
  | Tier | Price | API Name | Highlighted |
  |------|-------|----------|-------------|
  | EXECUTIVE | €299 (was €375) | `General` | No |
  | VIP PASS | €499 (was €625) | `VIP` | Yes (recommended) |
  | PARTNER | €999 (was €1250) | N/A (mailto) | No |
- **Integration:**
  - Uses `triskelGateClient` singleton directly
  - `getTicketTypeId()` — Fetches ticket types from TriskelGate, matches by `apiName`
  - `handlePayment()` — Collects customer name/email via `window.prompt()`, calls `createCheckout()`, redirects to Stripe `sessionUrl`
  - Partner tier opens mailto link
  - Event ID from `VITE_TRISKELL_EVENT_ID` env var (defaults to `1`)
- **Dependencies:** `react-bootstrap`, `react-icons`, `triskelGateClient`

---

### CheckoutSuccess (`/checkout/success`)

- **File:** `src/pages/tickets/CheckoutSuccess.jsx`
- **Status:** ✅ Functional (live TriskelGate integration)
- **Purpose:** Post-payment confirmation page, polls for payment status.
- **State:**
  - `status` — `'processing' | 'confirmed' | 'error'`
- **Flow:**
  1. Reads `session_id` from URL search params
  2. Polls `triskelGateClient.getCheckoutSessionStatus(sessionId)` every 2 seconds
  3. Shows spinner while `status === 'processing'`
  4. Shows confirmation with summary when `status === 'paid'`
  5. Stops polling after 60 seconds
  6. Shows error if no `session_id` param
- **CTAs:** "Back to Home" (`/`), "Learn about Sophia" (`/sophia`)
- **Dependencies:** `triskelGateClient`, `useSearchParams`, `useTranslation`

---

### CheckoutCancel (`/checkout/cancel`)

- **File:** `src/pages/tickets/CheckoutCancel.jsx`
- **Status:** ✅ Functional
- **Purpose:** Shown when user cancels Stripe checkout.
- **CTAs:** "Try Again" → `/events/x-ops-conference-dubai-2026/buy`, "Contact Support" → mailto
- **Dependencies:** `useTranslation`, `Link`

---

### XOpsEventDetail (`/events/x-ops-conference-dubai-2026`)

- **File:** `src/pages/tickets/XOpsEventDetail.jsx`
- **Status:** ✅ Functional (static content, no API calls)
- **Purpose:** Full event detail page for X-Ops Conference Dubai 2026.
- **Sections:**
  - Breadcrumb navigation
  - Event header with date, location, attendee count
  - Quick stats (3 days, 30+ sessions, 20+ speakers, 500+ attendees)
  - Tabbed agenda (Day 1-3 with time slots and session types)
  - Speakers preview (placeholder TBA entries)
  - Venue info (Dubai World Trade Center)
  - CTA to buy tickets
  - Sophia Metapolis footer note
- **Agenda data:** Hardcoded in component (not from API)
- **Dependencies:** `react-bootstrap` (Tabs, Cards), `react-icons`, `SEO`, `useTranslation`

---

### XOpsHome (not currently routed)

- **File:** `src/pages/tickets/XOpsHome.jsx`
- **Status:** ✅ Built but not directly routed (available as a component)
- **Purpose:** Alternative event landing page for Dubai 2026 with hero, highlights, and ticket CTA.
- **Note:** `XOpsEventDetail` is used for `/events/x-ops-conference-dubai-2026` instead.

---

### Sophia Pages

#### SophiaHome (`/sophia`)

- **File:** `src/pages/sophia/SophiaHome.jsx`
- **Status:** ✅ Functional (static content)
- **Purpose:** Sophia Metapolis digital nation homepage.
- **Sections:** Hero, feature cards (Governance, Federal Model, Citizenship), events teaser (Dubai 2026 link), footer.
- **Navigation:** Own nav bar linking to `/sophia`, `/sophia/about`, `/sophia/postulate`, `/wallet`.

#### SophiaAbout (`/sophia/about`)

- **File:** `src/pages/sophia/SophiaAbout.jsx`
- **Status:** ✅ Functional (static content)
- **Purpose:** Detailed info about Sophia Metapolis governance model.
- **Sections:**
  - **Governance archetypes:** Horus (security), Sulis (social welfare), Minerva (knowledge)
  - **Federal model:** Circles (professional), Cofradías (thematic), Chapters (geographic)
  - **Citizenship flow:** Postulation → Active participation → Fair process
- **CTA:** Link to postulation form

#### SophiaPostulate (`/sophia/postulate`)

- **File:** `src/pages/sophia/SophiaPostulate.jsx`
- **Status:** ⚠️ Mock (simulated API call with `setTimeout`)
- **Purpose:** Citizenship postulation form.
- **Form fields:** handle, email, country, displayName, declaration (min 200 chars, max 2000), acceptTerms
- **Validation:** Declaration minimum 200 characters, terms acceptance required
- **Submit flow:** Simulates 1.5s delay, shows success message
- **State:** `formData`, `submitted`, `submitting`

#### SophiaPostulateStatus (`/sophia/postulate/status`)

- **File:** `src/pages/sophia/SophiaPostulateStatus.jsx`
- **Status:** ⚠️ Partially mock (falls back to mock data on API failure)
- **Purpose:** Check postulation status by handle.
- **API call:** `GET ${API_BASE_URL}/api/citizenship/postulations/${handle}/status`
- **Fallback:** On error or non-success response, shows mock pending status
- **Status badges:** approved (green), rejected (red), pending (yellow), archived (gray)
- **If approved:** Shows link to Wallet

---

### Wallet Pages

#### WalletLogin (`/wallet/login`)

- **File:** `src/pages/wallet/WalletLogin.jsx`
- **Status:** ⚠️ Mock (simulated magic link)
- **Purpose:** Authentication entry point for Sophia Wallet.
- **Auth methods:**
  - Magic link (email-based, simulated with setTimeout)
  - Apple OAuth (button present, not wired)
  - GitHub OAuth (button present, not wired)
- **State:** `email`, `magicLinkSent`

#### WalletDashboard (`/wallet`)

- **File:** `src/pages/wallet/WalletDashboard.jsx`
- **Status:** ⚠️ Mock (all data is hardcoded)
- **Purpose:** User's digital wallet showing identity, stamps, and communities.
- **Guard:** Wrapped in `WalletGuard` — redirects to `/wallet/login` if no `wallet_auth_token` in localStorage
- **Mock data:**
  - Identity: `@specter`, active status, UAE
  - Stamps: 3 entries (event attendance, citizenship, early adopter)
  - Communities: 2 entries (DevSecOps Collective, Platform Engineering Hub)
- **Dependencies:** `WalletGuard`, `react-bootstrap`, `react-icons`, `SEO`

---

### Other Pages

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/Organizer` | `pages/Organizer.jsx` | ✅ Functional | Organizer information |
| `/Sponsor` | `pages/Sponsor.jsx` | ✅ Functional | Sponsor information |
| `/agenda` | `pages/Agenda.tsx` | ✅ Functional | Full conference agenda |
| `/speaker/:id` | `pages/Speaker.tsx` | ✅ Functional | Speaker profile (parameterized) |
| `/mi-agenda` | `pages/MyAgenda.tsx` | ✅ Functional | Personal agenda builder |
| `/post-event` | `pages/PostEventPage.tsx` | ✅ Functional | Post-event content/surveys |
| `/analytics` | `pages/Analytics.tsx` | ✅ Functional | Analytics dashboard |
| `/politica-de-privacidad` | `pages/PrivacyPolicy.jsx` | ✅ Functional | Privacy policy |
| `/archive/2025/*` | `pages/archive/2025/` | ✅ Functional | 2025 edition archives |
| `/archive/2024/*` | `pages/archive/2024/` | ✅ Functional | 2024 edition archives |
| `/archive/2023/*` | `pages/archive/2023/` | ✅ Functional | 2023 edition archives |
| `*` | `components/NotFound.jsx` | ✅ Functional | 404 page |

---

## Key Shared Components

### SEO

- **File:** `src/components/SEO.jsx`
- **Props:** `title`, `description`, `path`, `image`, `keywords`, `lang`, `author`, `robots`, `alternates[]`, `structuredData`
- **Purpose:** Centralized `<Helmet>` wrapper for meta tags, Open Graph, Twitter Cards, canonical URLs, hreflang alternates, and JSON-LD structured data.
- **Base URL:** `https://xopsconference.com`

### Header

- **File:** `src/components/Header.jsx`
- **Props:** `theme`, `toggleTheme`, `toggleLanguage`
- **Purpose:** Reusable navigation bar with language toggle, theme toggle, and smooth scroll to page sections.
- **Note:** The main navbar is inline in `App.jsx`; this component is used by sub-pages.

### WalletGuard

- **File:** `src/components/wallet/WalletGuard.jsx`
- **Props:** `children`
- **Purpose:** Route guard that checks `localStorage('wallet_auth_token')`. Redirects to `/wallet/login` if absent.
- **Pattern:** Renders `null` during redirect, passes children through when authenticated.

### AddToHomeScreen

- **File:** `src/components/AddToHomeScreen.jsx`
- **Purpose:** PWA install banner shown when `canPrompt` is true from `usePWA` hook.

### CookieConsentBanner

- **File:** `src/components/CookieConsentBanner.jsx`
- **Purpose:** GDPR-compliant cookie consent banner.
- **Context:** Uses `ConsentContext`.

### CookiePreferencesManager

- **File:** `src/components/CookiePreferencesManager.jsx`
- **Props:** `show`, `onHide`
- **Purpose:** Modal for managing granular cookie preferences.

### AnimationWrapper

- **File:** `src/components/AnimationWrapper.jsx`
- **Props:** `animation`, `duration`, `children`
- **Purpose:** Wraps children in AOS scroll animations.

### XOpsSection

- **File:** `src/components/XOpsSection.jsx`
- **Purpose:** "What is X-Ops?" explanatory section with animated content and image.

### ScriptManager

- **File:** `src/components/ScriptManager.jsx`
- **Purpose:** Conditionally loads third-party scripts based on cookie consent status.

### ScrollHandler

- **File:** `src/ScrollHandler.jsx`
- **Purpose:** Handles scroll restoration and hash-based navigation for anchor links.

---

## Hooks

| Hook | File | Purpose |
|------|------|---------|
| `usePWA` | `hooks/usePWA.js` | Manages PWA install prompt, tracks user rejection |
| `useAgenda` | `hooks/useAgenda.ts` | Fetches/manages agenda data |
| `useSpeakers` | `hooks/useSpeakers.ts` | Fetches/manages speaker data |
| `useSponsors` | `hooks/useSponsors.ts` | Fetches/manages sponsor data |
| `useFavorites` | `hooks/useFavorites.ts` | Manages user favorites/bookmarks |
| `useMeetings` | `hooks/useMeetings.js` | Manages meetings state |
| `useNotifications` | `hooks/useNotifications.ts` | Push notification preferences |
| `useAnalyticsEvents` | `hooks/useAnalyticsEvents.ts` | Analytics event tracking |

---

## Contexts

| Context | File | Purpose |
|---------|------|---------|
| `ConsentContext` | `contexts/ConsentContext.jsx` | Cookie/analytics consent state management |

---

## Contracts (JSON Schema)

| Contract | File | Purpose |
|----------|------|---------|
| `ticket.v1.json` | `contracts/ticket.v1.json` | Ticket data schema (used by `mapTicket.ts`) |
| `speaker.v1.json` | `contracts/speaker.v1.json` | Speaker data schema |
| `sponsor.v1.json` | `contracts/sponsor.v1.json` | Sponsor data schema |
| `talk.v1.json` | `contracts/talk.v1.json` | Talk/session data schema |
