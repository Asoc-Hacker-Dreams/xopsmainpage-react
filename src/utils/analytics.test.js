import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trackLeadSubmit, trackEvent } from './analytics';

describe('Analytics Utility', () => {
  beforeEach(() => {
    // Reset window.gtag before each test
    delete window.gtag;
    // Clear console mocks
    vi.clearAllMocks();
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

      trackLeadSubmit(params);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'GA4 not available - event not tracked:',
        expect.objectContaining({
          sponsor_id: 'acme-corp-2025',
          tier: 'platinum'
        })
      );

      consoleWarnSpy.mockRestore();
    });

    it('should track different sponsor tiers correctly', () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      const tiers = ['platinum', 'gold', 'silver', 'community'];
      
      tiers.forEach(tier => {
        mockGtag.mockClear();
        
        trackLeadSubmit({
          sponsor_id: `sponsor-${tier}`,
          tier,
          sponsor_name: `${tier} Sponsor`
        });

        expect(mockGtag).toHaveBeenCalledWith('event', 'lead_submit', 
          expect.objectContaining({
            tier,
            event_label: `${tier}_sponsor_lead`
          })
        );
      });
    });
  });

  describe('trackEvent', () => {
    it('should track custom event when gtag is available', () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackEvent('custom_event', { param1: 'value1' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'custom_event', {
        param1: 'value1'
      });
    });

    it('should track event with empty params object', () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;

      trackEvent('simple_event');

      expect(mockGtag).toHaveBeenCalledWith('event', 'simple_event', {});
    });

    it('should warn when gtag is not available', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      trackEvent('test_event', { test: 'data' });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'GA4 not available - event not tracked: test_event',
        { test: 'data' }
      );

      consoleWarnSpy.mockRestore();
    });
  });
});
