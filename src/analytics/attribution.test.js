import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTION_KEY, captureAttribution, readAttribution, clearAttribution,
  buildAttributionForCheckout, parseUtm, safeAnalyticsPageUrl,
  decorateConferenceLink, campaignEventParams,
} from './attribution';

function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => { data.set(key, String(value)); },
    removeItem: key => { data.delete(key); },
  };
}
describe('consent-gated UTM attribution', () => {
  it('never persists campaign data before consent', () => {
    const storage = memoryStorage();
    expect(captureAttribution('?utm_source=linkedin&utm_medium=paid', false, storage, 1000)).toBeNull();
    expect(storage.getItem(ATTRIBUTION_KEY)).toBeNull();
  });
  it('retains first/last campaign touch through checkout and SPA navigation', () => {
    const storage = memoryStorage();
    const now = Date.now();
    captureAttribution('?utm_source=linkedin&utm_medium=social&utm_campaign=launch', true, storage, now - 2000);
    captureAttribution('?q=agenda', true, storage, now - 1000);
    captureAttribution('?utm_source=newsletter&utm_campaign=reminder', true, storage, now);
    const record = readAttribution(storage, now + 1);
    expect(record.firstTouch).toMatchObject({utm_source:'linkedin',utm_campaign:'launch'});
    expect(record.lastTouch).toMatchObject({utm_source:'newsletter',utm_campaign:'reminder'});
    const checkout = buildAttributionForCheckout(storage);
    expect(checkout.firstTouch.utm_source).toBe('linkedin');
    expect(checkout.lastTouch.utm_source).toBe('newsletter');
    expect(campaignEventParams(storage)).toMatchObject({xops_utm_source:'newsletter'});
  });
  it('expires attribution after 24 hours and removes it on withdrawal', () => {
    const storage = memoryStorage();
    captureAttribution('?utm_source=google', true, storage, 1000);
    expect(readAttribution(storage, 1000 + 24 * 3600 * 1000 + 1)).toBeNull();
    captureAttribution('?utm_source=google', true, storage, Date.now());
    clearAttribution(storage);
    expect(storage.getItem(ATTRIBUTION_KEY)).toBeNull();
  });
  it('rejects email, long numeric identifiers, injection and external URLs in UTMs', () => {
    expect(parseUtm('?utm_source=alice%40example.com&utm_medium=cpc&utm_content=https%3A%2F%2Fevil.test')).toEqual({utm_medium:'cpc'});
    expect(parseUtm('?utm_campaign=123456789012345')).toBeNull();
    expect(parseUtm('?utm_source=LinkedIn&utm_campaign=Octubre_2026')).toEqual({utm_source:'LinkedIn',utm_campaign:'Octubre_2026'});
  });
  it('never leaks Stripe session_id, email, auth code or location fragment to GA4', () => {
    const url = safeAnalyticsPageUrl('https://madrid.xopsconference.com/tickets/success?session_id=cs_test_private&email=a%40b.com&utm_source=google#private');
    expect(url).toBe('https://madrid.xopsconference.com/tickets/success?utm_source=google');
  });
  it('propagates UTMs only on sibling X-Ops hosts, never to Stripe or another company', () => {
    const storage = memoryStorage();
    captureAttribution('?utm_source=linkedin&utm_campaign=madrid', true, storage, Date.now());
    expect(decorateConferenceLink('https://dubai.xopsconference.com/', 'https://xopsconference.com', storage))
      .toContain('utm_source=linkedin');
    expect(decorateConferenceLink('https://checkout.stripe.com/c/pay/test', 'https://xopsconference.com', storage)).toBeNull();
    expect(decorateConferenceLink('https://xopsconference.com/tickets', 'https://xopsconference.com', storage)).toBeNull();
    expect(decorateConferenceLink('https://other-site.example/', 'https://xopsconference.com', storage)).toBeNull();
    expect(decorateConferenceLink('https://dubai.xopsconference.com/?utm_source=partner', 'https://xopsconference.com', storage))
      .toContain('utm_source=partner');
  });
});
