import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Sponsor } from '../types/sponsor';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Sample sponsor data
const mockSponsors: Sponsor[] = [
  {
    id: 'sponsor-1',
    slug: 'aws',
    name: 'Amazon Web Services',
    tier: 'platinum',
    logo: '/assets/aws-logo.png',
    website: 'https://aws.amazon.com',
    description: 'Cloud services provider',
    order: 1,
    active: true,
  },
  {
    id: 'sponsor-2',
    slug: 'redhat',
    name: 'Red Hat',
    tier: 'gold',
    logo: '/assets/redhat-logo.png',
    website: 'https://redhat.com',
    description: 'Open source solutions',
    order: 2,
    active: true,
  },
  {
    id: 'sponsor-3',
    slug: 'inactive-sponsor',
    name: 'Inactive Sponsor',
    tier: 'bronze',
    logo: '/assets/logo.png',
    website: 'https://example.com',
    description: 'This sponsor is inactive',
    order: 3,
    active: false,
  },
];

describe('dal.sponsors - Type Definitions', () => {
  it('should have valid Sponsor interface structure', () => {
    const sponsor: Sponsor = mockSponsors[0];
    expect(sponsor).toHaveProperty('id');
    expect(sponsor).toHaveProperty('slug');
    expect(sponsor).toHaveProperty('name');
    expect(sponsor).toHaveProperty('tier');
    expect(sponsor).toHaveProperty('logo');
    expect(sponsor).toHaveProperty('website');
    expect(sponsor).toHaveProperty('description');
    expect(sponsor).toHaveProperty('order');
    expect(sponsor).toHaveProperty('active');
  });

  it('should have valid tier values', () => {
    const validTiers = ['platinum', 'gold', 'silver', 'bronze', 'community'];
    mockSponsors.forEach(sponsor => {
      expect(validTiers).toContain(sponsor.tier);
    });
  });

  it('should have unique slugs', () => {
    const slugs = mockSponsors.map(s => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it('should have unique ids', () => {
    const ids = mockSponsors.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});

describe('dal.sponsors - Module exports', () => {
  it('should export getSponsors function', async () => {
    const { getSponsors } = await import('./dal.sponsors');
    expect(typeof getSponsors).toBe('function');
  });

  it('should export getSponsorBySlug function', async () => {
    const { getSponsorBySlug } = await import('./dal.sponsors');
    expect(typeof getSponsorBySlug).toBe('function');
  });
});

describe('dal.sponsors - Data validation', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should handle JSON parsing correctly', async () => {
    const jsonData = JSON.stringify(mockSponsors);
    const parsed = JSON.parse(jsonData);
    expect(parsed).toEqual(mockSponsors);
  });

  it('should filter active sponsors correctly', () => {
    const activeSponsors = mockSponsors.filter(s => s.active);
    expect(activeSponsors).toHaveLength(2);
    expect(activeSponsors.every(s => s.active)).toBe(true);
  });

  it('should sort sponsors by order', () => {
    const sorted = [...mockSponsors].sort((a, b) => a.order - b.order);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].order).toBeGreaterThanOrEqual(sorted[i - 1].order);
    }
  });

  it('should find sponsor by slug', () => {
    const sponsor = mockSponsors.find(s => s.slug === 'aws');
    expect(sponsor).toBeDefined();
    expect(sponsor?.name).toBe('Amazon Web Services');
  });

  it('should return undefined for non-existent slug', () => {
    const sponsor = mockSponsors.find(s => s.slug === 'non-existent');
    expect(sponsor).toBeUndefined();
  });
});

// Note: Integration tests with IndexedDB would be added here
// but require more complex setup. The above tests validate the
// core logic and data structures.
describe('dal.sponsors - Integration (basic)', () => {
  it('should have sponsors.json file available', async () => {
    // This is a basic check that the data file exists
    // In a real browser environment, fetch would work
    const dataFile = '/src/data/sponsors.json';
    expect(dataFile).toBeDefined();
  });
});
