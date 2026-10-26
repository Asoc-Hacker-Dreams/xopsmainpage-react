import { describe, expect, it } from 'vitest';
import {
  CHECKOUT_MARKER_KEY, rememberCheckoutDeparture, takeCheckoutDeparture,
  clearCheckoutDeparture,
} from './checkoutJourney';
const memory = () => {
  const m=new Map();
  return {
    getItem:k=>m.get(k)||null,
    setItem:(k,v)=>m.set(k,String(v)),
    removeItem:k=>m.delete(k),
  };
};
describe('checkout cancel tracking gate', () => {
  it('does not retain a checkout marker without analytics consent', () => {
    const s=memory();
    expect(rememberCheckoutDeparture('madrid','A',false,s,1000)).toBe(false);
    expect(s.getItem(CHECKOUT_MARKER_KEY)).toBeNull();
  });
  it('counts genuine completed departure at most once', () => {
    const s=memory();
    expect(rememberCheckoutDeparture('dubai','VIP',true,s,1000)).toBe(true);
    expect(takeCheckoutDeparture(s,1100)).toEqual({edition:'dubai',itemId:'VIP'});
    expect(takeCheckoutDeparture(s,1101)).toBeNull();
  });
  it('never counts expired marker or wrong event origin', () => {
    const s=memory();
    expect(rememberCheckoutDeparture('unknown','A',true,s,1000)).toBe(false);
    rememberCheckoutDeparture('madrid','A',true,s,1000);
    expect(takeCheckoutDeparture(s,1000 + 2*3600*1000 + 1)).toBeNull();
    clearCheckoutDeparture(s);
    expect(s.getItem(CHECKOUT_MARKER_KEY)).toBeNull();
  });
});
