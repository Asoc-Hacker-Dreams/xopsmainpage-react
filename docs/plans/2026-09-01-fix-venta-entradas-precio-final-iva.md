# Plan — Reparación venta de entradas X-Ops + precio final con IVA y comisiones incluidas

**Fecha:** 2026-09-01
**Run Holos:** `2026-09-01T10-31-16-290Z-7sfhh7`
**Informe de defectos:** `docs/reports/2026-09-01-defectos-venta-entradas-xops.md`

## Objetivo

1. **Desbloquear la entrega de entradas** (el comprador paga pero nunca ve su QR).
2. **Entregar el QR por los dos canales**: en pantalla **y por email**.
3. **El precio mostrado es el precio cobrado**: IVA y comisiones absorbidos
   internamente, nunca añadidos encima del precio de la tarjeta.
4. **Preservar el desglose interno** (base imponible, IVA, comisión plataforma,
   comisión Stripe) para que el ERP de Holos emita la factura correcta.
5. **Precios de Dubai adaptados al mercado local**: 180 → 900 AED.

## Decisiones de negocio (fijadas por el usuario, 2026-09-01)

| # | Decisión |
|---|----------|
| 1 | **`subtotal` = sin IVA (base imponible). `totalAmount` = con IVA.** |
| 2 | **Dubai cobra en AED** — verificado que la cuenta Stripe lo acepta. Precios locales: entrada más barata **180 AED**, tope **900 AED** |
| 3 | Las órdenes ya cobradas **no son reales** (Stripe en test mode) → no hay reembolsos que gestionar |
| 4 | El QR va **en pantalla y por email**, remitente `no_reply@xopsconference.com`. El mismo correo lleva **QR + factura** |
| 5 | Dubai tributa: **VAT 5 %** de EAU (Madrid **IVA 21 %**) |

### Modelo fiscal: plataforma Delaware (estilo Eventbrite)

**Decisión del usuario:** la sociedad de **Delaware (US)** factura al asistente en
**ambas sedes**, en **moneda local** (EUR / AED). Actúa como plataforma de venta:
cobra al asistente, retiene su comisión y **transfiere el neto a la entidad local**,
que es quien después liquida el IVA/VAT de su jurisdicción.

Esto son **ingresos externos** para la entidad española: no es la venta directa del
ticket, es el ingreso que recibe de la plataforma.

```
Asistente ── paga 15 € / 180 AED ──▶  Delaware LLC (plataforma)
                                        │  factura al asistente en moneda local
                                        │  retiene comisión de plataforma + Stripe
                                        ▼
                                     transfiere neto ──▶ entidad local (ES / AE)
                                                            │
                                                            ▼
                                                  liquida IVA 21 % / VAT 5 %
```

| Tramo | Emisor | Destinatario | Impuesto |
|-------|--------|--------------|----------|
| Venta del ticket | **Delaware LLC** | asistente | **0 % / exento** — sin *nexus* en ES/EAU; el `USTaxAdapter` sólo conoce *sales tax* estatal |
| Transferencia del neto | Delaware LLC | entidad local | ingreso externo para la local |
| Liquidación fiscal | entidad local | Hacienda ES / FTA EAU | **21 % ES · 5 % EAU** |

Tipo de EAU confirmado en la Federal Tax Authority (`tax.gov.ae`): **5 %**.
El ERP ya trae `UAETaxAdapter` (VAT 5 %) y `SpainTaxAdapter` (IVA 21 %) registrados.

### Consecuencias sobre el ERP (revisan D1/D2)

Este modelo **no es** el que el ERP implementa hoy. Tres puntos a resolver:

1. **`_get_billing_company()` resuelve la sociedad por moneda**
   (`integration_sync_service.py:41-47`). Con Delaware facturando EUR y AED, esa
   sociedad tendría que resolver para **dos monedas distintas**, pero la función
   exige *exactamente una* `Company` activa por moneda y `Company.currency` es un
   único valor (`models/company.py:25`). **Hay que romper ese acoplamiento**:
   resolver la sociedad facturadora por *plataforma*, no por moneda, y permitir
   emitir en divisa distinta a la de la sociedad.

2. **El impuesto se toma del país de la sociedad** (`country_code=company.country_code`,
   línea 146). Con Delaware sería `US` → *sales tax* estatal, que no aplica a un
   asistente en Madrid o Dubai. Debe emitirse **exento (0 %)**, con mención del
   motivo en la factura.

3. **La comisión deja de ser un gasto y pasa a ser el ingreso de la plataforma.**
   Hoy `post_payment_entry(fee_amount=...)` la asienta como gasto bancario
   (`DR 626000`, `accounting_service.py:143-144`), que es correcto para venta
   directa pero **no** para el modelo plataforma: ahí la comisión es la *facturación*
   de Delaware a la entidad local. Requiere un segundo documento (factura
   intercompañía) y su asiento.

> **Bloqueante de datos:** hoy no existe la `Company` de Delaware en el ERP. Sin
> ella, `_get_billing_company()` devuelve `None` y las órdenes **se saltan en
> silencio** sin facturar (`integration_sync_service.py:126-135`).

> **Aviso:** un modelo de plataforma transfronterizo tiene implicaciones de IVA en
> destino (reglas OSS/B2C en la UE, *reverse charge*, posible obligación de registro
> a efectos de IVA en España). El plan implementa la mecánica; **la validación con
> asesoría fiscal queda fuera de este run** y debe hacerse antes de pasar Stripe a
> modo live.

### Verificaciones hechas contra los sistemas reales

| Comprobación | Resultado |
|---|---|
| ¿Stripe acepta AED? | **Sí.** Sesión de prueba creada con `currency: aed`, `amount_total: 18000` (180,00 AED). No hace falta USD |
| Cuenta Stripe | País **US**, `default_currency: usd`, modo **test** (`sk_test…`), `card_payments: active` |
| ¿Existe envío de email en TriskelGate? | **No.** `nodemailer` está en `package.json` pero **no se importa en ningún fichero de `src/`**; no hay servicio de correo |
| ¿Se genera el PDF del ticket? | **No.** `generateTicketsPDF()` existe (`payment.js:479`) pero **nunca se invoca** |
| Variables `EMAIL_*` | Sólo en `.env.example`; **ausentes del `.env` real** |
| DNS de `xopsconference.com` | **Sin MX, sin SPF, sin DMARC** (verificado vía DoH) |

> La promesa "Hemos enviado los detalles de tu entrada a tu email" que muestra la
> página de éxito hoy es **falsa**: no existe ningún envío de correo en el backend.

## Regla de negocio (nueva, la fija este plan)

```
precio_mostrado = precio_cobrado = totalAmount             (15 € / 180 AED)
        ├── subtotal (base imponible) = total / (1 + tipoIVA)
        ├── taxAmount (IVA)           = total − subtotal   (21 % ES, 5 % AE)
        └── comisiones (platformFee + stripeFee)  se DESCUENTAN del ingreso
                                                  del organizador, NO se suman
                                                  al cobro del cliente
```

Hoy TriskelGate hace lo contrario: `totalAmount = subtotal + platformFee + stripeFee`
(`payment.js:163-167`). Verificado en producción: tarjeta anuncia **15 €**, cobro real
**16,14 €**.

### Impacto en el ERP (sí hay que tocarlo)

`integration_sync_service.py:144-160` factura hoy con `tax_inclusive=True` sobre
`subtotal`, porque asume que `subtotal` **incluye** IVA. Con la decisión 1, `subtotal`
pasa a ser base imponible → **hay que cambiar ese flag a `tax_inclusive=False`**, o el
IVA se aplicaría dos veces (se restaría de una base que ya está limpia).

Es un cambio de una línea en `holos-platform`, pero obliga a coordinar el despliegue:
**el ERP debe desplegarse a la vez o después que TriskelGate**, nunca antes.

## Ramas de despliegue (verificado, no asumido)

| Repo | Rama que despliega | Destino | Comprobación |
|------|--------------------|---------|--------------|
| `triskel-gate` | **`develop`** | Azure Container Apps | `ci-cd.yml:89` — `main` **no existe en origin**; `origin/HEAD → origin/develop` |
| `xopsmainpage-react` | **`main`** | Vercel | rama actual `main`, sin workflow de deploy propio |
| `holos-platform` (ERP) | **`main`** | `origin/HEAD → origin/main` | cambio de 1 línea (`tax_inclusive`) |

> Corrección al enunciado: en TriskelGate la rama desplegable es `develop`, no `main`.
> Publicar en `main` allí **no desplegaría nada**.

## Ejecución en paralelo

Cuatro flujos. A, B y D no comparten ficheros y van simultáneos. C valida al final.

```
   ┌── A · TriskelGate (repo triskel-gate, rama develop) ──┐
   │   A1 TG-1 entrega de tickets  (CRÍTICO, 1 línea)      │
   │   A2 Precio final con IVA + desglose                  │
   │   A3 TG-2 transaccionalidad + idempotencia            │
   │   A4 Moneda Dubai (AED) + precios locales + TG-3/4/5  │
   │   A5 Envío del ticket por email (no_reply@…)          │
   └───────────────────────────────────────────────────────┘
   ┌── B · Web X-Ops (repo xopsmainpage-react, rama main) ─┐
   │   B1 WEB-1 página de éxito sin QR fantasma            │
   │   B2 WEB-2 polling robusto                            │
   │   B3 WEB-3/4/5 limpieza + desglose en checkout        │
   └───────────────────────────────────────────────────────┘
   ┌── D · ERP holos-platform (rama main) ─────────────────┐
   │   D1 tax_inclusive=False (subtotal ya es base)        │
   │   NO desplegar antes que A                            │
   └───────────────────────────────────────────────────────┘
                        ↓ (A, B, D desplegados)
   ┌── C · Verificación E2E en producción ─────────────────┐
   │   C1 E2E Madrid + Dubai con QR y cobro exacto         │
   │   C2 Email recibido con el QR                         │
   │   C3 Verificación de factura en el ERP                │
   └───────────────────────────────────────────────────────┘
```

## Flujo E — DNS de correo en Cloudflare (bloquea A5)

El dominio **no tiene MX, SPF ni DMARC** (verificado vía DoH). Enviar hoy desde
`no_reply@xopsconference.com` acabaría en spam o rechazado.

`xopsconference.com` **está gestionado por Cloudflare** (NS `anita.ns.cloudflare.com`,
`plato.ns.cloudflare.com`), así que los registros se publican por API.

### E0 · Credencial (bloqueante actual)
No hay token de Cloudflare disponible: **Vault responde 502** (clúster caído),
no hay `CLOUDFLARE_API_TOKEN` en entorno y en el llavero solo hay entradas de Apple.
`~/.cloudflared/*.json` es una credencial de **túnel**, no sirve para DNS.

Requiere token con **`Zone:DNS:Edit`** sobre la zona, guardado en
`secret/holos/apps/cloudflare/dns` (nunca en `.env` ni en git).

### E1 · Registros a publicar
Dependen del proveedor de correo elegido (A5). Con ese proveedor decidido:

| Tipo | Nombre | Valor | Nota |
|------|--------|-------|------|
| TXT | `xopsconference.com` | `v=spf1 include:<proveedor> -all` | SPF |
| CNAME/TXT | `<selector>._domainkey` | el que dé el proveedor | DKIM |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@xopsconference.com` | arrancar en `p=none`, endurecer a `quarantine` tras observar informes |
| MX | `xopsconference.com` | solo si se quiere **recibir** correo | `no_reply` no necesita MX para enviar |

### E2 · Verificación
- Reconsultar por DoH que los tres registros resuelven.
- Envío de prueba y revisión de cabeceras: `spf=pass`, `dkim=pass`, `dmarc=pass`.
- Sólo entonces poner `EMAIL_ENABLED=true`.

> Hasta que E1/E2 estén hechos, A5 se despliega con el envío **desactivado por flag**
> (`EMAIL_ENABLED=false`): el QR en pantalla ya funciona y el correo se activa sin
> volver a desplegar.

---

## Flujo A — TriskelGate (`develop`)

### A1 · TG-1: los tickets nunca se devuelven — CRÍTICO

`src/routes/api.js:992`
```js
- if (order.status === 'paid') {
+ if (order.status === 'completed' || order.status === 'paid') {
```
`'paid'` no lo escribe ningún punto del código (`rg "'paid'"` → 1 sola coincidencia,
esta). El webhook escribe `'completed'` (`payment.js:312`).

**Test de regresión:** orden `completed` con tickets en BD → el endpoint devuelve
`tickets.length > 0` con `qrCode`.

### A2 · Precio final con IVA y comisiones incluidas

`src/services/payment.js:162-167`. Nuevo cálculo:

```js
const TAX_BY_COUNTRY = { ES: 0.21, AE: 0.05 };      // IVA España / VAT EAU

const gross        = ticketType.price * quantity;   // lo que paga el cliente
const taxRate      = event.taxRate ?? TAX_BY_COUNTRY[event.country] ?? 0.21;
const taxAmount    = round2(gross - gross / (1 + taxRate));
const subtotal     = round2(gross - taxAmount);     // base imponible (decisión 1)
const platformFee  = round2(gross * (event.platformFeePercent ?? 3) / 100);
const stripeFee    = round2(gross * 0.029 + quantity * 0.25);
const totalAmount  = gross;                         // ← con IVA, ya NO suma comisiones
const organizerNet = round2(gross - platformFee - stripeFee);
```

- `unit_amount` de Stripe pasa a ser `gross` (antes el line item llevaba el precio
  del tier y las comisiones se sumaban aparte).
- Persistir en `orders`: `subtotal` (**sin IVA**), `taxAmount`, `taxRate`,
  `platformFee`, `stripeFee`, `totalAmount` (**con IVA**), `organizerNet`.
- Migración Drizzle: añadir `tax_amount`, `tax_rate` y `organizer_net` a
  `events.orders`; añadir `tax_rate` / `country` a `events.events`
  (`platform_fees` e `invoices` ya tienen sus columnas).
- Exponer `subtotal`, `taxAmount`, `taxRate`, `platformFee`, `stripeFee`, `currency`
  en `GET /admin/orders` — el ERP ya los consume (`integration_sync_service.py:116-171`).

**Contrato con el ERP (decisión 1):** `subtotal` pasa a ser base imponible sin IVA,
por lo que el ERP debe facturar con `tax_inclusive=False` (flujo D1). Documentar el
contrato en `docs/INTEGRATIONS.md`. **Orden de despliegue obligatorio: A antes que D.**

### A3 · TG-2: transaccionalidad e idempotencia del webhook

`payment.js:284-403`:
- Envolver `update(orders)` + `insert(tickets)` en una transacción única.
- Si la orden ya está `completed` **pero sin tickets**, regenerarlos en vez de abortar
  (hoy la guarda de la línea 303 impide que el reintento de Stripe repare nada).
- Job/endpoint de reconciliación: órdenes `completed` con 0 tickets.
- **Reparar la orden `HBC-MTIKTD5H-KTYSX`** (orderId 36) ya afectada.

### A4 · Moneda y precios de Dubai + limpieza de contrato

- **Dubai se cobra en EUR aunque muestra AED**: `payment.js:219` fija
  `currency: 'eur'` en el line item. Debe tomar `ticketType.currency`.
  Verificado que Stripe acepta AED → no hace falta USD.
- **Reprecio de Dubai** (seed + migración de datos): suelo **180 AED**, tope
  **900 AED**, escalado por tier:

  | Tier | Antes | **Nuevo (AED)** |
  |------|-------|-----------------|
  | Super Early Adopter | 60 | **180** |
  | Early Adopter | 100 | **300** |
  | Daily Ticket | 180 | **450** |
  | Last Minute | 240 | **600** |
  | VIP | 600 | **750** |
  | Summit | 800 | **900** |

  Madrid no se toca (15 € … 200 €). Propuesta de escalado: revisar con negocio
  antes de aplicar; los extremos (180 / 900) son los fijados.
- TG-3: implementar `GET /api/orders/:id` o eliminarlo del cliente web.
- TG-4/TG-5: arreglar `openapi` (typo `enapi`), documentar rutas reales, `/api/postman`.
- TG-6: `minReplicas: 1` en la Container App (cold start >60 s rompe la tienda).

### A5 · Envío del ticket por email (QR + factura)

Hoy **no existe**: `nodemailer` está en `package.json` pero no se importa en `src/`,
y `generateTicketsPDF()` nunca se llama. La página promete un email que nadie envía.

- Nuevo `src/services/email.js` con proveedor configurable y remitente
  **`no_reply@xopsconference.com`**.
- Disparo desde `processSuccessfulPayment`, **fuera de la transacción** de A3 y en
  modo fire-and-forget con reintento: que un fallo de correo **nunca** impida generar
  el ticket.
- Un solo correo con **QR + factura**:
  - QR embebido (`cid:`) + PDF del ticket vía `generateTicketsPDF()` (ya escrito).
  - **Factura PDF**: la genera el ERP (`pdf_service.py`), no TriskelGate. Como la
    factura se emite en el sync del ERP (asíncrono), el correo se envía **desde el
    ERP** tras emitirla, o TriskelGate solicita la factura al ERP antes de enviar.
    **Decisión pendiente de confirmar contigo** (ver preguntas abiertas).
- Registrar envíos (`email_log`) para reintentos y soporte.
- Flag `EMAIL_ENABLED` (arranca en `false` hasta tener el DNS).
- Credenciales en **Vault**, nunca en `.env`.

---

## Flujo B — Web X-Ops (`main`)

### B1 · WEB-1: la página de éxito promete un QR que no existe
`src/pages/TicketSuccess.jsx`
- "Próximos pasos" sólo si `ticketsList.length > 0`.
- Estado explícito "pago confirmado, emitiendo tu entrada" con reintento.

### B2 · WEB-2: polling robusto
- Corregir el *stale closure* de `ticketsList` (líneas 126-160) con `useRef`.
- Ventana 2-3 min con backoff + botón "Reintentar".

### B3 · Limpieza y transparencia de precio
- WEB-3: `/checkout/success` usa `'paid'` (mismo bug) y datos hardcodeados
  ("Dubai 2026 · €299") → eliminar la ruta o corregirla.
- WEB-4: borrar `src/api/tickets.ts` (código muerto que llama a `/api/orders/:id`).
- WEB-5: distinguir fallo de red de "no hay eventos" + botón de reintento.
- Mostrar en el formulario "IVA incluido" (el precio ya es final).

---

## Flujo D — ERP `holos-platform` (`main`)

> Flujo más pesado de lo previsto: el modelo plataforma-Delaware obliga a cambiar
> la resolución de sociedad y el tratamiento de la comisión, no sólo un flag.

### D1 · Contrato fiscal con TriskelGate
`apps/erp/src/erp/services/integration_sync_service.py:159`
```python
- tax_inclusive=True,   # asumía que subtotal incluía IVA
+ tax_inclusive=False,  # subtotal ya es base imponible (decisión 1)
```
Actualizar también el comentario de las líneas 139-143, que documenta la asunción
contraria.

**Desplegar después de A**, nunca antes: si el ERP asume base limpia mientras
TriskelGate todavía manda bruto, las facturas salen con IVA de menos.

### D2 · Sociedad facturadora = Delaware LLC, en moneda local
Sustituye al alta de sociedad AED previsto antes.

- Dar de alta la `Company` de **Delaware** (`country_code = US`, TRN/EIN, serie
  propia de facturación).
- **Desacoplar sociedad ↔ moneda** en `_get_billing_company()`: hoy resuelve por
  `Company.currency` y Delaware debe emitir en **EUR y AED**. Pasar a resolver la
  sociedad-plataforma y usar la moneda de la orden sólo para la divisa de la factura.
- Emitir **exento (0 %)** al asistente, con mención del motivo (sin *nexus* en
  ES/EAU), en lugar del *sales tax* estatal que devolvería el `USTaxAdapter`.
- Registrar el tipo de cambio aplicado a efectos de conversión contable.

### D3 · Comisión como ingreso de plataforma (no como gasto)
Hoy `post_payment_entry(fee_amount=…)` la asienta como gasto bancario
(`DR 626000`, `accounting_service.py:143-144`). En el modelo plataforma la comisión
es **facturación de Delaware a la entidad local**:
- Documento intercompañía Delaware → entidad local por el importe de la comisión.
- Asiento del neto transferido como **ingreso externo** en la entidad local.
- La entidad local liquida su IVA/VAT sobre ese ingreso (21 % ES · 5 % EAU).

### D4 · Envío del correo con QR + factura
Confirmado: **lo envía el ERP**. Disparo tras `post_invoice_entry`, en un único
correo desde `no_reply@xopsconference.com` con:
- la **factura PDF** (`pdf_service.py`), y
- el **QR del ticket** obtenido de TriskelGate.

El QR ya está visible en pantalla desde el instante de la compra (A1/B1), así que el
comprador nunca queda a la espera del sync para tener su entrada.

---

## Flujo C — Verificación

### C1 · E2E en producción
`e2e/tests/tickets-sale-launch.spec.ts` (ya escrito) más aserciones nuevas:
- QR visible en la página de éxito (Madrid **y** Dubai).
- `totalAmount === ticketType.price` (15 € / 180 AED) — no 16,14 €.
- Desglose coherente: `subtotal + taxAmount === totalAmount`, con `taxRate`
  21 % en Madrid y 5 % en Dubai.
- Dubai cobra en **AED** (no EUR).
- Screenshots 01-10 en `hsm/screenshots`.

### C2 · Email
- Correo recibido desde `no_reply@xopsconference.com` con **QR + factura**.
- Comprobar SPF/DKIM/DMARC (que no caiga en spam).

### C3 · ERP
- Lanzar `run_triskelgate_invoice_sync` y comprobar, para una orden de cada sede:
  - Madrid: base + 21 % = cobro real.
  - Dubai: base + 5 % = cobro real, contra la sociedad AED.
  - Comisiones asentadas como gasto, no como menor ingreso.

---

## Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Cambiar el precio cobrado altera ingresos por entrada (15 € en vez de 16,14 €) | **Decisión de negocio explícita del usuario.** El organizador recibe `gross − comisiones` |
| Órdenes ya cobradas a 16,14 € | **Sin impacto**: Stripe está en test mode, no son cobros reales (decisión 3) |
| Desfase A↔D deja facturas con IVA incorrecto | Orden estricto: **A → D**. Verificar en C3 antes de dar por buena la facturación |
| Sin `Company` de Delaware, **ninguna** venta se factura | D2 es **bloqueante** para ambas sedes (antes sólo lo era para Dubai) |
| Desacoplar sociedad↔moneda toca código compartido del ERP | Cambio acotado a `_get_billing_company()`; cubrir con tests antes de tocar la facturación viva |
| Modelo plataforma mal planteado = riesgo fiscal real | Implementar la mecánica, pero **no pasar a live** sin validación de asesoría |
| Correo a spam sin SPF/DKIM/DMARC | A5/D4 salen con `EMAIL_ENABLED=false` hasta que el DNS esté propagado |
| Desplegar en `main` de TriskelGate no despliega | Usar `develop` (verificado en `ci-cd.yml:89`) |
| Stripe sigue en **test mode** (`sk_test…`) | Ningún cobro es real todavía. **Cambiar a claves live es un paso aparte**, con su propia verificación |

## Decisiones cerradas en la ronda de Gate 1

1. ✅ **El correo lo envía el ERP** (flujo D4), un único envío con QR + factura.
2. ✅ **Precios de Dubai validados**: 180 / 300 / 450 / 600 / 750 / 900 AED.
3. ✅ **Delaware LLC factura ambas sedes en moneda local**, modelo plataforma:
   retiene comisión, transfiere el neto y la entidad local liquida su IVA/VAT.

## Pendientes que NO bloquean la ejecución técnica

- **Validación con asesoría fiscal** del modelo transfronterizo (OSS/B2C UE,
  *reverse charge*, posible registro a efectos de IVA en España). Debe cerrarse
  **antes de pasar Stripe a modo live**, no antes de programar.
- **Token de Cloudflare** (`Zone:DNS:Edit`): Vault ya responde, pero **no existe
  ninguna ruta de Cloudflare** en `secret/holos/` (verificado en `apps/` e `infra/`).
  Bloquea E1/E2, no el resto.

## Gates

- **Gate 1 (ahora):** aprobar este plan.
- **Gate 2:** revisar diff de los tres repos antes de push a `develop` (TriskelGate)
  y `main` (web y ERP).

## Criterios de aceptación

- [ ] Comprador ve su QR en la página de éxito (Madrid y Dubai).
- [ ] Recibe correo desde `no_reply@xopsconference.com` con **QR + factura**.
- [ ] Cobro exacto = precio mostrado; IVA y comisiones internos.
- [ ] `orders` persiste `subtotal` (sin IVA), `taxAmount`, `taxRate` y comisiones.
- [ ] Madrid factura al 21 %; Dubai al 5 % en AED contra la sociedad de EAU.
- [ ] Webhook transaccional e idempotente; orden 36 reparada.
- [ ] Dubai: precios 180 → 900 AED, cobrados en AED.
- [ ] E2E verde con screenshots 01-10.
