import React from 'react';
import { useConsent } from '../contexts/ConsentContext';
import { trackGa4Event, trackPageView as trackSafePageView } from '../analytics/ga4';

/**
 * Compatibility hook for legacy components. ScriptManager is the ONLY
 * Google tag loader. Calling gtag('config') per route would create duplicate
 * pageviews and may disclose query parameters such as Stripe session_id.
 */
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}
export const useAnalytics = () => {
  const { hasConsent } = useConsent();
  const trackEvent = (event: AnalyticsEvent) => {
    if (!hasConsent('analytics')) return;
    trackGa4Event(event.action, {
      event_category: event.category,
      ...(event.label && { event_label: event.label.slice(0, 100) }),
      ...(Number.isFinite(event.value) && { value: event.value }),
    });
  };
  const trackPageView = (path: string, title?: string) => {
    if (!hasConsent('analytics') || typeof window === 'undefined') return;
    // Explicit opt-in is required, and even legacy routes get sanitised.
    trackSafePageView(new URL(path, window.location.origin).href, title || document.title);
  };
  return { trackEvent, trackPageView };
};

export const analyticsEvents = {
  ticketClick: (ticketType: string) => ({ action:'ticket_click', category:'tickets', label:ticketType }),
  speakerView: (speakerName: string, speakerId: string) =>
    ({ action:'speaker_view', category:'speakers', label:speakerName, value:1, speakerId }),
  agendaInteraction: (action: 'filter'|'search'|'favorite'|'export', detail?: string) =>
    ({ action:'agenda_' + action, category:'agenda', label:detail }),
  cfpSubmission: (track: string) => ({ action:'cfp_submit', category:'cfp', label:track }),
  shareEvent: (platform: string, contentType: string) =>
    ({ action:'share', category:'engagement', label:contentType + ' via ' + platform }),
  feedbackSubmit: (type: 'session'|'event', rating: number) =>
    ({ action:'feedback_submit', category:'feedback', label:type, value:rating }),
  networkingAction: (action: 'meeting_request'|'profile_view'|'connection') =>
    ({ action:'networking_' + action, category:'networking' }),
  pwaInstall: (outcome: 'accepted'|'dismissed') =>
    ({ action:'pwa_install_prompt', category:'pwa', label:outcome }),
};

// Kept as an inert component so archived/legacy pages do not instantiate a
// second GA4 tag. src/components/ScriptManager.jsx handles consent and loading.
const Analytics: React.FC = () => null;
export default Analytics;
