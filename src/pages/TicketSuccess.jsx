import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Spinner, Card } from 'react-bootstrap';
import {
  BsApple, BsCalendarEvent, BsCheckCircleFill, BsDownload, BsEnvelope,
  BsGoogle, BsPhone,
} from 'react-icons/bs';
import { Link, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import SEO from '../components/SEO';
import { triskelGateClient } from '../adapters/triskelgate/client';

const TICKETS_BASE = (import.meta.env.VITE_TRISKELL_API_BASE_URL || 'https://triskelgate-api.greensea-3f1bb7ef.uksouth.azurecontainerapps.io').replace(/\/$/, '');

const TicketQr = ({ qrCode, ticketNumber, holderName }) => {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    if (!canvasRef.current || !qrCode) return;
    QRCode.toCanvas(canvasRef.current, qrCode, {
      width: 220,
      margin: 1,
      color: { dark: '#0A0F2E', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    }).then(() => {
      QRCode.toDataURL(qrCode, { width: 600, margin: 1 }).then(setDataUrl);
    }).catch((err) => console.error('QR render failed:', err));
  }, [qrCode]);

  const onDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `xops-ticket-${ticketNumber || 'qr'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="ticket-qr-card mx-auto mb-3" style={{ maxWidth: 320 }}>
      <Card.Body className="text-center">
        <div className="d-flex justify-content-center mb-3">
          <canvas ref={canvasRef} />
        </div>
        {ticketNumber && (
          <p className="mb-1" style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.06em' }}>
            {ticketNumber}
          </p>
        )}
        {holderName && <p className="text-muted small mb-3">{holderName}</p>}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onDownload}
          disabled={!dataUrl}
          aria-label="Download QR as PNG"
        >
          <BsDownload className="me-1" /> Descargar QR
        </Button>
      </Card.Body>
    </Card>
  );
};

const WalletButtons = ({ ticket, apiBase, walletStatus }) => {
  const handlers = {
    apple:   () => { window.location.href = `${apiBase}/api/tickets/${ticket.id}/apple-wallet`; },
    google:  async () => {
      const r = await fetch(`${apiBase}/api/tickets/${ticket.id}/google-wallet`);
      const data = await r.json();
      if (data?.url) window.open(data.url, '_blank', 'noopener');
    },
    samsung: () => { window.location.href = `${apiBase}/api/tickets/${ticket.id}/samsung-pass`; },
  };

  const buttons = [
    walletStatus.apple?.configured && (
      <Button key="apple" variant="dark" size="sm" onClick={handlers.apple}>
        <BsApple size={18} className="me-1" /> Apple Wallet
      </Button>
    ),
    walletStatus.google?.configured && (
      <Button key="google" variant="outline-secondary" size="sm" onClick={handlers.google}>
        <BsGoogle size={18} className="me-1" /> Google Wallet
      </Button>
    ),
    walletStatus.samsung?.configured && (
      <Button key="samsung" variant="outline-secondary" size="sm" onClick={handlers.samsung}>
        <BsPhone size={18} className="me-1" /> Samsung Pass
      </Button>
    ),
  ].filter(Boolean);

  if (buttons.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
      <small className="w-100 text-muted mb-1">Añadir a wallet</small>
      {buttons}
    </div>
  );
};

const TicketSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderNumber, setOrderNumber] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);
  const [polling, setPolling] = useState(!!sessionId);
  const [walletStatus, setWalletStatus] = useState({ apple: { configured: false }, google: { configured: false }, samsung: { configured: false } });

  // Probe which wallet integrations the backend has configured so we
  // only show the buttons that will actually work.
  useEffect(() => {
    let cancelled = false;
    fetch(`${TICKETS_BASE}/api/wallets/status`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.data) setWalletStatus(data.data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

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
          if (!cancelled) {
            setOrderNumber(data.orderNumber);
            if (Array.isArray(data.tickets) && data.tickets.length > 0) {
              setTicketsList(data.tickets);
            }
          }
        }
      } catch (_) {
        // network blip — keep polling
      } finally {
        attempts++;
        if (!cancelled && attempts < MAX_ATTEMPTS && ticketsList.length === 0) {
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
            <Col lg={8} className="text-center">
              <div className="success-icon-wrapper">
                <BsCheckCircleFill className="success-icon" />
              </div>

              <h1 className="success-title">¡Compra Confirmada!</h1>

              <p className="success-message">
                Gracias por tu compra. Hemos enviado los detalles de tu entrada a tu email.
              </p>

              {polling && ticketsList.length === 0 && (
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

              {ticketsList.length > 0 && (
                <div className="tickets-list mt-4">
                  <h3 className="mb-3">Tus entradas</h3>
                  {ticketsList.map((tk) => (
                    <div key={tk.id} className="mb-4">
                      <TicketQr
                        qrCode={tk.qrCode}
                        ticketNumber={tk.ticketNumber}
                        holderName={tk.holderName}
                      />
                      <WalletButtons ticket={tk} apiBase={TICKETS_BASE} walletStatus={walletStatus} />
                    </div>
                  ))}
                </div>
              )}

              <div className="next-steps mt-4">
                <h4>Próximos pasos</h4>
                <ul className="steps-list">
                  <li>
                    <BsCalendarEvent className="me-2" />
                    <span>Guarda el QR de arriba o añádelo a tu wallet</span>
                  </li>
                  <li>
                    <BsEnvelope className="me-2" />
                    <span>También te hemos enviado los detalles por email</span>
                  </li>
                </ul>

                <div className="cta-buttons mt-4">
                  <Link to="/">
                    <Button variant="primary">
                      Volver al evento
                    </Button>
                  </Link>
                  <Link to="/agenda">
                    <Button variant="outline-primary" className="ms-2">
                      Ver Agenda
                    </Button>
                  </Link>
                </div>

                <div className="contact-support mt-4">
                  <p>
                    ¿Tienes preguntas?{' '}
                    <a href="mailto:info@xopsconference.com">Contáctanos</a>
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TicketSuccess;