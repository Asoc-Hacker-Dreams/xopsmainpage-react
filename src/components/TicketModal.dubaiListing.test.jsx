import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import i18n from '../i18n';
import TicketModal from './TicketModal';

/*
 * Listado de entradas del modal con la jornada única de Dubái (30-nov-2026).
 *
 * Son tests de RENDER con la API de TriskelGate mockeada: lo que se comprueba es
 * lo que el comprador ve en pantalla, no el estado interno del componente.
 */

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

// Forma real de GET /api/events (datos de la API, 2026-11-24).
const DUBAI_EVENT = {
  id: 2,
  name: 'X-Ops Conference Dubai 2026',
  slug: 'xops-conference-dubai-2026',
  location: 'Dubai, UAE',
  status: 'active',
  organizerId: 3,
  startDate: '2026-11-30',
  endDate: '2026-12-01',
};
// Evento QA real que la API devuelve como `active` junto al de Dubái.
const QA_EVENT = {
  id: 6,
  name: 'X-Ops TEST - QA privado (no comprar)',
  slug: 'xops-test-qa-privado',
  location: 'TEST - no es un evento real',
  status: 'active',
  organizerId: 3,
  startDate: '2026-11-20',
  endDate: '2026-12-20',
};
// Borrador: nombre de Dubái pero no está activo → no debe listarse.
const DRAFT_DUBAI_EVENT = {
  id: 9,
  name: 'X-Ops Conference Dubai 2026 (borrador)',
  slug: 'xops-conference-dubai-2026-borrador',
  location: 'Dubai, UAE',
  status: 'draft',
  organizerId: 3,
  startDate: '2026-11-30',
  endDate: '2026-12-01',
};
// Madrid (aplazado): su modal no debe cambiar de comportamiento → sigue sin listarse.
const MADRID_EVENT = {
  id: 1,
  name: 'X-Ops Conference Madrid 2026',
  slug: 'xops-conference-madrid-2026',
  location: 'Móstoles, Madrid',
  status: 'active',
  organizerId: 3,
  startDate: '2026-11-19',
  endDate: '2026-11-21',
};

const DAILY_TT = {
  id: 9, name: 'Daily Ticket', tierCode: 'DAILY', productCode: 'CONFERENCE',
  price: 450, currency: 'AED', displayOrder: 3, isActive: true,
  entitlements: ['CONF_D1'], description: null,
};
const QA_TT = {
  id: 20, name: 'QA Ticket', tierCode: 'DAILY', productCode: 'CONFERENCE',
  price: 1, currency: 'AED', displayOrder: 1, isActive: true,
  entitlements: ['CONF_D1'], description: null,
};

const TICKETS_BY_EVENT = new Map([
  [2, [DAILY_TT]],
  [6, [QA_TT]],
  [9, [DAILY_TT]],
  [1, [DAILY_TT]],
]);

async function renderModal() {
  render(<TicketModal show onHide={() => {}} />);
  // La cabecera del evento de Dubái es el primer h2 cuando el listado ya cargó.
  return screen.findByRole('heading', { level: 2, name: DUBAI_EVENT.name });
}

describe('TicketModal · qué eventos se listan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listTicketTypes.mockImplementation(async (eventId) => TICKETS_BY_EVENT.get(eventId) ?? []);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('no lista el evento QA aunque la API lo devuelva como active', async () => {
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT, QA_EVENT]);

    await renderModal();

    expect(screen.queryByText(/QA privado/i)).toBeNull();
    expect(screen.queryByText(/no es un evento real/i)).toBeNull();
    expect(screen.queryByText('QA Ticket')).toBeNull();
    // ...pero el evento de Dubái sí.
    expect(screen.getByRole('heading', { level: 2, name: DUBAI_EVENT.name })).toBeInTheDocument();
  });

  it('no lista un evento de Dubái que no esté active', async () => {
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT, DRAFT_DUBAI_EVENT]);

    await renderModal();

    expect(screen.queryByText(/borrador/i)).toBeNull();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });

  it('no lista Madrid (aplazado): su comportamiento no cambia', async () => {
    mockClient.listEvents.mockResolvedValue([MADRID_EVENT, DUBAI_EVENT]);

    await renderModal();

    expect(screen.queryByText(MADRID_EVENT.name)).toBeNull();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  });
});
