/**
 * Analytics utility for GA4 event tracking
 * Provides functions to track custom events with Google Analytics 4
 */

/**
 * Track a CTA click event in Google Analytics 4
 * @param {string} ctaType - Type of CTA (e.g., 'booking', 'contact', 'download')
 * @param {Object} additionalParams - Additional parameters to track
 */
export const trackCtaClick = (ctaType, additionalParams = {}) => {
  // Check if gtag is available (loaded via consent)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_type: ctaType,
      ...additionalParams
    });
    if (process.env.NODE_ENV === 'development') {
      console.log(`GA4 Event: cta_click - ${ctaType}`, additionalParams);
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`GA4 not available. Would track: cta_click - ${ctaType}`, additionalParams);
  }
};

/**
 * Track a lead submission event in GA4
 * @param {Object} params - Event parameters
 * @param {string} params.sponsor_id - Sponsor ID (e.g., "acme-corp-2025")
 * @param {string} params.tier - Sponsor tier (e.g., "platinum", "gold", "silver")
 * @param {string} [params.sponsor_name] - Optional sponsor name for better tracking
 */
export const trackLeadSubmit = ({ sponsor_id, tier, sponsor_name }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'lead_submit', {
      sponsor_id,
      tier,
      sponsor_name,
      event_category: 'engagement',
      event_label: `${tier}_sponsor_lead`
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 lead_submit event tracked:', { sponsor_id, tier, sponsor_name });
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('GA4 not available - event not tracked:', { sponsor_id, tier });
  }
};

/**
 * Track a generic event in Google Analytics 4
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    if (process.env.NODE_ENV === 'development') {
      console.log(`GA4 Event: ${eventName}`, eventParams);
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`GA4 not available. Would track: ${eventName}`, eventParams);
  }
};

export default {
  trackCtaClick,
  trackLeadSubmit,
  trackEvent
};
