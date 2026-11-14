import { describe, expect, test } from 'vitest';
import { dubaiMediaPartners2026 } from './dubaiMediaPartners2026';

describe('Dubai 2026 official media partners', () => {
  test('lists the three confirmed media partners and nobody else', () => {
    expect(dubaiMediaPartners2026.map((partner) => partner.id)).toEqual([
      'security-middle-east',
      'coinnewsspan',
      'times-of-ai',
    ]);
  });

  test('every partner has a name, an https backlink and a bundled logo', () => {
    for (const partner of dubaiMediaPartners2026) {
      expect(partner.name).toBeTruthy();
      expect(partner.url).toMatch(/^https:\/\//);
      expect(partner.url).not.toContain('utm_');
      expect(partner.logo).toBeTruthy();
    }
  });

  test('ids are unique', () => {
    const ids = dubaiMediaPartners2026.map((partner) => partner.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('partners are media outlets, not sponsors', () => {
    for (const partner of dubaiMediaPartners2026) {
      expect(partner.sponsor).toBeUndefined();
      expect(partner.sponsorship).toBeUndefined();
    }
  });
});
