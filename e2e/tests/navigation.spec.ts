import { test, expect } from '../fixtures';

test.describe('Core Navigation', () => {
  test('home page loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.Hero-section')).toBeVisible();
    await expect(page.locator('.Hero-section h1')).toBeVisible();
  });

  test('navbar is present with brand and links', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('nav.header');
    await expect(navbar).toBeVisible();
    await expect(navbar.locator('.navbar-brand-text')).toContainText('X-OPS CONFERENCE');
    await expect(navbar.locator('a.links')).toHaveCount(4);
  });

  test('footer is present with contact info', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer.footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('text=info@xopsconference.com')).toBeVisible();
  });

  test('home page renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });

  test('sponsor page loads', async ({ page }) => {
    await page.goto('/Sponsor');
    await expect(page.locator('.Hero-section')).toBeVisible();
  });

  test('organizer page loads', async ({ page }) => {
    await page.goto('/Organizer');
    await expect(page.locator('.Hero-section')).toBeVisible();
  });

  test('summit page loads', async ({ page }) => {
    await page.goto('/summit');
    await expect(page.locator('.summit-page')).toBeVisible();
  });

  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/politica-de-privacidad');
    await expect(page.locator('.Hero-section')).toBeVisible();
  });

  test('agenda page loads', async ({ page }) => {
    await page.goto('/agenda');
    await expect(page.locator('.Hero-section')).toBeVisible();
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('h1.display-1')).toContainText('404');
    await expect(page.locator('text=Página no encontrada')).toBeVisible();
  });

  test('event detail page loads', async ({ page }) => {
    await page.goto('/events/x-ops-conference-dubai-2026');
    await expect(page.locator('.xops-detail h1')).toContainText('X-Ops Conference Dubai 2026');
  });

  test('archive pages load', async ({ page }) => {
    await page.goto('/archive/2024/Speakers2024');
    await expect(page.locator('.Hero-section')).toBeVisible();
  });
});
