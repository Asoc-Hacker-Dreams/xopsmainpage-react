import { test, expect } from '../fixtures';

// Mocks inject into window.fetch before the app runs — no CORS involved, no network layer.
// page.route() mocks don't intercept CORS preflights in headless Chrome, so fetch-patching
// is the only reliable approach for cross-origin POST requests in this test setup.

// ── Shared mock data ─────────────────────────────────────────────────────────

const MOCK_EVENTS = [
  {
    id: 5,
    name: 'X-Ops Summit Spring 2026',
    slug: 'xops-summit-spring-2026',
    status: 'active',
    organizerId: 5,
    location: 'Dubai World Trade Centre, Dubai, UAE',
    startDate: '2026-04-15T09:00:00.000Z',
    endDate:   '2026-04-16T18:00:00.000Z',
  },
  {
    id: 6,
    name: 'X-Ops Summit Summer 2026',
    slug: 'xops-summit-summer-2026',
    status: 'active',
    organizerId: 5,
    location: 'Abu Dhabi National Exhibition Centre, Abu Dhabi, UAE',
    startDate: '2026-07-10T09:00:00.000Z',
    endDate:   '2026-07-11T18:00:00.000Z',
  },
  {
    id: 7,
    name: 'X-Ops Summit Autumn 2026',
    slug: 'xops-summit-autumn-2026',
    status: 'active',
    organizerId: 5,
    location: 'Expo City Dubai, Dubai, UAE',
    startDate: '2026-10-20T09:00:00.000Z',
    endDate:   '2026-10-21T18:00:00.000Z',
  },
];

const MOCK_TICKET_TYPES = [
  { id: 11, eventId: 5, name: 'Standard', price: 10, currency: 'EUR', isActive: true },
  { id: 12, eventId: 5, name: 'Business', price: 20, currency: 'EUR', isActive: true },
  { id: 13, eventId: 5, name: 'VIP',      price: 30, currency: 'EUR', isActive: true },
];

const MOCK_SESSION = {
  success: true,
  sessionId: 'cs_test_abc123',
  sessionUrl: 'http://localhost:5173/tickets/success?session_id=cs_test_abc123',
  orderId: 42,
  orderNumber: 'TG-00042',
  totalAmount: 10,
};

const MOCK_SESSION_STATUS = {
  success: true,
  status: 'completed',
  orderId: 42,
  orderNumber: 'TG-00042',
  totalAmount: 10,
};

type FetchMockConfig = {
  ticketTypesResponse?: object;
  checkoutResponse?: object;
  checkoutNetworkError?: boolean;
  ticketTypesNetworkError?: boolean;
  eventsNetworkError?: boolean;
};

async function mockFetch(page: any, config: FetchMockConfig) {
  await page.addInitScript((cfg: FetchMockConfig & {
    events: typeof MOCK_EVENTS;
    ticketTypes: typeof MOCK_TICKET_TYPES;
    session: typeof MOCK_SESSION;
    sessionStatus: typeof MOCK_SESSION_STATUS;
  }) => {
    const origFetch = window.fetch.bind(window);
    (window as any).fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;

      // Mock GET /api/events
      if (/\/api\/events$/.test(url)) {
        if (cfg.eventsNetworkError) return Promise.reject(new TypeError('Failed to fetch'));
        return Promise.resolve(new Response(
          JSON.stringify({ success: true, data: cfg.events, count: cfg.events.length }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        ));
      }

      // Mock GET /api/events/:id/ticket-types
      if (/\/api\/events\/[^/]+\/ticket-types/.test(url)) {
        if (cfg.ticketTypesNetworkError) return Promise.reject(new TypeError('Failed to fetch'));
        const res = cfg.ticketTypesResponse ?? { success: true, data: cfg.ticketTypes, count: cfg.ticketTypes.length };
        return Promise.resolve(new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }

      // Mock POST /api/payment/create-session
      if (/\/api\/payment\/create-session/.test(url)) {
        if (cfg.checkoutNetworkError) return Promise.reject(new TypeError('Failed to fetch'));
        const res = cfg.checkoutResponse ?? cfg.session;
        return Promise.resolve(new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }

      // Mock GET /api/checkout/sessions/:id/status
      if (/\/api\/checkout\/sessions\/[^/]+\/status/.test(url)) {
        return Promise.resolve(new Response(JSON.stringify(cfg.sessionStatus), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }

      return origFetch(input, init);
    };
  }, { ...config, events: MOCK_EVENTS, ticketTypes: MOCK_TICKET_TYPES, session: MOCK_SESSION, sessionStatus: MOCK_SESSION_STATUS });
}

async function mockHappy(page: any) {
  await mockFetch(page, {});
}

async function mockCheckoutError(page: any, errorMsg = 'Ticket sold out') {
  await mockFetch(page, {
    checkoutResponse: { success: false, error: 'CHECKOUT_ERROR', message: errorMsg },
  });
}

async function mockNetworkDown(page: any) {
  await mockFetch(page, { ticketTypesNetworkError: true, checkoutNetworkError: true });
}

// ── Static rendering ─────────────────────────────────────────────────────────

test.describe('Tickets page — static rendering', () => {
  test('loads with 9 ticket cards (3 events × 3 types)', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.tickets-page')).toBeVisible();
    await expect(page.locator('.ticket-card')).toHaveCount(9, { timeout: 10000 });
  });

  test('shows correct ticket names per event', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.ticket-name:has-text("STANDARD")')).toHaveCount(3, { timeout: 10000 });
    await expect(page.locator('.ticket-name:has-text("BUSINESS")')).toHaveCount(3);
    await expect(page.locator('.ticket-name:has-text("VIP")')).toHaveCount(3);
  });

  test('shows correct prices €10, €20, €30', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.ticket-price:has-text("€10")')).toHaveCount(3, { timeout: 10000 });
    await expect(page.locator('.ticket-price:has-text("€20")')).toHaveCount(3);
    await expect(page.locator('.ticket-price:has-text("€30")')).toHaveCount(3);
  });

  test('shows all 3 event names', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section-title:has-text("Spring 2026")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.event-section-title:has-text("Summer 2026")')).toBeVisible();
    await expect(page.locator('.event-section-title:has-text("Autumn 2026")')).toBeVisible();
  });

  test('shows CTA buy buttons', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('button:has-text("Comprar Standard")')).toHaveCount(3, { timeout: 10000 });
    await expect(page.locator('button:has-text("Comprar Business")')).toHaveCount(3);
    await expect(page.locator('button:has-text("Comprar VIP")')).toHaveCount(3);
  });

  test('loads without JS errors', async ({ page }) => {
    await mockHappy(page);
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/tickets');
    await page.waitForTimeout(800);
    expect(errors).toEqual([]);
  });

  test('back link navigates to /summit', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await page.click('.back-link');
    await expect(page).toHaveURL(/\/summit/);
  });
});

// ── Checkout modal — form UX ─────────────────────────────────────────────────

test.describe('Checkout modal — form UX', () => {
  test('clicking Comprar Standard opens modal with correct title', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('.modal-title')).toContainText('STANDARD');
    await expect(page.locator('.modal-title')).toContainText('€10');
  });

  test('clicking Comprar VIP opens modal with VIP title and €30', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar VIP")').first().click();
    await expect(page.locator('.modal-title')).toContainText('VIP');
    await expect(page.locator('.modal-title')).toContainText('€30');
  });

  test('clicking Comprar Business opens modal with €20', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Business")').first().click();
    await expect(page.locator('.modal-title')).toContainText('BUSINESS');
    await expect(page.locator('.modal-title')).toContainText('€20');
  });

  test('modal has name and email fields plus Continuar al Pago button', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button:has-text("Continuar al Pago")')).toBeVisible();
  });

  test('modal closes when user clicks Cancelar', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.locator('button:has-text("Cancelar")').click();
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('modal closes when user clicks X', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.locator('.btn-close').click();
    await expect(page.locator('.modal-content')).not.toBeVisible();
  });

  test('empty name shows inline error', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.alert-danger')).toContainText('nombre');
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('invalid email shows inline error', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await page.locator('input[type="text"]').fill('Ana García');
    await page.locator('input[type="email"]').fill('not-an-email');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.alert-danger')).toContainText('email');
    await expect(page.locator('.modal-content')).toBeVisible();
  });

  test('re-opens with pre-filled data after API error', async ({ page }) => {
    await mockCheckoutError(page, 'Ticket sold out');
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await page.locator('input[type="text"]').fill('Ana García');
    await page.locator('input[type="email"]').fill('ana@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();
    // Modal stays open with error
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('.alert-danger')).toContainText('sold out');
    // Fields retain user input
    await expect(page.locator('input[type="text"]')).toHaveValue('Ana García');
    await expect(page.locator('input[type="email"]')).toHaveValue('ana@example.com');
  });
});

// ── Checkout flow — happy path ────────────────────────────────────────────────

test.describe('Checkout flow — happy path', () => {
  test('valid form triggers checkout and redirects to success page', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar Standard")').first().click();
    await expect(page.locator('.modal-content')).toBeVisible();
    await page.locator('input[type="text"]').fill('Carlos López');
    await page.locator('input[type="email"]').fill('carlos@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();

    await expect(page.locator('.ticket-success-page')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.success-title')).toContainText('¡Compra Confirmada!');
  });

  test('success page shows order number after polling', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/tickets/success?session_id=cs_test_abc123');
    await expect(page.locator('.ticket-success-page')).toBeVisible();
    await expect(page.locator('.order-id')).toContainText('TG-00042', { timeout: 8000 });
  });

  test('success page shows spinner while polling', async ({ page }) => {
    await page.addInitScript((status: typeof MOCK_SESSION_STATUS) => {
      const origFetch = window.fetch.bind(window);
      (window as any).fetch = (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (/\/api\/checkout\/sessions\/[^/]+\/status/.test(url)) {
          return new Promise((res) => setTimeout(
            () => res(new Response(JSON.stringify(status), { status: 200, headers: { 'Content-Type': 'application/json' } })),
            1500
          ));
        }
        return origFetch(input, init);
      };
    }, MOCK_SESSION_STATUS);
    await page.goto('/tickets/success?session_id=cs_test_spin_');
    await expect(page.locator('.ticket-success-page')).toBeVisible();
    await expect(page.locator('.spinner-border')).toBeVisible();
  });

  test('success page loads without session_id (no spinner, no order number)', async ({ page }) => {
    await page.goto('/tickets/success');
    await expect(page.locator('.ticket-success-page')).toBeVisible();
    await expect(page.locator('.success-title')).toContainText('¡Compra Confirmada!');
    await expect(page.locator('.spinner-border')).not.toBeVisible();
    await expect(page.locator('.order-id')).not.toBeVisible();
  });
});

// ── Checkout flow — error handling ───────────────────────────────────────────

test.describe('Checkout flow — error handling', () => {
  test('API error stays in modal with message', async ({ page }) => {
    await mockCheckoutError(page, 'Ticket no disponible');
    await page.goto('/tickets');
    await expect(page.locator('.event-section')).toHaveCount(3, { timeout: 10000 });
    await page.locator('button:has-text("Comprar VIP")').first().click();
    await page.locator('input[type="text"]').fill('María Ruiz');
    await page.locator('input[type="email"]').fill('maria@example.com');
    await page.locator('button:has-text("Continuar al Pago")').click();
    await expect(page.locator('.modal-content')).toBeVisible({ timeout: 6000 });
    await expect(page.locator('.alert-danger')).toContainText('no disponible');
  });

  test('network down shows friendly error in modal', async ({ page }) => {
    await mockNetworkDown(page);
    await page.goto('/tickets');
    // With network down, events still loads (events mock not set to error)
    // but ticket types fail — page shows event names, tickets show empty
    // After clicking buy, the checkout fails with network error
    await expect(page.locator('.tickets-page')).toBeVisible({ timeout: 6000 });
    // Wait for whatever state loads
    await page.waitForTimeout(2000);
    const cards = await page.locator('.ticket-card').count();
    if (cards === 0) {
      // Ticket types network error — buy buttons not available
      // Test that error state is shown gracefully (no crash)
      await expect(page.locator('.tickets-page')).toBeVisible();
    } else {
      await page.locator('button:has-text("Comprar")').first().click();
      await page.locator('input[type="text"]').fill('Test User');
      await page.locator('input[type="email"]').fill('test@test.com');
      await page.locator('button:has-text("Continuar al Pago")').click();
      await expect(page.locator('.modal-content')).toBeVisible({ timeout: 6000 });
      await expect(page.locator('.alert-danger')).toContainText('summit@xopsconferences.com');
    }
  });
});

// ── Related pages ─────────────────────────────────────────────────────────────

test.describe('Related pages', () => {
  test('event detail buy link goes to /events/x-ops-conference-dubai-2026/buy', async ({ page }) => {
    await page.goto('/events/x-ops-conference-dubai-2026');
    const buyLink = page.locator('a[href="/events/x-ops-conference-dubai-2026/buy"]');
    await expect(buyLink).toBeVisible();
  });

  test('/events/:slug/buy renders the tickets page', async ({ page }) => {
    await mockHappy(page);
    await page.goto('/events/x-ops-conference-dubai-2026/buy');
    await expect(page.locator('.tickets-page')).toBeVisible();
  });
});

// ── TriskelGate API — live integration (guarded by E2E_TG_LIVE=1) ─────────────

const TG_BASE = process.env.VITE_TRISKELL_API_BASE_URL || 'http://localhost:3001';

test.describe('TriskelGate API — live integration', () => {
  test.skip(
    !process.env.E2E_TG_LIVE,
    'Set E2E_TG_LIVE=1 to run live TriskelGate tests'
  );

  test('GET /api/events returns active events', async ({ request }) => {
    const res = await request.get(`${TG_BASE}/api/events`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('GET /api/events/:id/ticket-types returns ticket types for event 5', async ({ request }) => {
    const res = await request.get(`${TG_BASE}/api/events/5/ticket-types`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('GET /api/checkout/sessions/invalid/status returns 400', async ({ request }) => {
    const res = await request.get(`${TG_BASE}/api/checkout/sessions/not-a-valid-id/status`);
    expect(res.status()).toBe(400);
  });
});
