import React, { useState, useEffect } from 'react';
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
import { BsCheckCircleFill, BsStar, BsCalendar3, BsGeoAlt, BsArrowLeft } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { triskelGateClient } from '../adapters/triskelgate/client';

const CONFIG_ORGANIZER_ID = import.meta.env.VITE_TRISKELL_ORGANIZER_ID
  ? Number(import.meta.env.VITE_TRISKELL_ORGANIZER_ID)
  : null;

const TIER_STYLE = {
  standard: { badge: null,          ctaVariant: 'outline-primary', highlighted: false },
  business: { badge: 'MÁS POPULAR', ctaVariant: 'primary',         highlighted: true  },
  vip:      { badge: 'PREMIUM',     ctaVariant: 'warning',         highlighted: false },
};

const getTierStyle = (name) => TIER_STYLE[name?.toLowerCase()] ?? TIER_STYLE.standard;

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const MODAL_HEADER = { background: '#1a1a2e', borderBottom: '2px solid #00BCD4' };
const MODAL_BODY   = { background: '#0f0f1a', color: '#e0e0e0' };
const MODAL_FOOTER = { background: '#1a1a2e', borderTop: '1px solid #2a2a4a' };
const INPUT_STYLE  = { background: '#1e1e3a', border: '1px solid #2a2a4a', color: '#f8fafc' };

const TicketModal = ({ show, onHide }) => {
  const { t } = useTranslation();

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
            (CONFIG_ORGANIZER_ID === null || e.organizerId === CONFIG_ORGANIZER_ID),
        );

        const withTT = await Promise.all(
          active.map(async (ev) => {
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
        cancelUrl:  `${window.location.origin}/tickets`,
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
              {selectedTT && <span style={{ color: '#64748b', fontWeight: 400 }}>€{selectedTT.price}</span>}
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
                    <Alert variant="danger">{loadError}</Alert>
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
                            {formatDate(ev.startDate)}
                            {ev.endDate && ev.endDate !== ev.startDate && ` — ${formatDate(ev.endDate)}`}
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
                    {ev.ticketTypes.map((tt) => {
                      const style = getTierStyle(tt.name);
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
                                  €{tt.price}
                                </span>
                              </div>
                              {tt.description && (
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
                                  {tt.description}
                                </p>
                              )}
                              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '16px', flex: 1 }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                                  <BsCheckCircleFill style={{ color: '#27ae60', flexShrink: 0 }} aria-hidden="true" />
                                  <span>{t('ticketModal.features.fullAccess')}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                                  <BsCheckCircleFill style={{ color: '#27ae60', flexShrink: 0 }} aria-hidden="true" />
                                  <span>{t('ticketModal.features.allSessions')}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                                  <BsCheckCircleFill style={{ color: '#27ae60', flexShrink: 0 }} aria-hidden="true" />
                                  <span>{t('ticketModal.features.eventMaterial')}</span>
                                </li>
                                {tt.name?.toLowerCase() !== 'standard' && (
                                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                    <BsCheckCircleFill style={{ color: '#27ae60', flexShrink: 0 }} aria-hidden="true" />
                                    <span>{t('ticketModal.features.areaAccess', { tier: tt.name })}</span>
                                  </li>
                                )}
                              </ul>
                              <Button
                                variant={style.ctaVariant}
                                style={{ width: '100%', fontWeight: 600 }}
                                onClick={() => openCheckout(ev, tt)}
                              >
                                {t('ticketModal.checkout.title')} {tt.name}
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              ))}

              {!loadingEvents && (
                <Row className="justify-content-center mt-2 mb-2">
                  <Col lg={6} className="text-center">
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {t('ticketModal.contact')}{' '}
                      <a
                        href={`mailto:${t('ticketModal.contactEmail')}`}
                        style={{ color: '#00BCD4', textDecoration: 'none' }}
                      >
                        {t('ticketModal.contactEmail')}
                      </a>
                    </p>
                  </Col>
                </Row>
              )}
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
