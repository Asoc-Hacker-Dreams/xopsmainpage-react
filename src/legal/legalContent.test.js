import { describe, expect, it } from 'vitest';
import { privacyContent } from './privacyContent';
import { termsContent } from './termsContent';
import { noticesContent } from './noticesContent';
import { editionFromEvent, resolveLegalEdition } from './identity';

describe('legal coverage and jurisdiction routing', () => {
  it('contains substantive bilingual EU and UAE privacy notices', () => {
    for (const city of ['madrid', 'dubai']) {
      for (const lang of ['es', 'en']) {
        const doc = privacyContent[city][lang];
        expect(doc.title.length).toBeGreaterThan(20);
        expect(doc.sections.length).toBeGreaterThanOrEqual(10);
        const allText = JSON.stringify(doc);
        expect(allText).toContain('Hacker Dreams');
        expect(allText).not.toContain('X-Ops Alliance');
        expect(allText).toMatch(/Holos CRM/);
      }
    }
  });

  it('keeps Madrid withdrawal disclosure distinct from Dubai law', () => {
    for (const lang of ['es', 'en']) {
      const madrid = JSON.stringify(termsContent.madrid[lang]);
      const dubai = JSON.stringify(termsContent.dubai[lang]);
      expect(madrid).toContain('103');
      expect(dubai).not.toContain('103');
      expect(dubai).toMatch(/Dubai|Dubái/);
    }
  });

  it('covers cookies, sponsor leads and image rights in both languages', () => {
    for (const kind of ['cookies', 'sponsors', 'media']) {
      for (const lang of ['es', 'en']) {
        const doc = noticesContent[kind][lang];
        expect(doc.sections.length).toBeGreaterThanOrEqual(4);
        expect(doc.sections.every((section) => section.title && ((section.paragraphs || []).length || (section.bullets || []).length))).toBe(true);
      }
    }
    expect(JSON.stringify(noticesContent.cookies.es)).toContain('xopsconf_consent_v4');
  });

  it('selects the UAE edition by host, route and checkout event', () => {
    expect(resolveLegalEdition('/', 'dubai.xopsconference.com')).toBe('dubai');
    expect(resolveLegalEdition('/politica-de-privacidad/dubai', 'xopsconference.com')).toBe('dubai');
    expect(resolveLegalEdition('/', 'madrid.xopsconference.com')).toBe('madrid');
    expect(editionFromEvent({name:'X-Ops Dubai 2026'}, 'xopsconference.com')).toBe('dubai');
    expect(editionFromEvent({name:'X-Ops Madrid 2026'}, 'xopsconference.com')).toBe('madrid');
  });

  // TG-43 fijaba el diseño de dos días (Summit 30-nov + Conference 1-dic). Desde el
  // 25-nov-2026 Dubái es UNA JORNADA ÚNICA el lunes 30-nov-2026 con una sola entrada
  // ('Entrada General'), así que el test fija el modelo actual: un solo día, sin segundo
  // día, y sin perder los derechos ya adquiridos por las entradas Summit emitidas.
  it('Dubai terms: una sola jornada el 30-nov-2026, sin segundo día (TG-43, revisado 25-nov)', () => {
    const es = JSON.stringify(termsContent.dubai.es);
    const en = JSON.stringify(termsContent.dubai.en);
    // La jornada única y su sede.
    expect(es).toMatch(/lunes 30 de noviembre de 2026/);
    expect(en).toMatch(/Monday 30 November 2026/);
    // La sede de Dubái está por confirmar (DKP está descartado): los
    // términos no pueden dar una dirección que ya no existe.
    expect(es).toMatch(/sede está todavía por confirmar/i);
    expect(en).toMatch(/venue is still to be confirmed/i);
    expect(es).not.toMatch(/Dubai Knowledge Park/i);
    expect(en).not.toMatch(/Dubai Knowledge Park/i);
    // El modelo anterior (dos días, dos productos) no puede volver.
    for (const text of [es, en]) {
      expect(text).not.toMatch(/1 de diciembre de 2026|1 December 2026/i);
      expect(text).not.toMatch(/martes 1 de diciembre|Tuesday 1 December/i);
      expect(text).not.toMatch(/los dos días|on both days/i);
      expect(text).not.toMatch(/Conference solo es válida|Conference pass is valid only/i);
    }
    // La entrada única se nombra y lo que no incluye se dice.
    expect(es).toMatch(/Entrada General/);
    expect(en).toMatch(/General Admission/);
    // Y los derechos ya adquiridos quedan expresamente conservados.
    expect(es).toMatch(/conservan los derechos/);
    expect(en).toMatch(/keep the rights registered/);
    // Madrid conserva su propio texto histórico de dos días.
    const esMad = JSON.stringify(termsContent.madrid.es);
    const enMad = JSON.stringify(termsContent.madrid.en);
    expect(esMad).toMatch(/19 de noviembre|20 y 21 de noviembre/);
    expect(enMad).toMatch(/19 November|20 and 21 November/);
  });
});
