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
// Entrada real de Dubái (jornada única): Summit no se lista allí, así que el cupón se prueba sobre Daily Ticket.
const DAILY_TT = {
  id: 9, name: 'Daily Ticket', tierCode: 'DAILY', productCode: 'CONFERENCE',
  price: 200, currency: 'AED', isActive: true,
};

const ERR_429 = Object.assign(new Error('TriskelGate 429'), {
  status: 429,
  body: '{"error":"Too many discount validation requests."}',
});

// `copy` es el locale con el que se pintan los textos del formulario (es por defecto).
async function openCheckoutWithCode(code = 'X-OPSSPEAKERS', copy = es) {
  render(<TicketModal show onHide={() => {}} />);
  fireEvent.click(await screen.findByRole('button', { name: `${copy.ticketModal.checkout.title} Daily Ticket` }));
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
    mockClient.listTicketTypes.mockResolvedValue([DAILY_TT]);
  });

  it('429 muestra "espera unos minutos", nunca "código no válido"', async () => {
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

  it('INVALID_CODE (código inexistente) sigue mostrando "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: '{"success":false,"error":"INVALID_CODE","message":"Código de descuento inexistente"}',
    }));

    const alert = await openCheckoutWithCode('X-OPS+INEXISTENTE');

    expect(alert).toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('200 con success:false e INVALID_CODE sigue siendo "código no válido"', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'INVALID_CODE' });

    const alert = await openCheckoutWithCode('X-OPS+INEXISTENTE');

    expect(alert).toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('CODE_EXHAUSTED muestra que el código ha alcanzado su límite, NUNCA "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: '{"success":false,"error":"CODE_EXHAUSTED","message":"El código ha alcanzado su límite de usos"}',
    }));

    const alert = await openCheckoutWithCode('X-OPS+AGOTADO');

    expect(alert).toHaveTextContent(es.ticketModal.checkout.codeExhausted);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('200 con success:false y CODE_EXHAUSTED también muestra el límite de usos, no "código no válido"', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'CODE_EXHAUSTED' });

    const alert = await openCheckoutWithCode('X-OPS+AGOTADO');

    expect(alert).toHaveTextContent(es.ticketModal.checkout.codeExhausted);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('CODE_NOT_VALID_FOR_ORGANIZER muestra que el código no vale para este evento, NUNCA "código no válido"', async () => {
    mockClient.validateDiscount.mockResolvedValue({
      success: false, error: 'CODE_NOT_VALID_FOR_ORGANIZER', message: 'El código no corresponde al organizador',
    });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountNotForOrganizer);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('un 400 con {"message":"proxy error"} (no es contrato de negocio) NUNCA es "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: '{"message":"proxy error"}',
    }));

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('un 400 con {"error":"proxy error"} (texto libre, sin success:false) NUNCA es "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: { error: 'proxy error' },
    }));

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('INVALID_DISCOUNT_CONFIG NUNCA es "código no válido": el código es correcto', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'INVALID_DISCOUNT_CONFIG' });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('CODE_EXPIRED muestra que el código ha caducado, no "código no válido"', async () => {
    mockClient.validateDiscount.mockRejectedValue(Object.assign(new Error('400'), {
      status: 400, body: '{"error":"CODE_EXPIRED"}',
    }));

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountExpired);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('CODE_NOT_VALID_FOR_TICKET muestra que el código no se aplica a esta entrada', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'CODE_NOT_VALID_FOR_TICKET' });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountNotForTicket);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('CODE_NOT_STARTED muestra que el código aún no está vigente', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: false, error: 'CODE_NOT_STARTED' });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountNotStarted);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('200 con success:true sin discount NUNCA es "código no válido": no se pudo comprobar', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: true });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
  });

  it('200 con success:true y ticketTypeId distinto del seleccionado NUNCA es "código no válido"', async () => {
    mockClient.validateDiscount.mockResolvedValue({
      success: true,
      discount: {
        id: 1, code: 'X-OPSSPEAKERS', type: 'percentage', value: 10, currency: 'AED',
        ticketTypeId: 999, quantity: 1, originalAmount: 200, discountAmount: 20, finalAmount: 180,
        originalTotalCents: 20000, discountCents: 2000, finalCents: 18000,
      },
    });

    const alert = await openCheckoutWithCode();

    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
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
    mockClient.listTicketTypes.mockResolvedValue([DAILY_TT]);
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

// Cupón válido completo (contrato TGDiscountQuote) para la entrada Daily Ticket (id 9), cantidad 1.
const VALID_QUOTE = {
  id: 42, code: 'X-OPSSPEAKERS', type: 'percentage', value: 10, currency: 'AED',
  ticketTypeId: 9, quantity: 1, originalAmount: 200, discountAmount: 20, finalAmount: 180,
  originalTotalCents: 20000, discountCents: 2000, finalCents: 18000,
};

async function startCheckout(copy = es) {
  fireEvent.click(await screen.findByRole('button', { name: `${copy.ticketModal.checkout.title} Daily Ticket` }));
}

function applyCode(code, copy = es) {
  fireEvent.change(
    screen.getByPlaceholderText(copy.ticketModal.checkout.discountPlaceholder),
    { target: { value: code } },
  );
  fireEvent.click(screen.getByRole('button', { name: copy.ticketModal.checkout.applyDiscount }));
}

describe('TicketModal · cupón: flujo completo (regresión)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([DAILY_TT]);
  });

  it('un cupón VÁLIDO muestra la previsualización del descuento y ningún error', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: true, discount: VALID_QUOTE });
    render(<TicketModal show onHide={() => {}} />);
    await startCheckout();

    applyCode('X-OPSSPEAKERS');

    expect(await screen.findByText(/Código aplicado/)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('un quote con moneda inutilizable ("NOPE") NO revienta el render: muestra "no hemos podido comprobar"', async () => {
    // Antes: la moneda pasaba la validación y formatPrice (Intl) lanzaba RangeError al pintar.
    mockClient.validateDiscount.mockResolvedValue({
      success: true, discount: { ...VALID_QUOTE, currency: 'NOPE' },
    });
    render(<TicketModal show onHide={() => {}} />);
    await startCheckout();

    applyCode('X-OPSSPEAKERS');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountUnavailable);
    expect(alert).not.toHaveTextContent(es.ticketModal.checkout.invalidDiscount);
    expect(screen.queryByText(/Código aplicado/)).not.toBeInTheDocument();
  });

  it('el payload a validateDiscount lleva el eventId, el ticketTypeId y quantity 1 seleccionados', async () => {
    mockClient.validateDiscount.mockResolvedValue({ success: true, discount: VALID_QUOTE });
    render(<TicketModal show onHide={() => {}} />);
    await startCheckout();

    applyCode('X-OPSSPEAKERS');
    await screen.findByText(/Código aplicado/);

    expect(mockClient.validateDiscount).toHaveBeenCalledTimes(1);
    expect(mockClient.validateDiscount).toHaveBeenCalledWith({
      code: 'X-OPSSPEAKERS', eventId: DUBAI_EVENT.id, ticketTypeId: DAILY_TT.id, quantity: 1,
    });
  });

  it('una respuesta vieja que llega después de cambiar el código NO pisa el estado', async () => {
    // Cada llamada queda pendiente hasta que el test la resuelve, en el orden que quiere.
    const pending = [];
    mockClient.validateDiscount.mockImplementation(
      () => new Promise((resolve, reject) => pending.push({ resolve, reject })),
    );
    render(<TicketModal show onHide={() => {}} />);
    await startCheckout();

    applyCode('X-OPSVIEJO');                       // respuesta A: se queda pendiente
    fireEvent.click(screen.getByRole('button', { name: es.ticketModal.checkout.cancel }));
    await startCheckout();                         // vuelve a la selección y reabre la entrada
    applyCode('X-OPSNUEVO');                       // respuesta B: la que el usuario ve
    const [oldResponse, newResponse] = pending;
    newResponse.reject(Object.assign(new Error('400'), {
      status: 400, body: '{"success":false,"error":"CODE_EXPIRED"}',
    }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(es.ticketModal.checkout.discountExpired);

    // Llega la respuesta vieja de A, que sería un cupón VÁLIDO: no debe aparecer.
    oldResponse.resolve({ success: true, discount: { ...VALID_QUOTE, code: 'X-OPSVIEJO' } });
    await Promise.resolve();
    await Promise.resolve();

    expect(screen.getByRole('alert')).toHaveTextContent(es.ticketModal.checkout.discountExpired);
    expect(screen.queryByText(/Código aplicado/)).not.toBeInTheDocument();
  });
});
