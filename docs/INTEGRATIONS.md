# Integrations — XOps Conference Website

> TriskelGate adapter, circuit breaker, AgoraPass integration points, and data flows.

---

## TriskelGate Adapter

TriskelGate is the ticketing and payment platform. The adapter lives in `src/adapters/triskelgate/` and provides a resilient API client with circuit breaker protection.

### Files

| File | Purpose |
|------|---------|
| `client.ts` | `TriskelGateClient` class, singleton exports, error class |
| `circuitBreaker.ts` | `CircuitBreaker` class with state machine |
| `types.ts` | TypeScript interfaces for all API request/response types |
| `mapTicket.ts` | TriskelGate → internal `TicketV1` schema mapper |
| `index.ts` | Barrel exports |

---

### Circuit Breaker

**File:** `src/adapters/triskelgate/circuitBreaker.ts`

The circuit breaker prevents cascading failures when TriskelGate is down.

#### State Machine

```
  ┌──────────┐     failure count     ┌──────────┐     reset timeout     ┌────────────┐
  │  CLOSED  │ ──── >= threshold ──▶ │   OPEN   │ ────── elapsed ────▶ │ HALF_OPEN  │
  │ (normal) │                       │(blocking)│                      │ (testing)   │
  └──────────┘                       └──────────┘                      └────────────┘
       ▲                                                                     │
       │                              success                                │
       └─────────────────────────────────────────────────────────────────────┘
                                     failure → back to OPEN
```

#### Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `failureThreshold` | `5` | Consecutive failures before opening circuit |
| `resetTimeoutMs` | `30,000` (30s) | Time before retrying (OPEN → HALF_OPEN) |

#### Behavior

- **CLOSED:** All requests pass through. On success, failure counter resets. On failure, counter increments.
- **OPEN:** All requests immediately throw `CircuitBreakerError`. After `resetTimeoutMs`, transitions to HALF_OPEN.
- **HALF_OPEN:** One test request allowed. On success → CLOSED. On failure → OPEN.

#### Error Handling

```typescript
// Thrown when circuit is OPEN
class CircuitBreakerError extends Error {
  name = 'CircuitBreakerError';
}

// Thrown on non-2xx HTTP responses
class TriskelGateApiError extends Error {
  status: number;   // HTTP status code
  body: string;     // Response body or status text
  url: string;      // Request URL
}
```

---

### TriskelGateClient

**File:** `src/adapters/triskelgate/client.ts`

#### Constructor Options

```typescript
interface TriskelGateClientOptions {
  baseUrl?: string;     // Default: 'https://tickets.xopsconference.com'
  apiKey?: string;      // Optional Bearer token
  timeoutMs?: number;   // Default: 10,000 (10s)
}
```

#### Methods

| Method | HTTP | Endpoint | Returns | Description |
|--------|------|----------|---------|-------------|
| `listEvents()` | GET | `/api/events` | `TGEvent[]` | List all events |
| `listTicketTypes(eventId)` | GET | `/api/events/:id/ticket-types` | `TGTicketType[]` | List ticket types for an event |
| `validateTicket(payload)` | POST | `/api/validate` | `TGValidateResponse` | Validate a ticket QR code |
| `createCheckout(payload)` | POST | `/api/payment/create-session` | `TGCheckoutResponse` | Create a Stripe checkout session |
| `getCheckoutSessionStatus(sessionId)` | GET | `/api/checkout/sessions/:id/status` | `TGCheckoutSessionStatus` | Check payment status |
| `getOrder(orderId)` | GET | `/api/orders/:id` | `TGOrder` | Get order details |

**Property:** `circuitState` — Exposes current circuit breaker state (`'CLOSED' | 'OPEN' | 'HALF_OPEN'`).

#### Internal Request Flow

1. Build URL from `baseUrl + path`
2. Create `AbortController` with `timeoutMs` deadline
3. Set headers: `Accept: application/json`, `Content-Type: application/json`, optional `Authorization: Bearer <apiKey>`
4. Execute `fetch()` with signal
5. On non-OK response: throw `TriskelGateApiError` with status, body, URL
6. Parse JSON and return typed result
7. Clear timeout in `finally` block

---

### Singleton Patterns

**Browser singleton** (used by frontend pages):
```typescript
// Created at module load time
export const triskelGateClient = new TriskelGateClient({
  baseUrl: import.meta.env.VITE_TRISKELGATE_URL
        || import.meta.env.VITE_TRISKELL_API_BASE_URL
        || 'http://localhost:3001',
});
```

**Server singleton** (for SSR/BFF use):
```typescript
export function getDefaultClient(): TriskelGateClient {
  // Lazy init, reads process.env.TRISKELGATE_BASE_URL
}
```

---

### Type Definitions

**File:** `src/adapters/triskelgate/types.ts`

```typescript
interface TGEvent {
  id: string;
  name: string;
  description?: string;
  date?: string;
  location?: string;
  status?: string;
}

interface TGTicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  available: boolean;
  isActive?: boolean;
  maxPerOrder?: number;
  features?: string[];
  purchaseUrl?: string;
}

interface TGCheckoutPayload {
  eventId: number | string;
  ticketTypeId: number | string;
  quantity: number;
  customerEmail: string;
  customerName?: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface TGCheckoutResponse {
  success: boolean;
  sessionUrl?: string;
  redirectUrl?: string;
  checkoutId?: string;
  message?: string;
  error?: string;
}

interface TGCheckoutSessionStatus {
  status: string;  // e.g., 'paid', 'pending', 'expired'
}

interface TGOrder {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  tickets: Array<{ id: string; ticketTypeId: string; code: string }>;
  total: number;
  currency: string;
  createdAt: string;
}

interface TGValidatePayload {
  ticketCode: string;
  eventId: string;
}

interface TGValidateResponse {
  valid: boolean;
  ticketId?: string;
  holderName?: string;
  ticketType?: string;
  message?: string;
}

interface TGApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

---

### Ticket Mapper

**File:** `src/adapters/triskelgate/mapTicket.ts`

Converts `TGTicketType` → `TicketV1` (internal schema matching `contracts/ticket.v1.json`).

```typescript
interface TicketV1 {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: 'EUR' | 'USD';
  available?: boolean;
  maxQuantity?: number;
  features?: string[];
  purchaseUrl?: string;
}
```

**Rules:**
- `id` and `name` are required; throws if missing
- Currency must be `EUR` or `USD` (case-insensitive); throws on unsupported
- Defaults currency to `EUR` if not specified
- `mapTicketTypes()` silently skips invalid entries, logging warnings

---

### BFF API Handlers

**File:** `src/api/tickets.ts`

Pure async functions that can be wired into any server framework.

| Function | Purpose | Validation |
|----------|---------|------------|
| `getTickets(params?)` | Get tickets for first active event (or specific `eventId`) | — |
| `createCheckout(body)` | Create Stripe checkout session | Requires `eventId`, `ticketTypeId`, `email`; `quantity >= 1` |
| `getOrder(orderId)` | Get order status and tickets | Requires `orderId` |
| `validateTicket(body)` | Validate ticket QR code | Requires `ticketCode`, `eventId` |

All handlers use `getDefaultClient()` (server singleton).

---

## AgoraPass Integration

**Status:** 🔲 Planned (currently static mocks)

AgoraPass is the identity and wallet platform for Sophia Metapolis. The integration points are scaffolded but use mock data.

### Current State

| Feature | File | Status |
|---------|------|--------|
| Wallet Login | `pages/wallet/WalletLogin.jsx` | ⚠️ Mock — magic link simulated with setTimeout |
| Wallet Dashboard | `pages/wallet/WalletDashboard.jsx` | ⚠️ Mock — hardcoded identity, stamps, communities |
| Auth Guard | `components/wallet/WalletGuard.jsx` | ✅ Implemented — checks `localStorage('wallet_auth_token')` |
| OAuth (Apple/GitHub) | `pages/wallet/WalletLogin.jsx` | ⚠️ Buttons present, not wired |

### Planned Integration

- **Env var:** `VITE_AGORAPASS_URL` (Dockerfile default: `https://app.agorapass.io`)
- **Auth flow:** Magic link or OAuth → receive `wallet_auth_token` → store in localStorage
- **Dashboard data:** Identity, stamps (verifiable credentials), community memberships from AgoraPass API

### Sophia Citizenship API

`SophiaPostulateStatus` attempts to call:
```
GET ${VITE_TRISKELL_API_BASE_URL}/api/citizenship/postulations/${handle}/status
```
Falls back to mock data on failure.

---

## Data Flow: Ticket Purchase

```
                                        ┌─────────────────┐
                                        │   Stripe.com    │
                                        │  (hosted page)  │
                                        └────────┬────────┘
                                                 │
                                          redirect back
                                                 │
┌───────────┐    listTicketTypes()    ┌──────────┴────────┐    createCheckout()    ┌──────────────┐
│  Tickets   │ ──────────────────────▶│   TriskelGate     │ ◀────────────────────── │   Tickets    │
│   page     │                        │   API Server      │                         │    page      │
│            │ ◀──── ticketTypes[] ───│                   │ ──── {sessionUrl} ────▶ │              │
└───────────┘                         └───────────────────┘                         └──────────────┘
                                              │                                           │
                                              │                                    redirect to
                                              │                                    Stripe sessionUrl
                                              │
                                     ┌────────┴────────┐
                                     │  CheckoutSuccess │
                                     │  /checkout/      │
                                     │  success?        │
                                     │  session_id=X    │
                                     └────────┬────────┘
                                              │
                                    getCheckoutSessionStatus()
                                     poll every 2s (max 60s)
                                              │
                                       status === 'paid'
                                              │
                                     ┌────────▼────────┐
                                     │   Confirmed!     │
                                     │   Show summary   │
                                     └─────────────────┘
```

### Step-by-Step

1. **User visits** `/tickets` or `/events/x-ops-conference-dubai-2026/buy`
2. **Selects tier** (Executive/VIP) → enters name + email via `window.prompt()`
3. **Frontend calls** `triskelGateClient.listTicketTypes(eventId)` to find matching ticket type ID
4. **Frontend calls** `triskelGateClient.createCheckout({...})` with ticket type, quantity, customer info, and success/cancel URLs
5. **TriskelGate returns** `{ sessionUrl }` (Stripe hosted checkout page URL)
6. **Browser redirects** to Stripe checkout
7. **After payment**, Stripe redirects to `/checkout/success?session_id=XXX`
8. **CheckoutSuccess** polls `triskelGateClient.getCheckoutSessionStatus(sessionId)` every 2 seconds
9. **When status is `'paid'`**, shows confirmation with event summary
10. **If cancelled**, Stripe redirects to `/checkout/cancel`

---

## Environment Variables for Integrations

| Variable | Default (dev) | Default (Docker) | Purpose |
|----------|---------------|-------------------|---------|
| `VITE_TRISKELL_API_BASE_URL` | `http://localhost:3001` | — | TriskelGate API base URL |
| `VITE_TRISKELGATE_URL` | — | `https://tickets.xopsconference.com` | TriskelGate URL (takes priority) |
| `VITE_TRISKELL_EVENT_ID` | `1` | — | Active event ID in TriskelGate |
| `VITE_AGORAPASS_URL` | — | `https://app.agorapass.io` | AgoraPass wallet URL |
| `VITE_API_BASE_URL` | — | `https://api.xopsconference.com` | General API base URL |
