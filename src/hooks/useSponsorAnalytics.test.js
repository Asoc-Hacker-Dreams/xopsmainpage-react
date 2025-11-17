import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useSponsorAnalytics from './useSponsorAnalytics';
import { useConsent, CONSENT_CATEGORIES } from '../contexts/ConsentContext';

// Mock the ConsentContext
vi.mock('../contexts/ConsentContext', () => ({
  useConsent: vi.fn(),
  CONSENT_CATEGORIES: {
    ESSENTIAL: 'essential',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing'
  }
}));

describe('useSponsorAnalytics hook', () => {
  const mockSponsor = {
    id: 'test-sponsor-123',
    slug: 'test-sponsor',
    tier: 'platinum'
  };

  let mockGtag;
  let mockHasConsent;
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Mock console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Setup gtag mock
    mockGtag = vi.fn();
    window.gtag = mockGtag;

    // Setup default consent mock (with consent)
    mockHasConsent = vi.fn((category) => category === CONSENT_CATEGORIES.ANALYTICS);
    useConsent.mockReturnValue({
      hasConsent: mockHasConsent
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    delete window.gtag;
  });

  describe('canTrack', () => {
    it('should return true when analytics consent is given', () => {
      mockHasConsent.mockReturnValue(true);
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      expect(result.current.canTrack()).toBe(true);
    });

    it('should return false when analytics consent is not given', () => {
      mockHasConsent.mockReturnValue(false);
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      expect(result.current.canTrack()).toBe(false);
    });
  });

  describe('trackViewSponsor', () => {
    it('should fire view_sponsor event with correct parameters when consent is given', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackViewSponsor();
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'view_sponsor', {
        sponsor_id: 'test-sponsor-123',
        sponsor_slug: 'test-sponsor',
        sponsor_tier: 'platinum'
      });
    });

    it('should not fire event when consent is not given', () => {
      mockHasConsent.mockReturnValue(false);
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackViewSponsor();
      });

      expect(mockGtag).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Analytics event blocked (no consent): view_sponsor'),
        expect.any(Object)
      );
    });

    it('should warn when sponsor data is missing', () => {
      const { result } = renderHook(() => useSponsorAnalytics(null));

      act(() => {
        result.current.trackViewSponsor();
      });

      expect(mockGtag).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cannot track view_sponsor: sponsor data is missing'
      );
    });

    it('should warn when gtag is not available', () => {
      delete window.gtag;
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackViewSponsor();
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('gtag is not available'),
        'view_sponsor',
        expect.any(Object)
      );
    });
  });

  describe('trackCtaClick', () => {
    it('should fire cta_click event with correct parameters when consent is given', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackCtaClick('primary');
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click', {
        sponsor_id: 'test-sponsor-123',
        sponsor_slug: 'test-sponsor',
        sponsor_tier: 'platinum',
        cta_type: 'primary'
      });
    });

    it('should not fire event when consent is not given', () => {
      mockHasConsent.mockReturnValue(false);
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackCtaClick('secondary');
      });

      expect(mockGtag).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Analytics event blocked (no consent): cta_click'),
        expect.any(Object)
      );
    });

    it('should handle different CTA types', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      const ctaTypes = ['primary', 'secondary', 'website', 'booking'];
      
      ctaTypes.forEach((ctaType) => {
        act(() => {
          result.current.trackCtaClick(ctaType);
        });

        expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click', 
          expect.objectContaining({ cta_type: ctaType })
        );
      });

      expect(mockGtag).toHaveBeenCalledTimes(ctaTypes.length);
    });
  });

  describe('trackAssetDownload', () => {
    it('should fire asset_download event with correct parameters when consent is given', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackAssetDownload('pdf');
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'asset_download', {
        sponsor_id: 'test-sponsor-123',
        sponsor_slug: 'test-sponsor',
        sponsor_tier: 'platinum',
        asset_type: 'pdf'
      });
    });

    it('should not fire event when consent is not given', () => {
      mockHasConsent.mockReturnValue(false);
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackAssetDownload('brochure');
      });

      expect(mockGtag).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Analytics event blocked (no consent): asset_download'),
        expect.any(Object)
      );
    });

    it('should handle different asset types', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      const assetTypes = ['pdf', 'whitepaper', 'brochure', 'dossier'];
      
      assetTypes.forEach((assetType) => {
        act(() => {
          result.current.trackAssetDownload(assetType);
        });

        expect(mockGtag).toHaveBeenCalledWith('event', 'asset_download', 
          expect.objectContaining({ asset_type: assetType })
        );
      });

      expect(mockGtag).toHaveBeenCalledTimes(assetTypes.length);
    });
  });

  describe('trackLeadSubmit', () => {
    it('should fire lead_submit event with correct parameters when consent is given', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackLeadSubmit();
      });

      expect(mockGtag).toHaveBeenCalledWith('event', 'lead_submit', {
        sponsor_id: 'test-sponsor-123',
        sponsor_slug: 'test-sponsor',
        sponsor_tier: 'platinum'
      });
    });

    it('should not fire event when consent is not given', () => {
      mockHasConsent.mockReturnValue(false);
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackLeadSubmit();
      });

      expect(mockGtag).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Analytics event blocked (no consent): lead_submit'),
        expect.any(Object)
      );
    });

    it('should warn when sponsor data is missing', () => {
      const { result } = renderHook(() => useSponsorAnalytics(null));

      act(() => {
        result.current.trackLeadSubmit();
      });

      expect(mockGtag).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Cannot track lead_submit: sponsor data is missing'
      );
    });
  });

  describe('Acceptance Criteria Tests', () => {
    it('AC1: When cookies are accepted and navigating microsite, view_sponsor fires with sponsor_id', () => {
      // Given: cookies accepted (analytics consent = true)
      mockHasConsent.mockReturnValue(true);
      
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      // When: navigating to microsite (trackViewSponsor is called)
      act(() => {
        result.current.trackViewSponsor();
      });

      // Then: view_sponsor event fires with sponsor_id
      expect(mockGtag).toHaveBeenCalledWith('event', 'view_sponsor', 
        expect.objectContaining({
          sponsor_id: 'test-sponsor-123'
        })
      );
    });

    it('AC2: When no consent and clicking CTA, no event is fired', () => {
      // Given: no consent (analytics consent = false)
      mockHasConsent.mockReturnValue(false);
      
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      // When: clicking CTA (trackCtaClick is called)
      act(() => {
        result.current.trackCtaClick('primary');
      });

      // Then: no event is fired
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });

  describe('Integration scenarios', () => {
    it('should work with different sponsor tiers', () => {
      const tiers = ['platinum', 'gold', 'silver', 'community'];

      tiers.forEach((tier) => {
        const sponsor = { ...mockSponsor, tier };
        const { result } = renderHook(() => useSponsorAnalytics(sponsor));

        act(() => {
          result.current.trackViewSponsor();
        });

        expect(mockGtag).toHaveBeenCalledWith('event', 'view_sponsor',
          expect.objectContaining({ sponsor_tier: tier })
        );
      });
    });

    it('should handle multiple events in sequence', () => {
      const { result } = renderHook(() => useSponsorAnalytics(mockSponsor));

      act(() => {
        result.current.trackViewSponsor();
        result.current.trackCtaClick('primary');
        result.current.trackAssetDownload('pdf');
        result.current.trackLeadSubmit();
      });

      expect(mockGtag).toHaveBeenCalledTimes(4);
      expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'view_sponsor', expect.any(Object));
      expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'cta_click', expect.any(Object));
      expect(mockGtag).toHaveBeenNthCalledWith(3, 'event', 'asset_download', expect.any(Object));
      expect(mockGtag).toHaveBeenNthCalledWith(4, 'event', 'lead_submit', expect.any(Object));
    });

    it('should respect consent changes dynamically', () => {
      const { result, rerender } = renderHook(() => useSponsorAnalytics(mockSponsor));

      // Initially with consent
      mockHasConsent.mockReturnValue(true);
      rerender();

      act(() => {
        result.current.trackViewSponsor();
      });
      expect(mockGtag).toHaveBeenCalledTimes(1);

      // After consent is revoked
      mockGtag.mockClear();
      mockHasConsent.mockReturnValue(false);
      rerender();

      act(() => {
        result.current.trackViewSponsor();
      });
      expect(mockGtag).not.toHaveBeenCalled();
    });
  });
});
