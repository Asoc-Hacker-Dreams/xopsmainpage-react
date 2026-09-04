/**
 * E2E PRODUCCIÓN — Apertura de venta X-Ops Conference (Madrid + Dubai), 2026-09-01.
 *
 * Valida POR UI el flujo completo de compra contra https://xopsconference.com
 * (TriskelGate Azure + Stripe en modo TEST):
 *   home → modal de tiers → formulario → Stripe Checkout → pago → /tickets/success
 * y comprueba el registro vía API:
 *   GET /api/checkout/sessions/{id}/status → completed + tickets con QR
 *   GET /api/events/{id}/ticket-types → soldCount incrementado
 *
 * Produce EXACTAMENTE 2 órdenes de test en producción (1 Madrid + 1 Dubai),
 * tier más barato (Super Early Adopter), datos de comprador claramente de test.
 *
 * Screenshots paso a paso en $SCREENSHOT_DIR (default: ../screenshots),
 * con nombres numerados que reflejan el paso del E2E.
 *
 * Run:
 *   npx playwright test --config=e2e/playwright.production.config.ts
 */
import { test, expect, Page, Frame } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const TG_BASE =
  process.env.TG_BASE_URL ??
  'https://triskelgate-api.greensea-3f1bb7ef.uksouth.azurecontainerapps.io';

const SCREENSHOT_DIR =
  process.env.SCREENSHOT_DIR ?? '/Users/antonioj/Repos/spectertj/hsm/screenshots';

const SALE_TIER = 'Super Early Adopter';

interface CitySpec {
  city: string;
  eventId: number;
  ticketTypeId: number;
  /** nombre exacto del evento (único por sección; las descripciones de tiers
   *  mencionan ambas ciudades y romperían un filtro por palabra suelta) */
  eventName: string;
  /** precio del tier Super Early Adopter formateado por Intl (es-ES) */
  pricePattern: RegExp;
  buyerName: string;
  buyerEmail: string;
  /** prefijos de numeración de screenshot */
  shots: { form: string; stripe: string; paying: string; success: string };
}

const TEST_BUYER_EMAIL = 'specter@hackerdreams.org';

const MADRID: CitySpec = {
  city: 'madrid',
  eventId: 1,
  ticketTypeId: 1,
  eventName: 'X-Ops Conference Madrid 2026',
  pricePattern: /15\s*€/,
  buyerName: 'Specter Madrid',
  buyerEmail: TEST_BUYER_EMAIL,
  shots: { form: '03', stripe: '04', paying: '05', success: '06' },
};

const DUBAI: CitySpec = {
  city: 'dubai',
  eventId: 2,
  ticketTypeId: 7,
  eventName: 'X-Ops Conference Dubai 2026',
  pricePattern: /180\s*(AED|د\.إ)/,
  buyerName: 'Specter Dubai',
  buyerEmail: TEST_BUYER_EMAIL,
  shots: { form: '07', stripe: '08', paying: '09', success: '10' },
};

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const shot = (step: string) => path.join(SCREENSHOT_DIR, step);

async function dismissCookieBanner(page: Page) {
  const banner = page.locator('.cookie-consent-banner');
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button', { name: 'Solo esenciales' }).click();
    await expect(banner).toBeHidden({ timeout: 10_000 }).catch(() => {});
  }
}

/** Busca un selector en todos los frames (Stripe Checkout anida Elements en iframes). */
async function fieldInFrames(page: Page, selector: string) {
  const frames: Frame[] = page.frames();
  for (const frame of frames) {
    const el = frame.locator(selector);
    if (await el.count().catch(() => 0)) return el.first();
  }
  throw new Error(`Stripe field not found in any frame: ${selector}`);
}

/**
 * Abre el modal de entradas contra producción. Resiliente al cold start de la
 * Container App de TriskelGate: si el fetch de eventos falla (modal en estado
 * de error o sin tiers), reintenta hasta 3 veces recargando la página.
 */
async function openModal(page: Page) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.goto('/?openTickets=1', { waitUntil: 'domcontentloaded' });
    await dismissCookieBanner(page);
    await expect(page.locator('.ticket-selection-modal')).toBeVisible({ timeout: 30_000 });
    try {
      await expect(page.locator('.event-section').first()).toBeVisible({ timeout: 45_000 });
      await expect(page.locator('.ticket-card').first()).toBeVisible({ timeout: 10_000 });
      return;
    } catch {
      console.log(`[E2E] openModal intento ${attempt}: tiers no cargados, reintentando…`);
      if (attempt === 3) throw new Error('El modal de entradas no cargó los tiers en 3 intentos');
    }
  }
}

async function fetchSoldCount(request: any, eventId: number, ticketTypeId: number) {
  const res = await request.get(`${TG_BASE}/api/events/${eventId}/ticket-types`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  const tt = (body.data ?? []).find((t: any) => t.id === ticketTypeId);
  expect(tt, `ticket type ${ticketTypeId} del evento ${eventId}`).toBeTruthy();
  return tt.soldCount as number;
}

test.describe.serial('Apertura de venta X-Ops Conference 2026 (producción)', () => {
  test('00 — home y modal de entradas muestran los tiers de Madrid y Dubai', async ({ page }) => {
    await openModal(page);

    // Paso 01: home con el modal abierto
    await expect(page.locator('.event-section').first()).toBeVisible();
    await page.waitForTimeout(800); // deja respirar el countdown/animaciones para la captura
    await page.screenshot({ path: shot('01-home-modal-tickets.png'), fullPage: false });

    // Paso 02: ambos eventos con sus tiers
    await expect(page.locator('.event-section')).toHaveCount(2);
    await expect(page.locator('.ticket-selection-modal')).toContainText(SALE_TIER);
    await page.screenshot({ path: shot('02-modal-seleccion-madrid-dubai.png'), fullPage: false });
  });

  for (const spec of [MADRID, DUBAI]) {
    test(`${spec.shots.form} — compra ${spec.city} (${SALE_TIER}) por UI + registro`, async ({
      page,
      request,
    }) => {
      // ── baseline de inventario ANTES de comprar ──────────────────────────
      const soldBefore = await fetchSoldCount(request, spec.eventId, spec.ticketTypeId);

      await openModal(page);
      // Los nombres de los tiers aparecen en ambas secciones y las descripciones
      // de algunos tiers mencionan las dos ciudades; anclar por el nombre exacto
      // del evento, que es único en su sección.
      const section = page.locator('.event-section').filter({ hasText: spec.eventName });
      const card = section.locator('.ticket-card', { hasText: SALE_TIER });
      await expect(card).toHaveCount(1);
      await expect(card).toBeVisible();
      // El precio del tier sale formateado por Intl.NumberFormat (es-ES)
      await expect(card).toContainText(spec.pricePattern);

      // ── abrir checkout ───────────────────────────────────────────────────
      await card.locator('button').first().click();
      await expect(page.locator('#tm-name')).toBeVisible({ timeout: 15_000 });

      await page.fill('#tm-name', spec.buyerName);
      await page.fill('#tm-email', spec.buyerEmail);
      await page.screenshot({ path: shot(`${spec.shots.form}-${spec.city}-formulario-checkout.png`) });

      // ── submit → Stripe Checkout ─────────────────────────────────────────
      await Promise.all([
        page.waitForURL(/checkout\.stripe\.com/, { timeout: 60_000 }),
        page.locator('.ticket-selection-modal button[type="submit"]').click(),
      ]);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2_500); // Stripe termina de hidratar la página de pago
      await page.screenshot({ path: shot(`${spec.shots.stripe}-${spec.city}-stripe-checkout.png`) });

      // ── pagar con tarjeta de test (modo test de Stripe) ──────────────────
      // Stripe Checkout actual usa ids (#cardNumber…) en el frame principal o anidado.
      const cardNumber = await fieldInFrames(page, '#cardNumber, [data-elements-stable-field-name="cardNumber"]');
      await cardNumber.fill('4242424242424242');
      const cardExpiry = await fieldInFrames(page, '#cardExpiry, [data-elements-stable-field-name="cardExpiry"]');
      await cardExpiry.fill('12/34');
      const cardCvc = await fieldInFrames(page, '#cardCvc, [data-elements-stable-field-name="cardCvc"]');
      await cardCvc.fill('123');

      // Campos de facturación opcionales según la versión del Checkout
      for (const [selector, value] of [
        ['#billingName, [data-elements-stable-field-name="billingName"]', spec.buyerName],
        ['#billingPostal, [data-elements-stable-field-name="billingPostal"]', '28001'],
      ] as const) {
        try {
          const el = await fieldInFrames(page, selector);
          if (await el.isVisible()) await el.fill(value);
        } catch {
          /* campo no presente en esta versión del Checkout */
        }
      }

      const payButton = page
        .locator('button.SubmitButton')
        .or(page.getByRole('button', { name: /pagar|pay/i }))
        .first();
      await expect(payButton).toBeEnabled({ timeout: 15_000 });
      await payButton.click();
      await page.waitForTimeout(1_200);
      await page.screenshot({ path: shot(`${spec.shots.paying}-${spec.city}-stripe-pago-procesando.png`) });

      // ── redirect a /tickets/success ──────────────────────────────────────
      await page.waitForURL(/\/tickets\/success/, { timeout: 120_000 });
      const sessionId = new URL(page.url()).searchParams.get('session_id');
      expect(sessionId, 'session_id en la URL de éxito').toBeTruthy();

      // La página hace polling al status; .order-id aparece cuando la orden está completed
      await expect(page.locator('.ticket-success-page')).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('.order-id')).toBeVisible({ timeout: 90_000 });
      await expect(page.locator('.success-title')).toContainText(/confirmad/i);
      await page.locator('canvas').first().waitFor({ state: 'visible', timeout: 30_000 });
      await page.screenshot({ path: shot(`${spec.shots.success}-${spec.city}-exito-orden-qr.png`) });

      const orderText = (await page.locator('.order-id').first().textContent())?.trim() ?? '';

      // ── verificación de registro (solo lectura) ──────────────────────────
      // 1) status completed + tickets con QR
      let status: any = null;
      for (let i = 0; i < 20; i++) {
        const res = await request.get(`${TG_BASE}/api/checkout/sessions/${sessionId}/status`);
        expect(res.status()).toBe(200);
        status = await res.json();
        if (status.status === 'completed') break;
        await page.waitForTimeout(3_000);
      }
      expect(status.status, `status de la sesión ${sessionId}`).toBe('completed');
      expect(status.orderNumber ?? status.orderId, 'número de orden registrado').toBeTruthy();
      expect(status.tickets?.length, 'tickets generados').toBeGreaterThan(0);
      for (const t of status.tickets) expect(t.qrCode, 'QR del ticket').toBeTruthy();

      // 2) inventario: soldCount incrementado en 1
      const soldAfter = await fetchSoldCount(request, spec.eventId, spec.ticketTypeId);
      expect(soldAfter, `soldCount del tier ${spec.ticketTypeId}`).toBe(soldBefore + 1);

      console.log(
        `[E2E] ${spec.city.toUpperCase()} OK — session=${sessionId} order=${orderText || status.orderNumber} ` +
          `tickets=${status.tickets.length} soldCount ${soldBefore}→${soldAfter}`
      );
      test.info().annotations.push({
        type: `compra-${spec.city}`,
        description: `session=${sessionId} order=${orderText || status.orderNumber} soldCount=${soldBefore}->${soldAfter}`,
      });
    });
  }
});
