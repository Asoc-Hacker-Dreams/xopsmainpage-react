import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../i18n';
import es from '../i18n/locales/es.json';
import TicketModal from './TicketModal';

// Regresión: el front tenía que decir la causa real del fallo del cupón.
// Antes, un 429 (cuerpo {"error": ...} sin message) mostraba "Código no válido".

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

async function openCheckoutWithCode(code = 'X-OPSSPEAKERS') {
  render(<TicketModal show onHide={() => {}} />);
  fireEvent.click(await screen.findByRole('button', { name: `${es.ticketModal.checkout.title} Summit` }));
  fireEvent.change(
    screen.getByPlaceholderText(es.ticketModal.checkout.discountPlaceholder),
    { target: { value: code } },
  );
  fireEvent.click(screen.getByRole('button', { name: es.ticketModal.checkout.applyDiscount }));
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
});
