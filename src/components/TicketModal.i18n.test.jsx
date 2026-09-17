import { describe, it, expect } from 'vitest';
import es from '../i18n/locales/es.json';
import en from '../i18n/locales/en.json';

/**
 * Descripciones de producto e i18n.
 *
 * `ticket_types.description` sólo existe en español en TriskelGate, así que
 * para cualquier otro idioma el copy se sirve desde `tierDescriptions`. Estos
 * tests protegen dos cosas:
 *
 *   1. Que las claves existan en ambos idiomas (si falta una, el comprador ve
 *      la clave cruda o un hueco).
 *   2. Que los textos NO contradigan la matriz de producto. Antes lo hacían:
 *      decían que Daily era de un día y que Summit no incluía Conference.
 */
describe('tierDescriptions', () => {
  const TIERS = ['superEarly', 'early', 'daily', 'lastMinute', 'vip', 'summit'];

  it('define los 6 tiers en ES y EN', () => {
    for (const lang of [es, en]) {
      const td = lang.ticketModal.tierDescriptions;
      for (const tier of TIERS) {
        expect(td[tier], `falta el tier ${tier}`).toBeTruthy();
        expect(td[tier].length).toBeGreaterThan(30);
      }
    }
  });

  it('define los entitlements en ES y EN', () => {
    for (const lang of [es, en]) {
      const ent = lang.ticketModal.entitlements;
      for (const key of ['confDay1', 'confDay2', 'summit', 'dinner', 'workshops']) {
        expect(ent[key], `falta el entitlement ${key}`).toBeTruthy();
      }
    }
  });

  it('"Daily Ticket" es la tarifa estándar de 2 días, no una entrada de un día', () => {
    // §14: Daily NO significa "single day". Es el precio regular del pase
    // completo. El copy anterior decía "Acceso de un día completo".
    expect(es.ticketModal.tierDescriptions.daily).toMatch(/2 días/);
    expect(es.ticketModal.tierDescriptions.daily).not.toMatch(/un día completo/i);
    expect(en.ticketModal.tierDescriptions.daily).toMatch(/2-day/);
    expect(en.ticketModal.tierDescriptions.daily).not.toMatch(/single day/i);
  });

  it('Summit incluye Conference y la speakers dinner', () => {
    // §16: Summit es el producto superior. El copy anterior afirmaba
    // "No incluye la Conferencia", que es justo lo contrario.
    const esS = es.ticketModal.tierDescriptions.summit;
    const enS = en.ticketModal.tierDescriptions.summit;
    expect(esS).toMatch(/Conference/);
    expect(esS).toMatch(/dinner/i);
    expect(esS).not.toMatch(/No incluye la Conferencia/i);
    expect(enS).toMatch(/Conference/);
    expect(enS).toMatch(/dinner/i);
    expect(enS).not.toMatch(/Does not include the Conference/i);
  });

  it('VIP incluye la cena pero NO el Summit', () => {
    // §15: VIP = Conference + dinner. Sin Summit.
    const esV = es.ticketModal.tierDescriptions.vip;
    const enV = en.ticketModal.tierDescriptions.vip;
    expect(esV).toMatch(/dinner/i);
    expect(esV).toMatch(/No incluye Summit/i);
    expect(enV).toMatch(/dinner/i);
    expect(enV).toMatch(/Does not include Summit/i);
  });

  it('ningún copy usa "Full event access" ni "Acceso completo al evento"', () => {
    // §20: prohibido en Conference y VIP — no distingue un pase de 45 € de
    // un Summit de 200 €.
    for (const lang of [es, en]) {
      for (const [tier, text] of Object.entries(lang.ticketModal.tierDescriptions)) {
        expect(text, `${tier} usa copy prohibido`).not.toMatch(/Full event access/i);
        expect(text, `${tier} usa copy prohibido`).not.toMatch(/Acceso completo al evento/i);
      }
    }
  });

  it('las 4 fases de Conference declaran las mismas exclusiones', () => {
    // Son fases de precio del MISMO producto: si una promete algo que otra
    // no, el comprador percibe productos distintos donde no los hay.
    for (const lang of [es, en]) {
      const td = lang.ticketModal.tierDescriptions;
      for (const tier of ['superEarly', 'early', 'daily', 'lastMinute']) {
        expect(td[tier], `${tier} no excluye Summit`).toMatch(/Summit/);
        expect(td[tier], `${tier} no menciona los 2 días`).toMatch(/2 días|2-day/);
      }
    }
  });

  it('no quedan claves huérfanas de ticketModal.features', () => {
    // Sustituidas por el desglose de entitlements. Si reaparecen es que
    // alguien volvió al render con texto fijo.
    expect(es.ticketModal.features).toBeUndefined();
    expect(en.ticketModal.features).toBeUndefined();
  });
});
