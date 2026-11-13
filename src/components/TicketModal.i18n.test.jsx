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

// TG-43 (Opción A, 2026-11-13): en Dubái Summit = lunes 30-nov, Conference =
// martes 1-dic (una jornada), la entrada Summit vale los dos días. El copy
// genérico (Madrid, aplazado) no se toca.
describe('tierDescriptionsDubai / entitlementsDubai (TG-43)', () => {
  const TIERS = ['superEarly', 'early', 'daily', 'lastMinute', 'vip', 'summit'];
  const CONFERENCE_LIKE = new Set(['superEarly', 'early', 'daily', 'lastMinute', 'vip']);
  const tiersOf = (lang) => Object.entries(lang.ticketModal.tierDescriptionsDubai);

  it('existen en ES y EN y no prometen 2 días de Conference ni 2-3 dic', () => {
    for (const lang of [es, en]) {
      const entries = tiersOf(lang);
      expect(entries.map(([k]) => k).sort()).toEqual([...TIERS].sort());
      for (const [tier, text] of entries) {
        expect(text.length, tier).toBeGreaterThan(30);
        expect(text, tier).not.toMatch(/2 días|2-day|2 days|two days|dos días de Conference/i);
        expect(text, tier).not.toMatch(/[23] de diciembre|[23] December/);
      }
      expect(Object.keys(lang.ticketModal.entitlementsDubai).sort())
        .toEqual(['conference', 'legacyDay', 'summit']);
    }
  });

  it('Conference y VIP: solo 1 de diciembre, sin Summit', () => {
    for (const [tier, text] of tiersOf(es).filter(([k]) => CONFERENCE_LIKE.has(k))) {
      expect(text, tier).toMatch(/1 de diciembre/);
      expect(text, tier).toMatch(/No incluye el Summit/);
    }
    for (const [tier, text] of tiersOf(en).filter(([k]) => CONFERENCE_LIKE.has(k))) {
      expect(text, tier).toMatch(/1 December/);
      expect(text, tier).toMatch(/Does not include the 30 November Summit/);
    }
  });

  it('Summit: válido el 30 de noviembre y el 1 de diciembre, con cena', () => {
    const esS = es.ticketModal.tierDescriptionsDubai.summit;
    const enS = en.ticketModal.tierDescriptionsDubai.summit;
    expect(esS).toMatch(/30 de noviembre/);
    expect(esS).toMatch(/1 de diciembre/);
    expect(esS).toMatch(/dinner/);
    expect(enS).toMatch(/30 November/);
    expect(enS).toMatch(/1 December/);
    expect(enS).toMatch(/dinner/);
  });
});
