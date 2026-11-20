import { describe, it, expect } from 'vitest';
import es from './locales/es.json';
import en from './locales/en.json';

/*
 * TG-48: el pedido gratuito necesita un mensaje de ÉXITO en ambos idiomas.
 * Debe existir en es y en, y no sonar a error ni a "sistema no disponible".
 */
describe('TG-48 ticketModal.checkout.success.freeRegistered', () => {
  it('existe en español y en inglés', () => {
    expect(es.ticketModal.checkout.success.freeRegistered).toBeTruthy();
    expect(en.ticketModal.checkout.success.freeRegistered).toBeTruthy();
  });

  it('no es un texto de error ni de sistema no disponible', () => {
    for (const lang of [es, en]) {
      const text = lang.ticketModal.checkout.success.freeRegistered;
      expect(text).not.toMatch(/no disponible|unavailable|error|fallo|failed/i);
      expect(text).not.toBe(lang.ticketModal.checkout.errors.networkError);
    }
  });

  it('confirma que la compra se completó', () => {
    expect(es.ticketModal.checkout.success.freeRegistered).toMatch(/Registro completado|confirmada/);
    expect(en.ticketModal.checkout.success.freeRegistered).toMatch(/Registration complete|confirmed/);
  });

  it('la confirmación pendiente existe en ambos idiomas, sin sonar a fallo ni a "no disponible"', () => {
    for (const lang of [es, en]) {
      const text = lang.ticketModal.checkout.success.freeConfirmationUnavailable;
      expect(text).toBeTruthy();
      expect(text).not.toMatch(/no disponible|unavailable|error|fallo|failed/i);
      expect(text).not.toBe(lang.ticketModal.checkout.errors.networkError);
    }
  });
});
