# X-Ops Conference — UTMs, GA4 checkout funnel and verified revenue attribution

**Owner:** frontend changes in PR #175; TriskelGate, Stripe webhook handling, Holos CRM/ERP and optional GA4 Measurement Protocol are **backend owner scope**.

**Status:** frontend implemented. Revenue events are **fail-closed** until the status endpoint exposes verified ecommerce data. This design MUST NOT be described as accurate full-funnel revenue tracking until the release gates below pass.

## 1. Visitor journey across all three hosts

1. Visitor lands on `xopsconference.com`, `madrid.xopsconference.com` or `dubai.xopsconference.com` with allowed `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_content`, `utm_term` parameters.
2. **No analytics consent:** no UTM attribution is persisted and Google Analytics is not loaded. All required checkout functions remain available.
3. **Explicit analytics consent:** the site captures sanitized first and last campaign touches in **sessionStorage** (24-hour maximum, lost when the tab is closed), emits SPA `page_view` events and registers allowed GA4 events.
4. On an explicit click to a *different* X-Ops host, only sanitized, consented campaign parameters are added to that X-Ops link. They are **never** appended to Stripe, Sessionize or third-party links. GA4 cross-domain linker uses `_gl`; configure all event hosts on the **same GA4 web stream**.
5. Ticket modal opening logs `select_item` and `begin_checkout` with edition, currency and the backend-supplied ticket ID/tier. It does **not** report revenue from potentially VAT-inclusive displayed prices.
6. When TriskelGate successfully creates Stripe Checkout, frontend logs `checkout_redirect`, preserves UTMs in same-tab storage, and redirects only to `https://checkout.stripe.com/...`. Cancellation returns to `/checkout/cancel`; `checkout_cancel` fires only when a recent consented checkout marker exists.
7. The success URL may contain `session_id` for reconciliation, but **no GA4 page_view or event sends that value or the buyer's name/email**. The SPA pageview URL is stripped of sensitive query parameters.
8. `TicketSuccess.jsx` polls TriskelGate's **server-verified** checkout session. It displays "confirmed" only when TriskelGate returns `success:true`, `status:'paid'|'completed'` and `orderNumber`.
9. A GA4 `purchase` is emitted **only** when TriskelGate also provides a validated `ecommerce` object with canonical `transaction_id`, currency, net value and item details; never on the sole basis of a success redirect. A 30-day local transaction ledger and GA4's web-stream transaction ID deduplication suppress refresh/remount repeats.
10. On consent withdrawal, optional GA4 is stopped and controlled analytics cookies/UTM/checkout/ledger storage are cleared.

## 2. Feature flags and deployment configuration

| Frontend build variable | Default | Action |
| --- | --- | --- |
| `VITE_GA_MEASUREMENT_ID` | Existing `G-0J9VPTTHQT` fallback | Verify that the **same intended production GA4 web stream** covers all three hosts |
| `VITE_TRISKELL_ATTRIBUTION_ENABLED` | `false` | Set `true` **only when create-session accepts and persists `attribution`** |
| `VITE_GA4_PURCHASE_MODE` | `client` | `client` = verified browser purchase; `server` = browser never emits purchase, backend GA4 Measurement Protocol becomes single authoritative emitter |
| `VITE_TRISKELL_LEGAL_METADATA_ENABLED` | `false` | Separate legal-acceptance feature; enable only when backend supports it |

Never place a GA4 Measurement Protocol `api_secret`, Stripe API key, Holos API key or TriskelGate admin credential into a `VITE_` variable. The GA4 measurement ID is public; API secrets are not.

## 3. Backend API contract #1: checkout attribution (optional gated extension)

Keep the existing `POST /api/payment/create-session` request shape and add this field only when supported and opted-in:

```json
{
  "eventId": "backend-event-123",
  "ticketTypeId": "backend-ticket-456",
  "quantity": 1,
  "customerName": "provided only to ticketing/Stripe backend",
  "customerEmail": "provided only to ticketing/Stripe backend",
  "successUrl": "https://madrid.xopsconference.com/tickets/success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://madrid.xopsconference.com/checkout/cancel",
  "attribution": {
    "version": 1,
    "firstTouch": {
      "utm_source": "linkedin", "utm_medium": "paid", "utm_campaign": "executive_summit"
    },
    "lastTouch": {
      "utm_source": "newsletter", "utm_medium": "email", "utm_campaign": "last_call"
    },
    "firstCapturedAt": "2026-10-27T12:30:00.000Z",
    "lastCapturedAt": "2026-10-27T12:45:00.000Z",
    "gaClientId": "123456789.987654321",
    "gaSessionId": "1793040000",
    "analyticsConsentVersion": "2026-10-27"
  }
}
```

Illustrative payload. Only the six allowlisted, sanitized UTMs are supported. `gaClientId` and `gaSessionId` are optional and included only if GA4 has loaded with valid analytics consent. The frontend does not send `attribution` without affirmative analytics consent or when the feature flag is disabled.

**Backend owner must:** validate the ticket/event IDs against the database, sanitize UTM allowlist/length on the server again, verify consent provenance, attribute the **created order** to the campaign rather than merely creating an anonymous lead, and save first/last touch and GA identifiers in appropriate order/CRM metadata (not in public tickets). Persist appropriate server timestamps and source; never trust a browser claim that a payment is successful.

Recommended linkage in Holos CRM / ERP and TriskelGate: internal `orderId` (stable), `orderNumber` (GA4 `transaction_id`), `checkoutSessionId` (internal only), event edition, ticket tier, commercial source/campaign, totals, currency, tax and settlement status. Do not expose email/phone or Stripe session identifiers in GA4 parameters.

## 4. Backend API contract #2: verified purchase response (REQUIRED for client purchase mode)

Extend existing `GET /api/checkout/sessions/:id/status`. The response must only include `ecommerce` after authenticated Stripe webhook/payment verification AND a persisted order whose status is `completed` or `paid`.

```json
{
  "success": true,
  "status": "completed",
  "orderId": 12345,
  "orderNumber": "HBC-2026-000123",
  "totalAmount": 121.00,
  "tickets": [{ "id": 123, "qrCode": "opaque-ticket-token", "ticketNumber": "T-000123" }],
  "ecommerce": {
    "transaction_id": "HBC-2026-000123",
    "currency": "EUR",
    "value": 100.00,
    "tax": 21.00,
    "edition": "madrid",
    "items": [
      {
        "item_id": "SUMMIT-MADRID-2026",
        "item_name": "X-Ops Summit",
        "price": 100.00,
        "quantity": 1,
        "item_category": "Summit",
        "item_variant": "SUMMIT"
      }
    ]
  }
}
```

**Amounts are illustrative, not a fiscal decision.** GA4 `value` is the sum of item net `price * quantity`, excluding tax and shipping; `tax` is a separate optional event field. If discounts apply, return per-item net paid prices so the sum matches within rounding tolerance. Use the **actual settlement currency** (`EUR`, `AED` or whichever applies). The frontend rejects mismatched currency/value/transaction IDs, empty `items`, invalid quantities, and non-paid statuses.

Do not use `session_id`, `payment_intent` or user email as the GA4 transaction ID. Use a stable, unique, non-PII `orderNumber`. The backend status route must not leak order details to other purchasers: authorise session access and rate-limit it. The frontend cannot make that security decision.

### Server-side purchase mode for more reliable reconciliation

A browser event cannot be guaranteed to reach GA4: users can block tags, revoke consent, close tabs and never visit the confirmation page. For reliable reporting the **backend** should consider a signed, idempotent Stripe webhook as the system of record and, **only where lawful and consent was recorded**, emit GA4 `purchase` via Measurement Protocol with `client_id` and `session_id` from the consented checkout, a unique transaction ID, correct items and value. Use the API secret **only on the server**. Set `VITE_GA4_PURCHASE_MODE=server` when doing this, so the frontend does not submit a competing purchase event. Document refunds with matching transaction IDs. GA4 is an analytics view; Holos ERP remains the financial source of truth.

## 5. GA4 administration setup — required outside code

- Same GA4 property and intended web stream across `xopsconference.com`, `madrid.xopsconference.com`, `dubai.xopsconference.com`.
- Enable cross-domain measurement for those domains in **Admin → Web stream → Google tag → Configure your domains**. The frontend also provides a consent-gated linker. Do not list Stripe as an owned cross-domain site.
- Add `checkout.stripe.com` and relevant payment providers under **List unwanted referrals** so paid visitors returning from checkout are not misclassified as Stripe referrals.
- Since the frontend manually sends SPA `page_view` and sets `send_page_view:false`, disable overlapping history-change pageviews in Enhanced Measurement to avoid double counting.
- In GA4 Admin → Custom definitions, add event-scoped dimensions for `xops_edition`, `xops_utm_source`, `xops_utm_medium`, `xops_utm_campaign`, `xops_utm_id` (if useful). GA4 also uses standard UTMs on the consented landing `page_location` for built-in session campaign attribution.
- Verify `purchase` in the GA4 Monetization reports and DebugView; separate reports for Madrid and Dubai by `xops_edition`. Never make `begin_checkout` itself a revenue event.
- Apply data retention settings appropriate to your privacy policy; review GA4 Google Signals and advertising settings separately. The basic consent implementation blocks tags before opt-in and keeps advertising consent denied.

## 6. Release and QA matrix (all hosts, both languages)

| Scenario | Expected |
| --- | --- |
| Visit with `?utm_source=linkedin&utm_campaign=summit`, no consent | No GA4 requests, no UTM storage, no order attribution |
| Accept analytics | Exactly one tag loaded; `page_view` with sanitized UTMs; first touch stored |
| Navigate within React routes | Sanitized SPA `page_view`; no duplicate `config` |
| Click Madrid → Dubai cross-host link | Opted-in UTM tags on X-Ops destination only; no tags appended to Stripe |
| Open ticket checkout | `select_item` and `begin_checkout` with backend ticket ID, edition and currency; no imaginary revenue |
| Create Stripe session | Valid Stripe redirect, consented checkout marker, `checkout_redirect`; attribution forwarded only if flag and backend ready |
| Cancel at Stripe | `checkout_cancel` once when checkout marker exists; direct visit to cancel route not counted |
| Return to `/tickets/success?session_id=cs_...` | `page_location` contains no `session_id`, email, token or arbitrary URL query |
| Backend reports `pending`, `expired`, `completed` without ecommerce, or fake totals | **Zero** `purchase` events |
| Backend confirms paid order with valid ecommerce | GA4 `purchase` includes net value, currency, items and unique `transaction_id` |
| Refresh success page / React re-mount / second tab | Browser ledger plus GA4 dedup keeps the same paid transaction from counting twice |
| Revoke analytics | GA4 stopped; analytics storage and UTM/checkout/ledger cleared; ticket purchase still works |
| Switch backend Measurement Protocol on | Change purchase mode to `server`; verify exactly one server-side purchase per paid order |
| Reconcile finance | Daily compare Stripe completed payments, TriskelGate orders, Holos ERP invoices and GA4 purchases; document consent and browser measurement gaps |

**Do not claim 100% marketing attribution or full purchase capture** from GA4 in an opt-in setup; some journeys cannot legally or technically be tracked. TriskelGate/Holos reconciliation remains necessary.

## 7. Official technical references

- GA4 ecommerce: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- GA4 recommended events / purchase value: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- GA4 transaction ID dedup: https://support.google.com/analytics/answer/12313109
- GA4 DebugView ecommerce validation: https://developers.google.com/analytics/devguides/collection/ga4/validate-ecommerce
- Basic Consent Mode v2: https://developers.google.com/tag-platform/security/guides/consent
- GA4 cross-domain measurement: https://developers.google.com/tag-platform/devguides/cross-domain
- GA4 server Measurement Protocol: https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events
