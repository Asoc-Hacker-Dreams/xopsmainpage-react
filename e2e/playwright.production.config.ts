import { defineConfig, devices } from '@playwright/test';

/**
 * Producción — apertura de venta X-Ops Conference (Madrid + Dubai), 2026-09-01.
 * Apunta a https://xopsconference.com (Vercel) + TriskelGate Azure.
 * Sin webServer: no se levanta nada en local.
 *
 * Ejecutar:
 *   npx playwright test --config=e2e/playwright.production.config.ts
 */
const BASE_URL = process.env.E2E_BASE_URL || 'https://xopsconference.com';

export default defineConfig({
  testDir: './tests',
  testMatch: /tickets-sale-launch\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 5 * 60_000,
  expect: { timeout: 30_000 },
  reporter: [['list'], ['html', { outputFolder: 'report-production', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    // Los screenshots se gestionan manualmente (paso a paso) dentro del spec
    screenshot: 'off',
    video: 'off',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
