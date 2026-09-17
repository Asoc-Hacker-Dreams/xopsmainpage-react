import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
} from 'react-bootstrap';
import { BsCheckCircleFill, BsXCircle, BsStar, BsCalendar3, BsGeoAlt, BsArrowLeft } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { triskelGateClient } from '../adapters/triskelgate/client';
import CountdownTimer from './CountdownTimer';
import { cityEvents, getCityFromHostname } from '../data/cityEvents';

const CONFIG_ORGANIZER_ID = import.meta.env.VITE_TRISKELL_ORGANIZER_ID
  ? Number(import.meta.env.VITE_TRISKELL_ORGANIZER_ID)
  : null;

// Estilo por PRODUCTO canónico, no por el string del nombre.
//
// Antes esto era `TIER_STYLE` indexado por `name.toLowerCase()` con claves
// `standard` / `business` / `vip`. Las dos primeras NO EXISTEN en los datos
// reales (los tipos se llaman "Super Early Adopter", "Daily Ticket",
// "Summit"...), así que todo caía al fallback salvo VIP: el estilo dependía
// de que alguien no renombrara una entrada.
//
// Ahora se indexa por `productCode` (CONFERENCE | VIP | SUMMIT), que es el
// contrato que expone la API (migración 0007/0008).
const PRODUCT_STYLE = {
  CONFERENCE: { badge: null,      ctaVariant: 'outline-primary', highlighted: false },
  VIP:        { badge: 'PREMIUM', ctaVariant: 'warning',         highlighted: false },
  SUMMIT:     { badge: 'FULL X-OPS EXPERIENCE', ctaVariant: 'primary', highlighted: true },
};
const getProductStyle = (tt) =>
  PRODUCT_STYLE[tt?.productCode] ?? PRODUCT_STYLE.CONFERENCE;

// Entitlements que puede tener una entrada, en el orden en que se muestran.
// La fuente de verdad es `ticketType.entitlements` que devuelve la API; esto
// sólo fija el orden y la etiqueta i18n de cada uno.
const ENTITLEMENT_LABELS = [
  { code: 'CONF_D1', i18nKey: 'ticketModal.entitlements.confDay1' },
  { code: 'CONF_D2', i18nKey: 'ticketModal.entitlements.confDay2' },
  { code: 'SUMMIT',  i18nKey: 'ticketModal.entitlements.summit' },
  { code: 'DINNER',  i18nKey: 'ticketModal.entitlements.dinner' },
];

// Guard against date-only strings (e.g. "2026-09-01") which parse as UTC
// midnight. End dates without a time component get T23:59:59Z so the sale
// stays open for the whole day.
const toDate = (s, endOfDay = false) => {
  if (!s) return null;
  return new Date(s.includes('T') ? s : s + (endOfDay ? 'T23:59:59.000Z' : 'T00:00:00.000Z'));
};

// A tier is only purchasable inside its [saleStartDate, saleEndDate] window.
// Without this the modal rendered an enabled "Reservar" button for tiers whose
// sale had not opened yet (both cities open 2026-09-01), and checkout would
// only fail later at Stripe.
const isSaleActive = (tt) => {
  const now = new Date();
  const start = toDate(tt.saleStartDate);
  const end = toDate(tt.saleEndDate, true);
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
};

const formatSaleDate = (dateStr, locale) => {
  const d = toDate(dateStr);
  if (!d) return null;
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
};

// Qué incluye y qué NO incluye una entrada, derivado de sus entitlements
// reales. Sustituye al antiguo `EXCLUDED_FEATURES`, que era un placeholder
// hardcodeado —su propio comentario lo admitía— y que además afirmaba que
// Summit no incluía la speakers dinner, cuando sí la incluye.
//
// Ahora TriskelGate expone `entitlements` por tipo de entrada (migración
// 0007/0008), así que inclusiones y exclusiones se calculan del dato.
const getEntitlementBreakdown = (tt) => {
  const granted = Array.isArray(tt?.entitlements) ? tt.entitlements : [];
  return ENTITLEMENT_LABELS.map(({ code, i18nKey }) => ({
    code,
    i18nKey,
    included: granted.includes(code),
  }));
};

/** Resolves the countdown target date the same way App.jsx resolves the active city
 *  (getCityFromHostname(window.location.hostname)). Falls back to the closer of the
 *  two known event dates when the hostname doesn't map to a single city (e.g. root domain). */
const getCountdownTargetDate = () => {
  const hostnameCity = getCityFromHostname(window.location.hostname);
  if (hostnameCity && cityEvents[hostnameCity]?.startDate) {
    return new Date(cityEvents[hostnameCity].startDate);
  }
  const upcoming = Object.values(cityEvents)
    .map((c) => new Date(c.startDate))
    .sort((a, b) => a - b);
  return upcoming[0];
};

const formatDate = (iso, locale = 'es') => {
  if (!iso) return '';
  // Map i18n.lang to a BCP-47 locale for Number/DateFormat. English falls back to
  // en-GB so the "30 November 2026" style matches the rest of the site.
  const intlLocale = locale?.startsWith('en') ? 'en-GB' : 'es-ES';
  return new Date(iso).toLocaleDateString(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatPrice = (amount, currency = 'EUR', locale = 'es') => {
  const intlLocale = locale?.startsWith('en') ? 'en-GB' : 'es-ES';
  // Madrid uses EUR (€), Dubai uses AED (AED / د.إ). Intl.NumberFormat picks
  // the right symbol and number grouping for the locale.
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
};

// Tier name → i18n key. The API stores tier names in English (e.g. "Super Early
// Adopter", "Daily Ticket") regardless of UI locale, so we map on the canonical
// English name instead of the localized label.
// Descripción traducida por TIER canónico, no por el nombre en minúsculas.
//
// Antes se indexaba por `name.toLowerCase()`, así que renombrar una entrada en
// el panel de administración dejaba de traducirla sin previo aviso. `tierCode`
// lo expone la API (migración 0007/0008) y no depende del texto visible.
const TIER_DESCRIPTION_KEY = {
  SUPER_EARLY: 'ticketModal.tierDescriptions.superEarly',
  EARLY:       'ticketModal.tierDescriptions.early',
  DAILY:       'ticketModal.tierDescriptions.daily',
  LAST_MINUTE: 'ticketModal.tierDescriptions.lastMinute',
  SUMMIT:      'ticketModal.tierDescriptions.summit',
  VIP:         'ticketModal.tierDescriptions.vip',
};

const MODAL_HEADER = { background: '#1a1a2e', borderBottom: '2px solid #00BCD4' };
const MODAL_BODY   = { background: '#0f0f1a', color: '#e0e0e0' };
const MODAL_FOOTER = { background: '#1a1a2e', borderTop: '1px solid #2a2a4a' };
const INPUT_STYLE  = { background: '#1e1e3a', border: '1px solid #2a2a4a', color: '#f8fafc' };

const TicketModal = ({ show, onHide }) => {
  const { t, i18n } = useTranslation();

  const [events, setEvents]             = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadError, setLoadError]       = useState(null);
  const [loaded, setLoaded]             = useState(false);

  const [step, setStep]                 = useState('select'); // 'select' | 'checkout'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTT, setSelectedTT]     = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formError, setFormError]       = useState(null);
  const [purchasing, setPurchasing]     = useState(false);

  const countdownTargetDate = useMemo(() => getCountdownTargetDate(), []);

  useEffect(() => {
    if (!show || loaded) return;

    let cancelled = false;
    setLoadingEvents(true);
    setLoadError(null);

    const load = async () => {
      try {
        const evList = await triskelGateClient.listEvents();
        if (cancelled) return;

        const active = evList.filter(
          (e) =>
            e.status === 'active' &&
            (
              CONFIG_ORGANIZER_ID === null ||
              e.organizerId == null || // event without organizer matches any configured organizer
              Number(e.organizerId) === CONFIG_ORGANIZER_ID
            ),
        );

        // Madrid (19 nov) antes que Dubai (30 nov): orden cronológico estable.
        const sorted = [...active].sort(
          (a, b) => new Date(a.startDate ?? 0) - new Date(b.startDate ?? 0),
        );

        const withTT = await Promise.all(
          sorted.map(async (ev) => {
            try {
              const types = await triskelGateClient.listTicketTypes(ev.id);
              return {
                ...ev,
                ticketTypes: Array.isArray(types) ? types.filter((t) => t.isActive !== false) : [],
              };
            } catch {
              return { ...ev, ticketTypes: [] };
            }
          }),
        );

        if (!cancelled) {
          setEvents(withTT);
          setLoaded(true);
        }
      } catch {
        if (!cancelled) setLoadError(t('ticketModal.noEvents'));
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [show, loaded, t]);

  const openCheckout = (event, ticketType) => {
    setSelectedEvent(event);
    setSelectedTT(ticketType);
    setCustomerName('');
    setCustomerEmail('');
    setFormError(null);
    setStep('checkout');
  };

  const backToSelect = () => {
    setStep('select');
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name  = customerName.trim();
    const email = customerEmail.trim();

    if (!name)  { setFormError(t('ticketModal.checkout.errors.nameRequired')); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError(t('ticketModal.checkout.errors.emailInvalid'));
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
        cancelUrl:  `${window.location.origin}/?openTickets=1`,
      });

      if (!data?.success) {
        throw new Error(data?.message || data?.error || t('ticketModal.checkout.errors.networkError'));
      }

      setStep('select');
      onHide();
      window.location.href = data.sessionUrl || `${window.location.origin}/tickets/success`;
    } catch (err) {
      const isNetworkError =
        err.name === 'TypeError' ||
        (typeof err.message === 'string' &&
          (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')));
      setFormError(
        isNetworkError
          ? t('ticketModal.checkout.errors.networkError')
          : err.message,
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleHide = () => {
    setStep('select');
    setFormError(null);
    onHide();
  };

  const isCheckout = step === 'checkout';

  return (
    <Modal
      show={show}
      onHide={handleHide}
      size="xl"
      centered
      scrollable={!isCheckout}
      className="ticket-selection-modal"
    >
      <Modal.Header closeButton style={MODAL_HEADER}>
        <Modal.Title style={{ color: '#f8fafc', fontWeight: 700, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isCheckout ? (
            <>
              <button
                onClick={backToSelect}
                aria-label={t('ticketModal.backToSelect') || 'Volver a la selección'}
                style={{ background: 'none', border: 'none', color: '#00BCD4', cursor: 'pointer', padding: '0 4px 0 0', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}
              >
                <BsArrowLeft />
              </button>
              <span style={{ color: '#00BCD4' }}>{selectedTT?.name.toUpperCase()}</span>
              {selectedTT && (
                <span style={{ color: '#64748b', fontWeight: 400 }}>
                  {formatPrice(selectedTT.price, selectedTT.currency, i18n.language)}
                </span>
              )}
            </>
          ) : (
            <>
              <span style={{ color: '#00BCD4' }}>X-Ops Conference</span>
              {t('ticketModal.titleHighlight')}
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      {isCheckout ? (
        <Form onSubmit={handleSubmit} noValidate>
          <Modal.Body style={{ ...MODAL_BODY, minHeight: '260px' }}>
            {selectedEvent && (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BsCalendar3 aria-hidden="true" />
                {selectedEvent.name}
                {selectedEvent.location && (
                  <>
                    <BsGeoAlt aria-hidden="true" style={{ marginLeft: '8px' }} />
                    {selectedEvent.location}
                  </>
                )}
              </p>
            )}
            {formError && (
              <Alert variant="danger" role="alert" onClose={() => setFormError(null)} dismissible>
                {formError}
              </Alert>
            )}
            {/* Resumen de lo que se compra, ANTES de ir a Stripe.
                Sin esto el comprador sólo veía el nombre del tier y un importe:
                nada le decía si su entrada incluye el Summit o la cena. El
                desglose sale de `entitlements`, la misma fuente que usa el
                check-in, así que lo que se muestra aquí es exactamente lo que
                se validará en la puerta. */}
            {selectedTT && (
              <div
                style={{
                  background: '#161625', border: '1px solid #2a2a4a',
                  borderRadius: '8px', padding: '14px', marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                  <strong style={{ color: '#fff' }}>{selectedTT.name}</strong>
                  <span style={{ color: '#00BCD4', fontWeight: 600 }}>
                    {formatPrice(selectedTT.price, selectedTT.currency)}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {getEntitlementBreakdown(selectedTT).map(({ code, i18nKey, included }) => (
                    <li
                      key={code}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '4px', fontSize: '0.82rem',
                        color: included ? '#e2e8f0' : '#94a3b8'
                      }}
                    >
                      {included
                        ? <BsCheckCircleFill style={{ color: '#27ae60', flexShrink: 0 }} aria-hidden="true" />
                        : <BsXCircle style={{ color: '#e74c3c', flexShrink: 0 }} aria-hidden="true" />}
                      <span>{t(i18nKey)}</span>
                    </li>
                  ))}
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <BsXCircle style={{ color: '#e74c3c', flexShrink: 0 }} aria-hidden="true" />
                    <span>{t('ticketModal.entitlements.workshops')}</span>
                  </li>
                </ul>
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="tm-name" style={{ color: '#ccc' }}>
                {t('ticketModal.checkout.fullName')} <span aria-hidden="true">*</span>
              </Form.Label>
              <Form.Control
                id="tm-name"
                type="text"
                placeholder={t('ticketModal.checkout.fullNamePlaceholder')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                autoFocus
                maxLength={150}
                style={INPUT_STYLE}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="tm-email" style={{ color: '#ccc' }}>
                {t('ticketModal.checkout.email')} <span aria-hidden="true">*</span>
              </Form.Label>
              <Form.Control
                id="tm-email"
                type="email"
                placeholder="tu@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                style={INPUT_STYLE}
              />
              <Form.Text style={{ color: '#64748b' }}>{t('ticketModal.checkout.emailHint')}</Form.Text>
            </Form.Group>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '12px' }}>
              {t('ticketModal.checkout.taxIncluded')}
            </p>
          </Modal.Body>
          <Modal.Footer style={MODAL_FOOTER}>
            <Button variant="outline-secondary" onClick={backToSelect}>
              {t('ticketModal.checkout.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={purchasing}
              style={{ background: '#00BCD4', border: 'none', color: '#0A0F2E', fontWeight: 700 }}
            >
              {purchasing ? <Spinner size="sm" /> : t('ticketModal.checkout.submit')}
            </Button>
          </Modal.Footer>
        </Form>
      ) : (
        <>
          <Modal.Body style={{ ...MODAL_BODY, minHeight: '300px' }}>
            <Container fluid>
              {countdownTargetDate && (
                <Row className="justify-content-center text-center mb-4">
                  <Col xs="auto">
                    <CountdownTimer targetDate={countdownTargetDate} />
                  </Col>
                </Row>
              )}

              <Row className="justify-content-center text-center mb-4">
                <Col lg={8}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #FFD600 0%, #f59e0b 100%)',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#0A0F2E',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    <BsStar aria-hidden="true" />
                    <span>{t('ticketModal.earlyBird')}</span>
                  </div>
                </Col>
              </Row>

              {loadingEvents && (
                <Row className="justify-content-center mb-4">
                  <Col xs="auto" className="text-center">
                    <Spinner animation="border" style={{ color: '#00BCD4' }} />
                    <p className="mt-2 text-muted">{t('ticketModal.loading')}</p>
                  </Col>
                </Row>
              )}

              {loadError && (
                <Row className="justify-content-center mb-4">
                  <Col lg={10}>
                    <Alert variant="danger">
                      <div>{loadError}</div>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          // Cierra y reabre el modal para forzar un nuevo fetch.
                          // Más limpio: recargar la página si el error persiste.
                          onHide();
                          setTimeout(() => {
                            try { window.location.reload(); } catch (_) {}
                          }, 50);
                        }}
                      >
                        {t('common.retry')}
                      </Button>
                    </Alert>
                  </Col>
                </Row>
              )}

              {events.map((ev) => (
                <div key={ev.id} className="event-section mb-5">
                  <Row className="mb-3">
                    <Col>
                      <h2 style={{ color: '#00BCD4', fontWeight: 700, fontSize: '1.4rem' }}>
                        {ev.name}
                      </h2>
                      <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px', flexWrap: 'wrap' }}>
                        {ev.startDate && (
                          <span>
                            <BsCalendar3 className="me-1" aria-hidden="true" />
                            {formatDate(ev.startDate, i18n.language)}
                            {ev.endDate && ev.endDate !== ev.startDate && ` — ${formatDate(ev.endDate, i18n.language)}`}
                          </span>
                        )}
                        {ev.location && (
                          <span>
                            <BsGeoAlt className="me-1" aria-hidden="true" />
                            {ev.location}
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className="justify-content-center">
                    {ev.ticketTypes.length === 0 && (
                      <Col>
                        <p className="text-muted">{t('ticketModal.noTickets')}</p>
                      </Col>
                    )}
                    {/* Decisión de producto 2026-09-17: Summit SÍ incluye Conference
                        (y la speakers dinner). Ya no hace falta un tier "combo": la
                        jerarquía vive en `entitlements`, que expone la API. */}
                    {ev.ticketTypes.map((tt) => {
                      const style = getProductStyle(tt);
                      const entitlementBreakdown = getEntitlementBreakdown(tt);
                      const onSale = isSaleActive(tt);
                      const notYetOpen = !onSale && toDate(tt.saleStartDate) && new Date() < toDate(tt.saleStartDate);
                      const saleOpensOn = notYetOpen ? formatSaleDate(tt.saleStartDate, i18n.language || 'es') : null;
                      return (
                        <Col md={6} lg={4} key={tt.id} className="mb-4">
                          <Card
                            className={`ticket-card ${style.highlighted ? 'highlighted' : ''}`}
                            style={{
                              background: style.highlighted ? '#1e1e3a' : '#161625',
                              border: style.highlighted ? '2px solid #00BCD4' : '1px solid #2a2a4a',
                              borderRadius: '12px',
                              color: '#e0e0e0',
                              position: 'relative',
                              height: '100%',
                            }}
                          >
                            {style.badge && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '-12px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: '#FFD600',
                                  color: '#0A0F2E',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '3px 12px',
                                  borderRadius: '20px',
                                  whiteSpace: 'nowrap',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <BsStar aria-hidden="true" /> {style.badge}
                              </div>
                            )}
                            <Card.Body style={{ paddingTop: style.badge ? '24px' : undefined, display: 'flex', flexDirection: 'column' }}>
                              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.06em', marginBottom: '8px' }}>
                                {tt.name.toUpperCase()}
                              </h3>
                              <div style={{ marginBottom: '12px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#00BCD4' }}>
                                  {formatPrice(tt.price, tt.currency, i18n.language)}
                                </span>
                              </div>
                              {(() => {
                                // La descripción de la BD (migración 0011) ya dice
                                // explícitamente qué incluye y qué no, así que tiene
                                // prioridad. El texto i18n queda como respaldo para
                                // tipos sin descripción propia.
                                const descKey = TIER_DESCRIPTION_KEY[tt.tierCode];
                                const description = tt.description || (descKey ? t(descKey) : null);
                                if (!description) return null;
                                return (
                                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
                                    {description}
                                  </p>
                                );
                              })()}
                              {/* Desglose de entitlements: qué incluye y qué NO.
                                  Antes aquí había tres bullets fijos ("Full event access",
                                  "todas las sesiones", "material") más condicionales por
                                  `name.toLowerCase() === 'summit'`. Eso rompía con cualquier
                                  renombrado y afirmaba lo mismo para un Conference de 45 EUR
                                  que para un Summit de 200 EUR.
                                  Ahora sale de `tt.entitlements`, que expone la API. */}
                              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '16px', flex: 1 }}>
                                {entitlementBreakdown.map(({ code, i18nKey, included }) => (
                                  <li
                                    key={code}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '8px',
                                      marginBottom: '6px', fontSize: '0.85rem',
                                      color: included ? undefined : '#94a3b8'
                                    }}
                                  >
                                    {included
                                      ? <BsCheckCircleFill style={{ color: '#27ae60', flexShrink: 0 }} aria-hidden="true" />
                                      : <BsXCircle style={{ color: '#e74c3c', flexShrink: 0 }} aria-hidden="true" />}
                                    <span>{t(i18nKey)}</span>
                                  </li>
                                ))}
                                {/* Los workshops premium no se venden todavía (producto
                                    futuro): se muestran siempre como no incluidos para que
                                    nadie los dé por hecho. */}
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                  <BsXCircle style={{ color: '#e74c3c', flexShrink: 0 }} aria-hidden="true" />
                                  <span>{t('ticketModal.entitlements.workshops')}</span>
                                </li>
                              </ul>
                              <Button
                                variant={onSale ? style.ctaVariant : 'secondary'}
                                style={{ width: '100%', fontWeight: 600 }}
                                onClick={() => onSale && openCheckout(ev, tt)}
                                disabled={!onSale}
                              >
                                {onSale
                                  ? `${t('ticketModal.checkout.title')} ${tt.name}`
                                  : saleOpensOn
                                    ? t('ticketModal.saleOpensOn', { date: saleOpensOn })
                                    : t('ticketModal.saleClosed')}
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              ))}
            </Container>
          </Modal.Body>

          <Modal.Footer style={MODAL_FOOTER}>
            <Button variant="outline-secondary" onClick={handleHide}>
              {t('ticketModal.close')}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default TicketModal;
