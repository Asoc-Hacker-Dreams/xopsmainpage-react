import React, { useEffect } from 'react';
import { useConsent } from '../contexts/ConsentContext';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const { hasConsent } = useConsent();

  const trackEvent = (event: AnalyticsEvent) => {
    if (!hasConsent('analytics') || typeof window === 'undefined') {
      return;
    }

    if ((window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  };

  const trackPageView = (path: string, title?: string) => {
    if (!hasConsent('analytics') || typeof window === 'undefined') {
      return;
    }

    if ((window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
      });
    }
  };

  return { trackEvent, trackPageView };
};

export const analyticsEvents = {
  ticketClick: (ticketType: string) => ({
    action: 'ticket_click',
    category: 'tickets',
    label: ticketType,
  }),

  speakerView: (speakerName: string, speakerId: string) => ({
    action: 'speaker_view',
    category: 'speakers',
    label: speakerName,
    value: 1,
  }),

  agendaInteraction: (action: 'filter' | 'search' | 'favorite' | 'export', detail?: string) => ({
    action: `agenda_${action}`,
    category: 'agenda',
    label: detail,
  }),

  cfpSubmission: (track: string) => ({
    action: 'cfp_submit',
    category: 'cfp',
    label: track,
  }),

  shareEvent: (platform: string, contentType: string) => ({
    action: 'share',
    category: 'engagement',
    label: `${contentType} via ${platform}`,
  }),

  feedbackSubmit: (type: 'session' | 'event', rating: number) => ({
    action: 'feedback_submit',
    category: 'feedback',
    value: rating,
    label: type,
  }),

  networkingAction: (action: 'meeting_request' | 'profile_view' | 'connection') => ({
    action: `networking_${action}`,
    category: 'networking',
  }),

  pwaInstall: (outcome: 'accepted' | 'dismissed') => ({
    action: 'pwa_install_prompt',
    category: 'pwa',
    label: outcome,
  }),
};

const Analytics: React.FC = () => {
  const { hasConsent } = useConsent();

  useEffect(() => {
    if (!hasConsent('analytics')) {
      return;
    }

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [hasConsent('analytics')]);

  return null;
};

export default Analytics;
