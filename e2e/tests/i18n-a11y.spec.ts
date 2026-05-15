import { test, expect } from '../fixtures';

test.describe('i18n', () => {
  test('language toggle button exists on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Language toggle is inside collapsed navbar on mobile');
    await page.goto('/');
    const langButton = page.locator('button.language-toggle');
    await expect(langButton).toBeVisible();
  });

  test('page renders in default language without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await expect(page.locator('.Hero-section h1')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('language toggle switches language', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Language toggle is inside collapsed navbar on mobile');
    await page.goto('/');
    const langButton = page.locator('button.language-toggle');
    const heroTitle = page.locator('.Hero-section h1');
    const initialText = await heroTitle.textContent();
    await langButton.click();
    await page.waitForTimeout(500);
    const newText = await heroTitle.textContent();
    expect(newText).not.toEqual(initialText);
  });
});

test.describe('Cookie Consent', () => {
  test('cookie consent banner appears on first visit', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    const banner = page.locator('.cookie-consent-banner');
    await expect(banner).toBeVisible();
    await expect(banner.locator('.cookie-title')).toBeVisible();
  });

  test('cookie consent banner has accept/reject/customize buttons', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    const banner = page.locator('.cookie-consent-banner');
    await expect(banner.locator('button:has-text("Aceptar Todo")')).toBeVisible();
    await expect(banner.locator('button:has-text("Rechazar Todo")')).toBeVisible();
    await expect(banner.locator('button:has-text("Personalizar")')).toBeVisible();
  });

  test('accepting cookies hides the banner', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    const banner = page.locator('.cookie-consent-banner');
    await expect(banner).toBeVisible();
    await banner.locator('button:has-text("Aceptar Todo")').click();
    await expect(banner).not.toBeVisible();
  });

  test('cookie consent is remembered after accepting', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('.cookie-consent-banner button:has-text("Aceptar Todo")').click();
    await page.reload();
    await expect(page.locator('.cookie-consent-banner')).not.toBeVisible();
  });
});

test.describe('PWA', () => {
  test('manifest.json is accessible and valid', async ({ request }) => {
    const response = await request.get('/manifest.json');
    expect(response.ok()).toBeTruthy();
    const manifest = await response.json();
    expect(manifest.name).toBe('X-Ops Conference');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('service worker is accessible', async ({ request }) => {
    const response = await request.get('/sw.js');
    expect(response.ok()).toBeTruthy();
    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toContain('javascript');
  });
});
