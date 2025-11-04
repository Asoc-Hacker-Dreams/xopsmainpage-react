import { describe, it, expect } from 'vitest';
import sponsorsData from '../data/sponsors.json';

describe('Sponsors Data Integration', () => {
  it('has valid sponsors data structure', () => {
    expect(sponsorsData.sponsors).toBeDefined();
    expect(Array.isArray(sponsorsData.sponsors)).toBe(true);
    expect(sponsorsData.sponsors.length).toBeGreaterThan(0);
  });

  it('all sponsors have required fields', () => {
    sponsorsData.sponsors.forEach((sponsor) => {
      expect(sponsor.id).toBeDefined();
      expect(sponsor.slug).toBeDefined();
      expect(sponsor.name).toBeDefined();
      expect(sponsor.tier).toBeDefined();
      expect(sponsor.description).toBeDefined();
      expect(['oro', 'plata', 'colaborador']).toContain(sponsor.tier);
    });
  });

  it('all sponsors have unique slugs', () => {
    const slugs = sponsorsData.sponsors.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it('CTAs have correct structure when present', () => {
    sponsorsData.sponsors.forEach((sponsor) => {
      if (sponsor.ctas && sponsor.ctas.length > 0) {
        sponsor.ctas.forEach((cta) => {
          expect(cta.text).toBeDefined();
          expect(cta.url).toBeDefined();
          expect(cta.type).toBeDefined();
          expect(['primary', 'secondary']).toContain(cta.type);
        });
      }
    });
  });

  it('social media has valid URLs when present', () => {
    sponsorsData.sponsors.forEach((sponsor) => {
      if (sponsor.socialMedia) {
        Object.values(sponsor.socialMedia).forEach((url) => {
          if (url) {
            expect(url).toMatch(/^https?:\/\//);
          }
        });
      }
    });
  });

  it('includes key sponsors (Cybershield, Amaxop)', () => {
    const sponsorNames = sponsorsData.sponsors.map((s) => s.slug);
    expect(sponsorNames).toContain('cybershield');
    expect(sponsorNames).toContain('amaxop');
  });
});
