import { describe, it, expect } from 'vitest';
import { resolveCheckoutOutcome, PLATFORM_HOSTS } from './checkoutOutcome';

/*
 * TG-48: el pedido gratuito (cupón 100 %) NO es un error. El backend devuelve
 * mode:'free' con una sessionUrl que es NUESTRA successUrl (sin Stripe). La
 * decisión debe basarse en "la compra se completó", no en "hay URL de Stripe".
 * Y la URL de redirección debe validarse por host: nunca se redirige a
 * cualquier sitio que venga del backend.
 */

const ORIGIN = 'https://dubai.xopsconference.com';
const FREE_URL = `${ORIGIN}/tickets/success?session_id=cs_free_abc123`;
const STRIPE_URL = 'https://checkout.stripe.com/c/pay/cs_test_123';

describe('TG-48 resolveCheckoutOutcome — camino gratuito es un éxito', () => {
  it('mode:free con sessionUrl de la plataforma → éxito en modo free, sin error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: FREE_URL, totalAmount: 0 },
      ORIGIN,
    );
    expect(out).toEqual({ ok: true, mode: 'free', url: FREE_URL });
  });

  it('mode:free NO depende de checkout.stripe.com: la URL de la plataforma basta', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: FREE_URL },
      ORIGIN,
    );
    expect(out.ok).toBe(true);
    expect(out.mode).toBe('free');
  });

  it('mode:free acepta redirectUrl cuando no hay sessionUrl', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', redirectUrl: FREE_URL },
      ORIGIN,
    );
    expect(out).toEqual({ ok: true, mode: 'free', url: FREE_URL });
  });

  it('mode:free sin ninguna URL → error sin mensaje de backend (no hay redirección)', () => {
    const out = resolveCheckoutOutcome({ success: true, mode: 'free' }, ORIGIN);
    expect(out.ok).toBe(false);
  });

  it('mode:free sin ninguna URL → código propio de confirmación pendiente, NO el genérico', () => {
    // El pedido gratuito SÍ está completado: no puede caer en "sistema no disponible".
    const out = resolveCheckoutOutcome({ success: true, mode: 'free' }, ORIGIN);
    expect(out).toEqual({ ok: false, message: null, code: 'free_confirmation_unavailable' });
  });
});

describe('TG-48 resolveCheckoutOutcome — camino de pago Stripe sin cambios', () => {
  it('pago normal con checkout.stripe.com → redirige a Stripe', () => {
    const out = resolveCheckoutOutcome(
      { success: true, sessionUrl: STRIPE_URL },
      ORIGIN,
    );
    expect(out).toEqual({ ok: true, mode: 'stripe', url: STRIPE_URL });
  });

  it('pago normal con redirectUrl de Stripe → redirige a Stripe', () => {
    const out = resolveCheckoutOutcome(
      { success: true, redirectUrl: STRIPE_URL },
      ORIGIN,
    );
    expect(out).toEqual({ ok: true, mode: 'stripe', url: STRIPE_URL });
  });

  it('pago normal con URL que no es Stripe ni plataforma → error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, sessionUrl: 'https://evil.example/pay' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('pago normal con checkout.stripe.com en http → error (solo https)', () => {
    const out = resolveCheckoutOutcome(
      { success: true, sessionUrl: 'http://checkout.stripe.com/c/pay/x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });
});

describe('TG-48 seguridad: host de la sessionUrl del camino gratuito', () => {
  it('host ajeno en pedido gratuito → código de confirmación pendiente (no el genérico)', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'https://evil.example/tickets/success?session_id=x' },
      ORIGIN,
    );
    expect(out).toEqual({ ok: false, message: null, code: 'free_confirmation_unavailable' });
  });

  it('página https: una URL http del MISMO host no es de confianza (origen exacto, incluido esquema)', () => {
    // En producción el origen de la página es https; el match de origen exige el mismo esquema.
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'http://dubai.xopsconference.com/tickets/success?session_id=x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('host ajeno (phishing) → error, no redirige', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'https://evil.example/tickets/success?session_id=x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('host ajeno con http → error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'http://evil.example/x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('esquema javascript: o data: → error', () => {
    // Entradas de prueba que deben rechazarse; no se ejecutan nunca.
    // eslint-disable-next-line no-script-url -- input hostil de test, no una URL usada
    const hostile = ['javascript:alert(1)', 'data:text/html,<script>x</script>'];
    for (const sessionUrl of hostile) {
      const out = resolveCheckoutOutcome({ success: true, mode: 'free', sessionUrl }, ORIGIN);
      expect(out.ok, sessionUrl).toBe(false);
    }
  });

  it('URL malformada → error sin lanzar excepción', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'no es una url ::' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('sufijo de dominio falso (xopsconference.com.evil.example) → error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'https://xopsconference.com.evil.example/x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('prefijo de dominio falso (evilxopsconference.com) → error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'https://evilxopsconference.com/x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('truco de userinfo (dominio real como usuario) → error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'https://dubai.xopsconference.com@evil.example/x' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('hosts de la plataforma (madrid, dubai, apex, www) por https → éxito', () => {
    for (const host of ['xopsconference.com', 'www.xopsconference.com', 'madrid.xopsconference.com', 'dubai.xopsconference.com']) {
      const url = `https://${host}/tickets/success?session_id=cs_free_1`;
      const out = resolveCheckoutOutcome({ success: true, mode: 'free', sessionUrl: url }, ORIGIN);
      expect(out, host).toEqual({ ok: true, mode: 'free', url });
    }
  });

  it('host de la plataforma pero en http → error', () => {
    const out = resolveCheckoutOutcome(
      { success: true, mode: 'free', sessionUrl: 'http://madrid.xopsconference.com/tickets/success' },
      ORIGIN,
    );
    expect(out.ok).toBe(false);
  });

  it('origen de la página actual (p. ej. localhost en dev, http) → éxito', () => {
    const localOrigin = 'http://localhost:5173';
    const url = `${localOrigin}/tickets/success?session_id=cs_free_1`;
    const out = resolveCheckoutOutcome({ success: true, mode: 'free', sessionUrl: url }, localOrigin);
    expect(out).toEqual({ ok: true, mode: 'free', url });
  });

  it('PLATFORM_HOSTS contiene el dominio de la web y sus variantes, sin wildcards', () => {
    expect(PLATFORM_HOSTS).toEqual(expect.arrayContaining([
      'xopsconference.com', 'www.xopsconference.com',
      'madrid.xopsconference.com', 'dubai.xopsconference.com',
    ]));
    for (const host of PLATFORM_HOSTS) {
      expect(host).not.toMatch(/[*\s/]/);
    }
  });
});

describe('TG-48 un fallo real del backend no se esconde', () => {
  it('success:false con message → devuelve el mensaje real del backend', () => {
    const out = resolveCheckoutOutcome(
      { success: false, message: 'Quota exceeded for this code' },
      ORIGIN,
    );
    expect(out).toEqual({ ok: false, message: 'Quota exceeded for this code' });
  });

  it('success:false solo con error → devuelve error', () => {
    const out = resolveCheckoutOutcome({ success: false, error: 'CODE_EXHAUSTED' }, ORIGIN);
    expect(out).toEqual({ ok: false, message: 'CODE_EXHAUSTED' });
  });

  it('success:false sin mensaje → message null (el modal usa el genérico)', () => {
    const out = resolveCheckoutOutcome({ success: false }, ORIGIN);
    expect(out).toEqual({ ok: false, message: null });
  });

  it('respuesta vacía o nula → error sin mensaje', () => {
    expect(resolveCheckoutOutcome(null, ORIGIN)).toEqual({ ok: false, message: null });
    expect(resolveCheckoutOutcome(undefined, ORIGIN)).toEqual({ ok: false, message: null });
  });

  it('success:true sin URL utilizable (no es free) → message null', () => {
    const out = resolveCheckoutOutcome({ success: true }, ORIGIN);
    expect(out).toEqual({ ok: false, message: null });
  });
});
