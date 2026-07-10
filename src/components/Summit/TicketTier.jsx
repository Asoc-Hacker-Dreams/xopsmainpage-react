import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { BsCheckCircleFill, BsStar, BsBriefcase } from 'react-icons/bs';

const API_BASE_URL = (import.meta.env.VITE_TRISKELL_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');
const CONFIG_EVENT_ID = Number(import.meta.env.VITE_TRISKELL_EVENT_ID || 1);

const ticketTiers = [
  {
    id: 'executive',
    apiName: 'General',
    name: 'EXECUTIVE',
    price: '299',
    originalPrice: '375',
    features: [
      '2 días de acceso completo',
      'Todas las sesiones',
      'Coffee breaks premium',
      'Almuerzos ejecutivos',
      'Certificado de asistencia',
      'Material del evento',
    ],
    highlighted: false,
    cta: 'Reservar',
    ctaStyle: 'secondary',
  },
  {
    id: 'vip',
    apiName: 'VIP',
    name: 'VIP PASS',
    price: '499',
    originalPrice: '625',
    features: [
      'Todo lo de Executive, más:',
      'VIP Welcome Pack',
      'Asiento prioritario',
      'Acceso VIP Lounge',
      'Sesión privada con speakers',
      'Foto profesional del evento',
    ],
    highlighted: true,
    badge: 'RECOMENDADO',
    cta: 'Reservar VIP',
    ctaStyle: 'primary',
  },
  {
    id: 'partner',
    name: 'PARTNER',
    price: '999',
    originalPrice: '1250',
    features: [
      'Todo lo de VIP, más:',
      'Cena de Gala exclusiva',
      'Reuniones 1-a-1',
      'Logo en web y materiales',
      '5 min Demo slot',
      '2 entradas adicionales',
    ],
    highlighted: false,
    cta: 'Contactar',
    ctaStyle: 'outline',
  },
];

const TicketTier = () => {
  const [loading, setLoading] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [pendingTier, setPendingTier] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [formError, setFormError] = useState(null);

  const getTicketTypeId = async (eventId, apiName) => {
    const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/ticket-types`);
    const data = await res.json();

    if (!res.ok || !data?.success || !Array.isArray(data.data)) {
      throw new Error('No se pudieron cargar tipos de ticket desde Triskel Gate');
    }

    const match = data.data.find(
      (t) => (t?.name || '').toLowerCase() === apiName.toLowerCase() && t?.isActive,
    );

    if (!match) {
      throw new Error(`No existe ticket activo "${apiName}" en evento ${eventId}`);
    }

    return match.id;
  };

  const openCheckout = (tier) => {
    if (tier.id === 'partner') {
      window.location.href = 'mailto:info@xopsconference.com';
      return;
    }
    setPendingTier(tier);
    setCustomerName('');
    setCustomerEmail('');
    setFormError(null);
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setPendingTier(null);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const name = customerName.trim();
    const email = customerEmail.trim();

    if (!name) { setFormError('Por favor, introduce tu nombre completo.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Por favor, introduce un email válido.');
      return;
    }

    setLoading(pendingTier.id);
    setFormError(null);

    try {
      const ticketTypeId = await getTicketTypeId(CONFIG_EVENT_ID, pendingTier.apiName);

      const payload = {
        eventId: CONFIG_EVENT_ID,
        ticketTypeId,
        quantity: 1,
        customerEmail: email,
        customerName: name,
        successUrl: `${window.location.origin}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/tickets`,
      };

      const response = await fetch(`${API_BASE_URL}/api/payment/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || data?.error || 'No se pudo iniciar el pago');
      }

      setShowCheckout(false);
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      setFormError(`Error al iniciar el pago: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="summit-tickets" id="tickets">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Tipos de Entrada</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {ticketTiers.map((tier) => (
            <Col md={6} lg={4} key={tier.id} className="mb-4">
              <Card className={`ticket-card ${tier.highlighted ? 'highlighted' : ''}`}>
                {tier.badge && (
                  <div className="ticket-badge">
                    <BsStar /> {tier.badge}
                  </div>
                )}
                <Card.Body>
                  <h3 className="ticket-name">{tier.name}</h3>
                  <div className="ticket-price-container">
                    {tier.originalPrice && <span className="ticket-original-price">€{tier.originalPrice}</span>}
                    <span className="ticket-price">€{tier.price}</span>
                  </div>
                  <ul className="ticket-features">
                    {tier.features.map((feature, index) => (
                      <li key={index}>
                        <BsCheckCircleFill className="feature-check" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`ticket-cta ticket-cta-${tier.ctaStyle}`}
                    onClick={() => openCheckout(tier)}
                    disabled={loading === tier.id}
                  >
                    {loading === tier.id ? <Spinner size="sm" /> : tier.cta}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <p className="tickets-guarantee">
              <BsBriefcase /> Garantía de satisfacción: si no quedas satisfecho después del primer día, te devolvemos el
              100% de tu entrada.
            </p>
          </Col>
        </Row>

      </Container>

      <Modal show={showCheckout} onHide={closeCheckout} centered>
        <Modal.Header
          closeButton
          style={{ background: '#1a1a2e', borderBottom: '2px solid #00BCD4' }}
        >
          <Modal.Title style={{ color: '#ffffff', fontWeight: 700 }}>
            {pendingTier
              ? `${pendingTier.name} — €${pendingTier.price}`
              : 'Reserva tu entrada'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCheckoutSubmit} noValidate>
          <Modal.Body style={{ background: '#0f0f1a', color: '#e0e0e0' }}>
            {formError && (
              <Alert variant="danger" role="alert" onClose={() => setFormError(null)} dismissible>
                {formError}
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="tt-name" style={{ color: '#ccc' }}>
                Nombre completo <span aria-hidden="true">*</span>
              </Form.Label>
              <Form.Control
                id="tt-name"
                type="text"
                placeholder="Tu nombre completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                autoFocus
                style={{ background: '#1e1e3a', border: '1px solid #2a2a4a', color: '#fff' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="tt-email" style={{ color: '#ccc' }}>
                Email <span aria-hidden="true">*</span>
              </Form.Label>
              <Form.Control
                id="tt-email"
                type="email"
                placeholder="tu@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                style={{ background: '#1e1e3a', border: '1px solid #2a2a4a', color: '#fff' }}
              />
              <Form.Text style={{ color: '#888' }}>Recibirás tus entradas en este email.</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ background: '#1a1a2e', borderTop: '1px solid #2a2a4a' }}>
            <Button variant="outline-secondary" onClick={closeCheckout}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading !== null}
              style={{ background: '#00BCD4', border: 'none', fontWeight: 600 }}
            >
              {loading !== null ? <Spinner size="sm" /> : 'Confirmar y pagar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </section>
  );
};

export default TicketTier;
