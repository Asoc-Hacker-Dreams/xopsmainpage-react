import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Un evento activo de Dubái que NO es X-Ops (partner o venue) no se lista ni se
// piden sus entradas: "Dubai" en la ubicación no basta para venderlo como edición X-Ops.
const PARTNER_DUBAI_EVENT = {
  id: 4,
  name: 'Dubai Blockchain Partner Summit 2026',
  slug: 'dubai-blockchain-partner-summit-2026',
  location: 'Dubai Marina, Dubai, UAE',
  status: 'active',
  organizerId: 3,
  startDate: '2026-11-28',
  endDate: '2026-11-28',
};
const VENUE_DUBAI_EVENT = {
  id: 5,
  name: 'Hotel Venue Dubai Expo 2026',
  slug: 'venue-dubai-expo-2026',
  location: 'Dubai, UAE',
  status: 'active',
  organizerId: 3,
  startDate: '2026-11-29',
  endDate: '2026-11-29',
};

// "Complex Ops" contiene "x ops" dentro de otra palabra: no es identidad X-Ops.
const LOOKALIKE_DUBAI_EVENT = {
  id: 7,
  name: 'Complex Ops Dubai Forum 2026',
  slug: 'complex-ops-dubai-forum-2026',
  location: 'Dubai, UAE',
  status: 'active',
  organizerId: 3,
  startDate: '2026-11-27',
  endDate: '2026-11-27',
};

describe('TicketModal · un evento de Dubái sin identidad X-Ops no se lista', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listTicketTypes.mockImplementation(async (eventId) => TICKETS_BY_EVENT.get(eventId) ?? []);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('un partner activo en Dubái no aparece ni se piden sus entradas', async () => {
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT, PARTNER_DUBAI_EVENT, VENUE_DUBAI_EVENT]);

    await renderModal();

    expect(screen.queryByText(PARTNER_DUBAI_EVENT.name)).toBeNull();
    expect(screen.queryByText(VENUE_DUBAI_EVENT.name)).toBeNull();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(mockClient.listTicketTypes).not.toHaveBeenCalledWith(PARTNER_DUBAI_EVENT.id);
    expect(mockClient.listTicketTypes).not.toHaveBeenCalledWith(VENUE_DUBAI_EVENT.id);
  });

  it('un nombre que solo contiene "x ops" dentro de otra palabra no cuenta como X-Ops', async () => {
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT, LOOKALIKE_DUBAI_EVENT]);

    await renderModal();

    expect(screen.queryByText(LOOKALIKE_DUBAI_EVENT.name)).toBeNull();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1);
    expect(mockClient.listTicketTypes).not.toHaveBeenCalledWith(LOOKALIKE_DUBAI_EVENT.id);
  });
});

// Jornada única: Summit y Conference son el mismo día, así que la tarjeta
// "Summit" no se pinta en Dubái. Es sólo presentación: el tipo sigue en la API.
const SUMMIT_TT = {
  id: 12, name: 'Summit', tierCode: 'SUMMIT', productCode: 'SUMMIT',
  price: 1200, currency: 'AED', displayOrder: 5, isActive: true,
  entitlements: ['SUMMIT', 'CONF_D1', 'DINNER'], description: null,
};
const LAST_MINUTE_TT = {
  id: 10, name: 'Last Minute', tierCode: 'LAST_MINUTE', productCode: 'CONFERENCE',
  price: 600, currency: 'AED', displayOrder: 4, isActive: true,
  entitlements: ['CONF_D1'], description: null,
};
const VIP_TT = {
  id: 11, name: 'VIP', tierCode: 'VIP', productCode: 'VIP',
  price: 900, currency: 'AED', displayOrder: 6, isActive: true,
  entitlements: ['CONF_D1', 'DINNER'], description: null,
};

describe('TicketModal · Summit no se presenta en Dubái', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([DAILY_TT, SUMMIT_TT, LAST_MINUTE_TT, VIP_TT]);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it('la tarjeta Summit no aparece, pero sí Daily, Last Minute y VIP', async () => {
    await renderModal();

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).not.toContain('SUMMIT');
    expect(titles).toEqual(expect.arrayContaining(['DAILY TICKET', 'LAST MINUTE', 'VIP']));
    expect(titles).toHaveLength(3);
  });
});

// Orden explícito de producto en Dubái: Daily → Last Minute → VIP, y los early
// adopters (ya agotados o cerrados) al final. No depende del orden de la API.
const EARLY_TT = {
  id: 8, name: 'Early Adopter', tierCode: 'EARLY', productCode: 'CONFERENCE',
  price: 300, currency: 'AED', displayOrder: 2, isActive: true,
  entitlements: ['CONF_D1'], description: null,
};
const SUPER_EARLY_TT = {
  id: 7, name: 'Super Early Adopter', tierCode: 'SUPER_EARLY', productCode: 'CONFERENCE',
  price: 180, currency: 'AED', displayOrder: 1, isActive: true,
  entitlements: ['CONF_D1'], description: null,
};
const DUBAI_ORDER = ['DAILY TICKET', 'LAST MINUTE', 'VIP', 'EARLY ADOPTER', 'SUPER EARLY ADOPTER'];

describe('TicketModal · orden de las entradas de Dubái', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  // Orden crudo que devuelve la API para el evento 2 (sin ordenar por displayOrder).
  const RAW_API_ORDER = [EARLY_TT, LAST_MINUTE_TT, DAILY_TT, SUPER_EARLY_TT, SUMMIT_TT, VIP_TT];

  it('pinta Daily → Last Minute → VIP → early adopters, aunque la API venga en otro orden', async () => {
    mockClient.listTicketTypes.mockResolvedValue(RAW_API_ORDER);

    await renderModal();

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(DUBAI_ORDER);
  });

  it('el orden no depende del orden de llegada: invertir la API da el mismo resultado', async () => {
    mockClient.listTicketTypes.mockResolvedValue([...RAW_API_ORDER].reverse());

    await renderModal();

    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual(DUBAI_ORDER);
  });
});

// Copy uniforme: todo el texto renderizado de Dubái habla de la misma jornada.
// Se mira el texto completo del body porque la cabecera (fechas del evento),
// las tarjetas y el desglose de entitlements pintan en sitios distintos.
describe('TicketModal · copy uniforme de la jornada única (es y en)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([EARLY_TT, LAST_MINUTE_TT, DAILY_TT, SUPER_EARLY_TT, SUMMIT_TT, VIP_TT]);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it.each([
    ['es', /30 de noviembre/],
    ['en', /30 November/],
  ])('en %s: no aparece un segundo día, ni "martes", ni "legacy"; sí el 30 de noviembre', async (lang, dayPattern) => {
    await i18n.changeLanguage(lang);

    await renderModal();

    const text = document.body.textContent;
    // "December 1" es el formato que Intl da al fin de rango en inglés.
    expect(text).not.toMatch(/1 de diciembre|1 December|December 1\b|martes|Tuesday/i);
    expect(text).not.toMatch(/día 2|day 2|legacy/i);
    expect(text).toMatch(dayPattern);
  });
});

// `ticket_types.description` solo existe en español y en la BD todavía dice
// "dos días" (martes 1 de diciembre). En Dubái no debe llegar a pantalla: el copy
// sale siempre de la clave i18n del tierCode, en todos los idiomas.
describe('TicketModal · la descripción de la BD no se muestra en Dubái', () => {
  const DAILY_WITH_STALE_DB_COPY = {
    ...DAILY_TT,
    description: 'Entrada de dos días: Summit el lunes 30 de noviembre y Conference el martes 1 de diciembre de 2026.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([DAILY_WITH_STALE_DB_COPY]);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it.each([
    ['es', /Entrada estándar al precio regular/],
    ['en', /Standard ticket at the regular price/],
  ])('en %s se pinta el copy i18n del tierCode, no la descripción de la BD', async (lang, copyPattern) => {
    await i18n.changeLanguage(lang);

    await renderModal();

    const text = document.body.textContent;
    expect(text).not.toMatch(/Entrada de dos días|martes 1 de diciembre|Tuesday 1 December/i);
    expect(text).toMatch(copyPattern);
  });
});

// Entrada antigua con CONF_D2 concedido. En la BD hay Summit ya emitidas con
// ['SUMMIT', 'CONF_D1', 'DINNER'] y el diseño de dos días tenía CONF_D2 como día 2.
// Este tier es un modelo de ese caso, no un producto vigente. Dubái no tiene día 2,
// así que la concesión no debe pintar ninguna fila extra ni un segundo día.
const LEGACY_D2_TT = {
  id: 16, name: 'Early Adopter', tierCode: 'EARLY', productCode: 'CONFERENCE',
  price: 300, currency: 'AED', displayOrder: 2, isActive: true,
  entitlements: ['CONF_D1', 'CONF_D2'], description: null,
};

const SECOND_DAY_PATTERN = /día 2|day 2|1 de diciembre|1 December|December 1\b|martes|Tuesday/i;

// Filas exactas que pinta Dubái para cualquier entrada. Se compara la lista completa
// (no un texto concreto) para que el test falle con CUALQUIER fila extra, tenga la
// etiqueta que tenga; un "Conference día 2" y un "Acceso adicional" fallan igual.
const dubaiRows = () => [
  i18n.t('ticketModal.entitlementsDubai.summit'),
  i18n.t('ticketModal.entitlementsDubai.conference'),
  i18n.t('ticketModal.entitlements.dinner'),
  i18n.t('ticketModal.entitlements.workshops'),
];

describe('TicketModal · entrada con CONF_D2 concedido no muestra un segundo día', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.listEvents.mockResolvedValue([DUBAI_EVENT]);
    mockClient.listTicketTypes.mockResolvedValue([LEGACY_D2_TT]);
  });

  afterEach(async () => {
    await i18n.changeLanguage('es');
  });

  it.each(['es', 'en'])('en %s: la tarjeta no muestra un segundo día ni filas extra', async (lang) => {
    await i18n.changeLanguage(lang);

    await renderModal();

    // La tarjeta debe existir: si no, la ausencia de texto pasaría en vacío.
    expect(screen.getByRole('button', { name: /Early Adopter/i })).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(SECOND_DAY_PATTERN);

    const card = screen.getByRole('heading', { level: 3 }).closest('.ticket-card');
    const rows = Array.from(card.querySelectorAll('li')).map((li) => li.textContent);
    expect(rows).toEqual(dubaiRows());
  });

  it.each(['es', 'en'])('en %s: el resumen previo a Stripe no muestra un segundo día ni filas extra', async (lang) => {
    await i18n.changeLanguage(lang);

    await renderModal();
    fireEvent.click(screen.getByRole('button', { name: /Early Adopter/i }));

    // El resumen es el último paso antes de Stripe y nombra la entrada en un <strong>.
    const title = await screen.findByText(LEGACY_D2_TT.name, { selector: 'strong' });
    expect(document.body.textContent).not.toMatch(SECOND_DAY_PATTERN);

    const summary = title.closest('div').parentElement;
    const rows = Array.from(summary.querySelectorAll('li')).map((li) => li.textContent);
    expect(rows).toEqual(dubaiRows());
  });
});
