import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMicrophoneAlt, FaShieldAlt } from 'react-icons/fa';
import SEO from '../../components/SEO';
import './XOpsHome.css';

const XOpsHome = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="X-Ops Conference Dubai 2026 - The Premier Tech Leadership Event"
        description="Join the premier X-Ops Conference in Dubai 2026. CTOs, CISOs, and tech leaders converging for 3 days of strategy, networking, and innovation."
        path="/events/x-ops-conference-dubai-2026"
      />
      <div className="xops-home">
        {/* Hero Section */}
        <section className="xops-hero">
          <div className="xops-hero-bg">
            <div className="xops-hero-overlay" />
          </div>
          <Container className="xops-hero-content">
            <Row className="justify-content-center text-center">
              <Col lg={10}>
                <span className="xops-hero-badge">October 15-17, 2026</span>
                <h1 className="xops-hero-title">
                  X-Ops Conference<br />Dubai 2026
                </h1>
                <p className="xops-hero-subtitle">
                  The premier gathering for CTOs, CISOs, and technology leaders.<br />
                  Three days of strategic insights, high-level networking, and cutting-edge content.
                </p>
                <div className="xops-hero-cta">
                  <Link to="/events/x-ops-conference-dubai-2026/buy" className="xops-btn-primary">
                    {t('tickets.event.buyNow')}
                  </Link>
                  <Link to="/events/x-ops-conference-dubai-2026" className="xops-btn-outline">
                    {t('tickets.event.viewDetails')}
                  </Link>
                </div>
                <div className="xops-hero-meta">
                  <span><FaMapMarkerAlt /> Dubai, UAE</span>
                  <span><FaCalendarAlt /> Oct 15-17, 2026</span>
                  <span><FaUsers /> 500+ Leaders</span>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Event Highlights */}
        <section className="xops-highlights">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2 className="xops-section-title">Why X-Ops Dubai?</h2>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="mb-4">
                <Card className="xops-highlight-card">
                  <Card.Body>
                    <div className="xops-highlight-icon"><FaMicrophoneAlt /></div>
                    <h3>Elite Speakers</h3>
                    <p>Keynotes from Fortune 500 CTOs and global tech visionaries shaping the future of operations.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="xops-highlight-card">
                  <Card.Body>
                    <div className="xops-highlight-icon"><FaShieldAlt /></div>
                    <h3>Security First</h3>
                    <p>DevSecOps, zero-trust architectures, and cyber resilience strategies from industry experts.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="xops-highlight-card">
                  <Card.Body>
                    <div className="xops-highlight-icon"><FaUsers /></div>
                    <h3>Executive Networking</h3>
                    <p>Curated networking sessions with 500+ technology leaders from across the Middle East and beyond.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Ticket CTA */}
        <section className="xops-ticket-cta">
          <Container>
            <Row className="align-items-center">
              <Col md={8}>
                <h2>Secure Your Place at X-Ops Dubai 2026</h2>
                <p>Early bird pricing available. Join the waitlist for priority access.</p>
              </Col>
              <Col md={4} className="text-md-end">
                <Link to="/events/x-ops-conference-dubai-2026/buy" className="xops-btn-primary">
                  {t('tickets.event.buyTickets')}
                </Link>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Sophia Footer Note */}
        <section className="xops-sophia-note">
          <Container>
            <p className="text-center">
              X-Ops Conference es una iniciativa de <Link to="/sophia">Sophia Metapolis</Link>. Conoce la nación digital.
            </p>
          </Container>
        </section>
      </div>
    </>
  );
};

export default XOpsHome;
