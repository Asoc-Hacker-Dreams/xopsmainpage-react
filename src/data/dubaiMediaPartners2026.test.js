import { describe, expect, test } from 'vitest';
import { dubaiMediaPartners2026 } from './dubaiMediaPartners2026';

const ids = () => new Set(dubaiMediaPartners2026.map((partner) => partner.id));

describe('Dubai 2026 media partners', () => {
  test('lists the four confirmed media partners, editorial relevance first', () => {
    expect(dubaiMediaPartners2026.map((partner) => partner.id)).toEqual([
      'security-middle-east',
      'times-of-ai',
      'coinnewsspan',
      'cryptomoonpress',
    ]);
    expect(ids().size).toBe(4);
  });

  test('every partner has a name, an official https site and a downloaded logo asset', () => {
    for (const partner of dubaiMediaPartners2026) {
      expect(partner.name).toBeTruthy();
      expect(partner.url).toMatch(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/?$/i);
      expect(partner.url).toContain(partner.id.split('-')[0].slice(0, 6));
      expect(partner.logo).toBeTruthy();
      expect(partner.logo).not.toContain('sessionize');
    }
  });

  test('does not list outlets whose partnership is not confirmed yet', () => {
    // Cryptoken Media recibió oferta el 14-nov-2026 pero aún no ha aceptado.
    expect(dubaiMediaPartners2026.some((partner) => /cryptoken/i.test(partner.name))).toBe(false);
  });
});
