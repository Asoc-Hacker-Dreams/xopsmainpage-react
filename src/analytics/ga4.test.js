import { beforeEach, describe, expect, it, vi } from 'vitest';
import scriptManager from '../services/scriptManager';
import {
  PURCHASE_LEDGER_KEY, purchaseFromVerifiedStatus,
  emitVerifiedPurchase, trackBeginCheckout, trackPageView,
} from './ga4';

vi.mock('../services/scriptManager', () => ({
  default: {
    analyticsAllowed: true,
    sendEvent: vi.fn(() => true),
    sendEventBeforeLeaving: vi.fn(async () => true),
  },
}));
function memoryStorage() {
  const data = new Map();
  return {
    getItem: key => data.get(key) || null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: key => data.delete(key),
  };
}
const paid = {
  success: true,
  status: 'completed',
  orderNumber: 'HBC-2026-100001',
  totalAmount: 121,
  ecommerce: {
    transaction_id: 'HBC-2026-100001',
    currency: 'EUR',
    value: 100,
    tax: 21,
    edition: 'madrid',
    items: [{item_id:'SUMMIT-MADRID',item_name:'X-Ops Summit',price:100,quantity:1}],
  },
};

describe('GA4 purchase: trusted paid order only', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    scriptManager.analyticsAllowed = true;
  });
  it('constructs the recommended GA4 transaction with server amounts', () => {
    const result = purchaseFromVerifiedStatus(paid);
    expect(result).toMatchObject({
      transaction_id:'HBC-2026-100001', currency:'EUR',value:100,tax:21,
      items:[{item_id:'SUMMIT-MADRID',price:100,quantity:1}],
    });
    expect(JSON.stringify(result)).not.toContain('customerEmail');
  });
  it('rejects pending, unverified, forged or incomplete Stripe redirects', () => {
    expect(purchaseFromVerifiedStatus({...paid,status:'pending'})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,success:false})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,ecommerce:undefined})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,ecommerce:{...paid.ecommerce,transaction_id:''}})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,ecommerce:{...paid.ecommerce,transaction_id:'other-order'}})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,ecommerce:{...paid.ecommerce,currency:undefined}})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,ecommerce:{...paid.ecommerce,value:121}})).toBeNull();
    expect(purchaseFromVerifiedStatus({...paid,ecommerce:{...paid.ecommerce,items:[]}})).toBeNull();
  });
  it('allows a fully verified AED payment and explicitly distinct Dubai edition', () => {
    expect(purchaseFromVerifiedStatus({
      ...paid, status:'paid', ecommerce:{
        transaction_id:paid.orderNumber, value:150,currency:'AED',tax:0,edition:'dubai',
        items:[{item_id:'VIP-DXB',item_name:'VIP',price:75,quantity:2}],
      },
    })).toMatchObject({value:150,currency:'AED',xops_edition:'dubai'});
  });
  it('does not emit purchase without analytics consent', () => {
    const storage = memoryStorage();
    scriptManager.analyticsAllowed = false;
    expect(emitVerifiedPurchase(paid, storage, Date.now())).toBe(false);
    expect(scriptManager.sendEvent).not.toHaveBeenCalled();
    expect(storage.getItem(PURCHASE_LEDGER_KEY)).toBeNull();
  });
  it('emits exactly once per paid transaction ID on remount/reload', () => {
    const storage = memoryStorage(), now = Date.now();
    expect(emitVerifiedPurchase(paid,storage,now)).toBe(true);
    expect(emitVerifiedPurchase(paid,storage,now+1)).toBe(false);
    expect(scriptManager.sendEvent).toHaveBeenCalledTimes(1);
    expect(scriptManager.sendEvent).toHaveBeenCalledWith('purchase', expect.objectContaining({
      transaction_id:paid.orderNumber,value:100,currency:'EUR',tax:21,
    }));
  });
  it('protects page URLs from sensitive checkout session IDs', () => {
    trackPageView('https://xopsconference.com/tickets/success?session_id=cs_test_private&utm_source=google','Success');
    expect(scriptManager.sendEvent).toHaveBeenCalledWith('page_view', expect.objectContaining({
      page_location:'https://xopsconference.com/tickets/success?utm_source=google',
    }));
  });
  it('counts checkout without inventing revenue when tax basis is unverified', () => {
    const event={name:'X-Ops Madrid 2026'};
    const tier={id:'A',name:'VIP',tierCode:'VIP',price:121,currency:'EUR'};
    expect(trackBeginCheckout(event,tier,'madrid')).toBe(true);
    const params = scriptManager.sendEvent.mock.calls[0][1];
    expect(params).toMatchObject({currency:'EUR',xops_edition:'madrid',items:[{item_id:'A',quantity:1}]});
    expect(params.value).toBeUndefined();
    expect(params.items[0].price).toBeUndefined();
  });
});
