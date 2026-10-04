// Analytics event tracking layer
import { trackEvent, getSessionId } from './storage';
import type { EventType, AnalyticsEvent } from './types';

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getUrlParams(): { ref?: string; campus?: string; src?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    ref: params.get('ref') || undefined,
    campus: params.get('campus') || undefined,
    src: params.get('src') || undefined,
  };
}

export function track(eventType: EventType, properties: Record<string, string | number | boolean> = {}): void {
  const urlParams = getUrlParams();
  const event: AnalyticsEvent = {
    id: generateId(),
    event: eventType,
    properties: {
      ...properties,
      url: window.location.pathname + window.location.search,
    },
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    source: urlParams.src || properties.source as string || 'direct',
    campus: urlParams.campus || properties.campus as string || undefined,
    referralCode: urlParams.ref || properties.referralCode as string || undefined,
  };
  trackEvent(event);
}

// Convenience helpers
export const Analytics = {
  landingView: () => track('landing_view'),
  passportStarted: (interest: string) => track('passport_started', { interest }),
  passportGenerated: (projectName: string, interest: string) =>
    track('passport_generated', { projectName, interest }),
  registrationStarted: () => track('registration_started'),
  registrationCompleted: (college: string, source: string) =>
    track('registration_completed', { college, source }),
  referralLinkCopied: (code: string) => track('referral_link_copied', { code }),
  whatsappClicked: (code: string) => track('whatsapp_clicked', { code }),
  referralRegistration: (referrerCode: string) =>
    track('referral_registration', { referrerCode }),
  campusLinkClicked: (campusCode: string) =>
    track('campus_link_clicked', { campusCode }),
  campusCaptainCreated: (college: string) =>
    track('campus_captain_created', { college }),
  experimentViewed: (experimentId: string) =>
    track('experiment_viewed', { experimentId }),
  experimentConversion: (experimentId: string, variant: string) =>
    track('experiment_conversion', { experimentId, variant }),
};
