import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
import {
  BsCheckCircleFill, BsCalendar3, BsGeoAlt, BsArrowLeft,
  BsLightningFill, BsStarFill, BsDiamondFill, BsClockFill,
  BsShieldFill, BsTrophyFill,
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { triskelGateClient } from '../adapters/triskelgate/client';
import { useTranslation } from 'react-i18next';

const CONFIG_ORGANIZER_ID = import.meta.env.VITE_TRISKELL_ORGANIZER_ID
  ? Number(import.meta.env.VITE_TRISKELL_ORGANIZER_ID)
  : null;

// ── Tier catalogue ────────────────────────────────────────────────────────────
// Maps ticket name (case-insensitive) → visual config.
// displayOrder matches the seed's displayOrder so tiers sort predictably.
const TIER_CATALOGUE = {
  'super early adopter': {
    icon:        BsLightningFill,
    badge:       'SUPER EARLY BIRD',
    badgeColor:  '#00E676',
    accent:      '#00E676',
    highlighted: false,
    features:    (t) => [
      t('tickets.features.fullAccess'),
      t('tickets.features.allSessions'),
      t('tickets.features.eventMaterial'),
      t('tickets.features.earlyBirdPrice'),
    ],
  },
  'early adopter': {
    icon:        BsStarFill,
    badge:       'EARLY ADOPTER',
    badgeColor:  '#00BCD4',
    accent:      '#00BCD4',
    highlighted: false,
    features:    (t) => [
      t('tickets.features.fullAccess'),
      t('tickets.features.allSessions'),
      t('tickets.features.eventMaterial'),
      t('tickets.features.earlyAdopterPrice'),
    ],
  },
  'daily ticket': {
    icon:        BsCalendar3,
    badge:       null,
    badgeColor:  null,
    accent:      '#94a3b8',
    highlighted: false,
    features:    (t) => [
      t('tickets.features.fullAccess'),
      t('tickets.features.allSessions'),
      t('tickets.features.eventMaterial'),
    ],
  },
  'last minute': {
    icon:        BsClockFill,
    badge:       null,
    badgeColor:  null,
    accent:      '#f59e0b',
    highlighted: false,
    features:    (t) => [
      t('tickets.features.fullAccess'),
      t('tickets.features.allSessions'),
      t('tickets.features.eventMaterial'),
    ],
  },
  'summit': {
    icon:        BsTrophyFill,
    badge:       'SUMMIT EJECUTIVO',
    badgeColor:  '#FFD600',
    accent:      '#FFD600',
    highlighted: true,
    features:    (t) => [
      t('tickets.features.summitAccess'),
      t('tickets.features.executiveSessions'),
      t('tickets.features.vipNetworking'),
      t('tickets.features.mainStageAccess'),
    ],
  },
  'vip': {
    icon:        BsDiamondFill,
    badge:       'VIP',
    badgeColor:  '#a855f7',
    accent:      '#a855f7',
    highlighted: false,
    features:    (t) => [
      t('tickets.features.fullAccess'),
      t('tickets.features.allSessions'),
      t('tickets.features.vipArea'),
      t('tickets.features.vipNetworking'),
      t('tickets.features.personalAttention'),
    ],
  },
};

const getTierConfig = (name) =>
  TIER_CATALOGUE[name?.toLowerCase()] ?? {
    icon: BsShieldFill, badge: null, badgeColor: null, accent: '#94a3b8', highlighted: false,
    features: (t) => [t('tickets.features.fullAccess'), t('tickets.features.allSessions')],
  };

// ── Helpers ───────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS = { EUR: '€', AED: 'AED ', USD: '$', GBP: '£' };
const formatPrice = (price, currency) => {
  const sym = CURRENCY_SYMBOLS[currency?.toUpperCase()] ?? (currency ? `${currency} ` : '€');
  return `${sym}${price}`;
};

// Guard against date-only strings (e.g. "2026-08-31") which parse as UTC midnight.
// End dates without a time component get T23:59:59Z so the sale stays open all day.
const toDate = (s) => s ? new Date(s.includes('T') ? s : s + 'T23:59:59.000Z') : null;

const isSaleActive = (tt) => {
  const now   = new Date();
  const start = toDate(tt.saleStartDate);
  const end   = toDate(tt.saleEndDate);
  if (start && now < start) return false;
  if (end   && now > end)   return false;
  return true;
};

const formatSaleEnd = (dateStr, locale) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const formatEventDate = (iso, locale) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

// ── Component ─────────────────────────────────────────────────────────────────

const Tickets = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'es';

  const [events,        setEvents]        = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadError,     setLoadError]     = useState(null);

  const [showModal,      setShowModal]      = useState(false);
  const [selectedEvent,  setSelectedEvent]  = useState(null);
  const [selectedTT,     setSelectedTT]     = useState(null);
  const [customerName,   setCustomerName]   = useState('');
  const [customerEmail,  setCustomerEmail]  = useState('');
  const [formError,      setFormError]      = useState(null);
  const [purchasing,     setPurchasing]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const evList = await triskelGateClient.listEvents();
        if (cancelled) return;
        const active = evList.filter(
          (e) => e.status === 'active' &&
            (CONFIG_ORGANIZER_ID === null || Number(e.organizerId) === CONFIG_ORGANIZER_ID),
        );
        const withTT = await Promise.all(
          active.map(async (ev) => {
            try {
              const types = await triskelGateClient.listTicketTypes(ev.id);
              return {
                ...ev,
                ticketTypes: (Array.isArray(types) ? types : [])
                  .filter((tt) => tt.isActive !== false)
                  .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99)),
              };
            } catch {
              return { ...ev, ticketTypes: [] };
            }
          }),
        );
        if (!cancelled) setEvents(withTT);
      } catch {
        if (!cancelled) setLoadError('tickets.loadError');
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const openModal = (event, ticketType) => {
    setSelectedEvent(event);
    setSelectedTT(ticketType);
    setCustomerName('');
    setCustomerEmail('');
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name  = customerName.trim();
    const email = customerEmail.trim();
    if (!name)  { setFormError(t('tickets.errorName'));  return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError(t('tickets.errorEmail'));
      return;
    }
    setPurchasing(true);
    setFormError(null);
    try {
      const data = await triskelGateClient.createCheckout({
        eventId:       selectedEvent.id,
        ticketTypeId:  selectedTT.id,
        quantity:      1,
        customerEmail: email,
        customerName:  name,
        successUrl: `${window.location.origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl:  `${window.location.origin}/tickets`,
      });
      if (!data?.success) throw new Error(data?.message || data?.error || t('tickets.errorPayment'));
      const sessionUrl = data.sessionUrl;
      if (!sessionUrl || !sessionUrl.startsWith('https://checkout.stripe.com/')) {
        throw new Error(t('tickets.errorPayment'));
      }
      setShowModal(false);
      window.location.href = sessionUrl;
    } catch (err) {
      const isNetwork = err.name === 'TypeError' ||
        (typeof err.message === 'string' && err.message.includes('fetch'));
      setFormError(isNetwork ? t('tickets.errorNetwork') : err.message);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <>
      <SEO
        title={t('tickets.seoTitle')}
        description={t('tickets.seoDesc')}
        path="/tickets"
      />

      <div className="tickets-page">
        <Container>

          {/* Back */}
          <Row className="mb-4">
            <Col>
              <Link to="/" className="back-link">
                <BsArrowLeft /> {t('tickets.backHome')}
              </Link>
            </Col>
          </Row>

          {/* Header */}
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h1 className="tickets-page-title">{t('tickets.pageTitle')}</h1>
              <p className="tickets-page-subtitle">{t('tickets.pageSubtitle')}</p>
              <div className="ticket-location-badge">
                <BsGeoAlt className="me-1" /> Madrid, España · 19–21 Nov 2026
              </div>
            </Col>
          </Row>

          {/* Loading */}
          {loadingEvents && (
            <Row className="justify-content-center mb-5">
              <Col xs="auto" className="text-center">
                <Spinner animation="border" className="events-spinner" />
                <p className="mt-2 text-muted">{t('tickets.loading')}</p>
              </Col>
            </Row>
          )}

          {/* Error */}
          {loadError && (
            <Row className="justify-content-center mb-4">
              <Col lg={8}>
                <Alert variant="danger">{t(loadError)}</Alert>
              </Col>
            </Row>
          )}

          {/* Events + ticket grid */}
          {events.map((ev) => (
            <div key={ev.id} className="event-section mb-5">
              <Row className="mb-4">
                <Col>
                  <h2 className="event-section-title">{ev.name}</h2>
                  <div className="event-meta">
                    {(ev.startDate || ev.date) && (
                      <span className="event-meta-item">
                        <BsCalendar3 className="me-1" />
                        {formatEventDate(ev.startDate || ev.date, locale)}
                        {ev.endDate && ev.endDate !== ev.startDate &&
                          ` — ${formatEventDate(ev.endDate, locale)}`}
                      </span>
                    )}
                    {ev.location && (
                      <span className="event-meta-item ms-3">
                        <BsGeoAlt className="me-1" />{ev.location}
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              {ev.ticketTypes.length === 0 && (
                <p className="text-muted">{t('tickets.noTickets')}</p>
              )}

              <Row className="justify-content-center">
                {ev.ticketTypes.map((tt) => {
                  const cfg      = getTierConfig(tt.name);
                  const active   = isSaleActive(tt);
                  const Icon     = cfg.icon;
                  const saleEnd  = formatSaleEnd(tt.saleEndDate, locale);
                  const lowStock = tt.availableCount != null && tt.availableCount > 0 && tt.availableCount <= 10;

                  return (
                    <Col md={6} lg={4} key={tt.id} className="mb-4">
                      <div
                        className={`ticket-card-v2 ${cfg.highlighted ? 'ticket-card-highlighted' : ''} ${!active ? 'ticket-card-disabled' : ''}`}
                        style={{ '--tier-accent': cfg.accent }}
                      >
                        {cfg.badge && (
                          <div
                            className="ticket-tier-badge"
                            style={{ backgroundColor: cfg.badgeColor, color: '#0A0F2E' }}
                          >
                            <Icon size={11} className="me-1" />
                            {cfg.badge}
                          </div>
                        )}

                        <div className="ticket-card-body">
                          <div className="ticket-tier-icon" style={{ color: cfg.accent }}>
                            <Icon size={22} />
                          </div>

                          <h3 className="ticket-tier-name">{tt.name.toUpperCase()}</h3>

                          <div className="ticket-price-row">
                            <span className="ticket-price-amount">{formatPrice(tt.price, tt.currency)}</span>
                          </div>

                          {tt.description && (
                            <p className="ticket-tier-desc">{tt.description}</p>
                          )}

                          <ul className="ticket-feature-list">
                            {cfg.features(t).map((feat, i) => (
                              <li key={i}>
                                <BsCheckCircleFill style={{ color: cfg.accent }} />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>

                          {saleEnd && (
                            <p className="ticket-sale-end">
                              <BsCalendar3 className="me-1" />
                              {active
                                ? t('tickets.saleUntil', { date: saleEnd })
                                : t('tickets.saleEnded', { date: saleEnd })}
                            </p>
                          )}

                          {lowStock && (
                            <p className="ticket-low-stock">
                              {t('tickets.lowStock', { n: tt.availableCount })}
                            </p>
                          )}
                          {!lowStock && tt.availableCount != null && tt.availableCount > 0 && (
                            <p className="ticket-stock-info">
                              {t('tickets.capacity', { n: tt.availableCount })}
                            </p>
                          )}

                          <Button
                            className="ticket-buy-btn"
                            style={active ? { backgroundColor: cfg.accent, borderColor: cfg.accent, color: '#0A0F2E' } : {}}
                            disabled={!active}
                            onClick={() => active && openModal(ev, tt)}
                          >
                            {active ? t('tickets.buyBtn', { name: tt.name }) : t('tickets.unavailable')}
                          </Button>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ))}

          {/* Contact */}
          {!loadingEvents && (
            <Row className="justify-content-center mt-4 mb-5">
              <Col lg={6} className="text-center">
                <div className="tickets-contact">
                  <p>{t('tickets.contactText')}</p>
                  <a href="mailto:info@xopsconference.com" className="contact-link">
                    info@xopsconference.com
                  </a>
                </div>
              </Col>
            </Row>
          )}

        </Container>
      </div>

      {/* Checkout modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            {selectedTT && selectedEvent
              ? `${selectedTT.name.toUpperCase()} — ${formatPrice(selectedTT.price, selectedTT.currency)}`
              : t('tickets.buyTicket')}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            {selectedEvent && (
              <p className="text-muted small mb-3">
                <BsCalendar3 className="me-1" />{selectedEvent.name}
              </p>
            )}
            {formError && (
              <Alert variant="danger" onClose={() => setFormError(null)} dismissible>
                {formError}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>{t('tickets.fieldName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('tickets.fieldNamePlaceholder')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('tickets.fieldEmail')}</Form.Label>
              <Form.Control
                type="email"
                placeholder={t('tickets.fieldEmailPlaceholder')}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Form.Text className="text-muted">{t('tickets.emailHelp')}</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              {t('tickets.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={purchasing}>
              {purchasing ? <Spinner size="sm" /> : t('tickets.proceedPayment')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Tickets;
