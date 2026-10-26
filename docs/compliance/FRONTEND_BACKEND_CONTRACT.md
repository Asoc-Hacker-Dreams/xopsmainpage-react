# X-Ops Conference 2026 — Frontend Compliance Remediation & Backend Contract

**Scope:** frontend on `xopsconference.com`, `madrid.xopsconference.com` and `dubai.xopsconference.com`. Backend services are owned and implemented separately. **PR #175 is a draft until release gates are met.**

## 1. Canonical entities — verified vs unverified

| Role | Public identification | Verification needed |
| --- | --- | --- |
| Organiser / website operator | Asociación Hacker Dreams — CIF **G56643158** | Registered office and association registry entry |
| Payment collection entity | Odin Hermes & Danu Technology Solutions LLC (Delaware, US) | Full legal address; role / settlement agreements |
| Payment service | Stripe | Actual **merchant of record** and seller/trader **per city**; invoice issuer, tax jurisdiction and descriptor |
| Operational CRM / ERP | Holos CRM / Holos ERP | Actual data-processing roles, DPA, retention, permissions and integrations |
| Ticketing | TriskelGate | Checkout/legal evidence storage, invoice and tax integration |

**Never call the collector, legal seller, invoice issuer and organiser the same entity without supporting documentation.** Previous live Stripe checkout showed "X-Ops Consulting" while internal ERP records associate Madrid invoicing with Hacker Dreams and Dubai billing with Odin. That discrepancy is **not resolved** by editing the frontend.

## 2. Frontend files and public routes

| Surface | Source | Acceptance requirement |
| --- | --- | --- |
| Legal identity | `src/pages/LegalNotice.jsx`, `src/legal/identity.js` | Names, CIF, registered addresses, registry, collector role accurately presented ES/EN |
| Privacy EU | `src/legal/privacyContent.js` + `src/pages/PrivacyPolicy.jsx` | Art. 13 GDPR, controllers, bases, categories, recipients, data transfers, retention, rights |
| Privacy UAE | same, `/politica-de-privacidad/dubai` | UAE PDPL topics, scope and cross-border transfers without claiming inapplicable blanket compliance |
| Cookies | `src/legal/noticesContent.js`, `src/components/CookieConsentBanner.jsx`, `src/components/CookiePreferencesDialog.jsx`, `src/contexts/ConsentContext.jsx`, `src/services/scriptManager.js` | Accept/reject same prominence; no pre-consent GA; 12-month expiration; reversible decision; storage inventory |
| Ticket terms | `src/legal/termsContent.js` | Separate Madrid and Dubai conditions, product entitlements, changes and cancellations |
| Pre-Stripe checkout | `src/components/TicketModal.jsx`, `src/i18n/locales/{es,en}.json` | Selected city, product entitlements, price, seller/collector roles, tax caveats, withdrawal, affirmative terms choice, version |
| Startup Pack | `src/pages/StartupPack.jsx` | Short privacy notice, only necessary application declarations, optional unselected newsletter; calls own-origin backend API |
| External CFP / volunteer forms | `src/pages/ExternalApplicationNotice.jsx` | Privacy summary before Sessionize or Microsoft Forms links |
| Sponsors / attendee contacts | `src/pages/SponsorPrivacy.jsx`, `src/pages/Networking.jsx` | No auto-disclosed attendee lists, explicit third-party stand collection, opt-in directory / QR |
| Images / recording | `src/pages/PhotographyPolicy.jsx`, `src/pages/PostEventPage.tsx` | On-site notice text, separate speaker permissions, objections/removal route, no demo media in production |
| Legal navigation | `src/App.jsx`, `src/legal/LegalDocument.jsx` | All routes reachable from every host and both languages |

Routes:
- `/aviso-legal`
- `/politica-de-privacidad` (host-aware), `/politica-de-privacidad/madrid`, `/politica-de-privacidad/dubai`
- `/politica-de-cookies`
- `/terminos-de-servicio` (host-aware), `/terminos-de-servicio/madrid`, `/terminos-de-servicio/dubai`
- `/privacidad-patrocinadores`
- `/fotografia-y-video`
- `/voluntariado`, `/convocatoria-ponentes`

## 3. Backend handoff — do not implement in this frontend PR

### 3.1 Stripe / TriskelGate: final checkout identity and evidence

Current existing browser request:

```json
{
  "eventId": "existing API event ID",
  "ticketTypeId": "existing API ticket ID",
  "quantity": 1,
  "customerEmail": "buyer@example.com",
  "customerName": "Buyer Name",
  "successUrl": "https://{host}/tickets/success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://{host}/?openTickets=1"
}
```

**Optional frontend field**, gated until backend compatibility is verified by `VITE_TRISKELL_LEGAL_METADATA_ENABLED=true`:

```json
{
  "legalAcceptance": {
    "accepted": true,
    "edition": "madrid",
    "legalVersion": "2026-10-26",
    "acceptedAtClient": "2026-10-26T17:00:00.000Z",
    "locale": "es"
  }
}
```

**Required backend implementation** (not part of this branch):
1. Validate event `edition` from trusted `eventId` rather than browser input.
2. Store evidence **server-side** linked to order/session, including versioned terms, price/tax, chosen ticket, server timestamp, buyer/session reference, text hash and merchant of record. A browser checkbox or timestamp alone is not legal proof.
3. Resolve the **actual contractual seller** and **invoice issuer** independently for each edition. Match Stripe business settings, descriptor, receipts, invoices, refund policy and total.
4. Confirm Spanish ticket product tax treatment; determine Dubai/AE/US tax treatment separately. Don't rely on fixed "IVA incluido" in Dubai.
5. Send post-contract confirmation with a durable copy/version of conditions and a clear support/refund channel; preserve legacy purchasers' original terms.
6. Verify all bank/payout arrangements and contracts for the payment collection entity.

### 3.2 Startup Pack → Holos CRM

The browser calls **same-origin** `POST /api/startup-application` with JSON; no secret is available in the frontend. Fields currently sent: `email`, `firstName`, `lastName`, `companyName`, `website`, `country`, `city` (comma-separated edition keys), `stage` (ARR band), `employees`, `category`, `jobTitle`, `linkedin`, `productDesc`, `foundedDate`, `docType`, `newsletterConsent` (boolean, false by default), and `privacyNoticeVersion` (date string).

Backend owner should:
- Implement origin-approved HTTPS API on the same public host. Server authenticates privately to Holos CRM `POST /api/v1/contacts` and appropriate company/deal records, **never with a `VITE_` key**.
- Enforce field limits, schema, rate limiting, bot protection, abuse safeguards and duplicate/idempotent submissions; reflect accurate success/failure to caller. Handle existing email without data leakage.
- Store marketing-consent provenance, version, time and the independent decision; marketing checkbox must not be conflated with event operations.
- Use Holos CRM / ERP, not legacy HubSpot. Disable remaining scheduled HubSpot sync, tokens and webhook jobs separately in the backend; website script removal is not global migration proof.
- On successful submission respond with 2xx; on transient failure respond 5xx; do not return success until it has been persisted.
- Add monitoring, audit, retention and data subject rights workflows. Restrict cross-border processing in accordance with assessed EU/UAE transfer rules.

**No serverless `api/startup-application.js` implementation is included in this branch.** The endpoint must be supplied and deployed by the backend owner.

### 3.3 Other systems and legally significant data flows

- Microsoft Forms: add a genuine collection-layer notice identifying organiser, purpose, basis, recipients, retention and rights. A link on our website is not a substitute.
- Sessionize: confirm controller/processor responsibilities, speaker photography/licence, publishing permissions and a reasonable review/retention workflow.
- Sponsor lead capture: implement QR/badge scan consent, authorised sponsor identity, disclosure records, purpose, expiry, withdrawal and restrictions on export. **Do not expose an all-attendee export.**
- Images: maintain signed speaker agreements and authorisations for specific promotional interviews/close-ups, supplier DPAs, a withdrawal/objection intake and removal procedures.
- Consent/CMP: backend evidence storage if required by governance; frontend uses localStorage for cookie choices and cannot prove server-side consents.
- UAE: validate event licensing, controller roles, local consumer requirements and international transfers with counsel for the actual structure; use actual legal addresses, not the event venue.

## 4. Release gate — must be satisfied before merge/deploy

- [ ] Confirm registered office: `VITE_HACKER_DREAMS_ADDRESS` (public build variable).
- [ ] Confirm association registry entry: `VITE_HACKER_DREAMS_REGISTRY` (public build variable).
- [ ] Confirm collector full registered address: `VITE_ODIN_LEGAL_ADDRESS` (public build variable).
- [ ] Confirm merchant of record, invoice issuer, refund obligations and business/tax footprint in Madrid and Dubai.
- [ ] Review final ES/EN legal texts with appropriately qualified Spanish and UAE counsel. Copy is not proof of legal compliance.
- [ ] Verify Holos CRM submission E2E (success, 409 duplicate, 4xx invalid, 5xx offline, timeout, privacy-safe logs).
- [ ] Enable `VITE_TRISKELL_LEGAL_METADATA_ENABLED=true` only once TriskelGate accepts and persistently audits versioned acceptance metadata.
- [ ] Verify visitor without consent does not request `js-eu1.hs-scripts.com`, HubSpot pixels or Google Analytics; after opt-in only GA is loaded once; after withdrawal future tracking stops and first-party GA cookies are deleted.
- [ ] Verify cookies and policies on **three** hosts independently in ES and EN, desktop and mobile, including keyboard and screen reader.
- [ ] Check payment summary/Stripe branding, post-payment confirmation, refunds and actual invoices using safe test purchases for **both** cities.
- [ ] Verify sponsor and speaker forms, privacy links, Sessionize/Microsoft redirects, camera signage, photographic permissions and data rights contact.
- [ ] Confirm CI build, unit tests, security/headers and production preview. The existing GitHub build pipeline previously failed at the Playwright prerender step because Chromium had not been installed.

## 5. Evidence and policy maintenance

Keep screenshots of first-layer CMP and custom controls, test request logs before/after consent, legal text versions, checkout acceptance evidence, vendor DPA and transfer assessment inventory, a copy of Stripe merchant identity by country, and one successful/failed application test per edition.

Any new tracker, sponsor integration, payment company, event location or contractual offer must trigger revalidation of the **frontend disclosures and the backend processing configuration**. The frontend and backend should be released together only after their contracts are proven.

## 6. Campaign UTMs, GA4 revenue and checkout traceability

The frontend now implements consent-gated first/last-touch UTMs, GA4 SPA/funnel events and the paid-only purchase event contract. Detailed payloads, testing, GA4 Admin configuration and responsibility boundaries are in **[GA4_UTM_CHECKOUT_HANDOFF.md](./GA4_UTM_CHECKOUT_HANDOFF.md)**.

**Backend release blocker:** `POST /api/payment/create-session` must accept optional `attribution` and persist it on the order before `VITE_TRISKELL_ATTRIBUTION_ENABLED=true`. Its response must be bound to a verified payment. `GET /api/checkout/sessions/:id/status` must return `success:true`, `status:paid|completed`, a non-empty stable `orderNumber`, and a verified `ecommerce` object with the same `transaction_id`, net item `value`, `currency`, tax and item details before the browser emits GA4 `purchase`.

For stronger post-payment coverage, the backend should make the Stripe paid webhook the source of truth and send consented Measurement Protocol purchases with idempotency. Switch `VITE_GA4_PURCHASE_MODE=server` when that exists to avoid a competing client purchase emitter. Never expose GA4 API secrets in Vite variables.
