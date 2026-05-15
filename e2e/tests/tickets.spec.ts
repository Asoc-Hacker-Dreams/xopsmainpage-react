import { test, expect } from '../fixtures';

test.describe('Tickets Flow', () => {
  test('tickets page loads with ticket tiers', async ({ page }) => {
    await page.goto('/tickets');
    await expect(page.locator('.tickets-page')).toBeVisible();
    await expect(page.locator('.ticket-card')).toHaveCount(3);
    await expect(page.locator('.ticket-name:has-text("EXECUTIVE")')).toBeVisible();
    await expect(page.locator('.ticket-name:has-text("VIP PASS")')).toBeVisible();
    await expect(page.locator('.ticket-name:has-text("PARTNER")')).toBeVisible();
  });

  test('ticket cards show pricing', async ({ page }) => {
    await page.goto('/tickets');
    await expect(page.locator('.ticket-price:has-text("€299")')).toBeVisible();
    await expect(page.locator('.ticket-price:has-text("€499")')).toBeVisible();
    await expect(page.locator('.ticket-price:has-text("€999")')).toBeVisible();
  });

  test('ticket cards have CTA buttons', async ({ page }) => {
    await page.goto('/tickets');
    await expect(page.locator('button:has-text("Comprar Ahora")')).toBeVisible();
    await expect(page.locator('button:has-text("Comprar VIP")')).toBeVisible();
    await expect(page.locator('button:has-text("Contactar")')).toBeVisible();
  });

  test('event detail page shows agenda with tabs', async ({ page }) => {
    await page.goto('/events/x-ops-conference-dubai-2026');
    await expect(page.locator('.xops-detail h1')).toContainText('X-Ops Conference Dubai 2026');
    await expect(page.locator('text=Day 1 - Oct 15')).toBeVisible();
    await expect(page.locator('text=Day 2 - Oct 16')).toBeVisible();
    await expect(page.locator('text=Day 3 - Oct 17')).toBeVisible();
  });

  test('event detail page shows venue info', async ({ page }) => {
    await page.goto('/events/x-ops-conference-dubai-2026');
    await expect(page.locator('.xops-venue h4')).toContainText('Dubai World Trade Center');
    await expect(page.locator('.xops-detail-meta >> text=Dubai, UAE')).toBeVisible();
  });

  test('event detail page has buy tickets CTA', async ({ page }) => {
    await page.goto('/events/x-ops-conference-dubai-2026');
    const buyLink = page.locator('a.xops-btn-primary[href="/events/x-ops-conference-dubai-2026/buy"]');
    await expect(buyLink).toBeVisible();
  });

  test('ticket success page loads', async ({ page }) => {
    await page.goto('/tickets/success');
    await expect(page.locator('.ticket-success-page')).toBeVisible();
    await expect(page.locator('text=¡Compra Confirmada!')).toBeVisible();
  });

  test('checkout success page renders with error state when no session_id', async ({ page }) => {
    await page.goto('/checkout/success');
    await expect(page.locator('.checkout-success')).toBeVisible();
    await expect(page.locator('text=Error processing your purchase')).toBeVisible();
  });

  test('checkout success page renders processing state with session_id', async ({ page }) => {
    await page.goto('/checkout/success?session_id=test_session_123');
    await expect(page.locator('.checkout-success')).toBeVisible();
    await expect(page.locator('.checkout-spinner')).toBeVisible();
  });

  test('TriskelGate API returns events', async ({ request }) => {
    const response = await request.get('http://localhost:3001/api/events');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data[0].name).toContain('X-Ops Dubai 2026');
  });
});
