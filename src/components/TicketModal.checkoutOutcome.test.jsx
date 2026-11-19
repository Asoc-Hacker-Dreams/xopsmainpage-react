import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

async function reachCheckoutForm() {
  render(<TicketModal show onHide={() => {}} />);
  const buy = await screen.findByRole('button', { name: /ticketModal\.checkout\.title Daily Ticket/ });
  fireEvent.click(buy);
  fireEvent.change(screen.getByLabelText(/ticketModal\.checkout\.fullName/), { target: { value: 'Ana Pérez' } });
  fireEvent.change(screen.getByLabelText(/ticketModal\.checkout\.email/), { target: { value: 'ana@example.org' } });
  fireEvent.click(document.getElementById('tm-terms'));
  fireEvent.click(screen.getByRole('button', { name: 'ticketModal.checkout.submit' }));
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
    triskelGateClient.createCheckout.mockResolvedValue({
      success: true, mode: 'free', sessionUrl: freeUrl, totalAmount: 0,
    });

    await reachCheckoutForm();
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
