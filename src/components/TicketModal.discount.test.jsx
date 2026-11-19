import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '../i18n';
import es from '../i18n/locales/es.json';
import en from '../i18n/locales/en.json';
import TicketModal from './TicketModal';

// Regresión: el front tenía que decir la causa real del fallo del cupón.
// Antes, un 429 (cuerpo {"error": ...} sin message) mostraba "Código no válido".
// Y un fallo de red o un 5xx tampoco pueden decir "código no válido".

const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    listEvents: vi.fn(),
    listTicketTypes: vi.fn(),
    validateDiscount: vi.fn(),
    createCheckout: vi.fn(),
  },
}));

vi.mock('../adapters/triskelgate/client', () => ({ triskelGateClient: mockClient }));
vi.mock('../contexts/ConsentContext', () => ({
  useConsent: () => ({ consent: {}, hasInteracted: false }),
  CONSENT_POLICY_VERSION: 'test',
}));

const DUBAI_EVENT = {
  id: 7,
  name: 'X-Ops Conference Dubai 2026',
  slug: 'x-ops-conference-dubai-2026',
  status: 'active',
  startDate: '2026-11-30T00:00:00.000Z',
};
const SUMMIT_TT = { id: 11, name: 'Summit', price: 200, currency: 'AED', isActive: true };

const ERR_429 = Object.assign(new Error('TriskelGate 429'), {
  status: 429,
  body: '{"error":"Too many discount validation requests."}',
});

// `copy` es el locale con el que se pintan los textos del formulario (es por defecto).
async function openCheckoutWithCode(code = 'X-OPSSPEAKERS', copy = es) {
  render(<TicketModal show onHide={() => {}} />);
  fireEvent.click(await screen.findByRole('button', { name: `${copy.ticketModal.checkout.title} Summit` }));
  fireEvent.change(
    screen.getByPlaceholderText(copy.ticketModal.checkout.discountPlaceholder),
    { target: { value: code } },
  );
  fireEvent.click(screen.getByRole('button', { name: copy.ticketModal.checkout.applyDiscount }));
  return screen.findByRole('alert');
}

describe('TicketModal · aplicar cupón: causa real del fallo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([SUMMIT_TT]);
  });

  it('429 muestra "espera un minuto", nunca "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(ERR_429);

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.rateLimited);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('SALE_ENDED muestra que la entrada no está a la venta', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: '{"error":"SALE_ENDED","message":"Sale ended"}',
    }));

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.saleEnded);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('SALE_NOT_STARTED en una respuesta 200 con success:false', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'SALE_NOT_STARTED' });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.saleNotStarted);
  });

  it('un código realmente inválido sigue mostrando "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: '{"error":"CODE_EXHAUSTED","message":"Quota exceeded"}',
    }));

    const alert = await openCheckoutWithCode('X-OPS+AGOTADO');

    expect(alert).toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('200 con success:false y código de negocio desconocido sigue siendo "código no válido"', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'CODE_EXPIRED' });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('fallo de red (TypeError, sin respuesta) muestra "no hemos podido comprobar", nunca "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(new TypeError('Failed to fetch'));

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('502 con cuerpo HTML muestra "no hemos podido comprobar", nunca "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('502'), {
      status: 502, body: 'Bad Gateway <html>',
    }));

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });
});

describe('TicketModal · aplicar cupón: idioma inglés', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([SUMMIT_TT]);
    await i18n.changeLanguage('en');
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('429 muestra el texto en inglés, sin mensaje en castellano', async () => {
    mockClient.validateDiscount.mockRejectedValue(ERR_429);

    const alert = await openCheckoutWithCode('X-OPSSPEAKERS', en);

    expect(alert).toHaveTextContent(en.ticketModal.checkout.rateLimited);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.rateLimited);
  });

  it('fallo de red muestra el texto en inglés "couldn\'t check", nunca "invalid"', async () => {
    mockClient.validateDiscount.mockRejectedValue(new TypeError('Failed to fetch'));

    const alert = await openCheckoutWithCode('X-OPSSPEAKERS', en);

    expect(alert).toHaveTextContent(en.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(en.ticketModal.checkout.invalidDiscount);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
  });
});
