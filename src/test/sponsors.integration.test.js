import { describe, it, expect } from 'vitest';
import sponsorsData from '../data/sponsors.json';

describe('Sponsors Data Integration', () => {
  it('has valid sponsors data structure', () => {
    expect(Array.isArray(sponsorsData)).toBe(true);
    expect(sponsorsData.length).toBeGreaterThan(0);
  });

  it('all sponsors have required fields per schema', () => {
    sponsorsData.forEach((sponsor) => {
      expect(sponsor.id).toBeDefined();
      expect(sponsor.slug).toBeDefined();
      expect(sponsor.name).toBeDefined();
      expect(sponsor.tier).toBeDefined();
      expect(sponsor.logoUrl).toBeDefined();
      expect(sponsor.shortDesc).toBeDefined();
      expect(sponsor.website).toBeDefined();
      expect(sponsor.updatedAt).toBeDefined();
      expect(sponsor.version).toBeDefined();
      expect(['platinum', 'gold', 'silver', 'community']).toContain(sponsor.tier);
    });
  });

  it('all sponsors have unique slugs', () => {
    const slugs = sponsorsData.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it('showcase CTAs have correct structure when present', () => {
    sponsorsData.forEach((sponsor) => {
      if (sponsor.showcase) {
        if (sponsor.showcase.ctaPrimary) {
          expect(sponsor.showcase.ctaPrimary.label).toBeDefined();
          expect(sponsor.showcase.ctaPrimary.href).toBeDefined();
        }
        if (sponsor.showcase.ctaSecondary) {
          expect(sponsor.showcase.ctaSecondary.label).toBeDefined();
          expect(sponsor.showcase.ctaSecondary.href).toBeDefined();
        }
      }
    });
  });

  it('socials have valid URLs when present', () => {
    sponsorsData.forEach((sponsor) => {
      if (sponsor.socials) {
        sponsor.socials.forEach((social) => {
          expect(social.type).toBeDefined();
          expect(social.url).toBeDefined();
          expect(social.url).toMatch(/^https?:\/\//);
        });
      }
    });
  });

  it('includes key sponsors (Cybershield, Amaxop)', () => {
    const sponsorNames = sponsorsData.map((s) => s.slug);
    expect(sponsorNames).toContain('cybershield');
    expect(sponsorNames).toContain('amaxop');
  });
});
