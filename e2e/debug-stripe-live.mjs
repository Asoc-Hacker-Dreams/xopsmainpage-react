import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://xopsconference.com/?openTickets=1', { waitUntil: 'domcontentloaded' });
const banner = page.locator('.cookie-consent-banner');
if (await banner.isVisible().catch(() => false)) await banner.getByRole('button', { name: 'Solo esenciales' }).click();
await page.locator('.ticket-selection-modal').waitFor({ state: 'visible' });
const section = page.locator('.event-section').filter({ hasText: 'X-Ops Conference Madrid 2026' });
const card = section.locator('.ticket-card', { hasText: 'Super Early Adopter' });
await card.locator('button').first().click();
await page.locator('#tm-name').waitFor({ state: 'visible', timeout: 15000 });
await page.fill('#tm-name', 'E2E Debug Stripe DOM');
await page.fill('#tm-email', 'e2e-debug-stripe@xopsconference.com');
await Promise.all([
  page.waitForURL(/checkout\.stripe\.com/, { timeout: 60000 }),
  page.locator('.ticket-selection-modal button[type="submit"]').click(),
]);
await page.waitForLoadState('domcontentloaded');
await page.waitForTimeout(6000);
console.log('URL:', page.url());
for (const frame of page.frames()) {
  const url = frame.url();
  const inputs = await frame.locator('input, select, button[data-testid], [data-elements-stable-field-name], [role="textbox"], [id*="card"], [id*="Card"], [name*="card"], [name*="Card"]').evaluateAll(
    (els) => els.slice(0, 40).map((el) => ({
      tag: el.tagName.toLowerCase(),
      id: el.id || undefined,
      name: el.getAttribute('name') || undefined,
      stable: el.getAttribute('data-elements-stable-field-name') || undefined,
      autocomplete: el.getAttribute('autocomplete') || undefined,
      cls: (el.className || '').toString().slice(0, 80),
      text: el.textContent?.trim().slice(0, 40),
    }))
  ).catch(() => []);
  if (inputs.length) console.log(`\nFRAME ${url.slice(0, 100)}\n`, JSON.stringify(inputs, null, 1));
}
await browser.close();
