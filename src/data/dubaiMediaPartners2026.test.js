import { describe, expect, test } from 'vitest';
import { dubaiMediaPartners2026 } from './dubaiMediaPartners2026';

const ids = () => new Set(dubaiMediaPartners2026.map((partner) => partner.id));

describe('Dubai 2026 media partners', () => {
  test('lists the five confirmed media partners, editorial relevance first', () => {
    expect(dubaiMediaPartners2026.map((partner) => partner.id)).toEqual([
      'security-middle-east',
      'times-of-ai',
      'coinnewsspan',
      'cryptomoonpress',
      'cryptoken-media',
    ]);
    expect(ids().size).toBe(5);
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

  test('Cryptoken Media is listed only after its written acceptance', () => {
    // Viktoria Cheshmedzhieva (Cryptoken Media) aceptó por escrito el 18-nov-2026:
    // "We will be happy to proceed on those terms" (hilo "Media partnership with
    // Cryptoken Media" en info@xopsconference.com, message-id
    // <GV1P193MB23928373C731EF4766A5F990C67A2@GV1P193MB2392.EURP193.PROD.OUTLOOK.COM>).
    const cryptoken = dubaiMediaPartners2026.find((partner) => partner.id === 'cryptoken-media');
    expect(cryptoken).toBeDefined();
    expect(cryptoken.name).toBe('Cryptoken Media');
    expect(cryptoken.url).toBe('https://cryptoken.media/');
    expect(cryptoken.logo).toBeTruthy();
  });

  test('does not list outlets whose partnership is not confirmed yet', () => {
    // El Correo del Golfo recibió la propuesta (14-nov) pero no ha confirmado.
    expect(dubaiMediaPartners2026.some((partner) => /correo del golfo|elcorreo/i.test(partner.name))).toBe(false);
  });
});
