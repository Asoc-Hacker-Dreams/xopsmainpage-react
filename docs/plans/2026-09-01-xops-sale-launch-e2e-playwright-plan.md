# Plan — E2E Playwright: apertura de venta X-Ops Conference (Madrid + Dubai)

Run Holos: `2026-09-01T10-31-16-290Z-7sfhh7` · Fecha: 2026-09-01

## Objetivo

Validar **por UI y con Playwright** que el primer día de venta de entradas de la
X-Ops Conference funciona de punta a punta en **producción** (https://xopsconference.com):

1. Se puede comprar una entrada de Madrid y una de Dubai sin errores.
2. Cada compra queda **correctamente registrada** (orden `completed`, ticket con QR,
   contador `soldCount` incrementado).
3. Se captura **screenshot de cada paso** del flujo, con nombres numerados que
   reflejen el paso, en `/Users/antonioj/Repos/spectertj/hsm/screenshots`.

## Contexto (verificado hoy contra producción)

| Capa | Estado verificado |
|---|---|
| Web Vercel | `https://xopsconference.com` — `/tickets` redirige a `/?openTickets=1` y abre `TicketModal` |
| API TriskelGate (Azure Container App) | `GET /api/events` → Madrid id=1 (EUR), Dubai id=2 (AED), ambos `active` |
| Ticket types | 6 tiers por evento; **todos** con `saleStartDate=2026-09-01T00:00:00Z` (venta abre HOY). Más barato: *Super Early Adopter* — 15 EUR (Madrid, ttId=1) / 60 AED (Dubai, ttId=7) |
| Stripe | **Modo test en producción**: `create-session` devuelve `cs_test_*` → la tarjeta `4242 4242 4242 4242` completa el pago sin cargo real |
| Registro | Webhook `checkout.session.completed` marca la orden `completed` y genera tickets + QR; verificable vía `GET /api/checkout/sessions/{id}/status` |
| Cookie banner | Presente en la home ("Aceptar Todo" / "Solo esenciales") — el test lo descarta |

## Cambios

**Solo se añaden ficheros nuevos. No se toca nada del flujo de compra ni del backend.**

| Fichero | Acción |
|---|---|
| `e2e/tests/tickets-sale-launch.spec.ts` | **NUEVO** — spec E2E completa contra producción |
| `e2e/playwright.production.config.ts` | **NUEVO** — config con `baseURL=https://xopsconference.com`, `webServer` desactivado, un único proyecto chromium |
| `docs/plans/2026-09-01-xops-sale-launch-e2e-playwright-plan.md` | Este plan |
| `../screenshots/*.png` | Salidas del test (carpeta fuera de ambos repos; no entra en commits) |

**No se toca:** `e2e/playwright.config.ts`, `TicketModal.jsx`, `TicketSuccess.jsx`,
TriskelGate, ningún despliegue.

## Estrategia

### Flujo cubierto (por ciudad: Madrid y Dubai)

1. **Home** → goto `/?openTickets=1`; descartar cookie banner si aparece; screenshot de la home con el modal abierto.
2. **Modal selección** → esperar `.ticket-selection-modal` y 2 `.event-section`; screenshot mostrando tiers y precios de ambos eventos.
3. **Checkout** → pulsar el botón del tier *Super Early Adopter* de la ciudad objetivo → paso checkout del modal → rellenar `#tm-name` / `#tm-email` con datos de test → screenshot del formulario → submit.
4. **Stripe Checkout** → la app hace `window.location.href = sessionUrl`; esperar URL `checkout.stripe.com` → screenshot de la página de pago.
5. **Pago** → rellenar tarjeta de test Stripe (número `4242 4242 4242 4242`, caducidad `12/34`, CVC `123`, nombre, código postal) y pulsar **Pay** → screenshot de confirmación de procesamiento. Estrategia de selectores: Stripe Checkout renderiza los campos en un iframe interno; se localizan por `data-elements-stable-field-name` (cardNumber, cardExpiry, cardCvc) tras entrar en el frame, con fallback a placeholders. Timeouts generosos (30–60 s).
6. **Éxito** → redirect a `/tickets/success?session_id=cs_test_…`; esperar `.ticket-success-page`, `.success-title` y `.order-id` (la página hace polling al status) → screenshot con número de pedido y QR visibles.

### Verificación de registro (fuera de la UI, sin mutar nada)

7. `GET /api/checkout/sessions/{session_id}/status` → `status === 'completed'`, `orderNumber` presente, `tickets[]` no vacío con `qrCode`.
8. `GET /api/events/{id}/ticket-types` → `soldCount` del tier comprado incrementado respecto al valor capturado ANTES de la compra (baseline al inicio del test).
9. Evidencia escrita a `~/.holos/loop/2026-09-01T10-31-16-290Z-7sfhh7/evidence/` (salida de Playwright + resumen de IDs de orden/sesión).

### Screenshots (destino: `/Users/antonioj/Repos/spectertj/hsm/screenshots`, override vía env `SCREENSHOT_DIR`)

Numerados globalmente para reflejar el orden del E2E:

| # | Nombre | Paso |
|---|---|---|
| 01 | `01-home-modal-tickets.png` | Home con modal de tickets abierto |
| 02 | `02-modal-seleccion-madrid-dubai.png` | Tiers y precios de ambos eventos |
| 03 | `03-madrid-formulario-checkout.png` | Formulario nombre+email (Madrid) |
| 04 | `04-madrid-stripe-checkout.png` | Página de pago Stripe (Madrid) |
| 05 | `05-madrid-stripe-pago-procesando.png` | Pago enviado / procesando (Madrid) |
| 06 | `06-madrid-exito-orden-qr.png` | Compra confirmada + orden + QR (Madrid) |
| 07 | `07-dubai-formulario-checkout.png` | Formulario nombre+email (Dubai) |
| 08 | `08-dubai-stripe-checkout.png` | Página de pago Stripe (Dubai) |
| 09 | `09-dubai-stripe-pago-procesando.png` | Pago enviado / procesando (Dubai) |
| 10 | `10-dubai-exito-orden-qr.png` | Compra confirmada + orden + QR (Dubai) |

### Datos de test

- Madrid: "E2E Sale Launch Madrid" · `e2e-sale-launch-madrid@xopsconference.com`
- Dubai: "E2E Sale Launch Dubai" · `e2e-sale-launch-dubai@xopsconference.com`

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Cada compra consume 1 unidad real de inventario (tier *Super Early Adopter*: 50 uds) y crea orden real en BD prod | **Exactamente 1 compra por ciudad (2 en total)**, tier más barato, datos claramente de test e identificables. No ejecutar más compras sin aprobación explícita |
| Selectores de Stripe Checkout pueden variar (iframes) | Esperas por `data-elements-stable-field-name` + fallbacks + timeouts 60 s; si el pago automatizado resulta imposible en verify, se reporta con evidencia en lugar de forzar el estado |
| Webhook tarde > la ventana de polling de la success page (15×2 s) | La aserción de registro usa `GET status` directo del test con reintento propio hasta 60 s, independiente del polling de la UI |
| Rate limiters de TriskelGate en prod | Solo 2 `create-session` en todo el run; sin reintentos agresivos |

## Pasos de ejecución

1. **[execute]** Crear `e2e/playwright.production.config.ts` y `e2e/tests/tickets-sale-launch.spec.ts`.
2. **[execute]** Dry-run sintáctico: `npx playwright test --config=e2e/playwright.production.config.ts --list` (no compra nada).
3. **[verify]** Ejecutar el test completo (2 compras); guardar log y screenshots.
4. **[verify]** Comprobar registro vía API (status completed + QR + soldCount).
5. **[verify]** Escribir evidencia en `~/.holos/loop/<run-id>/evidence/`.

## Criterios de aceptación

- [ ] 2 compras completadas por UI (1 Madrid + 1 Dubai) sin errores.
- [ ] 10 screenshots en `hsm/screenshots` con nombres numerados que reflejan los pasos.
- [ ] Para cada compra: `GET /api/checkout/sessions/{id}/status` → `completed` con tickets + QR.
- [ ] `soldCount` del tier comprado incrementado en 1 respecto al baseline.
- [ ] Ninguna mutación fuera de las 2 órdenes de test (sin cambios de código de producto, sin despliegues).

## Ejecución

```bash
cd /Users/antonioj/Repos/spectertj/hsm/xopsmainpage-react
# lista los tests (sin ejecutar)
npx playwright test --config=e2e/playwright.production.config.ts --list
# ejecución real (produce 2 órdenes de test en producción)
npx playwright test --config=e2e/playwright.production.config.ts --project=chromium
```
