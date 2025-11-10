/**
 * Sponsor tier levels
 */
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'community';

/**
 * Social media platform types
 */
export type SocialMediaType = 'x' | 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'github';

/**
 * Social media link
 */
export interface SocialLink {
  type: SocialMediaType;
  url: string;
}

/**
 * Call-to-action button
 */
export interface CTAButton {
  label: string;
  href: string;
}

/**
 * Showcase section with CTAs
 */
export interface Showcase {
  ctaPrimary?: CTAButton;
  ctaSecondary?: CTAButton;
}

/**
 * Booking configuration
 */
export interface Booking {
  type: 'external';
  url: string;
}

/**
 * HubSpot integration
 */
export interface HubSpot {
  formGuid: string;
}

/**
 * Analytics configuration
 */
export interface Analytics {
  source: string;
  utm_default?: {
    source: string;
    medium: string;
    campaign: string;
  };
}

/**
 * Sponsor entity (matches schema v1.0)
 */
export interface Sponsor {
  /**
   * UUID or stable slug identifier
   */
  id: string;
  
  /**
   * URL-friendly slug for the sponsor
   */
  slug: string;
  
  /**
   * Sponsor company name
   */
  name: string;
  
  /**
   * Sponsor tier/level
   */
  tier: SponsorTier;
  
  /**
   * URL to sponsor logo image
   */
  logoUrl: string;
  
  /**
   * Short description of the sponsor
   */
  shortDesc: string;
  
  /**
   * Long description of the sponsor (optional)
   */
  longDesc?: string | null;
  
  /**
   * Sponsor website URL
   */
  website: string;
  
  /**
   * Social media links
   */
  socials?: SocialLink[];
  
  /**
   * Showcase section with CTAs
   */
  showcase?: Showcase;
  
  /**
   * Booking configuration
   */
  booking?: Booking;
  
  /**
   * HubSpot integration
   */
  hubspot?: HubSpot;
  
  /**
   * Analytics configuration
   */
  analytics?: Analytics;
  
  /**
   * Last updated timestamp
   */
  updatedAt: string;
  
  /**
   * Schema version
   */
  version: string;
}
