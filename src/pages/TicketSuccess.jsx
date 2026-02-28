import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BsCheckCircleFill, BsCalendarEvent, BsEnvelope } from 'react-icons/bs';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';

const TicketSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const email = searchParams.get('email');

  return (
    <>
      <SEO
        title="Compra Confirmada - X-Ops Summit"
        description="Tu compra de entrada ha sido confirmada."
        path="/tickets/success"
      />
      <div className="ticket-success-page">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <div className="success-icon-wrapper">
                <BsCheckCircleFill className="success-icon" />
              </div>
              
              <h1 className="success-title">¡Compra Confirmada!</h1>
              
              <p className="success-message">
                Gracias por tu compra. Hemos enviado los detalles de tu entrada a tu email.
              </p>

              {orderId && (
                <div className="order-details">
                  <p className="order-label">Número de pedido:</p>
                  <p className="order-id">{orderId}</p>
                </div>
              )}

              {email && (
                <div className="email-notice">
                  <BsEnvelope className="me-2" />
                  <span>Enviado a: {email}</span>
                </div>
              )}

              <div className="next-steps">
                <h4>Próximos pasos</h4>
                <ul className="steps-list">
                  <li>
                    <BsCalendarEvent className="me-2" />
                    <span>Revisa tu email para ver los detalles de tu entrada</span>
                  </li>
                  <li>
                    <BsEnvelope className="me-2" />
                    <span>Te enviaremos actualizaciones sobre el evento</span>
                  </li>
                </ul>
              </div>

              <div className="success-actions mt-4">
                <Link to="/summit">
                  <Button variant="primary" className="me-3">
                    Volver al Summit
                  </Button>
                </Link>
                <Link to="/agenda">
                  <Button variant="outline-primary">
                    Ver Agenda
                  </Button>
                </Link>
              </div>

              <div className="contact-support mt-4">
                <p>
                  ¿Tienes preguntas?{' '}
                  <a href="mailto:summit@xopsconferences.com">Contáctanos</a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TicketSuccess;
