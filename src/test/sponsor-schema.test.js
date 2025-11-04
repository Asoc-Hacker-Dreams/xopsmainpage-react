import { describe, it, expect, beforeAll } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Sponsor Schema Validation', () => {
  let ajv;
  let sponsorSchema;
  let validate;

  beforeAll(() => {
    // Setup AJV with strict mode and formats
    ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: true,
      strictSchema: true,
    });

    // Add format validators (uri, date-time, etc.)
    addFormats(ajv);

    // Load schema from root schemas directory
    const sponsorSchemaPath = join(__dirname, '../../schemas/sponsor.schema.json');
    const sponsorSchemaContent = readFileSync(sponsorSchemaPath, 'utf8');
    sponsorSchema = JSON.parse(sponsorSchemaContent);
    
    // Compile schema
    validate = ajv.compile(sponsorSchema);
  });

  describe('Valid sponsor data', () => {
    it('should validate a complete sponsor object with all required fields', () => {
      const validSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(validSponsor);
      expect(valid).toBe(true);
      expect(validate.errors).toBe(null);
    });

    it('should validate sponsor with optional fields', () => {
      const validSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "gold",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        longDesc: "A longer description of the sponsor",
        website: "https://example.com",
        socials: [
          { type: "linkedin", url: "https://linkedin.com/company/test" },
          { type: "x", url: "https://x.com/test" }
        ],
        showcase: {
          ctaPrimary: { label: "Contact", href: "/contact" },
          ctaSecondary: { label: "Download", href: "https://example.com/download" }
        },
        booking: {
          type: "external",
          url: "https://calendly.com/test"
        },
        hubspot: {
          formGuid: "12345678-1234-1234-1234-123456789abc"
        },
        analytics: {
          source: "ga4",
          utm_default: {
            source: "xops",
            medium: "sponsor",
            campaign: "xops2025"
          }
        },
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(validSponsor);
      expect(valid).toBe(true);
      expect(validate.errors).toBe(null);
    });

    it('should validate sponsor with all tier levels', () => {
      const tiers = ['platinum', 'gold', 'silver', 'community'];
      
      tiers.forEach(tier => {
        const sponsor = {
          id: `test-${tier}`,
          slug: `test-${tier}`,
          name: `Test ${tier}`,
          tier: tier,
          logoUrl: "https://example.com/logo.png",
          shortDesc: "Test description",
          website: "https://example.com",
          updatedAt: "2025-11-04T08:00:00Z",
          version: "1.0"
        };

        const valid = validate(sponsor);
        expect(valid).toBe(true);
      });
    });

    it('should validate sponsor with null longDesc', () => {
      const validSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "silver",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        longDesc: null,
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(validSponsor);
      expect(valid).toBe(true);
      expect(validate.errors).toBe(null);
    });
  });

  describe('Invalid sponsor data - missing required fields', () => {
    it('should fail when id is missing', () => {
      const invalidSponsor = {
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'id')).toBe(true);
    });

    it('should fail when slug is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'slug')).toBe(true);
    });

    it('should fail when name is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'name')).toBe(true);
    });

    it('should fail when tier is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'tier')).toBe(true);
    });

    it('should fail when logoUrl is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'logoUrl')).toBe(true);
    });

    it('should fail when shortDesc is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'shortDesc')).toBe(true);
    });

    it('should fail when website is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'website')).toBe(true);
    });

    it('should fail when updatedAt is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'updatedAt')).toBe(true);
    });

    it('should fail when version is missing', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'required' && e.params.missingProperty === 'version')).toBe(true);
    });
  });

  describe('Invalid sponsor data - invalid field formats', () => {
    it('should fail when tier has invalid value', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "invalid-tier",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'enum')).toBe(true);
    });

    it('should fail when logoUrl is not a valid URL', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "not-a-url",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
    });

    it('should fail when website is not a valid URL', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "invalid-url",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
    });

    it('should fail when updatedAt is not a valid ISO 8601 date-time', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "invalid-date",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'format')).toBe(true);
    });

    it('should fail when slug has invalid format (uppercase or special chars)', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "Test_Sponsor!", // Invalid: uppercase and special chars
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'pattern')).toBe(true);
    });

    it('should fail when version has invalid format', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        updatedAt: "2025-11-04T08:00:00Z",
        version: "v1.0" // Invalid: should be "1.0" not "v1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'pattern')).toBe(true);
    });

    it('should fail when hubspot formGuid has invalid UUID format', () => {
      const invalidSponsor = {
        id: "test-sponsor-2025",
        slug: "test-sponsor",
        name: "Test Sponsor",
        tier: "platinum",
        logoUrl: "https://example.com/logo.png",
        shortDesc: "A test sponsor description",
        website: "https://example.com",
        hubspot: {
          formGuid: "not-a-valid-uuid"
        },
        updatedAt: "2025-11-04T08:00:00Z",
        version: "1.0"
      };

      const valid = validate(invalidSponsor);
      expect(valid).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors.some(e => e.keyword === 'pattern')).toBe(true);
    });
  });

  describe('Sponsors.json file validation', () => {
    it('should validate the actual sponsors.json file', () => {
      const sponsorsDataPath = join(__dirname, '../data/sponsors.json');
      const sponsorsDataContent = readFileSync(sponsorsDataPath, 'utf8');
      const sponsorsData = JSON.parse(sponsorsDataContent);

      expect(Array.isArray(sponsorsData)).toBe(true);
      expect(sponsorsData.length).toBeGreaterThan(0);

      sponsorsData.forEach((sponsor, index) => {
        const valid = validate(sponsor);
        expect(valid).toBe(true);
        if (!valid) {
          // Log errors for debugging in case of failure
          console.error(`Sponsor ${index} validation errors:`, validate.errors);
        }
      });
    });
  });
});
