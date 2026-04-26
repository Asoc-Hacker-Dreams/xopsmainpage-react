import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { BsCheckCircleFill, BsStar, BsBriefcase, BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

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
    cta: 'Comprar Ahora',
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
    cta: 'Comprar VIP',
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

const Tickets = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const getTicketTypeId = async (eventId, apiName) => {
    const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/ticket-types`);
    const data = await res.json();

    if (!res.ok || !data?.success || !Array.isArray(data.data)) {
      throw new Error('No se pudieron cargar tipos de ticket desde TriskellGate');
    }

    const match = data.data.find(
      (t) => (t?.name || '').toLowerCase() === apiName.toLowerCase() && t?.isActive,
    );

    if (!match) {
      throw new Error(`No existe ticket activo "${apiName}" en evento ${eventId}`);
    }

    return match.id;
  };

  const handlePayment = async (tier) => {
    if (tier.id === 'partner') {
      window.location.href = 'mailto:summit@xopsconferences.com?subject=Partner Ticket Inquiry';
      return;
    }

    // Prompt for customer data
    const customerName = window.prompt('Nombre completo para la reserva:');
    if (!customerName) return;

    const customerEmail = window.prompt('Email para recibir los tickets:');
    if (!customerEmail) return;

    setLoading(tier.id);
    setError(null);

    try {
      const ticketTypeId = await getTicketTypeId(CONFIG_EVENT_ID, tier.apiName);

      const payload = {
        eventId: CONFIG_EVENT_ID,
        ticketTypeId,
        quantity: 1,
        customerEmail,
        customerName,
        successUrl: `${window.location.origin}/tickets/success`,
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

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        alert('Reserva creada en modo prueba. Revisa backend para confirmar orden.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <SEO
        title="Entradas - X-Ops Summit"
        description="Compra tu entrada para X-Ops Summit. Elige entre Executive, VIP o Partner."
        path="/tickets"
      />
      <div className="tickets-page">
        <Container>
          {/* Back Link */}
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
                Elige la opción que mejor se adapte a tus necesidades
              </p>
              <div className="early-bird-banner">
                <BsStar className="early-bird-icon" />
                <span>EARLY BIRD: 20% de descuento hasta el 15 de Marzo</span>
              </div>
            </Col>
          </Row>

          {/* Error Alert */}
          {error && (
            <Row className="justify-content-center mb-4">
              <Col lg={8}>
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              </Col>
            </Row>
          )}

          {/* Ticket Cards */}
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
                      {tier.originalPrice && (
                        <span className="ticket-original-price">€{tier.originalPrice}</span>
                      )}
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
                      onClick={() => handlePayment(tier)}
                      disabled={loading === tier.id}
                    >
                      {loading === tier.id ? <Spinner size="sm" /> : tier.cta}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Guarantee */}
          <Row className="justify-content-center mt-4">
            <Col lg={8} className="text-center">
              <p className="tickets-guarantee">
                <BsBriefcase /> Garantía de satisfacción: si no quedas satisfecho después del
                primer día, te devolvemos el 100% de tu entrada.
              </p>
            </Col>
          </Row>

          {/* Contact */}
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

          {/* Sophia Footer Note */}
          <Row className="justify-content-center mt-5">
            <Col lg={8} className="text-center">
              <p className="tickets-sophia-note">
                X-Ops Conference es una iniciativa de <Link to="/sophia">Sophia Metapolis</Link>. Conoce la nación digital.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Tickets;
