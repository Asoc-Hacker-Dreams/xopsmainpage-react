/**
 * Utility for tracking analytics events
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
