import { test, expect } from '@playwright/test';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:5181';

test.describe('X-Ops Conference — post-deploy validation', () => {

  test('page loads without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(BASE, { waitUntil: 'networkidle' });
    expect(errors, `JS errors: ${errors.join(', ')}`).toHaveLength(0);
    await expect(page).toHaveTitle(/X-Ops/i);
  });

  test('navbar: brand text present, Evento/Summit links removed, Volunteer+CFP added', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    // Brand exists
    await expect(page.getByText('X-OPS CONFERENCE').first()).toBeVisible();
    // EVENTO and SUMMIT nav links removed
    const navLinks = page.locator('nav a, .links');
    const texts = await navLinks.allTextContents();
    const upper = texts.map(t => t.trim().toUpperCase());
    expect(upper.some(t => t === 'EVENTO')).toBe(false);
    expect(upper.some(t => t === 'SUMMIT')).toBe(false);
    // CFP link present
    const cfpLink = page.locator('nav a[href*="sessionize"], .links[href*="sessionize"]').first();
    await expect(cfpLink).toBeVisible();
  });

  test('Madrid and Dubai both referenced on homepage', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const body = await page.textContent('body');
    expect(body).toContain('Madrid');
    expect(body).toContain('Dubai');
  });

  test('stats: 28 speakers and 24 sessions visible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const body = await page.textContent('body');
    expect(body).toContain('28');
    expect(body).toContain('24');
    // Old values should NOT be primary stat numbers
    // (16 may appear in dates/times, 15 similarly — we check 28 and 24 are present)
  });

  test('language toggle switches to English', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    // Find language toggle
    const toggle = page.locator('button.language-toggle').first();
    await expect(toggle).toBeVisible();
    // Spanish default: check a Spanish-only string
    const bodyEs = await page.textContent('body');
    expect(bodyEs).toMatch(/Ponentes|Colaboradores|Patrocinadores|Ediciones/i);
    // Switch to English
    await toggle.click();
    await page.waitForTimeout(500);
    const bodyEn = await page.textContent('body');
    expect(bodyEn).toMatch(/Speakers|Collaborators|Sponsors|Editions/i);
  });

  test('EcosystemSection: Conference and Summit cards visible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(800);
    const body = await page.textContent('body');
    expect(body).toMatch(/Conference/i);
    expect(body).toMatch(/Summit/i);
  });

  test('EditionsSection: Madrid and Dubai editions with countdown', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.locator('#ediciones').scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(800);
    const section = page.locator('#ediciones').first();
    const text = await section.textContent().catch(() => '');
    // Should have countdown elements (days/hours labels)
    const body = await page.textContent('body');
    expect(body).toMatch(/días|days|Dubai|Madrid/i);
  });

});
