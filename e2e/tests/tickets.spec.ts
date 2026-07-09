import { test, expect } from '../fixtures';

/**
 * Fetch mocks inject into window.fetch before the app runs (addInitScript).
 * page.route() doesn't reliably intercept CORS preflights in headless Chrome,
 * so fetch-patching is the only reliable approach for cross-origin requests.
 *
 * NOTE: VITE_TRISKELL_ORGANIZER_ID=8 (X-Ops Conference). Mocked events MUST
 *       use organizerId=8 or the frontend filter will hide them.
 *
 * Cookie banner: dismissed via localStorage pre-seed so it never blocks clicks.
 */

async function dismissCookieBanner(page: any) {
  await page.addInitScript(() => {
    const consent = {
      essential: true, analytics: true, marketing: true, newsletters: true,
    };
    localStorage.setItem('xopsconf_consent_v1', JSON.stringify({
      consent, timestamp: new Date().toISOString(), version: '1.0',
    }));
  });
}

// ── Shared mock data ──────────────────────────────────────────────────────────

const MOCK_EVENT = {
  id: 23,
  name: 'X-Ops Conference Madrid 2026',
  slug: 'xops-conference-madrid-2026',
  status: 'active',
  organizerId: 8,
  location: 'Madrid, España',
  startDate: '2026-11-19T09:00:00.000Z',
  endDate: '2026-11-21T18:00:00.000Z',
};

const MOCK_TICKET_TYPES = [
  { id: 20, eventId: 23, name: 'Super Early Adopter', price: 15,  currency: 'EUR', isActive: true, displayOrder: 1, saleStartDate: '2026-06-19T00:00:00.000Z', saleEndDate: '2026-08-31T23:59:59.000Z', maxQuantity: 50 },
  { id: 21, eventId: 23, name: 'Early Adopter',       price: 25,  currency: 'EUR', isActive: true, displayOrder: 2, saleStartDate: '2026-06-19T00:00:00.000Z', saleEndDate: '2026-09-30T23:59:59.000Z', maxQuantity: 50 },
  { id: 22, eventId: 23, name: 'Daily Ticket',        price: 45,  currency: 'EUR', isActive: true, displayOrder: 3, saleStartDate: '2026-06-19T00:00:00.000Z', saleEndDate: '2026-10-31T23:59:59.000Z', maxQuantity: 200 },
  { id: 23, eventId: 23, name: 'Last Minute',         price: 60,  currency: 'EUR', isActive: true, displayOrder: 4, saleStartDate: '2026-06-19T00:00:00.000Z', saleEndDate: '2026-11-21T23:59:59.000Z', maxQuantity: 200 },
  { id: 24, eventId: 23, name: 'Summit',              price: 200, currency: 'EUR', isActive: true, displayOrder: 5, saleStartDate: '2026-06-19T00:00:00.000Z', saleEndDate: '2026-11-19T23:59:59.000Z', maxQuantity: 90 },
  { id: 25, eventId: 23, name: 'VIP',                 price: 150, currency: 'EUR', isActive: true, displayOrder: 6, saleStartDate: '2026-06-19T00:00:00.000Z', saleEndDate: '2026-11-21T23:59:59.000Z', maxQuantity: 20 },
];

// Must start with https://checkout.stripe.com/ (security guard in handleSubmit)
const MOCK_STRIPE_URL = 'https://checkout.stripe.com/c/pay/cs_test_abc123xyz';

const MOCK_SESSION_OK = {
  success: true,
  sessionUrl: MOCK_STRIPE_URL,
  checkoutId: 'cs_test_abc123xyz',
};

type FetchMockConfig = {
  eventsNetworkError?: boolean;
  ticketTypesNetworkError?: boolean;
  checkoutResponse?: object;
  checkoutNetworkError?: boolean;
};

async function mockFetch(page: any, config: FetchMockConfig = {}) {
  await dismissCookieBanner(page);
  await page.addInitScript((cfg: FetchMockConfig & {
    event: typeof MOCK_EVENT;
    ticketTypes: typeof MOCK_TICKET_TYPES;
    session: typeof MOCK_SESSION_OK;
  }) => {
    const origFetch = window.fetch.bind(window);
    (window as any).fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input
        : input instanceof URL ? input.href
        : (input as Request).url;

      if (/\/api\/events$/.test(url)) {
        if (cfg.eventsNetworkError) return Promise.reject(new TypeError('Failed to fetch'));
        return Promise.resolve(new Response(
          JSON.stringify({ success: true, data: [cfg.event], count: 1 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ));
      }

      if (/\/api\/events\/[^/]+\/ticket-types/.test(url)) {
        if (cfg.ticketTypesNetworkError) return Promise.reject(new TypeError('Failed to fetch'));
        return Promise.resolve(new Response(
          JSON.stringify({ success: true, data: cfg.ticketTypes, count: cfg.ticketTypes.length }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ));
      }

      if (/\/api\/payment\/create-session/.test(url)) {
        if (cfg.checkoutNetworkError) return Promise.reject(new TypeError('Failed to fetch'));
        const res = cfg.checkoutResponse ?? cfg.session;
        return Promise.resolve(new Response(
          JSON.stringify(res),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ));
      }

      return origFetch(input, init);
    };
  }, { ...config, event: MOCK_EVENT, ticketTypes: MOCK_TICKET_TYPES, session: MOCK_SESSION_OK });
}

// ── Static rendering ──────────────────────────────────────────────────────────

test.describe('Tickets page — static rendering', () => {

  test('loads without JS errors', async ({ page }) => {
    await mockFetch(page);
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    expect(errors).toEqual([]);
  });

  test('shows event name and location', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    expect(body).toContain('X-Ops Conference Madrid 2026');
    expect(body).toContain('Madrid');
  });

  test('renders 6 ticket cards', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await expect(page.locator('.ticket-card-v2')).toHaveCount(6, { timeout: 10000 });
  });

  test('shows all 6 tier names', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    expect(body).toMatch(/SUPER EARLY ADOPTER/i);
    expect(body).toMatch(/EARLY ADOPTER/i);
    expect(body).toMatch(/DAILY TICKET/i);
    expect(body).toMatch(/LAST MINUTE/i);
    expect(body).toMatch(/SUMMIT/i);
    expect(body).toMatch(/VIP/i);
  });

  test('shows correct prices', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    expect(body).toContain('€15');
    expect(body).toContain('€25');
    expect(body).toContain('€45');
    expect(body).toContain('€60');
    expect(body).toContain('€200');
    expect(body).toContain('€150');
  });

  test('shows active buy buttons', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    const activeBtns = page.locator('.ticket-buy-btn:not([disabled])');
    await expect(activeBtns).toHaveCount(6, { timeout: 10000 });
  });

  test('back link navigates to homepage', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.click('.back-link');
    await page.waitForURL('/');
    expect(page.url()).toMatch(/\/$/);
  });

  test('contact email is visible', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    expect(body).toContain('info@xopsconferences.com');
  });

  test('events network error shows alert', async ({ page }) => {
    await mockFetch(page, { eventsNetworkError: true });
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await expect(page.locator('.alert-danger')).toBeVisible({ timeout: 8000 });
  });

});

// ── Checkout modal ────────────────────────────────────────────────────────────

test.describe('Checkout modal — form UX', () => {

  test('clicking buy opens modal with tier name and price', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await expect(page.locator('.ticket-buy-btn:not([disabled])')).toHaveCount(6, { timeout: 10000 });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    const title = await page.locator('.modal-title').textContent();
    expect(title).toMatch(/SUPER EARLY ADOPTER/i);
    expect(title).toContain('€15');
  });

  test('modal has name field, email field, and submit button', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Continuar al Pago")')).toBeVisible();
  });

  test('modal closes on Cancelar', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.locator('button:has-text("Cancelar")').click();
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('modal closes on X button', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.locator('.btn-close').click();
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('empty name shows inline error', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.modal .alert-danger')).toBeVisible();
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('invalid email shows inline error', async ({ page }) => {
    await mockFetch(page);
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await page.locator('input[type="text"]').fill('Carlos López');
    await page.locator('input[type="email"]').fill('not-an-email');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.modal .alert-danger')).toBeVisible();
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('API error stays in modal with message', async ({ page }) => {
    await mockFetch(page, {
      checkoutResponse: { success: false, message: 'Ticket agotado' },
    });
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await page.locator('input[type="text"]').fill('Ana García');
    await page.locator('input[type="email"]').fill('ana@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.modal-content')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('.modal .alert-danger')).toContainText('agotado');
    await expect(page.locator('input[type="text"]')).toHaveValue('Ana García');
    await expect(page.locator('input[type="email"]')).toHaveValue('ana@example.com');
  });

  test('checkout network error shows friendly message', async ({ page }) => {
    await mockFetch(page, { checkoutNetworkError: true });
    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await page.locator('input[type="text"]').fill('Test User');
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.modal .alert-danger')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('.modal-content')).toBeVisible();
  });

});

// ── Checkout flow — happy path (intercept Stripe redirect) ────────────────────

test.describe('Checkout flow — happy path', () => {

  test('valid form triggers Stripe redirect', async ({ page }) => {
    await mockFetch(page);
    // Intercept navigation to Stripe so the test doesn't actually leave the page
    await page.route('https://checkout.stripe.com/**', route => route.abort());

    await page.goto('/tickets', { waitUntil: 'networkidle' });
    await page.locator('.ticket-buy-btn:not([disabled])').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();

    await page.locator('input[type="text"]').fill('María Ruiz');
    await page.locator('input[type="email"]').fill('maria@example.com');

    // Intercept the navigation request that will fire
    const [request] = await Promise.all([
      page.waitForRequest(/checkout\.stripe\.com/),
      page.locator('button:has-text("Continuar al Pago")').click(),
    ]);
    expect(request.url()).toContain('checkout.stripe.com');
  });

});

// ── TriskelGate API — live integration (guarded by E2E_TG_LIVE=1) ─────────────

const TG_BASE = process.env.VITE_TRISKELL_API_BASE_URL || 'http://localhost:3001';

test.describe('TriskelGate API — live integration', () => {
  test.skip(
    !process.env.E2E_TG_LIVE,
    'Set E2E_TG_LIVE=1 to run live TriskelGate integration tests',
  );

  test('GET /api/events returns X-Ops Conference Madrid 2026', async ({ request }) => {
    const res = await request.get(`${TG_BASE}/api/events`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    const madrid = data.data.find((e: any) => e.slug === 'xops-conference-madrid-2026');
    expect(madrid).toBeDefined();
    expect(madrid.organizerId).toBe(8);
  });

  test('GET /api/events/23/ticket-types returns 6 tiers', async ({ request }) => {
    const res = await request.get(`${TG_BASE}/api/events/23/ticket-types`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(6);
  });

  test('ticket tiers have correct prices', async ({ request }) => {
    const res = await request.get(`${TG_BASE}/api/events/23/ticket-types`);
    const data = await res.json();
    const prices = data.data.map((t: any) => t.price).sort((a: number, b: number) => a - b);
    expect(prices).toEqual([15, 25, 45, 60, 150, 200]);
  });

});
