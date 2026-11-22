import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DubaiMediaPartners from './DubaiMediaPartners';
import { dubaiMediaPartners2026 } from '../data/dubaiMediaPartners2026';
import en from '../i18n/locales/en.json';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      const value = key.split('.').reduce((acc, part) => acc?.[part], en);
      return typeof value === 'string' && opts
        ? value.replace(/\{\{(\w+)\}\}/g, (_, name) => opts[name] ?? '')
        : value;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

describe('DubaiMediaPartners section', () => {
  test('renders the section heading from i18n copy', () => {
    render(<DubaiMediaPartners />);
    expect(screen.getByRole('heading', { level: 2, name: en.cityEvent.mediaPartners.title })).toBeTruthy();
    expect(document.getElementById('media-partners')).toBeTruthy();
  });

  test('renders one card per confirmed partner', () => {
    render(<DubaiMediaPartners />);
    for (const partner of dubaiMediaPartners2026) {
      expect(screen.getByRole('heading', { level: 3, name: partner.name })).toBeTruthy();
    }
    expect(screen.getAllByRole('article')).toHaveLength(dubaiMediaPartners2026.length);
  });

  test('logo links open the official site in a new tab with safe rel', () => {
    render(<DubaiMediaPartners />);
    for (const partner of dubaiMediaPartners2026) {
      const links = screen.getAllByRole('link').filter((link) => link.getAttribute('href') === partner.url);
      expect(links.length).toBeGreaterThanOrEqual(2); // logo + website
      for (const link of links) {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toContain('noopener');
      }
    }
  });

  test('renders the partner logo with descriptive alt text', () => {
    render(<DubaiMediaPartners />);
    for (const partner of dubaiMediaPartners2026) {
      expect(screen.getByAltText(partner.name)).toBeTruthy();
    }
  });

  test('renders the verified coverage pieces without inventing any for the other outlets', () => {
    render(<DubaiMediaPartners />);
    const withCoverage = dubaiMediaPartners2026.filter((partner) => partner.coverage?.length > 0);
    expect(withCoverage.map((partner) => partner.id).sort()).toEqual(['cryptoken-media', 'security-middle-east']);
    for (const partner of withCoverage) {
      for (const piece of partner.coverage) {
        const link = screen.getAllByRole('link').find((el) => el.getAttribute('href') === piece.url);
        expect(link, `${partner.id} -> ${piece.url}`).toBeTruthy();
        expect(link.textContent).toContain(piece.title);
        expect(link.getAttribute('rel')).toContain('noopener');
        expect(link.getAttribute('target')).toBe('_blank');
      }
    }
    // The "Coverage" label appears exactly once per partner that has coverage, never on the others.
    expect(screen.getAllByText(en.cityEvent.mediaPartners.coverage)).toHaveLength(withCoverage.length);
  });
});
