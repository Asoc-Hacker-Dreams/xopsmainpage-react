import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://xopsconference.com/?openTickets=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(10000);
console.log('event-sections:', await page.locator('.event-section').count());
const secs = page.locator('.event-section');
for (let i = 0; i < await secs.count(); i++) {
  const hdr = (await secs.nth(i).locator('h5, h4, h3, .event-title').first().innerText().catch(() => '')) ||
              (await secs.nth(i).innerText()).split('\n')[0];
  console.log(`  section[${i}] header="${hdr.trim().slice(0, 80)}" hasMadrid=${(await secs.nth(i).innerText()).includes('Madrid')} cards=${await secs.nth(i).locator('.ticket-card').count()}`);
}
const matches = page.locator('.event-section').filter({ hasText: 'Madrid' }).locator('.ticket-card', { hasText: 'Super Early Adopter' });
console.log('card matches (filter Madrid + SEA):', await matches.count());
const all = page.locator('.ticket-card', { hasText: 'Super Early Adopter' });
console.log('all SEA cards in modal:', await all.count());
console.log('modals in DOM:', await page.locator('.ticket-selection-modal').count());
await browser.close();
