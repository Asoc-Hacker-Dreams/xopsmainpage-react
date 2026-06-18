import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { BsCheckCircleFill, BsCalendarEvent, BsEnvelope } from 'react-icons/bs';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { triskelGateClient } from '../adapters/triskelgate/client';

const TicketSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderNumber, setOrderNumber] = useState(null);
  const [polling, setPolling] = useState(!!sessionId);

  useEffect(() => {
    if (!sessionId || sessionId === '{CHECKOUT_SESSION_ID}') {
      setPolling(false);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 15;

    const poll = async () => {
      try {
        const data = await triskelGateClient.getCheckoutSessionStatus(sessionId);
        if (data?.success && data.orderNumber) {
          if (!cancelled) setOrderNumber(data.orderNumber);
        }
      } catch (_) {
        // fire-and-forget — success page shows regardless
      } finally {
        attempts++;
        if (!cancelled && !orderNumber && attempts < MAX_ATTEMPTS) {
          setTimeout(poll, 2000);
        } else if (!cancelled) {
          setPolling(false);
        }
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  useEffect(() => {
    if (orderNumber) setPolling(false);
  }, [orderNumber]);

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

              {polling && (
                <div className="order-details">
                  <Spinner size="sm" className="me-2" />
                  <span className="text-muted">Confirmando pedido...</span>
                </div>
              )}

              {orderNumber && (
                <div className="order-details">
                  <p className="order-label">Número de pedido:</p>
                  <p className="order-id">{orderNumber}</p>
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
