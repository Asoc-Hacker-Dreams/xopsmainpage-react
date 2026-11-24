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

  // Jornada única de Dubái (30-nov-2026): los términos enlazados y aceptados en
  // checkout deben decir lo mismo que el modal. Se mira el texto completo ES+EN.
  const dubaiRightsParagraphs = (doc) =>
    doc.sections
      .find((s) => /programa|programme/i.test(s.title))
      .paragraphs.join(' ');

  it.each([
    ['es', termsContent.dubai.es, /lunes 30 de noviembre de 2026/],
    ['en', termsContent.dubai.en, /Monday 30 November 2026/],
  ])('Dubai terms en %s: única jornada el 30-nov en DKP Conference Centre, TECOM', (lang, doc, datePattern) => {
    const text = JSON.stringify(doc);
    expect(text).toMatch(datePattern);
    expect(text).toMatch(/DKP Conference Centre/);
    expect(text).toMatch(/TECOM/);
    expect(text).not.toMatch(/por confirmar|pendiente de confirmación|to be confirmed|pending confirmation/i);
  });

  it.each([
    ['es', termsContent.dubai.es],
    ['en', termsContent.dubai.en],
  ])('Dubai terms en %s: ningún resto de la jornada del 1-dic ni de dos días', (lang, doc) => {
    const text = JSON.stringify(doc);
    expect(text).not.toMatch(/1 de diciembre|1 December|December 1\b|martes|Tuesday|día 2|day 2|dos días|both days|two days/i);
  });

  it('Dubai terms ES: matriz de acceso actual (Daily/LM/early, VIP, Summit ya emitidas)', () => {
    const rights = dubaiRightsParagraphs(termsContent.dubai.es);
    expect(rights).toMatch(/Daily, Last Minute y early adopters dan acceso al programa técnico, al networking y al material/);
    expect(rights).toMatch(/No incluyen sesiones de liderazgo, la cena con ponentes ni talleres premium/);
    expect(rights).toMatch(/VIP añade la cena con ponentes, pero no incluye las sesiones de liderazgo ni los talleres premium/);
    expect(rights).toMatch(/Summit ya emitidas conservan los derechos registrados para esa misma jornada \(liderazgo, Conference y cena\)/);
  });

  it('Dubai terms EN: matriz de acceso actual (Daily/LM/early, VIP, Summit ya emitidas)', () => {
    const rights = dubaiRightsParagraphs(termsContent.dubai.en);
    expect(rights).toMatch(/Daily, Last Minute and early adopter passes include the technical programme, networking and event material/);
    expect(rights).toMatch(/They do not include leadership sessions, the speakers dinner or premium workshops/);
    expect(rights).toMatch(/The VIP pass adds the speakers dinner, but not the leadership sessions or premium workshops/);
    expect(rights).toMatch(/Summit passes already issued keep their registered rights for that same day \(leadership sessions, the Conference programme and the speakers dinner\)/);
  });
});
