import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { trackCtaClick, trackEvent } from './analytics';

describe('Analytics Utilities', () => {
  let originalGtag;
  let originalConsole;

  beforeEach(() => {
    // Save original values
    originalGtag = window.gtag;
    originalConsole = console.log;
    
    // Mock console.log
    console.log = vi.fn();
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

    it('should log to console when gtag is not available', () => {
      // Ensure gtag is not available
      delete window.gtag;

      trackCtaClick('booking', { sponsor_name: 'Test Sponsor' });

      expect(console.log).toHaveBeenCalledWith(
        'GA4 not available. Would track: cta_click - booking',
        { sponsor_name: 'Test Sponsor' }
      );
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

  describe('trackEvent', () => {
    it('should call gtag with correct parameters when gtag is available', () => {
      window.gtag = vi.fn();

      trackEvent('custom_event', { param1: 'value1', param2: 'value2' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'custom_event', {
        param1: 'value1',
        param2: 'value2'
      });
    });

    it('should log to console when gtag is not available', () => {
      delete window.gtag;

      trackEvent('custom_event', { param1: 'value1' });

      expect(console.log).toHaveBeenCalledWith(
        'GA4 not available. Would track: custom_event',
        { param1: 'value1' }
      );
    });

    it('should work with empty event parameters', () => {
      window.gtag = vi.fn();

      trackEvent('simple_event');

      expect(window.gtag).toHaveBeenCalledWith('event', 'simple_event', {});
    });
  });
});
