/**
 * Sponsor tier levels
 */
export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'community';

/**
 * Sponsor entity
 */
export interface Sponsor {
  /**
   * Unique identifier for the sponsor
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
  logo: string;
  
  /**
   * Sponsor website URL
   */
  website: string;
  
  /**
   * Brief description of the sponsor
   */
  description: string;
  
  /**
   * Social media links
   */
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  
  /**
   * Order for display (lower numbers appear first)
   */
  order: number;
  
  /**
   * Whether this sponsor is active/visible
   */
  active: boolean;
}
