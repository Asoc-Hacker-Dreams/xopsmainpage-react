import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { BsCheckCircleFill, BsStar, BsCalendar3, BsGeoAlt, BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { triskelGateClient } from '../adapters/triskelgate/client';

// Filter events to only show those belonging to the configured organizer (optional).
const CONFIG_ORGANIZER_ID = import.meta.env.VITE_TRISKELL_ORGANIZER_ID
  ? Number(import.meta.env.VITE_TRISKELL_ORGANIZER_ID)
  : null;

// Pricing tier visual config keyed by ticket name (case-insensitive)
const TIER_STYLE = {
  standard:  { badge: null,            ctaVariant: 'outline-primary', highlighted: false },
  business:  { badge: 'MÁS POPULAR',   ctaVariant: 'primary',         highlighted: true  },
  vip:       { badge: 'PREMIUM',       ctaVariant: 'warning',         highlighted: false },
};

const getTierStyle = (name) => TIER_STYLE[name?.toLowerCase()] ?? TIER_STYLE.standard;

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

const Tickets = () => {
  const [events, setEvents]             = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadError, setLoadError]       = useState(null);

  // Checkout modal
  const [showModal, setShowModal]         = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTT, setSelectedTT]       = useState(null);
  const [customerName, setCustomerName]   = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formError, setFormError]         = useState(null);
  const [purchasing, setPurchasing]       = useState(false);

  // Load all active events + their ticket types on mount
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const evList = await triskelGateClient.listEvents();
        if (cancelled) return;

        const active = evList.filter(
          (e) => e.status === 'active' &&
            (CONFIG_ORGANIZER_ID === null || e.organizerId === CONFIG_ORGANIZER_ID),
        );
        const withTT = await Promise.all(
          active.map(async (ev) => {
            try {
              const types = await triskelGateClient.listTicketTypes(ev.id);
              return { ...ev, ticketTypes: Array.isArray(types) ? types.filter((t) => t.isActive !== false) : [] };
            } catch {
              return { ...ev, ticketTypes: [] };
            }
          }),
        );

        if (!cancelled) setEvents(withTT);
      } catch (err) {
        if (!cancelled) setLoadError('No se pudieron cargar los eventos. Escríbenos a summit@xopsconferences.com.');
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

    if (!name)  { setFormError('Por favor introduce tu nombre completo.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Por favor introduce un email válido.');
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
        // {CHECKOUT_SESSION_ID} is a Stripe server-side template literal, not a JS template
        successUrl: `${window.location.origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl:  `${window.location.origin}/tickets`,
      });

      if (!data?.success) {
        throw new Error(data?.message || data?.error || 'No se pudo iniciar el pago');
      }

      setShowModal(false);
      window.location.href = data.sessionUrl || `${window.location.origin}/tickets/success`;
    } catch (err) {
      const isNetworkError =
        err.name === 'TypeError' ||
        (typeof err.message === 'string' &&
          (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')));
      setFormError(
        isNetworkError
          ? 'Sistema de entradas no disponible. Escríbenos a summit@xopsconferences.com.'
          : err.message,
      );
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <>
      <SEO
        title="Entradas - X-Ops Summit"
        description="Compra tu entrada para X-Ops Summit. Elige el evento y tipo de entrada."
        path="/tickets"
      />
      <div className="tickets-page">
        <Container>
          {/* Back link */}
          <Row className="mb-4">
            <Col>
              <Link to="/summit" className="back-link">
                <BsArrowLeft /> Volver al Summit
              </Link>
            </Col>
          </Row>

          {/* Header */}
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h1 className="tickets-page-title">Entradas X-Ops Summit</h1>
              <p className="tickets-page-subtitle">
                Elige el evento y la opción que mejor se adapte a tus necesidades
              </p>
              <div className="early-bird-banner">
                <BsStar className="early-bird-icon" />
                <span>EARLY BIRD: 20% de descuento hasta el 15 de Marzo</span>
              </div>
            </Col>
          </Row>

          {/* Loading / Error */}
          {loadingEvents && (
            <Row className="justify-content-center mb-5">
              <Col xs="auto" className="text-center">
                <Spinner animation="border" className="events-spinner" />
                <p className="mt-2 text-muted">Cargando eventos disponibles…</p>
              </Col>
            </Row>
          )}

          {loadError && (
            <Row className="justify-content-center mb-4">
              <Col lg={8}>
                <Alert variant="danger">{loadError}</Alert>
              </Col>
            </Row>
          )}

          {/* Event sections */}
          {events.map((ev) => (
            <div key={ev.id} className="event-section mb-5" data-event-id={ev.id}>
              {/* Event header */}
              <Row className="mb-3">
                <Col>
                  <h2 className="event-section-title">{ev.name}</h2>
                  <div className="event-meta">
                    {ev.startDate && (
                      <span className="event-meta-item">
                        <BsCalendar3 className="me-1" />
                        {formatDate(ev.startDate)}
                        {ev.endDate && ev.endDate !== ev.startDate && ` — ${formatDate(ev.endDate)}`}
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

              {/* Ticket type cards */}
              <Row className="justify-content-center">
                {ev.ticketTypes.length === 0 && (
                  <Col>
                    <p className="text-muted">No hay entradas disponibles para este evento.</p>
                  </Col>
                )}
                {ev.ticketTypes.map((tt) => {
                  const style = getTierStyle(tt.name);
                  return (
                    <Col md={6} lg={4} key={tt.id} className="mb-4">
                      <Card className={`ticket-card ${style.highlighted ? 'highlighted' : ''}`}>
                        {style.badge && (
                          <div className="ticket-badge">
                            <BsStar /> {style.badge}
                          </div>
                        )}
                        <Card.Body>
                          <h3 className="ticket-name">{tt.name.toUpperCase()}</h3>
                          <div className="ticket-price-container">
                            <span className="ticket-price">€{tt.price}</span>
                          </div>
                          {tt.description && (
                            <p className="ticket-description text-muted small">{tt.description}</p>
                          )}
                          <ul className="ticket-features">
                            <li><BsCheckCircleFill className="feature-check" /><span>Acceso completo al evento</span></li>
                            <li><BsCheckCircleFill className="feature-check" /><span>Todas las sesiones</span></li>
                            <li><BsCheckCircleFill className="feature-check" /><span>Material del evento</span></li>
                            {tt.name?.toLowerCase() !== 'standard' && (
                              <li><BsCheckCircleFill className="feature-check" /><span>Acceso área {tt.name}</span></li>
                            )}
                          </ul>
                          <Button
                            className={`ticket-cta ticket-cta-${style.ctaVariant.replace('outline-', 'outline-')}`}
                            variant={style.ctaVariant}
                            onClick={() => openModal(ev, tt)}
                          >
                            Comprar {tt.name}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          ))}

          {/* Contact */}
          {!loadingEvents && (
            <Row className="justify-content-center mt-4">
              <Col lg={6} className="text-center">
                <div className="tickets-contact">
                  <p>¿Necesitas factura o tienes dudas?</p>
                  <a href="mailto:summit@xopsconferences.com" className="contact-link">
                    summit@xopsconferences.com
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
              ? `${selectedTT.name.toUpperCase()} — €${selectedTT.price}`
              : 'Comprar Entrada'}
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
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: María García"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="tu@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Form.Text className="text-muted">Recibirás tu entrada en este email.</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={purchasing}>
              {purchasing ? <Spinner size="sm" /> : 'Continuar al Pago'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Tickets;
