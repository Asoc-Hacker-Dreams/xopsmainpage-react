import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '../contexts/ConsentContext';
import { trackLocalAnalytics } from '../components/AnalyticsDashboard';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

interface AnalyticsEventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export function useAnalyticsEvents() {
  const { hasConsent } = useConsent();
  const location = useLocation();

  useEffect(() => {
    if (!hasConsent('analytics')) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location, hasConsent]);

  const trackEvent = useCallback(
    (options: AnalyticsEventOptions) => {
      if (!hasConsent('analytics')) return;

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', options.action, {
          event_category: options.category,
          event_label: options.label,
          value: options.value,
        });
      }

      if (import.meta.env.DEV) {
        console.log('[Analytics]', options);
      }
    },
    [hasConsent]
  );

  const trackTicketClick = useCallback(
    (ticketType: string, price?: number) => {
      trackEvent({
        category: 'tickets',
        action: 'click',
        label: ticketType,
        value: price,
      });
      trackLocalAnalytics('ticketClicks', 'click');
    },
    [trackEvent]
  );

  const trackSpeakerView = useCallback(
    (speakerId: string, speakerName: string) => {
      trackEvent({
        category: 'speakers',
        action: 'view',
        label: speakerName,
        value: 1,
      });
      trackLocalAnalytics('speakerViews', 'view', speakerId);
    },
    [trackEvent]
  );

  const trackAgendaInteraction = useCallback(
    (interactionType: 'filter' | 'search' | 'favorite' | 'export' | 'view', detail?: string) => {
      trackEvent({
        category: 'agenda',
        action: interactionType,
        label: detail,
      });
      trackLocalAnalytics('agendaInteractions', interactionType);
    },
    [trackEvent]
  );

  const trackCFPSubmission = useCallback(
    (track: string) => {
      trackEvent({
        category: 'cfp',
        action: 'submit',
        label: track,
      });
    },
    [trackEvent]
  );

  const trackShare = useCallback(
    (platform: string, contentType: string) => {
      trackEvent({
        category: 'engagement',
        action: 'share',
        label: `${contentType} via ${platform}`,
      });
      trackLocalAnalytics('shares', 'share', platform);
    },
    [trackEvent]
  );

  const trackFeedback = useCallback(
    (type: 'session' | 'event', rating: number, wouldRecommend?: boolean) => {
      trackEvent({
        category: 'feedback',
        action: 'submit',
        label: type,
        value: rating,
      });
    },
    [trackEvent]
  );

  const trackPWAInstall = useCallback(
    (outcome: 'accepted' | 'dismissed') => {
      trackEvent({
        category: 'pwa',
        action: 'install_prompt',
        label: outcome,
      });
    },
    [trackEvent]
  );

  const trackNetworkingAction = useCallback(
    (action: 'meeting_request' | 'profile_view' | 'connection' | 'message') => {
      trackEvent({
        category: 'networking',
        action,
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackTicketClick,
    trackSpeakerView,
    trackAgendaInteraction,
    trackCFPSubmission,
    trackShare,
    trackFeedback,
    trackPWAInstall,
    trackNetworkingAction,
  };
}

export default useAnalyticsEvents;
