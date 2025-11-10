import { useCallback } from 'react';
import { useConsent, CONSENT_CATEGORIES } from '../contexts/ConsentContext';

/**
 * Custom hook for tracking sponsor-related events in Google Analytics 4
 * Respects Consent Mode v2 - only fires events when analytics consent is given
 * 
 * @param {Object} sponsor - Sponsor object containing id, slug, tier
 * @returns {Object} - Analytics tracking functions
 */
const useSponsorAnalytics = (sponsor) => {
  const { hasConsent } = useConsent();

  /**
   * Check if analytics tracking is allowed
   * @returns {boolean} - True if consent is given for analytics
   */
  const canTrack = useCallback(() => {
    return hasConsent(CONSENT_CATEGORIES.ANALYTICS);
  }, [hasConsent]);

  /**
   * Send event to Google Analytics 4 via gtag
   * @param {string} eventName - Name of the event
   * @param {Object} eventParams - Event parameters
   */
  const sendEvent = useCallback((eventName, eventParams) => {
    if (!canTrack()) {
      // eslint-disable-next-line no-console
      console.log(`Analytics event blocked (no consent): ${eventName}`, eventParams);
      return;
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventParams);
      // eslint-disable-next-line no-console
      console.log(`Analytics event sent: ${eventName}`, eventParams);
    } else {
      // eslint-disable-next-line no-console
      console.warn('gtag is not available. Event not sent:', eventName, eventParams);
    }
  }, [canTrack]);

  /**
   * Track sponsor view event
   * Fires when a user views a sponsor's page or section
   */
  const trackViewSponsor = useCallback(() => {
    if (!sponsor) {
      // eslint-disable-next-line no-console
      console.warn('Cannot track view_sponsor: sponsor data is missing');
      return;
    }

    sendEvent('view_sponsor', {
      sponsor_id: sponsor.id,
      sponsor_slug: sponsor.slug,
      sponsor_tier: sponsor.tier
    });
  }, [sponsor, sendEvent]);

  /**
   * Track CTA click event
   * @param {string} ctaType - Type of CTA clicked (e.g., 'primary', 'secondary', 'website', 'booking')
   */
  const trackCtaClick = useCallback((ctaType) => {
    if (!sponsor) {
      // eslint-disable-next-line no-console
      console.warn('Cannot track cta_click: sponsor data is missing');
      return;
    }

    sendEvent('cta_click', {
      sponsor_id: sponsor.id,
      sponsor_slug: sponsor.slug,
      sponsor_tier: sponsor.tier,
      cta_type: ctaType
    });
  }, [sponsor, sendEvent]);

  /**
   * Track asset download event
   * @param {string} assetType - Type of asset downloaded (e.g., 'pdf', 'whitepaper', 'brochure', 'dossier')
   */
  const trackAssetDownload = useCallback((assetType) => {
    if (!sponsor) {
      // eslint-disable-next-line no-console
      console.warn('Cannot track asset_download: sponsor data is missing');
      return;
    }

    sendEvent('asset_download', {
      sponsor_id: sponsor.id,
      sponsor_slug: sponsor.slug,
      sponsor_tier: sponsor.tier,
      asset_type: assetType
    });
  }, [sponsor, sendEvent]);

  /**
   * Track lead submission event
   * Fires when a user submits a form to contact the sponsor
   */
  const trackLeadSubmit = useCallback(() => {
    if (!sponsor) {
      // eslint-disable-next-line no-console
      console.warn('Cannot track lead_submit: sponsor data is missing');
      return;
    }

    sendEvent('lead_submit', {
      sponsor_id: sponsor.id,
      sponsor_slug: sponsor.slug,
      sponsor_tier: sponsor.tier
    });
  }, [sponsor, sendEvent]);

  return {
    trackViewSponsor,
    trackCtaClick,
    trackAssetDownload,
    trackLeadSubmit,
    canTrack
  };
};

export default useSponsorAnalytics;
