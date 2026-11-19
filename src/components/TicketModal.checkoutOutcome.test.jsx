import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TicketModal from './TicketModal';
import { triskelGateClient } from '../adapters/triskelgate/client';
import { trackCheckoutRedirect } from '../analytics/ga4';

/*
 * TG-48 — fija en el componente el comportamiento tras createCheckout:
 *  - pedido gratuito: éxito (sin mensaje de error), sin redirigir a Stripe;
 *  - pago Stripe: redirige a Stripe como antes;
 *  - host no permitido o fallo real del backend: error con el mensaje correcto.
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

describe('TG-48 TicketModal tras createCheckout', () => {
  it('pedido gratuito: éxito, mensaje de registro completado y SIN mensaje de error', async () => {
    const freeUrl = `${PAGE_ORIGIN}/tickets/success?session_id=cs_free_abc`;
    triskelGateClient.createCheckout.mockResolvedValue({
      success: true, mode: 'free', sessionUrl: freeUrl, totalAmount: 0,
    });

    await reachCheckoutForm();

    expect(await screen.findByText('ticketModal.checkout.success.freeRegistered')).toBeInTheDocument();
    expect(screen.queryByText('ticketModal.checkout.errors.networkError')).toBeNull();
    expect(assignMock).toHaveBeenCalledWith(freeUrl);
    // No es una redirección de pago: no se mide como "intento de pago".
    expect(trackCheckoutRedirect).not.toHaveBeenCalled();
  });

  it('pago Stripe: redirige a Stripe igual que antes', async () => {
    const stripeUrl = 'https://checkout.stripe.com/c/pay/cs_test_123';
    triskelGateClient.createCheckout.mockResolvedValue({ success: true, sessionUrl: stripeUrl });

    await reachCheckoutForm();

    await waitFor(() => expect(assignMock).toHaveBeenCalledWith(stripeUrl));
    expect(trackCheckoutRedirect).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('ticketModal.checkout.success.freeRegistered')).toBeNull();
  });

  it('sessionUrl gratuita de host ajeno: error y NO redirige', async () => {
    triskelGateClient.createCheckout.mockResolvedValue({
      success: true, mode: 'free', sessionUrl: 'https://evil.example/tickets/success?session_id=x',
    });

    await reachCheckoutForm();

    expect(await screen.findByText('ticketModal.checkout.errors.networkError')).toBeInTheDocument();
    expect(assignMock).not.toHaveBeenCalled();
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
