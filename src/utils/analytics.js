/**
 * Analytics utility for GA4 event tracking
 * Provides functions to track custom events with Google Analytics 4
 */

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
    
    console.log('GA4 lead_submit event tracked:', { sponsor_id, tier, sponsor_name });
  } else {
    console.warn('GA4 not available - event not tracked:', { sponsor_id, tier });
  }
};

/**
 * Track a generic custom event in GA4
 * @param {string} eventName - Name of the event
 * @param {Object} params - Event parameters
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log(`GA4 event tracked: ${eventName}`, params);
  } else {
    console.warn(`GA4 not available - event not tracked: ${eventName}`, params);
  }
};

export default {
  trackLeadSubmit,
  trackEvent
};
