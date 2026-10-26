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
});
