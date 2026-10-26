import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import scriptManager from './scriptManager';

const essentialOnly = {essential:true,analytics:false};
const optedIn = {essential:true,analytics:true};

describe('GA4 tag lifecycle and basic consent mode', () => {
  beforeEach(() => {
    scriptManager.updateScripts(essentialOnly);
    document.getElementById('google-analytics')?.remove();
  });
  afterEach(() => { scriptManager.updateScripts(essentialOnly); });
  it('never loads the Google script before analytics opt-in', () => {
    expect(document.getElementById('google-analytics')).toBeNull();
    expect(typeof window.gtag).toBe('undefined');
  });
  it('loads only one Google script with denied ad consent and no automatic page views', () => {
    scriptManager.updateScripts(optedIn);
    scriptManager.updateScripts(optedIn);
    expect(document.querySelectorAll('#google-analytics')).toHaveLength(1);
    const commands = (window.dataLayer || []).map(args => Array.from(args));
    expect(commands).toContainEqual(['consent','default',expect.objectContaining({
      analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
    })]);
    expect(commands).toContainEqual(['consent','update',expect.objectContaining({
      analytics_storage:'granted',ad_storage:'denied',
    })]);
    expect(commands).toContainEqual(['config',expect.any(String),expect.objectContaining({
      send_page_view:false,
    })]);
  });
  it('removes optional tag on withdrawal and prevents additional events', () => {
    scriptManager.updateScripts(optedIn);
    scriptManager.updateScripts(essentialOnly);
    expect(document.getElementById('google-analytics')).toBeNull();
    expect(scriptManager.sendEvent('purchase',{transaction_id:'test'})).toBe(false);
  });
});
