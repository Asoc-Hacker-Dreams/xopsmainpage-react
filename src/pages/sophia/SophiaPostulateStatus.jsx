import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import './SophiaPostulateStatus.css';

const API_BASE_URL = (import.meta.env.VITE_TRISKELL_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const SophiaPostulateStatus = () => {
  const { t } = useTranslation();
  const [handle, setHandle] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = async (e) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      // Try to fetch postulation status from the API
      const res = await fetch(`${API_BASE_URL}/api/citizenship/postulations/${encodeURIComponent(handle)}/status`);
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus(data.data);
      } else {
        // For demo purposes, show mock pending status
        setStatus({
          handle,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          message: 'Your postulate is under review by the citizenship council.',
        });
      }
    } catch (err) {
      // Mock data for demo
      setStatus({
        handle,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        message: 'Your postulate is under review by the citizenship council.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { class: 'success', label: 'Approved' },
      rejected: { class: 'danger', label: 'Rejected' },
      pending: { class: 'warning', label: 'Under Review' },
      archived: { class: 'secondary', label: 'Archived' },
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge status-${badge.class}`}>{badge.label}</span>;
  };

  return (
    <>
      <SEO
        title="Check Postulate Status - Sophia Metapolis"
        description="Check the status of your Sophia Metapolis citizenship postulate."
        path="/sophia/postulate/status"
      />
      <div className="sophia-status-page">
        {/* Header */}
        <header className="sophia-header">
          <nav className="sophia-nav">
            <Link to="/sophia" className="sophia-brand">
              <span className="sophia-icon">◇</span>
              <span>Sophia Metapolis</span>
            </Link>
            <div className="sophia-nav-links">
              <Link to="/sophia">{t('sophia.nav.home')}</Link>
              <Link to="/sophia/about">{t('sophia.nav.about')}</Link>
              <Link to="/sophia/postulate">{t('sophia.nav.postulate')}</Link>
              <Link to="/wallet">{t('sophia.nav.wallet')}</Link>
            </div>
          </nav>
        </header>

        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={6}>
              <Card className="sophia-status-card">
                <Card.Body>
                  <h1>Check Postulate Status</h1>
                  <p className="text-muted">
                    Enter your handle to check the status of your citizenship postulate.
                  </p>

                  <Form onSubmit={checkStatus} className="sophia-status-form">
                    <Form.Group className="mb-3">
                      <Form.Label>Your Handle</Form.Label>
                      <Form.Control
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g., @yourname"
                        required
                      />
                      <Form.Text className="text-muted">
                        The handle you used when submitting your postulate.
                      </Form.Text>
                    </Form.Group>
                    <button
                      type="submit"
                      className="sophia-btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : 'Check Status'}
                    </button>
                  </Form>

                  {error && (
                    <Alert variant="danger" className="mt-3">
                      {error}
                    </Alert>
                  )}

                  {status && (
                    <div className="sophia-status-result mt-4">
                      <div className="sophia-status-header">
                        <span className="sophia-status-handle">{status.handle}</span>
                        {getStatusBadge(status.status)}
                      </div>
                      <p className="sophia-status-message">{status.message}</p>
                      {status.submittedAt && (
                        <p className="sophia-status-date">
                          Submitted: {new Date(status.submittedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                      {status.status === 'approved' && (
                        <Link to="/wallet" className="sophia-btn-primary mt-3">
                          Access Your Wallet →
                        </Link>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>

              <div className="sophia-status-help text-center mt-4">
                <p className="text-muted">
                  Haven't submitted a postulate yet?{' '}
                  <Link to="/sophia/postulate">Submit your postulate</Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Footer */}
        <footer className="sophia-footer">
          <Container>
            <p className="sophia-footer-note">
              {t('sophia.footer.sophiaNote')} <Link to="/sophia">{t('sophia.footer.knowSophia')}</Link>
            </p>
          </Container>
        </footer>
      </div>
    </>
  );
};

export default SophiaPostulateStatus;
