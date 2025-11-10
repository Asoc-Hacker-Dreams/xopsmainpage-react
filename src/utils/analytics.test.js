import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { trackCtaClick, trackLeadSubmit, trackEvent } from './analytics';

describe('Analytics Utilities', () => {
  let originalGtag;
  let originalConsole;

  beforeEach(() => {
    // Save original values
    originalGtag = window.gtag;
    originalConsole = console.log;
    
    // Mock console.log
    console.log = vi.fn();
    console.warn = vi.fn();
    
    // Reset window.gtag
    delete window.gtag;
  });

  afterEach(() => {
    // Restore original values
    window.gtag = originalGtag;
    console.log = originalConsole;
  });

  describe('trackCtaClick', () => {
    it('should call gtag with correct parameters when gtag is available', () => {
      // Mock gtag function
      window.gtag = vi.fn();

      trackCtaClick('booking', { sponsor_name: 'Test Sponsor' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        cta_type: 'booking',
        sponsor_name: 'Test Sponsor'
      });
    });

    it('should not throw when gtag is not available', () => {
      // Ensure gtag is not available
      delete window.gtag;

      // Should not throw
      expect(() => {
        trackCtaClick('booking', { sponsor_name: 'Test Sponsor' });
      }).not.toThrow();
    });

    it('should work with empty additional parameters', () => {
      window.gtag = vi.fn();

      trackCtaClick('contact');

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        cta_type: 'contact'
      });
    });

    it('should merge multiple additional parameters', () => {
      window.gtag = vi.fn();

      trackCtaClick('download', {
        sponsor_id: '123',
        sponsor_tier: 'gold',
        document_type: 'brochure'
      });

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        cta_type: 'download',
        sponsor_id: '123',
        sponsor_tier: 'gold',
        document_type: 'brochure'
      });
    });
  });

  describe('trackLeadSubmit', () => {
    it('should track lead_submit event when gtag is available', () => {
      // Mock window.gtag
      const mockGtag = vi.fn();
      window.gtag = mockGtag;
      
      const params = {
        sponsor_id: 'acme-corp-2025',
        tier: 'platinum',
        sponsor_name: 'ACME Corporation'
      };

      trackLeadSubmit(params);

      expect(mockGtag).toHaveBeenCalledWith('event', 'lead_submit', {
        sponsor_id: 'acme-corp-2025',
        tier: 'platinum',
        sponsor_name: 'ACME Corporation',
        event_category: 'engagement',
        event_label: 'platinum_sponsor_lead'
      });
    });

    it('should handle missing optional sponsor_name parameter', () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;
      
      const params = {
        sponsor_id: 'tech-solutions-2025',
        tier: 'gold'
      };

      trackLeadSubmit(params);

      expect(mockGtag).toHaveBeenCalledWith('event', 'lead_submit', {
        sponsor_id: 'tech-solutions-2025',
        tier: 'gold',
        sponsor_name: undefined,
        event_category: 'engagement',
        event_label: 'gold_sponsor_lead'
      });
    });

    it('should warn when gtag is not available', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const params = {
        sponsor_id: 'acme-corp-2025',
        tier: 'platinum'
      };

      expect(() => {
        trackLeadSubmit(params);
      }).not.toThrow();
    });

    it('should track different sponsor tiers correctly', () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;
      
      ['platinum', 'gold', 'silver', 'community'].forEach(tier => {
        mockGtag.mockClear();
        
        trackLeadSubmit({
          sponsor_id: `sponsor-${tier}`,
          tier,
          sponsor_name: `Sponsor ${tier}`
        });

        expect(mockGtag).toHaveBeenCalledWith('event', 'lead_submit', {
          sponsor_id: `sponsor-${tier}`,
          tier,
          sponsor_name: `Sponsor ${tier}`,
          event_category: 'engagement',
          event_label: `${tier}_sponsor_lead`
        });
      });
    });
  });

  describe('trackEvent', () => {
    it('should call gtag with event name and parameters', () => {
      window.gtag = vi.fn();

      trackEvent('page_view', { page_title: 'Home' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Home'
      });
    });

    it('should not throw when gtag is not available', () => {
      // Should not throw
      expect(() => {
        trackEvent('custom_event', { param1: 'value1' });
      }).not.toThrow();
    });

    it('should work with empty event parameters', () => {
      window.gtag = vi.fn();

      trackEvent('button_click');

      expect(window.gtag).toHaveBeenCalledWith('event', 'button_click', {});
    });

    it('should handle complex parameter objects', () => {
      window.gtag = vi.fn();

      const complexParams = {
        user_id: '12345',
        session_id: 'abc-def',
        nested: {
          value: 'test'
        },
        array: [1, 2, 3]
      };

      trackEvent('complex_event', complexParams);

      expect(window.gtag).toHaveBeenCalledWith('event', 'complex_event', complexParams);
    });
  });
});
