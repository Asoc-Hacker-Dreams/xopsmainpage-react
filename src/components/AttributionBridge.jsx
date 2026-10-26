import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '../contexts/ConsentContext';
import {
  captureAttribution, clearAttribution, decorateConferenceLink, safeAnalyticsPageUrl,
} from '../analytics/attribution';
import { clearPurchaseLedger, trackPageView } from '../analytics/ga4';
import { clearCheckoutDeparture } from '../analytics/checkoutJourney';

/**
 * SPA-aware, opt-in-only attribution and pageview instrumentation.
 * The event listener propagates UTMs to a sibling X-Ops event domain only;
 * it never decorates Stripe, Sessionize, Microsoft or any other third party.
 */
export default function AttributionBridge() {
  const location = useLocation();
  const { consent, hasInteracted } = useConsent();
  const enabled = hasInteracted && consent.analytics === true;
  const lastPageRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      clearAttribution();
      clearPurchaseLedger();
      clearCheckoutDeparture();
      return;
    }
    captureAttribution(location.search, true);
  }, [enabled, location.search]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const handleClick = (event) => {
      const target = event.target;
      const anchor = target instanceof Element ? target.closest('a[href]') : null;
      if (!anchor) return;
      const decorated = decorateConferenceLink(anchor.href, window.location.origin);
      if (decorated) anchor.href = decorated;
    };
    // Capture phase decorates before the browser navigates on a real click.
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      lastPageRef.current = null;
      return;
    }
    // The app strips ?openTickets=1 immediately after rendering. It is not
    // another real page view. Collapse navigation states with the same safe URL.
    const safeUrl = safeAnalyticsPageUrl(window.location.href);
    if (lastPageRef.current === safeUrl) return;
    lastPageRef.current = safeUrl;
    trackPageView(safeUrl, document.title, document.referrer);
  }, [enabled, location.pathname, location.search]);

  return null;
}
