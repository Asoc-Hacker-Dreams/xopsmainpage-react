import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TicketModal from './TicketModal';
import { triskelGateClient } from '../adapters/triskelgate/client';
import { trackCheckoutRedirect } from '../analytics/ga4';
import { rememberCheckoutDeparture } from '../analytics/checkoutJourney';

/*
 * TG-48 — fija en el componente el comportamiento tras createCheckout.
 *
 * Qué NO puede fijar jsdom: que `location.assign` navegue. Por eso el mock de
 * assign registra qué hay en pantalla en el MOMENTO de la navegación. Así el test
 * comprueba el orden real: la confirmación se pinta primero y la navegación se
 * pide después, con un retardo.
 *  - pedido gratuito con URL de confianza: confirmación visible → navegación;
 *  - pedido gratuito sin URL de confianza: confirmación + aviso, SIN navegar y
 *    sin el mensaje de "sistema no disponible";
 *  - pago Stripe: redirige a Stripe como antes;
 *  - fallo real del backend: su mensaje, no el genérico.
 */

vi.mock('../adapters/triskelgate/client', () => ({
  triskelGateClient: {
    listEvents: vi.fn(),
    listTicketTypes: vi.fn(),
    createCheckout: vi.fn(),
    validateDiscount: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'es' } }),
}));

vi.mock('../contexts/ConsentContext', () => ({
  useConsent: () => ({ consent: { analytics: false }, hasInteracted: false }),
  CONSENT_POLICY_VERSION: 'test-policy',
}));

vi.mock('../analytics/ga4', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    trackCheckoutRedirect: vi.fn(async () => {}),
    trackBeginCheckout: vi.fn(() => false),
    trackGa4Event: vi.fn(),
  };
});

vi.mock('../analytics/checkoutJourney', () => ({ rememberCheckoutDeparture: vi.fn() }));

vi.mock('../services/scriptManager', () => ({
  default: { getIdentifiers: vi.fn(async () => ({})) },
}));

const PAGE_ORIGIN = 'https://dubai.xopsconference.com';
const originalLocation = window.location;
let assignMock;

const DUBAI_EVENT = {
  id: 2,
  name: 'X-Ops Dubai 2026',
  status: 'active',
  startDate: '2026-11-30T00:00:00Z',
  organizerId: null,
  ticketTypes: [],
};
const TICKET = {
  id: 7,
  name: 'Daily Ticket',
  price: 200,
  currency: 'AED',
  isActive: true,
  saleStartDate: null,
  saleEndDate: null,
};
const STRIPE_URL = 'https://checkout.stripe.com/c/pay/cs_test_123';
// Cupón de ponente: deja el importe a 0 (pedido gratuito). Cupón parcial: deja 150 (pago).
const SPEAKER_COUPON = 'SPEAKER100';
const PARTIAL_COUPON = 'HALF50';
// Forma real de TGDiscountQuote (src/adapters/triskelgate/types.ts).
const quoteFor = (code, finalAmount) => ({
  success: true,
  discount: {
    id: 1, code, type: 'fixed', value: 200 - finalAmount, currency: 'AED',
    ticketTypeId: TICKET.id, quantity: 1,
    originalAmount: 200, discountAmount: 200 - finalAmount, finalAmount,
    originalTotalCents: 20000, discountCents: (200 - finalAmount) * 100, finalCents: finalAmount * 100,
  },
});
const freeQuote = (code) => quoteFor(code, 0);
const partialQuote = (code) => quoteFor(code, 150);

// Rellena el paso de checkout sin enviar. `coupon` (opcional) escribe el cupón en el campo;
// `coupon: ''` lo borra.
async function fillCheckout({ coupon } = {}) {
  // En Dubai el CTA del selector dice "ticketModal.requestAccess" (el evento
  // es cerrado: el CTA publico lleva al formulario, no al checkout). Este test
  // abre el checkout con `allowIndividualCheckout`, asi que el boton es el de
  // la entrada general.
  const buy = await screen.findByRole('button', {
    name: /ticketModal\.(requestAccess|checkout\.title)/,
  });
  fireEvent.click(buy);
  fireEvent.change(screen.getByLabelText(/ticketModal\.checkout\.fullName/), { target: { value: 'Ana Pérez' } });
  fireEvent.change(screen.getByLabelText(/ticketModal\.checkout\.email/), { target: { value: 'ana@example.org' } });
  // Las condiciones se conservan entre aperturas del modal: no volver a marcarlas (las desmarcaría).
  if (!document.getElementById('tm-terms').checked) fireEvent.click(document.getElementById('tm-terms'));
  if (coupon !== undefined) fireEvent.change(document.getElementById('tm-discount'), { target: { value: coupon } });
}

async function fillCheckoutAndSubmit(options) {
  await fillCheckout(options);
  // Por tipo y no por nombre: con el envío en curso el botón muestra un spinner, no su etiqueta.
  fireEvent.click(document.querySelector('button[type="submit"]'));
}

async function reachCheckoutForm(options) {
  // El checkout de Dubai se abre con `allowIndividualCheckout`: en la via
  // publica el CTA lleva al formulario de solicitud (el evento es cerrado).
  // Este test ejercita la MECANICA del checkout (pedido gratuito, navegacion
  // diferida, errores), que es la misma que se usa cuando el equipo envia un
  // enlace de pago individual a quien acepto la solicitud.
  render(<TicketModal show onHide={() => {}} allowIndividualCheckout />);
  await fillCheckoutAndSubmit(options);
}

beforeEach(() => {
  assignMock = vi.fn();
  delete window.location;
  window.location = {
    origin: PAGE_ORIGIN,
    hostname: 'dubai.xopsconference.com',
    search: '',
    href: `${PAGE_ORIGIN}/`,
    assign: assignMock,
  };
  triskelGateClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
  triskelGateClient.listTicketTypes.mockResolvedValue([TICKET]);
  triskelGateClient.validateDiscount.mockReset();
});

afterEach(() => {
  window.location = originalLocation;
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

// Tiempo máximo que esperamos a la navegación diferida (el modal usa 1500 ms).
const NAVIGATION_TIMEOUT = { timeout: 4000 };

describe('TG-48 TicketModal tras createCheckout', () => {
  it('pedido gratuito: la confirmación está en pantalla ANTES de pedir la navegación', async () => {
    const freeUrl = `${PAGE_ORIGIN}/tickets/success?session_id=cs_free_abc`;
    let alertVisibleAtNavigation = null;
    // Simula la navegación: en ese instante, ¿el usuario ve ya la confirmación?
    assignMock.mockImplementation(() => {
      alertVisibleAtNavigation = screen.queryByText('ticketModal.checkout.success.freeRegistered') !== null;
    });
    triskelGateClient.createCheckout.mockResolvedValue({
      success: true, mode: 'free', sessionUrl: freeUrl, totalAmount: 0,
    });

    await reachCheckoutForm();

    expect(await screen.findByText('ticketModal.checkout.success.freeRegistered')).toBeInTheDocument();
    expect(assignMock).not.toHaveBeenCalled();
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(freeUrl), NAVIGATION_TIMEOUT);
    expect(alertVisibleAtNavigation).toBe(true);
    expect(screen.queryByText('ticketModal.checkout.errors.networkError')).toBeNull();
  });

  it('pedido gratuito: el botón de compra queda bloqueado mientras se confirma y redirige', async () => {
    const freeUrl = `${PAGE_ORIGIN}/tickets/success?session_id=cs_free_abc`;
    triskelGateClient.validateDiscount.mockResolvedValue(freeQuote(SPEAKER_COUPON));
    triskelGateClient.createCheckout.mockResolvedValue({
      success: true, mode: 'free', sessionUrl: freeUrl, totalAmount: 0,
    });

    await reachCheckoutForm({ coupon: SPEAKER_COUPON });
    await screen.findByText('ticketModal.checkout.success.freeRegistered');

    const submit = document.querySelector('button[type="submit"]');
    expect(submit).not.toBeNull();
    expect(submit).toBeDisabled();
    expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(freeUrl), NAVIGATION_TIMEOUT);
  });

  it('pedido gratuito: no cuenta como intento de pago ni como salida a Stripe', async () => {
    const freeUrl = `${PAGE_ORIGIN}/tickets/success?session_id=cs_free_abc`;
    triskelGateClient.createCheckout.mockResolvedValue({
      success: true, mode: 'free', sessionUrl: freeUrl, totalAmount: 0,
    });

    await reachCheckoutForm();
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(freeUrl), NAVIGATION_TIMEOUT);

    expect(trackCheckoutRedirect).not.toHaveBeenCalled();
    expect(rememberCheckoutDeparture).not.toHaveBeenCalled();
  });

  it.each([
    ['host ajeno', { success: true, mode: 'free', sessionUrl: 'https://evil.example/tickets/success?session_id=x' }],
    ['sin ninguna URL', { success: true, mode: 'free' }],
  ])('pedido gratuito con %s: confirmación + aviso propio, SIN navegar y SIN "sistema no disponible"', async (_name, response) => {
    triskelGateClient.createCheckout.mockResolvedValue(response);

    await reachCheckoutForm();

    expect(await screen.findByText('ticketModal.checkout.success.freeRegistered')).toBeInTheDocument();
    expect(screen.getByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();
    expect(screen.queryByText('ticketModal.checkout.errors.networkError')).toBeNull();
    expect(trackCheckoutRedirect).not.toHaveBeenCalled();
    expect(rememberCheckoutDeparture).not.toHaveBeenCalled();
    // Tiempo de sobra para que una navegación diferida hubiera ocurrido.
    await new Promise((resolve) => setTimeout(resolve, 1700));
    expect(assignMock).not.toHaveBeenCalled();
  });

  it('pago Stripe: redirige a Stripe igual que antes', async () => {
    const stripeUrl = 'https://checkout.stripe.com/c/pay/cs_test_123';
    triskelGateClient.createCheckout.mockResolvedValue({ success: true, sessionUrl: stripeUrl });

    await reachCheckoutForm();

    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(stripeUrl));
    expect(trackCheckoutRedirect).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('ticketModal.checkout.success.freeRegistered')).toBeNull();
  });

  it('fallo real del backend: muestra su mensaje y no el genérico', async () => {
    triskelGateClient.createCheckout.mockResolvedValue({
      success: false, message: 'Quota exceeded for this code',
    });

    await reachCheckoutForm();

    expect(await screen.findByText('Quota exceeded for this code')).toBeInTheDocument();
    expect(screen.queryByText('ticketModal.checkout.errors.networkError')).toBeNull();
    expect(assignMock).not.toHaveBeenCalled();
  });
});

/*
 * TG-48 ronda 3 — la navegación gratuita es cancelable y el pedido gratuito
 * completado bloquea el envío mientras el componente viva (recargar lo libera).
 */
const FREE_URL = `${PAGE_ORIGIN}/tickets/success?session_id=cs_free_abc`;
const FREE_CONFIRMED = { success: true, mode: 'free', sessionUrl: FREE_URL, totalAmount: 0 };
const FREE_UNCONFIRMED = { success: true, mode: 'free' };
// Espera por encima del retardo de la navegación gratuita (1500 ms).
const PAST_FREE_DELAY = () => new Promise((resolve) => setTimeout(resolve, 1700));
const closeHeaderButton = () => screen.getByRole('button', { name: /close/i });
const submitButton = () => document.querySelector('button[type="submit"]');

describe('TG-48 ronda 3: navegación gratuita cancelable', () => {
  it('cerrar el modal antes del retardo: la navegación NO se produce', async () => {
    triskelGateClient.createCheckout.mockResolvedValue(FREE_CONFIRMED);
    const onHide = vi.fn();
    render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit();
    expect(await screen.findByText('ticketModal.checkout.success.freeRegistered')).toBeInTheDocument();

    fireEvent.click(closeHeaderButton());
    expect(onHide).toHaveBeenCalled();

    await PAST_FREE_DELAY();
    expect(assignMock).not.toHaveBeenCalled();
  });

  it('desmontar el componente antes del retardo: la navegación NO se produce', async () => {
    triskelGateClient.createCheckout.mockResolvedValue(FREE_CONFIRMED);
    const { unmount } = render(<TicketModal show onHide={() => {}} allowIndividualCheckout />);
    await fillCheckoutAndSubmit();
    expect(await screen.findByText('ticketModal.checkout.success.freeRegistered')).toBeInTheDocument();

    unmount();

    await PAST_FREE_DELAY();
    expect(assignMock).not.toHaveBeenCalled();
  });

  it('cerrar mientras la petición gratuita está en vuelo: el pedido queda registrado pero NO se navega', async () => {
    let resolveCheckout;
    triskelGateClient.createCheckout.mockImplementation(
      () => new Promise((resolve) => { resolveCheckout = resolve; }),
    );
    render(<TicketModal show onHide={() => {}} allowIndividualCheckout />);
    await fillCheckoutAndSubmit();
    await waitFor(() => expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(1));

    fireEvent.click(closeHeaderButton());
    await act(async () => { resolveCheckout(FREE_CONFIRMED); });

    await PAST_FREE_DELAY();
    expect(assignMock).not.toHaveBeenCalled();
  });

  it('tras la navegación diferida el botón de compra sigue bloqueado', async () => {
    triskelGateClient.validateDiscount.mockResolvedValue(freeQuote(SPEAKER_COUPON));
    triskelGateClient.createCheckout.mockResolvedValue(FREE_CONFIRMED);

    await reachCheckoutForm({ coupon: SPEAKER_COUPON });
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(FREE_URL), NAVIGATION_TIMEOUT);

    expect(submitButton()).toBeDisabled();
  });
});

describe('TG-48 ronda 3: un pedido gratuito completado no se puede reenviar desde el mismo modal', () => {
  it.each([
    ['con URL de confianza (redirigiendo)', FREE_CONFIRMED, 'ticketModal.checkout.success.freeRegistered'],
    ['sin URL de confianza (unconfirmed)', FREE_UNCONFIRMED, 'ticketModal.checkout.success.freeConfirmationUnavailable'],
  ])('pedido gratuito %s: cerrar y reabrir el modal NO permite enviar otro checkout gratuito', async (_name, response, visibleText) => {
    triskelGateClient.validateDiscount.mockResolvedValue(freeQuote(SPEAKER_COUPON));
    triskelGateClient.createCheckout.mockResolvedValue(response);
    const onHide = vi.fn();
    const { rerender } = render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(await screen.findByText(visibleText)).toBeInTheDocument();

    fireEvent.click(closeHeaderButton());
    rerender(<TicketModal show={false} onHide={onHide} allowIndividualCheckout />);
    rerender(<TicketModal show onHide={onHide} allowIndividualCheckout />);

    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(1);
    expect(submitButton()).toBeDisabled();
  });

  it('pedido gratuito ya registrado: el botón bloqueado explica por qué', async () => {
    // Un botón deshabilitado sin explicación parece una compra fallida: el usuario
    // no debe ver un botón gris sin saber que su pedido ya está registrado.
    triskelGateClient.validateDiscount.mockResolvedValue(freeQuote(SPEAKER_COUPON));
    triskelGateClient.createCheckout.mockResolvedValue(FREE_UNCONFIRMED);
    const onHide = vi.fn();
    const { rerender } = render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(await screen.findByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();

    fireEvent.click(closeHeaderButton());
    rerender(<TicketModal show={false} onHide={onHide} allowIndividualCheckout />);
    rerender(<TicketModal show onHide={onHide} allowIndividualCheckout />);

    // Tras reabrir, el modal vuelve al paso 'select': hay que volver al checkout
    // para ver el botón bloqueado y su aviso.
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });

    expect(submitButton()).toBeDisabled();
    expect(await screen.findByText('ticketModal.checkout.success.freeAlreadyRegistered')).toBeInTheDocument();
  });

  it('recargar la página (nuevo montaje) vuelve a permitir comprar', async () => {
    triskelGateClient.createCheckout.mockResolvedValue(FREE_UNCONFIRMED);
    const first = render(<TicketModal show onHide={() => {}} allowIndividualCheckout />);
    await fillCheckoutAndSubmit();
    expect(await screen.findByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();
    first.unmount();

    triskelGateClient.createCheckout.mockResolvedValue(FREE_CONFIRMED);
    render(<TicketModal show onHide={() => {}} allowIndividualCheckout />);
    await fillCheckoutAndSubmit();

    await waitFor(() => expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(FREE_URL), NAVIGATION_TIMEOUT);
  });
});

/*
 * TG-48 ronda 4 — el bloqueo sólo frena un SEGUNDO PEDIDO GRATUITO. Un envío que
 * pagaría (sin cupón o con cupón parcial) se permite aunque haya un pedido gratuito
 * completado en la misma sesión del modal. Un pedido es gratuito cuando su importe
 * final es 0, según la vista previa del cupón que se enviaría.
 */
describe('TG-48 ronda 4: el bloqueo sólo frena un segundo pedido gratuito', () => {
  // Cierra el modal como lo haría el usuario y lo vuelve a abrir en el mismo montaje.
  function closeAndReopen(rerender, onHide) {
    fireEvent.click(closeHeaderButton());
    rerender(<TicketModal show={false} onHide={onHide} allowIndividualCheckout />);
    rerender(<TicketModal show onHide={onHide} allowIndividualCheckout />);
  }

  it('cupón que deja importe 0 tras un pedido gratuito: no se envía, el botón queda bloqueado y se explica', async () => {
    triskelGateClient.validateDiscount.mockResolvedValue(freeQuote(SPEAKER_COUPON));
    triskelGateClient.createCheckout.mockResolvedValue(FREE_UNCONFIRMED);
    const onHide = vi.fn();
    const { rerender } = render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(await screen.findByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();

    closeAndReopen(rerender, onHide);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });

    expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(1);
    expect(submitButton()).toBeDisabled();
    expect(await screen.findByText('ticketModal.checkout.success.freeAlreadyRegistered')).toBeInTheDocument();
  });

  it('compra de pago SIN cupón tras un pedido gratuito: se envía y no muestra el aviso de "ya registrado"', async () => {
    triskelGateClient.validateDiscount.mockResolvedValue(freeQuote(SPEAKER_COUPON));
    triskelGateClient.createCheckout
      .mockResolvedValueOnce(FREE_UNCONFIRMED)
      .mockResolvedValueOnce({ success: true, sessionUrl: STRIPE_URL });
    const onHide = vi.fn();
    const { rerender } = render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(await screen.findByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();

    closeAndReopen(rerender, onHide);
    // Borrar el cupón: la compra ya no es gratuita.
    await fillCheckoutAndSubmit({ coupon: '' });

    await waitFor(() => expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(2));
    expect(triskelGateClient.createCheckout.mock.calls[1][0]).not.toHaveProperty('discountCode');
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(STRIPE_URL));
    expect(screen.queryByText('ticketModal.checkout.success.freeAlreadyRegistered')).toBeNull();
  });

  it('cupón parcial (importe final > 0) tras un pedido gratuito: se envía y redirige a Stripe', async () => {
    triskelGateClient.validateDiscount.mockImplementation(async ({ code }) =>
      code === PARTIAL_COUPON ? partialQuote(PARTIAL_COUPON) : freeQuote(code));
    triskelGateClient.createCheckout
      .mockResolvedValueOnce(FREE_UNCONFIRMED)
      .mockResolvedValueOnce({ success: true, sessionUrl: STRIPE_URL });
    const onHide = vi.fn();
    const { rerender } = render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(await screen.findByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();

    closeAndReopen(rerender, onHide);
    await fillCheckoutAndSubmit({ coupon: PARTIAL_COUPON });

    await waitFor(() => expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(2));
    expect(triskelGateClient.createCheckout.mock.calls[1][0]).toMatchObject({ discountCode: PARTIAL_COUPON });
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(STRIPE_URL));
    expect(screen.queryByText('ticketModal.checkout.success.freeAlreadyRegistered')).toBeNull();
  });

  it('cupón nuevo de importe 0 sin validar tras un pedido gratuito: el botón se puede pulsar, se valida al enviar y queda bloqueado', async () => {
    triskelGateClient.validateDiscount.mockImplementation(async ({ code }) => freeQuote(code));
    triskelGateClient.createCheckout.mockResolvedValue(FREE_UNCONFIRMED);
    const onHide = vi.fn();
    const { rerender } = render(<TicketModal show onHide={onHide} allowIndividualCheckout />);
    await fillCheckoutAndSubmit({ coupon: SPEAKER_COUPON });
    expect(await screen.findByText('ticketModal.checkout.success.freeConfirmationUnavailable')).toBeInTheDocument();

    closeAndReopen(rerender, onHide);
    await fillCheckout({ coupon: 'SPEAKER200' });
    // Sin vista previa para este código aún no sabemos si el envío será gratuito.
    expect(submitButton()).not.toBeDisabled();
    fireEvent.click(submitButton());

    await waitFor(() => expect(triskelGateClient.validateDiscount).toHaveBeenLastCalledWith(
      expect.objectContaining({ code: 'SPEAKER200' }),
    ));
    expect(await screen.findByText('ticketModal.checkout.success.freeAlreadyRegistered')).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
    expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(1);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// EVENTO CERRADO: la via publica de Dubai NO abre el checkout
// ───────────────────────────────────────────────────────────────────────────
// El CTA publico de Dubai lleva al formulario de solicitud, no a Stripe: si
// abriera el checkout, seguiria habiendo una venta abierta, que es
// exactamente lo que se quiere evitar. El checkout sigue vivo para los
// enlaces de pago individuales (allowIndividualCheckout), que es por donde
// paga de verdad quien acepta la solicitud.
describe('Dubai: el CTA publico no abre el checkout', () => {
  it('el CTA de Dubai lleva al formulario y no crea sesion de pago', async () => {
    assignMock.mockReset();
    triskelGateClient.createCheckout.mockReset();

    render(<TicketModal show onHide={() => {}} />);

    const buy = await screen.findByRole('button', { name: /ticketModal\.requestAccess/ });
    fireEvent.click(buy);

    await waitFor(() => expect(assignMock).toHaveBeenCalled(), { timeout: 4000 });
    expect(assignMock).toHaveBeenCalledWith('/registro');
    // Y no se ha abierto ninguna sesion de pago.
    expect(triskelGateClient.createCheckout).not.toHaveBeenCalled();
  });

  it('con allowIndividualCheckout el checkout SI se abre (enlace de pago individual)', async () => {
    assignMock.mockReset();
    triskelGateClient.createCheckout.mockReset();

    render(<TicketModal show onHide={() => {}} allowIndividualCheckout />);

    const buy = await screen.findByRole('button', { name: /ticketModal\.requestAccess/ });
    fireEvent.click(buy);

    // Se llega al formulario de checkout: no se redirige al formulario de solicitud.
    await screen.findByLabelText(/ticketModal\.checkout\.fullName/);
    expect(assignMock).not.toHaveBeenCalledWith('/registro');
  });
});

/*
 * Cableado legal de extremo a extremo: con VITE_TRISKELL_LEGAL_METADATA_ENABLED=true el
 * checkout de Dubái envía legalAcceptance, y legalVersion es la versión de los términos de LA
 * EDICIÓN (legalVersionForEdition en src/legal/identity.js). El literal de abajo fija la versión
 * de Dubái: si alguien la cambia sin querer, este test falla. Madrid no tiene checkout público
 * (venta aplazada; isPublicXopsEvent solo admite Dubái), así que su versión se cubre en
 * src/legal/legalContent.test.js.
 */
describe('Legal: legalAcceptance llega a createCheckout en el checkout de Dubái', () => {
  it('con el flag activo envía legalAcceptance con accepted, edition, legalVersion, locale y acceptedAtClient', async () => {
    vi.stubEnv('VITE_TRISKELL_LEGAL_METADATA_ENABLED', 'true');
    triskelGateClient.createCheckout.mockResolvedValue({ success: true, sessionUrl: STRIPE_URL });

    await reachCheckoutForm();

    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(STRIPE_URL));
    expect(triskelGateClient.createCheckout).toHaveBeenCalledTimes(1);
    const payload = triskelGateClient.createCheckout.mock.calls[0][0];
    expect(payload.legalAcceptance).toEqual({
      accepted: true,
      edition: 'dubai',
      legalVersion: '2026-11-24',
      locale: 'es',
      acceptedAtClient: expect.any(String),
    });
    expect(payload.legalAcceptance.acceptedAtClient).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });
});
